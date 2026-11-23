/* terminal window JS
   The terminal engine (termKey, termRun, termSeq, termSection…) lives
   in JS/db-common.js and writes to #term-out / #term-in in this HTML. */

/* Header + prompt show who is signed in */
const user = document.getElementById("term-user");
if (user && sessionpersonnel) {
  user.textContent = (sessionpersonnel.fname + " " + sessionpersonnel.lname).trim() + " · S-" + sessionpersonnel.id;
}
const prompt = document.getElementById("term-prompt");
const input = document.getElementById("term-in");
const outs = document.getElementById("term-outs");
const tabsEl = document.getElementById("term-tabs");

/* ── Terminal tabs ──────────────────────────────────────────────
   Each tab keeps its own output pane, working directory and
   history. The engine in db-common.js always writes to
   #term-out, so switching tabs moves that id to the new pane. */
const MAX_TABS = 6;
let tabs = [];
let active = null;
let tabSeq = 0;

function saveActive() {
  if (!active) return;
  active.cwd = termCwd;
  active.history = termHistory;
  active.el.removeAttribute("id");
  active.el.hidden = true;
}

function selectTab(t) {
  if (termBusy && active) return;
  saveActive();
  active = t;
  t.el.hidden = false;
  t.el.id = "term-out";
  termCwd = t.cwd;
  termHistory = t.history;
  termHIdx = -1;
  prompt.innerHTML = termPromptHTML();
  renderTabs();
  input.focus();
}

function closeTab(t) {
  if (tabs.length === 1 || termBusy) return;
  const i = tabs.indexOf(t);
  tabs.splice(i, 1);
  t.el.remove();
  if (active === t) {
    active = null;
    selectTab(tabs[Math.max(0, i - 1)]);
  } else {
    renderTabs();
  }
}

function newTab() {
  if (termBusy || tabs.length >= MAX_TABS) return;
  const el = document.createElement("div");
  el.className = "term-out";
  el.setAttribute("role", "log");
  el.setAttribute("aria-live", "polite");
  outs.appendChild(el);
  const t = { n: ++tabSeq, el: el, cwd: [], history: [] };
  tabs.push(t);
  selectTab(t);
  boot(t.n === 1);
}

function renderTabs() {
  tabsEl.innerHTML =
    tabs.map(function (t) {
      return '<span class="term-inst-wrap">' +
        '<button type="button" role="tab" class="term-inst' + (t === active ? " on" : "") +
        '" aria-selected="' + (t === active) + '" data-tab="' + t.n + '">TERMINAL ' + t.n + "</button>" +
        (tabs.length > 1 ? '<button type="button" class="term-inst-x" data-close="' + t.n + '" aria-label="Close terminal ' + t.n + '">&#215;</button>' : "") +
        "</span>";
    }).join("") +
    (tabs.length < MAX_TABS ? '<button type="button" class="term-inst-add" aria-label="New terminal" title="New terminal">+</button>' : "");
}

tabsEl.addEventListener("click", function (e) {
  const byN = function (n) {
    return tabs.filter(function (t) { return t.n === parseInt(n, 10); })[0];
  };
  const close = e.target.closest("[data-close]");
  if (close) return closeTab(byN(close.dataset.close));
  const tab = e.target.closest("[data-tab]");
  if (tab) return selectTab(byN(tab.dataset.tab));
  if (e.target.closest(".term-inst-add")) newTab();
});

/* SCiPNET-style boot. The first tab gets the full sequence. */
function boot(first) {
  const lines = first
    ? [
        termInfo("LOADING FONT RESOURCES..."),
        termInfo("VERIFYING DATABASE ACCESS..."),
        termInfo("LOADING DATABASE... " + ENTITIES.length + " entities, " + personnel.length + " personnel, " + SITES.length + " sites"),
        termInfo("SESSION " + TERM_SESSION.toUpperCase() + " OPEN — CLEARANCE CL-" + userClearance)
      ]
    : [termInfo("TERMINAL " + tabSeq + " OPEN — SESSION " + TERM_SESSION.toUpperCase())];
  termSeq(lines, function () {
    termFit();
    termPrint("");
    if (!first) return termPrint("Type 'help' for a list of commands.", "dim");
    termSection(
      "OVERVIEW",
      [
        "Welcome to the NeoMS Direct Access Terminal. All activity on this terminal is logged. Unauthorised disclosure of entity data is a Class-KT offense."
      ],
      [{ title: "TIP", content: ["Type 'help' for a list of commands. Try 'ls', then 'cd entities/e-0138' and 'cat e-0138.nms'. Check your INBOX."] }]
    );
  });
}

/* ── INBOX / WORLD buttons ── */
const inboxBtn = document.getElementById("term-inbox");
function updateMailBadge() {
  const unread = nvInboxUnread();
  inboxBtn.classList.toggle("has-mail", unread > 0);
  inboxBtn.querySelector(".term-dot").hidden = unread === 0;
  inboxBtn.setAttribute("aria-label", "Inbox" + (unread ? ", " + unread + " unread" : ""));
}
inboxBtn.addEventListener("click", nvOpenInbox);
document.getElementById("term-world").addEventListener("click", nvOpenWorld);
window.addEventListener("nv-inbox", updateMailBadge);
updateMailBadge();

newTab();
