/* ============================================================
   STICKER HQ
   Tray items fetched from Neoms~PrimeDrive/HTML/sticker-tray.html
   Board persisted to localStorage.
============================================================ */
var STICKER_KEY = "neoms_sticker_board_v3";
var board = null;

function initStickerTray() {
  board = document.getElementById("Sticker-Board");
  var tray     = document.getElementById("Sticker-Tray");
  var clearBtn = document.getElementById("sticker-clear-btn");
  var upload   = document.getElementById("Sticker-Upload");

  if (clearBtn) clearBtn.addEventListener("click", function () {
    board.querySelectorAll(".Sticker").forEach(function (s) { s.remove(); });
    saveBoard(); updateStickerCount();
  });
  if (upload) upload.addEventListener("change", function () {
    var file = this.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) { spawnSticker(e.target.result, 40 + Math.random() * 20, 35 + Math.random() * 20, null); };
    reader.readAsDataURL(file); this.value = "";
  });

  fetch("Neoms~PrimeDrive/windows/sticker-hq/sticker-tray.html?nc=" + Date.now())
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var parser = new DOMParser();
      var doc    = parser.parseFromString("<div>" + html + "</div>", "text/html");
      if (!tray) return;
      tray.innerHTML = '<input type="file" id="Sticker-Upload" accept="image/*" style="display:none"/>';
      doc.querySelectorAll(".Tray-Sticker").forEach(function (el) {
        var node = document.importNode(el, true);
        wireTray(node, tray);
        tray.appendChild(node);
      });
      appendUploadBtn(tray);
      var newUp = document.getElementById("Sticker-Upload");
      if (newUp) newUp.addEventListener("change", function () {
        var file = this.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) { spawnSticker(e.target.result, 40, 40, null); };
        reader.readAsDataURL(file); this.value = "";
      });
    })
    .catch(function () {
      if (!tray) return;
      tray.querySelectorAll(".Tray-Sticker").forEach(function (el) { wireTray(el, tray); });
      appendUploadBtn(tray);
    });

  loadBoard();
  maybeEasterEgg();
}

function wireTray(div, tray) {
  var src = div.getAttribute("data-src");
  div.className = "tray-item"; div.style.cssText = "";
  var img = div.querySelector("img");
  if (img) { img.style.width = "42px"; img.style.height = "42px"; img.style.objectFit = "contain"; }
  var lbl = div.querySelector("span");
  if (lbl) lbl.className = "tray-label";
  div.addEventListener("click", function () { spawnSticker(src, 35 + Math.random() * 30, 30 + Math.random() * 30, null); });
}

function appendUploadBtn(tray) {
  var lbl = document.createElement("label");
  lbl.className = "upload-btn"; lbl.htmlFor = "Sticker-Upload"; lbl.title = "Upload sticker";
  lbl.innerHTML = '<span class="upload-icon">+</span><span class="tray-label">Upload</span>';
  tray.appendChild(lbl);
}

function spawnSticker(src, px, py, sizePx) {
  if (!board) board = document.getElementById("Sticker-Board");
  var el = document.createElement("div");
  el.className = "Sticker";
  el.style.cssText = "position:absolute;cursor:grab;user-select:none;touch-action:none;display:inline-block;pointer-events:auto;";
  el.style.left = (window.innerWidth  * px) / 100 + "px";
  el.style.top  = (window.innerHeight * py) / 100 + "px";
  el.dataset.px = px; el.dataset.py = py;
  var w = sizePx || 100; el.dataset.w = w;
  var img = document.createElement("img");
  img.src = src; img.alt = "sticker"; img.draggable = false;
  img.style.cssText = "width:" + w + "px;height:auto;display:block;border-radius:6px;pointer-events:none;user-select:none;filter:drop-shadow(0 4px 12px rgba(0,0,0,.6));";
  var del = document.createElement("button");
  del.textContent = "×"; del.title = "Remove";
  del.style.cssText = "position:absolute;top:-10px;right:-10px;width:22px;height:22px;background:crimson;color:#fff;border:none;border-radius:50%;font-size:14px;line-height:22px;text-align:center;cursor:pointer;display:none;z-index:2;padding:0;font-family:monospace;";
  el.addEventListener("mouseenter", function () { del.style.display = "block"; });
  el.addEventListener("mouseleave", function () { del.style.display = "none"; });
  del.addEventListener("click", function (e) { e.stopPropagation(); el.remove(); saveBoard(); updateStickerCount(); });
  el.appendChild(img); el.appendChild(del);
  el.addEventListener("mousedown", function (e) {
    if (e.target === del) return; e.preventDefault();
    var sx = e.clientX, sy = e.clientY, ol = parseFloat(el.style.left) || 0, ot = parseFloat(el.style.top) || 0;
    el.style.zIndex = 9999;
    function mv(e) {
      var nl = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  ol + (e.clientX - sx)));
      var nt = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, ot + (e.clientY - sy)));
      el.style.left = nl + "px"; el.style.top = nt + "px";
      el.dataset.px = (nl / window.innerWidth)  * 100;
      el.dataset.py = (nt / window.innerHeight) * 100;
    }
    function up() { el.style.zIndex = 9000; saveBoard(); document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); }
    document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
  });
  board.appendChild(el); saveBoard(); updateStickerCount(); return el;
}

function updateStickerCount() {
  var c = document.getElementById("Sticker-Count");
  if (c && board) c.textContent = board.querySelectorAll(".Sticker").length;
}
function saveBoard() {
  var data = [];
  if (board) board.querySelectorAll(".Sticker").forEach(function (s) {
    var img = s.querySelector("img");
    data.push({ src: img ? img.src : "", px: parseFloat(s.dataset.px) || 40, py: parseFloat(s.dataset.py) || 40, w: parseFloat(s.dataset.w) || 100 });
  });
  try { localStorage.setItem(STICKER_KEY, JSON.stringify(data)); } catch (e) {}
}
function loadBoard() {
  try {
    var saved = JSON.parse(localStorage.getItem(STICKER_KEY) || "[]");
    saved.forEach(function (s) { spawnSticker(s.src, s.px, s.py, s.w || 100); });
  } catch (e) {}
}
function maybeEasterEgg() {
  try {
    var d = JSON.parse(localStorage.getItem(STICKER_KEY) || "[]");
    if (d.length === 0) spawnSticker("Neoms~Universal-Fonts+Images/Stickers/Metal-Sonk.jpg", 70, 55, 110);
  } catch (e) {}
}
