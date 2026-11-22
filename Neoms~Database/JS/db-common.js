/* ============================================================
   NEOMS~DATABASE — SHARED TERMINAL + HELPERS
   Terminal commands (termKey / termPrint / termRun), toast and
   escHtml. Used by archive.html; load before archive-shell.js.
   ============================================================ */
"use strict";

/* ── TERMINAL FUNCTIONS (globals needed by window HTML) ───────── */
var termHistory = [];
var termHIdx = -1;

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
  if (cls === "err") d.style.color = "#ff4444";
  else if (cls === "warn") d.style.color = "#ffaa00";
  else if (cls === "ok") d.style.color = "#00ee88";
  else if (cls === "dim") d.style.color = "#6f9a86";
  d.textContent = txt;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

function termRun(raw) {
  var parts = raw.split(" ");
  var cmd = parts[0].toUpperCase();
  var args = parts.slice(1);
  var ENT = typeof ENTITIES !== "undefined" ? ENTITIES : [];
  var STF = typeof personnel !== "undefined" ? personnel : [];
  var SIT = typeof SITES !== "undefined" ? SITES : [];

  switch (cmd) {
    case "HELP":
      [
        "HELP              — show this list",
        "LIST              — list records  (LIST ENTITIES | LIST PERSONNEL | LIST SITES)",
        "GET               — get entity by ID  (GET ENTITY <id>)",
        "OPEN              — open entity window  (OPEN ENTITY <id>)",
        "STATUS            — overall system status",
        "BREACH            — list breached entities",
        "MAP               — open interactive facility map",
        "CODE              — open source file viewer",
        "CLEAR             — clear terminal output",
        "VER               — version info",
        "SETCLR <1-4>      — set clearance level (CL-5:Enter Code)",
        "CLRINFO           — show current clearance",
        "WHOAMI            — show session identity",
        "TRANSMIT          — send record to NeoMS Registry",
        "LOGOUT            — wipe session and return to intake"
      ].forEach(function (l) {
        termPrint("  " + l, "dim");
      });
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
          "  E-" +
            String(e.id).padStart(4, "0") +
            " [" +
            e.cls +
            "] " +
            e.name.padEnd(32, " ") +
            " STATUS: " +
            e.status,
          e.status === "BREACHED" ? "err" : e.status === "MONITORED" ? "warn" : "dim"
        );
      });
      break;

    case "BREACH": {
      var br = ENT.filter(function (e) {
        return e.status === "BREACHED";
      });
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
          termPrint("  E-" + String(e.id).padStart(4, "0") + " [" + e.cls + "/" + e.ps + "] " + e.name);
        });
      } else if (sub === "PERSONNEL") {
        STF.forEach(function (s) {
          termPrint("  S-" + s.id + " [CL-" + s.clr + "] " + s.fname + " " + s.lname + " — " + s.pos);
        });
      } else if (sub === "SITES") {
        SIT.forEach(function (s) {
          termPrint("  " + s.name + " — " + s.loc + " (" + s.status + ")");
        });
      } else {
        termPrint("Unknown target. Try: LIST ENTITIES | LIST PERSONNEL | LIST SITES", "err");
      }
      break;
    }

    case "GET": {
      var gs = (args[0] || "").toUpperCase();
      var gi = parseInt(args[1]);
      if (gs === "ENTITY" && !isNaN(gi)) {
        var ent = ENT.find(function (x) {
          return x.id === gi;
        });
        if (ent) {
          ["name", "cls", "ps", "status", "site", "protocols"].forEach(function (k) {
            termPrint(
              "  " +
                k.padEnd(10, " ") +
                ": " +
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
        var oe = ENT.find(function (x) {
          return x.id === oi;
        });
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
      termPrint(userClearance < 5 ? "  Access restricted." : "  Full access granted.", "dim");
      break;

    case "WHOAMI":
      if (sessionpersonnel) {
        termPrint("Session identity:", "ok");
        termPrint("  ID   : S-" + sessionpersonnel.id);
        termPrint("  Name : " + sessionpersonnel.fname + " " + sessionpersonnel.lname);
        termPrint("  Dept : " + sessionpersonnel.dept);
        termPrint("  CLR  : CL-" + sessionpersonnel.clr);
        termPrint("  Site : Site-" + sessionpersonnel.site);
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
      termPrint("Unknown command: " + cmd + ". Type HELP.", "err");
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
