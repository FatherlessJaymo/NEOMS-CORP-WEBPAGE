/* ============================================================
   WINDOW MANAGER
   Handles: opening/closing/minimizing/maximizing windows,
   dragging, resizing, taskbar buttons, content HTML builders.

   NeoMix icons: the desktop icon, the window titlebar, and the
   taskbar button all use play.png from the uploaded Neomix icon
   set so NeoMix reads as a "music app" across all three surfaces.

   PATHS NOTE:
   These paths are used in src="..." attributes injected into
   the DOM. The browser resolves them relative to the current
   page URL (index.html lives at the repo root), NOT relative
   to this JS file. So we use the same relative paths the HTML
   uses — no leading slash.
============================================================ */
var zTop = 200;
var wins = {};
var tbBtns = {};

/* Shared image paths — match Neoms~PrimeDrive/JS/desktop-icons.js */
var FOLDER_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var NEOMIX_IMG = "Neoms~Universal-Fonts+Images/Icons/Neomix/Neomix-Sonic.jpg";

var WIN_DEFS = {
  prime: { title: "CREATOR'S LOG", w: 520, h: 500, icon: "prime", iconImg: FOLDER_IMG },
  neomix: { title: "NEOMIX PLAYER", w: 480, h: 420, icon: "neomix", iconImg: NEOMIX_IMG },
  core: { title: "CORE DIRECTIVE", w: 440, h: 400, icon: "core", iconImg: FOLDER_IMG },
  guestbook: { title: "GUEST BOOK", w: 500, h: 480, icon: "guestbook", iconImg: FOLDER_IMG },
  sticker: { title: "STICKER.HQ", w: 480, h: 360, icon: "sticker", iconImg: FOLDER_IMG },
  badges: { title: "NEOMS BADGES", w: 500, h: 420, icon: "badges", iconImg: FOLDER_IMG },
  ranking: { title: "RANKING VIEWER", w: 560, h: 500, icon: "ranking", iconImg: FOLDER_IMG },
  etc: { title: "ETC / OTHER SITES", w: 440, h: 360, icon: "etc", iconImg: FOLDER_IMG },
  wallpaper: { title: "WALLPAPER SETTINGS", w: 360, h: 280, icon: "wallpaper", iconImg: FOLDER_IMG },
  friendcodes: { title: "GAME CODES", w: 480, h: 480, icon: "friendcodes", iconImg: FOLDER_IMG }
};

/* ---- Icon image lookup ----
   Returns the real image path for a given window id.
   No more SVG fallbacks — icons should always load.
   To swap an icon later, change its path in WIN_ICONS or WIN_DEFS. */
var WIN_ICONS = {
  prime:     FOLDER_IMG,
  neomix:    NEOMIX_IMG,
  core:      FOLDER_IMG,
  guestbook: FOLDER_IMG,
  sticker:   FOLDER_IMG,
  badges:    FOLDER_IMG,
  ranking:   FOLDER_IMG,
  etc:       FOLDER_IMG,
  wallpaper: FOLDER_IMG,
  friendcodes: FOLDER_IMG
};

function iconImg(id) {
  return WIN_ICONS[id] || FOLDER_IMG;
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
  var barIcon =
    '<img src="' +
    (def.iconImg || iconImg(id)) +
    '" class="win-bar-img" alt="" ' +
    'style="width:16px;height:16px;object-fit:contain;border-radius:3px;flex-shrink:0;"/>';
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

/* ---- Taskbar button — image icon (plain, no fallback) ---- */
function addTBBtn(id, title, icon, iconSrc) {
  var btn = document.createElement("button");
  btn.className = "tb-btn active";
  var iconHTML =
    '<img src="' +
    (iconSrc || iconImg(icon)) +
    '" alt="" ' +
    'style="width:16px;height:16px;object-fit:contain;border-radius:3px;flex-shrink:0;"/>';
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
  if (id === "friendcodes") setTimeout(initFriendCodes, 50);
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
    case "friendcodes":
      return buildFriendCodes();
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
    "</div>" +
    '<div class="Blog-Header-Right">' +
    '<select id="Blog-Sort" class="Blog-Select"><option value="new">NEWEST</option><option value="old">OLDEST</option></select>' +
    "</div></div>" +
    '<div id="Blog-Feed"></div>'
  );
}

/* ---- NeoMix player shell ---- */
function buildNeomix() {
  var NM = "Neoms~Universal-Fonts+Images/Icons/Neomix/";
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

/* ---- Core Directive — desktop icon guide / "what does each window do?" ---- */
function buildCore() {
  /* Each entry: [icon-id, title, description].
     The icon-id is looked up via iconImg() to get a real image path,
     so this guide stays in sync with the desktop icons automatically.
     Swap a window's icon path in WIN_ICONS at the top of this file
     and it updates here, in the title bar, and on the taskbar. */
  var GUIDE = [
    ["prime",     "Creator's Log",   "Blog feed and update log. Posts about NeoMS development, Neoms~Database progress, and general notes. Tag-filterable; new entries can be added via the admin form."],
    ["neomix",    "NeoMix",          "Embedded music player backed by YouTube playlists (NeoMsMix-Main, SinisterMinds, NeoMsMix-Rewrite, and more). Supports shuffle, video mode, and a mini-player in the taskbar."],
    ["core",      "Core Directive",  "This window. A guide to every desktop icon and what each one contains."],
    ["guestbook", "Guest Book",      "Public chat/guestbook (powered by Cbox). Leave a message, say hi, or open the full chat in a new tab."],
    ["sticker",   "Sticker HQ",      "Click a sticker in the tray to spawn it on the desktop. Drag stickers anywhere; positions persist across visits. Hover a sticker to remove it."],
    ["badges",    "Badges",          "Grab the NEOMS badge for your own Neocities site. Copy the embed code and paste it into your page."],
    ["ranking",   "Rankings",        "Tier-list viewer. Categories: Memes, Cartoons, Movies, YouTubers. Each entry is ranked SSS / SS / S with notes."],
    ["etc",       "Etc",             "Links to my other profiles around the web (AniList, etc.). Use this for things that don't fit anywhere else."],
    ["friendcodes","Game Codes",      "Friend codes for the games I play. Each entry shows the game and the code with a one-click copy button."],
    ["wallpaper", "Wallpaper",       "Right-click the desktop and choose \"Change Wallpaper\" to swap the background. (Sonic CD / Neo Metal currently available.)"]
  ];

  /* Database row uses its own dedicated icon (VM.jpg) */
  var DB_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg";

  function row(src, name, desc) {
    return (
      '<div class="core-guide-row">' +
        '<div class="core-guide-icon">' +
          '<img src="' + src + '" alt="" class="core-guide-img"/>' +
        '</div>' +
        '<div class="core-guide-text">' +
          '<div class="core-guide-name">' + name + '</div>' +
          '<div class="core-guide-desc">' + desc + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  var rows = GUIDE.map(function (g) {
    return row(iconImg(g[0]), g[1], g[2]);
  }).join("");

  var dbRow = row(
    DB_IMG,
    "Neoms~Database",
    "Opens the Neoms~Database wiki in a new tab \u2014 the structured knowledge base behind NeoMS. Double-click the icon on the desktop to launch."
  );

  /* Inline styles so we don't have to add a separate CSS file */
  var STYLE =
    '<style>' +
    '.core-guide-intro{color:var(--text-muted);font-size:9px;letter-spacing:1px;margin-bottom:6px;}' +
    '.core-guide-sub{color:var(--text-dim);font-size:7px;line-height:1.6;margin-bottom:14px;}' +
    '.core-guide-row{display:flex;gap:12px;align-items:flex-start;padding:10px;margin-bottom:8px;background:rgba(7,42,113,.35);border:1px solid #1a4a8a;border-left:3px solid var(--accent-hi);border-radius:0 6px 6px 0;}' +
    '.core-guide-row:hover{background:rgba(0,40,100,.5);border-left-color:var(--accent);}' +
    '.core-guide-icon{flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;}' +
    '.core-guide-img{width:32px;height:32px;object-fit:contain;border-radius:4px;filter:drop-shadow(0 1px 3px rgba(0,40,120,.5));}' +
    '.core-guide-text{flex:1;min-width:0;}' +
    '.core-guide-name{font-size:9px;color:var(--accent-hi);letter-spacing:1px;margin-bottom:5px;font-family:"Press Start 2P",monospace;}' +
    '.core-guide-desc{font-size:7px;line-height:1.7;color:#9ac8f6;font-family:"Press Start 2P",monospace;}' +
    '</style>';

  return (
    STYLE +
    '<div class="core-guide-intro">// CORE DIRECTIVE</div>' +
    '<div class="core-guide-sub">Welcome to NeoMS. Here\u2019s what each desktop icon opens.</div>' +
    rows +
    dbRow
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
    '<div class="badge-preview"><a href="https://fatherlessjaymo.neocities.org/" target="_blank"><img src="Neoms~Universal-Fonts+Images/Badges/NEOMS-Badge.jpg" alt="NEOMS Badge" onerror="this.style.display=\'none\'"/></a></div>' +
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
    '<img src="Neoms~Universal-Fonts+Images/Icons/Desktop/Star-icon.jpg" alt="AniList" style="width:28px;height:28px;border-radius:4px;" onerror="this.style.display=\'none\'"/>' +
    '<div><div class="etc-link-name">Ani_Log</div><div class="etc-link-desc">Anime &amp; Manga — AniList Profile</div></div>' +
    '<span class="etc-arrow">&#x2192;</span></a>'
  );
}

var WP_OPTIONS = [
  {
    label: "Sonic CD",
    bg: "url('Neoms~Universal-Fonts+Images/BG/Sonic-CD.gif') no-repeat center center fixed",
    size: "cover"
  },
  {
    label: "Neo Metal",
    bg: "url('Neoms~Universal-Fonts+Images/BG/NeoMetal-WP.jpg') no-repeat center center fixed",
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

/* ---- Game Codes window ----
   Reads from NEOMS_FRIEND_CODES (defined in friend-codes-data.js).
   Renders a card per entry with a copy button. Empty array → empty state. */
function buildFriendCodes() {
  /* Guard: data file must be loaded before this runs */
  var list = (typeof NEOMS_FRIEND_CODES !== "undefined") ? NEOMS_FRIEND_CODES : [];

  var header =
    '<div class="fc-intro">// GAME CODES</div>' +
    '<div class="fc-sub">Friend codes for the games I play. Click COPY to grab one.</div>';

  if (!list.length) {
    return header + '<div class="fc-empty">// NO CODES YET</div>';
  }

  var rows = list.map(function (entry, i) {
    var game = escHtml(entry.game || "Untitled");
    var code = escHtml(entry.code || "");
    var note = entry.note ? '<div class="fc-note">' + escHtml(entry.note) + '</div>' : "";
    return (
      '<div class="fc-card">' +
        '<div class="fc-card-text">' +
          '<div class="fc-game">' + game + '</div>' +
          '<div class="fc-code">' + code + '</div>' +
          note +
        '</div>' +
        '<button class="fc-copy-btn" data-fc-idx="' + i + '" data-fc-code="' + escAttr(entry.code || "") + '">COPY</button>' +
      '</div>'
    );
  }).join("");

  return header + rows;
}

function initFriendCodes() {
  var btns = document.querySelectorAll(".fc-copy-btn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var code = this.getAttribute("data-fc-code");
      var self = this;
      function onCopied() {
        self.textContent = "COPIED!";
        self.classList.add("copied");
        setTimeout(function () {
          self.textContent = "COPY";
          self.classList.remove("copied");
        }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(onCopied).catch(onCopied);
      } else {
        onCopied();
      }
    });
  });
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

/* ============================================================
   AUTO-OPEN ON STARTUP
   Pop the Core Directive guide on first DOM ready so new
   visitors see the desktop-icon guide right away.

   Uses a small delay so it lands AFTER:
     - desktop-icons.js builds the icon grid
     - the wallpaper / clock / etc. settle
   ...which keeps the open animation looking clean instead
   of a window appearing on top of half-built desktop chrome.
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    if (typeof openWin === "function") openWin("core");
  }, 200);
});
