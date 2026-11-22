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
  { id: "gallery", label: "Art\nGallery", img: FOLDER_IMG },
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

/* ---- Grid helpers ----
   Every icon sits exactly on a grid cell, so two icons share a
   cell only if their left/top match. Dropping onto an occupied
   cell swaps the two icons. */
var CELL_W = 96,
  CELL_H = 100,
  PAD_X = 14,
  PAD_Y = 32,
  ROWS = 6;

function gridCols() {
  return Math.max(1, Math.floor((window.innerWidth - 90 - PAD_X) / CELL_W) + 1);
}
function gridRows() {
  return Math.max(1, Math.floor((window.innerHeight - 48 - 90 - PAD_Y) / CELL_H) + 1);
}

/* Nearest cell to a pixel position, clamped to the visible grid */
function snapToCell(x, y) {
  var col = Math.max(0, Math.min(gridCols() - 1, Math.round((x - PAD_X) / CELL_W)));
  var row = Math.max(0, Math.min(gridRows() - 1, Math.round((y - PAD_Y) / CELL_H)));
  return { x: PAD_X + col * CELL_W, y: PAD_Y + row * CELL_H };
}

function iconAt(x, y, except) {
  var found = null;
  document.querySelectorAll(".desk-icon").forEach(function (d) {
    if (d !== except && parseInt(d.style.left) === x && parseInt(d.style.top) === y) found = d;
  });
  return found;
}

/* First free cell, column-major (same order as the default layout) */
function firstFreeCell(taken) {
  var cols = gridCols(),
    rows = gridRows();
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      var x = PAD_X + c * CELL_W,
        y = PAD_Y + r * CELL_H;
      if (!taken[x + "," + y]) return { x: x, y: y };
    }
  }
  return { x: PAD_X, y: PAD_Y };
}

/* Slide an icon to a cell instead of jumping */
function moveIconAnimated(el, x, y) {
  el.classList.add("settling");
  el.style.left = x + "px";
  el.style.top = y + "px";
  setTimeout(function () {
    el.classList.remove("settling");
  }, 200);
}

function buildIcons() {
  var grid = document.getElementById("icon-grid");
  var saved = loadIconPositions();
  var taken = {};
  var fixedStacks = false;

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
    var cell = snapToCell(pos ? pos.x : defX, pos ? pos.y : defY);

    /* Un-stack icons left overlapping by older saved positions */
    if (taken[cell.x + "," + cell.y]) {
      cell = firstFreeCell(taken);
      fixedStacks = true;
    }
    taken[cell.x + "," + cell.y] = true;
    el.style.left = cell.x + "px";
    el.style.top = cell.y + "px";

    makeDraggableIcon(el, ic.id, ic.url);
    grid.appendChild(el);
  });

  if (fixedStacks) saveIconPositions();
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
        var target = snapToCell(parseInt(el.style.left), parseInt(el.style.top));
        var home = snapToCell(origLeft, origTop);

        /* Switch: the icon already in the target cell takes our old cell */
        var occupant = iconAt(target.x, target.y, el);
        if (occupant) moveIconAnimated(occupant, home.x, home.y);

        moveIconAnimated(el, target.x, target.y);
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
