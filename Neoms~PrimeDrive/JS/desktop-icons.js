/* ============================================================
   DESKTOP ICONS
   Absolute-positioned, draggable icons with snap-to-grid and
   localStorage position persistence.

   
============================================================ */
var FOLDER_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var NEOMIX_IMG = "Neoms~Universal-Fonts+Images/Icons/Neomix/Neomix-Sonic.jpg";
var ETC_IMG = "Neoms~Universal-Fonts+Images/Icons/App_Icons/Opera.png";

var ICONS = [
  { id: "prime", label: "Creator's\nLog", img: FOLDER_IMG },
  { id: "neomix", label: "NeoMix", img: NEOMIX_IMG },
  { id: "core", label: "Core\nDirective", img: FOLDER_IMG },
  { id: "guestbook", label: "Guest\nBook", img: FOLDER_IMG },
  { id: "sticker", label: "Sticker\nHQ", img: FOLDER_IMG },
  { id: "badges", label: "Badges", img: FOLDER_IMG },
  { id: "ranking", label: "Rankings", img: FOLDER_IMG },
  { id: "etc", label: "Etc", img: ETC_IMG },
  { id: "friendcodes", label: "Game\nCodes", img: FOLDER_IMG },
  {
    id: "database",
    label: "Neoms~\nDatabase",
    img: "Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg",
    url: "Neoms~Database/HTML/intake.html"
  }
];

var ICON_POSITIONS_KEY = "neoms_icon_positions_v2";

function loadIconPositions() {
  try {
    return JSON.parse(localStorage.getItem(ICON_POSITIONS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveIconPositions() {
  var pos = {};
  document.querySelectorAll(".desk-icon").forEach(function (el) {
    pos[el.dataset.id] = { x: parseInt(el.style.left) || 0, y: parseInt(el.style.top) || 0 };
  });
  try {
    localStorage.setItem(ICON_POSITIONS_KEY, JSON.stringify(pos));
  } catch (e) {}
}

function buildIcons() {
  var grid = document.getElementById("icon-grid");
  var saved = loadIconPositions();
  var CELL_W = 96,
    CELL_H = 100,
    PAD_X = 14,
    PAD_Y = 32,
    ROWS = 6;

  ICONS.forEach(function (ic, i) {
    var el = document.createElement("div");
    el.className = "desk-icon";
    el.dataset.id = ic.id;

    var iconHTML = ic.img
      ? '<img src="' +
        ic.img +
        '" alt="' +
        ic.label +
        '" style="width:52px;height:52px;object-fit:contain;border-radius:6px;pointer-events:none;filter:drop-shadow(0 2px 6px rgba(0,40,120,.5));"/>'
      : iconSVG(ic.id);

    el.innerHTML = iconHTML + '<span class="icon-label">' + ic.label.replace("\n", "<br/>") + "</span>";

    /* Default grid position: column-major */
    var col = Math.floor(i / ROWS),
      row = i % ROWS;
    var defX = PAD_X + col * CELL_W;
    var defY = PAD_Y + row * CELL_H;
    var pos = saved[ic.id];
    el.style.left = (pos ? pos.x : defX) + "px";
    el.style.top = (pos ? pos.y : defY) + "px";

    makeDraggableIcon(el, ic.id, ic.url);
    grid.appendChild(el);
  });
}

function makeDraggableIcon(el, id, url) {
  var startX, startY, origLeft, origTop;
  var dragging = false,
    moved = false;
  var THRESH = 6;

  el.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    startX = e.clientX;
    startY = e.clientY;
    origLeft = parseInt(el.style.left) || 0;
    origTop = parseInt(el.style.top) || 0;
    dragging = true;
    moved = false;

    document.querySelectorAll(".desk-icon").forEach(function (d) {
      d.classList.remove("selected");
    });
    el.classList.add("selected");
    el.style.zIndex = 9500;

    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - startX,
        dy = e.clientY - startY;
      if (!moved && Math.abs(dx) < THRESH && Math.abs(dy) < THRESH) return;
      moved = true;
      el.classList.add("dragging");
      var maxX = window.innerWidth - 90;
      var maxY = window.innerHeight - 48 - 90;
      el.style.left = Math.max(0, Math.min(maxX, origLeft + dx)) + "px";
      el.style.top = Math.max(22, Math.min(maxY, origTop + dy)) + "px";
    }

    function onUp() {
      dragging = false;
      el.classList.remove("dragging");
      el.style.zIndex = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      if (moved) {
        var CELL_W = 96,
          CELL_H = 100,
          PAD_X = 14,
          PAD_Y = 32;
        var cx = parseInt(el.style.left),
          cy = parseInt(el.style.top);
        var snapX = Math.round((cx - PAD_X) / CELL_W) * CELL_W + PAD_X;
        var snapY = Math.round((cy - PAD_Y) / CELL_H) * CELL_H + PAD_Y;
        snapX = Math.max(PAD_X, Math.min(window.innerWidth - 90, snapX));
        snapY = Math.max(PAD_Y, Math.min(window.innerHeight - 48 - 90, snapY));
        el.style.left = snapX + "px";
        el.style.top = snapY + "px";
        saveIconPositions();
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  el.addEventListener("dblclick", function () {
    if (moved) return;
    if (url) {
      window.open(url, "_blank");
      return;
    }
    openWin(id);
  });
}

document.addEventListener("DOMContentLoaded", buildIcons);
