/* ============================================================
   NEOMS — MAIN / CONTAINMENT LOG WINDOW
   Neoms~Database/windows/main/main.js
   A picture gallery of the current entities. Each tile opens the
   entity's file in the secured viewer; entities above your
   clearance are blurred and locked.
   ============================================================ */

const subtitle = document.getElementById("main-subtitle");
if (subtitle) subtitle.textContent = ENTITIES.length + " entities currently on file";

const gallery = document.getElementById("main-gallery");
if (gallery) {
  gallery.innerHTML = ENTITIES.map(function (e) {
    const id = "E-" + String(e.id).padStart(4, "0");
    const locked = userClearance < (e.clr || 1);
    const label = locked ? id + ", CL-" + e.clr + " clearance required" : id + " " + e.name + ", " + e.status;
    return (
      '<li><button type="button" class="ml-tile' + (locked ? " ml-tile--locked" : "") + '" data-id="' + e.id + '"' +
      (locked ? ' data-clr="' + e.clr + '"' : "") + ' aria-label="' + escHtml(label) + '">' +
      (e.img ? '<img class="ml-img" src="' + escHtml(e.img) + '" alt="" loading="lazy" />' : '<span class="ml-img ml-img--none"></span>') +
      (locked ? '<span class="ml-lock" aria-hidden="true">CL-' + e.clr + " CLEARANCE REQUIRED</span>" : "") +
      '<span class="ml-cap" aria-hidden="true">' +
      '<span class="ml-id">' + id + "</span>" +
      '<span class="ml-name">' + (locked ? "██████████" : escHtml(e.name)) + "</span>" +
      (locked ? "" : '<span class="ml-status st-' + escHtml(e.status) + '">' + escHtml(e.status) + "</span>") +
      "</span></button></li>"
    );
  }).join("");

  gallery.addEventListener("click", function (ev) {
    const tile = ev.target.closest(".ml-tile");
    if (!tile) return;
    if (tile.dataset.clr) {
      toast("CL-" + tile.dataset.clr + " REQUIRED");
      return;
    }
    /* Open the entity file in the secured viewer (JS/term-fs.js) */
    const ent = ENTITIES.find(function (x) { return x.id === parseInt(tile.dataset.id, 10); });
    if (ent) termViewer("E-" + String(ent.id).padStart(4, "0"), nvEntityDoc(ent));
  });
}
