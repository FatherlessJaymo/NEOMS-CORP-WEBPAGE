/* ============================================================
   NEOMS~DATABASE — TERMINAL APPS: INBOX + PERSONNEL ACTIVITY
   The two windows behind the terminal's INBOX and WORLD buttons,
   after SCiPNET's email client and World Activity panel. Both are
   offline: the inbox is story mail that unlocks by clearance, and
   "last seen" times are simulated from the personnel data.
   Load after term-fs.js.
   ============================================================ */
"use strict";

/* ── INBOX ───────────────────────────────────────────────────────
   from = personnel ID; clr = clearance needed to receive it.
   Any "cat ~/…" text in a body becomes a link that runs it. */
var NV_INBOX = [
  {
    id: "m1",
    from: 1002,
    clr: 1,
    date: "20██-04-02",
    subject: "Welcome to the NeoMS Direct Access Terminal",
    body:
      "Operator,\n\nYour terminal access is live. Everything you need is in the file tree: type ls to look around, cd entities to move, and cat any .nms file to open it in the secured viewer.\n\nEach entity has its own folder under ~/entities, with its reports inside. Read them in order. The order matters.\n\nStart here: cat ~/readme.txt\n\nEverything you type on this terminal is logged. I read the logs.\n\n— Nova\nAI Overseer"
  },
  {
    id: "m2",
    from: 1003,
    clr: 2,
    date: "20██-04-05",
    subject: "RE: E-0138 — read this before your first shift",
    body:
      "Whatever the INTERACTION protocol says about the exit phrase, don't treat it as a guarantee. I can't say more at your level.\n\nIf REWRITE ever asks who's watching, the answer is nobody. Say nothing.\n\nAnd don't bring a handheld into Wing C. I mean it. Read this one: cat ~/entities/e-0138/reports/03-observation.nms\n\n— Dr. Echo, S-1003"
  },
  {
    id: "m3",
    from: 1004,
    clr: 3,
    date: "20██-04-09",
    subject: "Zenin records — translation suspended",
    body:
      "All translation work on the recovered Zenin clan records is suspended until further notice. Do not read any part of them aloud, in any language, anywhere on site.\n\nIf you hear the Dharma wheel turn, leave the room before you report it.\n\nThe full reason is CL-5. Trust me that it's a good one.\n\n— Dr. Akutami, S-1004"
  },
  {
    id: "m4",
    from: 1007,
    clr: 3,
    date: "20██-04-12",
    subject: "GABRIEL-TONE — screening reminder",
    body:
      "If you catch yourself humming something low that you don't remember hearing, report to the Screening Ward. Don't finish the tune first.\n\nArchive footage of E-0333 is a Class-3 memetic hazard. Shielding on, every time. The analyst from the fourth-wall event is fine. Mostly. They keep asking whether the tape still exists.\n\nBackground: cat ~/entities/e-0333/reports/04-incident.nms\n\n— Dr. Zilla, S-1007"
  },
  {
    id: "m5",
    from: 1002,
    clr: 5,
    date: "20██-04-14",
    subject: "EYES ONLY — the exit phrase",
    body:
      "You've read the Sincere test by now, or you're about to: cat ~/entities/e-0138/reports/05-incident.nms\n\nThe phrase is a promise, not a password. Nobody below CL-5 is told, and that stays true.\n\nIf you ever give an order that keeps someone in a session with REWRITE, you have killed them. Remember that.\n\n— Nova"
  }
];

var NV_READ_KEY = "neoms_inbox_read";

function nvReadSet() {
  try {
    return JSON.parse(localStorage.getItem(NV_READ_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function nvInboxVisible() {
  return NV_INBOX.filter(function (m) { return userClearance >= m.clr; });
}
function nvInboxUnread() {
  var read = nvReadSet();
  return nvInboxVisible().filter(function (m) { return read.indexOf(m.id) === -1; }).length;
}
function nvMarkRead(id) {
  var read = nvReadSet();
  if (read.indexOf(id) !== -1) return;
  read.push(id);
  try {
    localStorage.setItem(NV_READ_KEY, JSON.stringify(read));
  } catch (e) {}
  window.dispatchEvent(new Event("nv-inbox"));
}

/* Run a terminal command from a link in a window */
function nvRunCmd(cmd) {
  if (typeof openWin === "function" && userClearance >= 4) openWin("terminal");
  if (termBusy) return;
  termHTML(termPromptHTML() + " " + escHtml(cmd));
  termRun(cmd);
}

function nvOpenInbox() {
  var w = termViewer("INBOX", '<div class="nv-app nv-inbox"><div class="nv-inbox-list" role="listbox" aria-label="Messages"></div><section class="nv-inbox-read" aria-live="polite"><p class="nv-empty">Select a message to read it</p></section></div>', { cls: "nv-win--dark nv-win--app", app: "inbox" });
  var list = w.querySelector(".nv-inbox-list");
  var pane = w.querySelector(".nv-inbox-read");
  if (!list || list.dataset.ready) return w; /* already open */
  list.dataset.ready = "1";

  function renderList(activeId) {
    var read = nvReadSet();
    var mail = nvInboxVisible().slice().reverse();
    var hidden = NV_INBOX.length - mail.length;
    list.innerHTML =
      mail.map(function (m) {
        var unread = read.indexOf(m.id) === -1;
        return '<button type="button" role="option" class="nv-mail' + (unread ? " unread" : "") + (m.id === activeId ? " on" : "") +
          '" aria-selected="' + (m.id === activeId) + '" data-id="' + m.id + '">' +
          '<span class="nv-mail-from">' + escHtml(termStaff(m.from).replace(/ \(S-\d+\)$/, "")) + "</span>" +
          '<span class="nv-mail-date">' + escHtml(m.date) + "</span>" +
          '<span class="nv-mail-subj">' + escHtml(m.subject) + "</span></button>";
      }).join("") +
      (hidden ? '<p class="nv-mail-locked">' + hidden + " message" + (hidden > 1 ? "s" : "") + " require higher clearance</p>" : "");
  }

  function show(id) {
    var m = NV_INBOX.filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    nvMarkRead(id);
    renderList(id);
    var op = typeof sessionpersonnel !== "undefined" && sessionpersonnel
      ? (sessionpersonnel.fname + " " + sessionpersonnel.lname).trim() + " (S-" + sessionpersonnel.id + ")" : "Operator";
    var body = escHtml(m.body).replace(/cat ~\/[\w.\/-]+/g, function (c) {
      return '<button type="button" class="nv-cmd" data-cmd="' + c + '">' + c + "</button>";
    });
    pane.innerHTML =
      "<h2>" + escHtml(m.subject) + "</h2>" +
      '<dl class="nv-mail-meta"><dt>From</dt><dd>' + escHtml(termStaff(m.from)) + "</dd>" +
      "<dt>To</dt><dd>" + escHtml(op) + "</dd><dt>Date</dt><dd>" + escHtml(m.date) + "</dd>" +
      "<dt>Clearance</dt><dd>CL-" + m.clr + "</dd></dl>" +
      '<div class="nv-mail-body">' + body + "</div>";
  }

  list.addEventListener("click", function (e) {
    var b = e.target.closest(".nv-mail");
    if (b) show(b.dataset.id);
  });
  pane.addEventListener("click", function (e) {
    var c = e.target.closest(".nv-cmd");
    if (c) nvRunCmd(c.dataset.cmd);
  });
  renderList();
  return w;
}

/* ── PERSONNEL ACTIVITY (the WORLD button) ───────────────────── */
var nvSeen = {};

function nvRollSeen() {
  (typeof personnel !== "undefined" ? personnel : []).forEach(function (s) {
    nvSeen[s.id] = s.active === "Y" ? Math.floor(Math.random() * 20) + 1 : null;
  });
}

function nvOpenWorld() {
  var me = typeof sessionpersonnel !== "undefined" ? sessionpersonnel : null;
  var depts = typeof DEPTS !== "undefined" ? DEPTS : [];
  var w = termViewer(
    "PERSONNEL ACTIVITY",
    '<div class="nv-app nv-world">' +
      '<header class="nv-world-head"><span class="nv-avatar" aria-hidden="true">&#9673;</span><div><b>' +
      escHtml(me ? (me.fname + " " + me.lname).trim() : "Operator") + "</b><small>" +
      escHtml(me ? me.pos || me.dept || "Operator" : "Guest") + "</small></div>" +
      '<button type="button" class="nv-refresh">&#8635; Refresh</button></header>' +
      '<div class="nv-world-search"><input type="search" placeholder="Search all personnel on the network…" aria-label="Search personnel" />' +
      '<select aria-label="Filter personnel"><option value="all">All personnel</option><option value="active">Active only</option>' +
      depts.map(function (d) { return '<option value="' + escHtml(d) + '">' + escHtml(d) + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="nv-world-main"><ul class="nv-world-list" role="listbox" aria-label="Personnel"></ul>' +
      '<section class="nv-world-detail" aria-live="polite"><p class="nv-empty">Select personnel to view their assignment</p></section></div>' +
      '<footer class="nv-world-foot"></footer></div>',
    { cls: "nv-win--dark nv-win--app", app: "world" }
  );
  var listEl = w.querySelector(".nv-world-list");
  if (!listEl || listEl.dataset.ready) return w;
  listEl.dataset.ready = "1";
  var search = w.querySelector(".nv-world-search input");
  var filter = w.querySelector(".nv-world-search select");
  var detail = w.querySelector(".nv-world-detail");
  var foot = w.querySelector(".nv-world-foot");
  var current = null;

  if (!Object.keys(nvSeen).length) nvRollSeen();

  function people() {
    var list = (typeof personnel !== "undefined" ? personnel : []).slice();
    if (me && !list.some(function (s) { return s.id === me.id; })) {
      list.unshift({ id: me.id, fname: me.fname, lname: me.lname, pos: me.pos || "Operator", dept: me.dept, clr: userClearance, site: me.site, active: "Y", you: true });
    }
    return list;
  }
  function seenText(s) {
    if (s.you) return "online now";
    var h = nvSeen[s.id];
    return h == null ? "inactive" : h + "h ago";
  }

  function render() {
    var q = search.value.trim().toLowerCase();
    var f = filter.value;
    var rows = people().filter(function (s) {
      var hay = (s.fname + " " + s.lname + " " + s.pos + " S-" + s.id).toLowerCase();
      if (q && hay.indexOf(q) === -1) return false;
      if (f === "active") return s.active === "Y";
      if (f !== "all") return s.dept === f;
      return true;
    });
    rows.sort(function (a, b) {
      var ha = a.you ? -1 : nvSeen[a.id] == null ? 999 : nvSeen[a.id];
      var hb = b.you ? -1 : nvSeen[b.id] == null ? 999 : nvSeen[b.id];
      return ha - hb;
    });
    listEl.innerHTML = rows.map(function (s) {
      var on = s.you || nvSeen[s.id] != null;
      return '<li><button type="button" role="option" aria-selected="' + (current === s.id) + '" class="nv-person' + (current === s.id ? " on" : "") + '" data-id="' + s.id + '">' +
        '<span class="nv-person-name">' + (on ? '<span class="nv-live" title="Recently active">&#9679;</span>' : "") +
        escHtml((s.fname + " " + s.lname).trim()) + (s.you ? " (you)" : "") + "</span>" +
        '<span class="nv-person-lvl">L' + s.clr + "</span>" +
        '<span class="nv-person-sub">' + escHtml(s.pos) + " · " + seenText(s) + "</span></button></li>";
    }).join("") || '<li class="nv-empty">No personnel match.</li>';
    var online = people().filter(function (s) { return s.you || nvSeen[s.id] != null; }).length;
    foot.textContent = online + " personnel online recently";
  }

  function showPerson(id) {
    var s = people().filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    current = id;
    render();
    var site = (typeof SITES !== "undefined" ? SITES : []).filter(function (x) { return x.id === s.site; })[0];
    var ents = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (e) { return s.site && e.site === s.site; });
    var reps = [];
    (typeof ENTITIES !== "undefined" ? ENTITIES : []).forEach(function (e) {
      (e.reports || []).forEach(function (r, i) {
        if (r.author === s.id || (r.contributors || []).indexOf(s.id) !== -1) reps.push({ e: e, r: r, i: i });
      });
    });
    detail.innerHTML =
      "<h3>" + escHtml((s.fname + " " + s.lname).trim()) + "</h3>" +
      '<p class="nv-person-id">S-' + s.id + " · " + escHtml(s.pos) + "</p>" +
      '<dl class="nv-mail-meta"><dt>Department</dt><dd>' + escHtml(s.dept) + "</dd>" +
      "<dt>Clearance</dt><dd>Level " + s.clr + "</dd>" +
      "<dt>Assignment</dt><dd>" + (site ? escHtml(site.name + " — " + site.loc) : s.site ? "Site-" + s.site : "Unassigned") + "</dd>" +
      "<dt>Status</dt><dd>" + (s.active === "Y" ? "Active · last seen " + seenText(s) : "Inactive") + "</dd></dl>" +
      "<h4>Assigned entities</h4>" +
      (ents.length ? "<ul>" + ents.map(function (e) {
        return userClearance < (e.clr || 1)
          ? '<li><span class="nv-redact-dark">████████</span> [CL-' + e.clr + "]</li>"
          : '<li><button type="button" class="nv-cmd" data-cmd="cat ~/entities/' + termEntId(e.id).toLowerCase() + "/" + termEntId(e.id).toLowerCase() + '.nms">' + termEntId(e.id) + " — " + escHtml(e.name) + "</button></li>";
      }).join("") + "</ul>" : '<p class="nv-empty-inline">None on record.</p>') +
      "<h4>Reports</h4>" +
      (reps.length ? "<ul>" + reps.map(function (x) {
        var need = Math.max(x.e.clr || 1, x.r.clr || 1);
        return userClearance < need
          ? '<li><span class="nv-redact-dark">████████████</span> [CL-' + need + "]</li>"
          : '<li><button type="button" class="nv-cmd" data-cmd="cat ~/entities/' + termEntId(x.e.id).toLowerCase() + "/reports/" + termReportName(x.r, x.i) + '">' + escHtml(x.r.title) + "</button></li>";
      }).join("") + "</ul>" : '<p class="nv-empty-inline">None on record.</p>');
  }

  listEl.addEventListener("click", function (e) {
    var b = e.target.closest(".nv-person");
    if (b) showPerson(parseInt(b.dataset.id, 10));
  });
  detail.addEventListener("click", function (e) {
    var c = e.target.closest(".nv-cmd");
    if (c) nvRunCmd(c.dataset.cmd);
  });
  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  w.querySelector(".nv-refresh").addEventListener("click", function () {
    nvRollSeen();
    render();
    if (current) showPerson(current);
  });
  render();
  return w;
}
