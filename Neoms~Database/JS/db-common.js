/* ============================================================
   NEOMS~DATABASE — SHARED TERMINAL + HELPERS
   Terminal commands (termKey / termPrint / termRun), toast and
   escHtml. Used by archive.html; load before archive-shell.js.
   ============================================================ */
"use strict";

/* ── TERMINAL ENGINE ───────────────────────────────────────────
   Modelled on the SCiPNET Direct Access Terminal: a coloured
   user@host prompt, simulated system lines while documents load,
   and ASCII sections, tables and report blocks. termPrint(txt, cls)
   stays the plain-text API other modules call. */
var termHistory = [];
var termHIdx = -1;
var termBusy = false;
var TERM_W = 72; /* column width for sections, tables and reports */
var TERM_FILER = 1002; /* every report is filed by Nova */
var TERM_SESSION = Math.random().toString(16).slice(2, 8);

/* name, usage, description — drives HELP and Tab completion.
   Orange = access-related (as SCiPNET colours access/login). */
var TERM_CMDS = [
  ["help", "[command]", "Show all commands, or details for one"],
  ["ls", "[-l] [path]", "List directory contents"],
  ["cd", "[path]", "Change directory (.. goes up, ~ goes home)"],
  ["pwd", "", "Print working directory"],
  ["cat", "<file>", "Print a file; .nms files open in the secured viewer"],
  ["access", "<E-id>", "Open an entity file in the secured viewer", "orange"],
  ["inbox", "", "Open your message inbox"],
  ["world", "", "Open the personnel activity monitor"],
  ["reports", "<E-id>", "List an entity's incident reports"],
  ["report", "<E-id> <#>", "Print a full incident report"],
  ["list", "entities | personnel | sites", "List database records"],
  ["get", "entity <id>", "Quick entity summary"],
  ["status", "", "System status report"],
  ["breach", "", "List breached entities"],
  ["map", "", "Open the global facility map"],
  ["whoami", "", "Show your session identity"],
  ["clrinfo", "", "Show your clearance level"],
  ["setclr", "<1-4>", "Set clearance level (CL-5 needs an override code)", "orange"],
  ["transmit", "", "Send your record to the NeoMS Registry", "orange"],
  ["ver", "", "Version info"],
  ["clear", "", "Clear the screen"],
  ["logout", "", "End the session and return to intake", "orange"]
];

function termKey(e) {
  var inp = document.getElementById("term-in");
  if (!inp) return;
  if (e.key === "Enter") {
    var cmd = inp.value.trim();
    if (!cmd || termBusy) return;
    termHistory.unshift(cmd);
    termHIdx = -1;
    termHTML(termPromptHTML() + " " + escHtml(cmd));
    inp.value = "";
    termNotify(cmd);
    termRun(cmd);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (termHIdx < termHistory.length - 1) inp.value = termHistory[++termHIdx] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    inp.value = termHIdx > 0 ? termHistory[--termHIdx] : ((termHIdx = -1), "");
  } else if (e.key === "Tab") {
    /* Complete the command name, or a file path after it */
    e.preventDefault();
    var word = inp.value.trim().toLowerCase();
    if (!word) return;
    if (inp.value.indexOf(" ") !== -1) {
      if (typeof termFsComplete !== "function") return;
      var cut = inp.value.lastIndexOf(" ") + 1;
      var paths = termFsComplete(inp.value.slice(cut));
      if (paths.length === 1) inp.value = inp.value.slice(0, cut) + paths[0];
      else if (paths.length > 1) termPrint(paths.join("  "), "dim");
      return;
    }
    var hits = TERM_CMDS.filter(function (c) {
      return c[0].indexOf(word) === 0;
    });
    if (hits.length === 1) inp.value = hits[0][0] + " ";
    else if (hits.length > 1) termPrint(hits.map(function (c) { return c[0]; }).join("  "), "dim");
  }
}

/* Plain text line. Old class names (err/warn/ok) map to colours. */
function termPrint(txt, cls) {
  var map = { err: "red", warn: "yellow", ok: "green" };
  termHTML(cls ? termC(txt, map[cls] || cls) : escHtml(txt == null ? "" : txt));
}

/* Raw HTML line — callers must escape their own text */
function termHTML(html) {
  var out = document.getElementById("term-out");
  if (!out) return;
  var d = document.createElement("div");
  d.innerHTML = html;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

/* Coloured span: termC("text", "cyan") */
function termC(txt, cls) {
  return '<span class="t-' + cls + '">' + escHtml(txt) + "</span>";
}

function termPromptHTML() {
  var who = typeof sessionpersonnel !== "undefined" && sessionpersonnel ? "s-" + sessionpersonnel.id : "guest";
  var cwd = typeof termCwd !== "undefined" ? termFsPath(termCwd) : "~";
  return termC(who, "green") + "@" + termC("neoms-core", "cyan") + ":" + termC(cwd, "blue") + "$";
}

/* Simulated system lines, as SCiPNET prints while loading a file */
function termSys(cmd) {
  return termC("root", "green") + "@" + termC("neoms-core", "cyan") + ":" + termC("/srv/secure", "blue") + "$ " + escHtml(cmd);
}
function termInfo(msg) {
  return termC("[" + new Date().toLocaleTimeString("en-GB", { hour12: false }) + "]", "dim") + " " + escHtml(msg);
}

/* Print HTML lines one by one with a short delay, locking input */
function termSeq(lines, done) {
  var inp = document.getElementById("term-in");
  termBusy = true;
  if (inp) inp.disabled = true;
  var i = 0;
  (function next() {
    if (i < lines.length) {
      termHTML(lines[i++]);
      setTimeout(next, 40 + Math.random() * 140);
      return;
    }
    termBusy = false;
    if (inp) {
      inp.disabled = false;
      inp.focus();
    }
    if (done) done();
  })();
}

/* Fit TERM_W to the columns that fit in #term-out right now */
function termFit() {
  var out = document.getElementById("term-out");
  if (!out || !out.clientWidth) return;
  var probe = document.createElement("span");
  probe.textContent = "0000000000";
  probe.style.visibility = "hidden";
  out.appendChild(probe);
  var ch = probe.getBoundingClientRect().width / 10;
  probe.remove();
  /* Leave room for the scrollbar, which appears once output overflows */
  if (ch) TERM_W = Math.max(36, Math.min(96, Math.floor((out.clientWidth - 24) / ch) - 1));
}

/* Word-wrap to `width` columns → array of lines */
function termWrap(text, width) {
  var lines = [];
  String(text == null ? "" : text).split("\n").forEach(function (para) {
    var line = "";
    para.split(/\s+/).forEach(function (w) {
      if (!w) return;
      if (line && line.length + 1 + w.length > width) {
        lines.push(line);
        line = w;
      } else {
        line = line ? line + " " + w : w;
      }
    });
    lines.push(line);
  });
  return lines;
}

function termRule(ch, title) {
  if (!title) return ch.repeat(TERM_W);
  var side = Math.max(3, Math.floor((TERM_W - title.length - 2) / 2));
  return ch.repeat(side) + " " + title + " " + ch.repeat(Math.max(3, TERM_W - side - title.length - 2));
}

/* SCiPNET "section": ____ / ---- TITLE ---- / text / ---- SUB ---- / ____ */
function termSection(title, paras, subs) {
  termPrint(termRule("_"), "dim");
  termHTML(termC(termRule("-", title), "bold"));
  (paras || []).forEach(function (p) {
    termWrap(p, TERM_W).forEach(function (l) {
      termPrint(l);
    });
  });
  (subs || []).forEach(function (s) {
    termPrint("");
    termHTML(termC(termRule("-", s.title), "bold"));
    (s.content || []).forEach(function (p) {
      termWrap(p, TERM_W).forEach(function (l) {
        termPrint(l);
      });
    });
  });
  termPrint(termRule("_"), "dim");
}

/* Markdown-style ASCII table. A cell can be a string or
   { t: "text", c: "colour" }. Long cells wrap inside their column. */
function termTable(title, headers, rows) {
  var txt = function (cell) {
    return cell && typeof cell === "object" ? String(cell.t) : String(cell == null ? "" : cell);
  };
  var widths = headers.map(function (h, i) {
    return rows.reduce(function (m, r) {
      return Math.max(m, txt(r[i]).length);
    }, h.length);
  });
  /* Squeeze the widest column so the table fits TERM_W */
  var total = widths.reduce(function (a, b) { return a + b; }, 0) + (headers.length - 1) * 3;
  if (total > TERM_W) {
    var wi = widths.indexOf(Math.max.apply(null, widths));
    widths[wi] = Math.max(headers[wi].length, widths[wi] - (total - TERM_W));
  }
  var line = function (cells, colours) {
    var wrapped = cells.map(function (c, i) {
      return termWrap(c, widths[i]);
    });
    var height = Math.max.apply(null, wrapped.map(function (w) { return w.length; }));
    for (var r = 0; r < height; r++) {
      termHTML(wrapped.map(function (w, i) {
        var s = (w[r] || "").padEnd(widths[i]);
        return colours && colours[i] ? termC(s, colours[i]) : escHtml(s);
      }).join(termC(" | ", "dim")));
    }
  };
  if (title) termHTML(termC(title, "bold"));
  line(headers, headers.map(function () { return "bold"; }));
  termPrint(widths.map(function (w) { return "-".repeat(w); }).join(" | "), "dim");
  rows.forEach(function (r) {
    line(r.map(txt), r.map(function (c) { return c && typeof c === "object" ? c.c : null; }));
  });
}

/* SCiPNET "report": ==== / TITLE / ==== / KEY: value / ==== / HEADING: text
   meta = [[key, value], …]; sections = [{ heading, text } | { heading, html: [lines] }] */
function termReport(title, meta, sections) {
  var bar = termRule("=");
  termPrint(bar, "dim");
  termHTML(termC(title, "bold"));
  termPrint(bar, "dim");
  if (meta && meta.length) {
    meta.forEach(function (kv) {
      var key = (kv[0].toUpperCase() + ":").padEnd(14);
      termWrap(kv[1], TERM_W - 14).forEach(function (l, i) {
        termHTML((i ? " ".repeat(14) : termC(key, "dim")) + escHtml(l));
      });
    });
    termPrint(bar, "dim");
  }
  (sections || []).forEach(function (s, i) {
    if (i) termPrint("");
    if (s.heading) termHTML(termC(s.heading.toUpperCase() + ":", "bold"));
    if (s.html) s.html.forEach(termHTML);
    else termWrap(s.text, TERM_W).forEach(function (l) { termPrint(l); });
  });
}

/* ── Data helpers ── */
function termEntId(id) {
  return "E-" + String(id).padStart(4, "0");
}
/* Accepts E-0138, e138, 0138 or 138 */
function termFindEnt(arg) {
  var n = parseInt(String(arg || "").replace(/^e-?/i, ""), 10);
  var ENT = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  return isNaN(n) ? null : ENT.filter(function (x) { return x.id === n; })[0] || null;
}
function termStaff(sid) {
  var STF = typeof personnel !== "undefined" ? personnel : [];
  var s = STF.filter(function (x) { return x.id === sid; })[0];
  return s ? (s.fname + " " + s.lname).trim() + " (S-" + s.id + ")" : "S-" + sid;
}
function termDenied(need) {
  termPrint("Access denied. Clearance level " + need + " required. Current: CL-" + userClearance + ".", "yellow");
  if (typeof arcNotify === "function") arcNotify("ACCESS DENIED · CL-" + need, "deny");
}

/* Sidebar feed (archive-shell.js): "EXECUTED: LS", or REJECTED for typos */
var TERM_HIDDEN_CMDS = ["override", "open", "deptreq"];
function termNotify(raw) {
  if (typeof arcNotify !== "function") return;
  var name = raw.trim().split(/\s+/)[0].toLowerCase();
  var known = TERM_HIDDEN_CMDS.indexOf(name) !== -1 || TERM_CMDS.some(function (c) { return c[0] === name; });
  arcNotify((known ? "EXECUTED: " : "REJECTED: ") + name.toUpperCase(), known ? "" : "deny");
}
/* The fake sha256 / wc / parse lines shown while "loading" a file */
function termLoadLines(path) {
  var tmp = "/tmp/neoms/" + TERM_SESSION + "/" + path.replace(/\//g, "_") + "_temp.nms";
  var hash = "";
  for (var i = 0; i < 32; i++) hash += Math.floor(Math.random() * 16).toString(16);
  return [
    termInfo('Fetching document "' + path + '" from the database...'),
    termSys("sha256sum " + tmp),
    termInfo(hash + "  " + tmp),
    termSys("wc -l " + tmp),
    termInfo(Math.floor(Math.random() * 2000 + 500) + " " + tmp),
    termSys('parse_document --path="' + path + '" --clearance=' + userClearance + " --format=html"),
    termInfo("Processing document content...")
  ];
}

function termHelp(name) {
  var c = TERM_CMDS.filter(function (x) { return x[0] === name; })[0];
  if (!c) {
    termPrint("No help available for '" + name + "'. Use 'help' to see all commands.", "yellow");
    return;
  }
  termSection(c[0].toUpperCase(), [c[2] + "."], [{ title: "USAGE", content: [(c[0] + " " + c[1]).trim()] }]);
}

function termRun(raw) {
  var parts = raw.trim().split(/\s+/);
  var cmd = parts[0].toUpperCase();
  var args = parts.slice(1);
  var ENT = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  var STF = typeof personnel !== "undefined" ? personnel : [];
  var SIT = typeof SITES !== "undefined" ? SITES : [];
  termFit();

  if (args[0] === "--help" || args[0] === "-h") {
    termHelp(cmd.toLowerCase());
    return;
  }

  switch (cmd) {
    case "HELP":
      if (args[0]) {
        termHelp(args[0].toLowerCase());
        break;
      }
      termSection(
        "OVERVIEW",
        [
          "The NeoMS Direct Access Terminal provides secure access to the NeoMS intranet and the containment database used by research and containment teams. You have been granted provisional access to this terminal due to your security clearance level (CL-" + userClearance + ")."
        ],
        [{ title: "FUNCTIONS", content: ["This terminal provides access to entity files, incident reports and site data relevant to your assigned duties. Please familiarise yourself with the following functions:"] }]
      );
      termTable(
        "AVAILABLE COMMANDS:",
        ["Command", "Description"],
        TERM_CMDS.map(function (c) {
          return [{ t: c[0], c: c[3] || "cyan" }, c[2]];
        })
      );
      termPrint("");
      termSection("TIP", ["Use '<command> --help' or 'help <command>' for details on a specific command. Press Tab to complete a command name."]);
      break;

    case "VER":
      termPrint("NeoMS Direct Access Terminal v2.2 — Build 2026.04 — Schema v2.2", "green");
      break;

    /* File system (JS/term-fs.js) */
    case "LS":
      termLs(args);
      break;
    case "CD":
      termCd(args[0]);
      break;
    case "PWD":
      termPrint(termFsPath(termCwd));
      break;
    case "CAT":
      termCat(args);
      break;

    /* Apps (JS/term-apps.js) */
    case "INBOX": {
      var unread = nvInboxUnread();
      nvOpenInbox();
      termPrint("Opening inbox" + (unread ? " — " + unread + " unread message" + (unread > 1 ? "s" : "") : "") + "...", "green");
      break;
    }
    case "WORLD":
      nvOpenWorld();
      termPrint("Opening personnel activity...", "green");
      break;

    /* Open an entity file, SCiPNET-style: system lines, then the viewer */
    case "ACCESS": {
      var ae = termFindEnt(args[0]);
      if (!args[0]) {
        termPrint("Usage: access <E-id>   e.g. access E-0138", "yellow");
        break;
      }
      if (!ae) {
        termPrint("Error: File '" + args[0] + "' does not exist in NeoMS~DB or is empty.", "red");
        break;
      }
      termSeq(termLoadLines(termEntId(ae.id)), function () {
        if (ae.clr && userClearance < ae.clr) return termDenied(ae.clr);
        openWin("entity", ae.id);
        termPrint('Displaying "' + termEntId(ae.id) + " · " + ae.name + '" in secured viewer.', "green");
      });
      break;
    }

    /* List an entity's reports; locked ones are redacted */
    case "REPORTS": {
      var re = termFindEnt(args[0]);
      if (!re) {
        termPrint(args[0] ? "Error: File '" + args[0] + "' does not exist in NeoMS~DB." : "Usage: reports <E-id>", args[0] ? "red" : "yellow");
        break;
      }
      if (re.clr && userClearance < re.clr) {
        termDenied(re.clr);
        break;
      }
      var colours = { INCIDENT: "red", BREACH: "red", SIGHTING: "orange", OBSERVATION: "blue" };
      var rl = re.reports || [];
      if (!rl.length) {
        termPrint("No reports on file for " + termEntId(re.id) + ".", "dim");
        break;
      }
      termTable(
        "INCIDENT REPORTS: " + termEntId(re.id) + " — " + re.name,
        ["#", "Type", "Title", "Date", "CLR"],
        rl.map(function (r, i) {
          var locked = r.clr && userClearance < r.clr;
          return [
            String(i + 1),
            { t: r.type || "REPORT", c: colours[r.type] || "dim" },
            locked ? { t: "[REDACTED]", c: "red" } : r.title,
            r.date || "",
            locked ? { t: "CL-" + r.clr, c: "red" } : "CL-" + (r.clr || 1)
          ];
        })
      );
      termPrint("Use 'report " + termEntId(re.id) + " <#>' to print a report.", "dim");
      break;
    }

    /* Print one report as a SCiPNET report block */
    case "REPORT": {
      var pe = termFindEnt(args[0]);
      var pn = parseInt(args[1], 10);
      var pr = pe && pe.reports ? pe.reports[pn - 1] : null;
      if (!pe || !pr) {
        termPrint(
          !pe ? "Usage: report <E-id> <#>   e.g. report E-0138 1" : "No report #" + (args[1] || "?") + " for " + termEntId(pe.id) + ". Use 'reports " + termEntId(pe.id) + "'.",
          "yellow"
        );
        break;
      }
      var path = termEntId(pe.id) + "/" + (pr.file ? pr.file.replace(/\.pdf$/i, "") : "report-" + pn);
      termSeq(termLoadLines(path), function () {
        var need = Math.max(pe.clr || 1, pr.clr || 1);
        if (userClearance < need) return termDenied(need);
        var withIds = [pr.author].concat(pr.contributors || []).filter(function (sid, i, all) {
          return sid && sid !== TERM_FILER && all.indexOf(sid) === i;
        });
        var meta = [["Title", pr.title], ["Entity", termEntId(pe.id) + " — " + pe.name], ["Date", pr.date || "UNKNOWN"]];
        if (pr.location) meta.push(["Location", pr.location]);
        if (pr.personnel) meta.push(["Personnel", pr.personnel]);
        meta.push(["Filed By", termStaff(TERM_FILER)]);
        if (withIds.length) meta.push(["With", withIds.map(termStaff).join(", ")]);
        meta.push(["Clearance", "CL-" + (pr.clr || 1)]);
        var sections = [];
        if (pr.summary) sections.push({ heading: "Summary", text: pr.summary });
        if (pr.foreword) sections.push({ heading: "Foreword", text: pr.foreword });
        if (pr.log && pr.log.length) {
          sections.push({
            heading: "Log",
            html: [termC("<Begin Log>", "dim")]
              .concat(pr.log.map(function (l) {
                if (typeof l === "string") return escHtml(l);
                if (l.note) return termC(l.note, "note");
                return (l.t ? termC("[" + l.t + "]", "cyan") + " " : "") + (l.who ? termC(l.who + ":", "bold") + " " : "") + escHtml(l.text || "");
              }))
              .concat([termC("<End Log>", "dim")])
          });
        }
        if (pr.notes) sections.push({ heading: "Closing Statement", text: pr.notes });
        termReport((pr.type || "INCIDENT") + " REPORT" + (pr.file ? " — " + pr.file.replace(/\.pdf$/i, "") : ""), meta, sections);
        termPrint(termRule("="), "dim");
      });
      break;
    }

    case "CLEAR": {
      var o = document.getElementById("term-out");
      if (o) o.innerHTML = "";
      break;
    }

    case "STATUS": {
      var breached = ENT.filter(function (e) { return e.status === "BREACHED"; }).length;
      termReport("SYSTEM STATUS REPORT", [
        ["Status", breached ? "ALERT — " + breached + " ACTIVE BREACH" + (breached > 1 ? "ES" : "") : "ONLINE"],
        ["Version", "NeoMS Direct Access Terminal v2.2"],
        ["Clearance", "CL-" + userClearance],
        ["Records", ENT.length + " entities · " + STF.length + " personnel · " + SIT.length + " sites"]
      ]);
      termTable(
        "ENTITY STATUS:",
        ["Entity", "Name", "Class", "Status"],
        ENT.map(function (e) {
          var col = e.status === "BREACHED" ? "red" : e.status === "MONITORED" ? "yellow" : "green";
          return [termEntId(e.id), e.name, e.cls, { t: e.status, c: col }];
        })
      );
      break;
    }

    case "BREACH": {
      var br = ENT.filter(function (e) {
        return e.status === "BREACHED";
      });
      if (br.length) {
        br.forEach(function (e) {
          termPrint("[BREACH] " + termEntId(e.id) + " — " + e.name, "red");
        });
      } else {
        termPrint("No active breaches.", "green");
      }
      break;
    }

    case "MAP":
      openWin("worldmap");
      termPrint("Opening interactive facility map...", "ok");
      break;

    case "LIST": {
      var sub = (args[0] || "").toUpperCase();
      if (sub === "ENTITIES" || sub === "") {
        termTable("ENTITY REGISTRY:", ["ID", "Name", "Class", "Scale", "CLR"], ENT.map(function (e) {
          return [{ t: termEntId(e.id), c: "cyan" }, e.name, e.cls, e.ps || "", "CL-" + (e.clr || 1)];
        }));
      } else if (sub === "PERSONNEL") {
        termTable("PERSONNEL RECORDS:", ["ID", "Name", "Position", "CLR"], STF.map(function (s) {
          return [{ t: "S-" + s.id, c: "cyan" }, (s.fname + " " + s.lname).trim(), s.pos, "CL-" + s.clr];
        }));
      } else if (sub === "SITES") {
        termTable("CONTAINMENT SITES:", ["Site", "Location", "Status"], SIT.map(function (s) {
          return [{ t: s.name, c: "cyan" }, s.loc, s.status];
        }));
      } else {
        termPrint("Unknown target. Try: list entities | list personnel | list sites", "red");
      }
      break;
    }

    case "GET": {
      var ent = (args[0] || "").toUpperCase() === "ENTITY" ? termFindEnt(args[1]) : null;
      if (!ent) {
        termPrint(args[1] ? "Entity " + args[1] + " not found." : "Usage: get entity <id>", args[1] ? "red" : "yellow");
        break;
      }
      termReport(termEntId(ent.id) + " — " + ent.name, [
        ["Class", ent.cls + (typeof CLS_LABELS !== "undefined" && CLS_LABELS[ent.cls] ? " (" + CLS_LABELS[ent.cls] + ")" : "")],
        ["Scale", ent.ps || "UNKNOWN"],
        ["Status", ent.status],
        ["Site", ent.site ? "Site-" + ent.site : "UNASSIGNED"],
        ["Clearance", "CL-" + (ent.clr || 1)],
        ["Protocols", String((ent.protocols || []).length)],
        ["Reports", String((ent.reports || []).length)]
      ]);
      termPrint("Use 'access " + termEntId(ent.id) + "' to open the file, or 'reports " + termEntId(ent.id) + "'.", "dim");
      break;
    }

    /* Old command — kept as an alias for ACCESS */
    case "OPEN":
      termRun("access " + ((args[0] || "").toUpperCase() === "ENTITY" ? args[1] || "" : args[0] || ""));
      break;

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
      termPrint(userClearance < 5 ? "  Access restricted." : "  Full access granted.", "dim");
      break;

    case "WHOAMI":
      if (sessionpersonnel) {
        termReport("SESSION IDENTITY", [
          ["ID", "S-" + sessionpersonnel.id],
          ["Name", (sessionpersonnel.fname + " " + sessionpersonnel.lname).trim()],
          ["Dept", sessionpersonnel.dept],
          ["Clearance", "CL-" + userClearance],
          ["Site", "Site-" + sessionpersonnel.site]
        ]);
      } else {
        termPrint("No session identity on record.", "warn");
      }
      break;

    case "TRANSMIT":
      if (!sessionpersonnel) {
        termPrint("No session identity. Complete intake first.", "err");
        break;
      }
      termPrint("Transmitting to NeoMS Registry...", "warn");
      fetch("https://formspree.io/f/xwvwybya", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          personnel_id: "S-" + sessionpersonnel.id,
          first_name: sessionpersonnel.fname,
          last_name: sessionpersonnel.lname,
          department: sessionpersonnel.dept,
          clearance: "CL-" + sessionpersonnel.clr,
          site: "Site-" + sessionpersonnel.site,
          timestamp: new Date().toISOString()
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function () {
          termPrint("TRANSMISSION COMPLETE.", "ok");
        })
        .catch(function (err) {
          termPrint("TRANSMISSION FAILED — " + err.message, "err");
        });
      break;

    case "DEPTREQ":
      termPrint("Department transfer request logged. Pending supervisor approval.", "warn");
      break;

    case "LOGOUT":
      try {
        localStorage.removeItem("neoms_session_personnel");
        localStorage.removeItem("neoms_clearance");
      } catch (e) {}
      termPrint("Session terminated. Redirecting to intake...", "warn");
      setTimeout(function () {
        window.location.href = "../../Neoms~Database/HTML/intake.html";
      }, 1200);
      break;

    default:
      termPrint(parts[0] + ": command not found. Type 'help' for a list of commands.", "red");
  }
}

/* ── SHARED HELPERS ──────────────────────────────────────────── */
function toast(msg, dur) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, dur || 2500);
}

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
