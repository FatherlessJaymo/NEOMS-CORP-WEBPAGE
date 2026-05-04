/* ============================================================
   NEOMS~DATABASE — DESKTOP CORE
   Session guard, clock, start menu, context menu,
   clearance system, logout, desktop background map.
   ============================================================ */
"use strict";

var LS_KEY      = "neoms_session_personnel";
var LS_CLR_KEY  = "neoms_clearance";
var INTAKE_URL  = "/Neoms~Database/HTML/intake.html";

/* ── SESSION GUARD ───────────────────────────────────────────── */
(function () {
  try {
    sessionpersonnel = JSON.parse(localStorage.getItem(LS_KEY));
  } catch (e) {}

  /* Allow ?guest=1 to skip intake (preview/dev mode) */
  if ((!sessionpersonnel || !sessionpersonnel.fname) && /[?&]guest=1/.test(location.search)) {
    sessionpersonnel = { fname: "Guest", lname: "Operator", id: "G-0000", clr: 1,
                     dept: "SYNTHETICS", site: 62656 };
    try { localStorage.setItem(LS_KEY, JSON.stringify(sessionpersonnel)); } catch (e) {}
  }

  if (!sessionpersonnel || !sessionpersonnel.fname) {
    window.location.replace(INTAKE_URL);
  }

  /* Restore persisted clearance */
  try {
    var savedClr = parseInt(localStorage.getItem(LS_CLR_KEY), 10);
    if (!isNaN(savedClr) && savedClr >= 1 && savedClr <= 5) {
      userClearance = savedClr;
    }
  } catch (e) {}
})();

/* ── CLOCK ───────────────────────────────────────────────────── */
function updateClock() {
  var now  = new Date();
  var h    = now.getHours();
  var m    = now.getMinutes();
  var s    = now.getSeconds();
  var ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  var str = h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " " + ampm;
  var clk = document.getElementById("taskbar-clock");
  var lbl = document.getElementById("label-time");
  if (clk) clk.textContent = str;
  if (lbl) lbl.textContent = str;
}
updateClock();
setInterval(updateClock, 1000);

/* ── START MENU ──────────────────────────────────────────────── */
function toggleStart() {
  var m = document.getElementById("start-menu");
  if (m) m.style.display = m.style.display === "block" ? "none" : "block";
}
function closeStart() {
  var m = document.getElementById("start-menu");
  if (m) m.style.display = "none";
}

/* ── CONTEXT MENU ────────────────────────────────────────────── */
function closeCtx() {
  var m = document.getElementById("ctx-menu");
  if (m) m.style.display = "none";
}
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  var m = document.getElementById("ctx-menu");
  if (!m) return;
  m.style.display = "block";
  m.style.left = Math.min(e.clientX, window.innerWidth  - 200) + "px";
  m.style.top  = Math.min(e.clientY, window.innerHeight - 180) + "px";
});

/* ── GLOBAL CLICK: close menus ───────────────────────────────── */
document.addEventListener("click", function (e) {
  closeCtx();
  var sm = document.getElementById("start-menu");
  if (sm && !sm.contains(e.target) && e.target.id !== "start-btn") closeStart();
});

/* ── CLEARANCE ───────────────────────────────────────────────── */
function setClearance(level) {
  level = Math.max(1, Math.min(5, parseInt(level, 10) || 1));
  userClearance = level;
  for (var i = 1; i <= 5; i++) {
    var d = document.getElementById("cd" + i);
    if (d) d.classList.toggle("active", i <= level);
  }
  try { localStorage.setItem(LS_CLR_KEY, String(level)); } catch (e) {}
}

function cycleClearance() {
  setClearance(userClearance >= 4 ? 1 : userClearance + 1);
  var ind = document.getElementById("clearance-indicator");
  if (ind) {
    ind.style.outline = "1px solid #00eaff";
    setTimeout(function () { ind.style.outline = ""; }, 300);
  }
}

/* ── LOGOUT ──────────────────────────────────────────────────── */
function doLogout() {
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
  window.location.href = INTAKE_URL;
}

/* ── POPULATE START MENU USER INFO ───────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  if (sessionpersonnel) {
    var un = document.getElementById("sm-username");
    var uc = document.getElementById("sm-userclr");
    if (un) un.textContent = (sessionpersonnel.fname + " " + sessionpersonnel.lname).toUpperCase();
    if (uc) uc.textContent = "CLR-" + (sessionpersonnel.clr || 1);
  }
  /* Sync clearance indicator */
  setClearance(userClearance);
});

/* ── DESKTOP BACKGROUND MAP ──────────────────────────────────── */
function initDesktopBgMap() {
  if (typeof d3 === "undefined") return;
  var svgEl = document.getElementById("desktop-map-svg");
  if (!svgEl) return;

  function draw() {
    var W = svgEl.clientWidth  || svgEl.getBoundingClientRect().width  || window.innerWidth;
    var H = svgEl.clientHeight || svgEl.getBoundingClientRect().height || window.innerHeight - 48;
    if (W < 10 || H < 10) { requestAnimationFrame(draw); return; }

    var svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    var proj    = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
    var geoPath = d3.geoPath().projection(proj);
    var g       = svg.append("g");

    g.append("path")
      .datum({ type: "Sphere" })
      .attr("fill", "#020608").attr("stroke", "#061010").attr("stroke-width", 0.3)
      .attr("d", geoPath);
    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("fill", "none").attr("stroke", "#041008").attr("stroke-width", 0.2)
      .attr("d", geoPath);

    function drawCountries(world) {
      g.selectAll(".bg-country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("class", "bg-country")
        .attr("fill", "#060e0a").attr("stroke", "#081408").attr("stroke-width", 0.25)
        .attr("d", geoPath);

      if (typeof SITES !== "undefined") {
        SITES.forEach(function (site) {
          var xy = proj([site.lng, site.lat]);
          if (!xy) return;
          var breached = typeof ENTITIES !== "undefined" &&
            ENTITIES.some(function (e) { return e.site === site.id && e.status === "BREACHED"; });
          g.append("circle")
            .attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 3)
            .attr("fill", breached ? "#550000" : "#004040").attr("opacity", 0.6);
        });
      }
    }

    if (window.__worldAtlas) {
      drawCountries(window.__worldAtlas);
    } else {
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(drawCountries).catch(function () {});
    }
  }

  requestAnimationFrame(function () { requestAnimationFrame(draw); });
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(function () { requestAnimationFrame(draw); }).observe(svgEl);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initDesktopBgMap, 100);
});
