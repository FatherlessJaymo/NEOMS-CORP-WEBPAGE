/* ============================================================
   NEOMS — DATABASE MODE
   Neoms~PrimeDrive/JS/database-mode.js

   Turns Neoms~Database into a "mode" of PrimeDrive instead of
   a separate page. Click the Database icon → desktop swaps:
     • PrimeDrive icons hide, Database icons appear
     • Wallpaper switches to the live D3 world map
     • CLR clearance widget appears in the taskbar
     • Top label bar text changes
     • Intake fires once (first time only)
   Click the "Exit" icon (or ESC) → switches back.

   Database windows piggyback on PrimeDrive's window manager:
   each is registered in WIN_DEFS as db-{id} and its builder
   loads the original /Neoms~Database/windows/{name}/ files
   into the window body using the same fetch+Function pattern
   the standalone Database desktop used.
============================================================ */
(function () {
  "use strict";

  /* ── Storage keys (shared with standalone Database) ─────── */
  var LS_SESSION = "neoms_session_staff";
  var LS_CLEARANCE = "neoms_clearance";
  var LS_MODE = "neoms_active_mode";
  var WIN_BASE = "Neoms~Database/windows/";
  var INTAKE_URL = "Neoms~Database/HTML/intake.html";

  /* ── Globals expected by Database window scripts ─────────── */
  /* Database windows assume these are reachable on window.* — */
  /* we hydrate them on first mode-switch. */
  window.sessionStaff = window.sessionStaff || null;
  window.userClearance = window.userClearance || 1;

  /* ── State ──────────────────────────────────────────────── */
  var dbMode = false;
  var hydrated = false; // data scripts loaded?

  /* ============================================================
     DATABASE WINDOW DEFINITIONS
     Registered into PrimeDrive's WIN_DEFS so openWin('db-main')
     "just works" through the existing window manager.
  ============================================================ */
  var DB_FOLDER_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";

  var DB_WINDOWS = {
    "db-main": { winType: "main", title: "NeoMS Containment Log", w: 720, h: 560, clrReq: 1 },
    "db-entities": { winType: "entities", title: "Entity Registry", w: 680, h: 480, clrReq: 3 },
    "db-entity-scheme": { winType: "entity-scheme", title: "Entity Classification Scheme", w: 760, h: 580, clrReq: 1 },
    "db-staff": { winType: "staff", title: "Staff Records", w: 750, h: 480, clrReq: 1 },
    "db-staff-scheme": { winType: "staff-scheme", title: "Personnel Position Scheme", w: 700, h: 560, clrReq: 1 },
    "db-sites": { winType: "sites", title: "Containment Sites", w: 680, h: 560, clrReq: 1 },
    "db-worldmap": { winType: "worldmap", title: "Global Facility Map — CLASSIFIED", w: 960, h: 600, clrReq: 1 },
    "db-terminal": { winType: "terminal", title: "NEOMS Terminal v1.0", w: 580, h: 400, clrReq: 1 },
    "db-codeviewer": { winType: "codeviewer", title: "NeoMS Source Viewer", w: 860, h: 540, clrReq: 5 }
  };

  /* Inject DB windows into PrimeDrive WIN_DEFS + register builders.
     window-manager.js exposes DB_BUILD_OVERRIDES and DB_AFTER_OPEN
     hooks so we can plug in without monkey-patching. */
  function registerWindows() {
    if (typeof WIN_DEFS === "undefined") {
      console.warn("[db-mode] WIN_DEFS not found — window-manager.js must load first");
      return;
    }

    /* Init the global hook registries if not already present */
    window.DB_BUILD_OVERRIDES = window.DB_BUILD_OVERRIDES || {};
    window.DB_AFTER_OPEN = window.DB_AFTER_OPEN || {};

    Object.keys(DB_WINDOWS).forEach(function (id) {
      var d = DB_WINDOWS[id];
      WIN_DEFS[id] = { title: d.title, w: d.w, h: d.h, icon: id, iconImg: DB_FOLDER_IMG };
      WIN_ICONS[id] = DB_FOLDER_IMG;

      /* Synchronous placeholder — the async loader runs in afterOpen */
      window.DB_BUILD_OVERRIDES[id] = function () {
        return buildDbContent(id);
      };
      window.DB_AFTER_OPEN[id] = function () {
        loadDbWindow(id);
      };
    });
  }

  /* Initial body for a DB window — placeholder until fetch lands */
  function buildDbContent(id) {
    return (
      '<div class="db-win-loading" style="' +
      "padding:40px;text-align:center;font-family:'Share Tech Mono',monospace;" +
      'font-size:11px;color:#00eaff;letter-spacing:2px;">' +
      "LOADING " +
      escHtml(DB_WINDOWS[id].winType.toUpperCase()) +
      "..." +
      "</div>"
    );
  }

  /* ============================================================
     LOAD A DB WINDOW (async)
     Mirrors the original Neoms~Database/JS/desktop.js logic:
     fetch HTML → inject, fetch CSS → <link>, fetch JS → eval
     with the expected Database globals as parameters.
  ============================================================ */
  var loadedDbCss = {}; // dedupe stylesheet injection

  function loadDbWindow(id) {
    var def = DB_WINDOWS[id];
    if (!def) return;
    var winType = def.winType;

    /* Clearance gate — silently no-op + close if user is too low */
    if (window.userClearance < def.clrReq) {
      if (typeof toast === "function") {
        toast(def.title + " requires CL-" + def.clrReq + ". Current: CL-" + window.userClearance + ".", 3500);
      }
      if (typeof closeWin === "function") closeWin(id);
      return;
    }

    var winEl = document.getElementById("win-" + id);
    if (!winEl) return;
    var scrollEl = winEl.querySelector(".win-scroll");
    if (!scrollEl) return;

    /* Make the scroll area itself the "body" the DB window expects. */
    /* Database windows look for an element they can populate; we    */
    /* give them the .win-scroll div with a stable inner container.  */
    scrollEl.innerHTML =
      '<div class="db-win-host" id="dbhost_' +
      id +
      '" ' +
      'style="height:100%;width:100%;display:flex;flex-direction:column;background:#000;color:#d8e0f0;"></div>';
    var host = document.getElementById("dbhost_" + id);

    var htmlUrl = WIN_BASE + winType + "/" + winType + ".html";
    var cssUrl = WIN_BASE + winType + "/" + winType + ".css";
    var jsUrl = WIN_BASE + winType + "/" + winType + ".js";

    /* Inject window-specific CSS once */
    if (!loadedDbCss[winType]) {
      var lnk = document.createElement("link");
      lnk.rel = "stylesheet";
      lnk.href = cssUrl;
      lnk.id = "dbcss_" + winType;
      document.head.appendChild(lnk);
      loadedDbCss[winType] = true;
    }

    /* Fetch HTML → inject → run JS */
    fetch(htmlUrl)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (html) {
        host.innerHTML = html;
        return fetch(jsUrl);
      })
      .then(function (r2) {
        if (!r2.ok) throw new Error("JS HTTP " + r2.status);
        return r2.text();
      })
      .then(function (js) {
        /* Database window scripts expect specific globals.       */
        /* Inject them as parameters to a Function so the window  */
        /* JS can use them as if it were running in standalone.   */
        try {
          var fn = new Function(
            "winId",
            "winData",
            "ENTITIES",
            "STAFF",
            "SITES",
            "DEPTS",
            "CLS_LABELS",
            "sessionStaff",
            "userClearance",
            "openWin",
            "closeWin",
            "termPrint",
            "termRun",
            js
          );
          fn(
            id,
            null,
            window.ENTITIES,
            window.STAFF,
            window.SITES,
            window.DEPTS,
            window.CLS_LABELS,
            window.sessionStaff,
            window.userClearance,
            window.openWin,
            window.closeWin,
            window.termPrint,
            window.termRun
          );
        } catch (err) {
          console.error("[db-mode] Window JS error:", winType, err);
          host.innerHTML =
            "<div style=\"padding:20px;color:#ff6666;font-family:'Share Tech Mono',monospace;font-size:11px;\">" +
            "WINDOW SCRIPT ERROR<br>" +
            escHtml(err.message) +
            "</div>";
        }
      })
      .catch(function (err) {
        console.warn("[db-mode] Failed to load", winType, err);
        host.innerHTML =
          "<div style=\"padding:20px;color:#ff6666;font-family:'Share Tech Mono',monospace;font-size:11px;\">" +
          "WINDOW UNAVAILABLE<br>" +
          escHtml(err.message) +
          '<br><span style="color:#666;">' +
          escHtml(htmlUrl) +
          "</span></div>";
      });
  }

  /* ============================================================
     DATA HYDRATION — load the Entities/Staff/Sites data scripts
     once, before first DB window opens. They define globals
     (ENTITIES, STAFF, SITES, etc.) that windows depend on.
  ============================================================ */
  function hydrateData(cb) {
    if (hydrated) {
      cb && cb();
      return;
    }
    var scripts = [
      "Neoms~Database/windows/entities/Entities-Data.js",
      "Neoms~Database/windows/staff/Staff-Data.js",
      "Neoms~Database/windows/sites/Sites-Data.js",
      "Neoms~Database/windows/worldmap/world-atlas-loader.js"
    ];
    var done = 0;
    function next() {
      if (done >= scripts.length) {
        hydrated = true;
        cb && cb();
        return;
      }
      var s = document.createElement("script");
      s.src = scripts[done++];
      s.onload = next;
      s.onerror = next; // soldier on even if one is missing
      document.head.appendChild(s);
    }
    next();
  }

  /* ============================================================
     CLEARANCE WIDGET — injected into PrimeDrive's taskbar
  ============================================================ */
  function ensureClrWidget() {
    if (document.getElementById("clearance-indicator")) return;
    var taskbar = document.getElementById("taskbar");
    if (!taskbar) return;
    var clk = document.getElementById("taskbar-clock");

    var clr = document.createElement("div");
    clr.id = "clearance-indicator";
    clr.title = "Click to cycle clearance level";
    clr.innerHTML =
      '<span class="clr-label">CLR</span>' +
      '<div class="clr-dot active" id="cd1"></div>' +
      '<div class="clr-dot" id="cd2"></div>' +
      '<div class="clr-dot" id="cd3"></div>' +
      '<div class="clr-dot" id="cd4"></div>' +
      '<div class="clr-dot" id="cd5"></div>';
    clr.addEventListener("click", cycleClearance);

    /* Insert just before the clock if present, else append */
    if (clk && clk.parentNode === taskbar) {
      taskbar.insertBefore(clr, clk);
    } else {
      taskbar.appendChild(clr);
    }
  }

  function setClearance(level) {
    level = Math.max(1, Math.min(5, parseInt(level, 10) || 1));
    window.userClearance = level;
    for (var i = 1; i <= 5; i++) {
      var d = document.getElementById("cd" + i);
      if (d) d.classList.toggle("active", i <= level);
    }
    try {
      localStorage.setItem(LS_CLEARANCE, String(level));
    } catch (e) {}
  }
  window.cycleClearance = function () {
    var next = window.userClearance >= 5 ? 1 : window.userClearance + 1;
    setClearance(next);
  };

  /* ============================================================
     ICON SWAP — when in DB mode, replace #icon-grid contents
     with the Database icon set; on exit, rebuild PrimeDrive's.
  ============================================================ */
  var DB_ICONS = [
    { id: "db-main", label: "Containment\nLog", img: DB_FOLDER_IMG },
    { id: "db-entities", label: "Entity\nRegistry", img: DB_FOLDER_IMG },
    { id: "db-entity-scheme", label: "Entity\nScheme", img: DB_FOLDER_IMG },
    { id: "db-staff", label: "Staff\nRecords", img: DB_FOLDER_IMG },
    { id: "db-staff-scheme", label: "Staff\nScheme", img: DB_FOLDER_IMG },
    { id: "db-sites", label: "Sites", img: DB_FOLDER_IMG },
    { id: "db-worldmap", label: "Facility\nMap", img: DB_FOLDER_IMG },
    { id: "db-terminal", label: "Terminal", img: DB_FOLDER_IMG },
    { id: "db-codeviewer", label: "Source\nFiles", img: DB_FOLDER_IMG },
    { id: "exit-database", label: "Exit\nDatabase", img: "Neoms~Universal-Fonts+Images/Icons/NEOMS-CORP-1.png" }
  ];

  function renderDbIcons() {
    var grid = document.getElementById("icon-grid");
    if (!grid) return;
    grid.innerHTML = "";

    var CELL_W = 96,
      CELL_H = 100,
      PAD_X = 14,
      PAD_Y = 32,
      ROWS = 6;

    DB_ICONS.forEach(function (ic, i) {
      var el = document.createElement("div");
      el.className = "desk-icon db-icon";
      el.dataset.id = ic.id;

      var iconHTML =
        '<img src="' +
        ic.img +
        '" alt="' +
        ic.label +
        '" style="width:52px;height:52px;object-fit:contain;border-radius:6px;' +
        'pointer-events:none;filter:drop-shadow(0 2px 6px rgba(0,40,120,.5));"/>';
      el.innerHTML = iconHTML + '<span class="icon-label">' + ic.label.replace("\n", "<br/>") + "</span>";

      var col = Math.floor(i / ROWS),
        row = i % ROWS;
      el.style.left = PAD_X + col * CELL_W + "px";
      el.style.top = PAD_Y + row * CELL_H + "px";

      el.addEventListener("dblclick", function () {
        if (ic.id === "exit-database") {
          setMode("primedrive");
          return;
        }
        if (typeof openWin === "function") openWin(ic.id);
      });
      /* Single-click select (matches PrimeDrive UX) */
      el.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        document.querySelectorAll(".desk-icon").forEach(function (d) {
          d.classList.remove("selected");
        });
        el.classList.add("selected");
      });

      grid.appendChild(el);
    });
  }

  /* Re-build PrimeDrive icons by calling its own buildIcons(). */
  /* If buildIcons isn't exposed, we re-derive from the ICONS  */
  /* array which IS global from desktop-icons.js.              */
  function renderPrimeDriveIcons() {
    var grid = document.getElementById("icon-grid");
    if (!grid) return;
    grid.innerHTML = "";
    if (typeof buildIcons === "function") {
      buildIcons();
    }
  }

  /* ============================================================
     WALLPAPER — D3 world map shows under DB-mode icons.
     Hidden in PrimeDrive mode.
  ============================================================ */
  function ensureWallpaper() {
    if (document.getElementById("desktop-map-svg")) return;
    var desktop = document.getElementById("desktop");
    if (!desktop) return;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "desktop-map-svg";
    svg.setAttribute(
      "style",
      "position:absolute;inset:0;width:100%;height:100%;" + "pointer-events:none;z-index:0;opacity:.35;display:none;"
    );
    desktop.insertBefore(svg, desktop.firstChild);
  }

  function drawWallpaper() {
    if (typeof d3 === "undefined") return;
    var svgEl = document.getElementById("desktop-map-svg");
    if (!svgEl) return;
    svgEl.style.display = "block";

    var W = svgEl.clientWidth || window.innerWidth;
    var H = svgEl.clientHeight || window.innerHeight - 48;
    if (W < 10 || H < 10) {
      requestAnimationFrame(drawWallpaper);
      return;
    }

    var svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    var proj = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
    var geoPath = d3.geoPath().projection(proj);
    var g = svg.append("g");

    g.append("path")
      .datum({ type: "Sphere" })
      .attr("class", "sphere")
      .attr("d", geoPath)
      .attr("fill", "none")
      .attr("stroke", "#00eaff")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 0.5);

    g.append("path")
      .datum(d3.geoGraticule()())
      .attr("class", "graticule")
      .attr("d", geoPath)
      .attr("fill", "none")
      .attr("stroke", "#0044bb")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 0.3);

    if (window.__worldAtlas && typeof topojson !== "undefined") {
      var land = topojson.feature(window.__worldAtlas, window.__worldAtlas.objects.countries);
      g.append("path")
        .datum(land)
        .attr("class", "land")
        .attr("d", geoPath)
        .attr("fill", "#003a8a")
        .attr("stroke", "#00eaff")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 0.4);
    }
  }

  function hideWallpaper() {
    var svg = document.getElementById("desktop-map-svg");
    if (svg) svg.style.display = "none";
  }

  /* ============================================================
     LABEL BAR TEXT
  ============================================================ */
  function setLabelBar(mode) {
    var label = document.querySelector(".desk-label");
    if (!label) return;
    var title = label.querySelector(".desk-label-title");
    var item = label.querySelector(".desk-label-item");
    if (mode === "database") {
      if (title) title.textContent = "NEO OVERDRIVE CORE";
      if (item) item.textContent = "NEOMS~DATABASE — SYSTEM ONLINE";
    } else {
      if (title) title.textContent = "NEOCORP VM";
      if (item) item.textContent = "SYSTEM ONLINE";
    }
  }

  /* ============================================================
     MODE SWITCH
  ============================================================ */
  function setMode(mode) {
    if (mode === "database") {
      enterDatabaseMode();
    } else {
      exitDatabaseMode();
    }
  }

  function enterDatabaseMode() {
    if (dbMode) return;

    /* Step 1: check session — if no session staff yet, run intake first */
    var session = null;
    try {
      session = JSON.parse(localStorage.getItem(LS_SESSION));
    } catch (e) {}

    if (!session || !session.fname) {
      runIntakeOverlay(function () {
        /* Re-read after intake completes */
        try {
          session = JSON.parse(localStorage.getItem(LS_SESSION));
        } catch (e) {}
        if (session && session.fname) {
          window.sessionStaff = session;
          enterDatabaseMode(); // retry
        }
      });
      return;
    }

    window.sessionStaff = session;
    dbMode = true;
    document.body.classList.add("dbmode");
    try {
      localStorage.setItem(LS_MODE, "database");
    } catch (e) {}

    /* Restore saved clearance */
    var savedClr = 1;
    try {
      savedClr = parseInt(localStorage.getItem(LS_CLEARANCE), 10) || 1;
    } catch (e) {}

    /* Close any open PrimeDrive windows so the deck is clean. */
    /* (Optional — comment out if you want to preserve them.)  */
    Object.keys(wins)
      .slice()
      .forEach(function (id) {
        if (!DB_WINDOWS[id]) closeWin(id);
      });

    ensureClrWidget();
    setClearance(savedClr);
    ensureWallpaper();
    drawWallpaper();
    setLabelBar("database");

    /* Hydrate Database data, then swap icons */
    hydrateData(function () {
      renderDbIcons();
    });
  }

  function exitDatabaseMode() {
    if (!dbMode) return;
    dbMode = false;
    document.body.classList.remove("dbmode");
    try {
      localStorage.setItem(LS_MODE, "primedrive");
    } catch (e) {}

    /* Close DB windows */
    Object.keys(wins)
      .slice()
      .forEach(function (id) {
        if (DB_WINDOWS[id]) closeWin(id);
      });

    hideWallpaper();
    setLabelBar("primedrive");
    renderPrimeDriveIcons();
  }

  /* ============================================================
     INTAKE OVERLAY (one-time, embedded — not the full intake.html)
     We render a compact intake form right here so the user
     never leaves PrimeDrive. On submit, we save the session
     to localStorage and call the callback.
  ============================================================ */
  function runIntakeOverlay(onComplete) {
    if (document.getElementById("db-intake-overlay")) return;
    var ov = document.createElement("div");
    ov.id = "db-intake-overlay";
    ov.innerHTML =
      '<div class="db-intake-frame">' +
      '<div class="db-intake-titlebar">' +
      "<span>&#9654; NEOMS_OS — SYNTHETIC INTAKE TERMINAL</span>" +
      "<span>SITE-62656 // NODE-001</span>" +
      "</div>" +
      '<div class="db-intake-screen" id="db-intake-screen"></div>' +
      '<div class="db-intake-form">' +
      '<div class="db-intake-label">PERSONNEL IDENTIFICATION</div>' +
      '<div class="db-intake-grid">' +
      "<div>" +
      '<div class="db-intake-sublabel">First Name</div>' +
      '<input class="db-intake-input" id="db-iv-fname" placeholder="GIVEN NAME" autocomplete="off"/>' +
      "</div>" +
      "<div>" +
      '<div class="db-intake-sublabel">Last Name</div>' +
      '<input class="db-intake-input" id="db-iv-lname" placeholder="FAMILY NAME" autocomplete="off"/>' +
      "</div>" +
      "</div>" +
      '<div class="db-intake-actions">' +
      '<span id="db-iv-err"></span>' +
      '<button class="db-intake-cancel" id="db-iv-cancel">CANCEL</button>' +
      '<button class="db-intake-submit" id="db-iv-submit">&#9654; REGISTER &amp; ENTER</button>' +
      "</div>" +
      "</div>" +
      "</div>";
    document.body.appendChild(ov);

    /* Animated boot-style lines — quick + readable */
    var screen = document.getElementById("db-intake-screen");
    var bootLines = [
      "NEOMS_OS v2.1 — Initializing...",
      "Loading containment partition... OK",
      "Soul-coherence arrays: ONLINE",
      "────────────────────────────────────────",
      "NEW SYNTHETIC UNIT INTAKE PROTOCOL",
      "Please provide identification for system registration."
    ];
    bootLines.forEach(function (text, i) {
      setTimeout(function () {
        var d = document.createElement("div");
        d.className = "db-intake-line";
        d.textContent = text;
        screen.appendChild(d);
        screen.scrollTop = screen.scrollHeight;
      }, i * 200);
    });

    function submit() {
      var fname = document.getElementById("db-iv-fname").value.trim();
      var lname = document.getElementById("db-iv-lname").value.trim();
      var err = document.getElementById("db-iv-err");
      if (!fname || !lname) {
        err.textContent = "BOTH FIELDS REQUIRED";
        return;
      }

      /* Pick a staff id; bump-and-save if a counter exists */
      var nextId = 2000;
      try {
        nextId = parseInt(localStorage.getItem("neoms_next_staff_id"), 10) || 2000;
      } catch (e) {}
      var record = {
        id: nextId,
        fname: fname,
        lname: lname,
        pos: "Synthetic Intake Unit",
        dept: "SYNTHETICS",
        clr: 1,
        site: 62656,
        active: "Y"
      };
      try {
        localStorage.setItem(LS_SESSION, JSON.stringify(record));
        localStorage.setItem("neoms_next_staff_id", String(nextId + 1));
      } catch (e) {}

      ov.classList.add("db-intake-fadeout");
      setTimeout(function () {
        ov.remove();
        if (onComplete) onComplete();
      }, 500);
    }

    document.getElementById("db-iv-submit").addEventListener("click", submit);
    document.getElementById("db-iv-cancel").addEventListener("click", function () {
      ov.remove();
    });
    document.getElementById("db-iv-lname").addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
  }

  /* ============================================================
     ICON HOOK — replace the database icon's behavior.
     desktop-icons.js's makeDraggableIcon checks `url` first, so
     we hijack by changing the dblclick handler at the source —
     done in the patched desktop-icons.js. This is just the public
     entry point.
  ============================================================ */
  window.NeomsDatabase = {
    enter: function () {
      setMode("database");
    },
    exit: function () {
      setMode("primedrive");
    },
    toggle: function () {
      setMode(dbMode ? "primedrive" : "database");
    },
    isActive: function () {
      return dbMode;
    }
  };

  /* ============================================================
     KEYBOARD: ESC exits Database mode (only if no input focused)
  ============================================================ */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!dbMode) return;
    var t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (document.getElementById("db-intake-overlay")) return;
    setMode("primedrive");
  });

  /* ============================================================
     BOOTSTRAP — runs once on DOMContentLoaded.
     window-manager.js + desktop-icons.js are loaded before us
     (see index.html load order), so WIN_DEFS, openWin, ICONS,
     and buildIcons are already available.
  ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    /* Slight delay so window-manager finishes setting up. */
    setTimeout(function () {
      registerWindows();
      ensureClrWidget();
      ensureWallpaper();

      /* Hide CLR widget initially (CSS handles via body.dbmode) */
      /* If we previously left the user in DB mode, restore.    */
      var saved = null;
      try {
        saved = localStorage.getItem(LS_MODE);
      } catch (e) {}
      if (saved === "database") {
        setMode("database");
      }
    }, 100);
  });
})();
