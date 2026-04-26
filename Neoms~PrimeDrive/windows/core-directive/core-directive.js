/* ============================================================
   CORE DIRECTIVE
   Builder + filter logic for the desktop icon guide window.

   Reads from NEOMS_CORE_GUIDE (defined in core-directive-data.js).
   Auto-builds category filter chips from the unique `category`
   values in the data.
============================================================ */
(function () {

    function findRoot(node) {
        return node && node.closest ? node.closest(".win") : null;
    }

    /* Resolve an entry's icon: explicit `icon` field wins, else
       look up via window-manager's iconImg(id). */
    function resolveIcon(entry) {
        if (entry.icon) return entry.icon;
        if (typeof iconImg === "function") return iconImg(entry.id);
        return "";
    }

    window.buildCore = function () {
        var GUIDE = (typeof NEOMS_CORE_GUIDE !== "undefined") ? NEOMS_CORE_GUIDE : [];

        if (!GUIDE.length) {
            return (
                '<div class="core-guide-intro">// CORE DIRECTIVE</div>' +
                '<div class="core-guide-empty">// NO ENTRIES</div>'
            );
        }

        /* Unique categories in first-seen order (ALL pinned first) */
        var CATS = ["ALL"];
        GUIDE.forEach(function (e) {
            var c = e.category || "Other";
            if (CATS.indexOf(c) === -1) CATS.push(c);
        });

        var chips = CATS.map(function (c, i) {
            return (
                '<button class="core-guide-chip' + (i === 0 ? ' active' : '') +
                '" data-filter="' + escAttr(c) + '">' + escHtml(c) + '</button>'
            );
        }).join("");

        var rows = GUIDE.map(function (e) {
            var cat = e.category || "Other";
            return (
                '<div class="core-guide-row" data-cat="' + escAttr(cat) + '">' +
                  '<div class="core-guide-icon">' +
                    '<img src="' + escAttr(resolveIcon(e)) + '" alt="" class="core-guide-img"/>' +
                  '</div>' +
                  '<div class="core-guide-text">' +
                    '<div class="core-guide-name">' + escHtml(e.name) +
                      ' <span class="core-guide-cat">' + escHtml(cat) + '</span>' +
                    '</div>' +
                    '<div class="core-guide-desc">' + escHtml(e.desc || "") + '</div>' +
                  '</div>' +
                '</div>'
            );
        }).join("");

        return (
            '<div class="core-guide-intro">// CORE DIRECTIVE</div>' +
            '<div class="core-guide-sub">Welcome to NeoMS. Here\u2019s what each desktop icon opens.</div>' +
            '<div class="core-guide-chips">' + chips + '</div>' +
            '<div class="core-guide-list">' + rows + '</div>' +
            '<div class="core-guide-empty core-guide-empty-filter" style="display:none;">// NO MATCHES</div>'
        );
    };

    window.initCoreDirective = function () {
        var chips = document.querySelectorAll(".core-guide-chip");
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                var root = findRoot(this);
                if (!root) return;

                var cat = this.getAttribute("data-filter");

                root.querySelectorAll(".core-guide-chip").forEach(function (c) {
                    c.classList.remove("active");
                });
                this.classList.add("active");

                var visible = 0;
                root.querySelectorAll(".core-guide-row").forEach(function (row) {
                    var match = (cat === "ALL") || (row.getAttribute("data-cat") === cat);
                    row.classList.toggle("hidden", !match);
                    if (match) visible++;
                });

                var emptyEl = root.querySelector(".core-guide-empty-filter");
                if (emptyEl) emptyEl.style.display = visible ? "none" : "block";
            });
        });
    };

    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function escAttr(s) {
        return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
})();
