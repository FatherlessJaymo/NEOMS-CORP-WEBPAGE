/* ============================================================
   WINDOW MANAGER
   Window plumbing only. Open / close / minimize / maximize,
   drag, resize, taskbar buttons, and the content router.

   PATCHED: registers the new "terminaldb" window
   (Terminal-Database — combines old VM terminal + intake session).
============================================================ */
var zTop = 200;
var wins = {};
var tbBtns = {};

/* Shared image paths — match Neoms~PrimeDrive/JS/desktop-icons.js */
var FOLDER_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var NEOMIX_IMG = "Neoms~Universal-Fonts+Images/Icons/Neomix/Neomix-Sonic.jpg";
var ETC_IMG = "Neoms~Universal-Fonts+Images/Icons/App_Icons/Opera.png";
var TERMDB_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg";

/* ============================================================
   WINDOW DEFINITIONS
   Each entry: title, default size, icon id (for iconImg lookup).
============================================================ */
var WIN_DEFS = {
    prime: { title: "CREATOR'S LOG", w: 520, h: 500, icon: "prime", iconImg: FOLDER_IMG },
    neomix: { title: "NEOMIX PLAYER", w: 480, h: 420, icon: "neomix", iconImg: NEOMIX_IMG },
    core: { title: "CORE DIRECTIVE", w: 440, h: 420, icon: "core", iconImg: FOLDER_IMG },
    guestbook: { title: "GUEST BOOK", w: 500, h: 480, icon: "guestbook", iconImg: FOLDER_IMG },
    sticker: { title: "STICKER.HQ", w: 480, h: 360, icon: "sticker", iconImg: FOLDER_IMG },
    badges: { title: "NEOMS BADGES", w: 500, h: 420, icon: "badges", iconImg: FOLDER_IMG },
    ranking: { title: "RANKING VIEWER", w: 560, h: 500, icon: "ranking", iconImg: FOLDER_IMG },
    etc: { title: "ETC / OTHER SITES", w: 440, h: 360, icon: "etc", iconImg: ETC_IMG },
    wallpaper: { title: "WALLPAPER SETTINGS", w: 360, h: 280, icon: "wallpaper", iconImg: FOLDER_IMG },
    friendcodes: { title: "GAME CODES", w: 480, h: 480, icon: "friendcodes", iconImg: FOLDER_IMG },
    /* PATCHED: new window */
    terminaldb: { title: "TERMINAL // NEOMSDB", w: 600, h: 440, icon: "terminaldb", iconImg: TERMDB_IMG }
};

/* ---- Icon image lookup ----
   To swap an icon: change its path here (or in WIN_DEFS).
   Used by titlebar, taskbar buttons, AND Core Directive guide. */
var WIN_ICONS = {
    prime: FOLDER_IMG,
    neomix: NEOMIX_IMG,
    core: FOLDER_IMG,
    guestbook: FOLDER_IMG,
    sticker: FOLDER_IMG,
    badges: FOLDER_IMG,
    ranking: FOLDER_IMG,
    etc: ETC_IMG,
    wallpaper: FOLDER_IMG,
    friendcodes: FOLDER_IMG,
    /* PATCHED: new window */
    terminaldb: TERMDB_IMG
};

function iconImg(id) {
    return WIN_ICONS[id] || FOLDER_IMG;
}

/* ============================================================
   OPEN / FOCUS / CLOSE / MIN / MAX
============================================================ */
function openWin(id) {
    if (wins[id]) {
        focusWin(id);
        return;
    }
    var def = WIN_DEFS[id];
    if (!def) return;

    var vw = window.innerWidth;
    var vh = window.innerHeight - 48 - 24;
    var x = Math.max(10, Math.min(vw - def.w - 10, 60 + Object.keys(wins).length * 22));
    var y = Math.max(28, Math.min(vh - def.h - 10, 60 + Object.keys(wins).length * 22));

    var win = document.createElement("div");
    win.className = "win focused";
    win.id = "win-" + id;
    win.style.cssText = "left:" + x + "px;top:" + (y + 24) + "px;" + "width:" + def.w + "px;height:" + def.h + "px;";

    /* ---- Titlebar ---- */
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
        '<button class="win-btn win-min"   onclick="minWin(\'' +
        id +
        "')\">-</button>" +
        '<button class="win-btn win-max"   onclick="maxWin(\'' +
        id +
        "')\">&#9633;</button>" +
        '<button class="win-btn win-close" onclick="closeWin(\'' +
        id +
        "')\">&#215;</button>" +
        "</div>";
    win.appendChild(bar);

    /* ---- Body ---- */
    var body = document.createElement("div");
    body.className = "win-body";
    var scroll = document.createElement("div");
    scroll.className = "win-scroll";
    scroll.innerHTML = buildContent(id);
    body.appendChild(scroll);
    win.appendChild(body);

    /* ---- Resize handle ---- */
    var rsz = document.createElement("div");
    rsz.className = "win-resize";
    win.appendChild(rsz);

    document.getElementById("desktop").appendChild(win);
    wins[id] = {
        el: win,
        minimized: false,
        maximized: false,
        ox: x,
        oy: y + 24,
        ow: def.w,
        oh: def.h
    };

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
            "left:" +
            w.ox +
            "px;top:" +
            w.oy +
            "px;" +
            "width:" +
            w.ow +
            "px;height:" +
            w.oh +
            "px;" +
            "z-index:" +
            zTop +
            ";";
        w.maximized = false;
    } else {
        w.ox = parseInt(w.el.style.left);
        w.oy = parseInt(w.el.style.top);
        w.ow = parseInt(w.el.style.width);
        w.oh = parseInt(w.el.style.height);
        w.el.style.cssText = "left:0;top:22px;width:100%;height:calc(100% - 22px);" + "z-index:" + zTop + ";";
        w.maximized = true;
    }
    w.el.classList.add("focused");
}

/* ============================================================
   TASKBAR BUTTON
============================================================ */
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
        '<span style="max-width:80px;overflow:hidden;text-overflow:ellipsis;' +
        'white-space:nowrap;font-size:6px;">' +
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

/* ============================================================
   AFTER OPEN — per-window init hooks
   Each window's init function lives in its own folder; we
   just call it here.

   PATCHED: consults window.DB_AFTER_OPEN first so external
   modules can hook the lifecycle for their own ids.
   PATCHED: registers terminaldb -> initTerminalDB.
============================================================ */
function afterOpen(id) {
    if (id === "neomix") setTimeout(initNeomixInWin, 50);
    if (id === "prime")
        setTimeout(function () {
            if (typeof initCreatorsLog === "function") initCreatorsLog();
        }, 50);
    if (id === "core")
        setTimeout(function () {
            if (typeof initCoreDirective === "function") initCoreDirective();
        }, 50);
    if (id === "sticker") setTimeout(initStickerTray, 50);
    if (id === "badges") setTimeout(initBadgeCopy, 50);
    if (id === "ranking")
        setTimeout(function () {
            renderRank(getDefaultRankCat());
        }, 50);
    if (id === "friendcodes") setTimeout(initFriendCodes, 50);
    /* PATCHED: new window */
    if (id === "terminaldb")
        setTimeout(function () {
            if (typeof initTerminalDB === "function") initTerminalDB();
        }, 50);
}

/* First key of NEOMS_RANK_DATA, falls back to "Art" if data missing */
function getDefaultRankCat() {
    if (typeof NEOMS_RANK_DATA === "undefined") return "Art";
    var keys = Object.keys(NEOMS_RANK_DATA);
    return keys[0] || "Art";
}

/* ============================================================
   CONTENT ROUTER
   Each case calls a builder function defined in the matching
   per-window folder. If a builder is missing (script not loaded
   in time, etc.) we render a graceful error.

   PATCHED: consults window.DB_BUILD_OVERRIDES first so external
   modules can register their own ids.
   PATCHED: terminaldb -> buildTerminalDB.
============================================================ */
function buildContent(id) {
    /* External-module hook (database-mode.js etc.) */
    if (window.DB_BUILD_OVERRIDES && typeof window.DB_BUILD_OVERRIDES[id] === "function") {
        return window.DB_BUILD_OVERRIDES[id](id);
    }

    var fn;
    switch (id) {
        case "prime":
            fn = window.buildPrime;
            break;
        case "neomix":
            fn = window.buildNeomix;
            break;
        case "core":
            fn = window.buildCore;
            break;
        case "guestbook":
            fn = window.buildGuestbook;
            break;
        case "sticker":
            fn = window.buildSticker;
            break;
        case "badges":
            fn = window.buildBadges;
            break;
        case "ranking":
            fn = window.buildRanking;
            break;
        case "etc":
            fn = window.buildEtc;
            break;
        case "wallpaper":
            fn = window.buildWallpaper;
            break;
        case "friendcodes":
            fn = window.buildFriendCodes;
            break;
        /* PATCHED: new window */
        case "terminaldb":
            fn = window.buildTerminalDB;
            break;
    }
    if (typeof fn === "function") return fn();
    return (
        '<p style="color:var(--text-dim);font-size:9px;">// BUILDER MISSING: ' +
        id +
        " &mdash; check that its window file is loaded before window-manager.js</p>"
    );
}

/* ============================================================
   SHARED HELPERS
   Kept here because other window files reference them via the
   global scope (escHtml, escAttr, toast).
============================================================ */
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
   Show the Core Directive guide once the desktop is ready.

   PATCHED: skip if user is restoring into Database Mode — the
   intake/DB icons should be the first thing they see.
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        var savedMode = null;
        try {
            savedMode = localStorage.getItem("neoms_active_mode");
        } catch (e) {}
        if (savedMode === "database") return;
        if (typeof openWin === "function") openWin("core");
    }, 200);
});
