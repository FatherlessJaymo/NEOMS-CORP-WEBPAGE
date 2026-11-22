/* ============================================================
   ART GALLERY
   One section per entry (title, artist, notes + a grid of its
   images). Click an image to view the entry fullscreen.
   Reads NEOMS_ART_GALLERY (art-gallery-data.js). Uses the shared
   lightbox / thumbnail helpers from ranking-window.js
   (window.NeomsShowcase), so load this after that file.
   Exposed:
     window.buildArtGallery — called by window-manager router
     window.initArtGallery  — after-open hook (click wiring)
============================================================ */
(function () {
    function entries() {
        if (typeof NEOMS_ART_GALLERY === "undefined") return [];
        return NEOMS_ART_GALLERY.filter(function (e) {
            return e.title || e.img || e.imgs;
        });
    }

    window.buildArtGallery = function () {
        var S = window.NeomsShowcase;
        var list = entries();
        if (!S) return '<p class="rank-empty">// GALLERY HELPERS MISSING — load ranking-window.js first.</p>';
        if (!list.length) return '<p class="rank-empty">// NO ART YET.</p>';

        var sections = list
            .map(function (e, ei) {
                var items = S.resolveImgs(e);
                return (
                    '<section class="gal-entry">' +
                    '<div class="gal-head">' +
                    '<div class="rank-title">' +
                    escHtml(e.title || "Untitled") +
                    "</div>" +
                    '<span class="gal-count">' +
                    items.length +
                    (items.length === 1 ? " PIECE" : " PIECES") +
                    "</span>" +
                    "</div>" +
                    S.renderArtist(e) +
                    (e.notes ? '<div class="rank-notes gal-notes">' + escHtml(e.notes) + "</div>" : "") +
                    '<div class="gal-grid">' +
                    items
                        .map(function (it, i) {
                            return (
                                '<button type="button" class="gal-item" data-entry="' +
                                ei +
                                '" data-idx="' +
                                i +
                                '" title="' +
                                escHtml((e.title || "") + " — " + (i + 1) + "/" + items.length) +
                                '">' +
                                S.thumbHTML(it.src, it.thumb, e.title || "") +
                                "</button>"
                            );
                        })
                        .join("") +
                    "</div>" +
                    "</section>"
                );
            })
            .join("");

        return (
            '<div class="tier-toolbar"><span class="tier-heading">// ART GALLERY</span></div>' +
            '<div class="gal" id="art-gallery">' +
            sections +
            "</div>"
        );
    };

    window.initArtGallery = function () {
        var root = document.getElementById("art-gallery");
        if (!root || root._galWired) return;
        root._galWired = true;

        /* Gallery item → fullscreen, swipeable through that entry */
        root.addEventListener("click", function (e) {
            var item = e.target.closest(".gal-item");
            var S = window.NeomsShowcase;
            if (!item || !S) return;
            var entry = entries()[+item.getAttribute("data-entry")];
            var imgs = entry
                ? S.resolveImgs(entry).map(function (it) {
                      return it.src;
                  })
                : [];
            if (imgs.length) S.lbOpen(imgs, +item.getAttribute("data-idx") || 0);
        });
    };
})();
