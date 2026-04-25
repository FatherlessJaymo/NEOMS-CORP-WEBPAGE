/* ============================================================
   NEOMS — DESKTOP CORE
   Neoms~Database/JS/desktop.js

   FIXES (this revision):
   1. makeDraggable — added touchstart / touchmove / touchend /
      touchcancel so windows can be dragged on phones + tablets.
   2. createWin — initial window position now clamped to viewport;
      on mobile (< 600px) windows open full-screen so nothing is
      ever off-screen or unreachable.
   ============================================================ */
"use strict";

const LS_KEY     = "neoms_session_staff";
const INTAKE_URL = "/Neoms~Database/HTML/intake.html";
const WIN_BASE   = "/Neoms~Database/windows/";

/* ── Session guard ──────────────────────────────────────────── */
let sessionStaff = null;
(function () {
  try {
    sessionStaff = JSON.parse(localStorage.getItem(LS_KEY));
  } catch (e) {}
  /* Allow ?guest=1 to skip intake for previews */
  if ((!sessionStaff || !sessionStaff.fname) && /[?&]guest=1/.test(location.search)) {
    sessionStaff = { fname: "Guest", lname: "Operator", id: "G-0000", clearance: 1 };
    try { localStorage.setItem(LS_KEY, JSON.stringify(sessionStaff)); } catch (e) {}
  }
  if (!sessionStaff || !sessionStaff.fname) {
    window.location.replace(INTAKE_URL);
  }
})();

/* ── State ──────────────────────────────────────────────────── */
let wins          = {};
let winZ          = 50;
let activeWin     = null;
let userClearance = 1;

/* ── CV_FILES — source file list for the code viewer ────────── */
window.CV_FILES = [
  /* ── Data files ── */
  { label: "Entities-Data.js", path: "/Neoms~Database/windows/entities/Entities-Data.js", lang: "js",  clr: 3, dir: "windows/entities",      desc: "Entity records + classification labels" },
  { label: "Staff-Data.js",    path: "/Neoms~Database/windows/staff/Staff-Data.js",        lang: "js",  clr: 3, dir: "windows/staff",          desc: "Staff roster + departments" },
  { label: "Sites-Data.js",    path: "/Neoms~Database/windows/sites/Sites-Data.js",        lang: "js",  clr: 3, dir: "windows/sites",          desc: "Containment site records" },
  /* ── Core JS ── */
  { label: "desktop.js",  path: "/Neoms~Database/JS/desktop.js",  lang: "js",  clr: 2, dir: "JS", desc: "Desktop shell core" },
  { label: "intake.js",   path: "/Neoms~Database/JS/intake.js",   lang: "js",  clr: 2, dir: "JS", desc: "Intake terminal logic" },
  /* ── HTML ── */
  { label: "desktop.html", path: "/Neoms~Database/HTML/desktop.html", lang: "html", clr: 1, dir: "HTML", desc: "Desktop shell markup" },
  { label: "intake.html",  path: "/Neoms~Database/HTML/intake.html",  lang: "html", clr: 1, dir: "HTML", desc: "Intake terminal markup" },
  /* ── CSS ── */
  { label: "Databaselog.css", path: "/Neoms~Database/CSS/Databaselog.css", lang: "css", clr: 1, dir: "CSS", desc: "Main stylesheet" },
  { label: "desktop.css",     path: "/Neoms~Database/CSS/desktop.css",     lang: "css", clr: 1, dir: "CSS", desc: "Desktop shell styles" },
  { label: "intake.css",      path: "/Neoms~Database/CSS/intake.css",      lang: "css", clr: 1, dir: "CSS", desc: "Intake terminal styles" },
  /* ── Windows ── */
  { label: "main.html",           path: "/Neoms~Database/windows/main/main.html",                       lang: "html", clr: 1, dir: "windows/main",          desc: "Containment Log window" },
  { label: "main.js",             path: "/Neoms~Database/windows/main/main.js",                         lang: "js",   clr: 2, dir: "windows/main",          desc: "Containment Log logic" },
  { label: "entities.html",       path: "/Neoms~Database/windows/entities/entities.html",               lang: "html", clr: 1, dir: "windows/entities",      desc: "Entity Registry window" },
  { label: "entities.js",         path: "/Neoms~Database/windows/entities/entities.js",                 lang: "js",   clr: 2, dir: "windows/entities",      desc: "Entity Registry logic" },
  { label: "entity-detail.html",  path: "/Neoms~Database/windows/entity-detail/entity-detail.html",    lang: "html", clr: 1, dir: "windows/entity-detail", desc: "Entity Detail window" },
  { label: "entity-detail.js",    path: "/Neoms~Database/windows/entity-detail/entity-detail.js",      lang: "js",   clr: 2, dir: "windows/entity-detail", desc: "Entity Detail logic" },
  { label: "entity-scheme.html",  path: "/Neoms~Database/windows/entity-scheme/entity-scheme.html",    lang: "html", clr: 1, dir: "windows/entity-scheme", desc: "Entity Classification Scheme window" },
  { label: "entity-scheme.js",    path: "/Neoms~Database/windows/entity-scheme/entity-scheme.js",      lang: "js",   clr: 2, dir: "windows/entity-scheme", desc: "Entity Classification Scheme logic" },
  { label: "entity-scheme.css",   path: "/Neoms~Database/windows/entity-scheme/entity-scheme.css",     lang: "css",  clr: 1, dir: "windows/entity-scheme", desc: "Entity Classification Scheme styles" },
  { label: "staff.html",          path: "/Neoms~Database/windows/staff/staff.html",                     lang: "html", clr: 1, dir: "windows/staff",         desc: "Staff Records window" },
  { label: "staff.js",            path: "/Neoms~Database/windows/staff/staff.js",                       lang: "js",   clr: 2, dir: "windows/staff",         desc: "Staff Records logic" },
  { label: "staff-scheme.html",   path: "/Neoms~Database/windows/staff-scheme/staff-scheme.html",      lang: "html", clr: 1, dir: "windows/staff-scheme",  desc: "Personnel Position Scheme window" },
  { label: "staff-scheme.js",     path: "/Neoms~Database/windows/staff-scheme/staff-scheme.js",        lang: "js",   clr: 2, dir: "windows/staff-scheme",  desc: "Personnel Position Scheme logic" },
  { label: "staff-scheme.css",    path: "/Neoms~Database/windows/staff-scheme/staff-scheme.css",       lang: "css",  clr: 1, dir: "windows/staff-scheme",  desc: "Personnel Position Scheme styles" },
  { label: "sites.html",          path: "/Neoms~Database/windows/sites/sites.html",                     lang: "html", clr: 1, dir: "windows/sites",         desc: "Sites window" },
  { label: "sites.js",            path: "/Neoms~Database/windows/sites/sites.js",                       lang: "js",   clr: 2, dir: "windows/sites",         desc: "Sites logic" },
  { label: "terminal.html",       path: "/Neoms~Database/windows/terminal/terminal.html",               lang: "html", clr: 1, dir: "windows/terminal",      desc: "Terminal window" },
  { label: "terminal.js",         path: "/Neoms~Database/windows/terminal/terminal.js",                 lang: "js",   clr: 2, dir: "windows/terminal",      desc: "Terminal logic" },
  { label: "terminal.css",        path: "/Neoms~Database/windows/terminal/terminal.css",                lang: "css",  clr: 1, dir: "windows/terminal",      desc: "Terminal styles" },
  { label: "worldmap.html",       path: "/Neoms~Database/windows/worldmap/worldmap.html",               lang: "html", clr: 1, dir: "windows/worldmap",      desc: "World Map window" },
  { label: "worldmap.js",         path: "/Neoms~Database/windows/worldmap/worldmap.js",                 lang: "js",   clr: 2, dir: "windows/worldmap",      desc: "World Map logic" },
  { label: "worldmap.css",        path: "/Neoms~Database/windows/worldmap/worldmap.css",                lang: "css",  clr: 1, dir: "windows/worldmap",      desc: "World Map styles" },
  { label: "codeviewer.html",     path: "/Neoms~Database/windows/codeviewer/codeviewer.html",           lang: "html", clr: 1, dir: "windows/codeviewer",    desc: "Code Viewer window" },
  { label: "codeviewer.js",       path: "/Neoms~Database/windows/codeviewer/codeviewer.js",             lang: "js",   clr: 2, dir: "windows/codeviewer",    desc: "Code Viewer logic" },
  { label: "codeviewer.css",      path: "/Neoms~Database/windows/codeviewer/codeviewer.css",            lang: "css",  clr: 1, dir: "windows/codeviewer",    desc: "Code Viewer styles" }
];

/* ── Clearance ──────────────────────────────────────────────── */
const LS_CLR_KEY = "neoms_clearance";

function setClearance(level) {
  level = Math.max(1, Math.min(5, parseInt(level, 10) || 1));
  userClearance = level;
  for (let i = 1; i <= 5; i++) {
    const d = document.getElementById("cd" + i);
    if (d) d.classList.toggle("active", i <= level);
  }
  try { localStorage.setItem(LS_CLR_KEY, String(level)); } catch (e) {}
}

function cycleClearance() {
  setClearance(userClearance >= 4 ? 1 : userClearance + 1);
  const ind = document.getElementById("clearance-indicator");
  if (ind) {
    ind.style.outline = "1px solid var(--teal-b)";
    setTimeout(() => (ind.style.outline = ""), 300);
  }
}

/* ── Clock ──────────────────────────────────────────────────── */
function updateClock() {
  const n  = new Date();
  const el = document.getElementById("sys-clock");
  if (el)
    el.textContent =
      String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0");
}
updateClock();
setInterval(updateClock, 10000);

/* ── Start menu ─────────────────────────────────────────────── */
function toggleStartMenu() {
  document.getElementById("start-menu").classList.toggle("open");
}
function closeMenu() {
  document.getElementById("start-menu").classList.remove("open");
}
document.addEventListener("click", function (e) {
  if (!e.target.closest("#start-menu") && !e.target.closest("#start-btn")) closeMenu();
});

/* ── Logout ─────────────────────────────────────────────────── */
function doLogout() {
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
  window.location.href = INTAKE_URL;
}

/* ════════════════════════════════════════════════════════════
   DESKTOP BACKGROUND MAP
   Uses double-rAF to ensure the SVG has real dimensions before
   D3 reads clientWidth/clientHeight. ResizeObserver redraws on
   window resize.
   ════════════════════════════════════════════════════════════ */
function initDesktopBgMap() {
  if (typeof d3 === "undefined") return;
  const svgEl = document.getElementById("desktop-map-svg");
  if (!svgEl) return;

  function draw() {
    const W = svgEl.clientWidth  || svgEl.getBoundingClientRect().width  || window.innerWidth;
    const H = svgEl.clientHeight || svgEl.getBoundingClientRect().height || window.innerHeight - 30;

    if (W < 10 || H < 10) {
      requestAnimationFrame(draw);
      return;
    }

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const proj    = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
    const geoPath = d3.geoPath().projection(proj);
    const g       = svg.append("g");

    g.append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "#020608").attr("stroke", "#061010").attr("stroke-width", 0.3)
      .attr("d", geoPath);

    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("fill", "none").attr("stroke", "#041008").attr("stroke-width", 0.2)
      .attr("d", geoPath);

    /* Use preloaded atlas data (set by world-atlas-loader.js) to
       avoid Neocities CSP blocking fetch() to external CDNs.    */
    function drawBgCountries(world) {
      g.selectAll(".bg-country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("class", "bg-country")
        .attr("fill", "#060e0a").attr("stroke", "#081408").attr("stroke-width", 0.25)
        .attr("d", geoPath);

      if (typeof SITES !== "undefined") {
        SITES.forEach(function (site) {
          const xy = proj([site.lng, site.lat]);
          if (!xy) return;
          const breached =
            typeof ENTITIES !== "undefined" &&
            ENTITIES.some(function (e) {
              return e.site === site.id && e.status === "BREACHED";
            });
          g.append("circle")
            .attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 3)
            .attr("fill", breached ? "#550000" : "#004040").attr("opacity", 0.6);
        });
      }
    }

    if (window.__worldAtlas) {
      drawBgCountries(window.__worldAtlas);
    } else {
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(drawBgCountries)
        .catch(function () {});
    }
  }

  /* Double rAF — guarantees layout is complete before reading dimensions */
  requestAnimationFrame(function () { requestAnimationFrame(draw); });

  /* Redraw on resize */
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(function () { requestAnimationFrame(draw); }).observe(svgEl);
  }
}

/* ════════════════════════════════════════════════════════════
   WINDOW MANAGEMENT
   ════════════════════════════════════════════════════════════ */

/* ── makeDraggable — mouse + touch (FIX #1) ─────────────────── */
function makeDraggable(win, titlebar) {
  let dragging = false, ox = 0, oy = 0;

  function applyMove(clientX, clientY) {
    win.style.left = Math.max(0, Math.min(clientX - ox, window.innerWidth  - 60)) + "px";
    win.style.top  = Math.max(0, Math.min(clientY - oy, window.innerHeight - 80)) + "px";
  }

  /* ── Mouse ── */
  titlebar.addEventListener("mousedown", function (e) {
    if (e.target.closest(".win-controls")) return;
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
    bringToFront(win.id);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp, { once: true });
  });
  function onMouseMove(e) { if (dragging) applyMove(e.clientX, e.clientY); }
  function onMouseUp()    { dragging = false; document.removeEventListener("mousemove", onMouseMove); }

  /* ── Touch ── */
  titlebar.addEventListener("touchstart", function (e) {
    if (e.target.closest(".win-controls")) return;
    dragging = true;
    const t = e.touches[0];
    ox = t.clientX - win.offsetLeft;
    oy = t.clientY - win.offsetTop;
    bringToFront(win.id);
    e.preventDefault(); /* prevent page scroll stealing the drag */
  }, { passive: false });

  titlebar.addEventListener("touchmove", function (e) {
    if (!dragging) return;
    applyMove(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
  }, { passive: false });

  titlebar.addEventListener("touchend",    function () { dragging = false; });
  titlebar.addEventListener("touchcancel", function () { dragging = false; });
}

/* ── bringToFront ───────────────────────────────────────────── */
function bringToFront(id) {
  winZ++;
  const el = document.getElementById(id);
  if (el) el.style.zIndex = winZ;
  document.querySelectorAll(".win").forEach((w) => w.classList.remove("active-win"));
  if (el) el.classList.add("active-win");
  activeWin = id;
  updateTaskbar();
}

/* ── updateTaskbar ──────────────────────────────────────────── */
function updateTaskbar() {
  const bar = document.getElementById("taskbar-wins");
  if (!bar) return;
  bar.innerHTML = "";
  Object.entries(wins).forEach(([id, info]) => {
    const b       = document.createElement("div");
    b.className   = "tb-btn tb-win" + (id === activeWin ? " active" : "");
    b.innerHTML   = info.title;
    b.onclick = function () {
      const el = document.getElementById(id);
      if (el && el.style.height === "22px") el.style.height = wins[id].savedH || "500px";
      bringToFront(id);
    };
    bar.appendChild(b);
  });
}

/* ── createWin (FIX #2: clamped position + mobile full-screen) ── */
function createWin(id, titleHTML, width, height, winType, data) {
  if (document.getElementById(id)) {
    bringToFront(id);
    return;
  }

  const container = document.getElementById("wins-container");
  const w         = document.createElement("div");
  w.className     = "win";
  w.id            = id;

  const mobile = window.innerWidth < 600;
  let ow, oh, lx, ly;

  if (mobile) {
    /* On phones, fill the viewport so windows are always reachable */
    ow = window.innerWidth;
    oh = window.innerHeight - 30;
    lx = 0;
    ly = 0;
  } else {
    ow = Math.min(width,  window.innerWidth  - 40);
    oh = Math.min(height, window.innerHeight - 80);
    /* Clamp cascade offset so windows never open off-screen */
    lx = Math.max(0, Math.min(80 + Object.keys(wins).length * 22, window.innerWidth  - ow - 10));
    ly = Math.max(0, Math.min(30 + Object.keys(wins).length * 22, window.innerHeight - oh - 40));
  }

  w.style.cssText = `left:${lx}px;top:${ly}px;width:${ow}px;height:${oh}px;display:flex;`;

  w.innerHTML = `
    <div class="win-titlebar" id="tb_${id}">
      <div class="win-title">${titleHTML}</div>
      <div class="win-controls">
        <button class="win-btn" title="Minimise" onclick="toggleMinWin('${id}')">_</button>
        <button class="win-btn" title="Maximise" onclick="toggleMaxWin('${id}')">&#9633;</button>
        <button class="win-btn close-btn" title="Close" onclick="closeWin('${id}')">X</button>
      </div>
    </div>
    <div id="wbody_${id}" class="win-body-wrap" style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
      <div style="flex:1;display:flex;align-items:center;justify-content:center;
        background:#0a0a14;font-family:'Share Tech Mono',monospace;font-size:11px;color:#1a3a3a;">
        LOADING...
      </div>
    </div>`;

  container.appendChild(w);
  wins[id] = { title: titleHTML.replace(/<[^>]+>/g, "").trim() };
  makeDraggable(w, document.getElementById("tb_" + id));
  bringToFront(id);

  const htmlUrl = WIN_BASE + winType + "/" + winType + ".html";
  fetch(htmlUrl)
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then((html) => {
      const body = document.getElementById("wbody_" + id);
      if (!body) return;
      body.innerHTML = html;

      const cssId = "wincss_" + winType;
      if (!document.getElementById(cssId)) {
        const lnk = document.createElement("link");
        lnk.id   = cssId; lnk.rel = "stylesheet";
        lnk.href = WIN_BASE + winType + "/" + winType + ".css";
        document.head.appendChild(lnk);
      }

      fetch(WIN_BASE + winType + "/" + winType + ".js")
        .then((r2) => {
          if (!r2.ok) throw new Error("HTTP " + r2.status);
          return r2.text();
        })
        .then((js) => {
          const fn = new Function(
            "winId", "winData",
            "ENTITIES", "STAFF", "SITES", "DEPTS", "CLS_LABELS",
            "sessionStaff", "userClearance",
            "openWin", "closeWin", "termPrint", "termRun",
            js
          );
          fn(id, data, ENTITIES, STAFF, SITES, DEPTS, CLS_LABELS,
             sessionStaff, userClearance, openWin, closeWin, termPrint, termRun);
        })
        .catch((err) => console.warn("Window JS load failed:", WIN_BASE + winType, err));
    })
    .catch((err) => {
      const body = document.getElementById("wbody_" + id);
      if (body)
        body.innerHTML = `
        <div style="padding:20px;font-family:'Share Tech Mono',monospace;font-size:11px;color:#553333;background:#0a0a14;">
          WINDOW UNAVAILABLE<br><span style="color:#2a2a3a;">${err.message}</span><br>
          <span style="color:#1a2a2a;">Path: ${htmlUrl}</span>
        </div>`;
    });
}

function toggleMinWin(id) {
  const w = document.getElementById(id);
  if (!w) return;
  if (w.style.height === "22px") {
    w.style.height = wins[id].savedH || "500px";
    w.style.width  = wins[id].savedW || "600px";
  } else {
    wins[id].savedH = w.style.height;
    wins[id].savedW = w.style.width;
    w.style.height  = "22px";
  }
}

function toggleMaxWin(id) {
  const w    = document.getElementById(id);
  const area = document.getElementById("desktop-area");
  if (!w || !area) return;
  if (wins[id].maximised) {
    w.style.left   = wins[id].savedL || "80px";
    w.style.top    = wins[id].savedT || "30px";
    w.style.width  = wins[id].savedW || "600px";
    w.style.height = wins[id].savedH || "500px";
    wins[id].maximised = false;
  } else {
    wins[id].savedL = w.style.left;
    wins[id].savedT = w.style.top;
    wins[id].savedW = w.style.width;
    wins[id].savedH = w.style.height;
    w.style.left   = "0px";
    w.style.top    = "0px";
    w.style.width  = area.offsetWidth  + "px";
    w.style.height = area.offsetHeight + "px";
    wins[id].maximised = true;
    bringToFront(id);
  }
}

function closeWin(id) {
  const w = document.getElementById(id);
  if (w) w.remove();
  delete wins[id];
  activeWin = null;
  updateTaskbar();
}

function switchTab(wid, tab, btn) {
  document.querySelectorAll("#" + wid + "_tabs > div").forEach((d) => (d.style.display = "none"));
  const t = document.getElementById(wid + "_" + tab);
  if (t) t.style.display = "block";
  btn.closest(".win-tabs").querySelectorAll(".win-tab").forEach((b) => b.classList.remove("active-tab"));
  btn.classList.add("active-tab");
}

/* ════════════════════════════════════════════════════════════
   WINDOW ROUTER
   ════════════════════════════════════════════════════════════ */
function openWin(type, data) {
  switch (type) {
    case "main":
      createWin("main", '<span class="win-ico">&#128196;</span> NeoMS Containment Log', 720, 560, "main");
      break;
    case "entities":
      if (userClearance < 3) {
        termPrint("Entity Registry requires CL-3. Current: CL-" + userClearance + ".", "err");
        return;
      }
      createWin("entities", '<span class="win-ico">&#9888;</span> Entity Registry', 680, 480, "entities");
      break;
    case "entity":
      if (data === undefined) return;
      createWin(
        "entity_" + data,
        '<span class="win-ico">&#9888;</span> Entity ' + String(data).padStart(4, "0"),
        660, 560, "entity-detail", data
      );
      break;
    case "entity-scheme":
      createWin("entity-scheme", '<span class="win-ico">&#128213;</span> Entity Classification Scheme', 760, 580, "entity-scheme");
      break;
    case "staff":
      createWin("staff", '<span class="win-ico">&#128101;</span> Staff Records', 750, 480, "staff");
      break;
    case "staff-scheme":
      createWin("staff-scheme", '<span class="win-ico">&#128218;</span> Personnel Position Scheme', 700, 560, "staff-scheme");
      break;
    case "sites":
      createWin("sites", '<span class="win-ico">&#127963;</span> Containment Sites', 680, 560, "sites");
      break;
    case "worldmap":
      createWin("worldmap", '<span class="win-ico">&#127760;</span> Global Facility Map — CLASSIFIED', 960, 600, "worldmap");
      break;
    case "terminal":
      createWin("terminal", '<span class="win-ico">&#9654;</span> NEOMS Terminal v1.0', 580, 400, "terminal");
      break;
    case "codeviewer":
      if (userClearance < 5) {
        termPrint("Source Viewer requires CL-5 authorisation. Current: CL-" + userClearance + ".", "err");
        return;
      }
      createWin("codeviewer", '<span class="win-ico">&#128196;</span> NeoMS Source Viewer', 860, 540, "codeviewer");
      break;
  }
}

/* ════════════════════════════════════════════════════════════
   TERMINAL
   ════════════════════════════════════════════════════════════ */
const termHistory = [];
let termHIdx = -1;

function termKey(e) {
  const inp = document.getElementById("term-in");
  if (!inp) return;
  if (e.key === "Enter") {
    const cmd = inp.value.trim();
    if (cmd) {
      termHistory.unshift(cmd);
      termHIdx = -1;
      termPrint("C:\\NEOMS> " + cmd);
      termRun(cmd);
      inp.value = "";
    }
  } else if (e.key === "ArrowUp") {
    if (termHIdx < termHistory.length - 1) inp.value = termHistory[++termHIdx] || "";
  } else if (e.key === "ArrowDown") {
    inp.value = termHIdx > 0 ? termHistory[--termHIdx] : ((termHIdx = -1), "");
  }
}

function termPrint(txt, cls) {
  const out = document.getElementById("term-out");
  if (!out) return;
  const d = document.createElement("div");
  if      (cls === "err")  d.style.color = "#ff4444";
  else if (cls === "warn") d.style.color = "#ffaa00";
  else if (cls === "ok")   d.style.color = "#00ee88";
  else if (cls === "dim")  d.style.color = "#335544";
  d.textContent = txt;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

function termRun(raw) {
  const parts = raw.split(" ");
  const cmd   = parts[0].toUpperCase();
  const args  = parts.slice(1);
  switch (cmd) {
    case "HELP":
      [
        "HELP              — show this list",
        "LIST              — list records  (LIST ENTITIES | LIST STAFF | LIST SITES)",
        "GET               — get entity by ID  (GET ENTITY <id>)",
        "OPEN              — open entity window  (OPEN ENTITY <id>)",
        "STATUS            — overall system status",
        "BREACH            — list breached entities",
        "MAP               — open interactive facility map",
        "CODE              — open source file viewer",
        "CLEAR             — clear terminal output",
        "VER               — version info",
        "SETCLR <1-4>      — set clearance level (CL-5 requires auth code)",
        "CLRINFO           — show current clearance",
        "WHOAMI            — show session identity",
        "TRANSMIT          — send record to NeoMS Registry",
        "DEPTREQ <dept>    — request a department transfer",
        "LOGOUT            — wipe session and return to intake"
      ].forEach((l) => termPrint("  " + l, "dim"));
      break;
    case "VER":
      termPrint("NeoMs OS Build 2026.02 — Schema v2.1", "ok");
      break;
    case "CLEAR": {
      const o = document.getElementById("term-out");
      if (o) o.innerHTML = "";
      break;
    }
    case "STATUS":
      termPrint("SYSTEM STATUS:", "ok");
      ENTITIES.forEach((e) =>
        termPrint(
          "  E-" + String(e.id).padStart(4, "0") +
          " [" + e.cls + "] " + e.name.padEnd(32, " ") +
          " STATUS: " + e.status,
          e.status === "BREACHED" ? "err" : e.status === "MONITORED" ? "warn" : "dim"
        )
      );
      break;
    case "BREACH": {
      const br = ENTITIES.filter((e) => e.status === "BREACHED");
      br.length
        ? br.forEach((e) => termPrint("  [BREACH] E-" + String(e.id).padStart(4, "0") + " — " + e.name, "err"))
        : termPrint("  No active breaches.", "ok");
      break;
    }
    case "MAP":
      openWin("worldmap");
      termPrint("Opening interactive facility map...", "ok");
      break;
    case "CODE":
      openWin("codeviewer");
      termPrint("Opening source file viewer...", "ok");
      break;
    case "LIST": {
      const sub = (args[0] || "").toUpperCase();
      if (sub === "ENTITIES" || sub === "")
        ENTITIES.forEach((e) =>
          termPrint("  E-" + String(e.id).padStart(4, "0") + " [" + e.cls + "/" + e.ps + "] " + e.name)
        );
      else if (sub === "STAFF")
        STAFF.forEach((s) =>
          termPrint("  S-" + s.id + " [CL-" + s.clr + "] " + s.fname + " " + s.lname + " — " + s.pos)
        );
      else if (sub === "SITES")
        SITES.forEach((s) => termPrint("  " + s.name + " — " + s.loc + " (" + s.status + ")"));
      else termPrint("Unknown target. Try: LIST ENTITIES | LIST STAFF | LIST SITES", "err");
      break;
    }
    case "GET": {
      const gs = (args[0] || "").toUpperCase(), gi = parseInt(args[1]);
      if (gs === "ENTITY" && !isNaN(gi)) {
        const e = ENTITIES.find((x) => x.id === gi);
        e
          ? (["name", "cls", "ps", "status", "site", "protocols"].forEach((k) =>
              termPrint(
                "  " + k.padEnd(10, " ") + ": " +
                  (k === "site" ? "Site-" + e[k] : k === "protocols" ? e[k].length : e[k]),
                e.status === "BREACHED" && k === "status" ? "err" : ""
              )
            ),
            termPrint("  [Tip: OPEN ENTITY " + gi + " to open wiki viewer]", "dim"))
          : termPrint("Entity ID " + gi + " not found.", "err");
      } else termPrint("Usage: GET ENTITY <id>", "err");
      break;
    }
    case "OPEN": {
      const os = (args[0] || "").toUpperCase(), oi = parseInt(args[1]);
      if (os === "ENTITY" && !isNaN(oi)) {
        const e = ENTITIES.find((x) => x.id === oi);
        e
          ? (openWin("entity", oi), termPrint("Opening E-" + String(oi).padStart(4, "0") + "...", "ok"))
          : termPrint("Entity not found.", "err");
      } else termPrint("Usage: OPEN ENTITY <id>", "err");
      break;
    }
    case "SETCLR": {
      const lvl = parseInt(args[0], 10);
      if (isNaN(lvl) || lvl < 1 || lvl > 4) {
        termPrint("Usage: SETCLR <1-4>  (CL-5 requires OVERRIDE CLEARANCE OMEGA)", "err");
        break;
      }
      setClearance(lvl);
      termPrint("Clearance updated to CL-" + lvl + ". Taskbar indicator refreshed.", "ok");
      break;
    }
    case "OVERRIDE":
      if (args[0] === "CLEARANCE" && args[1] === "OMEGA") {
        setClearance(5);
        termPrint("OVERRIDE ACCEPTED.", "ok");
        termPrint("CL-5 GRANTED. All activity is now logged and monitored.", "dim");
      } else {
        termPrint("Unknown override code. Type HELP.", "err");
      }
      break;
    case "CLRINFO":
      termPrint("Current clearance: CL-" + userClearance, "ok");
      termPrint(
        userClearance < 5 ? "  Access restricted. Some protocols may be filtered." : "  Full access granted.",
        "dim"
      );
      break;
    case "WHOAMI":
      if (sessionStaff) {
        termPrint("Session identity:", "ok");
        termPrint("  ID   : S-" + sessionStaff.id);
        termPrint("  Name : " + sessionStaff.fname + " " + sessionStaff.lname);
        termPrint("  Dept : " + sessionStaff.dept);
        termPrint("  CLR  : CL-" + sessionStaff.clr);
        termPrint("  Site : Site-" + sessionStaff.site);
      } else termPrint("No session identity on record.", "warn");
      break;
    case "TRANSMIT":
      if (!sessionStaff) { termPrint("No session identity. Complete intake first.", "err"); break; }
      termPrint("Transmitting to NeoMS Registry...", "warn");
      fetch("https://formspree.io/f/xwvwybya", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          staff_id: "S-" + sessionStaff.id, first_name: sessionStaff.fname,
          last_name: sessionStaff.lname,    department: sessionStaff.dept,
          clearance: "CL-" + sessionStaff.clr, site: "Site-" + sessionStaff.site,
          timestamp: new Date().toISOString()
        })
      })
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(() => termPrint("TRANSMISSION COMPLETE.", "ok"))
        .catch((err) => termPrint("TRANSMISSION FAILED — " + err.message, "err"));
      break;
    case "DEPTREQ": {
      if (!sessionStaff) { termPrint("No session identity. Complete intake first.", "err"); break; }
      const reqDept = args.join(" ").toUpperCase().trim();
      if (!reqDept) {
        termPrint("Usage: DEPTREQ <department name>", "err");
        DEPTS.forEach((d) => termPrint("  " + d, "dim"));
        break;
      }
      if (!DEPTS.includes(reqDept)) {
        termPrint("Unknown department: " + reqDept, "err");
        DEPTS.forEach((d) => termPrint("  " + d, "dim"));
        break;
      }
      if (reqDept === sessionStaff.dept) { termPrint("You are already assigned to " + reqDept + ".", "warn"); break; }
      termPrint("Submitting transfer request to FACILITY COMMAND...", "warn");
      fetch("https://formspree.io/f/xwvwybya", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          request_type: "DEPARTMENT_TRANSFER",
          staff_id: "S-" + sessionStaff.id, first_name: sessionStaff.fname,
          last_name: sessionStaff.lname,    current_department: sessionStaff.dept,
          requested_department: reqDept,    clearance: "CL-" + sessionStaff.clr,
          site: sessionStaff.site ? "Site-" + sessionStaff.site : "UNASSIGNED",
          timestamp: new Date().toISOString()
        })
      })
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(() => {
          termPrint("TRANSFER REQUEST SUBMITTED.", "ok");
          termPrint("  From: " + sessionStaff.dept, "dim");
          termPrint("  To:   " + reqDept, "dim");
          termPrint("Pending FACILITY COMMAND approval. Session unchanged.", "dim");
        })
        .catch((err) => termPrint("REQUEST FAILED — " + err.message, "err"));
      break;
    }
    case "LOGOUT":
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      termPrint("Session cleared. Redirecting to intake...", "warn");
      setTimeout(() => { window.location.href = INTAKE_URL; }, 1500);
      break;
    case "":
      break;
    default:
      termPrint("Unknown command: " + cmd + ". Type HELP.", "err");
  }
}

/* ════════════════════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  /* Restore saved clearance */
  let savedClr = 1;
  try { savedClr = parseInt(localStorage.getItem("neoms_clearance"), 10) || 1; } catch (e) {}

  if (sessionStaff) { STAFF.push(sessionStaff); }
  setClearance(savedClr);

  const clrInd = document.getElementById("clearance-indicator");
  if (clrInd) {
    clrInd.style.cursor = "pointer";
    clrInd.addEventListener("click", cycleClearance);
  }

  initDesktopBgMap();
  openWin("worldmap");
  openWin("main");
});