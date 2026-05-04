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
  const count    = siteEnts.length;

  /* ── Entity manifest section (inside <details>) ─────────── */
  let manifestInner;

  if (clr < 3) {
    if (count > 0) {
      manifestInner = `
        <div class="site-ent-classified">
          <span class="site-ent-classified-icon">&#128274;</span>
          <div>
            <div class="site-ent-classified-label">CLASSIFIED</div>
            <div class="site-ent-classified-sub">
              ${count} record${count !== 1 ? "s" : ""} on file.
              CL-3 clearance required to view entity manifest.
            </div>
          </div>
        </div>`;
    } else {
      manifestInner = `
        <div class="site-ent-none">No entities currently assigned to this site.</div>`;
    }
  } else {
    if (count > 0) {
      const rows = siteEnts.map(e => `
        <tr class="ent-row-clickable" onclick="openWin('entity',${e.id})">
          <td class="ent-id">E-${String(e.id).padStart(4,"0")}</td>
          <td class="ent-name">${e.name}</td>
          <td><span class="class-badge class-badge--sm class-${e.cls}">${e.cls}</span></td>
          <td><span class="status-chip status-chip--sm status-${e.status}">${e.status}</span></td>
        </tr>`).join("");
      manifestInner = `
        <table class="entity-list-table">
          <thead><tr><th>ID</th><th>NAME</th><th>CLASS</th><th>STATUS</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    } else {
      manifestInner = `
        <div class="site-ent-none">No entities currently assigned to this site.</div>`;
    }
  }

  const statusCls = s.status === "BREACH" ? "site-status-breach" : "site-status-active";

  return `
    <div class="site-card">
      <div class="site-card-header">
        <span class="site-card-name">${s.name}</span>
        <span class="site-status-badge ${statusCls}">${s.status}</span>
      </div>
      <table class="site-profile-table">
        <tr><th>LOCATION</th><td class="site-loc-val">${s.loc}</td></tr>
        <tr><th>SITE ID</th><td>${s.id}</td></tr>
        <tr><th>ENTITIES</th><td>${s.entities}</td></tr>
        <tr><th>personnel</th><td>${s.personnel}</td></tr>
        <tr><th>EST.</th><td>${s.est}</td></tr>
      </table>
      <details class="manifest-details">
        <summary class="manifest-summary">
          &#9660; ENTITY MANIFEST
          <span class="manifest-count">(${count})</span>
        </summary>
        <div class="manifest-inner">${manifestInner}</div>
      </details>
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
