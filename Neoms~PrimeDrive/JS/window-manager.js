/* ============================================================
   WINDOW MANAGER
   Window plumbing only. Open / close / minimize / maximize,
   drag, resize, taskbar buttons, and the content router.

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
    gallery: { title: "ART GALLERY", w: 560, h: 500, icon: "gallery", iconImg: FOLDER_IMG },
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
    gallery: FOLDER_IMG,
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
        /* Already open: un-minimize if hidden, then bring to front */
        if (wins[id].minimized) minWin(id);
        else focusWin(id);
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
    wireSnapButton(id, bar.querySelector(".win-max"));
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
    syncMaxState();
}

/* Lift the desktop over the label bar + taskbar while any maximized
   window is visible (see body.win-max-active in window-manager.css) */
function syncMaxState() {
    var active = Object.keys(wins).some(function (k) {
        return (wins[k].maximized || wins[k].snap) && !wins[k].minimized;
    });
    document.body.classList.toggle("win-max-active", !!active);
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
    syncMaxState();
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
        /* Covers the top label bar; the taskbar stays visible below */
        w.el.style.cssText = "left:0;top:0;width:100%;height:100%;" + "z-index:" + zTop + ";";
        w.maximized = true;
    }
    w.el.classList.toggle("maximized", w.maximized);
    w.el.classList.add("focused");
    syncMaxState();
}

/* Esc restores the focused maximized window */
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    for (var k in wins) {
        if (wins[k].maximized && !wins[k].minimized && wins[k].el.classList.contains("focused")) {
            maxWin(k);
            return;
        }
    }
});

/* ============================================================
   TASKBAR BUTTON
============================================================ */
function addTBBtn(id, title, icon, iconSrc) {
    var btn = document.createElement("button");
    btn.className = "tb-btn active";
    /* Sizing/ellipsis live in taskbar.css (.tb-btn img / .tb-btn > span) */
    btn.title = title;
    btn.innerHTML = '<img src="' + (iconSrc || iconImg(icon)) + '" alt=""/>' + "<span>" + title + "</span>";
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
        if (wins[id] && wins[id].maximized) return; /* maximized windows stay put */
        var w = wins[id];
        var side = null;
        sx = e.clientX;
        sy = e.clientY;
        sl = parseInt(win.style.left) || 0;
        st = parseInt(win.style.top) || 0;
        function mv(e) {
            /* Dragging a snapped window off: restore its pre-snap size,
               keeping the grab point proportionally under the cursor */
            if (w && w.snap && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) {
                var ratio = (sx - sl) / (parseInt(win.style.width) || 1);
                win.style.width = w.snap.w + "px";
                win.style.height = w.snap.h + "px";
                sl = sx - Math.round(w.snap.w * ratio);
                st = Math.max(st, TOP_BAR_H);
                w.snap = null;
                syncMaxState();
            }
            win.style.left = Math.max(0, sl + (e.clientX - sx)) + "px";
            win.style.top = Math.max(TOP_BAR_H, st + (e.clientY - sy)) + "px";

            /* Near a screen edge / corner → preview the snap */
            side = snapZone(e.clientX, e.clientY);

            /* Top of the screen (not a corner) → snap layouts flyout */
            if (!side && e.clientY <= SNAP_BAR_Y && flyout.mode !== "drag") showFlyout(id, "drag");
            if (flyout.mode === "drag") {
                var fr = flyout.el.getBoundingClientRect();
                var cellZone = flyoutZoneAt(e.clientX, e.clientY);
                if (cellZone) side = cellZone;
                else if (side || e.clientY > fr.bottom + 30) hideFlyout();
            }
            snapPreview(side);
        }
        function up() {
            document.removeEventListener("mousemove", mv);
            document.removeEventListener("mouseup", up);
            snapPreview(null);
            if (flyout.mode === "drag") hideFlyout();
            if (side && w) snapWin(id, side);
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
    if (id === "gallery")
        setTimeout(function () {
            if (typeof initArtGallery === "function") initArtGallery();
        }, 50);
    if (id === "friendcodes") setTimeout(initFriendCodes, 50);
}

/* First key of NEOMS_SHOWCASE_DATA ("" if data missing) */
function getDefaultRankCat() {
    if (typeof NEOMS_SHOWCASE_DATA === "undefined") return "";
    return Object.keys(NEOMS_SHOWCASE_DATA)[0] || "";
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
        case "gallery":
            fn = window.buildArtGallery;
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
   SPLIT SCREEN
   tileWins(ids)  — lay windows out side by side in the free
                    desktop area right of the icon grid.
   Edge snapping  — see makeDraggable: drop a window on the left
                    or right screen edge to fill that half.
============================================================ */
var TOP_BAR_H = 24;
var TASKBAR_H = 48;
var TILE_GAP = 8;
var TILE_MIN_W = 320;

/* Right edge of the desktop icons, so tiled windows don't cover them */
function iconsRight() {
    var right = 0;
    document.querySelectorAll("#icon-grid > *").forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.width) right = Math.max(right, r.right);
    });
    return right;
}

/* Place a window and remember the rect as its restore size */
function setWinRect(id, x, y, w, h) {
    var win = wins[id];
    if (!win) return;
    if (win.maximized) maxWin(id);
    win.el.style.left = x + "px";
    win.el.style.top = y + "px";
    win.el.style.width = w + "px";
    win.el.style.height = h + "px";
}

function tileWins(ids) {
    ids = ids.filter(function (id) {
        return wins[id] && !wins[id].minimized;
    });
    if (!ids.length) return false;

    var left = iconsRight() + TILE_GAP;
    var right = window.innerWidth - TILE_GAP;
    var top = TOP_BAR_H + TILE_GAP;
    var height = window.innerHeight - TASKBAR_H - TILE_GAP - top;
    var colW = Math.floor((right - left - TILE_GAP * (ids.length - 1)) / ids.length);

    /* Too narrow (phones / small windows) — keep the normal cascade */
    if (colW < TILE_MIN_W || height < 240) return false;

    ids.forEach(function (id, i) {
        setWinRect(id, left + i * (colW + TILE_GAP), top, colW, height);
    });
    return true;
}

/* Snap zones: "left" | "right" halves, and quarters
   "top-left" | "top-right" | "bottom-left" | "bottom-right".
   Snapped windows cover the top label bar (like maximize). */
var SNAP_EDGE = 5; /* px from the screen edge that triggers a snap */
var SNAP_CORNER = 90; /* px from a corner that picks a quarter */

function snapRect(zone) {
    var W = window.innerWidth;
    var H = window.innerHeight - TASKBAR_H;
    var halfW = Math.floor(W / 2);
    var halfH = Math.floor(H / 2);
    /* Thirds: "third-0" | "third-1" | "third-2" */
    if (zone.indexOf("third-") === 0) {
        var i = +zone.slice(6);
        var x0 = Math.floor((W * i) / 3);
        return { x: x0, y: 0, w: Math.floor((W * (i + 1)) / 3) - x0, h: H };
    }
    var right = zone.indexOf("right") !== -1;
    var quarter = zone.indexOf("-") !== -1;
    var bottom = zone.indexOf("bottom") === 0;
    return {
        x: right ? halfW : 0,
        y: quarter && bottom ? halfH : 0,
        w: right ? W - halfW : halfW,
        h: quarter ? (bottom ? H - halfH : halfH) : H
    };
}

/* Which zone (if any) the cursor is in */
function snapZone(x, y) {
    var W = window.innerWidth;
    var H = window.innerHeight - TASKBAR_H;
    var atL = x <= SNAP_EDGE,
        atR = x >= W - SNAP_EDGE,
        atT = y <= SNAP_EDGE,
        atB = y >= H - SNAP_EDGE;
    var nearL = x <= SNAP_CORNER,
        nearR = x >= W - SNAP_CORNER,
        nearT = y <= SNAP_CORNER,
        nearB = y >= H - SNAP_CORNER;
    if ((atL && nearT) || (atT && nearL)) return "top-left";
    if ((atR && nearT) || (atT && nearR)) return "top-right";
    if ((atL && nearB) || (atB && nearL)) return "bottom-left";
    if ((atR && nearB) || (atB && nearR)) return "bottom-right";
    if (atL) return "left";
    if (atR) return "right";
    return null;
}

/* Translucent preview shown while dragging near an edge */
function snapPreview(side) {
    var el = document.getElementById("snap-preview");
    if (!side) {
        if (el) el.style.display = "none";
        return;
    }
    if (!el) {
        el = document.createElement("div");
        el.id = "snap-preview";
        document.body.appendChild(el);
    }
    var r = snapRect(side);
    el.style.cssText =
        "display:block;left:" + r.x + "px;top:" + r.y + "px;width:" + r.w + "px;height:" + r.h + "px;";
}

/* Snap a window into a zone, remembering its size for un-snap */
function snapWin(id, zone) {
    var w = wins[id];
    if (!w) return;
    if (w.minimized) minWin(id);
    var pre = w.snap || { w: parseInt(w.el.style.width), h: parseInt(w.el.style.height) };
    var r = snapRect(zone);
    setWinRect(id, r.x, r.y, r.w, r.h);
    w.snap = pre;
    focusWin(id);
    syncMaxState();
}

/* ============================================================
   SNAP LAYOUTS FLYOUT (Windows 11 style)
   Hover a window's maximize button, or drag a window to the top
   of the screen, to get a panel of layout thumbnails. Hovering
   a slot previews it; clicking / dropping on it snaps there.
   Each layout = CSS grid-template-areas + the zone per cell.
============================================================ */
var SNAP_LAYOUTS = [
    { cols: "1fr 1fr", rows: "1fr", cells: [["left", "1/1/2/2"], ["right", "1/2/2/3"]] },
    { cols: "1fr 1fr 1fr", rows: "1fr", cells: [["third-0", "1/1/2/2"], ["third-1", "1/2/2/3"], ["third-2", "1/3/2/4"]] },
    {
        cols: "1fr 1fr",
        rows: "1fr 1fr",
        cells: [
            ["top-left", "1/1/2/2"],
            ["top-right", "1/2/2/3"],
            ["bottom-left", "2/1/3/2"],
            ["bottom-right", "2/2/3/3"]
        ]
    },
    { cols: "1fr 1fr", rows: "1fr 1fr", cells: [["left", "1/1/3/2"], ["top-right", "1/2/2/3"], ["bottom-right", "2/2/3/3"]] }
];
var SNAP_BAR_Y = 36; /* dragging above this shows the flyout at the top */

var flyout = { el: null, id: null, mode: null, hideT: null };

function ensureFlyout() {
    if (flyout.el) return flyout.el;
    var el = document.createElement("div");
    el.id = "snap-flyout";
    el.innerHTML = SNAP_LAYOUTS.map(function (L) {
        return (
            '<div class="snap-layout" style="grid-template-columns:' +
            L.cols +
            ";grid-template-rows:" +
            L.rows +
            '">' +
            L.cells
                .map(function (c) {
                    return '<div class="snap-cell" data-zone="' + c[0] + '" style="grid-area:' + c[1] + '"></div>';
                })
                .join("") +
            "</div>"
        );
    }).join("");
    document.body.appendChild(el);

    el.addEventListener("mouseover", function (e) {
        var cell = e.target.closest(".snap-cell");
        if (flyout.mode === "button") snapPreview(cell ? cell.getAttribute("data-zone") : null);
    });
    el.addEventListener("mouseleave", function () {
        if (flyout.mode === "button") {
            snapPreview(null);
            hideFlyoutSoon();
        }
    });
    el.addEventListener("mouseenter", function () {
        clearTimeout(flyout.hideT);
    });
    el.addEventListener("click", function (e) {
        var cell = e.target.closest(".snap-cell");
        if (!cell || !flyout.id) return;
        var id = flyout.id;
        hideFlyout();
        snapWin(id, cell.getAttribute("data-zone"));
    });
    flyout.el = el;
    return el;
}

/* mode "button": anchored under a window's maximize button
   mode "drag":   centered at the top of the screen */
function showFlyout(id, mode, anchor) {
    var el = ensureFlyout();
    clearTimeout(flyout.hideT);
    flyout.id = id;
    flyout.mode = mode;
    el.className = "snap-show snap-" + mode;
    if (mode === "button" && anchor) {
        var r = anchor.getBoundingClientRect();
        var fw = el.offsetWidth;
        var x = Math.min(window.innerWidth - fw - 6, Math.max(6, r.right - fw / 2 - r.width / 2));
        el.style.left = x + "px";
        el.style.top = r.bottom + 6 + "px";
    } else {
        el.style.left = Math.round((window.innerWidth - el.offsetWidth) / 2) + "px";
        el.style.top = "8px";
    }
}

function hideFlyout() {
    clearTimeout(flyout.hideT);
    if (flyout.el) flyout.el.className = "";
    flyout.id = flyout.mode = null;
    flyout.el &&
        flyout.el.querySelectorAll(".snap-hot").forEach(function (c) {
            c.classList.remove("snap-hot");
        });
}

function hideFlyoutSoon() {
    clearTimeout(flyout.hideT);
    flyout.hideT = setTimeout(hideFlyout, 250);
}

/* Drag mode: zone of the flyout cell under the cursor (or null) */
function flyoutZoneAt(x, y) {
    if (flyout.mode !== "drag") return null;
    var hit = null;
    flyout.el.querySelectorAll(".snap-cell").forEach(function (c) {
        var r = c.getBoundingClientRect();
        var on = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        c.classList.toggle("snap-hot", on);
        if (on) hit = c.getAttribute("data-zone");
    });
    return hit;
}

/* Wire the hover flyout onto a window's maximize button */
function wireSnapButton(id, btn) {
    var showT;
    btn.addEventListener("mouseenter", function () {
        clearTimeout(flyout.hideT);
        showT = setTimeout(function () {
            if (wins[id] && !wins[id].maximized) showFlyout(id, "button", btn);
        }, 400);
    });
    btn.addEventListener("mouseleave", function () {
        clearTimeout(showT);
        if (flyout.mode === "button") hideFlyoutSoon();
    });
    btn.addEventListener("click", function () {
        clearTimeout(showT);
        hideFlyout();
    });
}

/* ============================================================
   AUTO-OPEN ON STARTUP
   Opens the default windows once the desktop is ready and tiles
   them side by side. Slight delay so it lands AFTER
   desktop-icons.js builds the icon grid.
   Order = left → right; the LAST one ends up focused.
============================================================ */
var STARTUP_WINS = ["prime", "guestbook", "core"];

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        if (typeof openWin !== "function") return;
        STARTUP_WINS.forEach(openWin);
        tileWins(STARTUP_WINS);
    }, 200);
});
