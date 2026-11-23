/* =====
   NEOMS — WORLD MAP WINDOW
   Neoms~Database/windows/worldmap/worldmap.js
============ */

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
  const t = new Date().toUTCString();
  el.textContent = t.split(" ")[4] + " UTC";
}
nmTick();
nmClockI = setInterval(nmTick, 1000);

/* ── Site helpers ───────────────────────────────────────────── */
function nmIsBreached(site) {
  return ENTITIES.some((e) => e.site === site.id && e.status === "BREACHED");
}
function nmColor(site) {
  return nmIsBreached(site) ? "#ff4444" : "#00e0e0";
}

/* ── Panel helpers ──────────────────────────────────────────── */
function nmShowPanel(site) {
  const panel = document.getElementById("nm-panel");
  const ph = document.getElementById("nm-ph");
  if (!panel) return;
  const breached = nmIsBreached(site);
  const color = nmColor(site);
  panel.style.borderColor = color;
  panel.style.boxShadow = "0 0 20px " + color + "22, 0 0 40px " + color + "0a";
  if (ph) {
    ph.style.borderColor = color;
    ph.style.background = color + "14";
  }

  const breachedEnts = ENTITIES.filter((e) => e.site === site.id && e.status === "BREACHED");

  const g = (id) => document.getElementById(id);
  g("nm-pname").textContent = site.name;
  g("nm-pname").style.color = color;
  g("nm-pname").style.textShadow = "0 0 10px " + color + "88";
  g("nm-ploc").textContent = site.loc;
  g("nm-ploc").style.color = breached ? "#ff8888" : "#33dd99";
  g("nm-pents").textContent = site.entities;
  g("nm-pents").style.color = color;
  g("nm-ppersonnel").textContent = site.personnel;
  g("nm-ppersonnel").style.color = color;
  g("nm-pstatus").textContent = site.status;
  g("nm-pstatus").style.color = breached ? "#ff4444" : "#33dd88";
  g("nm-pest").textContent = site.est;
  g("nm-pdesc").textContent = site.desc;

  const bb = g("nm-pbreach");
  if (bb) {
    if (breached && breachedEnts.length) {
      bb.style.display = "block";
      g("nm-pbreach-ents").textContent = breachedEnts.map((e) => e.name).join(", ");
    } else {
      bb.style.display = "none";
    }
  }
  const pf = g("nm-pfooter");
  if (pf) {
    pf.style.borderColor = color + "44";
    pf.textContent = "ACCESS LOGGED — " + new Date().toISOString().split("T")[0];
  }

  panel.classList.add("nm-panel--open");
}

function nmClosePanel() {
  const panel = document.getElementById("nm-panel");
  if (panel) panel.classList.remove("nm-panel--open");
}

window.nmClosePanel = nmClosePanel;

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
    const zd = document.getElementById("nm-zoom-disp");
    if (zd) zd.innerHTML = 'ZOOM: <span class="nm-stat-ok">' + k.toFixed(2) + "x</span>";
    /* Show every label once zoomed in enough to read them */
    svgEl.classList.toggle("nm-labels-on", k >= 3);
  }

  const zoom = d3
    .zoom()
    .scaleExtent([0.8, 40])
    .on("zoom", function (event) {
      curTransform = event.transform;
      svg.select(".nm-world").attr("transform", curTransform);
      sizeMarkers(curTransform.k);
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

  /* Smoothly centre + zoom onto a site */
  function flyTo(site) {
    if (!proj) return;
    const xy = proj([site.lng, site.lat]);
    if (!xy) return;
    const r = svgEl.getBoundingClientRect();
    const k = Math.max(curTransform.k, 6);
    const t = d3.zoomIdentity
      .translate(r.width / 2, r.height / 2)
      .scale(k)
      .translate(-xy[0], -xy[1]);
    svg.transition().duration(750).call(zoom.transform, t);
  }

  /* ── Site list (legend) — reaches markers that overlap ─────── */
  (function buildSiteList() {
    const list = document.getElementById("nm-site-list");
    if (!list) return;
    list.innerHTML = SITES.map(function (s) {
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
    list.addEventListener("click", function (e) {
      const row = e.target.closest(".nm-site-row");
      if (!row) return;
      const site = SITES.find((s) => s.id === Number(row.dataset.id));
      if (!site) return;
      selectSite(site.id);
      flyTo(site);
    });
  })();

  /* Reset view button */
  const resetBtn = document.getElementById("nm-reset");
  if (resetBtn)
    resetBtn.addEventListener("click", function () {
      clearSelection();
      svg.transition().duration(600).call(zoom.transform, d3.zoomIdentity);
    });

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

      SITES.forEach(function (site) {
        const breached = nmIsBreached(site);
        const color = nmColor(site);
        const xy = proj([site.lng, site.lat]);
        if (!xy) return;

        const grp = g
          .append("g")
          .attr("class", "nm-site-marker" + (breached ? " nm-breach" : ""))
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
