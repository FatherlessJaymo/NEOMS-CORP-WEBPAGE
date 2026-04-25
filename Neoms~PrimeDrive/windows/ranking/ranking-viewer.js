/* ============================================================
   RANKING VIEWER
   Category files: Memes, Cartoons, Movies, YouTubers.
   Each entry has an image, title, notes, and rank (SSS/SS/S).

   Entry data lives in ranking-data.js (NEOMS_RANK_DATA).
   This script plugs into the Code-Viewer-Shell DOM structure
   and replaces its main pane with ranking cards.

   BUG FIX: The old file accidentally passed the Source Code
   Viewer IIFE as an argument to this IIFE, making it dead code.
   Both modules are now fully separated.
============================================================ */
(function () {
    var RANK_CATEGORIES = [
        { label: "Memes", key: "Memes" },
        { label: "Cartoons", key: "Cartoons" },
        { label: "Movies", key: "Movies" },
        { label: "YouTubers", key: "YouTubers" }
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
        if (typeof NEOMS_RANK_DATA === "undefined") {
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

        var entries = NEOMS_RANK_DATA[key] || [];
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
