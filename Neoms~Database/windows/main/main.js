/* ============================================================
   NEOMS — MAIN / HOME WINDOW
   Neoms~Database/windows/main/main.js
   ============================================================ */

const breached     = ENTITIES.filter(e => e.status === "BREACHED").length;
const contained    = ENTITIES.filter(e => e.status === "CONTAINED").length;
const activepersonnel  = personnel.filter(s => s.active === "Y").length;
const activeSites  = SITES.filter(s => s.status === "ACTIVE").length;
const breachEvents = ENTITIES.reduce((acc, e) =>
  acc + (e.reports ? e.reports.filter(r => r.type === "BREACH").length : 0), 0);

/* Alert banner */
const alertWrap = document.getElementById("main-alert-wrap");
if (breached > 0 && alertWrap) {
  alertWrap.innerHTML = `
    <div class="alert-banner alert-banner--top">
      <div class="alert-ico">&#9888;</div>
      <div class="alert-text">
        <b>BREACH ALERT:</b> ${breached} entity/entities currently uncontained.
        Consult breach protocols immediately.
      </div>
    </div>`;
}

/* Stats */
const statsEl = document.getElementById("main-stats");
if (statsEl) {
  statsEl.innerHTML = `
    <div class="stat-box"><div class="stat-label">TOTAL ENTITIES</div><div class="stat-val warn">${ENTITIES.length}</div></div>
    <div class="stat-box"><div class="stat-label">ENTITIES CONTAINED</div><div class="stat-val ok">${contained}</div></div>
    <div class="stat-box"><div class="stat-label">ACTIVE BREACHES</div><div class="stat-val danger">${breached} ACTIVE</div></div>
    <div class="stat-box"><div class="stat-label">BREACH EVENTS</div><div class="stat-val danger">${breachEvents}</div></div>
    <div class="stat-box"><div class="stat-label">ACTIVE SITES</div><div class="stat-val ok">${activeSites}</div></div>
    <div class="stat-box"><div class="stat-label">ACTIVE personnel</div><div class="stat-val ok">${activepersonnel}</div></div>`;
}

/* Cards */
const cardsEl = document.getElementById("main-cards");
if (cardsEl) {
  cardsEl.innerHTML = `
    <div class="home-card" onclick="openWin('entities')">
      <div class="home-card-title">Entity Registry</div>
      <div class="home-card-desc">Browse all documented anomalous entities. Classification, containment status, protocols, and biological profiles.</div>
      <div class="home-card-count">${ENTITIES.length} ENTRIES</div>
    </div>
    <div class="home-card" onclick="openWin('personnel')">
      <div class="home-card-title">Personnel Records</div>
      <div class="home-card-desc">Personnel database. All active and inactive personnel, departmental assignments, and security clearances.</div>
      <div class="home-card-count">${personnel.length} RECORDS</div>
    </div>
    <div class="home-card" onclick="openWin('sites')">
      <div class="home-card-title">Containment Sites</div>
      <div class="home-card-desc">Facility profiles. Location data, active containment count, and operational status.</div>
      <div class="home-card-count">${SITES.length} SITES</div>
    </div>
    <div class="home-card" onclick="openWin('worldmap')">
      <div class="home-card-title">&#127760; Facility Map</div>
      <div class="home-card-desc">Interactive global deployment map. Pan, zoom, and click sites to view dossiers.</div>
      <div class="home-card-count home-card-count--sm">CLASSIFIED</div>
    </div>
    <div class="home-card" onclick="openWin('terminal')">
      <div class="home-card-title">Terminal Access</div>
      <div class="home-card-desc">Command-line interface. Query the database directly. Clearance-filtered results only.</div>
      <div class="home-card-count home-card-count--md">C:\\NEOMS&gt;_</div>
    </div>
    <div class="home-card" onclick="openWin('entitycreator')">
      <div class="home-card-title">&#9998; Entity Creator</div>
      <div class="home-card-desc">Build and export a new entity entry. Fill in all profile fields, descriptions, protocols, and reports.</div>
      <div class="home-card-count home-card-count--sm">NEW ENTRY</div>
    </div>`;
}
