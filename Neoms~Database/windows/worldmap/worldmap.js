/* =====
   NEOMS — WORLD MAP WINDOW
   Neoms~Database/windows/worldmap/worldmap.js
============ */

/* ── Stats header ───────────────────────────────────────────── */
const breachedCount = ENTITIES.filter((e) => e.status === "BREACHED").length;
const statSites = document.getElementById("nm-stat-sites");
const statBreach = document.getElementById("nm-stat-breach");
if (statSites) statSites.innerHTML = 'SITES: <span style="color:#00aa66;">' + SITES.length + "</span>";
if (statBreach) statBreach.innerHTML = 'BREACH: <span style="color:#ff3333;">' + breachedCount + " ACTIVE</span>";

/* ── Clock ──────────────────────────────────────────────────── */
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
const nmClockI = setInterval(nmTick, 1000);

/* ── Panel helpers ──────────────────────────────────────────── */
function nmShowPanel(site, breached, color) {
  const panel = document.getElementById("nm-panel");
  const ph = document.getElementById("nm-ph");
  if (!panel) return;
  panel.style.borderColor = color;
  panel.style.boxShadow = "0 0 20px " + color + "22, 0 0 40px " + color + "0a";
  if (ph) {
    ph.style.borderColor = color;
    ph.style.background = color + "10";
  }

  const breachedEnts = ENTITIES.filter((e) => e.site === site.id && e.status === "BREACHED");

  const g = (id) => document.getElementById(id);
  g("nm-pname").textContent = site.name;
  g("nm-pname").style.color = color;
  g("nm-pname").style.textShadow = "0 0 10px " + color + "88";
  g("nm-ploc").textContent = site.loc;
  g("nm-ploc").style.color = breached ? "#ff6666" : "#00aa66";
  g("nm-pents").textContent = site.entities;
  g("nm-pents").style.color = color;
  g("nm-ppersonnel").textContent = site.personnel;
  g("nm-ppersonnel").style.color = color;
  g("nm-pstatus").textContent = site.status;
  g("nm-pstatus").style.color = breached ? "#ff3333" : "#00cc66";
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
    pf.style.borderColor = color + "33";
    pf.textContent = "ACCESS LOGGED — " + new Date().toISOString().split("T")[0];
  }

  panel.style.opacity = "1";
  panel.style.transform = "translateY(0)";
  panel.style.pointerEvents = "all";
}

function nmClosePanel() {
  const panel = document.getElementById("nm-panel");
  if (!panel) return;
  panel.style.opacity = "0";
  panel.style.transform = "translateY(-8px)";
  panel.style.pointerEvents = "none";
}

window.nmClosePanel = nmClosePanel;

/* ════════════════════════════════════════════════════════════
   MAP BUILD
   ════════════════════════════════════════════════════════════ */
(function initMap() {
  if (typeof d3 === "undefined") {
    const svgEl = document.getElementById("nm-d3-svg");
    if (svgEl) {
      const msg = document.createElementNS("http://www.w3.org/2000/svg", "text");
      msg.setAttribute("x", "50%");
      msg.setAttribute("y", "50%");
      msg.setAttribute("text-anchor", "middle");
      msg.setAttribute("fill", "#335544");
      msg.setAttribute("font-family", "'Share Tech Mono',monospace");
      msg.setAttribute("font-size", "12");
      msg.textContent = "MAP DATA UNAVAILABLE — D3 NOT LOADED";
      svgEl.appendChild(msg);
    }
    return;
  }

  const svgEl = document.getElementById("nm-d3-svg");
  if (!svgEl) return;

  function mkProj(w, h) {
    return d3
      .geoNaturalEarth1()
      .scale(Math.min(w / 6.28, h / 3.14) * 0.88)
      .translate([w / 2, h / 2]);
  }

  /* ── Full redraw ─────────────────────────────────────────── */
  function redraw() {
    const rect = svgEl.getBoundingClientRect();
    const W = rect.width || svgEl.clientWidth || 800;
    const H = rect.height || svgEl.clientHeight || 500;
    if (W < 10 || H < 10) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    /* Defs */
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
    makeGlow("nm-glow-ok", "#00cccc", 4);
    makeGlow("nm-glow-breach", "#ff3333", 5);

    defs
      .append("pattern")
      .attr("id", "nm-grat")
      .attr("width", 80)
      .attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 80 0 L 0 0 0 40")
      .attr("fill", "none")
      .attr("stroke", "#051510")
      .attr("stroke-width", 0.4);

    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "#040810");
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#nm-grat)").attr("opacity", 0.7);

    let proj = mkProj(W, H);
    let geoPath = d3.geoPath().projection(proj);
    let curZoom = 1;
    const g = svg.append("g");

    /* ── Draw world from data ── */
    function drawWorld(world) {
      g.append("path")
        .datum({ type: "Sphere" })
        .attr("fill", "#020810")
        .attr("stroke", "#0a1a18")
        .attr("stroke-width", 0.4)
        .attr("d", geoPath);

      g.append("path")
        .datum(d3.geoGraticule()())
        .attr("fill", "none")
        .attr("stroke", "#061612")
        .attr("stroke-width", 0.25)
        .attr("d", geoPath);

      g.selectAll(".nm-country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter()
        .append("path")
        .attr("class", "nm-country")
        .attr("fill", "#071510")
        .attr("stroke", "#0a2010")
        .attr("stroke-width", 0.35)
        .attr("d", geoPath)
        .on("mouseover", function () {
          d3.select(this).attr("fill", "#0d1e16");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#071510");
        });

      SITES.forEach(function (site) {
        const breached = ENTITIES.some((e) => e.site === site.id && e.status === "BREACHED");
        const color = breached ? "#ff3333" : "#00cccc";
        const filterId = breached ? "nm-glow-breach" : "nm-glow-ok";
        const xy = proj([site.lng, site.lat]);
        if (!xy) return;

        const grp = g
          .append("g")
          .attr("class", "nm-site-marker")
          .attr("transform", "translate(" + xy[0] + "," + xy[1] + ")")
          .datum(site)
          .on("click", function (event, d) {
            event.stopPropagation();
            svg.selectAll(".nm-site-marker").classed("nm-selected", false);
            d3.select(this).classed("nm-selected", true);
            nmShowPanel(d, breached, color);
          });

        grp
          .append("circle")
          .attr("class", "nm-ring1")
          .attr("r", 11)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 0.9)
          .attr("opacity", 0);
        grp
          .append("circle")
          .attr("class", "nm-ring2")
          .attr("r", 18)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 0.55)
          .attr("opacity", 0);
        grp
          .append("circle")
          .attr("class", "nm-outer")
          .attr("r", 5)
          .attr("fill", "transparent")
          .attr("stroke", color)
          .attr("stroke-width", 1.5);
        grp
          .append("circle")
          .attr("class", "nm-inner")
          .attr("r", 2.2)
          .attr("fill", color)
          .style("filter", "url(#" + filterId + ")");
        grp
          .append("text")
          .attr("class", "nm-site-label")
          .attr("y", -10)
          .attr("text-anchor", "middle")
          .attr("fill", color)
          .attr("font-family", "'Share Tech Mono',monospace")
          .attr("font-size", "7px")
          .attr("paint-order", "stroke fill")
          .attr("stroke", "#020810")
          .attr("stroke-width", "3px")
          .attr("opacity", 0)
          .style("pointer-events", "none")
          .text(site.name);
      });

      svg
        .selectAll(".nm-site-marker")
        .on("mouseover.rings", function () {
          const sel = d3.select(this);
          sel
            .select(".nm-ring1")
            .attr("opacity", 1)
            .interrupt()
            .transition()
            .duration(1800)
            .ease(d3.easeCubicOut)
            .attrTween("r", () => {
              const i = d3.interpolate(5, 20);
              return (t) => i(t);
            })
            .attrTween("opacity", () => {
              const i = d3.interpolate(0.8, 0);
              return (t) => i(t);
            })
            .on("end", function () {
              d3.select(this).attr("r", 11).attr("opacity", 0);
            });
          sel
            .select(".nm-ring2")
            .attr("opacity", 1)
            .interrupt()
            .transition()
            .delay(250)
            .duration(1800)
            .ease(d3.easeCubicOut)
            .attrTween("r", () => {
              const i = d3.interpolate(8, 26);
              return (t) => i(t);
            })
            .attrTween("opacity", () => {
              const i = d3.interpolate(0.6, 0);
              return (t) => i(t);
            })
            .on("end", function () {
              d3.select(this).attr("r", 18).attr("opacity", 0);
            });
          sel.select(".nm-site-label").attr("opacity", 1);
        })
        .on("mouseout.rings", function () {
          const sel = d3.select(this);
          if (!sel.classed("nm-selected")) sel.select(".nm-site-label").attr("opacity", 0);
        });

      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 14])
        .on("zoom", function (event) {
          g.attr("transform", event.transform);
          curZoom = event.transform.k;
          const s = Math.max(0.3, 1 / Math.sqrt(curZoom));
          svg.selectAll(".nm-site-marker").each(function () {
            const mk = d3.select(this);
            mk.select(".nm-ring1")
              .attr("r", 11 * s)
              .attr("stroke-width", 0.9 * s);
            mk.select(".nm-ring2")
              .attr("r", 18 * s)
              .attr("stroke-width", 0.55 * s);
            mk.select(".nm-outer")
              .attr("r", 5 * s)
              .attr("stroke-width", 1.5 * s);
            mk.select(".nm-inner").attr("r", 2.2 * s);
            mk.select(".nm-site-label")
              .attr("y", -10 * s)
              .attr("font-size", 7 * s + "px")
              .attr("stroke-width", 3 * s + "px");
          });
          const zd = document.getElementById("nm-zoom-disp");
          if (zd) zd.innerHTML = 'ZOOM: <span style="color:#00aa66;">' + curZoom.toFixed(2) + "x</span>";
        });

      svg.call(zoom);
      svgEl.style.cursor = "grab";
      svgEl.addEventListener("mousedown", () => {
        svgEl.style.cursor = "grabbing";
      });
      svgEl.addEventListener("mouseup", () => {
        svgEl.style.cursor = "grab";
      });

      svg.on("click.bg", function () {
        svg.selectAll(".nm-site-marker").classed("nm-selected", false);
        svg.selectAll(".nm-site-label").attr("opacity", 0);
        nmClosePanel();
      });
    } /* end drawWorld() */

    /* ── FIX: use preloaded data if available, else fetch ────── */
    /* window.__worldAtlas is set by world-atlas-loader.js which
       is loaded as a <script> tag in desktop.html — no CSP issue */
    if (window.__worldAtlas) {
      try {
        drawWorld(window.__worldAtlas);
      } catch (e) {
        g.append("text")
          .attr("x", W / 2)
          .attr("y", H / 2)
          .attr("text-anchor", "middle")
          .attr("fill", "#335544")
          .attr("font-family", "'Share Tech Mono',monospace")
          .attr("font-size", 12)
          .text("MAP RENDER ERROR — " + e.message);
      }
    } else {
      /* Fallback: try d3.json() — will fail on Neocities due to CSP
         but works fine on localhost / other hosts */
      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(drawWorld)
        .catch(function () {
          g.append("text")
            .attr("x", W / 2)
            .attr("y", H / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "#335544")
            .attr("font-family", "'Share Tech Mono',monospace")
            .attr("font-size", 12)
            .text("MAP DATA UNAVAILABLE — NETWORK RESTRICTED");
        });
    }
  } /* end redraw() */

  /* Defer first draw until SVG has real layout dimensions */
  requestAnimationFrame(function () {
    requestAnimationFrame(redraw);
  });

  /* Full redraw on resize */
  if (typeof ResizeObserver !== "undefined") {
    let roTimer = null;
    const ro = new ResizeObserver(function () {
      cancelAnimationFrame(roTimer);
      roTimer = requestAnimationFrame(redraw);
    });
    ro.observe(svgEl);
  }
})();
