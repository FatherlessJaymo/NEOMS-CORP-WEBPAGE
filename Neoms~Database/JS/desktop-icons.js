/* ============================================================
   NEOMS~DATABASE — DESKTOP ICONS
   PrimeDrive-style: absolute-positioned, draggable, grid-snap,
   localStorage persistence.
   ============================================================ */
"use strict";

var DB_FOLDER_IMG = "../../Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var DB_MAP_IMG = "../../Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg";

/* Same order and names as the start menu, so every app is reachable
   from both places under one name */
var DB_ICONS = [
  { id: "main", label: "Containment\nLog", img: DB_FOLDER_IMG },
  { id: "entities", label: "Entity\nRegistry", img: DB_FOLDER_IMG },
  { id: "entity-scheme", label: "Entity\nScheme", img: DB_FOLDER_IMG },
  { id: "entitycreator", label: "Entity\nCreator", img: DB_FOLDER_IMG },
  { id: "personnel", label: "Personnel\nRecords", img: DB_FOLDER_IMG },
  { id: "personnel-scheme", label: "Personnel\nScheme", img: DB_FOLDER_IMG },
  { id: "sites", label: "Containment\nSites", img: DB_FOLDER_IMG },
  { id: "worldmap", label: "Facility\nMap", img: DB_MAP_IMG },
  { id: "terminal", label: "Terminal", img: DB_FOLDER_IMG },
  { id: "codeviewer", label: "Source\nFiles", img: DB_FOLDER_IMG }
];

/* v2: layout changed (new icon, height-aware columns) — old saved
   positions would leave gaps and stacks */
var DB_ICON_POS_KEY = "neoms_db_icon_positions_v2";

function dbLoadIconPos() {
  try {
    return JSON.parse(localStorage.getItem(DB_ICON_POS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function dbSaveIconPos() {
  var pos = {};
  document.querySelectorAll("#icon-grid .desk-icon").forEach(function (el) {
    pos[el.dataset.id] = {
      x: parseInt(el.style.left) || 0,
      y: parseInt(el.style.top) || 0
    };
  });
  try {
    localStorage.setItem(DB_ICON_POS_KEY, JSON.stringify(pos));
  } catch (e) {}
}

/* ── GRID HELPERS ────────────────────────────────────────────
   Every icon sits exactly on a grid cell, so two icons share a
   cell only if their left/top match. Dropping onto an occupied
   cell swaps the two icons. */
var DB_CELL_W = 96,
  DB_CELL_H = 100,
  DB_PAD_X = 14,
  DB_PAD_Y = 32;

function dbGridCols() {
  return Math.max(1, Math.floor((window.innerWidth - 90 - DB_PAD_X) / DB_CELL_W) + 1);
}
function dbGridRows() {
  return Math.max(1, Math.floor((window.innerHeight - 48 - 90 - DB_PAD_Y) / DB_CELL_H) + 1);
}

/* Nearest cell to a pixel position, clamped to the visible grid */
function dbSnapToCell(x, y) {
  var col = Math.max(0, Math.min(dbGridCols() - 1, Math.round((x - DB_PAD_X) / DB_CELL_W)));
  var row = Math.max(0, Math.min(dbGridRows() - 1, Math.round((y - DB_PAD_Y) / DB_CELL_H)));
  return { x: DB_PAD_X + col * DB_CELL_W, y: DB_PAD_Y + row * DB_CELL_H };
}

function dbIconAt(x, y, except) {
  var found = null;
  document.querySelectorAll("#icon-grid .desk-icon").forEach(function (d) {
    if (d !== except && parseInt(d.style.left) === x && parseInt(d.style.top) === y) found = d;
  });
  return found;
}

/* First free cell, column-major (same order as the default layout) */
function dbFirstFreeCell(taken) {
  var cols = dbGridCols(),
    rows = dbGridRows();
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      var x = DB_PAD_X + c * DB_CELL_W,
        y = DB_PAD_Y + r * DB_CELL_H;
      if (!taken[x + "," + y]) return { x: x, y: y };
    }
  }
  return { x: DB_PAD_X, y: DB_PAD_Y };
}

/* Slide an icon to a cell instead of jumping */
function dbMoveIconAnimated(el, x, y) {
  el.classList.add("settling");
  el.style.left = x + "px";
  el.style.top = y + "px";
  setTimeout(function () {
    el.classList.remove("settling");
  }, 200);
}

function buildDbIcons() {
  var grid = document.getElementById("icon-grid");
  var saved = dbLoadIconPos();
  var taken = {};
  var fixedStacks = false;
  var rows = dbGridRows();

  DB_ICONS.forEach(function (ic, i) {
    var el = document.createElement("div");
    el.className = "desk-icon";
    el.dataset.id = ic.id;

    var imgHTML = ic.img
      ? '<img src="' + ic.img + '" alt="' + ic.label + '" class="icon-img">'
      : '<div class="icon-img" style="font-size:32px;display:flex;align-items:center;' +
        'justify-content:center;">&#128193;</div>';

    el.innerHTML = imgHTML + '<span class="icon-label">' + ic.label.replace(/\n/g, "<br>") + "</span>";

    /* Default grid position: column-major, as many rows as fit */
    var col = Math.floor(i / rows);
    var row = i % rows;
    var defX = DB_PAD_X + col * DB_CELL_W;
    var defY = DB_PAD_Y + row * DB_CELL_H;
    var pos = saved[ic.id];
    var cell = dbSnapToCell(pos ? pos.x : defX, pos ? pos.y : defY);

    /* Un-stack icons left overlapping by older saved positions */
    if (taken[cell.x + "," + cell.y]) {
      cell = dbFirstFreeCell(taken);
      fixedStacks = true;
    }
    taken[cell.x + "," + cell.y] = true;
    el.style.left = cell.x + "px";
    el.style.top = cell.y + "px";

    dbMakeDraggableIcon(el, ic.id);
    grid.appendChild(el);
  });

  if (fixedStacks) dbSaveIconPos();
}

function dbMakeDraggableIcon(el, id) {
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

    document.querySelectorAll("#icon-grid .desk-icon").forEach(function (d) {
      d.classList.remove("selected");
    });
    el.classList.add("selected");
    el.style.zIndex = "9500";

    function onMove(e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
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
        var target = dbSnapToCell(parseInt(el.style.left), parseInt(el.style.top));
        var home = dbSnapToCell(origLeft, origTop);

        /* Switch: the icon already in the target cell takes our old cell */
        var occupant = dbIconAt(target.x, target.y, el);
        if (occupant) dbMoveIconAnimated(occupant, home.x, home.y);

        dbMoveIconAnimated(el, target.x, target.y);
        dbSaveIconPos();
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  el.addEventListener("dblclick", function () {
    if (moved) return;
    openWin(id);
  });
}

document.addEventListener("DOMContentLoaded", buildDbIcons);
