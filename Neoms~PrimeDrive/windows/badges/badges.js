/* ============================================================
   BADGES
   Single badge card with a "copy embed code" button.
   Add more badges by appending to NEOMS_BADGES below.
============================================================ */
(function () {
    var NEOMS_BADGES = [
        {
            name: "NEOMS",
            desc: "Neo Overdrive Core \u2014 containment clearance.",
            link: "https://fatherlessjaymo.neocities.org/",
            preview: "Neoms~Universal-Fonts+Images/Badges/NEOMS-Badge.jpg",
            embed: "https://fatherlessjaymo.neocities.org/Neoms~Universal-Fonts+Images/Badges/NEOMS-Badge.jpg"
        }
    ];

    function buildEmbedCode(b) {
        return (
            '<a href="' +
            b.link +
            '" target="_blank">' +
            '<img src="' +
            b.embed +
            '" alt="' +
            b.name +
            ' Badge" width="150">' +
            "</a>"
        );
    }

    window.buildBadges = function () {
        var cards = NEOMS_BADGES.map(function (b, i) {
            var code = buildEmbedCode(b);
            return (
                '<div class="badge-card"><div class="badge-card-inner">' +
                '<div class="badge-preview">' +
                '<a href="' +
                b.link +
                '" target="_blank">' +
                '<img src="' +
                b.preview +
                '" alt="' +
                escHtml(b.name) +
                ' Badge" ' +
                "onerror=\"this.style.display='none'\"/>" +
                "</a>" +
                "</div>" +
                '<div class="badge-card-body">' +
                '<div class="badge-name">' +
                escHtml(b.name) +
                "</div>" +
                '<div class="badge-desc">' +
                escHtml(b.desc) +
                "</div>" +
                '<div class="badge-code"><code>' +
                escHtml(code) +
                "</code></div>" +
                '<button class="copy-btn badge-copy-btn" data-badge-idx="' +
                i +
                '" data-code="' +
                escAttr(code) +
                '">Copy Code</button>' +
                "</div>" +
                "</div></div>"
            );
        }).join("");

        return '<p class="badge-intro">Grab a badge for your Neocities site.</p>' + cards;
    };

    window.initBadgeCopy = function () {
        document.querySelectorAll(".badge-copy-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var code = this.getAttribute("data-code");
                var self = this;
                function onCopied() {
                    self.textContent = "Copied!";
                    self.classList.add("copied");
                    setTimeout(function () {
                        self.textContent = "Copy Code";
                        self.classList.remove("copied");
                    }, 2000);
                }
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(onCopied).catch(onCopied);
                } else {
                    onCopied();
                }
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
