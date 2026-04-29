/* ============================================================
   STICKER HQ — BUILDER
   The window shell HTML for the Sticker HQ window.
   Tray population, drag/drop, and persistence live in
   sticker-hq.js (initStickerTray).
============================================================ */
(function () {
    window.buildSticker = function () {
        return (
            '<div style="margin:-16px;">' +
            '<div style="background:rgba(0,15,50,.65);border-bottom:1px solid var(--panel-border);padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">' +
            '<span style="font-size:10px;letter-spacing:2px;color:var(--accent-hi);">\u2726 STICKER.HQ</span>' +
            '<button class="copy-btn" style="color:var(--danger);border-color:var(--danger);font-size:7px;" id="sticker-clear-btn">CLEAR ALL</button>' +
            "</div>" +
            '<p style="font-size:7px;letter-spacing:1px;color:var(--text-dim);padding:8px 14px 0;">Click to spawn. Drag anywhere. Hover &times; to remove.</p>' +
            '<div class="sticker-tray" id="Sticker-Tray"></div>' +
            "</div>"
        );
    };
})();
