/* ============================================================
   RANKING WINDOW (desktop window variant)
   The lightweight ranking viewer shown inside the NeoMS desktop
   window. Reads from NEOMS_RANK_DATA (defined in ranking-data.js).

   This is SEPARATE from ranking-viewer.js, which is a standalone
   page-level viewer that plugs into a Code-Viewer-Shell DOM and
   uses different classes (.RV-Card, .RV-Pane, etc).

   Exposed:
     window.buildRanking    — called by window-manager router
     window.renderRank(cat) — render a category in the open window
     window.rankSelect(...) — sidebar click handler

   Categories ALL come from NEOMS_RANK_DATA keys, in their
   declaration order. Add a new category there → it appears here.
============================================================ */
(function () {
    /* Use the keys of NEOMS_RANK_DATA so adding a category there
       automatically adds it to the sidebar. */
    function getCategories() {
        if (typeof NEOMS_RANK_DATA === "undefined") return [];
        return Object.keys(NEOMS_RANK_DATA);
    }

    window.buildRanking = function () {
        var cats = getCategories();
        if (!cats.length) {
            return '<p class="rank-empty">// NO RANKING DATA LOADED.</p>';
        }

        var sidebar = cats
            .map(function (c, i) {
                return (
                    '<div class="rank-cat' +
                    (i === 0 ? " active" : "") +
                    '" onclick="rankSelect(this,\'' +
                    escAttr(c) +
                    '\')" data-cat="' +
                    escAttr(c) +
                    '">' +
                    escHtml(c) +
                    "</div>"
                );
            })
            .join("");

        return (
            '<div class="rank-split" style="height:calc(100% - 32px);overflow:hidden;">' +
            '<div class="rank-sidebar" style="overflow-y:auto;">' +
            sidebar +
            "</div>" +
            '<div class="rank-main" id="rank-main"></div>' +
            "</div>"
        );
    };

    window.rankSelect = function (el, cat) {
        document.querySelectorAll(".rank-cat").forEach(function (r) {
            r.classList.remove("active");
        });
        el.classList.add("active");
        renderRank(cat);
    };

    /* Build the artist line for an entry.
       Renders nothing if e.artist is falsy.
       If e.artistUrl is set, the name itself links to it.
       If e.artistSocials is set, appends small icon links after. */
    function renderArtist(e) {
        if (!e.artist) return "";

        var nameHTML = e.artistUrl
            ? '<a class="rank-artist-link" href="' +
              escHtml(e.artistUrl) +
              '" target="_blank" rel="noopener noreferrer">' +
              escHtml(e.artist) +
              "</a>"
            : escHtml(e.artist);

        var socialsHTML = "";
        if (Array.isArray(e.artistSocials) && e.artistSocials.length) {
            socialsHTML =
                '<span class="rank-artist-socials">' +
                e.artistSocials
                    .map(function (s) {
                        var label = escHtml(s.label || "");
                        return (
                            '<a class="rank-social" href="' +
                            escHtml(s.url || "#") +
                            '" ' +
                            'target="_blank" rel="noopener noreferrer" ' +
                            'title="' +
                            label +
                            '" aria-label="' +
                            label +
                            '">' +
                            '<img src="' +
                            escHtml(s.icon || "") +
                            '" alt="' +
                            label +
                            '"/>' +
                            "</a>"
                        );
                    })
                    .join("") +
                "</span>";
        }

        return '<div class="rank-artist">' + nameHTML + socialsHTML + "</div>";
    }

    window.renderRank = function (cat) {
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
                    "<div>" +
                    '<div class="rank-badge">' +
                    escHtml(e.rank) +
                    "</div>" +
                    '<div class="rank-title">' +
                    escHtml(e.title) +
                    "</div>" +
                    renderArtist(e) +
                    (e.notes ? '<div class="rank-notes">' + escHtml(e.notes) + "</div>" : "") +
                    "</div>" +
                    "</div>"
                );
            })
            .join("");
    };

    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function escAttr(s) {
        return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
})();
