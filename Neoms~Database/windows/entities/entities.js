/* ============================================================
   NEOMS — ENTITY REGISTRY WINDOW
   Neoms~Database/windows/entities/entities.js
   ============================================================ */

let entFilter = "ALL";

function setEntFilter(cls, btn) {
  entFilter = cls;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active-filter"));
  btn.classList.add("active-filter");
  renderEntList();
}

function renderEntList() {
  const q = (document.getElementById("ent-search") || { value: "" }).value.toLowerCase();
  const tbody = document.getElementById("ent-tbody");
  if (!tbody) return;

  const filtered = ENTITIES.filter(e => {
    if (entFilter !== "ALL" && e.cls !== entFilter) return false;
    if (q && !e.name.toLowerCase().includes(q) && !String(e.id).includes(q)) return false;
    return true;
  });

  tbody.innerHTML = filtered.map(e => `
    <tr onclick="openWin('entity',${e.id})">
      <td class="ent-id">E-${String(e.id).padStart(4, "0")}</td>
      <td class="ent-name">${e.name}</td>
      <td><span class="class-badge class-${e.cls}">${e.cls}</span></td>
      <td class="ent-ps">${e.ps}</td>
      <td><span class="status-chip status-${e.status}">${e.status}</span></td>
      <td class="ent-site">${e.site ? "Site-" + e.site : "N/A"}</td>
    </tr>`).join("") ||
    `<tr><td colspan="6" class="ent-empty">NO RECORDS MATCH CURRENT FILTER</td></tr>`;
}

renderEntList();

window.setEntFilter = setEntFilter;
window.renderEntList = renderEntList;
