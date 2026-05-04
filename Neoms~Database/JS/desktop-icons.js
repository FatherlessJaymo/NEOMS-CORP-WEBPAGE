/* ============================================================
   NEOMS~DATABASE — DESKTOP ICONS
   PrimeDrive-style: absolute-positioned, draggable, grid-snap,
   localStorage persistence.
   ============================================================ */
"use strict";

var DB_FOLDER_IMG = "/Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var DB_MAP_IMG = "/Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg";

var DB_ICONS = [
  { id: "main", label: "Containment Log", img: DB_FOLDER_IMG },
  { id: "entities", label: "Entity Records", img: DB_FOLDER_IMG },
  { id: "entity-scheme", label: "Entity Scheme", img: DB_FOLDER_IMG },
  { id: "personnel", label: "Personnel Records", img: DB_FOLDER_IMG },
  { id: "personnel-scheme", label: "Personnel Scheme", img: DB_FOLDER_IMG },
  { id: "sites", label: "Sites", img: DB_FOLDER_IMG },
  { id: "worldmap", label: "Facility\nMap", img: DB_MAP_IMG },
  { id: "terminal", label: "Terminal", img: DB_FOLDER_IMG },
  { id: "entitycreator", label: "Entity\nCreator", img: DB_FOLDER_IMG }
];

var DB_ICON_POS_KEY = "neoms_db_icon_positions_v1";

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

function buildDbIcons() {
  var grid = document.getElementById("icon-grid");
  var saved = dbLoadIconPos();
  var CELL_W = 96,
    CELL_H = 100,
    PAD_X = 14,
    PAD_Y = 32,
    ROWS = 7;

  DB_ICONS.forEach(function (ic, i) {
    var el = document.createElement("div");
    el.className = "desk-icon";
    el.dataset.id = ic.id;

    var imgHTML = ic.img
      ? '<img src="' + ic.img + '" alt="' + ic.label + '" class="icon-img">'
      : '<div class="icon-img" style="font-size:32px;display:flex;align-items:center;' +
        'justify-content:center;">&#128193;</div>';

    el.innerHTML = imgHTML + '<span class="di-label">' + ic.label.replace(/\n/g, "<br>") + "</span>";

    /* Default grid position: column-major */
    var col = Math.floor(i / ROWS);
    var row = i % ROWS;
    var defX = PAD_X + col * CELL_W;
    var defY = PAD_Y + row * CELL_H;
    var pos = saved[ic.id];
    el.style.left = (pos ? pos.x : defX) + "px";
    el.style.top = (pos ? pos.y : defY) + "px";

    dbMakeDraggableIcon(el, ic.id);
    grid.appendChild(el);
  });
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
        var CW = 96,
          CH = 100,
          PX = 14,
          PY = 32;
        var cx = parseInt(el.style.left);
        var cy = parseInt(el.style.top);
        var sx = Math.round((cx - PX) / CW) * CW + PX;
        var sy = Math.round((cy - PY) / CH) * CH + PY;
        sx = Math.max(PX, Math.min(window.innerWidth - 90, sx));
        sy = Math.max(PY, Math.min(window.innerHeight - 48 - 90, sy));
        el.style.left = sx + "px";
        el.style.top = sy + "px";
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
