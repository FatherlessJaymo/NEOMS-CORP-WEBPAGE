/* ============================================================
   NEOMS — STAFF RECORDS WINDOW
   Neoms~Database/windows/staff/staff.js
   ============================================================ */

const activeCount = STAFF.filter((s) => s.active === "Y").length;
const subtitleEl = document.getElementById("staff-subtitle");
if (subtitleEl) subtitleEl.textContent = STAFF.length + " PERSONNEL — " + activeCount + " ACTIVE";

const tbody = document.getElementById("staff-tbody");
if (tbody) {
  tbody.innerHTML = STAFF.map(
    (s) => `
    <tr>
      <td class="staff-id">${s.id}</td>
      <td class="staff-name">${s.fname} ${s.lname}</td>
      <td class="staff-pos">${s.pos}</td>
      <td class="staff-dept">${s.dept}</td>
      <td>
        <span class="clr-pip clr-${s.clr}"></span>
        <span class="staff-clr-label">CL-${s.clr}</span>
      </td>
      <td class="staff-site">${s.site ? "Site-" + s.site : "—"}</td>
      <td class="staff-status">
        <span class="${s.active === "Y" ? "staff-active" : "staff-inactive"}">
          ${s.active === "Y" ? "ACTIVE" : "INACTIVE"}
        </span>
      </td>
    </tr>`
  ).join("");
}

const legendEl = document.getElementById("staff-legend");
if (legendEl) {
  legendEl.innerHTML =
    "<span>Clearance pip legend:</span>" +
    [1, 2, 3, 4, 5].map((n) => `<span><span class="clr-pip clr-${n}"></span> CL-${n}</span>`).join(" ");
}
