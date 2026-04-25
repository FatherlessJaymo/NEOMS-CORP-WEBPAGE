/* ============================================================
   WINDOW MANAGER
   Handles: opening/closing/minimizing/maximizing windows,
   dragging, resizing, taskbar buttons, content HTML builders.

   NeoMix icons: the desktop icon, the window titlebar, and the
   taskbar button all use play.png from the uploaded Neomix icon
   set so NeoMix reads as a "music app" across all three surfaces.
============================================================ */
var zTop = 200;
var wins = {};
var tbBtns = {};

/* Shared image paths — match Neoms~PrimeDrive/JS/desktop-icons.js */
var FOLDER_IMG = "/Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var NEOMIX_IMG = "/Neoms~Universal-Fonts+Images/Icons/Neomix/Neomix-Sonic.jpg";

var WIN_DEFS = {
  prime: { title: "CREATOR'S LOG", w: 520, h: 500, icon: "prime", iconImg: FOLDER_IMG },
  neomix: { title: "NEOMIX PLAYER", w: 480, h: 420, icon: "neomix", iconImg: NEOMIX_IMG },
  core: { title: "CORE DIRECTIVE", w: 440, h: 400, icon: "core", iconImg: FOLDER_IMG },
  guestbook: { title: "GUEST BOOK", w: 500, h: 480, icon: "guestbook", iconImg: FOLDER_IMG },
  sticker: { title: "STICKER.HQ", w: 480, h: 360, icon: "sticker", iconImg: FOLDER_IMG },
  badges: { title: "NEOMS BADGES", w: 500, h: 420, icon: "badges", iconImg: FOLDER_IMG },
  ranking: { title: "RANKING VIEWER", w: 560, h: 500, icon: "ranking", iconImg: FOLDER_IMG },
  etc: { title: "ETC / OTHER SITES", w: 440, h: 360, icon: "etc", iconImg: FOLDER_IMG },
  wallpaper: { title: "WALLPAPER SETTINGS", w: 360, h: 280, icon: "wallpaper", iconImg: FOLDER_IMG }
};

/* ---- SVG icon library (fallback only — used if iconImg fails to load) ---- */
function iconSVG(id) {
  var icons = {
    prime:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#1a3a7a"/><rect x="8" y="14" width="36" height="28" rx="3" fill="#0a1f4a" stroke="#a8c8e8" stroke-width="1.5"/><rect x="16" y="8" width="20" height="10" rx="3" fill="#a8c8e8"/><line x1="14" y1="25" x2="38" y2="25" stroke="#9ac8f6" stroke-width="1.5"/><line x1="14" y1="30" x2="32" y2="30" stroke="#354a5f" stroke-width="1.5"/><line x1="14" y1="35" x2="28" y2="35" stroke="#354a5f" stroke-width="1"/></svg>',
    neomix:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#0a1a3a"/><circle cx="26" cy="26" r="18" fill="none" stroke="#00eaff" stroke-width="2"/><circle cx="26" cy="26" r="10" fill="#001a3a" stroke="#00eaff" stroke-width="1.5"/><circle cx="26" cy="26" r="4" fill="#00eaff" opacity=".6"/><circle cx="26" cy="26" r="2" fill="#00eaff"/></svg>',
    core: '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#0a0014"/><rect x="8" y="12" width="36" height="28" rx="3" fill="#000" stroke="#f25a78" stroke-width="2"/><text x="26" y="32" font-size="14" fill="#f25a78" text-anchor="middle" font-family="monospace">&gt;_</text></svg>',
    guestbook:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#0a1f4a"/><rect x="8" y="10" width="36" height="32" rx="3" fill="#061530" stroke="#a8c8e8" stroke-width="1.5"/><line x1="14" y1="20" x2="38" y2="20" stroke="#006dff" stroke-width="2"/><line x1="14" y1="27" x2="38" y2="27" stroke="#354a5f" stroke-width="1.5"/></svg>',
    sticker:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#1a2a0a"/><text x="26" y="36" font-size="28" text-anchor="middle">★</text></svg>',
    badges:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#1a1a3a"/><rect x="16" y="6" width="20" height="30" rx="4" fill="#0a1f4a" stroke="#a8c8e8" stroke-width="1.5"/><circle cx="26" cy="18" r="6" fill="#ffaa00" opacity=".9"/></svg>',
    ranking:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#1a0a0a"/><rect x="6" y="30" width="10" height="16" rx="2" fill="#ff6b35"/><rect x="21" y="18" width="10" height="28" rx="2" fill="#c792ea"/><rect x="36" y="24" width="10" height="22" rx="2" fill="#a8c8e8"/></svg>',
    etc: '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#0a1f4a"/><circle cx="16" cy="26" r="5" fill="#354a5f"/><circle cx="26" cy="26" r="5" fill="#354a5f"/><circle cx="36" cy="26" r="5" fill="#354a5f"/></svg>',
    wallpaper:
      '<svg class="icon-svg" viewBox="0 0 52 52"><rect width="52" height="52" rx="10" fill="#0a1f4a"/><rect x="6" y="6" width="40" height="40" rx="5" fill="#061530"/><circle cx="16" cy="16" r="5" fill="#ffaa00" opacity=".7"/><path d="M6 34 l10-10 8 8 6-6 8 8 8-8 v14H6z" fill="#006dff" opacity=".5"/></svg>'
  };
  return icons[id] || icons["etc"];
}

/* ---- Open window ---- */
function openWin(id) {
  if (wins[id]) {
    focusWin(id);
    return;
  }
  var def = WIN_DEFS[id];
  if (!def) return;
  var vw = window.innerWidth,
    vh = window.innerHeight - 48 - 24;
  var x = Math.max(10, Math.min(vw - def.w - 10, 60 + Object.keys(wins).length * 22));
  var y = Math.max(28, Math.min(vh - def.h - 10, 60 + Object.keys(wins).length * 22));

  var win = document.createElement("div");
  win.className = "win focused";
  win.id = "win-" + id;
  win.style.cssText = "left:" + x + "px;top:" + (y + 24) + "px;width:" + def.w + "px;height:" + def.h + "px;";

  var bar = document.createElement("div");
  bar.className = "win-bar";
  var barIcon = def.iconImg
    ? '<img src="' +
      def.iconImg +
      '" class="win-bar-svg" style="width:16px;height:16px;object-fit:contain;border-radius:3px;flex-shrink:0;" onerror="this.outerHTML=\'' +
      escAttr(iconSVG(def.icon).replace('class="icon-svg"', 'class="win-bar-svg"')) +
      "'\"/>"
    : iconSVG(def.icon).replace('class="icon-svg"', 'class="win-bar-svg"');
  bar.innerHTML =
    barIcon +
    '<span class="win-title">' +
    def.title +
    "</span>" +
    '<div class="win-btns">' +
    '<button class="win-btn win-min" onclick="minWin(\'' +
    id +
    "')\">-</button>" +
    '<button class="win-btn win-max" onclick="maxWin(\'' +
    id +
    "')\">&#9633;</button>" +
    '<button class="win-btn win-close" onclick="closeWin(\'' +
    id +
    "')\">&#215;</button>" +
    "</div>";
  win.appendChild(bar);

  var body = document.createElement("div");
  body.className = "win-body";
  var scroll = document.createElement("div");
  scroll.className = "win-scroll";
  scroll.innerHTML = buildContent(id);
  body.appendChild(scroll);
  win.appendChild(body);

  var rsz = document.createElement("div");
  rsz.className = "win-resize";
  win.appendChild(rsz);

  document.getElementById("desktop").appendChild(win);
  wins[id] = { el: win, minimized: false, maximized: false, ox: x, oy: y + 24, ow: def.w, oh: def.h };

  makeDraggable(win, bar);
  makeResizable(win, rsz);
  focusWin(id);
  addTBBtn(id, def.title, def.icon, def.iconImg);
  afterOpen(id);
}

function focusWin(id) {
  document.querySelectorAll(".win").forEach(function (w) {
    w.classList.remove("focused");
  });
  if (!wins[id]) return;
  zTop++;
  wins[id].el.style.zIndex = zTop;
  wins[id].el.classList.add("focused");
  document.querySelectorAll(".tb-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  if (tbBtns[id]) tbBtns[id].classList.add("active");
}

function closeWin(id) {
  if (!wins[id]) return;
  wins[id].el.remove();
  delete wins[id];
  if (tbBtns[id]) {
    tbBtns[id].remove();
    delete tbBtns[id];
  }
}

function minWin(id) {
  if (!wins[id]) return;
  var w = wins[id];
  if (w.minimized) {
    w.el.style.display = "";
    w.minimized = false;
    focusWin(id);
    if (tbBtns[id]) tbBtns[id].classList.add("active");
  } else {
    w.el.style.display = "none";
    w.minimized = true;
    document.querySelectorAll(".tb-btn").forEach(function (b) {
      b.classList.remove("active");
    });
  }
}

function maxWin(id) {
  if (!wins[id]) return;
  var w = wins[id];
  if (w.maximized) {
    w.el.style.cssText =
      "left:" + w.ox + "px;top:" + w.oy + "px;width:" + w.ow + "px;height:" + w.oh + "px;z-index:" + zTop + ";";
    w.maximized = false;
  } else {
    w.ox = parseInt(w.el.style.left);
    w.oy = parseInt(w.el.style.top);
    w.ow = parseInt(w.el.style.width);
    w.oh = parseInt(w.el.style.height);
    /* Leave 22px top bar visible */
    w.el.style.cssText = "left:0;top:22px;width:100%;height:calc(100% - 22px);z-index:" + zTop + ";";
    w.maximized = true;
  }
  w.el.classList.add("focused");
}

/* ---- Taskbar button — image icon with SVG fallback ---- */
function addTBBtn(id, title, icon, iconImg) {
  var btn = document.createElement("button");
  btn.className = "tb-btn active";
  var iconHTML = iconImg
    ? '<img src="' +
      iconImg +
      '" style="width:16px;height:16px;object-fit:contain;border-radius:3px;flex-shrink:0;" onerror="this.outerHTML=\'' +
      escAttr(iconSVG(icon).replace('class="icon-svg"', 'style=\\"width:16px;height:16px;\\"')) +
      "'\"/>"
    : iconSVG(icon).replace('class="icon-svg"', 'style="width:16px;height:16px;"');
  btn.innerHTML =
    iconHTML +
    '<span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:6px;">' +
    title.slice(0, 14) +
    "</span>";
  btn.addEventListener("click", function () {
    if (wins[id]) {
      if (wins[id].minimized) minWin(id);
      else if (wins[id].el.classList.contains("focused")) minWin(id);
      else focusWin(id);
    }
  });
  document.getElementById("tb-buttons").appendChild(btn);
  tbBtns[id] = btn;
}

/* ---- Drag & Resize ---- */
function makeDraggable(win, bar) {
  var sx, sy, sl, st;
  bar.addEventListener("mousedown", function (e) {
    if (e.target.classList.contains("win-btn")) return;
    var id = win.id.replace("win-", "");
    focusWin(id);
    sx = e.clientX;
    sy = e.clientY;
    sl = parseInt(win.style.left) || 0;
    st = parseInt(win.style.top) || 0;
    function mv(e) {
      win.style.left = Math.max(0, sl + (e.clientX - sx)) + "px";
      win.style.top = Math.max(24, st + (e.clientY - sy)) + "px";
    }
    function up() {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseup", up);
    e.preventDefault();
  });
}

function makeResizable(win, handle) {
  handle.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var sw = parseInt(win.style.width),
      sh = parseInt(win.style.height),
      sx = e.clientX,
      sy = e.clientY;
    function mv(e) {
      win.style.width = Math.max(320, sw + (e.clientX - sx)) + "px";
      win.style.height = Math.max(180, sh + (e.clientY - sy)) + "px";
    }
    function up() {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseup", up);
    }
    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseup", up);
  });
}

/* ---- After-open hooks ---- */
function afterOpen(id) {
  if (id === "neomix") setTimeout(initNeomixInWin, 50);
  if (id === "prime")
    setTimeout(function () {
      if (typeof initCreatorsLog === "function") initCreatorsLog();
    }, 50);
  if (id === "sticker") setTimeout(initStickerTray, 50);
  if (id === "badges") setTimeout(initBadgeCopy, 50);
  if (id === "ranking")
    setTimeout(function () {
      renderRank("Memes");
    }, 50);
}

/* ---- Content builders ---- */
function buildContent(id) {
  switch (id) {
    case "prime":
      return buildPrime();
    case "neomix":
      return buildNeomix();
    case "core":
      return buildCore();
    case "guestbook":
      return buildGuestbook();
    case "sticker":
      return buildSticker();
    case "badges":
      return buildBadges();
    case "ranking":
      return buildRanking();
    case "etc":
      return buildEtc();
    case "wallpaper":
      return buildWallpaper();
    default:
      return '<p style="color:var(--text-dim);font-size:9px;">// NO CONTENT</p>';
  }
}

/* ---- Creator's Log: full toolbar + admin form + feed ---- */
function buildPrime() {
  return (
    "" +
    '<div class="Blog-Header">' +
    '<div class="Blog-Header-Left">' +
    '<span class="Blog-Header-Title">CREATOR\'S LOG</span>' +
    '<span class="Blog-Entry-Count" id="Blog-Entry-Count">0 ENTRIES</span>' +
    "</div>" +
    '<div class="Blog-Header-Right">' +
    '<div class="Blog-Sort-Wrap" id="Blog-Sort-Wrap">' +
    '<button class="Blog-Sort-Btn" id="Blog-Sort-Btn">NEW\u2192OLD \u25be</button>' +
    '<div class="Blog-Sort-Dropdown" id="Blog-Sort-Dropdown">' +
    '<div class="Blog-Dropdown-Section-Title">SORT</div>' +
    '<div class="Blog-Dropdown-Opt" data-sort="desc">NEW \u2192 OLD</div>' +
    '<div class="Blog-Dropdown-Opt" data-sort="asc">OLD \u2192 NEW</div>' +
    '<div class="Blog-Dropdown-Section-Title">FILTER BY TAG</div>' +
    '<div class="Blog-Filter-Chips" id="Blog-Filter-Chips">' +
    '<button class="Blog-Filter-Chip active" data-tag="ALL">ALL</button>' +
    '<button class="Blog-Filter-Chip" data-tag="UPDATE">UPDATE</button>' +
    '<button class="Blog-Filter-Chip" data-tag="NEWS">NEWS</button>' +
    '<button class="Blog-Filter-Chip" data-tag="PATCH">PATCH</button>' +
    '<button class="Blog-Filter-Chip" data-tag="NOTE">NOTE</button>' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<button class="Blog-Export-Btn" id="Blog-Export-Btn" title="Copy local entries as HTML to paste into blog-entries.html">EXPORT HTML</button>' +
    '<button class="Blog-Clear-Btn" id="Blog-Clear-Btn" title="Delete all local entries (use after pasting the export into blog-entries.html)">CLEAR LOCAL</button>' +
    '<button class="Blog-Admin-Toggle" id="Blog-Admin-Toggle" title="New entry">+ NEW</button>' +
    "</div>" +
    "</div>" +
    '<form class="Blog-Admin-Form" id="Blog-Admin-Form" autocomplete="off">' +
    '<div class="Blog-Admin-Row">' +
    '<label class="Blog-Admin-Label" for="Blog-Admin-Pass">PASSCODE</label>' +
    '<input class="Blog-Admin-Input" type="password" id="Blog-Admin-Pass" placeholder="director\'s passcode"/>' +
    "</div>" +
    '<div class="Blog-Admin-Row Blog-Admin-Row-Split">' +
    "<div>" +
    '<label class="Blog-Admin-Label" for="Blog-Admin-Date">DATE</label>' +
    '<input class="Blog-Admin-Input" type="text" id="Blog-Admin-Date" placeholder="YYYY.MM.DD"/>' +
    "</div>" +
    "<div>" +
    '<label class="Blog-Admin-Label" for="Blog-Admin-Tag">TAG</label>' +
    '<select class="Blog-Admin-Input" id="Blog-Admin-Tag">' +
    '<option value="UPDATE">UPDATE</option>' +
    '<option value="NEWS">NEWS</option>' +
    '<option value="PATCH">PATCH</option>' +
    '<option value="NOTE">NOTE</option>' +
    "</select>" +
    "</div>" +
    "</div>" +
    '<div class="Blog-Admin-Row">' +
    '<label class="Blog-Admin-Label" for="Blog-Admin-Title">TITLE</label>' +
    '<input class="Blog-Admin-Input" type="text" id="Blog-Admin-Title" placeholder="entry title"/>' +
    "</div>" +
    '<div class="Blog-Admin-Row">' +
    '<label class="Blog-Admin-Label" for="Blog-Admin-Body">BODY</label>' +
    '<textarea class="Blog-Admin-Input Blog-Admin-Textarea" id="Blog-Admin-Body" rows="3" placeholder="entry body"></textarea>' +
    "</div>" +
    '<div class="Blog-Admin-Footer">' +
    '<span class="Blog-Admin-Status" id="Blog-Admin-Status"></span>' +
    '<div class="Blog-Admin-Btns">' +
    '<button type="button" class="Blog-Admin-Cancel" id="Blog-Admin-Cancel">CANCEL</button>' +
    '<button type="submit" class="Blog-Admin-Submit">POST</button>' +
    "</div>" +
    "</div>" +
    "</form>" +
    '<div id="Blog-Feed">' +
    '<p class="Blog-Empty">Loading entries...</p>' +
    "</div>"
  );
}

/* ---- NeoMix player — buttons now use uploaded icon images.
   Play button starts showing play.png; neomixUpdateStatus() swaps it
   to pause.png when the YT player reports "playing" state. ---- */
function buildNeomix() {
  var NM = "/Neoms~Universal-Fonts+Images/Icons/Neomix/";
  var imgBtn = function (id, file, alt) {
    return (
      '<button id="' +
      id +
      '" class="neomix-ibtn" title="' +
      alt +
      '">' +
      '<img src="' +
      NM +
      file +
      '" alt="' +
      alt +
      '" class="neomix-ibtn-img" draggable="false"/>' +
      "</button>"
    );
  };
  return (
    '<div id="neomix-player">' +
    '<div id="neomix-title-bar">NEOMIX PLAYER</div>' +
    '<div id="neomix-body">' +
    '<div id="neomix-display" style="display:none;"><div id="neomix-yt-target"></div></div>' +
    '<div id="neomix-screen"><div id="neomix-song-name"><b>Loading...</b></div><div id="neomix-song-sub"><br/></div></div>' +
    '<div class="neomix-row">' +
    '<button id="neomix-mute">&#128266;</button>' +
    '<input type="range" id="neomix-vol-bar" min="0" max="100" value="50"/>' +
    '<select id="neomix-playlist-select" style="flex-shrink:0;font-size:7px;max-width:120px;">' +
    '<option value="NeoMsMix-Main">NeoMsMix-Main</option>' +
    '<option value="SinisterMinds">SinisterMinds</option>' +
    '<option value="SinisterMinds (intr)">SinisterMinds (intr)</option>' +
    '<option value="NeoMsMix-Rewrite">NeoMsMix-Rewrite</option>' +
    "</select>" +
    "</div>" +
    '<div class="neomix-row">' +
    '<button id="neomix-video-toggle" class="neomix-toggle-btn" state="off"><span>Video</span></button>' +
    '<button id="neomix-shuffle" class="neomix-toggle-btn" state="off">' +
    '<img src="' +
    NM +
    'shuffle.gif" alt="Shuffle" class="neomix-toggle-img" draggable="false"/>' +
    "<span>Shuffle</span>" +
    "</button>" +
    "</div>" +
    '<input type="range" id="neomix-seek-bar" value="0" style="width:100%;display:block;margin:6px 0;"/>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">' +
    '<div class="neomix-ctrls">' +
    imgBtn("neomix-prev", "prev.png", "Previous") +
    imgBtn("neomix-play", "play.png", "Play/Pause") +
    imgBtn("neomix-next", "next.png", "Next") +
    "</div>" +
    '<div class="neomix-info-row"><span id="neomix-time-cur">0:00</span>/<span id="neomix-time-dur">0:00</span><span id="neomix-track-info">&mdash;/&mdash;</span></div>' +
    "</div>" +
    "</div></div>"
  );
}

/* ---- Core Directive — placeholder panel ---- */
function buildCore() {
  return (
    '<p style="color:var(--text-muted);font-size:9px;margin-bottom:14px;letter-spacing:1px;">CORE DIRECTIVE</p>' +
    '<p style="color:var(--text-dim);font-size:8px;line-height:1.6;">// No active directive.</p>' +
    '<p style="color:var(--text-dim);font-size:8px;line-height:1.6;margin-top:10px;">' +
    'To access the Neoms~Database, use the <b style="color:var(--accent-hi);">Neoms~Database</b> icon on the desktop.' +
    "</p>"
  );
}

function buildGuestbook() {
  return (
    '<div style="margin:-12px;height:calc(100% + 24px);display:flex;flex-direction:column;">' +
    '<div style="background:rgba(0,20,60,.6);border-bottom:1px solid var(--panel-border);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">' +
    '<span style="font-size:10px;letter-spacing:1px;color:var(--accent-hi);">Guest Book</span>' +
    '<a class="copy-btn" href="https://my.cbox.ws/Neoms-systems-log" target="_blank" rel="noopener" style="text-decoration:none;font-size:8px;">Chat</a></div>' +
    '<iframe id="Guestbook-Frame" src="https://www3.cbox.ws/box/?boxid=3553385&boxtag=ohcaCT" title="NeoMS Guest Book" allow="autoplay" style="flex:1;width:100%;border:none;display:block;background:transparent;min-height:0;"></iframe></div>'
  );
}

function buildSticker() {
  return (
    '<div style="margin:-16px;">' +
    '<div style="background:rgba(0,15,50,.65);border-bottom:1px solid var(--panel-border);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">' +
    '<span style="font-size:10px;letter-spacing:2px;color:var(--accent-hi);">&#10022; STICKER.HQ</span>' +
    '<button class="copy-btn" style="color:var(--danger);border-color:var(--danger);font-size:7px;" id="sticker-clear-btn">CLEAR ALL</button></div>' +
    '<p style="font-size:7px;letter-spacing:1px;color:var(--text-dim);padding:8px 14px 0;">Click to spawn. Drag anywhere. Hover &times; to remove.</p>' +
    '<div class="sticker-tray" id="Sticker-Tray"></div></div>'
  );
}

function buildBadges() {
  var code =
    '<a href="https://fatherlessjaymo.neocities.org/" target="_blank"><img src="https://fatherlessjaymo.neocities.org/Neoms~Universal-Fonts+Images/Badges/NEOMS-Badge.jpg" alt="NEOMS Badge" width="150"></a>';
  return (
    '<p style="color:var(--text-muted);font-size:9px;margin-bottom:14px;">Grab a badge for your Neocities site.</p>' +
    '<div class="badge-card"><div class="badge-card-inner">' +
    '<div class="badge-preview"><a href="https://fatherlessjaymo.neocities.org/" target="_blank"><img src="/Neoms~Universal-Fonts+Images/Badges/NEOMS-Badge.jpg" alt="NEOMS Badge" onerror="this.style.display=\'none\'"/></a></div>' +
    '<div style="flex:1;min-width:0;"><div class="badge-name">NEOMS</div><div class="badge-desc">Neo Overdrive Core — containment clearance.</div>' +
    '<div class="badge-code"><code>' +
    escHtml(code) +
    "</code></div>" +
    '<button class="copy-btn" id="badge-copy-btn" data-code="' +
    escAttr(code) +
    '">Copy Code</button></div></div></div>'
  );
}

function buildRanking() {
  var cats = ["Memes", "Cartoons", "Movies", "YouTubers"];
  var sidebar = cats
    .map(function (c, i) {
      return (
        '<div class="rank-cat' +
        (i === 0 ? " active" : "") +
        '" onclick="rankSelect(this,\'' +
        c +
        '\')" data-cat="' +
        c +
        '">' +
        c +
        "</div>"
      );
    })
    .join("");
  return (
    '<div class="rank-split" style="height:calc(100% - 32px);overflow:hidden;">' +
    '<div class="rank-sidebar" style="overflow-y:auto;">' +
    sidebar +
    "</div>" +
    '<div class="rank-main" id="rank-main"></div></div>'
  );
}

function rankSelect(el, cat) {
  document.querySelectorAll(".rank-cat").forEach(function (r) {
    r.classList.remove("active");
  });
  el.classList.add("active");
  renderRank(cat);
}

function renderRank(cat) {
  var main = document.getElementById("rank-main");
  if (!main) return;
  var data = (typeof NEOMS_RANK_DATA !== "undefined" && NEOMS_RANK_DATA[cat]) || [];
  var filled = data.filter(function (e) {
    return e.title || e.img;
  });
  if (!filled.length) {
    main.innerHTML = '<p class="rank-empty">// NO ENTRIES YET.</p>';
    return;
  }
  var COLORS = { SSS: "#ff6b35", SS: "#c792ea", S: "#a8c8e8" };
  main.innerHTML = filled
    .map(function (e) {
      var col = COLORS[e.rank] || COLORS.S;
      return (
        '<div class="rank-card" style="--rv-color:' +
        col +
        '">' +
        (e.img
          ? '<img class="rank-img" src="' + escHtml(e.img) + '" alt="' + escHtml(e.title) + '"/>'
          : '<div class="rank-img"></div>') +
        '<div><div class="rank-badge">' +
        escHtml(e.rank) +
        "</div>" +
        '<div class="rank-title">' +
        escHtml(e.title) +
        "</div>" +
        (e.notes ? '<div class="rank-notes">' + escHtml(e.notes) + "</div>" : "") +
        "</div></div>"
      );
    })
    .join("");
}

function buildEtc() {
  return (
    '<p style="color:var(--text-muted);font-size:9px;margin-bottom:14px;">Links to other NeomsCreator Profiles.</p>' +
    '<a href="https://anilist.co/user/FatherlessJaymo" class="etc-link" target="_blank" rel="noopener">' +
    '<img src="/Neoms~Universal-Fonts+Images/Icons/Desktop/Star-icon.jpg" alt="AniList" style="width:28px;height:28px;border-radius:4px;" onerror="this.style.display=\'none\'"/>' +
    '<div><div class="etc-link-name">Ani_Log</div><div class="etc-link-desc">Anime &amp; Manga — AniList Profile</div></div>' +
    '<span class="etc-arrow">&#x2192;</span></a>'
  );
}

var WP_OPTIONS = [
  {
    label: "Sonic CD",
    bg: "url('/Neoms~Universal-Fonts+Images/BG/Sonic-CD.gif') no-repeat center center fixed",
    size: "cover"
  },
  {
    label: "Neo Metal",
    bg: "url('/Neoms~Universal-Fonts+Images/BG/NeoMetal-WP.jpg') no-repeat center center fixed",
    size: "cover"
  }
];

function buildWallpaper() {
  return (
    '<p style="font-size:8px;color:var(--text-muted);margin-bottom:12px;letter-spacing:1px;">SELECT WALLPAPER</p>' +
    '<div style="display:flex;flex-wrap:wrap;">' +
    WP_OPTIONS.map(function (w, i) {
      return (
        '<div class="wp-option' +
        (i === 0 ? " active" : "") +
        '" data-wp="' +
        i +
        '" onclick="setWallpaper(' +
        i +
        ',this)">' +
        w.label +
        "</div>"
      );
    }).join("") +
    "</div>"
  );
}

function setWallpaper(idx, el) {
  var wp = WP_OPTIONS[idx];
  if (!wp) return;
  document.querySelectorAll(".wp-option").forEach(function (o) {
    o.classList.remove("active");
  });
  el.classList.add("active");
  document.body.style.background = wp.bg;
  document.body.style.backgroundSize = wp.size || "";
}

function initBadgeCopy() {
  var btn = document.getElementById("badge-copy-btn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var code = this.getAttribute("data-code");
    var self = this;
    function onCopied() {
      self.textContent = "Copied!";
      self.classList.add("copied");
      setTimeout(function () {
        self.textContent = "Copy Code";
        self.classList.remove("copied");
      }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(code).then(onCopied).catch(onCopied);
    else onCopied();
  });
}

/* ---- Helpers ---- */
function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escAttr(s) {
  return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function toast(msg, dur) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, dur || 2500);
}
