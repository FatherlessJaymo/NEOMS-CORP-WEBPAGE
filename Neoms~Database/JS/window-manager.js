/* ============================================================
   NEOMS~DATABASE — WINDOW MANAGER
   PrimeDrive-style chrome: WIN_DEFS, open/close/min/max,
   drag, resize, taskbar buttons.
   Window content loaded via fetch (HTML/CSS/JS per folder).
   ============================================================ */
"use strict";

var WIN_BASE  = "/Neoms~Database/windows/";
var FOLDER_IMG = "/Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";

var zTop  = 200;
var wins  = {};
var tbBtns = {};

/* Session + clearance globals (set by desktop-core.js) */
var sessionStaff  = null;
var userClearance = 1;

/* ── WINDOW DEFINITIONS ──────────────────────────────────────── */
var WIN_DEFS = {
  main:           { title: "CONTAINMENT LOG",        w: 720, h: 560 },
  entities:       { title: "ENTITY REGISTRY",         w: 680, h: 480, clr: 3 },
  "entity-scheme":{ title: "ENTITY CLASS. SCHEME",    w: 760, h: 580 },
  staff:          { title: "STAFF RECORDS",           w: 750, h: 480 },
  "staff-scheme": { title: "PERSONNEL SCHEME",        w: 700, h: 560 },
  sites:          { title: "CONTAINMENT SITES",       w: 680, h: 560 },
  worldmap:       { title: "GLOBAL FACILITY MAP",     w: 960, h: 600 },
  terminal:       { title: "NEOMS TERMINAL v1.0",     w: 580, h: 400 },
  entitycreator:  { title: "ENTITY CREATOR",           w: 860, h: 580 }
};

/* ── OPEN ────────────────────────────────────────────────────── */
function openWin(type, data) {
  /* Entity sub-window (detail view) */
  if (type === "entity" && data !== undefined) {
    var eid = "entity_" + data;
    if (wins[eid]) { focusWin(eid); return; }
    _spawnWin(eid, "ENTITY " + String(data).padStart(4, "0"), 660, 560, "entity-detail", data);
    return;
  }

  if (wins[type]) { focusWin(type); return; }

  var def = WIN_DEFS[type];
  if (!def) return;

  /* Clearance gate */
  if (def.clr && userClearance < def.clr) {
    toast("CL-" + def.clr + " REQUIRED");
    termPrint(def.title + " requires CL-" + def.clr + ". Current: CL-" + userClearance + ".", "err");
    return;
  }

  _spawnWin(type, def.title, def.w, def.h, type, data);
}

/* ── INTERNAL SPAWN ──────────────────────────────────────────── */
function _spawnWin(id, title, w, h, winType, data) {
  var vw = window.innerWidth;
  var vh = window.innerHeight - 48 - 24;
  var x  = Math.max(10, Math.min(vw - w - 10, 60 + Object.keys(wins).length * 22));
  var y  = Math.max(28, Math.min(vh - h - 10, 60 + Object.keys(wins).length * 22));

  var win = document.createElement("div");
  win.className = "win opening";
  win.id = "win-" + id;
  win.style.cssText =
    "left:" + x + "px;" +
    "top:"  + (y + 24) + "px;" +
    "width:" + w + "px;" +
    "height:" + h + "px;";

  /* Title bar */
  var bar = document.createElement("div");
  bar.className = "win-bar";
  bar.innerHTML =
    '<img src="' + FOLDER_IMG + '" class="win-bar-img" alt="" ' +
    'style="width:16px;height:16px;object-fit:contain;border-radius:3px;flex-shrink:0;">' +
    '<span class="win-title">' + title + '</span>' +
    '<div class="win-btns">' +
    '<button class="win-btn win-min"   onclick="minWin(\'' + id + '\')">-</button>' +
    '<button class="win-btn win-max"   onclick="maxWin(\'' + id + '\')">&#9633;</button>' +
    '<button class="win-btn win-close" onclick="closeWin(\'' + id + '\')">&#215;</button>' +
    '</div>';
  win.appendChild(bar);

  /* Body */
  var body = document.createElement("div");
  body.className = "win-body";
  var scroll = document.createElement("div");
  scroll.className = "win-scroll";
  scroll.id = "wbody_" + id;
  scroll.innerHTML =
    '<div style="padding:20px;color:#00cccc;font-family:\'Share Tech Mono\',monospace;' +
    'font-size:11px;letter-spacing:1px;">LOADING&#8230;</div>';
  body.appendChild(scroll);
  win.appendChild(body);

  /* Resize handle */
  var rsz = document.createElement("div");
  rsz.className = "win-resize";
  win.appendChild(rsz);

  document.getElementById("desktop").appendChild(win);
  wins[id] = {
    el: win, minimized: false, maximized: false,
    ox: x, oy: y + 24, ow: w, oh: h
  };

  setTimeout(function () { win.classList.remove("opening"); }, 260);
  makeDraggable(win, bar);
  makeResizable(win, rsz);
  focusWin(id);
  addTBBtn(id, title);
  _loadContent(id, winType, data);
}

/* ── FETCH CONTENT ───────────────────────────────────────────── */
function _loadContent(id, winType, data) {
  var htmlUrl = WIN_BASE + winType + "/" + winType + ".html";
  fetch(htmlUrl)
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(function (html) {
      var body = document.getElementById("wbody_" + id);
      if (!body) return;
      body.innerHTML = html;

      /* CSS */
      var cssId = "wincss_" + winType;
      if (!document.getElementById(cssId)) {
        var lnk = document.createElement("link");
        lnk.id  = cssId;
        lnk.rel = "stylesheet";
        lnk.href = WIN_BASE + winType + "/" + winType + ".css";
        document.head.appendChild(lnk);
      }

      /* JS */
      fetch(WIN_BASE + winType + "/" + winType + ".js")
        .then(function (r2) {
          if (!r2.ok) throw new Error("HTTP " + r2.status);
          return r2.text();
        })
        .then(function (js) {
          var fn = new Function(
            "winId", "winData",
            "ENTITIES", "STAFF", "SITES", "DEPTS", "CLS_LABELS",
            "sessionStaff", "userClearance",
            "openWin", "closeWin", "termPrint", "termRun",
            js
          );
          fn(
            id, data,
            typeof ENTITIES    !== "undefined" ? ENTITIES    : [],
            typeof STAFF       !== "undefined" ? STAFF       : [],
            typeof SITES       !== "undefined" ? SITES       : [],
            typeof DEPTS       !== "undefined" ? DEPTS       : {},
            typeof CLS_LABELS  !== "undefined" ? CLS_LABELS  : {},
            sessionStaff, userClearance,
            openWin, closeWin, termPrint, termRun
          );
        })
        .catch(function (err) {
          console.warn("Window JS load failed [" + winType + "]:", err.message);
        });
    })
    .catch(function (err) {
      var body = document.getElementById("wbody_" + id);
      if (body)
        body.innerHTML =
          '<div style="padding:20px;font-family:\'Share Tech Mono\',monospace;' +
          'font-size:11px;color:#553333;">WINDOW UNAVAILABLE<br>' +
          '<span style="color:#2a2a3a;">' + err.message + '</span><br>' +
          '<span style="color:#1a2a2a;">Path: ' + htmlUrl + '</span></div>';
    });
}

/* ── FOCUS ───────────────────────────────────────────────────── */
function focusWin(id) {
  document.querySelectorAll(".win").forEach(function (w) {
    w.classList.remove("focused");
  });
  if (!wins[id]) return;
  zTop++;
  wins[id].el.style.zIndex = zTop;
  wins[id].el.classList.add("focused");

  document.querySelectorAll(".tb-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  if (tbBtns[id]) tbBtns[id].classList.add("active");
}

/* ── CLOSE ───────────────────────────────────────────────────── */
function closeWin(id) {
  if (!wins[id]) return;
  var el = wins[id].el;
  el.classList.add("closing");
  setTimeout(function () {
    el.remove();
  }, 200);
  delete wins[id];
  if (tbBtns[id]) {
    tbBtns[id].remove();
    delete tbBtns[id];
  }
}

/* ── MINIMISE ────────────────────────────────────────────────── */
function minWin(id) {
  if (!wins[id]) return;
  var w = wins[id];
  if (w.minimized) {
    w.el.style.display = "";
    w.minimized = false;
    focusWin(id);
    if (tbBtns[id]) tbBtns[id].classList.add("active");
  } else {
    w.el.style.display = "none";
    w.minimized = true;
    document.querySelectorAll(".tb-btn").forEach(function (b) {
      b.classList.remove("active");
    });
  }
}

/* ── MAXIMISE ────────────────────────────────────────────────── */
function maxWin(id) {
  if (!wins[id]) return;
  var w = wins[id];
  if (w.maximized) {
    w.el.style.cssText =
      "left:" + w.ox + "px;top:" + w.oy + "px;" +
      "width:" + w.ow + "px;height:" + w.oh + "px;" +
      "z-index:" + zTop + ";";
    w.maximized = false;
  } else {
    w.ox = parseInt(w.el.style.left)   || 0;
    w.oy = parseInt(w.el.style.top)    || 0;
    w.ow = parseInt(w.el.style.width)  || 600;
    w.oh = parseInt(w.el.style.height) || 400;
    w.el.style.cssText =
      "left:0;top:22px;width:100%;height:calc(100% - 22px);" +
      "z-index:" + zTop + ";";
    w.maximized = true;
  }
  w.el.classList.add("focused");
}

/* ── TASKBAR BUTTON ──────────────────────────────────────────── */
function addTBBtn(id, title) {
  var btn = document.createElement("button");
  btn.className = "tb-btn active";
  btn.innerHTML =
    '<img src="' + FOLDER_IMG + '" alt="" ' +
    'style="width:14px;height:14px;object-fit:contain;border-radius:2px;flex-shrink:0;">' +
    '<span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;' +
    'white-space:nowrap;">' + title.slice(0, 14) + '</span>';
  btn.addEventListener("click", function () {
    if (!wins[id]) return;
    if (wins[id].minimized) minWin(id);
    else if (wins[id].el.classList.contains("focused")) minWin(id);
    else focusWin(id);
  });
  document.getElementById("tb-buttons").appendChild(btn);
  tbBtns[id] = btn;
}

/* ── DRAG ────────────────────────────────────────────────────── */
function makeDraggable(win, bar) {
  var sx, sy, sl, st;
  bar.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("win-btn") ||
        e.target.closest(".win-btns")) return;
    var id = win.id.replace("win-", "");
    focusWin(id);
    sx = e.clientX; sy = e.clientY;
    sl = parseInt(win.style.left) || 0;
    st = parseInt(win.style.top)  || 0;
    function mv(e) {
      win.style.left = Math.max(0, sl + (e.clientX - sx)) + "px";
      win.style.top  = Math.max(24, st + (e.clientY - sy)) + "px";
    }
    function up() {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseup", up);
    e.preventDefault();
  });

  /* Touch support */
  bar.addEventListener("touchstart", function (e) {
    if (e.target.closest(".win-btns")) return;
    var id = win.id.replace("win-", "");
    focusWin(id);
    var t = e.touches[0];
    sx = t.clientX; sy = t.clientY;
    sl = parseInt(win.style.left) || 0;
    st = parseInt(win.style.top)  || 0;
    e.preventDefault();
  }, { passive: false });
  bar.addEventListener("touchmove", function (e) {
    var t = e.touches[0];
    win.style.left = Math.max(0, sl + (t.clientX - sx)) + "px";
    win.style.top  = Math.max(24, st + (t.clientY - sy)) + "px";
    e.preventDefault();
  }, { passive: false });
}

/* ── RESIZE ──────────────────────────────────────────────────── */
function makeResizable(win, handle) {
  handle.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var sw = parseInt(win.style.width)  || 400;
    var sh = parseInt(win.style.height) || 300;
    var sx = e.clientX, sy = e.clientY;
    function mv(e) {
      win.style.width  = Math.max(320, sw + (e.clientX - sx)) + "px";
      win.style.height = Math.max(180, sh + (e.clientY - sy)) + "px";
    }
    function up() {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseup", up);
  });
}

/* ── GLOBAL CLICK: focus windows, deselect icons ─────────────── */
document.addEventListener("click", function (e) {
  var win = e.target.closest(".win");
  if (win) {
    var id = win.id.replace("win-", "");
    focusWin(id);
  }
  if (!e.target.closest(".desk-icon") && !e.target.closest(".win")) {
    document.querySelectorAll(".desk-icon").forEach(function (d) {
      d.classList.remove("selected");
    });
  }
});

/* ── TERMINAL FUNCTIONS (globals needed by window HTML) ───────── */
var termHistory = [];
var termHIdx    = -1;

function termKey(e) {
  var inp = document.getElementById("term-in");
  if (!inp) return;
  if (e.key === "Enter") {
    var cmd = inp.value.trim();
    if (cmd) {
      termHistory.unshift(cmd);
      termHIdx = -1;
      termPrint("C:\\NEOMS> " + cmd);
      termRun(cmd);
      inp.value = "";
    }
  } else if (e.key === "ArrowUp") {
    if (termHIdx < termHistory.length - 1) inp.value = termHistory[++termHIdx] || "";
  } else if (e.key === "ArrowDown") {
    inp.value = termHIdx > 0 ? termHistory[--termHIdx] : ((termHIdx = -1), "");
  }
}

function termPrint(txt, cls) {
  var out = document.getElementById("term-out");
  if (!out) return;
  var d = document.createElement("div");
  if      (cls === "err")  d.style.color = "#ff4444";
  else if (cls === "warn") d.style.color = "#ffaa00";
  else if (cls === "ok")   d.style.color = "#00ee88";
  else if (cls === "dim")  d.style.color = "#335544";
  d.textContent = txt;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

function termRun(raw) {
  var parts = raw.split(" ");
  var cmd   = parts[0].toUpperCase();
  var args  = parts.slice(1);
  var ENT   = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  var STF   = typeof STAFF    !== "undefined" ? STAFF    : [];
  var SIT   = typeof SITES    !== "undefined" ? SITES    : [];

  switch (cmd) {
    case "HELP":
      [
        "HELP              — show this list",
        "LIST              — list records  (LIST ENTITIES | LIST STAFF | LIST SITES)",
        "GET               — get entity by ID  (GET ENTITY <id>)",
        "OPEN              — open entity window  (OPEN ENTITY <id>)",
        "STATUS            — overall system status",
        "BREACH            — list breached entities",
        "MAP               — open interactive facility map",
        "CODE              — open source file viewer",
        "CLEAR             — clear terminal output",
        "VER               — version info",
        "SETCLR <1-4>      — set clearance level (CL-5: OVERRIDE CLEARANCE OMEGA)",
        "CLRINFO           — show current clearance",
        "WHOAMI            — show session identity",
        "TRANSMIT          — send record to NeoMS Registry",
        "LOGOUT            — wipe session and return to intake"
      ].forEach(function (l) { termPrint("  " + l, "dim"); });
      break;

    case "VER":
      termPrint("NeoMs OS Build 2026.02 — Schema v2.1", "ok");
      break;

    case "CLEAR": {
      var o = document.getElementById("term-out");
      if (o) o.innerHTML = "";
      break;
    }

    case "STATUS":
      termPrint("SYSTEM STATUS:", "ok");
      ENT.forEach(function (e) {
        termPrint(
          "  E-" + String(e.id).padStart(4, "0") +
          " [" + e.cls + "] " + e.name.padEnd(32, " ") +
          " STATUS: " + e.status,
          e.status === "BREACHED" ? "err" : e.status === "MONITORED" ? "warn" : "dim"
        );
      });
      break;

    case "BREACH": {
      var br = ENT.filter(function (e) { return e.status === "BREACHED"; });
      if (br.length) {
        br.forEach(function (e) {
          termPrint("  [BREACH] E-" + String(e.id).padStart(4, "0") + " — " + e.name, "err");
        });
      } else {
        termPrint("  No active breaches.", "ok");
      }
      break;
    }

    case "MAP":
      openWin("worldmap");
      termPrint("Opening interactive facility map...", "ok");
      break;

    case "CODE":
      openWin("codeviewer");
      termPrint("Opening source file viewer...", "ok");
      break;

    case "LIST": {
      var sub = (args[0] || "").toUpperCase();
      if (sub === "ENTITIES" || sub === "") {
        ENT.forEach(function (e) {
          termPrint("  E-" + String(e.id).padStart(4, "0") +
            " [" + e.cls + "/" + e.ps + "] " + e.name);
        });
      } else if (sub === "STAFF") {
        STF.forEach(function (s) {
          termPrint("  S-" + s.id + " [CL-" + s.clr + "] " +
            s.fname + " " + s.lname + " — " + s.pos);
        });
      } else if (sub === "SITES") {
        SIT.forEach(function (s) {
          termPrint("  " + s.name + " — " + s.loc + " (" + s.status + ")");
        });
      } else {
        termPrint("Unknown target. Try: LIST ENTITIES | LIST STAFF | LIST SITES", "err");
      }
      break;
    }

    case "GET": {
      var gs = (args[0] || "").toUpperCase();
      var gi = parseInt(args[1]);
      if (gs === "ENTITY" && !isNaN(gi)) {
        var ent = ENT.find(function (x) { return x.id === gi; });
        if (ent) {
          ["name", "cls", "ps", "status", "site", "protocols"].forEach(function (k) {
            termPrint(
              "  " + k.padEnd(10, " ") + ": " +
              (k === "site" ? "Site-" + ent[k] : k === "protocols" ? ent[k].length : ent[k]),
              ent.status === "BREACHED" && k === "status" ? "err" : ""
            );
          });
          termPrint("  [Tip: OPEN ENTITY " + gi + " to open wiki viewer]", "dim");
        } else {
          termPrint("Entity ID " + gi + " not found.", "err");
        }
      } else {
        termPrint("Usage: GET ENTITY <id>", "err");
      }
      break;
    }

    case "OPEN": {
      var os = (args[0] || "").toUpperCase();
      var oi = parseInt(args[1]);
      if (os === "ENTITY" && !isNaN(oi)) {
        var oe = ENT.find(function (x) { return x.id === oi; });
        if (oe) {
          openWin("entity", oi);
          termPrint("Opening E-" + String(oi).padStart(4, "0") + "...", "ok");
        } else {
          termPrint("Entity not found.", "err");
        }
      } else {
        termPrint("Usage: OPEN ENTITY <id>", "err");
      }
      break;
    }

    case "SETCLR": {
      var lvl = parseInt(args[0], 10);
      if (isNaN(lvl) || lvl < 1 || lvl > 4) {
        termPrint("Usage: SETCLR <1-4>  (CL-5 requires OVERRIDE CLEARANCE OMEGA)", "err");
        break;
      }
      setClearance(lvl);
      termPrint("Clearance updated to CL-" + lvl + ".", "ok");
      break;
    }

    case "OVERRIDE":
      if (args[0] === "CLEARANCE" && args[1] === "OMEGA") {
        setClearance(5);
        termPrint("OVERRIDE ACCEPTED.", "ok");
        termPrint("CL-5 GRANTED. All activity is now logged and monitored.", "dim");
      } else {
        termPrint("Unknown override code. Type HELP.", "err");
      }
      break;

    case "CLRINFO":
      termPrint("Current clearance: CL-" + userClearance, "ok");
      termPrint(
        userClearance < 5 ? "  Access restricted." : "  Full access granted.", "dim"
      );
      break;

    case "WHOAMI":
      if (sessionStaff) {
        termPrint("Session identity:", "ok");
        termPrint("  ID   : S-" + sessionStaff.id);
        termPrint("  Name : " + sessionStaff.fname + " " + sessionStaff.lname);
        termPrint("  Dept : " + sessionStaff.dept);
        termPrint("  CLR  : CL-" + sessionStaff.clr);
        termPrint("  Site : Site-" + sessionStaff.site);
      } else {
        termPrint("No session identity on record.", "warn");
      }
      break;

    case "TRANSMIT":
      if (!sessionStaff) { termPrint("No session identity. Complete intake first.", "err"); break; }
      termPrint("Transmitting to NeoMS Registry...", "warn");
      fetch("https://formspree.io/f/xwvwybya", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          staff_id:   "S-" + sessionStaff.id,
          first_name: sessionStaff.fname,
          last_name:  sessionStaff.lname,
          department: sessionStaff.dept,
          clearance:  "CL-" + sessionStaff.clr,
          site:       "Site-" + sessionStaff.site,
          timestamp:  new Date().toISOString()
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function () { termPrint("TRANSMISSION COMPLETE.", "ok"); })
        .catch(function (err) { termPrint("TRANSMISSION FAILED — " + err.message, "err"); });
      break;

    case "DEPTREQ":
      termPrint("Department transfer request logged. Pending supervisor approval.", "warn");
      break;

    case "LOGOUT":
      try { localStorage.removeItem("neoms_session_staff"); } catch (e) {}
      termPrint("Session terminated. Redirecting to intake...", "warn");
      setTimeout(function () {
        window.location.href = "/Neoms~Database/HTML/intake.html";
      }, 1200);
      break;

    default:
      termPrint("Unknown command: " + cmd + ". Type HELP.", "err");
  }
}

/* ── SHARED HELPERS ──────────────────────────────────────────── */
function toast(msg, dur) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, dur || 2500);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ── AUTO-OPEN: Containment Log on startup ───────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (typeof openWin === "function") openWin("main");
  }, 250);
});
