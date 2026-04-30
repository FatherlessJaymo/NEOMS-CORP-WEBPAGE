/* ============================================================
   DESKTOP CORE
   Handles: clock, start menu toggle, context menu,
            global click/keydown, VM terminal.

 =========================================================== */

/* ---- Clock ---- */
function updateClock() {
  var now = new Date();
  var h = now.getHours(),
    m = now.getMinutes(),
    s = now.getSeconds();
  var ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  var str = h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " " + ampm;
  var clk = document.getElementById("taskbar-clock");
  var lbl = document.getElementById("label-time");
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
  m.style.left = Math.min(e.clientX, window.innerWidth - 180) + "px";
  m.style.top = Math.min(e.clientY, window.innerHeight - 160) + "px";
});

/* ---- Global click: close menus, focus windows, deselect icons ---- */
document.addEventListener("click", function (e) {
  closeCtx();
  if (!document.getElementById("start-menu").contains(e.target) && e.target.id !== "start-btn") closeStart();

  if (!e.target.closest(".desk-icon") && !e.target.closest(".win"))
    document.querySelectorAll(".desk-icon").forEach(function (d) {
      d.classList.remove("selected");
    });

  var win = e.target.closest(".win");
  if (win) {
    var id = win.id.replace("win-", "");
    focusWin(id);
  }
});
