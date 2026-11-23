/* ============================================================
   NEOMS — INTAKE TERMINAL LOGIC
   Neoms~Database/JS/intake.js

   New visitors: boot lines → registration form → optional
   registry transmission → archive.html.
   Returning visitors (session in localStorage): short boot,
   "welcome back", then straight to archive.html.
============================================================ */
"use strict";

const LS_KEY = "neoms_session_personnel";
const LS_ID_KEY = "neoms_next_personnel_id";
const FORMSPREE_URL = "https://formspree.io/f/xwvwybya";
const DESKTOP_URL = "archive.html";

/* ── localStorage helpers ─────────────────────────────────── */
function lsSave(r) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(r));
  } catch (e) {}
}
function lsLoad() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY));
  } catch (e) {
    return null;
  }
}

/* ── Persistent personnel ID counter ─────────────────────────── */
function loadNextId() {
  try {
    var stored = parseInt(localStorage.getItem(LS_ID_KEY), 10);
    return isNaN(stored) ? 2000 : stored;
  } catch (e) {
    return 2000;
  }
}
function saveNextId(id) {
  try {
    localStorage.setItem(LS_ID_KEY, String(id));
  } catch (e) {}
}

var nextpersonnelId = loadNextId();

/* ── On page load ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  /* Randomise the site/node ID shown in the titlebar */
  (function () {
    var sites = ["62656", "61107", "07301", "07302", "07303"];
    var site = sites[Math.floor(Math.random() * sites.length)];
    var node = String(Math.floor(Math.random() * 9) + 1).padStart(3, "0");
    var el = document.querySelector("#iv-titlebar span:last-child");
    if (el) el.textContent = "SITE-" + site + " // NODE-" + node;
  })();

  const saved = lsLoad();
  if (saved && saved.fname && saved.lname) {
    fastBoot(saved);
  } else {
    startBoot();
  }
});

/* ── BOOT LINES ───────────────────────────────────────────── */
const BOOT_LINES = [
  { delay: 0, text: "NEOMS_OS v2.1 — Initializing..." },
  { delay: 600, text: "Loading containment partition... OK" },
  { delay: 1100, text: "Soul-coherence arrays: ONLINE" },
  { delay: 1600, text: "boundary monitors: ELEVATED" },
  { delay: 2200, text: "Personnel authentication required." },
  { delay: 2800, text: "────────────────────────────────────────" },
  { delay: 3200, text: "NEW SYNTHETIC UNIT INTAKE PROTOCOL" },
  { delay: 3700, text: "Please provide identification for system registration." }
];

function printLine(text, ok) {
  const screen = document.getElementById("iv-screen");
  const d = document.createElement("div");
  d.className = "iv-line" + (ok ? " iv-line-ok" : "");
  d.textContent = text;
  screen.appendChild(d);
  screen.scrollTop = screen.scrollHeight;
}

/* ── NEW USER — full interview ────────────────────────────── */
function startBoot() {
  let maxDelay = 0;
  BOOT_LINES.forEach(({ delay, text }) => {
    maxDelay = Math.max(maxDelay, delay);
    setTimeout(() => printLine(text, false), delay);
  });
  setTimeout(() => {
    const previewEl = document.getElementById("iv-preview-id");
    if (previewEl) previewEl.textContent = nextpersonnelId;
    document.getElementById("iv-form").classList.add("visible");
  }, maxDelay + 600);
}

/* ── RETURNING USER — fast boot then redirect ─────────────── */
function fastBoot(record) {
  const lines = [
    { delay: 0, text: "NEOMS_OS v2.1 — Initializing..." },
    { delay: 500, text: "Loading containment partition... OK" },
    { delay: 900, text: "Soul-coherence arrays: ONLINE" },
    { delay: 1200, text: "────────────────────────────────────────" },
    { delay: 1400, text: "SESSION RECORD FOUND" },
    { delay: 1600, text: "personnel ID : S-" + record.id },
    { delay: 1750, text: "NAME     : " + record.fname + " " + record.lname },
    { delay: 1900, text: "DEPT     : " + record.dept },
    { delay: 2050, text: "CLR      : CL-" + record.clr },
    { delay: 2200, text: "────────────────────────────────────────" },
    { delay: 2400, text: "Welcome back, " + record.fname + ". Resuming session..." }
  ];
  lines.forEach(({ delay, text }) => {
    setTimeout(() => printLine(text, true), delay);
  });
  setTimeout(() => {
    document.getElementById("iv-overlay").classList.add("iv-fadeout");
    setTimeout(() => {
      window.location.href = DESKTOP_URL;
    }, 2100);
  }, 2900);
}

/* ── SUBMIT FORM ──────────────────────────────────────────── */
function submitInterview() {
  const fname = document.getElementById("iv-fname").value.trim();
  const lname = document.getElementById("iv-lname").value.trim();
  const err = document.getElementById("iv-err");

  if (!fname || !lname) {
    err.textContent = "BOTH FIELDS REQUIRED";
    return;
  }
  err.textContent = "";

  const newId = nextpersonnelId++;
  saveNextId(nextpersonnelId);

  const record = {
    id: newId,
    fname,
    lname,
    pos: "Synthetic Intake Unit",
    dept: "SYNTHETICS",
    clr: 1,
    site: 62656,
    active: "Y"
  };

  lsSave(record);
  /* New personnel always start at CL-1, whatever this browser had before */
  try {
    localStorage.setItem("neoms_clearance", "1");
  } catch (e) {}
  document.getElementById("iv-form").classList.remove("visible");
  showTransmitStep(record);
}

/* ── TRANSMIT STEP ────────────────────────────────────────── */
function showTransmitStep(record) {
  const confirmLines = [
    "────────────────────────────────────────",
    "REGISTRATION COMPLETE",
    "personnel ID : S-" + record.id,
    "NAME     : " + record.fname + " " + record.lname,
    "DEPT     : SYNTHETICS",
    "CLR      : CL-1",
    "SITE     : Site-62656",
    "────────────────────────────────────────"
  ];
  confirmLines.forEach((t, i) => {
    setTimeout(() => printLine(t, true), i * 110);
  });
  setTimeout(
    () => {
      const panel = document.getElementById("iv-transmit");
      if (panel) {
        const txBtn = document.getElementById("iv-tx-btn");
        const skipBtn = document.getElementById("iv-tx-skip");
        if (txBtn)
          txBtn.onclick = function () {
            doTransmit(record);
          };
        if (skipBtn)
          skipBtn.onclick = function () {
            skipTransmit();
          };
        panel.classList.add("visible");
      }
    },
    confirmLines.length * 110 + 200
  );
}

/* ── TRANSMIT REGISTRY ────────────────────────────────────── */
function transmitToRegistry(record) {
  return fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      personnel_id: "S-" + record.id,
      first_name: record.fname,
      last_name: record.lname,
      department: record.dept,
      clearance: "CL-" + record.clr,
      site: "Site-" + record.site,
      position: record.pos,
      timestamp: new Date().toISOString()
    })
  }).then((res) => {
    if (!res.ok) throw new Error("Server returned " + res.status);
    return res.json();
  });
}

function doTransmit(record) {
  const btn = document.getElementById("iv-tx-btn");
  const status = document.getElementById("iv-tx-status");
  if (!btn || !status) return;

  btn.disabled = true;
  btn.textContent = "TRANSMITTING...";
  status.className = "is-busy";
  status.textContent = "Establishing link to NeoMS Central Registry...";

  transmitToRegistry(record)
    .then(() => {
      status.className = "is-ok";
      status.textContent = "TRANSMISSION CONFIRMED — record logged.";
      btn.textContent = "TRANSMITTED \u2713";
      setTimeout(proceedToDesktop, 1800);
    })
    .catch((err) => {
      status.className = "is-err";
      status.textContent = "TRANSMISSION FAILED — " + err.message + ". Session saved locally.";
      btn.disabled = false;
      btn.textContent = "\u25B6 RETRY TRANSMIT";
    });
}

function skipTransmit() {
  printLine("Transmission skipped. Session saved locally only.", false);
  setTimeout(proceedToDesktop, 800);
}

function proceedToDesktop() {
  printLine("Opening containment archive...", true);
  setTimeout(() => {
    document.getElementById("iv-overlay").classList.add("iv-fadeout");
    setTimeout(() => {
      window.location.href = DESKTOP_URL;
    }, 2100);
  }, 600);
}
