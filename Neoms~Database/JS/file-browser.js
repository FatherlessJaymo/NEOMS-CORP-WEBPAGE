/* ============================================================
   NEOMS~DATABASE — FILE BROWSER
   A SCiPNET-style file browser over the terminal's file tree
   (JS/term-fs.js), shared by the Entity Registry and Personnel
   tabs: FILE PATH breadcrumb, toolbar, sortable list or grid,
   status bar and a hover preview card.

   fbMount(rootEl, ["entities"]) builds it inside rootEl. Each
   instance is scoped to its own root, so two can be open at once
   (e.g. in split view). Load after term-fs.js.
   ============================================================ */
"use strict";

var FB_ICON_FILE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2.5h8l4.5 4.5v14.5h-12.5z M14 2.5v4.5h4.5 M9 12h6 M9 15h6 M9 18h4" /></svg>';
var FB_ICON_LOCK =
  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 5.5v-1.5a2.5 2.5 0 0 1 5 0v1.5 M2.8 5.5h6.4v4.2h-6.4z" /></svg>';
var FB_ICON_DIR =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 5.5h7l2 2.5h10v11.5h-19z" /></svg>';
var FB_ICON_PERSON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>';

/* ── Shared helpers ── */
function fbHash(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function fbLocked(node) {
  if (node.type === "file") return userClearance < node.clr;
  var kids = Object.keys(node.children).map(function (k) { return node.children[k]; });
  return kids.length > 0 && kids.every(fbLocked);
}
function fbBytes(node) {
  if (node.type === "dir") return -1;
  return (node.text || JSON.stringify(node.ref) || "").length;
}
function fbSizeText(n) {
  if (n < 0) return "—";
  return n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB";
}
/* Stable fake timestamp per path, within ~30 days of the build */
function fbModified(path) {
  var d = new Date(2026, 3, 14, 21, 4);
  d.setMinutes(d.getMinutes() - (fbHash(path) % 43200));
  return d;
}
function fbDateText(d) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fbPerm(node, locked) {
  if (node.type === "dir") return locked ? "d---------" : "drwxr-xr-x";
  return locked ? "---" : "r--";
}

/* Open a file in the secured viewer (or deny it) */
function fbOpenFile(name, node) {
  if (userClearance < node.clr) {
    toast("CL-" + node.clr + " REQUIRED");
    if (typeof arcNotify === "function") arcNotify("ACCESS DENIED · CL-" + node.clr, "deny");
    return;
  }
  if (node.kind === "entity") return termViewer(termEntId(node.ref.id), nvEntityDoc(node.ref));
  if (node.kind === "report") return termViewer(termEntId(node.ref.e.id) + " · REPORT " + node.ref.n, nvReportDoc(node.ref.e, node.ref.r));
  if (node.kind === "personnel") return termViewer("S-" + node.ref.id, nvPersonDoc(node.ref));

  /* Text and site files */
  if (node.kind !== "text") return termViewer(node.ref.name, nvSiteDoc(node.ref));
  termViewer(name, '<article class="nv-doc">' + nvHead(node.clr) + '<div class="nv-body"><pre class="nv-pre">' + escHtml(node.text) + "</pre></div></article>");
}

/* ── Preview card content ── */
function fbPeekEntity(e) {
  var id = termEntId(e.id);
  if (userClearance < (e.clr || 1)) {
    return '<div class="fb-peek-img fb-peek-img--locked">' + FB_ICON_LOCK + "</div>" +
      '<div class="fb-peek-text"><b>' + id + '</b><span class="fb-peek-redact">██████████</span>' +
      '<em class="fb-peek-deny">CL-' + e.clr + " CLEARANCE REQUIRED</em></div>";
  }
  var cls = typeof CLS_LABELS !== "undefined" && CLS_LABELS[e.cls] ? CLS_LABELS[e.cls] : e.cls;
  var desc = (e.desc || "").length > 150 ? e.desc.slice(0, 150).replace(/\s+\S*$/, "") + "…" : e.desc || "";
  return (e.img ? '<img class="fb-peek-img" src="' + escHtml(e.img) + '" alt="" />' : '<div class="fb-peek-img"></div>') +
    '<div class="fb-peek-text"><b>' + id + "</b><strong>" + escHtml(e.name) + "</strong>" +
    "<dl><dt>Class</dt><dd>" + escHtml(cls) + '</dd><dt>Status</dt><dd class="st-' + escHtml(e.status) + '">' + escHtml(e.status) + "</dd>" +
    "<dt>Site</dt><dd>" + (e.site ? "Site-" + e.site : "—") + "</dd><dt>Clearance</dt><dd>CL-" + (e.clr || 1) + "</dd>" +
    "<dt>Reports</dt><dd>" + (e.reports || []).length + "</dd></dl></div>" +
    (desc ? '<p class="fb-peek-desc">' + escHtml(desc) + "</p>" : "");
}
function fbPeekPerson(p) {
  var active = p.active === "Y";
  return (p.img ? '<img class="fb-peek-img" src="' + escHtml(p.img) + '" alt="" referrerpolicy="no-referrer" />' : '<div class="fb-peek-img fb-peek-img--icon">' + FB_ICON_PERSON + "</div>") +
    '<div class="fb-peek-text"><b>S-' + p.id + "</b><strong>" + escHtml((p.fname + " " + p.lname).trim()) + "</strong>" +
    "<dl><dt>Position</dt><dd>" + escHtml(p.pos) + "</dd><dt>Dept</dt><dd>" + escHtml(p.dept) + "</dd>" +
    "<dt>Clearance</dt><dd>CL-" + p.clr + "</dd><dt>Site</dt><dd>" + (p.site ? "Site-" + p.site : "—") + "</dd>" +
    '<dt>Status</dt><dd class="' + (active ? "st-CONTAINED" : "st-BREACHED") + '">' + (active ? "ACTIVE" : "INACTIVE") + "</dd></dl></div>";
}

/* ── Mount ── */
function fbMount(root, startPath) {
  if (!root) return;
  root.innerHTML =
    '<div class="fb-label">File path</div>' +
    '<div class="fb-bar">' +
    '<nav class="fb-crumbs" aria-label="File path"></nav>' +
    '<div class="fb-tools">' +
    '<button type="button" class="fb-icon" data-act="sortdir" title="Reverse sort order" aria-label="Reverse sort order">&#8645;</button>' +
    '<button type="button" class="fb-icon" data-act="up" title="Up one folder" aria-label="Up one folder">&#8593;</button>' +
    '<button type="button" class="fb-icon" data-act="refresh" title="Refresh" aria-label="Refresh">&#10227;</button>' +
    '<button type="button" class="fb-btn" data-act="newfile" title="Create an entity in the Entity Creator">&#43; New file</button>' +
    '<button type="button" class="fb-btn" disabled title="The archive is read-only">New folder</button>' +
    '<button type="button" class="fb-btn" disabled title="The archive is read-only">Rename</button>' +
    '<button type="button" class="fb-btn" disabled title="The archive is read-only">Delete</button>' +
    '<button type="button" class="fb-icon" data-act="view" title="Grid view" aria-label="Switch to grid view" aria-pressed="false">&#9638;</button>' +
    "</div></div>" +
    '<div class="fb-panel"><table class="fb-table"><thead><tr>' +
    '<th><button type="button" data-sort="name">Name</button></th>' +
    '<th class="fb-col-size"><button type="button" data-sort="size">Size</button></th>' +
    '<th class="fb-col-mod"><button type="button" data-sort="mod">Modified</button></th>' +
    '<th class="fb-col-perm"><span>Permissions</span></th>' +
    '</tr></thead><tbody class="fb-body"></tbody></table><div class="fb-grid" hidden></div></div>' +
    '<footer class="fb-status"><span class="fb-count"></span><span class="fb-sel" aria-live="polite"></span></footer>' +
    '<div class="fb-peek" role="tooltip" hidden></div>';

  var $ = function (sel) { return root.querySelector(sel); };
  var body = $(".fb-body"), grid = $(".fb-grid"), table = $(".fb-table"), crumbs = $(".fb-crumbs");
  var countEl = $(".fb-count"), selEl = $(".fb-sel"), peek = $(".fb-peek");
  var viewBtn = $('[data-act="view"]'), upBtn = $('[data-act="up"]');

  var path = (startPath || []).slice();
  var sort = { key: "name", dir: 1 };
  var selected = null;
  var gridView = false;

  function entries() {
    var dir = termFsGet(path);
    if (!dir || dir.type !== "dir") return [];
    return Object.keys(dir.children).map(function (name) {
      var node = dir.children[name];
      return { name: name, node: node, locked: fbLocked(node), size: fbBytes(node), mod: fbModified(path.concat(name).join("/")) };
    }).sort(function (a, b) {
      /* Folders first, then the chosen column */
      if ((a.node.type === "dir") !== (b.node.type === "dir")) return a.node.type === "dir" ? -1 : 1;
      var v = sort.key === "name" ? a.name.localeCompare(b.name, undefined, { numeric: true }) : a[sort.key] - b[sort.key];
      return v * sort.dir;
    });
  }

  function status(items) {
    var s = (items || entries()).filter(function (x) { return x.name === selected; })[0];
    selEl.textContent = s
      ? s.name + " · " + (s.node.type === "dir" ? "Folder · " + Object.keys(s.node.children).length + " items" : "File · " + fbSizeText(s.size)) +
        " · " + fbPerm(s.node, s.locked) + " · neoms · " + fbDateText(s.mod) + (s.locked ? " · CL-" + s.node.clr + " REQUIRED" : "")
      : "";
  }

  function render() {
    var items = entries();
    if (selected && !items.some(function (x) { return x.name === selected; })) selected = null;

    crumbs.innerHTML =
      '<button type="button" class="fb-crumb fb-crumb--root" data-depth="0">&#8962; root</button>' +
      path.map(function (seg, i) {
        return '<span class="fb-sep">/</span><button type="button" class="fb-crumb" data-depth="' + (i + 1) + '">' + escHtml(seg) + "</button>";
      }).join("");

    table.querySelectorAll("th button").forEach(function (b) {
      var on = b.dataset.sort === sort.key;
      b.dataset.arrow = on ? (sort.dir > 0 ? "↑" : "↓") : "";
      b.closest("th").setAttribute("aria-sort", on ? (sort.dir > 0 ? "ascending" : "descending") : "none");
    });

    var icon = function (x) {
      return '<span class="fb-ico">' + (x.node.type === "dir" ? FB_ICON_DIR : FB_ICON_FILE) +
        (x.locked ? '<span class="fb-lock" title="Clearance required">' + FB_ICON_LOCK + "</span>" : "") + "</span>";
    };

    body.innerHTML = items.map(function (x) {
      return '<tr tabindex="0" data-name="' + escHtml(x.name) + '" class="' + (x.name === selected ? "sel" : "") + (x.locked ? " locked" : "") +
        '" aria-selected="' + (x.name === selected) + '">' +
        '<td class="fb-name">' + icon(x) + escHtml(x.name) + "</td>" +
        '<td class="fb-col-size">' + fbSizeText(x.size) + "</td>" +
        '<td class="fb-col-mod">' + fbDateText(x.mod) + "</td>" +
        '<td class="fb-col-perm">' + fbPerm(x.node, x.locked) + "</td></tr>";
    }).join("") || '<tr><td colspan="4" class="fb-empty">This folder is empty.</td></tr>';

    grid.innerHTML = items.map(function (x) {
      return '<button type="button" class="fb-tile' + (x.name === selected ? " sel" : "") + (x.locked ? " locked" : "") +
        '" data-name="' + escHtml(x.name) + '">' + icon(x) + '<span class="fb-tile-name">' + escHtml(x.name) + "</span></button>";
    }).join("") || '<p class="fb-empty">This folder is empty.</p>';

    table.hidden = gridView;
    grid.hidden = !gridView;
    upBtn.disabled = path.length === 0;
    countEl.textContent = items.length + " item" + (items.length === 1 ? "" : "s");
    status(items);
  }

  function go(newPath) {
    path = newPath;
    selected = null;
    peekHide();
    render();
  }

  function open(name) {
    var node = termFsGet(path.concat(name));
    if (!node) return;
    if (node.type === "dir") return go(path.concat(name));
    selected = name;
    render();
    fbOpenFile(name, node);
  }

  function select(name, focus) {
    selected = name;
    render();
    if (focus) {
      var el = (gridView ? grid : body).querySelector('[data-name="' + CSS.escape(name) + '"]');
      if (el) el.focus();
    }
  }

  /* ── Hover / focus preview card ── */
  var peekTimer = null;
  var peekFor = null;

  function peekContent(name) {
    var node = termFsGet(path.concat(name));
    if (!node) return null;
    if (node.type === "file") {
      if (node.kind === "entity") return fbPeekEntity(node.ref);
      if (node.kind === "personnel") return fbPeekPerson(node.ref);
      return null;
    }
    /* An entity folder previews its entity */
    var f = Object.keys(node.children).map(function (k) { return node.children[k]; }).filter(function (c) { return c.kind === "entity"; })[0];
    return f ? fbPeekEntity(f.ref) : null;
  }

  function peekShow(row) {
    var html = peekContent(row.dataset.name);
    if (!html) return peekHide();
    clearTimeout(peekTimer);
    peekTimer = setTimeout(function () {
      if (peekFor !== row.dataset.name || peek.hidden) peek.innerHTML = html;
      peekFor = row.dataset.name;
      peek.hidden = false;
      /* Beside the row's name, kept inside the window */
      var r = (row.querySelector(".fb-name, .fb-tile-name") || row).getBoundingClientRect();
      var w = peek.offsetWidth, h = peek.offsetHeight;
      var left = r.left + Math.min(r.width, 260) + 16;
      var top = r.top - 10;
      if (left + w > window.innerWidth - 10) left = Math.max(10, r.left - w - 16);
      if (top + h > window.innerHeight - 10) top = window.innerHeight - h - 10;
      peek.style.left = left + "px";
      peek.style.top = Math.max(10, top) + "px";
    }, 180);
  }
  function peekHide() {
    clearTimeout(peekTimer);
    peek.hidden = true;
    peekFor = null;
  }

  /* ── Events ── */
  crumbs.addEventListener("click", function (e) {
    var c = e.target.closest(".fb-crumb");
    if (c) go(path.slice(0, parseInt(c.dataset.depth, 10)));
  });

  [body, grid].forEach(function (host) {
    /* One click opens: folders navigate, files open in the viewer */
    host.addEventListener("click", function (e) {
      var row = e.target.closest("[data-name]");
      if (!row) return;
      peekHide();
      open(row.dataset.name);
    });
    ["mouseover", "focusin"].forEach(function (ev) {
      host.addEventListener(ev, function (e) {
        var row = e.target.closest("[data-name]");
        if (!row) return;
        peekShow(row);
        if (row.dataset.name !== selected) {
          selected = row.dataset.name;
          status();
        }
      });
    });
    host.addEventListener("mouseleave", peekHide);
    host.addEventListener("focusout", peekHide);
    /* Keyboard: arrows move, Enter opens, Backspace goes up */
    host.addEventListener("keydown", function (e) {
      var row = e.target.closest("[data-name]");
      if (!row) return;
      var names = entries().map(function (x) { return x.name; });
      var i = names.indexOf(row.dataset.name);
      if (e.key === "Enter") {
        e.preventDefault();
        open(row.dataset.name);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        if (i < names.length - 1) select(names[i + 1], true);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (i > 0) select(names[i - 1], true);
      } else if (e.key === "Backspace" && path.length) {
        e.preventDefault();
        go(path.slice(0, -1));
      } else if (e.key === "Escape") {
        peekHide();
      }
    });
  });

  $(".fb-panel").addEventListener("scroll", peekHide);

  table.querySelector("thead").addEventListener("click", function (e) {
    var b = e.target.closest("[data-sort]");
    if (!b) return;
    sort = { key: b.dataset.sort, dir: sort.key === b.dataset.sort ? -sort.dir : 1 };
    render();
  });

  $(".fb-tools").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act;
    if (act === "sortdir") {
      sort.dir = -sort.dir;
      render();
    } else if (act === "up") {
      if (path.length) go(path.slice(0, -1));
    } else if (act === "refresh") {
      TERM_FS = null; /* rebuild the tree from the data */
      render();
    } else if (act === "newfile") {
      openWin("entitycreator");
    } else if (act === "view") {
      gridView = !gridView;
      b.setAttribute("aria-pressed", String(gridView));
      b.innerHTML = gridView ? "&#9776;" : "&#9638;";
      b.title = gridView ? "List view" : "Grid view";
      b.setAttribute("aria-label", gridView ? "Switch to list view" : "Switch to grid view");
      render();
    }
  });

  render();
}
