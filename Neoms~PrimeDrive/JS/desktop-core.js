/* ============================================================
   DESKTOP CORE
   Handles: clock, start menu toggle, context menu,
            global click/keydown, VM terminal.

 =========================================================== */

/* ---- Clock ---- */
function updateClock() {
  var now  = new Date();
  var h    = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  var ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  var str  = h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " " + ampm;
  var clk  = document.getElementById("taskbar-clock");
  var lbl  = document.getElementById("label-time");
  if (clk) clk.textContent = str;
  if (lbl) lbl.textContent = str;
}
updateClock();
setInterval(updateClock, 1000);

/* ---- Start menu ---- */
function toggleStart() {
  var m = document.getElementById("start-menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}
function closeStart() {
  var m = document.getElementById("start-menu");
  if (m) m.style.display = "none";
}

/* ---- Context menu ---- */
function closeCtx() {
  var m = document.getElementById("ctx-menu");
  if (m) m.style.display = "none";
}
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  var m = document.getElementById("ctx-menu");
  m.style.display = "block";
  m.style.left = Math.min(e.clientX, window.innerWidth  - 180) + "px";
  m.style.top  = Math.min(e.clientY, window.innerHeight - 160) + "px";
});

/* ---- Global click: close menus, focus windows, deselect icons ---- */
document.addEventListener("click", function (e) {
  closeCtx();
  if (
    !document.getElementById("start-menu").contains(e.target) &&
    e.target.id !== "start-btn"
  ) closeStart();

  if (!e.target.closest(".desk-icon") && !e.target.closest(".win"))
    document.querySelectorAll(".desk-icon").forEach(function (d) { d.classList.remove("selected"); });

  var win = e.target.closest(".win");
  if (win) { var id = win.id.replace("win-", ""); focusWin(id); }
});

/* ---- VM Terminal ---- */
var vmLines = [
  "NEOMSDATABASE v1.0",
  "Copyright (c) 2026 NeoMS Corp. All rights reserved.",
  "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501",
  "Establishing connection to NEOMS Database...",
  "[OK] Connected to NEOMSDATABASE cluster",
  "[OK] Authentication verified \u2014 FatherlessJaymo",
  "[OK] Loading containment records...",
  "",
  'Type "help" for available commands.',
  "",
];
var vmHistory = [], vmHistoryIdx = -1;
var vmCmds = {
  help:    function () { return ["Available commands:", "  help      \u2014 show this menu", "  status    \u2014 system status", "  ls        \u2014 list databases", "  whoami    \u2014 current user", "  clear     \u2014 clear terminal", "  ping      \u2014 test connection", "  rewrite   \u2014 launch REWRITE.EXE", "  exit      \u2014 terminate session"]; },
  status:  function () { return ["SYSTEM STATUS:", "  Connection: ACTIVE", "  Auth level: NEOMS-ADMIN", "  Database: ONLINE", "  Records: 2,048 entries", "  Uptime: 99.7%"]; },
  ls:      function () { return ["DATABASES:", "  /neoms-core          [ACTIVE]", "  /containment-log     [ACTIVE]", "  /rewrite-exe         [LOCKED]", "  /sinister-minds      [ACTIVE]", "  /creator-archive     [READ-ONLY]"]; },
  whoami:  function () { return ["FatherlessJaymo", "Role: NEOMS Creator / Admin", "Clearance: OMEGA"]; },
  ping:    function () { return ["PING neomsdatabase.neoms: 56 bytes", "Reply: time=4ms TTL=64", "Reply: time=3ms TTL=64", "Reply: time=5ms TTL=64", "--- 3 packets transmitted, 3 received, 0% loss"]; },
  clear:   function () { var s = document.getElementById("vm-shell"); if (s) s.innerHTML = ""; return []; },
  rewrite: function () { return ["Initiating REWRITE.EXE protocol...", "[WARN] Protocol requires clearance ALPHA", "[ERR] Insufficient permissions \u2014 contact NeoMS Admin"]; },
  exit:    function () { setTimeout(function () { closeWin("neomsdatabase"); }, 300); return ["Terminating session...", "[BYE]"]; },
};

function initVM() {
  var shell = document.getElementById("vm-shell");
  var input = document.getElementById("vm-input");
  if (!shell || !input) return;
  shell.innerHTML = "";
  vmLines.forEach(function (l) { printVMLine(shell, l); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var cmd = input.value.trim().toLowerCase();
      input.value = "";
      if (!cmd) return;
      vmHistory.unshift(cmd); vmHistoryIdx = -1;
      printVMLine(shell, "NEOMS@DB:~$ " + cmd);
      var fn = vmCmds[cmd];
      if (fn) { var out = fn(); if (out) out.forEach(function (l) { printVMLine(shell, l); }); }
      else printVMLine(shell, '[ERR] Unknown command: ' + cmd + '. Type "help".');
      shell.scrollTop = shell.scrollHeight;
    }
    if (e.key === "ArrowUp")   { vmHistoryIdx = Math.min(vmHistoryIdx + 1, vmHistory.length - 1); input.value = vmHistory[vmHistoryIdx] || ""; }
    if (e.key === "ArrowDown") { vmHistoryIdx = Math.max(vmHistoryIdx - 1, -1); input.value = vmHistoryIdx >= 0 ? vmHistory[vmHistoryIdx] : ""; }
  });
  shell.scrollTop = shell.scrollHeight;
}
function printVMLine(shell, text) {
  var div = document.createElement("div");
  div.className   = "vm-line";
  div.textContent = text;
  shell.appendChild(div);
}