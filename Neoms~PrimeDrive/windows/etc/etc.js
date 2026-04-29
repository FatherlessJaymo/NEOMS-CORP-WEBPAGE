/* ============================================================
   ETC / OTHER SITES
   Links to other profiles around the web.
   Edit NEOMS_ETC_LINKS to add or remove links.
   // Add more like:
{ name: "...", desc: "...", url: "https://...", icon: "Neoms~..." }
============================================================ */
(function () {

    var NEOMS_ETC_LINKS = [
        {
            name: "Ani_Log",
            desc: "Anime & Manga \u2014 AniList Profile",
            url: "https://anilist.co/user/FatherlessJaymo",
            icon: "Neoms~Universal-Fonts+Images/Icons/Desktop/Star-icon.jpg"
        }
    ];

    window.buildEtc = function () {
        if (!NEOMS_ETC_LINKS.length) {
            return (
                '<p class="etc-intro">Links to other NeomsCreator Profiles.</p>' +
                '<p class="etc-empty">// NO LINKS YET</p>'
            );
        }

        var rows = NEOMS_ETC_LINKS.map(function (l) {
            return (
                '<a href="' + l.url + '" class="etc-link" target="_blank" rel="noopener">' +
                  '<img src="' + l.icon + '" alt="' + escHtml(l.name) + '" ' +
                    'class="etc-link-icon" onerror="this.style.display=\'none\'"/>' +
                  '<div>' +
                    '<div class="etc-link-name">' + escHtml(l.name) + '</div>' +
                    '<div class="etc-link-desc">' + escHtml(l.desc) + '</div>' +
                  '</div>' +
                  '<span class="etc-arrow">\u2192</span>' +
                '</a>'
            );
        }).join("");

        return (
            '<p class="etc-intro">Links to other NeomsCreator Profiles.</p>' +
            rows
        );
    };

    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
})();
