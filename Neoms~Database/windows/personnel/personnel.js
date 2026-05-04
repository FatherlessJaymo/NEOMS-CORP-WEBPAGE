/* ============================================================
   NEOMS — personnel RECORDS WINDOW
   Neoms~Database/windows/personnel/personnel.js
   ============================================================ */

const activeCount = personnel.filter((s) => s.active === "Y").length;
const subtitleEl = document.getElementById("personnel-subtitle");
if (subtitleEl) subtitleEl.textContent = personnel.length + " PERSONNEL — " + activeCount + " ACTIVE";

const tbody = document.getElementById("personnel-tbody");
if (tbody) {
  tbody.innerHTML = personnel.map(
    (s) => `
    <tr>
      <td class="personnel-id">${s.id}</td>
      <td class="personnel-name">${s.fname} ${s.lname}</td>
      <td class="personnel-pos">${s.pos}</td>
      <td class="personnel-dept">${s.dept}</td>
      <td>
        <span class="clr-pip clr-${s.clr}"></span>
        <span class="personnel-clr-label">CL-${s.clr}</span>
      </td>
      <td class="personnel-site">${s.site ? "Site-" + s.site : "—"}</td>
      <td class="personnel-status">
        <span class="${s.active === "Y" ? "personnel-active" : "personnel-inactive"}">
          ${s.active === "Y" ? "ACTIVE" : "INACTIVE"}
        </span>
      </td>
    </tr>`
  ).join("");
}

const legendEl = document.getElementById("personnel-legend");
if (legendEl) {
  legendEl.innerHTML =
    "<span>Clearance pip legend:</span>" +
    [1, 2, 3, 4, 5].map((n) => `<span><span class="clr-pip clr-${n}"></span> CL-${n}</span>`).join(" ");
}
