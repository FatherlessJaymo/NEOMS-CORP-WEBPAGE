/* ============================================================
   WALLPAPER
   Switches the body background. Add new wallpapers to
   NEOMS_WALLPAPERS — order here is the order shown to the user.
============================================================ */
(function () {
    var NEOMS_WALLPAPERS = [
        {
            label: "Sonic CD",
            bg: "url('Neoms~Universal-Fonts+Images/Wallpapers/Sonic-CD.gif') no-repeat center center fixed",
            size: "cover"
        },
        {
            label: "Neo Metal",
            bg: "url('Neoms~Universal-Fonts+Images/Wallpapers/NeoMetal-WP.jpg') no-repeat center center fixed",
            size: "cover"
        }
    ];

    window.buildWallpaper = function () {
        var opts = NEOMS_WALLPAPERS.map(function (w, i) {
            return (
                '<div class="wp-option' +
                (i === 0 ? " active" : "") +
                '" data-wp="' +
                i +
                '" onclick="setWallpaper(' +
                i +
                ',this)">' +
                escHtml(w.label) +
                "</div>"
            );
        }).join("");

        return '<p class="wp-intro">SELECT WALLPAPER</p>' + '<div class="wp-options">' + opts + "</div>";
    };

    /* Exposed so the inline onclick in the option element can find it.
       Kept on window to match the original API. */
    window.setWallpaper = function (idx, el) {
        var wp = NEOMS_WALLPAPERS[idx];
        if (!wp) return;
        document.querySelectorAll(".wp-option").forEach(function (o) {
            o.classList.remove("active");
        });
        if (el) el.classList.add("active");
        document.body.style.background = wp.bg;
        document.body.style.backgroundSize = wp.size || "";
    };

    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
})();
