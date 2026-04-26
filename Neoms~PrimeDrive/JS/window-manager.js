/* ============================================================
   WINDOW MANAGER
   Window plumbing only. Open / close / minimize / maximize,
   drag, resize, taskbar buttons, and the content router.

   Each window's HTML builder + per-window logic now lives in
   its own folder under Neoms~PrimeDrive/windows/<name>/.
   The builders are exposed on window.buildXxx and looked up
   by buildContent() below. The init hooks (initXxx) are called
   from afterOpen() once the window is mounted.

   PATHS NOTE:
   Image paths injected into the DOM resolve relative to the
   PAGE URL (index.html), not this file. Always relative,
   never leading-slash.
============================================================ */
var zTop = 200;
var wins = {};
var tbBtns = {};

/* Shared image paths — match Neoms~PrimeDrive/JS/desktop-icons.js */
var FOLDER_IMG = "Neoms~Universal-Fonts+Images/Icons/Desktop/Filled-Folder.jpg";
var NEOMIX_IMG = "Neoms~Universal-Fonts+Images/Icons/Neomix/Neomix-Sonic.jpg";
var ETC_IMG = "Neoms~Universal-Fonts+Images/Icons/App_Icons/Opera.png";
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
    friendcodes: { title: "GAME CODES", w: 480, h: 480, icon: "friendcodes", iconImg: FOLDER_IMG }
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
    friendcodes: FOLDER_IMG
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
        /* Leave the 22px top label bar visible above the maximized window */
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
   DRAG & RESIZE
============================================================ */
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
        var sw = parseInt(win.style.width);
        var sh = parseInt(win.style.height);
        var sx = e.clientX,
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

/* ============================================================
   AFTER-OPEN HOOKS
   Called once a window is mounted. Each window's init function
   lives in its own folder; we just call it here.
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
============================================================ */
function buildContent(id) {
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
    }
    if (typeof fn === "function") return fn();
    return (
        '<p style="color:var(--text-dim);font-size:9px;">// BUILDER MISSING: ' +
        id +
        " — check that its window file is loaded before window-manager.js</p>"
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
   Slight delay so it lands AFTER desktop-icons.js builds the
   icon grid — keeps the open animation looking clean.
============================================================ */
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        if (typeof openWin === "function") openWin("core");
    }, 200);
});
