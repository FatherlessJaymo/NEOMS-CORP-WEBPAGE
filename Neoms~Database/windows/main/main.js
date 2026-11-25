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
  /* Sort by class (CLS_LABELS order), then by ID */
  const clsOrder = Object.keys(CLS_LABELS);
  const rank = function (e) {
    const i = clsOrder.indexOf(e.cls);
    return i < 0 ? clsOrder.length : i;
  };
  const sorted = ENTITIES.slice().sort(function (a, b) {
    return rank(a) - rank(b) || a.id - b.id;
  });

  gallery.innerHTML = sorted.map(function (e) {
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

  /* ── Search / filter: name or ID, class, status ──
     Locked tiles hide their name, class and status, so they only
     match an ID search with both dropdowns on "All". */
  const qIn = document.getElementById("main-q");
  const clsSel = document.getElementById("main-cls");
  const stSel = document.getElementById("main-st");
  const count = document.getElementById("main-count");

  if (clsSel) {
    clsSel.insertAdjacentHTML("beforeend", clsOrder.map(function (k) {
      return '<option value="' + k + '">' + k + " · " + escHtml(CLS_LABELS[k]) + "</option>";
    }).join(""));
  }
  if (stSel) {
    const statuses = [];
    ENTITIES.forEach(function (e) { if (e.status && statuses.indexOf(e.status) < 0) statuses.push(e.status); });
    stSel.insertAdjacentHTML("beforeend", statuses.sort().map(function (s) {
      return '<option value="' + escHtml(s) + '">' + escHtml(s) + "</option>";
    }).join(""));
  }

  const applyFilters = function () {
    const q = (qIn ? qIn.value : "").trim().toLowerCase();
    const cls = clsSel ? clsSel.value : "";
    const st = stSel ? stSel.value : "";
    let shown = 0;
    sorted.forEach(function (e, i) {
      const li = gallery.children[i];
      const locked = userClearance < (e.clr || 1);
      const id = "e-" + String(e.id).padStart(4, "0");
      const text = locked ? id + " " + e.id : id + " " + e.id + " " + String(e.name).toLowerCase();
      const ok = (!q || text.indexOf(q) >= 0) &&
        (!cls || (!locked && e.cls === cls)) &&
        (!st || (!locked && e.status === st));
      li.hidden = !ok;
      if (ok) shown++;
    });
    if (count) count.textContent = shown + " / " + sorted.length;
  };
  [qIn, clsSel, stSel].forEach(function (el) {
    if (el) el.addEventListener(el.tagName === "SELECT" ? "change" : "input", applyFilters);
  });
  applyFilters();

  gallery.addEventListener("click", function (ev) {
    const tile = ev.target.closest(".ml-tile");
    if (!tile) return;
    if (tile.dataset.clr) {
      toast("CL-" + tile.dataset.clr + " REQUIRED");
      return;
    }
    /* Open the entity file in the secured viewer (JS/term-fs.js) */
    const ent = ENTITIES.find(function (x) { return x.id === parseInt(tile.dataset.id, 10); });
    if (ent) entityRecord(ent, function () { termViewer("E-" + String(ent.id).padStart(4, "0"), nvEntityDoc(ent)); });
  });
}
