/* ============================================================
   RANKING VIEWER
   Categories: edit RANK_CATEGORIES below to add new ones.
============================================================ */
(function () {
    var RANK_CATEGORIES = [
        { label: "Memes", key: "Memes" },
        { label: "Cartoons", key: "Cartoons" },
        { label: "Movies", key: "Movies" },
        { label: "YouTubers", key: "YouTubers" },
        { label: "Art", key: "Art" }
    ];

    /* ================================================================
       RANK CONFIG
    ================================================================ */
    var RANK_META = {
        SSS: { color: "#ff6b35", glow: "rgba(255,107,53,0.4)", bg: "rgba(255,107,53,0.08)" },
        SS: { color: "#c792ea", glow: "rgba(199,146,234,0.4)", bg: "rgba(199,146,234,0.08)" },
        S: { color: "#a8c8e8", glow: "rgba(168,200,232,0.4)", bg: "rgba(168,200,232,0.08)" }
    };

    /* ================================================================
       INIT — hijacks the existing Code-Viewer-Shell DOM
    ================================================================ */
    function init() {
        var categoryList = document.getElementById("Code-File-List");
        var mainPane = document.querySelector(".Code-Viewer-Main");
        if (!categoryList || !mainPane) return;

        /* Guard: ranking-data.js must be loaded first */
        if (typeof NEOMS_SHOWCASE_DATA === "undefined") {
            console.error("RankingViewer: ranking-data.js not loaded.");
            return;
        }

        /* Replace the main pane content with the ranking scroll pane */
        mainPane.innerHTML = '<div class="RV-Pane" id="RV-Pane"></div>';

        /* Populate sidebar with category buttons */
        categoryList.innerHTML = "";
        RANK_CATEGORIES.forEach(function (cat, idx) {
            var li = document.createElement("li");
            li.className = "RV-Category-Item" + (idx === 0 ? " active" : "");
            li.textContent = cat.label;
            li.addEventListener("click", function () {
                document.querySelectorAll(".RV-Category-Item").forEach(function (el) {
                    el.classList.remove("active");
                });
                li.classList.add("active");
                renderCategory(cat.key);
            });
            categoryList.appendChild(li);
        });

        /* Load first category by default */
        renderCategory(RANK_CATEGORIES[0].key);
    }

    /* ================================================================
       RENDER CATEGORY
    ================================================================ */
    function renderCategory(key) {
        var pane = document.getElementById("RV-Pane");
        if (!pane) return;

        var entries = NEOMS_SHOWCASE_DATA[key] || [];
        pane.innerHTML = "";

        /* Filter out blank placeholder entries */
        var filled = entries.filter(function (e) {
            return e.title || e.img;
        });

        if (!filled.length) {
            pane.innerHTML = '<p class="RV-Empty">// NO ENTRIES YET.</p>';
            return;
        }

        filled.forEach(function (entry) {
            var meta = RANK_META[entry.rank] || RANK_META["S"];
            var card = document.createElement("div");
            card.className = "RV-Card";
            card.style.setProperty("--rv-rank-color", meta.color);
            card.style.setProperty("--rv-rank-glow", meta.glow);
            card.style.setProperty("--rv-rank-bg", meta.bg);

            var artistHTML = "";
            if (entry.artist) {
                var nameHTML = entry.artistUrl
                    ? '<a class="RV-Card-Artist-Link" href="' +
                      esc(entry.artistUrl) +
                      '" target="_blank" rel="noopener noreferrer">' +
                      esc(entry.artist) +
                      "</a>"
                    : esc(entry.artist);

                var socialsHTML = "";
                if (Array.isArray(entry.artistSocials) && entry.artistSocials.length) {
                    socialsHTML =
                        '<span class="RV-Card-Artist-Socials">' +
                        entry.artistSocials
                            .map(function (s) {
                                var label = esc(s.label || "");
                                return (
                                    '<a class="RV-Card-Social" href="' +
                                    esc(s.url || "#") +
                                    '" ' +
                                    'target="_blank" rel="noopener noreferrer" ' +
                                    'title="' +
                                    label +
                                    '" aria-label="' +
                                    label +
                                    '">' +
                                    '<img src="' +
                                    esc(s.icon || "") +
                                    '" alt="' +
                                    label +
                                    '"/>' +
                                    "</a>"
                                );
                            })
                            .join("") +
                        "</span>";
                }

                artistHTML =
                    '<div class="RV-Card-Artist">' +
                    '<span class="RV-Card-Artist-Label">BY</span> ' +
                    nameHTML +
                    socialsHTML +
                    "</div>";
            }

            card.innerHTML =
                '<div class="RV-Card-Img-Wrap">' +
                '<img class="RV-Card-Img" src="' +
                esc(entry.img) +
                '" alt="' +
                esc(entry.title) +
                '" />' +
                '<div class="RV-Rank-Badge">' +
                esc(entry.rank) +
                "</div>" +
                "</div>" +
                '<div class="RV-Card-Body">' +
                '<h3 class="RV-Card-Title">' +
                esc(entry.title) +
                "</h3>" +
                artistHTML +
                '<details class="RV-Notes">' +
                '<summary class="RV-Notes-Toggle">&#x25BA; NOTES</summary>' +
                '<p class="RV-Notes-Text">' +
                esc(entry.notes) +
                "</p>" +
                "</details>" +
                '<div class="RV-Rank-Row">' +
                '<span class="RV-Rank-Label">RANK</span>' +
                '<span class="RV-Rank-Value">' +
                esc(entry.rank) +
                "</span>" +
                "</div>" +
                "</div>";

            pane.appendChild(card);
        });
    }

    /* ================================================================
       HELPERS
    ================================================================ */
    function esc(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /* Run after DOM ready */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
