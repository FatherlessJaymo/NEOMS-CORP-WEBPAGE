/* ============================================================
   NEOMS~DATABASE — TERMINAL FILE SYSTEM + SECURED VIEWER
   A read-only file tree built from the data files, for the
   terminal's ls / cd / pwd / cat (as on SCiPNET), and the white
   "secured viewer" document windows that `cat` opens.
   Load after db-common.js.
   ============================================================ */
"use strict";

var termCwd = []; /* path segments below ~ */
var TERM_FS = null;

var TERM_README = [
  "NeoMS Direct Access Terminal — file index",
  "",
  "  entities/    one folder per entity: its file (.nms) and reports/",
  "  personnel/   personnel files",
  "  sites/       containment site files",
  "",
  "Try:  cd entities/e-0138   ls -l   cat e-0138.nms"
].join("\n");

/* ── Tree ── nodes: { type:"dir", children:{} } | { type:"file", kind, ref, clr, text } */
function termFsDir(children) {
  return { type: "dir", children: children || {} };
}
function termFsFile(kind, ref, clr, text) {
  return { type: "file", kind: kind, ref: ref, clr: clr || 1, text: text };
}
function termReportName(r, i) {
  return String(i + 1).padStart(2, "0") + "-" + (r.type || "report").toLowerCase() + ".nms";
}

function termFs() {
  if (TERM_FS) return TERM_FS;
  var ents = {}, staff = {}, sites = {};
  (typeof ENTITIES !== "undefined" ? ENTITIES : []).forEach(function (e) {
    var id = termEntId(e.id).toLowerCase();
    var r = {};
    (e.reports || []).forEach(function (rp, i) {
      r[termReportName(rp, i)] = termFsFile("report", { e: e, r: rp, n: i + 1 }, Math.max(e.clr || 1, rp.clr || 1));
    });
    /* Each entity is a folder: its file plus its reports/ */
    var folder = {};
    folder[id + ".nms"] = termFsFile("entity", e, e.clr);
    if (Object.keys(r).length) folder.reports = termFsDir(r);
    ents[id] = termFsDir(folder);
  });
  (typeof personnel !== "undefined" ? personnel : []).forEach(function (s) {
    staff["s-" + s.id + ".nms"] = termFsFile("personnel", s, 1);
  });
  (typeof SITES !== "undefined" ? SITES : []).forEach(function (s) {
    sites[s.name.toLowerCase() + ".nms"] = termFsFile("site", s, 1);
  });
  TERM_FS = termFsDir({
    "readme.txt": termFsFile("text", null, 1, TERM_README),
    entities: termFsDir(ents),
    personnel: termFsDir(staff),
    sites: termFsDir(sites)
  });
  return TERM_FS;
}

/* "~/a/b", "/a", "../x", "x" → segments below ~ */
function termFsParts(path) {
  path = String(path || "");
  var parts = /^[~\/]/.test(path) ? [] : termCwd.slice();
  path.replace(/^~\/?|^\//, "").split("/").forEach(function (seg) {
    if (!seg || seg === ".") return;
    if (seg === "..") parts.pop();
    else parts.push(seg.toLowerCase());
  });
  return parts;
}
function termFsGet(parts) {
  var node = termFs();
  for (var i = 0; i < parts.length; i++) {
    if (node.type !== "dir" || !node.children[parts[i]]) return null;
    node = node.children[parts[i]];
  }
  return node;
}
function termFsPath(parts) {
  return "~" + (parts.length ? "/" + parts.join("/") : "");
}

/* Tab completion for a path argument → list of completed tokens */
function termFsComplete(partial) {
  var slash = partial.lastIndexOf("/");
  var dirPart = slash === -1 ? "" : partial.slice(0, slash + 1);
  var stem = partial.slice(slash + 1).toLowerCase();
  var node = termFsGet(termFsParts(dirPart || "."));
  if (!node || node.type !== "dir") return [];
  return Object.keys(node.children)
    .filter(function (n) { return n.indexOf(stem) === 0; })
    .map(function (n) { return dirPart + n + (node.children[n].type === "dir" ? "/" : ""); });
}

/* ── ls / cd / pwd ── */
function termLs(args) {
  var long = false, paths = [];
  args.forEach(function (a) {
    if (/^-[a-z]+$/i.test(a)) long = long || a.indexOf("l") !== -1;
    else paths.push(a);
  });
  if (!paths.length) paths.push(".");
  paths.forEach(function (p) {
    var node = termFsGet(termFsParts(p));
    if (!node) return termPrint("ls: cannot access '" + p + "': No such file or directory", "red");
    var names = node.type === "dir" ? Object.keys(node.children).sort() : [p.split("/").pop()];
    var kids = node.type === "dir" ? node.children : { [names[0]]: node };
    if (paths.length > 1 && node.type === "dir") termPrint(p + ":", "dim");
    if (!long) {
      termHTML(names.map(function (n) {
        return kids[n].type === "dir" ? termC(n + "/", "blue") : escHtml(n);
      }).join("  ") || termC("(empty)", "dim"));
      return;
    }
    names.forEach(function (n) {
      var k = kids[n];
      var locked = k.type === "file" && userClearance < k.clr;
      var perm = k.type === "dir" ? "drwxr-xr-x" : locked ? "----------" : "-r--r-----";
      var size = k.type === "dir" ? Object.keys(k.children).length + " items" : "CL-" + k.clr;
      termHTML(
        termC(perm, "dim") + "  neoms  " + termC(size.padEnd(9), locked ? "red" : "dim") + "  " +
        (k.type === "dir" ? termC(n + "/", "blue") : locked ? termC(n, "red") : escHtml(n))
      );
    });
  });
}

function termCd(arg) {
  var parts = arg ? termFsParts(arg) : [];
  var node = termFsGet(parts);
  if (!node) return termPrint("cd: " + arg + ": No such file or directory", "red");
  if (node.type !== "dir") return termPrint("cd: " + arg + ": Not a directory", "red");
  termCwd = parts;
  var pr = document.getElementById("term-prompt");
  if (pr) pr.innerHTML = termPromptHTML();
}

/* ── cat ── text prints; entity/report files open the secured viewer */
function termCat(args) {
  if (!args.length) return termPrint("Usage: cat <file>   e.g. cat ~/entities/e-0138/e-0138.nms", "yellow");
  var p = args[0];
  var node = termFsGet(termFsParts(p));
  if (!node) return termPrint("cat: " + p + ": No such file or directory", "red");
  if (node.type === "dir") return termPrint("cat: " + p + ": Is a directory", "red");
  if (node.kind === "text") return node.text.split("\n").forEach(function (l) { termPrint(l); });

  var label =
    node.kind === "entity" ? termEntId(node.ref.id) :
    node.kind === "report" ? termEntId(node.ref.e.id) + " report #" + node.ref.n :
    node.kind === "personnel" ? "S-" + node.ref.id : node.ref.name;
  termSeq([termInfo("Fetching complete information for " + label + "..."), termInfo("Successfully fetched " + label)], function () {
    if (userClearance < node.clr) return termDenied(node.clr);
    if (node.kind === "entity") {
      termViewer(termEntId(node.ref.id), nvEntityDoc(node.ref));
      termPrint("Displaying '" + termEntId(node.ref.id) + "' in secured viewer.");
    } else if (node.kind === "report") {
      termViewer(termEntId(node.ref.e.id) + " · REPORT " + node.ref.n, nvReportDoc(node.ref.e, node.ref.r));
      termPrint("Displaying '" + node.ref.r.title + "' in secured viewer.");
    } else if (node.kind === "personnel") {
      var s = node.ref;
      termReport("PERSONNEL FILE — S-" + s.id, [
        ["Name", (s.fname + " " + s.lname).trim()], ["Position", s.pos], ["Department", s.dept],
        ["Clearance", "CL-" + s.clr], ["Site", s.site ? "Site-" + s.site : "UNASSIGNED"],
        ["Status", s.active === "Y" ? "ACTIVE" : "INACTIVE"]
      ]);
    } else {
      var st = node.ref;
      termReport(st.name.toUpperCase(), [
        ["Location", st.loc], ["Established", st.est || "UNKNOWN"], ["Status", st.status],
        ["Entities", String(st.entities)], ["Personnel", String(st.personnel)], ["Notes", st.desc || "—"]
      ]);
    }
  });
}

/* ── SECURED VIEWER WINDOWS ──────────────────────────────────── */
var nvZ = 1200;

/* opts.cls: extra window class; opts.app: single-instance id —
   opening it again brings the existing window to the front */
function termViewer(tag, html, opts) {
  opts = opts || {};
  if (opts.app) {
    var existing = document.querySelector('.nv-win[data-app="' + opts.app + '"]');
    if (existing) {
      nvRestore(existing);
      return existing;
    }
  }
  var open = document.querySelectorAll(".nv-win").length;
  var w = document.createElement("div");
  w.className = "nv-win" + (opts.cls ? " " + opts.cls : "");
  if (opts.app) w.dataset.app = opts.app;
  w.setAttribute("role", "dialog");
  w.setAttribute("aria-label", tag + " — secured viewer");
  w.style.zIndex = ++nvZ;
  if (typeof arcNotify === "function") arcNotify((opts.app ? "OPENED: " : "DISPLAYING FILE: ") + tag, "file");
  w.style.left = 60 + (open % 6) * 28 + "px";
  w.style.top = 60 + (open % 6) * 28 + "px";
  w.innerHTML =
    '<div class="nv-titlebar"><span class="nv-tag">' + escHtml(tag) + "</span>" +
    '<span class="nv-btns">' +
    (opts.app ? "" : '<button type="button" data-nv="theme" class="nv-theme-btn"></button>') +
    '<button type="button" data-nv="min" aria-label="Minimise">&#8211;</button>' +
    '<button type="button" data-nv="max" aria-label="Maximise">&#9633;</button>' +
    '<button type="button" data-nv="close" aria-label="Close">&#10005;</button>' +
    '</span></div><div class="nv-scroll">' + html + "</div>";
  document.body.appendChild(w);

  w.addEventListener("pointerdown", function () {
    w.style.zIndex = ++nvZ;
  });
  w.querySelector(".nv-btns").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.nv === "close") w.remove();
    else if (b.dataset.nv === "max") w.classList.toggle("nv-max");
    else if (b.dataset.nv === "theme") nvSetDocTheme(!document.body.classList.contains("nv-dark-docs"));
    else nvMinimise(w);
  });
  nvSyncThemeButtons();

  /* Drag by the title bar */
  var bar = w.querySelector(".nv-titlebar");
  bar.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button") || w.classList.contains("nv-max")) return;
    var dx = e.clientX - w.offsetLeft, dy = e.clientY - w.offsetTop;
    bar.setPointerCapture(e.pointerId);
    function move(ev) {
      w.style.left = Math.max(-w.offsetWidth + 120, Math.min(window.innerWidth - 120, ev.clientX - dx)) + "px";
      w.style.top = Math.max(0, Math.min(window.innerHeight - 40, ev.clientY - dy)) + "px";
    }
    function up() {
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", up);
    }
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });
  return w;
}

/* ── Document theme: white paper (default) or dark ──────────────
   One setting for every viewer document, remembered per browser. */
var NV_THEME_KEY = "neoms_doc_theme";

function nvSyncThemeButtons() {
  var dark = document.body.classList.contains("nv-dark-docs");
  document.querySelectorAll(".nv-theme-btn").forEach(function (b) {
    b.innerHTML = "&#9680;";
    b.title = dark ? "Switch documents to white paper" : "Switch documents to dark";
    b.setAttribute("aria-label", b.title);
    b.setAttribute("aria-pressed", String(dark));
  });
}

function nvSetDocTheme(dark) {
  document.body.classList.toggle("nv-dark-docs", dark);
  try {
    localStorage.setItem(NV_THEME_KEY, dark ? "dark" : "light");
  } catch (e) {}
  nvSyncThemeButtons();
}

(function () {
  var pref = null;
  try {
    pref = localStorage.getItem(NV_THEME_KEY);
  } catch (e) {}
  if (pref === "dark") document.body.classList.add("nv-dark-docs");
})();

/* Site file: facility facts, the entities held there, assigned
   personnel and every report filed on its entities */
function nvSiteDoc(site) {
  var ents = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (e) { return e.site === site.id; });
  var staff = (typeof personnel !== "undefined" ? personnel : []).filter(function (p) { return p.site === site.id; });
  var list = function (items) {
    return items.length ? '<ul class="nv-addenda">' + items.join("") + "</ul>" : "<p><i>None on record.</i></p>";
  };
  var entItems = ents.map(function (e) {
    return userClearance < (e.clr || 1)
      ? '<li><span class="nv-redact">██████████████</span> <em>[CL-' + e.clr + "]</em></li>"
      : '<li><button type="button" class="nv-report-link nv-ent-link" data-ent="' + e.id + '">' +
        escHtml(termEntId(e.id) + " — " + e.name) + "</button> <em>(" + escHtml(e.status) + ")</em></li>";
  });
  var staffItems = staff.map(function (p) {
    return "<li>" + escHtml(termStaff(p.id) + " — " + p.pos) + "</li>";
  });
  var repItems = [];
  ents.forEach(function (e) {
    (e.reports || []).forEach(function (r, i) {
      var need = Math.max(e.clr || 1, r.clr || 1);
      repItems.push(userClearance < need
        ? '<li><span class="nv-redact">██████████████</span> <em>[CL-' + need + "]</em></li>"
        : '<li><button type="button" class="nv-report-link" data-ent="' + e.id + '" data-rep="' + i + '">' +
          escHtml(termEntId(e.id) + " · " + r.type + " — " + r.title) + "</button></li>");
    });
  });
  return (
    '<article class="nv-doc">' + nvHead(1) + '<div class="nv-body">' +
    nvField("Facility", site.name) + nvField("Location", site.loc) +
    nvField("Coordinates", site.lat.toFixed(2) + ", " + site.lng.toFixed(2)) +
    nvField("Established", site.est) + nvField("Status", site.status) +
    nvField("Personnel Strength", String(site.personnel)) + nvField("Notes", site.desc) +
    "<p><b>Entities Held:</b></p>" + list(entItems) +
    "<p><b>Assigned Personnel on File:</b></p>" + list(staffItems) +
    "<p><b>Incident Reports:</b></p>" + list(repItems) +
    "</div></article>"
  );
}

/* Entity links inside a document open that entity's file */
document.addEventListener("click", function (ev) {
  var b = ev.target.closest && ev.target.closest(".nv-ent-link");
  if (!b) return;
  ev.stopImmediatePropagation();
  var e = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (x) {
    return x.id === parseInt(b.dataset.ent, 10);
  })[0];
  if (!e) return;
  if (userClearance < (e.clr || 1)) return termDenied(e.clr);
  termViewer(termEntId(e.id), nvEntityDoc(e));
}, true);

/* Addenda links inside an entity document open that report */
document.addEventListener("click", function (ev) {
  var b = ev.target.closest && ev.target.closest(".nv-report-link");
  if (!b) return;
  var e = (typeof ENTITIES !== "undefined" ? ENTITIES : []).filter(function (x) {
    return x.id === parseInt(b.dataset.ent, 10);
  })[0];
  var i = parseInt(b.dataset.rep, 10);
  var r = e && e.reports && e.reports[i];
  if (!r) return;
  if (userClearance < Math.max(e.clr || 1, r.clr || 1)) return termDenied(Math.max(e.clr || 1, r.clr || 1));
  termViewer(termEntId(e.id) + " · REPORT " + (i + 1), nvReportDoc(e, r));
});

/* ── Minimise dock ───────────────────────────────────────────────
   Minimised windows hide and leave a tab in a dock along the
   bottom-left edge: label · □ restore · × close (as SCiPNET). */
function nvDock() {
  var dock = document.getElementById("nv-dock");
  if (!dock) {
    dock = document.createElement("div");
    dock.id = "nv-dock";
    dock.className = "nv-dock";
    dock.setAttribute("role", "toolbar");
    dock.setAttribute("aria-label", "Minimised windows");
    document.body.appendChild(dock);
  }
  return dock;
}

function nvMinimise(w) {
  if (w.hidden) return;
  var tag = w.querySelector(".nv-tag").textContent;
  var chip = document.createElement("div");
  chip.className = "nv-chip";
  chip.innerHTML =
    '<button type="button" class="nv-chip-tag" data-nv="restore" title="Restore ' + escHtml(tag) + '"><span class="nv-tag">' + escHtml(tag) + "</span></button>" +
    '<button type="button" data-nv="restore" aria-label="Restore ' + escHtml(tag) + '">&#9633;</button>' +
    '<button type="button" data-nv="close" aria-label="Close ' + escHtml(tag) + '">&#10005;</button>';
  chip.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.nv === "close") {
      chip.remove();
      w.remove();
    } else {
      nvRestore(w);
    }
  });
  w.nvChip = chip;
  w.hidden = true;
  nvDock().appendChild(chip);
}

function nvRestore(w) {
  if (w.nvChip) {
    w.nvChip.remove();
    w.nvChip = null;
  }
  w.hidden = false;
  w.style.zIndex = ++nvZ;
}

/* ── Document builders (white paper, typewriter body) ── */
var NV_CLR_BAR = {
  1: "FOR OFFICIAL USE ONLY — LEVEL 1",
  2: "RESTRICTED — LEVEL 2 CLEARANCE REQUIRED",
  3: "CONFIDENTIAL — LEVEL 3 CLEARANCE REQUIRED",
  4: "SECRET — LEVEL 4 CLEARANCE REQUIRED",
  5: "TOP SECRET — LEVEL 5 CLEARANCE REQUIRED"
};

function nvHead(clr) {
  return (
    '<header class="nv-head"><svg class="nv-logo" aria-hidden="true"><use href="#emblem" /></svg>' +
    "<div><small>OBSERVE. INNOVATE. ADAPT.</small><h1>NEOMS CORP</h1></div></header>" +
    '<div class="nv-bar">' + NV_CLR_BAR[clr || 1] + "</div>"
  );
}
function nvField(label, text) {
  return text ? "<p><b>" + escHtml(label) + ":</b> " + escHtml(text) + "</p>" : "";
}
function nvRedacted(label, clr) {
  return "<p><b>" + escHtml(label) + ":</b> " + '<span class="nv-redact">████████████████████</span> <em>[CL-' + clr + " CLEARANCE REQUIRED]</em></p>";
}

/* Photo caption: an entity's own imgCaption, else one that matches
   its status (only CONTAINED entities are "in containment") */
function nvImgCaption(e, id) {
  if (e.imgCaption) return e.imgCaption;
  if (e.status === "CONTAINED") return "A photograph of " + id + " in containment.";
  if (e.status === "BREACHED") return "A photograph of " + id + " recorded during an active breach.";
  return "A photograph of " + id + " under observation.";
}

function nvEntityDoc(e) {
  var id = termEntId(e.id);
  var cls = typeof CLS_LABELS !== "undefined" && CLS_LABELS[e.cls] ? CLS_LABELS[e.cls] + " (" + e.cls + ")" : e.cls;
  var protos = (e.protocols || []).map(function (p) {
    var label = p.type === "CONTAINMENT" ? "Special Containment Procedures" : p.type.charAt(0) + p.type.slice(1).toLowerCase() + " Protocol";
    return userClearance < (p.clr || 1) ? nvRedacted(label, p.clr) : nvField(label, p.desc);
  }).join("");
  var addenda = (e.reports || []).map(function (r, i) {
    var path = "~/entities/" + id.toLowerCase() + "/reports/" + termReportName(r, i);
    return userClearance < Math.max(e.clr || 1, r.clr || 1)
      ? '<li><span class="nv-redact">██████████████</span> <em>[CL-' + r.clr + "]</em></li>"
      : '<li><button type="button" class="nv-report-link" data-ent="' + e.id + '" data-rep="' + i + '">' +
        escHtml(r.type + " — " + r.title) + "</button> <code>cat " + escHtml(path) + "</code></li>";
  }).join("");
  return (
    '<article class="nv-doc">' + nvHead(e.clr) + '<div class="nv-body">' +
    (e.img
      ? '<figure class="nv-fig"><img src="' + escHtml(e.img) + '" alt="' + escHtml(id + " — " + e.name) + '" />' +
        "<figcaption>" + escHtml(nvImgCaption(e, id)) + "</figcaption></figure>"
      : "") +
    nvField("Item #", id) + nvField("Designation", e.name) + nvField("Also Known As", e.alias) +
    nvField("Object Class", cls) + nvField("Power Scale", e.ps) + nvField("Status", e.status) +
    nvField("Containment Type", e.containment) +
    nvField(e.adminSite ? "Primary Administrative Site" : "Assigned Site", e.adminSite || (e.site ? "Site-" + e.site : "")) +
    nvField("Threat Vectors", (e.vectors || []).join(", ")) + nvField("Interaction Safety", e.safety) +
    protos + nvField("Description", e.desc) + nvField("Anomalous Properties", e.aprop) +
    nvField("Physical Description", e.phys) + nvField("Dimensions", e.dims) +
    (addenda ? '<p><b>Addenda:</b></p><ul class="nv-addenda">' + addenda + "</ul>" : "") +
    "</div></article>"
  );
}

function nvReportDoc(e, r) {
  var withIds = [r.author].concat(r.contributors || []).filter(function (sid, i, all) {
    return sid && sid !== TERM_FILER && all.indexOf(sid) === i;
  });
  var log = (r.log || []).map(function (l) {
    if (typeof l === "string") return "<p>" + escHtml(l) + "</p>";
    if (l.note) return '<p class="nv-note">' + escHtml(l.note) + "</p>";
    return "<p>" + (l.t ? '<span class="nv-t">[' + escHtml(l.t) + "]</span> " : "") + (l.who ? "<b>" + escHtml(l.who) + ":</b> " : "") + escHtml(l.text || "") + "</p>";
  }).join("");
  return (
    '<article class="nv-doc">' + nvHead(r.clr) + '<div class="nv-body">' +
    nvField("Report #", r.file ? r.file.replace(/\.pdf$/i, "") : "") +
    nvField("Report Type", r.type) + nvField("Subject", termEntId(e.id) + " — " + e.name) +
    nvField("Title", r.title) + nvField("Date", r.date) + nvField("Location", r.location) +
    nvField("Personnel", r.personnel) + nvField("Filed By", termStaff(TERM_FILER)) +
    nvField("With", withIds.map(termStaff).join(", ")) +
    nvField("Summary", r.summary) + nvField("Foreword", r.foreword) +
    (log ? '<div class="nv-log"><p class="nv-mark">&lt;Begin Log&gt;</p>' + log + '<p class="nv-mark">&lt;End Log&gt;</p></div>' : "") +
    nvField("Closing Statement", r.notes) +
    "</div></article>"
  );
}
