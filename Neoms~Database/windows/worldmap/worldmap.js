/* =====
   NEOMS — WORLD MAP WINDOW
   Neoms~Database/windows/worldmap/worldmap.js

   A D3 world map of NeoMS sites, plus:
   - Site HUD (SCiPNET-style) when a site is selected, with a button
     that opens the site file in the secured viewer
   - Entity picture pins at their sites (hover card, click opens file)
   - Classified locations from the reports, [REDACTED] until your
     clearance is high enough
   - Incident timeline: replays every report as a ring on the map
   - Live "anomalous signal" pings that feed the sidebar notifications
============ */

/* ── Classified locations mentioned in the reports ────────────
   rep = index of the report filed there (opens on click).
   All three are NeoMS-original operational designations, not places
   named in the source; the cross site's coordinates are provisional
   until the source establishes where the summoning happened. */
const NM_CLASSIFIED = [
  {
    label: "Church Cross Site", clr: 4, lat: 35.36, lng: 138.73, ent: 333, rep: 0, unverified: true,
    role: "Investigate sacrificial summoning and Ghidorah manifestations"
  },
  {
    label: "Kyoto Heritage Zone", clr: 3, lat: 35.01, lng: 135.77, ent: 333, rep: 4,
    role: "Investigate religious documents and the Priestess's teachings"
  },
  {
    label: "Former Kumamoto Forward Post", clr: 5, lat: 32.8, lng: 130.7, ent: 333, rep: 2,
    role: "Destroyed in the light-spear impact and sealed; a perimeter team monitors cult activity and stands by for emergency operations"
  },
  {
    /* Inside Site-10081, so drawn offset (px) with a stem back to the site */
    label: "Observation Gallery · Window 2", clr: 3, lat: 35.6894, lng: 139.6917, ent: 8, rep: 6, offset: [-30, 26],
    role: "E-0008 sighting: entity turned to face the observation window, unseen by every sensor"
  }
];

/* ── Stats header ───────────────────────────────────────────── */
const breachedCount = ENTITIES.filter((e) => e.status === "BREACHED").length;
const statSites = document.getElementById("nm-stat-sites");
const statBreach = document.getElementById("nm-stat-breach");
if (statSites) statSites.innerHTML = 'SITES: <span class="nm-stat-ok">' + SITES.length + "</span>";
if (statBreach) statBreach.innerHTML = 'BREACH: <span class="nm-stat-bad">' + breachedCount + " ACTIVE</span>";

/* ── Clock ──────────────────────────────────────────────────── */
let nmClockI = null;
function nmTick() {
  const el = document.getElementById("nm-clock");
  if (!el) {
    clearInterval(nmClockI);
    return;
  }
  el.textContent = new Date().toUTCString().split(" ")[4] + " UTC";
}
nmTick();
nmClockI = setInterval(nmTick, 1000);

/* ── Helpers ────────────────────────────────────────────────── */
const nmEntId = (id) => "E-" + String(id).padStart(4, "0");
function nmIsBreached(site) {
  return ENTITIES.some((e) => e.site === site.id && e.status === "BREACHED");
}
function nmColor(site) {
  return nmIsBreached(site) ? "#ff4444" : "#00e0e0";
}
function nmHash(s) {
  let h = 0;
  s = String(s);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function nmOpenEntity(e) {
  if (userClearance < (e.clr || 1)) {
    toast("CL-" + e.clr + " REQUIRED");
    if (typeof arcNotify === "function") arcNotify("ACCESS DENIED · CL-" + e.clr, "deny");
    return;
  }
  entityRecord(e, function () { termViewer(nmEntId(e.id), nvEntityDoc(e)); });
}
function nmOpenReport(e, i) {
  const r = e.reports[i];
  const need = Math.max(e.clr || 1, r.clr || 1);
  if (userClearance < need) {
    toast("CL-" + need + " REQUIRED");
    if (typeof arcNotify === "function") arcNotify("ACCESS DENIED · CL-" + need, "deny");
    return;
  }
  entityRecord(e, function () { termViewer(nmEntId(e.id) + " · REPORT " + (i + 1), nvReportDoc(e, r)); });
}

/* ════════════════════════════════════════════════════════════
   SITE HUD
   ════════════════════════════════════════════════════════════ */
let nmHudSite = null;
let nmWaveI = null;

function nmShowPanel(site) {
  const panel = document.getElementById("nm-panel");
  if (!panel) return;
  nmHudSite = site;
  const g = (id) => document.getElementById(id);
  const h = nmHash(site.id);
  const breached = nmIsBreached(site);
  const ents = ENTITIES.filter((e) => e.site === site.id);
  const parts = site.loc.split(",").map((s) => s.trim());

  g("nm-hcountry").textContent = parts[parts.length - 1];
  g("nm-hregion").textContent = parts.slice(0, -1).join(", ") || "—";
  g("nm-hip").textContent = [64 + (h % 160), (h >> 3) % 255, (h >> 7) % 255, (h >> 11) % 255].join(".");
  g("nm-hname").textContent = String(100 + (h % 900)) + " " + site.name.toUpperCase();

  /* Hume level: reality stability — lower with more (or breached) entities */
  const hume = Math.max(0.42, 1 - ents.length * 0.07 - (breached ? 0.3 : 0) - (h % 7) / 100);
  g("nm-hume").textContent = "— " + hume.toFixed(2) + " Hm";

  /* Threat detection read-out */
  const anchors = Math.round(hume * 100);
  g("nm-hstatus").textContent = [
    "STATUS:",
    "EXPERIMENT_RADIATION: " + (h % 5 === 0 ? "ELEVATED" : "NORMAL"),
    "CAMERA_FEED: " + (breached ? "INTERMITTENT" : "FUNCTIONAL"),
    "BREACH_PROTOCOL: " + (breached ? "ACTIVE" : "READY"),
    "POWER_SUPPLY: NORMAL",
    "BACKUP_POWER_FUEL: " + (60 + (h % 40)) + "%",
    "ANOMALY_DETECTION: " + (breached ? "ALERT" : ents.length ? "MONITORING" : "SAFE"),
    "REALITY_ANCHORS: FUNCTIONING · " + anchors + "%",
    "THERMAL_SIGNATURES · " + (ents.length * 3 + (h % 24))
  ].join("\n");
  nmDrawRadar(ents);

  g("nm-pents").textContent = site.entities;
  g("nm-ppersonnel").textContent = site.personnel;
  g("nm-pstatus").textContent = site.status;
  g("nm-pest").textContent = site.est;
  const bb = g("nm-pbreach");
  bb.hidden = !breached;
  if (breached) g("nm-pbreach-ents").textContent = ents.filter((e) => e.status === "BREACHED").map((e) => e.name).join(", ");

  /* Visit counter per site, remembered in this browser */
  let visits = 88000 + (h % 60);
  try {
    const key = "neoms_site_visits_" + site.id;
    visits = (parseInt(localStorage.getItem(key), 10) || visits) + 1;
    localStorage.setItem(key, String(visits));
  } catch (e) {}
  g("nm-visits").textContent = "VISIT COUNT / " + visits;

  panel.classList.toggle("nm-panel--breach", breached);
  panel.classList.add("nm-panel--open");
  nmStartWave(hume);
}

function nmClosePanel() {
  const panel = document.getElementById("nm-panel");
  if (panel) panel.classList.remove("nm-panel--open");
  clearInterval(nmWaveI);
  nmHudSite = null;
}
window.nmClosePanel = nmClosePanel;

/* Hume meter waveform — jitters more as reality gets less stable */
function nmStartWave(hume) {
  clearInterval(nmWaveI);
  const svg = document.getElementById("nm-hwave");
  if (!svg) return;
  const chaos = 1.2 - hume;
  let t = 0;
  function draw() {
    if (!svg.isConnected) return clearInterval(nmWaveI);
    let out = "";
    for (let i = 0; i < 80; i++) {
      const base = Math.abs(Math.sin(i * 0.5 + t) * Math.cos(i * 0.17 - t * 0.7));
      const spike = Math.random() < chaos * 0.15 ? Math.random() * 14 : 0;
      const hh = Math.min(34, 2 + base * 10 + Math.random() * 6 * chaos + spike);
      out += '<rect x="' + i * 3 + '" y="' + (18 - hh / 2).toFixed(1) + '" width="1.6" height="' + hh.toFixed(1) + '"/>';
    }
    svg.innerHTML = out;
    t += 0.12;
  }
  draw();
  if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) nmWaveI = setInterval(draw, 140);
}

/* Threat radar: rings, a sweep, and a blip per entity at the site */
function nmDrawRadar(ents) {
  const svg = document.getElementById("nm-radar");
  if (!svg) return;
  let blips = "";
  ents.forEach(function (e, i) {
    const a = (nmHash(e.id) % 360) * (Math.PI / 180);
    const r = 12 + (nmHash(e.name) % 22);
    const cls = e.status === "BREACHED" ? "nm-blip nm-blip--bad" : "nm-blip";
    blips += '<circle class="' + cls + '" cx="' + (40 + Math.cos(a) * r).toFixed(1) + '" cy="' + (40 + Math.sin(a) * r).toFixed(1) + '" r="2" style="animation-delay:' + i * 0.6 + 's"/>';
  });
  svg.innerHTML =
    '<circle cx="40" cy="40" r="36" class="nm-radar-ring"/><circle cx="40" cy="40" r="24" class="nm-radar-ring"/>' +
    '<circle cx="40" cy="40" r="12" class="nm-radar-ring"/><path d="M40 4V76M4 40H76" class="nm-radar-ring"/>' +
    '<g class="nm-radar-sweep"><path d="M40 40L40 4A36 36 0 0 1 71 22Z"/></g>' + blips;
}

document.getElementById("nm-open-file").addEventListener("click", function () {
  if (nmHudSite) termViewer(nmHudSite.name, nvSiteDoc(nmHudSite));
});

/* ── Entity hover card (reuses the file browser's card) ───────── */
const nmPeek = document.getElementById("nm-peek");
function nmPeekShow(e, evt) {
  if (!nmPeek || typeof fbPeekEntity !== "function") return;
  nmPeek.innerHTML = fbPeekEntity(e);
  nmPeek.hidden = false;
  const w = nmPeek.offsetWidth, h = nmPeek.offsetHeight;
  let x = evt.clientX + 18, y = evt.clientY - 20;
  if (x + w > window.innerWidth - 10) x = evt.clientX - w - 18;
  if (y + h > window.innerHeight - 10) y = window.innerHeight - h - 10;
  nmPeek.style.left = Math.max(10, x) + "px";
  nmPeek.style.top = Math.max(10, y) + "px";
}
function nmPeekHide() {
  if (nmPeek) nmPeek.hidden = true;
}

/* ════════════════════════════════════════════════════════════
   INCIDENT EVENTS (timeline)
   ════════════════════════════════════════════════════════════ */
const NM_EVENTS = [];
ENTITIES.forEach(function (e) {
  const site = SITES.find((s) => s.id === e.site);
  (e.reports || []).forEach(function (r, i) {
    const spot = NM_CLASSIFIED.find((c) => c.ent === e.id && c.rep === i);
    const at = spot || site;
    if (!at) return;
    NM_EVENTS.push({ e: e, r: r, i: i, lat: at.lat, lng: at.lng, where: spot ? spot.label : site.name, broadcast: /broadcast/i.test(r.title) });
  });
});

/* Entity focus: null = all entities, otherwise one entity's id */
let nmFocus = null;
const nmFocusEnt = () => (nmFocus === null ? null : ENTITIES.find((e) => e.id === nmFocus) || null);
const nmFocusEvents = () => NM_EVENTS.filter((ev) => nmFocus === null || ev.e.id === nmFocus);

/* ════════════════════════════════════════════════════════════
   MAP BUILD
   ════════════════════════════════════════════════════════════ */
(function initMap() {
  const svgEl = document.getElementById("nm-d3-svg");
  if (!svgEl) return;

  if (typeof d3 === "undefined") {
    const msg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    msg.setAttribute("x", "50%");
    msg.setAttribute("y", "50%");
    msg.setAttribute("text-anchor", "middle");
    msg.setAttribute("fill", "#7fb8a0");
    msg.setAttribute("font-family", "'Share Tech Mono',monospace");
    msg.setAttribute("font-size", "13");
    msg.textContent = "MAP DATA UNAVAILABLE — D3 NOT LOADED";
    svgEl.appendChild(msg);
    return;
  }

  const svg = d3.select(svgEl);

  /* State that survives redraws (window resize / maximize) */
  let curTransform = d3.zoomIdentity;
  let selectedId = null;
  let proj = null;
  let world = null;
  let fxLayer = null; /* event rings + pings */

  /* Markers keep a constant on-screen size while the map zooms, so
     clustered sites spread apart as you zoom in */
  function markerScale(k) {
    return 1 / k;
  }
  function sizeMarkers(k) {
    const s = markerScale(k);
    svg.selectAll(".nm-site-marker").each(function () {
      const mk = d3.select(this);
      mk.select(".nm-hit").attr("r", 12 * s);
      mk.select(".nm-ring1").attr("r", 11 * s).attr("stroke-width", 1 * s);
      mk.select(".nm-outer").attr("r", 5.5 * s).attr("stroke-width", 1.6 * s);
      mk.select(".nm-inner").attr("r", 2.4 * s);
      mk.select(".nm-site-label")
        .attr("y", -10 * s)
        .attr("font-size", 11 * s + "px")
        .attr("stroke-width", 3 * s + "px");
    });
    /* Pins, classified markers and rings: translate + constant scale */
    svg.selectAll(".nm-scale").each(function () {
      this.setAttribute("transform", "translate(" + this.__xy + ") scale(" + s + ")");
    });
    const zd = document.getElementById("nm-zoom-disp");
    if (zd) zd.innerHTML = 'ZOOM: <span class="nm-stat-ok">' + k.toFixed(2) + "x</span>";
    /* Show every label once zoomed in enough to read them */
    svgEl.classList.toggle("nm-labels-on", k >= 3);
    svgEl.classList.toggle("nm-cl-labels-on", k >= 10);
  }

  /* A group placed at lng/lat that keeps a constant on-screen size */
  function scaled(parent, lng, lat, cls) {
    const xy = proj([lng, lat]);
    if (!xy) return null;
    const grp = parent.append("g").attr("class", "nm-scale " + (cls || ""));
    grp.node().__xy = xy[0] + "," + xy[1];
    grp.attr("transform", "translate(" + xy[0] + "," + xy[1] + ") scale(" + markerScale(curTransform.k) + ")");
    return grp;
  }

  const zoom = d3
    .zoom()
    .scaleExtent([0.8, 40])
    .on("zoom", function (event) {
      curTransform = event.transform;
      svg.select(".nm-world").attr("transform", curTransform);
      sizeMarkers(curTransform.k);
      nmPeekHide();
    });
  svg.call(zoom);

  function selectSite(id) {
    selectedId = id;
    svg.selectAll(".nm-site-marker").classed("nm-selected", (d) => d.id === id);
    document.querySelectorAll(".nm-site-row").forEach((r) => {
      r.classList.toggle("nm-site-row--active", Number(r.dataset.id) === id);
    });
    const site = SITES.find((s) => s.id === id);
    if (site) nmShowPanel(site);
  }

  function clearSelection() {
    selectedId = null;
    svg.selectAll(".nm-site-marker").classed("nm-selected", false);
    document.querySelectorAll(".nm-site-row").forEach((r) => r.classList.remove("nm-site-row--active"));
    nmClosePanel();
  }

  /* Smoothly centre + zoom onto a point */
  function flyToPoint(lng, lat, minK) {
    if (!proj) return;
    const xy = proj([lng, lat]);
    if (!xy) return;
    const r = svgEl.getBoundingClientRect();
    const k = Math.max(curTransform.k, minK || 6);
    const t = d3.zoomIdentity
      .translate(r.width / 2, r.height / 2)
      .scale(k)
      .translate(-xy[0], -xy[1]);
    svg.transition().duration(750).call(zoom.transform, t);
  }
  function flyTo(site) {
    flyToPoint(site.lng, site.lat, 6);
  }

  /* ── Site list (legend) — reaches markers that overlap ─────── *
     In focus mode it lists the entity's reports instead. */
  const siteList = document.getElementById("nm-site-list");
  const legendTitle = document.getElementById("nm-legend-title");
  function renderList() {
    if (!siteList) return;
    const fe = nmFocusEnt();
    if (fe) {
      const evs = nmFocusEvents();
      if (legendTitle) legendTitle.textContent = "REPORTS · " + nmEntId(fe.id) + " (" + evs.length + ")";
      siteList.innerHTML = evs.map(function (ev) {
        const need = Math.max(fe.clr || 1, ev.r.clr || 1);
        const locked = userClearance < need;
        return (
          '<button class="nm-site-row nm-rep-row" data-rep="' + ev.i + '" title="' +
          escHtml(locked ? "[REDACTED] · CL-" + need : ev.r.title) + '">' +
          '<span class="nm-legend-dot nm-dot--' + escHtml(String(ev.r.type).toLowerCase()) + '"></span>' +
          '<span class="nm-rep-row-txt"><b>' + String(ev.i + 1).padStart(2, "0") + " " + escHtml(ev.r.type) + "</b>" +
          "<small>" + escHtml(ev.where) + "</small></span></button>"
        );
      }).join("") || '<p class="nm-site-row-loc">No reports on file.</p>';
      return;
    }
    if (legendTitle) legendTitle.textContent = "SITES";
    siteList.innerHTML = SITES.map(function (s) {
      const bad = nmIsBreached(s);
      return (
        '<button class="nm-site-row' +
        (bad ? " nm-site-row--breach" : "") +
        '" data-id="' +
        s.id +
        '" title="' +
        escHtml(s.loc) +
        '"><span class="nm-legend-dot ' +
        (bad ? "nm-legend-dot-breach" : "nm-legend-dot-active") +
        '"></span>' +
        escHtml(s.name) +
        '<span class="nm-site-row-loc">' +
        escHtml(s.loc.split(",").slice(-1)[0].trim()) +
        "</span></button>"
      );
    }).join("");
  }
  if (siteList) {
    renderList();
    siteList.addEventListener("click", function (e) {
      const row = e.target.closest(".nm-site-row");
      if (!row) return;
      /* Report row: fly to it, pulse it and highlight its marker */
      if (row.dataset.rep !== undefined) {
        const ev = nmFocusEvents().find((x) => x.i === Number(row.dataset.rep));
        if (!ev) return;
        siteList.querySelectorAll(".nm-site-row").forEach((r) => r.classList.toggle("nm-site-row--active", r === row));
        svg.selectAll(".nm-rep").classed("nm-rep--hl", function () { return Number(this.dataset.rep) === ev.i; });
        flyToPoint(ev.lng, ev.lat, 4);
        ring(ev.lng, ev.lat, "nm-fx--" + String(ev.r.type).toLowerCase(), 24, 2600);
        return;
      }
      const site = SITES.find((s) => s.id === Number(row.dataset.id));
      if (!site) return;
      selectSite(site.id);
      flyTo(site);
    });
  }

  /* ── Entity focus dropdown ──────────────────────────────────── */
  const focusSel = document.getElementById("nm-focus");
  let timelineReset = function () {};

  /* Zoom to fit the entity's site and every report location */
  function fitFocus() {
    const fe = nmFocusEnt();
    if (!fe || !proj) return;
    const site = SITES.find((s) => s.id === fe.site);
    const pts = nmFocusEvents().concat(site ? [site] : []).map((p) => proj([p.lng, p.lat])).filter(Boolean);
    if (!pts.length) return;
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
    const y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    /* Fit into the open part of the map: right of the legend, below
       the header, above the timeline */
    const r = svgEl.getBoundingClientRect();
    const legend = document.querySelector(".nm-legend");
    const lw = legend ? legend.getBoundingClientRect() : null;
    const left = lw && lw.width < r.width * 0.45 ? lw.right - r.left + 12 : 12;
    const box = { x: left, y: Math.min(110, r.height * 0.2), w: r.width - left - 12, h: 0 };
    box.h = r.height - box.y - 70;
    /* Report markers and the entity pin reach ~55px out from their spot, so leave room */
    const m = 150;
    const dx = x1 - x0, dy = y1 - y0;
    const k = dx < 1 && dy < 1
      ? 8
      : Math.max(1, Math.min(30, (box.w - m) / Math.max(dx, 1), (box.h - m) / Math.max(dy, 1)));
    const t = d3.zoomIdentity
      .translate(box.x + box.w / 2, box.y + box.h / 2)
      .scale(k)
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
    svg.transition().duration(750).call(zoom.transform, t);
  }

  if (focusSel) {
    focusSel.insertAdjacentHTML("beforeend", ENTITIES.map(function (e) {
      const locked = userClearance < (e.clr || 1);
      return '<option value="' + e.id + '"' + (locked ? " disabled" : "") + ">" + nmEntId(e.id) + " · " +
        (locked ? "[REDACTED] · CL-" + e.clr : escHtml(e.name)) + "</option>";
    }).join(""));
    focusSel.addEventListener("change", function () {
      nmFocus = focusSel.value ? Number(focusSel.value) : null;
      clearSelection();
      nmPeekHide();
      redraw();
      renderList();
      timelineReset();
      if (nmFocus !== null) fitFocus();
      else svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
    });
  }

  /* Reset view button */
  const resetBtn = document.getElementById("nm-reset");
  if (resetBtn)
    resetBtn.addEventListener("click", function () {
      clearSelection();
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
    });

  /* ── Entity picture pins at each site ────────────────────────── */
  function drawPins(g) {
    const layer = g.append("g").attr("class", "nm-pins");
    SITES.forEach(function (site) {
      const ents = ENTITIES.filter((e) => e.site === site.id && (nmFocus === null || e.id === nmFocus));
      ents.forEach(function (e, i) {
        const grp = scaled(layer, site.lng, site.lat, "nm-pin" + (userClearance < (e.clr || 1) ? " nm-pin--locked" : ""));
        if (!grp) return;
        const ox = 24 + i * 30, oy = -24;
        const locked = userClearance < (e.clr || 1);
        grp.append("line").attr("class", "nm-pin-stem").attr("x1", 0).attr("y1", 0).attr("x2", ox).attr("y2", oy);
        const pin = grp
          .append("g")
          .attr("class", "nm-pin-head")
          .attr("transform", "translate(" + ox + "," + oy + ")")
          .attr("tabindex", 0)
          .attr("role", "button")
          .attr("aria-label", locked ? nmEntId(e.id) + ", clearance required" : nmEntId(e.id) + " " + e.name);
        pin.append("circle").attr("r", 14).attr("class", "nm-pin-bg");
        if (e.img) {
          pin
            .append("image")
            .attr("href", e.img)
            .attr("x", -13)
            .attr("y", -13)
            .attr("width", 26)
            .attr("height", 26)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr("clip-path", "url(#nm-pin-clip)")
            .style("filter", locked ? "url(#nm-pin-blur)" : null);
        }
        pin.append("circle").attr("r", 14).attr("class", "nm-pin-ring" + (e.status === "BREACHED" ? " nm-pin-ring--bad" : ""));
        pin
          .on("mouseenter", (evt) => nmPeekShow(e, evt))
          .on("mousemove", (evt) => nmPeekShow(e, evt))
          .on("mouseleave", nmPeekHide)
          .on("click", function (evt) {
            evt.stopPropagation();
            nmPeekHide();
            nmOpenEntity(e);
          })
          .on("keydown", function (evt) {
            if (evt.key === "Enter" || evt.key === " ") {
              evt.preventDefault();
              nmOpenEntity(e);
            }
          });
      });
    });
  }

  /* ── Classified locations: real marker, or a [REDACTED] glitch ─ */
  function drawClassified(g) {
    /* In focus mode the report markers stand in for these */
    if (nmFocus !== null) return;
    const layer = g.append("g").attr("class", "nm-classified-layer");
    NM_CLASSIFIED.forEach(function (c) {
      const ok = userClearance >= c.clr;
      const at = scaled(layer, c.lng, c.lat, "nm-classified" + (ok ? "" : " nm-classified--fog"));
      if (!at) return;
      let grp = at;
      if (c.offset) {
        at.append("line").attr("class", "nm-pin-stem").attr("x1", 0).attr("y1", 0).attr("x2", c.offset[0]).attr("y2", c.offset[1]);
        grp = at.append("g").attr("transform", "translate(" + c.offset[0] + "," + c.offset[1] + ")");
      }
      at
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", ok ? c.label : "Classified location, CL-" + c.clr + " required");
      grp.append("rect").attr("class", "nm-cl-hit").attr("x", -14).attr("y", -14).attr("width", 28).attr("height", 28);
      grp.append("path").attr("class", "nm-cl-diamond").attr("d", "M0-7L7 0 0 7-7 0Z");
      grp
        .append("text")
        .attr("class", "nm-cl-label")
        .attr("y", -12)
        .attr("text-anchor", "middle")
        .text(ok ? c.label.toUpperCase() + (c.unverified ? " · UNVERIFIED" : "") : "[REDACTED] · CL-" + c.clr);
      /* Hover tooltip: role + where the designation comes from */
      at
        .append("title")
        .text(ok
          ? c.label + " — " + c.role + (c.offset ? "." : ". NeoMS-original designation" + (c.unverified ? "; coordinates unverified." : "."))
          : "Classified location — CL-" + c.clr + " required");
      function open() {
        const e = ENTITIES.find((x) => x.id === c.ent);
        if (!ok) {
          toast("CL-" + c.clr + " REQUIRED");
          if (typeof arcNotify === "function") arcNotify("ACCESS DENIED · CL-" + c.clr, "deny");
          return;
        }
        if (e) nmOpenReport(e, c.rep);
      }
      at.on("click", function (evt) {
        evt.stopPropagation();
        open();
      });
      at.on("keydown", function (evt) {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          open();
        }
      });
    });
  }

  /* ── Focus mode: a numbered marker per report of the entity ────
     Reports filed at the same place fan out around it. */
  function drawFocusReports(g) {
    const fe = nmFocusEnt();
    if (!fe) return;
    const layer = g.append("g").attr("class", "nm-reports");
    const spots = {};
    nmFocusEvents().forEach(function (ev) {
      const k = ev.lat + "," + ev.lng;
      (spots[k] = spots[k] || []).push(ev);
    });
    Object.keys(spots).forEach(function (k) {
      const evs = spots[k];
      const at = scaled(layer, evs[0].lng, evs[0].lat, "nm-rep-spot");
      if (!at) return;
      /* Spread over 30°–250° so they stay clear of the entity pin (up-right) */
      const rad = 32 + Math.max(0, evs.length - 4) * 5;
      const pos = evs.map(function (ev, j) {
        const a = ((evs.length === 1 ? 135 : 30 + (220 * j) / (evs.length - 1)) * Math.PI) / 180;
        return [Math.cos(a) * rad, Math.sin(a) * rad];
      });
      pos.forEach((p) => at.append("line").attr("class", "nm-pin-stem").attr("x1", 0).attr("y1", 0).attr("x2", p[0]).attr("y2", p[1]));
      at.append("circle").attr("class", "nm-rep-origin").attr("r", 2.5);
      evs.forEach(function (ev, j) {
        const need = Math.max(fe.clr || 1, ev.r.clr || 1);
        const locked = userClearance < need;
        const b = at
          .append("g")
          .attr("class", "nm-rep nm-rep--" + String(ev.r.type).toLowerCase() + (locked ? " nm-rep--locked" : ""))
          .attr("transform", "translate(" + pos[j][0] + "," + pos[j][1] + ")")
          .attr("data-rep", ev.i)
          .attr("tabindex", 0)
          .attr("role", "button")
          .attr("aria-label", "Report " + (ev.i + 1) + ", " + ev.r.type + (locked ? ", CL-" + need + " required" : ", " + ev.r.title));
        b.append("circle").attr("r", 10);
        b.append("text").attr("text-anchor", "middle").attr("dy", "0.35em").text(ev.i + 1);
        b.append("title").text(
          "#" + (ev.i + 1) + " " + ev.r.type + " — " + (locked ? "[REDACTED] · CL-" + need : ev.r.title) + "\n" + ev.where
        );
        b.on("click", function (evt) {
          evt.stopPropagation();
          nmOpenReport(fe, ev.i);
        }).on("keydown", function (evt) {
          if (evt.key === "Enter" || evt.key === " ") {
            evt.preventDefault();
            nmOpenReport(fe, ev.i);
          }
        });
      });
    });
  }

  /* ── Rings: incident events + live pings ─────────────────────── */
  function ring(lng, lat, cls, radius, life) {
    if (!fxLayer || !proj) return;
    const grp = scaled(fxLayer, lng, lat, "nm-fx " + cls);
    if (!grp) return;
    for (let i = 0; i < 3; i++) {
      grp.append("circle").attr("r", radius).attr("class", "nm-fx-ring").style("animation-delay", i * 0.45 + "s");
    }
    grp.append("circle").attr("r", 3).attr("class", "nm-fx-dot");
    setTimeout(() => grp.remove(), life || 3200);
  }

  /* ── Full redraw (first paint + every resize) ─────────────── */
  function redraw() {
    const rect = svgEl.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    if (W < 10 || H < 10) return;

    svg.selectAll("*").remove();
    const defs = svg.append("defs");

    function makeGlow(id, color, dev) {
      const f = defs
        .append("filter")
        .attr("id", id)
        .attr("x", "-60%")
        .attr("y", "-60%")
        .attr("width", "220%")
        .attr("height", "220%");
      f.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", dev).attr("result", "blur");
      f.append("feFlood").attr("flood-color", color).attr("result", "col");
      f.append("feComposite").attr("in", "col").attr("in2", "blur").attr("operator", "in").attr("result", "shd");
      const m = f.append("feMerge");
      m.append("feMergeNode").attr("in", "shd");
      m.append("feMergeNode").attr("in", "SourceGraphic");
    }
    makeGlow("nm-glow-ok", "#00e0e0", 3);
    makeGlow("nm-glow-breach", "#ff4444", 4);

    /* Round clip for pin pictures; blur + grey for locked ones */
    defs.append("clipPath").attr("id", "nm-pin-clip").append("circle").attr("r", 13);
    const blur = defs.append("filter").attr("id", "nm-pin-blur");
    blur.append("feGaussianBlur").attr("stdDeviation", 2.5);
    blur.append("feColorMatrix").attr("type", "saturate").attr("values", 0);

    defs
      .append("pattern")
      .attr("id", "nm-grat")
      .attr("width", 80)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 80 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "#0c2420")
      .attr("stroke-width", 0.5);

    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "#050b14");
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#nm-grat)").attr("opacity", 0.8);

    /* Fit the globe below the header and above the legend */
    const top = Math.min(96, H * 0.18);
    const pad = 16;
    proj = d3.geoNaturalEarth1().fitExtent(
      [
        [pad, top],
        [W - pad, H - pad]
      ],
      { type: "Sphere" }
    );
    const geoPath = d3.geoPath().projection(proj);
    const g = svg.append("g").attr("class", "nm-world");

    function drawWorld(atlas) {
      world = atlas;
      g.append("path")
        .datum({ type: "Sphere" })
        .attr("fill", "#061520")
        .attr("stroke", "#1a4a50")
        .attr("stroke-width", 0.8)
        .attr("vector-effect", "non-scaling-stroke")
        .attr("d", geoPath);

      g.append("path")
        .datum(d3.geoGraticule()())
        .attr("fill", "none")
        .attr("stroke", "#0f3036")
        .attr("stroke-width", 0.5)
        .attr("vector-effect", "non-scaling-stroke")
        .attr("d", geoPath);

      g.selectAll(".nm-country")
        .data(topojson.feature(atlas, atlas.objects.countries).features)
        .enter()
        .append("path")
        .attr("class", "nm-country")
        .attr("vector-effect", "non-scaling-stroke")
        .attr("d", geoPath);

      /* Rings sit under the markers */
      fxLayer = g.append("g").attr("class", "nm-fx-layer");

      SITES.forEach(function (site) {
        const breached = nmIsBreached(site);
        const color = nmColor(site);
        const xy = proj([site.lng, site.lat]);
        if (!xy) return;

        const grp = g
          .append("g")
          .attr("class", "nm-site-marker" + (breached ? " nm-breach" : "") +
            (nmFocus !== null && (nmFocusEnt() || {}).site !== site.id ? " nm-site-marker--dim" : ""))
          .attr("transform", "translate(" + xy[0] + "," + xy[1] + ")")
          .datum(site)
          .on("click", function (event, d) {
            event.stopPropagation();
            selectSite(d.id);
          });

        /* Invisible, larger hit area so small markers are easy to click */
        grp.append("circle").attr("class", "nm-hit").attr("r", 12).attr("fill", "transparent");
        grp.append("circle").attr("class", "nm-ring1").attr("r", 11).attr("fill", "none").attr("stroke", color);
        grp
          .append("circle")
          .attr("class", "nm-outer")
          .attr("r", 5.5)
          .attr("fill", color)
          .attr("fill-opacity", 0.12)
          .attr("stroke", color);
        grp
          .append("circle")
          .attr("class", "nm-inner")
          .attr("r", 2.4)
          .attr("fill", color)
          .style("filter", "url(#" + (breached ? "nm-glow-breach" : "nm-glow-ok") + ")");
        grp
          .append("text")
          .attr("class", "nm-site-label")
          .attr("text-anchor", "middle")
          .attr("fill", color)
          .attr("font-family", "'Share Tech Mono',monospace")
          .attr("paint-order", "stroke fill")
          .attr("stroke", "#050b14")
          .text(site.name);
      });

      drawClassified(g);
      drawFocusReports(g);
      drawPins(g);

      /* Restore zoom + selection from before the redraw */
      g.attr("transform", curTransform);
      sizeMarkers(curTransform.k);
      if (selectedId !== null) {
        svg.selectAll(".nm-site-marker").classed("nm-selected", (d) => d.id === selectedId);
      }
    }

    /* Background click clears the selection (d3.zoom swallows the
       click that ends a pan, so dragging doesn't close the dossier) */
    svg.on("click.bg", clearSelection);

    function drawError(text) {
      svg
        .append("text")
        .attr("x", W / 2)
        .attr("y", H / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#7fb8a0")
        .attr("font-family", "'Share Tech Mono',monospace")
        .attr("font-size", 13)
        .text(text);
    }

    /* window.__worldAtlas is set by world-atlas-loader.js (loaded as a
       <script> in archive.html), which avoids Neocities' CSP on fetch */
    const atlas = world || window.__worldAtlas;
    if (atlas) {
      try {
        drawWorld(atlas);
      } catch (e) {
        drawError("MAP RENDER ERROR — " + e.message);
      }
    } else {
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(drawWorld)
        .catch(function () {
          drawError("MAP DATA UNAVAILABLE — NETWORK RESTRICTED");
        });
    }
  }

  /* ── Incident timeline ───────────────────────────────────────── */
  (function timeline() {
    const range = document.getElementById("nm-tl-range");
    const play = document.getElementById("nm-tl-play");
    const label = document.getElementById("nm-tl-label");
    if (!range || !NM_EVENTS.length) return;
    /* Only the focused entity's reports when focus mode is on */
    let evs = nmFocusEvents();
    range.max = Math.max(0, evs.length - 1);
    let cur = -1;
    let timer = null;

    timelineReset = function () {
      stop();
      evs = nmFocusEvents();
      cur = -1;
      range.max = Math.max(0, evs.length - 1);
      range.value = 0;
      range.disabled = play.disabled = !evs.length;
      label.textContent = (nmFocus === null ? "INCIDENT TIMELINE" : nmEntId(nmFocus) + " TIMELINE") + " — press play";
      label.classList.remove("nm-tl-label--locked");
    };

    function show(i, fly) {
      cur = i;
      range.value = i;
      const ev = evs[i];
      const locked = userClearance < Math.max(ev.e.clr || 1, ev.r.clr || 1);
      label.textContent =
        String(i + 1).padStart(2, "0") + "/" + evs.length + " · " + nmEntId(ev.e.id) + " · " +
        ev.r.type + " — " + (locked ? "[REDACTED] · CL-" + Math.max(ev.e.clr || 1, ev.r.clr || 1) : ev.r.title);
      label.classList.toggle("nm-tl-label--locked", locked);
      const radius = ev.broadcast ? 80 : { BREACH: 40, INCIDENT: 30, OBSERVATION: 24, SIGHTING: 20 }[ev.r.type] || 24;
      ring(ev.lng, ev.lat, "nm-fx--" + String(ev.r.type).toLowerCase() + (ev.broadcast ? " nm-fx--broadcast" : ""), radius, 3600);
      if (fly) flyToPoint(ev.lng, ev.lat, 4);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
      play.innerHTML = "&#9654;";
      play.setAttribute("aria-label", "Play incident timeline");
    }
    play.addEventListener("click", function () {
      if (timer) return stop();
      play.innerHTML = "&#10074;&#10074;";
      play.setAttribute("aria-label", "Pause incident timeline");
      if (!evs.length) return stop();
      show(cur >= evs.length - 1 ? 0 : cur + 1, true);
      timer = setInterval(function () {
        if (!svgEl.isConnected) return stop();
        if (cur >= evs.length - 1) return stop();
        show(cur + 1, true);
      }, 2600);
    });
    range.addEventListener("input", function () {
      stop();
      show(parseInt(range.value, 10), true);
    });
    /* Clicking the caption opens that report */
    label.addEventListener("click", function () {
      if (cur < 0) return;
      const ev = evs[cur];
      nmOpenReport(ev.e, ev.i);
    });
  })();

  /* ── Live anomalous-signal pings ─────────────────────────────── */
  (function pings() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function next() {
      setTimeout(function () {
        if (!svgEl.isConnected) return;
        const pane = svgEl.closest(".arc-pane");
        /* Only while the map is on screen */
        if (!pane || !pane.hidden) {
          const site = SITES[Math.floor(Math.random() * SITES.length)];
          const jitter = () => (Math.random() - 0.5) * 1.6;
          ring(site.lng + jitter(), site.lat + jitter(), "nm-fx--ping", 26, 2600);
          if (typeof arcNotify === "function") arcNotify("ANOMALOUS SIGNAL · " + site.name.toUpperCase());
        }
        next();
      }, 9000 + Math.random() * 9000);
    }
    next();
  })();

  /* Defer first draw until the SVG has real layout dimensions */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      lastSize = [svgEl.getBoundingClientRect().width, svgEl.getBoundingClientRect().height];
      redraw();
    });
  });

  /* Redraw on resize (window drag-resize, maximize/restore). The zoom
     transform lives in projection space, so re-fitting the projection
     would shift the view; instead keep the same geographic point in
     the centre at the same zoom level. */
  let lastSize = null;
  function redrawKeepingView() {
    const r = svgEl.getBoundingClientRect();
    let centre = null;
    if (proj && lastSize && curTransform.k !== 1) {
      const p = curTransform.invert([lastSize[0] / 2, lastSize[1] / 2]);
      centre = proj.invert(p);
    }
    lastSize = [r.width, r.height];
    redraw();
    if (centre && proj) {
      const xy = proj(centre);
      curTransform = d3.zoomIdentity
        .translate(r.width / 2, r.height / 2)
        .scale(curTransform.k)
        .translate(-xy[0], -xy[1]);
    } else if (!centre) {
      curTransform = d3.zoomIdentity;
    }
    svg.call(zoom.transform, curTransform);
  }

  if (typeof ResizeObserver !== "undefined") {
    let roTimer = null;
    new ResizeObserver(function () {
      cancelAnimationFrame(roTimer);
      roTimer = requestAnimationFrame(redrawKeepingView);
    }).observe(svgEl);
  }
})();
