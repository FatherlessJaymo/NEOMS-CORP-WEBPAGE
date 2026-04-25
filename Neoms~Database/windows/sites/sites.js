/* ============================================================
   NEOMS — SITES WINDOW
   Neoms~Database/windows/sites/sites.js
   ============================================================ */

const subtitleEl = document.getElementById("sites-subtitle");
if (subtitleEl) subtitleEl.textContent = SITES.length + " ACTIVE INSTALLATIONS";

const wrap = document.getElementById("sites-cards-wrap");
if (!wrap) return;

/* userClearance is passed in from the window runner */
const clr = typeof userClearance !== "undefined" ? userClearance : 1;

const cardsHTML = SITES.map(s => {
  const siteEnts = ENTITIES.filter(e => e.site === s.id);

  /* ── Entity section: gate on clearance ─────────────────── */
  let entSection;

  if (clr < 3) {
    /* CL-1 / CL-2 — show count but redact all details */
    if (siteEnts.length > 0) {
      entSection = `
        <div class="page-section">
          <div class="page-section-title">Entity Manifest</div>
          <div class="site-ent-classified">
            <span class="site-ent-classified-icon">&#128274;</span>
            <div>
              <div class="site-ent-classified-label">CLASSIFIED</div>
              <div class="site-ent-classified-sub">
                ${siteEnts.length} record${siteEnts.length !== 1 ? "s" : ""} on file.
                CL-3 clearance required to view entity manifest.
              </div>
            </div>
          </div>
        </div>`;
    } else {
      entSection = `
        <div class="page-section">
          <div class="page-text page-text--dim">No entities currently assigned to this site.</div>
        </div>`;
    }
  } else {
    /* CL-3+ — full manifest */
    const entRows = siteEnts.map(e => `
      <tr class="ent-row-clickable" onclick="openWin('entity',${e.id})">
        <td class="ent-id">E-${String(e.id).padStart(4, "0")}</td>
        <td class="ent-name">${e.name}</td>
        <td><span class="class-badge class-badge--sm class-${e.cls}">${e.cls}</span></td>
        <td><span class="status-chip status-chip--sm status-${e.status}">${e.status}</span></td>
      </tr>`).join("");

    entSection = entRows
      ? `<div class="page-section">
           <div class="page-section-title">Entity Manifest</div>
           <table class="entity-list-table">
             <thead><tr><th>ID</th><th>NAME</th><th>CLASS</th><th>STATUS</th></tr></thead>
             <tbody>${entRows}</tbody>
           </table>
         </div>`
      : `<div class="page-section">
           <div class="page-text page-text--dim">No entities currently assigned to this site.</div>
         </div>`;
  }

  return `
    <div class="site-card">
      <div class="infobox infobox--narrow">
        <div class="infobox-title">${s.name} PROFILE</div>
        <div class="infobox-img infobox-img--sm"></div>
        <table class="infobox-table">
          <tr><th>ID</th><td>${s.id}</td></tr>
          <tr><th>STATUS</th><td><span class="site-status-ok">${s.status}</span></td></tr>
          <tr><th>ENTITIES</th><td>${s.entities}</td></tr>
          <tr><th>STAFF</th><td>${s.staff}</td></tr>
          <tr><th>EST.</th><td>${s.est}</td></tr>
        </table>
      </div>
      <div class="page-section">
        <div class="page-section-title">${s.name}</div>
        <div class="page-text"><b class="page-text-label">Location:</b> ${s.loc}</div><br>
        <div class="page-text">${s.desc}</div>
      </div>
      ${entSection}
    </div>`;
}).join("");

const deptTags = DEPTS.map(d =>
  `<span class="dept-tag">${d}</span>`
).join("");

wrap.innerHTML = cardsHTML + `
  <div class="site-dept-footer">
    <div class="site-dept-inner">
      Departments On-Site (all facilities):<br>${deptTags}
    </div>
  </div>`;
