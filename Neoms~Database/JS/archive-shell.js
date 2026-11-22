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
  { type: "sites", label: "Sites", title: "Containment Sites", clr: 1 },
  { type: "worldmap", label: "Map", title: "Global Facility Map", clr: 1 },
  { type: "entity-scheme", label: "Ent. Scheme", title: "Entity Class. Scheme", clr: 2 },
  { type: "personnel-scheme", label: "Pers. Scheme", title: "Personnel Scheme", clr: 2 },
  { type: "terminal", label: "Terminal", title: "NeoMS Terminal", clr: 4 },
  { type: "entitycreator", label: "Creator", title: "Entity Creator", clr: 4 },
  { type: "codeviewer", label: "Source", title: "Source Viewer", clr: 5 }
];

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

      var cssId = "wincss_" + winType;
      if (!document.getElementById(cssId)) {
        var lnk = document.createElement("link");
        lnk.id = cssId;
        lnk.rel = "stylesheet";
        lnk.href = WIN_BASE + winType + "/" + winType + ".css";
        /* Before archive.css so the Archive theme still wins */
        var theme = document.querySelector('link[href$="archive.css"]');
        document.head.insertBefore(lnk, theme);
      }

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

/* ── OPEN / CLOSE (the API window modules call) ──────────────── */
function openWin(type, data) {
  if (type === "entity" && data !== undefined) {
    arcOpenDossier(data);
    return;
  }

  var tab = arcTab(type);
  if (!tab) return;

  if (userClearance < tab.clr) {
    toast("CL-" + tab.clr + " REQUIRED");
    termPrint(tab.title.toUpperCase() + " requires CL-" + tab.clr + ". Current: CL-" + userClearance + ".", "err");
    return;
  }

  var panes = document.getElementById("arc-panes");
  if (!arcLoaded[type]) {
    var pane = document.createElement("section");
    pane.className = "arc-pane arc-pane--" + type;
    pane.id = "wbody_" + type;
    pane.setAttribute("aria-label", tab.title);
    pane.innerHTML = '<p class="arc-loading">Loading&#8230;</p>';
    panes.appendChild(pane);
    arcLoaded[type] = true;
    arcLoadModule(type, type);
  }

  panes.querySelectorAll(".arc-pane").forEach(function (p) {
    p.hidden = p.id !== "wbody_" + type;
  });
  arcCurrent = type;

  document.getElementById("arc-panetab").textContent = tab.title;
  document.getElementById("arc-chips").innerHTML =
    '<span class="arc-chip on">CLR-' + tab.clr + "</span>" +
    '<span class="arc-chip">' + String(ARC_TABS.indexOf(tab) + 1).padStart(2, "0") + " / " +
    String(ARC_TABS.length).padStart(2, "0") + "</span>";
  arcRenderNav();

  /* The map draws to its container size — nudge it after showing */
  if (type === "worldmap") window.dispatchEvent(new Event("resize"));
  if (type === "terminal") {
    var inp = document.getElementById("term-in");
    if (inp) inp.focus();
  }
}

function closeWin(id) {
  if (String(id).indexOf("entity_") === 0) arcCloseDossier();
}
/* Desktop-only actions — nothing to do in a single-page layout */
function focusWin() {}
function minWin() {}
function maxWin() {}

/* ── TOP NAV ─────────────────────────────────────────────────── */
function arcRenderNav() {
  var nav = document.getElementById("arc-nav");
  nav.innerHTML = ARC_TABS.map(function (t) {
    var locked = userClearance < t.clr;
    return (
      '<a href="#' + t.type + '" data-type="' + t.type + '"' +
      (t.type === arcCurrent ? ' aria-current="page"' : "") +
      (locked ? ' class="locked" title="Requires CL-' + t.clr + '"' : "") +
      ">" + t.label + (locked ? " <i>&#9632;</i>" : "") + "</a>"
    );
  }).join("");
}

document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("#arc-nav a");
  if (!a) return;
  e.preventDefault();
  openWin(a.getAttribute("data-type"));
});

/* ── DOSSIER VIEWER (entity files) ───────────────────────────── */
function arcOpenDossier(id) {
  var ent = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (e) {
    return e.id === id;
  })[0];
  var wrap = document.getElementById("arc-docwrap");
  var body = document.getElementById("arc-doc-body");
  var bodyId = "entity_" + id;
  document.getElementById("arc-doc-title").textContent =
    "E-" + String(id).padStart(4, "0") + (ent ? " · " + ent.name : "");
  body.innerHTML = '<div class="arc-doc-scroll" id="wbody_' + bodyId + '"><p class="arc-loading">Loading&#8230;</p></div>';
  wrap.hidden = false;
  arcLoadModule(bodyId, "entity-detail", id);
}

function arcCloseDossier() {
  var wrap = document.getElementById("arc-docwrap");
  wrap.hidden = true;
  wrap.classList.remove("max");
  document.getElementById("arc-doc-body").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("arc-doc-close").addEventListener("click", arcCloseDossier);
  document.getElementById("arc-doc-max").addEventListener("click", function () {
    document.getElementById("arc-docwrap").classList.toggle("max");
  });
  document.getElementById("arc-docwrap").addEventListener("click", function (e) {
    if (e.target === this) arcCloseDossier();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !document.getElementById("arc-docwrap").hidden) arcCloseDossier();
  });
});

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
  /* Re-render the nav whenever clearance changes (setClearance is
     defined in desktop-core.js, which loads after this file) */
  if (typeof setClearance === "function") {
    var baseSetClearance = setClearance;
    window.setClearance = function (level) {
      baseSetClearance(level);
      arcRenderNav();
    };
  }

  arcLoader();
  arcRenderHud();
  arcWave();

  /* Deep link (#entities) or default to the Containment Log */
  var start = location.hash.slice(1);
  var tab = arcTab(start);
  openWin(tab && userClearance >= tab.clr ? start : "main");
});
