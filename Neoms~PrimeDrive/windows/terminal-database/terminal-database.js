/* ============================================================
   TERMINAL-DATABASE WINDOW
   Neoms~PrimeDrive/windows/terminal-database/terminal-database.js

   Combines the old VM Terminal (formerly in JS/desktop-core.js)
   with a live connection to the NeoMS Database session record
   written by Neoms~Database/JS/intake.js (key: "neoms_session_staff").

   Exposed:
     window.buildTerminalDB    — called by window-manager router
     window.initTerminalDB     — called by window-manager.afterOpen

   Window id: "terminaldb"

   The terminal reads the intake record so commands like `whoami`,
   `status`, and `session` reflect the actually-registered user
   instead of hard-coded text.
============================================================ */
(function () {
  "use strict";

  /* ── Shared keys with intake.js ─────────────────────────── */
  var INTAKE_LS_KEY = "neoms_session_staff";
  var INTAKE_CLR_KEY = "neoms_clearance";

  /* Per-terminal state. Re-initialised every time the window
     is built so closing+reopening gives a clean shell. */
  var vmHistory = [];
  var vmHistoryIdx = -1;

  /* ── Read intake session ────────────────────────────────── */
  function loadSession() {
    try {
      var raw = localStorage.getItem(INTAKE_LS_KEY);
      if (!raw) return null;
      var rec = JSON.parse(raw);
      if (!rec || !rec.fname) return null;
      /* Prefer the manually-bumped clearance, fall back to record's. */
      var clr = parseInt(localStorage.getItem(INTAKE_CLR_KEY), 10);
      if (!isNaN(clr)) rec.clr = clr;
      return rec;
    } catch (e) {
      return null;
    }
  }

  function fullName(rec) {
    if (!rec) return "GUEST";
    return (rec.fname || "") + " " + (rec.lname || "");
  }
  function staffTag(rec) {
    if (!rec) return "GUEST";
    return "S-" + rec.id;
  }
  function clearanceTag(rec) {
    if (!rec || !rec.clr) return "CL-0";
    return "CL-" + rec.clr;
  }
  function userPromptName(rec) {
    if (!rec || !rec.fname) return "guest";
    return String(rec.fname).toLowerCase();
  }

  /* ── Boot lines (rendered each time terminal opens) ─────── */
  function buildBootLines(rec) {
    var bar =
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501" +
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501" +
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501" +
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";

    var lines = [
      "NEOMSDATABASE v1.1",
      "Copyright (c) 2026 NeoMS Corp. All rights reserved.",
      bar,
      "Establishing connection to NEOMS Database..."
    ];

    if (rec) {
      lines.push("[OK] Connected to NEOMSDATABASE cluster");
      lines.push("[OK] Authentication verified \u2014 " + fullName(rec));
      lines.push("[OK] Session loaded: " + staffTag(rec) + " / " + clearanceTag(rec));
      lines.push("[OK] Loading containment records...");
    } else {
      lines.push("[OK] Connected to NEOMSDATABASE cluster");
      lines.push("[WARN] No intake session found \u2014 running as GUEST");
      lines.push("[INFO] Run intake to register a Staff ID");
    }

    lines.push("");
    lines.push('Type "help" for available commands.');
    lines.push("");
    return lines;
  }

  /* ── Command set ────────────────────────────────────────── */
  function buildCommands(getRec) {
    return {
      help: function () {
        return [
          "Available commands:",
          "  help      \u2014 show this menu",
          "  status    \u2014 system status",
          "  ls        \u2014 list databases",
          "  whoami    \u2014 current user",
          "  session   \u2014 show full intake session record",
          "  clear     \u2014 clear terminal",
          "  ping      \u2014 test connection",
          "  rewrite   \u2014 launch REWRITE.EXE",
          "  logout    \u2014 clear local session record",
          "  exit      \u2014 close terminal"
        ];
      },
      status: function () {
        var rec = getRec();
        return [
          "SYSTEM STATUS:",
          "  Connection: ACTIVE",
          "  Auth level: " + (rec ? clearanceTag(rec) : "GUEST"),
          "  Database  : ONLINE",
          "  Records   : 2,048 entries",
          "  Uptime    : 99.7%",
          "  Session   : " + (rec ? staffTag(rec) + " (" + fullName(rec).trim() + ")" : "none")
        ];
      },
      ls: function () {
        return [
          "DATABASES:",
          "  /neoms-core          [ACTIVE]",
          "  /containment-log     [ACTIVE]",
          "  /rewrite-exe         [LOCKED]",
          "  /sinister-minds      [ACTIVE]",
          "  /creator-archive     [READ-ONLY]",
          "  /staff-registry      [ACTIVE]"
        ];
      },
      whoami: function () {
        var rec = getRec();
        if (!rec) {
          return [
            "GUEST",
            "Role: Unregistered",
            "Clearance: CL-0",
            "(no intake record \u2014 see Neoms~Database)"
          ];
        }
        return [
          fullName(rec).trim(),
          "Staff ID  : " + staffTag(rec),
          "Department: " + (rec.dept || "\u2014"),
          "Position  : " + (rec.pos || "\u2014"),
          "Clearance : " + clearanceTag(rec),
          "Site      : Site-" + (rec.site || "\u2014"),
          "Active    : " + (rec.active || "\u2014")
        ];
      },
      session: function () {
        var rec = getRec();
        if (!rec) return ["[ERR] No session record found in local store."];
        var json;
        try {
          json = JSON.stringify(rec, null, 2).split("\n");
        } catch (e) {
          return ["[ERR] Could not serialize session record."];
        }
        return ["SESSION RECORD (" + INTAKE_LS_KEY + "):"].concat(json);
      },
      ping: function () {
        return [
          "PING neomsdatabase.neoms: 56 bytes",
          "Reply: time=4ms TTL=64",
          "Reply: time=3ms TTL=64",
          "Reply: time=5ms TTL=64",
          "--- 3 packets transmitted, 3 received, 0% loss"
        ];
      },
      clear: function () {
        var s = document.getElementById("td-shell");
        if (s) s.innerHTML = "";
        return [];
      },
      rewrite: function () {
        var rec = getRec();
        var clr = rec && rec.clr ? rec.clr : 0;
        if (clr >= 4) {
          return [
            "Initiating REWRITE.EXE protocol...",
            "[OK] Clearance verified: " + clearanceTag(rec),
            "[OK] Awaiting kernel handshake...",
            "[ERR] Kernel offline. Try again later."
          ];
        }
        return [
          "Initiating REWRITE.EXE protocol...",
          "[WARN] Protocol requires clearance CL-4 or higher",
          "[ERR] Insufficient permissions \u2014 current: " + clearanceTag(rec)
        ];
      },
      logout: function () {
        try {
          localStorage.removeItem(INTAKE_LS_KEY);
          localStorage.removeItem(INTAKE_CLR_KEY);
        } catch (e) {}
        return [
          "Local session record cleared.",
          "Reload the desktop to re-run intake.",
          "[OK] Logged out."
        ];
      },
      exit: function () {
        setTimeout(function () {
          if (typeof closeWin === "function") closeWin("terminaldb");
        }, 300);
        return ["Terminating session...", "[BYE]"];
      }
    };
  }

  /* ── Render helper ──────────────────────────────────────── */
  function printLine(shell, text) {
    var div = document.createElement("div");
    div.className = "td-line";
    div.textContent = text;
    shell.appendChild(div);
  }

  /* ── window-manager builder ─────────────────────────────── */
  window.buildTerminalDB = function () {
    var rec = loadSession();
    var connectedLabel = rec
      ? "USER: " + fullName(rec).trim() + " // " + staffTag(rec) + " // " + clearanceTag(rec)
      : "USER: GUEST // UNREGISTERED";

    return (
      '<div class="td-title-bar">NEOMS@DB \u2014 ' + escHtml(connectedLabel) + '</div>' +
      '<div class="td-shell" id="td-shell"></div>' +
      '<div class="td-input-row">' +
        '<span class="td-prompt" id="td-prompt">NEOMS@DB:~$</span>' +
        '<input type="text" id="td-input" autocomplete="off" spellcheck="false" />' +
      '</div>' +
      '<div class="td-status">' +
        '<span>NEOMSDATABASE</span>' +
        '<span>' + escHtml(connectedLabel) + '</span>' +
      '</div>'
    );
  };

  /* ── window-manager init hook ───────────────────────────── */
  window.initTerminalDB = function () {
    var shell = document.getElementById("td-shell");
    var input = document.getElementById("td-input");
    var prompt = document.getElementById("td-prompt");
    if (!shell || !input) return;

    /* Snapshot the record at open. If the session changes
       (logout, etc.) the user can reopen the terminal. */
    var rec = loadSession();
    var getRec = function () { return rec; };
    var cmds = buildCommands(getRec);

    /* Update prompt with username */
    if (prompt) {
      prompt.textContent = userPromptName(rec) + "@neomsdb:~$";
    }

    /* Print boot sequence */
    shell.innerHTML = "";
    buildBootLines(rec).forEach(function (l) { printLine(shell, l); });
    shell.scrollTop = shell.scrollHeight;

    /* Reset history per terminal session */
    vmHistory = [];
    vmHistoryIdx = -1;

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var raw = input.value.trim();
        var cmd = raw.toLowerCase();
        input.value = "";
        if (!cmd) return;

        vmHistory.unshift(cmd);
        vmHistoryIdx = -1;

        printLine(shell, (prompt ? prompt.textContent : "NEOMS@DB:~$") + " " + raw);

        var fn = cmds[cmd];
        if (fn) {
          var out = fn();
          if (out) out.forEach(function (l) { printLine(shell, l); });
        } else {
          printLine(shell, '[ERR] Unknown command: ' + raw + '. Type "help".');
        }
        shell.scrollTop = shell.scrollHeight;
      }
      if (e.key === "ArrowUp") {
        vmHistoryIdx = Math.min(vmHistoryIdx + 1, vmHistory.length - 1);
        input.value = vmHistory[vmHistoryIdx] || "";
      }
      if (e.key === "ArrowDown") {
        vmHistoryIdx = Math.max(vmHistoryIdx - 1, -1);
        input.value = vmHistoryIdx >= 0 ? vmHistory[vmHistoryIdx] : "";
      }
    });

    /* Auto-focus the input when window opens */
    setTimeout(function () { input.focus(); }, 50);
  };
})();
