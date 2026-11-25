/* ============================================================
   NEOMS — INTAKE: ACCESS APPLICATION FORM
   Neoms~Database/JS/intake.js

   After SCiPNET's Access Application Form: a white document in a
   terminal window. New visitors fill in the form (a live checklist
   gates SUBMIT) → optional registry transmission → archive.html.
   Returning visitors (session in localStorage) see their record,
   then go straight to archive.html.

   The saved record keeps the same shape the archive expects:
   { id, fname, lname, pos, dept, clr, site, active }.
============================================================ */
"use strict";

const LS_KEY = "neoms_session_personnel";
const FORMSPREE_URL = "https://formspree.io/f/xwvwybya";
const DESKTOP_URL = "archive.html";
const MAX_LEN = 40;
const NAME_OK = /^[\p{L}\p{N} .'\-]+$/u;

const $ = (id) => document.getElementById(id);

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
/* Random ID in S-3000…S-9999 — kept clear of the static roster (S-1xxx/S-2xxx).
   A static site can't guarantee uniqueness; this just makes collisions unlikely. */
function generatePersonnelId() {
  const n = new Uint32Array(1);
  (window.crypto || window.msCrypto).getRandomValues(n);
  return 3000 + (n[0] % 7000);
}

let nextpersonnelId = generatePersonnelId();

/* ── Background: a terminal file listing behind the window ── */
function fillBackground() {
  const names = [];
  for (let i = 1; i <= 1200; i++) names.push("nms-" + String(i).padStart(4, "0") + ".nms");
  $("ap-bg").textContent = names.join("  ");
}

/* ── Record summary (dl) ──────────────────────────────────── */
function siteName(id) {
  const s = (typeof SITES !== "undefined" ? SITES : []).find((x) => x.id === id);
  return s ? s.name + " — " + s.loc : "Site-" + id;
}
function renderRecord(el, r) {
  const rows = [
    ["Personnel ID", "S-" + r.id],
    ["Name", (r.fname + " " + r.lname).trim()],
    ["Department", r.dept],
    ["Position", r.pos],
    ["Clearance", "CL-" + r.clr],
    ["Working site", siteName(r.site)]
  ];
  el.innerHTML = rows
    .map(([k, v]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = k;
      dd.textContent = v;
      return dt.outerHTML + dd.outerHTML;
    })
    .join("");
}

/* ── On page load ─────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  fillBackground();
  const saved = lsLoad();
  if (saved && saved.fname && saved.lname) showSession(saved);
  else showForm();
});

/* ── RETURNING USER — record, then redirect ──────────────── */
let resumeTimer = null;

function showSession(record) {
  $("ap-session").hidden = false;
  renderRecord($("ap-session-record"), record);
  $("ap-session-msg").textContent = "Welcome back, " + record.fname + ". Resuming session…";
  resumeTimer = setTimeout(proceedToDesktop, 2600);
  $("ap-continue").addEventListener("click", function () {
    clearTimeout(resumeTimer);
    proceedToDesktop();
  });
  $("ap-continue").focus();
  $("ap-new").addEventListener("click", function () {
    clearTimeout(resumeTimer);
    try {
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem("neoms_clearance");
    } catch (e) {}
    $("ap-session").hidden = true;
    showForm();
  });
}

/* ── NEW USER — the application form ─────────────────────── */
function showForm() {
  const form = $("ap-form");
  form.hidden = false;
  $("ap-id").textContent = "S-" + nextpersonnelId;

  /* Working site options from the site data */
  const sel = $("ap-site");
  (typeof SITES !== "undefined" ? SITES : [{ id: 62656, name: "Site-62656", loc: "" }]).forEach(function (s) {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name + (s.loc ? " — " + s.loc : "");
    sel.appendChild(o);
  });
  sel.value = "62656";

  form.addEventListener("input", updateChecklist);
  form.addEventListener("change", updateChecklist);
  form.addEventListener("submit", submitApplication);
  updateChecklist();
  $("ap-fname").focus();
}

/* Live checklist: each row ticks itself; SUBMIT unlocks when all pass */
function checks() {
  const f = $("ap-fname").value.trim();
  const l = $("ap-lname").value.trim();
  return {
    filled: !!(f && l),
    length: f.length <= MAX_LEN && l.length <= MAX_LEN,
    chars: (!f || NAME_OK.test(f)) && (!l || NAME_OK.test(l)),
    ack: $("ap-ack").checked
  };
}
function updateChecklist() {
  const c = checks();
  document.querySelectorAll("#ap-check [data-check]").forEach(function (li) {
    const ok = c[li.dataset.check];
    li.classList.toggle("ok", ok);
    li.setAttribute("aria-label", li.textContent + (ok ? " — done" : " — not yet"));
  });
  document.querySelector(".ap-check-ack").classList.toggle("ok", c.ack);
  $("ap-submit").disabled = !(c.filled && c.length && c.chars && c.ack);
}

function submitApplication(e) {
  e.preventDefault();
  const c = checks();
  if (!(c.filled && c.length && c.chars && c.ack)) return;

  const newId = nextpersonnelId;
  const record = {
    id: newId,
    fname: $("ap-fname").value.trim(),
    lname: $("ap-lname").value.trim(),
    pos: "Synthetic Intake Unit",
    dept: "SYNTHETICS",
    clr: 1,
    site: parseInt($("ap-site").value, 10) || 62656,
    active: "Y"
  };
  lsSave(record);
  /* New personnel always start at CL-1, whatever this browser had before */
  try {
    localStorage.setItem("neoms_clearance", "1");
  } catch (e2) {}

  $("ap-form").hidden = true;
  showTransmitStep(record);
}

/* ── TRANSMIT STEP ────────────────────────────────────────── */
function showTransmitStep(record) {
  const sec = $("ap-transmit");
  renderRecord($("ap-record"), record);
  sec.hidden = false;
  document.querySelector(".ap-scroll").scrollTop = 0;
  $("ap-tx").onclick = function () {
    doTransmit(record);
  };
  $("ap-skip").onclick = function () {
    setStatus("Transmission skipped. Session saved locally only.", "");
    setTimeout(proceedToDesktop, 700);
  };
  $("ap-tx").focus();
}

function setStatus(text, cls) {
  const s = $("ap-status");
  s.className = "ap-status" + (cls ? " is-" + cls : "");
  s.textContent = text;
}

function transmitToRegistry(record) {
  /* Spam trap filled in: a bot. Report success and send nothing. */
  if ($("ap-gotcha").value) return Promise.resolve({ ok: true });
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
  const btn = $("ap-tx");
  btn.disabled = true;
  btn.textContent = "TRANSMITTING…";
  setStatus("Establishing link to NeoMS Central Registry…", "busy");

  transmitToRegistry(record)
    .then(() => {
      setStatus("TRANSMISSION CONFIRMED — record logged.", "ok");
      btn.textContent = "TRANSMITTED ✓";
      setTimeout(proceedToDesktop, 1500);
    })
    .catch((err) => {
      setStatus("TRANSMISSION FAILED — " + err.message + ". Session saved locally.", "err");
      btn.disabled = false;
      btn.textContent = "RETRY TRANSMIT";
    });
}

function proceedToDesktop() {
  document.body.classList.add("ap-fadeout");
  setTimeout(() => {
    window.location.href = DESKTOP_URL;
  }, 900);
}
