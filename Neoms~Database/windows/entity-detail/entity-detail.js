/* ============================================================
   NEOMS — ENTITY DETAIL WINDOW
   Neoms~Database/windows/entity-detail/entity-detail.js
   Multi-window safe — queries by data-edid within winId body
   ============================================================ */

/* ── 1. Scoped element helper ───────────────────────────────── */
const _root = document.getElementById("wbody_" + winId);

function eid(name) {
  return _root.querySelector('[data-edid="' + name + '"]');
}

/* ── 2. Wire tab clicks (scoped to this window) ─────────────── */
_root.querySelectorAll("[data-edtab]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const tab = btn.getAttribute("data-edtab");
    _root.querySelectorAll("[data-edid^='pane-']").forEach(function (pane) {
      pane.style.display = pane.getAttribute("data-edid") === "pane-" + tab ? "block" : "none";
    });
    _root.querySelectorAll("[data-edtab]").forEach(function (b) {
      b.classList.remove("active-tab");
    });
    btn.classList.add("active-tab");
  });
});

/* ── 3. Load entity data ────────────────────────────────────── */
(function buildEntityDetail() {
  const entityId = winData;
  const e = (typeof ENTITIES !== "undefined" ? ENTITIES : []).find(function (x) {
    return x.id === entityId;
  });

  if (!e) {
    eid("pane-overview").innerHTML =
      '<div class="page-content"><div class="ed-empty-tab">' +
      '<div class="ed-empty-icon">&#10007;</div>' +
      '<div class="ed-empty-label">ENTITY NOT FOUND</div>' +
      '<div class="ed-empty-sub">No record exists for the requested entity ID.</div>' +
      "</div></div>";
    return;
  }

  /* ── Helpers ── */
  function pad(id) {
    return String(id).padStart(4, "0");
  }

  const clsNames = typeof CLS_LABELS !== "undefined" ? CLS_LABELS : {};
  const clr = typeof userClearance !== "undefined" ? userClearance : 1;

  /* ── Header ── */
  eid("breadcrumb").textContent = "NEOMS_OS > ENTITY_REGISTRY > E-" + pad(e.id);
  eid("title").textContent = e.name;
  eid("subtitle").textContent =
    "E-" + pad(e.id) + " — Class " + e.cls + " (" + (clsNames[e.cls] || e.cls) + ") — " + e.ps;

  const badge = eid("badge");
  badge.className = "class-badge class-" + e.cls;
  badge.innerHTML = e.cls + '<br><span class="class-badge__sub">' + (clsNames[e.cls] || "") + "</span>";

  /* ── personnel card builder ── */
  function buildpersonnelCard(sid) {
    const s =
      typeof personnel !== "undefined"
        ? personnel.find(function (x) {
            return x.id === sid;
          })
        : null;
    if (!s)
      return `
      <div class="ed-disc-personnel-card ed-disc-personnel-redacted">
        <div class="ed-disc-personnel-id">S-${sid}</div>
        <div class="ed-disc-personnel-name">[RECORD NOT FOUND]</div>
      </div>`;
    return `
      <div class="ed-disc-personnel-card">
        <div class="ed-disc-personnel-id">S-${s.id}</div>
        <div class="ed-disc-personnel-name">${s.fname} ${s.lname}</div>
        <div class="ed-disc-personnel-meta">
          <span>${s.pos}</span>
          <span class="clr-pip clr-${s.clr}" title="CL-${s.clr}"></span>
          <span class="ed-disc-personnel-clr">CL-${s.clr}</span>
        </div>
        <div class="ed-disc-personnel-dept">${s.dept}</div>
      </div>`;
  }

  /* ══════════════════════════════════════════════════════════
     TAB: OVERVIEW
     ══════════════════════════════════════════════════════════ */
  eid("pane-overview").innerHTML = `
    <div class="page-content">
      <div class="infobox">
        <div class="infobox-title">E-${pad(e.id)} DOSSIER</div>
        <div class="infobox-img">
          <img src="${e.img || ""}" alt="${e.name}" class="entity-img" onerror="this.remove()">
        </div>
        <table class="infobox-table">
          <tr><th>CLASS</th><td><span class="class-badge class-badge--sm class-${e.cls}">${e.cls}</span></td></tr>
          <tr><th>POWER</th><td>${e.ps}</td></tr>
          <tr><th>STATUS</th><td><span class="status-chip status-${e.status}">${e.status}</span></td></tr>
          <tr><th>CLR REQ.</th><td>CL-${e.clr}</td></tr>
          <tr><th>SITE</th><td>${e.site ? "Site-" + e.site : "N/A"}</td></tr>
          <tr><th>DISC.</th><td>${e.disc}</td></tr>
          <tr><th>SENTIENT</th><td>${e.sentient === "Y" ? "YES" : e.sentient === "N" ? "NO" : "UNKNOWN"}</td></tr>
          <tr><th>HOSTILE</th><td>${e.hostile === "Y" ? "YES" : e.hostile === "N" ? "NO" : "UNKNOWN"}</td></tr>
          <tr><th>SAFETY</th><td>${e.safety}</td></tr>
        </table>
      </div>
      <div class="page-section">
        <div class="page-section-title">Description</div>
        <div class="page-text">${e.desc}</div>
      </div>
      <div class="page-section">
        <div class="page-section-title">Anomalous Properties</div>
        <div class="page-text">${e.aprop}</div>
      </div>
    </div>`;

  /* ══════════════════════════════════════════════════════════
     TAB: BIO
     Supports e.bioImages = [ { src, caption }, ... ]
     for an image gallery scroller at the top.
     ══════════════════════════════════════════════════════════ */
  (function buildBioTab() {
    const images = Array.isArray(e.bioImages) ? e.bioImages : [];

    /* ── Image gallery (only if images provided) ── */
    let galleryHTML = "";
    if (images.length > 0) {
      const thumbs = images
        .map(function (img, i) {
          return `<div class="ed-bio-thumb ${i === 0 ? "active" : ""}" data-idx="${i}">
          <img src="${img.src}" alt="${img.caption || ""}" onerror="this.parentElement.style.display='none'">
        </div>`;
        })
        .join("");

      galleryHTML = `
        <div class="ed-bio-gallery">
          <div class="ed-bio-gallery-main" data-gallery="${winId}">
            <img class="ed-bio-gallery-img" src="${images[0].src}" alt="${images[0].caption || ""}" onerror="this.src=''">
            <div class="ed-bio-gallery-caption">${images[0].caption || ""}</div>
            <button class="ed-bio-gallery-btn ed-bio-gallery-prev" data-gallery="${winId}">&#8249;</button>
            <button class="ed-bio-gallery-btn ed-bio-gallery-next" data-gallery="${winId}">&#8250;</button>
            <div class="ed-bio-gallery-counter"><span class="ed-bio-gallery-cur">1</span> / ${images.length}</div>
          </div>
          <div class="ed-bio-gallery-thumbs">${thumbs}</div>
        </div>`;
    }

    eid("pane-bio").innerHTML = `
      <div class="page-content">
        ${galleryHTML}
        <div class="page-section">
          <div class="page-section-title">Physical Description</div>
          <div class="page-text">${e.phys}</div>
        </div>
        <div class="page-section">
          <div class="page-section-title">Dimensions</div>
          <div class="page-text">${e.dims}</div>
        </div>
        <div class="page-section">
          <div class="page-section-title">Interaction Safety Classification</div>
          <div class="page-text">${e.safety}</div>
        </div>
      </div>`;

    /* ── Wire gallery interactivity ── */
    if (images.length > 1) {
      const pane = eid("pane-bio");
      const mainImg = pane.querySelector(".ed-bio-gallery-img");
      const caption = pane.querySelector(".ed-bio-gallery-caption");
      const cur = pane.querySelector(".ed-bio-gallery-cur");
      const thumbEls = pane.querySelectorAll(".ed-bio-thumb");
      let idx = 0;

      function goTo(i) {
        idx = (i + images.length) % images.length;
        mainImg.src = images[idx].src;
        mainImg.alt = images[idx].caption || "";
        caption.textContent = images[idx].caption || "";
        cur.textContent = idx + 1;
        thumbEls.forEach(function (t) {
          t.classList.remove("active");
        });
        thumbEls[idx].classList.add("active");
        thumbEls[idx].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }

      pane.querySelector(".ed-bio-gallery-prev").addEventListener("click", function () {
        goTo(idx - 1);
      });
      pane.querySelector(".ed-bio-gallery-next").addEventListener("click", function () {
        goTo(idx + 1);
      });

      thumbEls.forEach(function (t) {
        t.addEventListener("click", function () {
          goTo(parseInt(t.getAttribute("data-idx")));
        });
      });
    }
  })();

  /* ══════════════════════════════════════════════════════════
     TAB: PROTOCOLS
     ══════════════════════════════════════════════════════════ */
  const protHTML = (e.protocols || [])
    .map(function (proto) {
      return `
    <div class="protocol-box">
      <div class="protocol-box-header">
        <span class="protocol-type ptype-${proto.type}">${proto.type} PROTOCOL</span>
        <span class="protocol-clr">CL-${proto.clr} REQUIRED</span>
      </div>
      <div class="protocol-body">${proto.desc}</div>
      <div class="protocol-meta">
        ${proto.equipment ? `<div class="protocol-meta-item">EQUIPMENT: <span class="protocol-meta-val">${proto.equipment}</span></div>` : ""}
        ${proto.duration ? `<div class="protocol-meta-item">DURATION: <span class="protocol-meta-val">${proto.duration} min</span></div>` : ""}
        ${proto.personnel ? `<div class="protocol-meta-item">PERSONNEL: <span class="protocol-meta-val">${proto.personnel}</span></div>` : ""}
      </div>
    </div>`;
    })
    .join("");

  eid("pane-protocols").innerHTML = '<div class="page-content">' + protHTML + "</div>";
  const protCount = (e.protocols || []).length;
  eid("tab-protocols").textContent = protCount ? "PROTOCOLS (" + protCount + ")" : "PROTOCOLS";

  /* ══════════════════════════════════════════════════════════
     TAB: SOURCE
     ══════════════════════════════════════════════════════════ */
  (function buildSourceTab() {
    let rawSources = [];
    if (Array.isArray(e.sources) && e.sources.length > 0) {
      rawSources = e.sources;
    } else if (e.source && typeof e.source === "object") {
      if (e.source.video)
        rawSources.push({ type: "youtube", label: null, url: "https://www.youtube.com/watch?v=" + e.source.video });
      if (e.source.wiki) rawSources.push({ type: "wiki", label: e.source.wikiLabel || null, url: e.source.wiki });
      if (e.source.notes) rawSources.push({ type: "notes", label: null, url: null, notes: e.source.notes });
    }

    const parts = [];
    const videos = rawSources.filter(function (s) {
      return s.type === "youtube";
    });
    const wikis = rawSources.filter(function (s) {
      return s.type === "wiki";
    });
    const notes = rawSources.filter(function (s) {
      return s.type === "notes";
    });

    if (videos.length > 0) {
      const videoHTML = videos
        .map(function (s) {
          let vid = s.url || "";
          const ytMatch = vid.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
          if (ytMatch) vid = ytMatch[1];
          const label = s.label ? `<div class="ed-source-label">${s.label}</div>` : "";
          return `
          <div class="ed-source-video-item">
            ${label}
            <div class="ed-video-wrap">
              <iframe class="ed-video-frame"
                src="https://www.youtube.com/embed/${vid}"
                title="${s.label || "Entity Reference — E-" + pad(e.id)}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>
          </div>`;
        })
        .join("");
      parts.push(
        `<div class="page-section"><div class="page-section-title">Video Reference${videos.length > 1 ? "s" : ""}</div>${videoHTML}</div>`
      );
    }

    if (wikis.length > 0) {
      const linkHTML = wikis
        .map(function (s) {
          return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="ed-wiki-link"><span class="ed-wiki-icon">&#128279;</span>${s.label || s.url}</a>`;
        })
        .join("");
      parts.push(
        `<div class="page-section"><div class="page-section-title">External Reference${wikis.length > 1 ? "s" : ""}</div>${linkHTML}<div class="page-text ed-wiki-note">External links — open in a new tab. Not verified by NeoMS Research Division.</div></div>`
      );
    }

    notes.forEach(function (n) {
      if (n.notes || n.label) {
        parts.push(
          `<div class="page-section"><div class="page-section-title">Research Notes</div><div class="page-text">${n.notes || n.label}</div></div>`
        );
      }
    });

    if (parts.length === 0) {
      parts.push(
        `<div class="ed-empty-tab"><div class="ed-empty-icon">&#128220;</div><div class="ed-empty-label">NO SOURCE MATERIAL ON FILE</div><div class="ed-empty-sub">No video reference or external wiki has been logged for this entity.</div></div>`
      );
    }

    eid("pane-source").innerHTML = '<div class="page-content">' + parts.join("") + "</div>";
    const srcCount = videos.length + wikis.length;
    eid("tab-source").textContent = srcCount ? "SOURCE (" + srcCount + ")" : "SOURCE";
  })();

  /* ══════════════════════════════════════════════════════════
     TAB: DISCOVERY
     ══════════════════════════════════════════════════════════ */
  (function buildDiscoveryTab() {
    const disc = e.discovery || {};
    const parts = [];

    if (disc.date || disc.location) {
      parts.push(`
        <div class="page-section">
          <div class="page-section-title">Discovery Record</div>
          <table class="infobox-table ed-disc-table">
            ${disc.date ? `<tr><th>DATE</th><td>${disc.date}</td></tr>` : ""}
            ${disc.location ? `<tr><th>LOCATION</th><td>${disc.location}</td></tr>` : ""}
          </table>
        </div>`);
    }

    if (e.discoveredBy != null) {
      parts.push(`
        <div class="page-section">
          <div class="page-section-title">Original Creator / Source</div>
          <div class="ed-disc-personnel-grid">${buildpersonnelCard(e.discoveredBy)}</div>
        </div>`);
    }

    const contribs = Array.isArray(e.contributors)
      ? e.contributors.filter(function (id) {
          return id != null;
        })
      : [];
    if (contribs.length > 0) {
      parts.push(`
        <div class="page-section">
          <div class="page-section-title">Contributors</div>
          <div class="ed-disc-personnel-grid">${contribs.map(buildpersonnelCard).join("")}</div>
        </div>`);
    }

    if (disc.context) {
      parts.push(`
        <div class="page-section">
          <div class="page-section-title">Discovery Context</div>
          <div class="page-text">${disc.context}</div>
        </div>`);
    }

    if (parts.length === 0) {
      parts.push(`
        <div class="ed-empty-tab">
          <div class="ed-empty-icon">&#128065;</div>
          <div class="ed-empty-label">DISCOVERY DATA UNAVAILABLE</div>
          <div class="ed-empty-sub">No discovery record has been filed. Refer to PRIME DIRECTOR for access.</div>
        </div>`);
    }

    eid("pane-discovery").innerHTML = '<div class="page-content">' + parts.join("") + "</div>";
  })();

  /* ══════════════════════════════════════════════════════════
     TAB: REPORTS
     — Filter chips: ALL | INCIDENT | BREACH | SIGHTING | OBSERVATION
     — Sort toggle: NEWEST / OLDEST (by date string)
     ══════════════════════════════════════════════════════════ */
  (function buildReportsTab() {
    const reports = e.reports || [];

    if (reports.length === 0) {
      eid("pane-reports").innerHTML = `
        <div class="page-content">
          <div class="ed-empty-tab">
            <div class="ed-empty-icon">&#128196;</div>
            <div class="ed-empty-label">NO INCIDENT REPORTS ON FILE</div>
            <div class="ed-empty-sub">No sightings, incidents, or observational reports have been logged for this entity.</div>
          </div>
        </div>`;
      eid("tab-reports").textContent = "REPORTS";
      return;
    }

    eid("tab-reports").textContent = "REPORTS (" + reports.length + ")";

    const TYPE_COLORS = {
      INCIDENT: "#ff3366",
      SIGHTING: "#ffaa00",
      BREACH: "#ff0000",
      OBSERVATION: "#4488ff"
    };

    /* ── Build toolbar ── */
    const allTypes = ["ALL", "INCIDENT", "BREACH", "SIGHTING", "OBSERVATION"];
    const chipHTML = allTypes
      .map(function (t) {
        const col = t === "ALL" ? "#667788" : TYPE_COLORS[t] || "#667788";
        return `<button class="ed-rpt-chip ${t === "ALL" ? "active" : ""}" data-type="${t}" style="--chip-col:${col}">${t}</button>`;
      })
      .join("");

    const toolbarHTML = `
      <div class="ed-rpt-toolbar">
        <div class="ed-rpt-chips">${chipHTML}</div>
        <button class="ed-rpt-sort" data-sort="desc" title="Sort order">NEW &#8595;</button>
      </div>`;

    /* ── Build a single report card ── */
    function buildCard(r) {
      const col = TYPE_COLORS[r.type] || "#667788";
      const locked = r.clr && clr < r.clr;
      const author =
        r.author && typeof personnel !== "undefined"
          ? personnel.find(function (x) {
              return x.id === r.author;
            })
          : null;

      const summaryHTML = locked
        ? `<div class="ed-report-locked"><span>&#128274;</span> SUMMARY CLASSIFIED — CL-${r.clr} CLEARANCE REQUIRED</div>`
        : `<div class="page-text ed-report-summary">${r.summary || "No summary provided."}</div>`;

      const fileHTML = r.fileUrl
        ? `<a href="${r.fileUrl}" target="_blank" rel="noopener noreferrer" class="ed-report-file">&#128196; ${r.file || "VIEW FILE"}</a>`
        : r.file
          ? `<span class="ed-report-file-offline">&#128196; ${r.file} <span class="ed-report-file-note">(OFFLINE)</span></span>`
          : "";

      const contribHTML =
        Array.isArray(r.contributors) && r.contributors.length > 0
          ? `<span class="ed-report-contribs">With: ${r.contributors
              .map(function (sid) {
                const s =
                  typeof personnel !== "undefined"
                    ? personnel.find(function (x) {
                        return x.id === sid;
                      })
                    : null;
                return s ? s.fname + " " + s.lname + " (S-" + s.id + ")" : "S-" + sid;
              })
              .join(", ")}</span>`
          : "";

      return `
    <div class="ed-report-card" style="border-left-color:${col};" data-type="${r.type || ""}" data-date="${r.date || ""}">
      <div class="ed-report-header">
        <div>
          <span class="ed-report-type" style="color:${col};">${r.type || "REPORT"}</span>
          <span class="ed-report-title">${r.title}${r.subtitle ? " (" + r.subtitle + ")" : ""}</span>
        </div>
        <div class="ed-report-date">${r.date || ""}</div>
      </div>
      ${summaryHTML}
      <div class="ed-report-footer">
        ${fileHTML}
        ${author ? `<span class="ed-report-author">Filed: ${author.fname} ${author.lname} (S-${author.id})</span>` : ""}
        ${contribHTML}
        ${r.clr ? `<span class="ed-report-clr">CL-${r.clr}+</span>` : ""}
      </div>
    </div>`;
    }

    /* ── Render cards list ── */
    const listId = winId + "_rpt_list";
    eid("pane-reports").innerHTML = `
      <div class="page-content">
        ${toolbarHTML}
        <div id="${listId}" class="ed-rpt-list">
          ${reports.map(buildCard).join("")}
        </div>
      </div>`;

    /* ── Filter + sort state ── */
    let activeType = "ALL";
    let sortDir = "desc";

    const pane = eid("pane-reports");
    const listEl = document.getElementById(listId);
    const sortBtn = pane.querySelector(".ed-rpt-sort");
    const chips = pane.querySelectorAll(".ed-rpt-chip");

    function applyFilterSort() {
      const cards = Array.from(listEl.querySelectorAll(".ed-report-card"));

      /* Filter */
      cards.forEach(function (card) {
        const t = card.getAttribute("data-type");
        card.style.display = activeType === "ALL" || t === activeType ? "" : "none";
      });

      /* Sort visible cards by date string */
      const visible = cards.filter(function (c) {
        return c.style.display !== "none";
      });
      visible.sort(function (a, b) {
        const da = a.getAttribute("data-date") || "";
        const db = b.getAttribute("data-date") || "";
        return sortDir === "desc" ? db.localeCompare(da) : da.localeCompare(db);
      });
      visible.forEach(function (c) {
        listEl.appendChild(c);
      });

      /* Empty state */
      const anyVisible = cards.some(function (c) {
        return c.style.display !== "none";
      });
      let empty = listEl.querySelector(".ed-rpt-empty");
      if (!anyVisible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "ed-rpt-empty";
          empty.textContent = "NO REPORTS MATCH THIS FILTER";
          listEl.appendChild(empty);
        }
      } else {
        if (empty) empty.remove();
      }
    }

    /* Chip clicks */
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("active");
        });
        chip.classList.add("active");
        activeType = chip.getAttribute("data-type");
        applyFilterSort();
      });
    });

    /* Sort toggle */
    sortBtn.addEventListener("click", function () {
      sortDir = sortDir === "desc" ? "asc" : "desc";
      sortBtn.textContent = sortDir === "desc" ? "NEW \u2193" : "OLD \u2191";
      applyFilterSort();
    });

    applyFilterSort();
  })();
})(); /* end buildEntityDetail */
