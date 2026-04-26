/* ============================================================
   GAME CODES (Friend Codes)
   Reads from NEOMS_FRIEND_CODES (defined in friend-codes-data.js).
   Renders a card per entry plus auto-generated platform filter
   chips derived from the unique `platform` values in the data.

   Exposes:
     window.buildFriendCodes() — called by window-manager router
     window.initFriendCodes()  — called after window mounts
============================================================ */
(function () {

    /* Find this window's root .win element by walking up from a known node.
       We need this so multiple Game Codes windows could in theory coexist
       without clobbering each other's filter state. */
    function findRoot(node) {
        return node && node.closest ? node.closest(".win") : null;
    }

    /* ---- BUILDER ---- */
    window.buildFriendCodes = function () {
        var list = (typeof NEOMS_FRIEND_CODES !== "undefined") ? NEOMS_FRIEND_CODES : [];

        var header =
            '<div class="fc-intro">// GAME CODES</div>' +
            '<div class="fc-sub">Friend codes for the games I play. Click COPY to grab one.</div>';

        if (!list.length) {
            return header + '<div class="fc-empty">// NO CODES YET</div>';
        }

        /* Auto-derive platform list (preserving first-seen order) */
        var PLATFORMS = ["ALL"];
        list.forEach(function (e) {
            var p = (e.platform || "Other").trim() || "Other";
            if (PLATFORMS.indexOf(p) === -1) PLATFORMS.push(p);
        });

        var chips = PLATFORMS.map(function (p, i) {
            return (
                '<button class="fc-chip' + (i === 0 ? ' active' : '') +
                '" data-filter="' + escAttr(p) + '">' + escHtml(p) + '</button>'
            );
        }).join("");

        var rows = list.map(function (entry, i) {
            var game = escHtml(entry.game || "Untitled");
            var platform = escHtml((entry.platform || "Other").trim() || "Other");
            var code = escHtml(entry.code || "");
            var note = entry.note ? '<div class="fc-note">' + escHtml(entry.note) + '</div>' : "";
            return (
                '<div class="fc-card" data-platform="' + escAttr(platform) + '">' +
                  '<div class="fc-card-text">' +
                    '<div class="fc-game">' + game +
                      ' <span class="fc-platform">' + platform + '</span>' +
                    '</div>' +
                    '<div class="fc-code">' + code + '</div>' +
                    note +
                  '</div>' +
                  '<button class="fc-copy-btn" data-fc-idx="' + i +
                    '" data-fc-code="' + escAttr(entry.code || "") + '">COPY</button>' +
                '</div>'
            );
        }).join("");

        return (
            header +
            '<div class="fc-chips">' + chips + '</div>' +
            '<div class="fc-list">' + rows + '</div>' +
            '<div class="fc-empty fc-empty-filter" style="display:none;">// NO CODES FOR THIS PLATFORM</div>'
        );
    };

    /* ---- INIT — wire copy buttons + chip filtering ---- */
    window.initFriendCodes = function () {
        /* Copy buttons */
        var btns = document.querySelectorAll(".fc-copy-btn");
        btns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                var code = this.getAttribute("data-fc-code");
                var self = this;
                function onCopied() {
                    self.textContent = "COPIED!";
                    self.classList.add("copied");
                    setTimeout(function () {
                        self.textContent = "COPY";
                        self.classList.remove("copied");
                    }, 1800);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(onCopied).catch(onCopied);
                } else {
                    onCopied();
                }
            });
        });

        /* Platform chip filtering */
        var chips = document.querySelectorAll(".fc-chip");
        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                var root = findRoot(this);
                if (!root) return;

                var p = this.getAttribute("data-filter");

                root.querySelectorAll(".fc-chip").forEach(function (c) {
                    c.classList.remove("active");
                });
                this.classList.add("active");

                var visible = 0;
                root.querySelectorAll(".fc-card").forEach(function (card) {
                    var match = (p === "ALL") || (card.getAttribute("data-platform") === p);
                    card.classList.toggle("hidden", !match);
                    if (match) visible++;
                });

                var emptyEl = root.querySelector(".fc-empty-filter");
                if (emptyEl) emptyEl.style.display = visible ? "none" : "block";
            });
        });
    };

    /* ---- Local helpers (avoid relying on window-manager's escapers
       in case load order ever changes) ---- */
    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function escAttr(s) {
        return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
})();
