/* ============================================================
   NEOMS~DATABASE — ARCHIVE SHELL  (archive.html)
   Full-screen "Archive HUD" layout, after AcademicOS: a top tab
   nav, one pane per section, a live HUD sidebar, and a dossier
   viewer for entity files.

   Each section loads windows/<type>/<type>.{html,css,js} into
   its pane. So openWin('x')
   from any module just switches to that tab.

   Load order: data files → db-common.js → this → desktop-core.js
   ============================================================ */
"use strict";

var WIN_BASE = "../../Neoms~Database/windows/";

/* Session + clearance globals (set by desktop-core.js) */
var sessionpersonnel = null;
var userClearance = 1;

/* Sections, in nav order. clr = clearance needed (same as desktop) */
var ARC_TABS = [
  { type: "main", label: "Log", title: "Containment Log", clr: 1 },
  { type: "entities", label: "Entities", title: "Entity Registry", clr: 3 },
  { type: "personnel", label: "Personnel", title: "Personnel Records", clr: 3 },
  { type: "worldmap", label: "Map", title: "Global Facility Map", clr: 1 },
  { type: "schemes", label: "Schemes", title: "Classification Schemes", clr: 2 },
  { type: "terminal", label: "Terminal", title: "NeoMS Terminal", clr: 4 },
  { type: "entitycreator", label: "Creator", title: "Entity Creator", clr: 4 },
  /* Reached from the Creator tab's switch; borrows the Entity Creator's styles */
  { type: "personnelcreator", label: "Creator", title: "Personnel Creator", clr: 4, parent: "entitycreator", css: ["entitycreator"] }
];

/* Tabs shown in the nav (sub-sections like the Personnel Creator live under a parent) */
function arcNavTabs() {
  return ARC_TABS.filter(function (t) {
    return !t.parent;
  });
}

var arcCurrent = null;
var arcLoaded = {};

function arcTab(type) {
  return ARC_TABS.filter(function (t) {
    return t.type === type;
  })[0];
}

/* ── MODULE LOADER (same contract as window-manager.js) ──────── */
function arcLoadModule(bodyId, winType, data) {
  var htmlUrl = WIN_BASE + winType + "/" + winType + ".html";
  fetch(htmlUrl)
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(function (html) {
      var body = document.getElementById("wbody_" + bodyId);
      if (!body) return;
      body.innerHTML = html;

      /* Its own stylesheet, plus any it borrows (tab.css) */
      var tab = arcTab(winType);
      ((tab && tab.css) || []).concat(winType).forEach(function (type) {
        var cssId = "wincss_" + type;
        if (document.getElementById(cssId)) return;
        var lnk = document.createElement("link");
        lnk.id = cssId;
        lnk.rel = "stylesheet";
        lnk.href = WIN_BASE + type + "/" + type + ".css";
        /* Before archive.css so the Archive theme still wins */
        var theme = document.querySelector('link[href$="archive.css"]');
        document.head.insertBefore(lnk, theme);
      });

      return fetch(WIN_BASE + winType + "/" + winType + ".js")
        .then(function (r2) {
          if (!r2.ok) throw new Error("HTTP " + r2.status);
          return r2.text();
        })
        .then(function (js) {
          new Function(
            "winId", "winData", "ENTITIES", "personnel", "SITES", "DEPTS", "CLS_LABELS",
            "sessionpersonnel", "userClearance", "openWin", "closeWin", "termPrint", "termRun",
            js
          )(
            bodyId,
            data,
            typeof ENTITIES !== "undefined" ? ENTITIES : [],
            typeof personnel !== "undefined" ? personnel : [],
            typeof SITES !== "undefined" ? SITES : [],
            typeof DEPTS !== "undefined" ? DEPTS : {},
            typeof CLS_LABELS !== "undefined" ? CLS_LABELS : {},
            sessionpersonnel,
            userClearance,
            openWin,
            closeWin,
            termPrint,
            termRun
          );
        });
    })
    .catch(function (err) {
      var body = document.getElementById("wbody_" + bodyId);
      if (body)
        body.innerHTML =
          '<p class="arc-err">SECTION UNAVAILABLE<br><span>' + escHtml(err.message) + "</span></p>";
    });
}

/* ── PANES ───────────────────────────────────────────────────── */
/* Create a section's pane on first use (the module loads once) */
function arcEnsurePane(type) {
  var pane = document.getElementById("wbody_" + type);
  if (!arcLoaded[type] || !pane) {
    var tab = arcTab(type);
    pane = document.createElement("section");
    pane.className = "arc-pane arc-pane--" + type;
    pane.id = "wbody_" + type;
    pane.setAttribute("aria-label", tab.title);
    pane.innerHTML = '<p class="arc-loading">Loading&#8230;</p>';
    document.getElementById("arc-panes").appendChild(pane);
    arcLoaded[type] = true;
    arcLoadModule(type, type);
  }
  pane.classList.toggle("arc-pane--pinned", type === arcPinned);
  return pane;
}

/* Show the current pane, plus the pinned one in split view */
function arcShowPanes() {
  document.querySelectorAll("#arc-panes .arc-pane").forEach(function (p) {
    p.hidden = p.id !== "wbody_" + arcCurrent && p.id !== "wbody_" + arcPinned;
  });
}

function arcRenderChips() {
  var tab = arcTab(arcCurrent);
  if (!tab) return;
  var pinTab = arcPinned && arcTab(arcPinned);
  var navTabs = arcNavTabs();
  document.getElementById("arc-chips").innerHTML =
    '<span class="arc-chip on">CLR-' + tab.clr + "</span>" +
    '<span class="arc-chip">' + String(navTabs.indexOf(arcTab(tab.parent || tab.type)) + 1).padStart(2, "0") + " / " +
    String(navTabs.length).padStart(2, "0") + "</span>" +
    '<button type="button" class="arc-chip arc-pin" id="arc-pin" title="' +
    (pinTab ? "Close the side panel" : "Keep this section open on the right while you browse others") + '">' +
    (pinTab ? "&#10005; Unpin " + escHtml(pinTab.title) : "&#8677; Pin to side") +
    "</button>";
}

/* ── SPLIT VIEW ──────────────────────────────────────────────── */
/* Pin a section to the right half; the left half keeps navigating */
var arcPinned = null;
var arcPrev = null;

function arcPin(type) {
  arcPinned = type;
  document.getElementById("arc-panes").classList.add("split");
  arcEnsurePane(type);

  /* Fill the left side with the previous section, else the Log */
  var left = arcPrev && arcPrev !== type ? arcTab(arcPrev) : null;
  if (!left || userClearance < left.clr) left = arcTab(type === "main" ? "worldmap" : "main");
  openWin(left.type);
  window.dispatchEvent(new Event("resize"));
}

function arcUnpin() {
  if (!arcPinned) return;
  var pane = document.getElementById("wbody_" + arcPinned);
  if (pane) pane.classList.remove("arc-pane--pinned");
  arcPinned = null;
  document.getElementById("arc-panes").classList.remove("split");
  arcShowPanes();
  arcRenderChips();
  window.dispatchEvent(new Event("resize"));
}

document.addEventListener("click", function (e) {
  if (!e.target.closest || !e.target.closest("#arc-pin")) return;
  if (arcPinned) arcUnpin();
  else arcPin(arcCurrent);
});

/* ── OPEN / CLOSE (the API window modules call) ──────────────── */
function openWin(type, data) {
  /* Entity files open in the secured viewer (JS/term-fs.js) */
  if (type === "entity" && data !== undefined) {
    var ent = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (e) { return e.id === data; })[0];
    if (ent && typeof termViewer === "function") termViewer("E-" + String(ent.id).padStart(4, "0"), nvEntityDoc(ent));
    return;
  }

  var tab = arcTab(type);
  if (!tab) return;

  if (userClearance < tab.clr) {
    toast("CL-" + tab.clr + " REQUIRED");
    termPrint(tab.title.toUpperCase() + " requires CL-" + tab.clr + ". Current: CL-" + userClearance + ".", "err");
    return;
  }

  /* Opening the pinned section from the nav brings it back full width */
  if (type === arcPinned) arcUnpin();

  arcEnsurePane(type);
  if (arcCurrent && arcCurrent !== type) arcPrev = arcCurrent;
  arcCurrent = type;
  arcShowPanes();

  document.getElementById("arc-panetab").textContent = tab.title;
  arcRenderChips();
  arcRenderNav();

  /* The map draws to its container size — nudge it after showing */
  if (type === "worldmap") window.dispatchEvent(new Event("resize"));
  if (type === "terminal") {
    var inp = document.getElementById("term-in");
    if (inp) inp.focus();
  }
}

/* Panes are built with the clearance at load time, so drop the cached
   ones and rebuild the visible one. The terminal and creator keep their
   state (scrollback, half-filled forms). */
var ARC_KEEP_ON_CLR = ["terminal", "entitycreator", "personnelcreator"];

function arcRefreshPanes() {
  Object.keys(arcLoaded).forEach(function (type) {
    if (ARC_KEEP_ON_CLR.indexOf(type) !== -1) return;
    var pane = document.getElementById("wbody_" + type);
    if (pane) pane.remove();
    delete arcLoaded[type];
  });
  if (arcPinned) {
    var pinTab = arcTab(arcPinned);
    if (pinTab && userClearance >= pinTab.clr) arcEnsurePane(arcPinned);
    else arcUnpin();
  }
  if (!arcCurrent) return;
  var tab = arcTab(arcCurrent);
  if (tab && userClearance >= tab.clr) {
    openWin(arcCurrent);
  } else {
    openWin("main");
  }
}

/* Desktop-only actions — nothing to do in a single-page layout */
function closeWin() {}
function focusWin() {}
function minWin() {}
function maxWin() {}

/* ── TOP NAV ─────────────────────────────────────────────────── */
function arcRenderNav() {
  var nav = document.getElementById("arc-nav");
  var cur = arcTab(arcCurrent);
  var curNav = cur && cur.parent ? cur.parent : arcCurrent;
  nav.innerHTML = arcNavTabs().map(function (t) {
    var locked = userClearance < t.clr;
    return (
      '<a href="#' + t.type + '" data-type="' + t.type + '"' +
      (t.type === curNav ? ' aria-current="page"' : "") +
      (locked ? ' class="locked" title="Requires CL-' + t.clr + '"' : "") +
      ">" + t.label +
      (locked ? ' <img class="lock-icon" src="../../Neoms~Universal-Fonts+Images/Icons/DB_Icons/Warning_Blue.png" alt="(locked)" />' : "") +
      "</a>"
    );
  }).join("");
}

document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("#arc-nav a");
  if (!a) return;
  e.preventDefault();
  openWin(a.getAttribute("data-type"));
});

/* ── Entity tracker (inside the containment ring) ───────────────
   The visitor is the centre. Each blip sits at the real compass
   bearing from the visitor to that entity's site, nearer the edge
   the further away it is. Blips flash as the sweep passes; hover /
   focus names the entity, click opens its file. Above your
   clearance: an unknown signal.

   "Where the site thinks you're from" comes from the device's time
   zone only (no permission prompt, nothing sent anywhere). */
var ARC_SWEEP_S = 4; /* one sweep turn, seconds — matches the CSS */

/* A few well-known zones whose city isn't near the zone's default
   latitude; everything else uses the continent + UTC offset. */
var ARC_TZ = {
  "America/Sao_Paulo": [-23.5, -46.6], "America/Argentina/Buenos_Aires": [-34.6, -58.4], "America/Buenos_Aires": [-34.6, -58.4],
  "America/Santiago": [-33.4, -70.6], "America/Lima": [-12, -77], "America/Bogota": [4.7, -74.1], "America/Mexico_City": [19.4, -99.1],
  "America/Anchorage": [61.2, -149.9], "Pacific/Honolulu": [21.3, -157.9], "America/Chicago": [41.9, -87.6], "America/New_York": [40.7, -74],
  "America/Los_Angeles": [34.1, -118.2], "America/Denver": [39.7, -105], "America/Phoenix": [33.4, -112.1], "America/Toronto": [43.7, -79.4],
  "America/Vancouver": [49.3, -123.1], "Europe/London": [51.5, -0.1], "Europe/Paris": [48.9, 2.4], "Europe/Berlin": [52.5, 13.4],
  "Europe/Madrid": [40.4, -3.7], "Europe/Rome": [41.9, 12.5], "Europe/Moscow": [55.8, 37.6], "Europe/Istanbul": [41, 29],
  "Africa/Cairo": [30, 31.2], "Africa/Lagos": [6.5, 3.4], "Africa/Johannesburg": [-26.2, 28], "Africa/Nairobi": [-1.3, 36.8],
  "Asia/Dubai": [25.2, 55.3], "Asia/Kolkata": [22.6, 88.4], "Asia/Calcutta": [22.6, 88.4], "Asia/Shanghai": [31.2, 121.5],
  "Asia/Singapore": [1.35, 103.8], "Asia/Manila": [14.6, 121], "Asia/Jakarta": [-6.2, 106.8], "Asia/Seoul": [37.6, 127],
  "Asia/Tokyo": [35.7, 139.7], "Australia/Sydney": [-33.9, 151.2], "Australia/Melbourne": [-37.8, 145], "Australia/Perth": [-31.9, 115.9],
  "Pacific/Auckland": [-36.8, 174.8]
};
var ARC_TZ_LAT = { America: 38, Europe: 50, Asia: 30, Africa: 5, Australia: -30, Pacific: -15, Atlantic: 40, Indian: -10, Antarctica: -75 };

function arcOrigin() {
  var tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {}
  var city = (tz.split("/").pop() || "UTC").replace(/_/g, " ");
  if (ARC_TZ[tz]) return { lat: ARC_TZ[tz][0], lng: ARC_TZ[tz][1], label: city, tz: tz };
  /* 1 hour of UTC offset ≈ 15° of longitude */
  var lng = -new Date().getTimezoneOffset() / 4;
  var lat = ARC_TZ_LAT[tz.split("/")[0]];
  return { lat: lat === undefined ? 35 : lat, lng: lng, label: tz ? city : "Unknown", tz: tz || "UTC" };
}

/* Great-circle distance (km) and initial bearing (° from north) */
function arcGeo(from, to) {
  var rad = Math.PI / 180;
  var p1 = from.lat * rad, p2 = to.lat * rad, dl = (to.lng - from.lng) * rad;
  var a = Math.sin((p2 - p1) / 2) * Math.sin((p2 - p1) / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  var km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var brg = Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl)) / rad;
  return { km: km, brg: (brg + 360) % 360 };
}
function arcCompass(deg) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];
}

function arcRenderTracker() {
  var host = document.getElementById("hud-blips");
  var track = document.getElementById("hud-track");
  if (!host) return;
  var ENT = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  var SIT = typeof SITES !== "undefined" ? SITES : [];
  var origin = arcOrigin();
  var idle = "Origin · " + origin.label + " — tracking " + ENT.length + " signal" + (ENT.length === 1 ? "" : "s");
  var geo = {};

  host.innerHTML = ENT.map(function (e, i) {
    var site = SIT.filter(function (s) { return s.id === e.site; })[0];
    var g = site ? arcGeo(origin, site) : { km: 10000, brg: i * 97 };
    geo[e.id] = g;
    /* Entities sharing a site fan out a little so both stay clickable */
    var twins = ENT.filter(function (x, j) { return j < i && x.site === e.site; }).length;
    var deg = g.brg + twins * 14;
    /* Distance → radius: √ scale so nearby sites aren't crushed in the middle
       (half the planet away = the edge) */
    var r = 6 + Math.sqrt(Math.min(g.km, 20000) / 20000) * 24;
    var a = (deg - 90) * (Math.PI / 180);
    var x = (40 + Math.cos(a) * r).toFixed(1);
    var y = (40 + Math.sin(a) * r).toFixed(1);
    var locked = userClearance < (e.clr || 1);
    var cls = "arc-blip arc-blip--" + (locked ? "unknown" : String(e.status).toLowerCase());
    /* The sweep wedge's leading edge starts at 45° */
    var delay = ((((deg - 45) % 360) + 360) % 360 / 360) * ARC_SWEEP_S;
    return (
      '<g class="' + cls + '" data-id="' + e.id + '" tabindex="0" role="button" aria-label="' +
      escHtml(locked ? "Unknown signal, CL-" + e.clr + " required" : "E-" + String(e.id).padStart(4, "0") + " " + e.name + ", " + e.status) + '">' +
      '<circle class="arc-blip-hit" cx="' + x + '" cy="' + y + '" r="5" />' +
      '<circle class="arc-blip-dot" cx="' + x + '" cy="' + y + '" r="2.2" style="animation-delay:' + delay.toFixed(2) + 's" />' +
      "</g>"
    );
  }).join("");
  if (track) track.textContent = idle;

  function describe(g) {
    var e = ENT.filter(function (x) { return x.id === Number(g.getAttribute("data-id")); })[0];
    if (!e || !track) return;
    var site = SIT.filter(function (s) { return s.id === e.site; })[0];
    var g2 = geo[e.id];
    var dist = g2 ? " · " + Math.round(g2.km).toLocaleString("en-US") + " KM " + arcCompass(g2.brg) : "";
    track.textContent = userClearance < (e.clr || 1)
      ? "UNKNOWN SIGNAL · CL-" + e.clr + " REQUIRED" + dist
      : "E-" + String(e.id).padStart(4, "0") + " " + e.name + " · " + e.status + (site ? " · " + site.name : "") + dist;
    track.className = "arc-hud-track arc-hud-track--" + (userClearance < (e.clr || 1) ? "unknown" : String(e.status).toLowerCase());
  }
  function reset() {
    if (!track) return;
    track.textContent = idle;
    track.className = "arc-hud-track";
  }
  function open(g) {
    var e = ENT.filter(function (x) { return x.id === Number(g.getAttribute("data-id")); })[0];
    if (!e) return;
    if (userClearance < (e.clr || 1)) {
      toast("CL-" + e.clr + " REQUIRED");
      return arcNotify("ACCESS DENIED · CL-" + e.clr, "deny");
    }
    if (typeof termViewer === "function") termViewer("E-" + String(e.id).padStart(4, "0"), nvEntityDoc(e));
  }

  if (host.dataset.wired) return;
  host.dataset.wired = "1";
  ["mouseover", "focusin"].forEach(function (ev) {
    host.addEventListener(ev, function (evt) {
      var g = evt.target.closest(".arc-blip");
      if (g) describe(g);
    });
  });
  host.addEventListener("mouseleave", reset);
  host.addEventListener("focusout", reset);
  host.addEventListener("click", function (evt) {
    var g = evt.target.closest(".arc-blip");
    if (g) open(g);
  });
  host.addEventListener("keydown", function (evt) {
    var g = evt.target.closest(".arc-blip");
    if (g && (evt.key === "Enter" || evt.key === " ")) {
      evt.preventDefault();
      open(g);
    }
  });
}

/* ── HUD ─────────────────────────────────────────────────────── */
function arcRenderHud() {
  var ENT = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  var STF = typeof personnel !== "undefined" ? personnel : [];
  var SIT = typeof SITES !== "undefined" ? SITES : [];
  var contained = ENT.filter(function (e) { return e.status === "CONTAINED"; }).length;
  var breached = ENT.filter(function (e) { return e.status === "BREACHED"; }).length;
  var pct = ENT.length ? Math.round((contained / ENT.length) * 100) : 0;

  if (sessionpersonnel) {
    document.getElementById("hud-name").textContent = (sessionpersonnel.fname + " " + sessionpersonnel.lname).toUpperCase();
    document.getElementById("hud-id").textContent = "S-" + sessionpersonnel.id;
    document.getElementById("arc-operator").textContent =
      sessionpersonnel.fname + " " + sessionpersonnel.lname + " · " + (sessionpersonnel.dept || "Operator");
  }

  /* Containment ring + big number */
  var ring = document.getElementById("hud-ring");
  if (ring) ring.style.strokeDashoffset = String(213.6 * (1 - pct / 100));
  document.getElementById("hud-pct").textContent = pct + "%";
  arcRenderTracker();

  document.getElementById("hud-status").textContent = [
    "Entities   " + ENT.length,
    "Contained  " + contained,
    "Breached   " + breached,
    "Sites      " + SIT.filter(function (s) { return s.status === "ACTIVE"; }).length + " active",
    "Personnel  " + STF.filter(function (s) { return s.active === "Y"; }).length + " active"
  ].join("\n");

  /* Class distribution */
  var counts = {};
  ENT.forEach(function (e) { counts[e.cls] = (counts[e.cls] || 0) + 1; });
  var labels = typeof CLS_LABELS !== "undefined" ? CLS_LABELS : {};
  document.getElementById("hud-dist").innerHTML = Object.keys(labels).map(function (k) {
    var n = counts[k] || 0;
    var w = ENT.length ? Math.round((n / ENT.length) * 100) : 0;
    return (
      "<li><span>" + escHtml(labels[k]) + "</span><em>" + n + "</em>" +
      '<span class="bar"><i class="cls-' + k + '" style="width:' + w + '%"></i></span></li>'
    );
  }).join("");

  /* Incident log — the newest reports across all entities */
  var events = [];
  ENT.forEach(function (e) {
    (e.reports || []).forEach(function (r) {
      events.push({ e: e, r: r });
    });
  });
  document.getElementById("hud-events").innerHTML = events
    .slice(-7)
    .reverse()
    .map(function (x) {
      return (
        '<li class="ev-' + escHtml(x.r.type || "") + '"><b>' + escHtml(x.r.type || "REPORT") + " · E-" +
        String(x.e.id).padStart(4, "0") + "</b><span>" + escHtml(x.r.title || "") + "</span></li>"
      );
    })
    .join("");
}

/* Notification feed — terminal activity, newest first (as SCiPNET's
   "21:04 — EXECUTED: LS"). kind: "deny" (red) | "file" (teal) */
var ARC_NOTES_MAX = 8;

function arcNotify(text, kind) {
  var list = document.getElementById("hud-notes");
  if (!list) return;
  var li = document.createElement("li");
  if (kind) li.className = kind;
  li.innerHTML =
    "<b>Notification</b><span>" +
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
    " — " + escHtml(text) + "</span>";
  list.insertBefore(li, list.firstChild);
  while (list.children.length > ARC_NOTES_MAX) list.lastChild.remove();
}

/* Activity meter — a slowly shifting bar wave */
function arcWave() {
  var svg = document.getElementById("hud-wave");
  if (!svg) return;
  var t = 0;
  function draw() {
    var out = "";
    for (var i = 0; i < 48; i++) {
      var h = 4 + Math.abs(Math.sin(i * 0.45 + t) * Math.cos(i * 0.13 - t * 0.6)) * 28;
      out += '<rect x="' + i * 5 + '" y="' + (34 - h) + '" width="3" height="' + h.toFixed(1) + '"/>';
    }
    svg.innerHTML = out;
    t += 0.08;
  }
  draw();
  if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) setInterval(draw, 120);
}

/* ── LOADER ──────────────────────────────────────────────────── */
function arcLoader() {
  var el = document.getElementById("arc-loader");
  var fill = document.getElementById("arc-loader-fill");
  if (!el) return;
  var done = false;
  function finish() {
    if (done) return;
    done = true;
    el.classList.add("gone");
    setTimeout(function () { el.remove(); }, 400);
  }
  var p = 0;
  var iv = setInterval(function () {
    p = Math.min(100, p + 7 + Math.random() * 12);
    fill.style.width = p + "%";
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(finish, 180);
    }
  }, 70);
  el.addEventListener("click", finish);
  document.addEventListener("keydown", finish, { once: true });
}

/* ── BOOT ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  /* Re-render the nav and panes whenever clearance changes (setClearance
     is defined in desktop-core.js, which loads after this file) */
  if (typeof setClearance === "function") {
    var baseSetClearance = setClearance;
    window.setClearance = function (level) {
      var before = userClearance;
      baseSetClearance(level);
      arcRenderNav();
      arcRenderTracker();
      if (userClearance !== before) arcRefreshPanes();
    };
  }

  arcLoader();
  arcRenderHud();
  arcWave();
  arcNotify("SESSION OPENED · CL-" + userClearance);

  /* Deep link (#entities) or default to the Containment Log */
  var start = location.hash.slice(1);
  var tab = arcTab(start);
  openWin(tab && userClearance >= tab.clr ? start : "main");
});
