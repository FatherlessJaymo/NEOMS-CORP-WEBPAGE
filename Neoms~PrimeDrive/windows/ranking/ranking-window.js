/* ============================================================
   RANKING WINDOW (desktop window variant)
   The lightweight ranking viewer shown inside the NeoMS desktop
   window. Reads from NEOMS_RANK_DATA (defined in ranking-data.js).
   Exposed:
     window.buildRanking    — called by window-manager router
     window.renderRank(cat) — render a category in the open window
     window.rankSelect(...) — sidebar click handler

   Categories ALL come from NEOMS_RANK_DATA keys, in their
   declaration order. Add a new category there → it appears here.

   IMAGE FIELDS (per entry):
     img  — single image path (original field, still supported)
     imgs — array of image paths for a swipeable gallery
            e.g. imgs: ["path/a.jpg", "path/b.jpg"]
     If both are set, imgs takes priority.
     If only img is set, it is treated as a single-image gallery.
============================================================ */
(function () {
    /* ============================================================
       LIGHTBOX STATE
    ============================================================ */
    var LB = {
        el: null /* the overlay element */,
        imgs: [] /* current image list */,
        idx: 0 /* current index */,
        touchX: null /* for swipe detection */
    };

    /* ---- Build the lightbox overlay once ---- */
    function ensureLightbox() {
        if (document.getElementById("rank-lightbox")) return;

        var lb = document.createElement("div");
        lb.id = "rank-lightbox";
        lb.innerHTML = [
            '<button class="rlb-close" id="rlb-close" title="Close (Esc)">&#215;</button>',
            '<button class="rlb-arrow rlb-prev" id="rlb-prev" title="Previous">&#8249;</button>',
            '<div class="rlb-img-wrap">',
            '  <img id="rlb-img" src="" alt="Ranking image"/>',
            "</div>",
            '<button class="rlb-arrow rlb-next" id="rlb-next" title="Next">&#8250;</button>',
            '<div class="rlb-counter" id="rlb-counter">1 / 1</div>',
            '<button class="rlb-set-bg" id="rlb-set-bg" title="Set as desktop wallpaper">SET AS BG</button>'
        ].join("");

        document.body.appendChild(lb);
        LB.el = lb;

        /* Events */
        document.getElementById("rlb-close").addEventListener("click", lbClose);
        document.getElementById("rlb-prev").addEventListener("click", lbPrev);
        document.getElementById("rlb-next").addEventListener("click", lbNext);
        document.getElementById("rlb-set-bg").addEventListener("click", lbSetBg);

        /* Click backdrop to close */
        lb.addEventListener("click", function (e) {
            if (e.target === lb || e.target.classList.contains("rlb-img-wrap")) lbClose();
        });

        /* Keyboard */
        document.addEventListener("keydown", function (e) {
            if (!lb.classList.contains("rlb-open")) return;
            if (e.key === "Escape") lbClose();
            if (e.key === "ArrowLeft") lbPrev();
            if (e.key === "ArrowRight") lbNext();
        });

        /* Touch / swipe */
        lb.addEventListener(
            "touchstart",
            function (e) {
                LB.touchX = e.touches[0].clientX;
            },
            { passive: true }
        );
        lb.addEventListener("touchend", function (e) {
            if (LB.touchX === null) return;
            var dx = e.changedTouches[0].clientX - LB.touchX;
            LB.touchX = null;
            if (dx > 50) lbPrev();
            if (dx < -50) lbNext();
        });
    }

    function lbOpen(imgs, startIdx) {
        ensureLightbox();
        LB.imgs = imgs;
        LB.idx = startIdx || 0;
        lbRender();
        LB.el.classList.add("rlb-open");
        document.body.style.overflow = "hidden";
    }

    function lbClose() {
        if (!LB.el) return;
        LB.el.classList.remove("rlb-open");
        document.body.style.overflow = "";
    }

    function lbPrev() {
        LB.idx = (LB.idx - 1 + LB.imgs.length) % LB.imgs.length;
        lbRender();
    }

    function lbNext() {
        LB.idx = (LB.idx + 1) % LB.imgs.length;
        lbRender();
    }

    function lbSetBg() {
        var src = LB.imgs[LB.idx];
        if (!src) return;

        /* Apply directly to body — same pattern as wallpaper.js */
        document.body.style.background = "url('" + src.replace(/'/g, "\\'") + "') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";

        /* Deactivate any .wp-option chips so the wallpaper window
           doesn't show a stale selection next time it opens */
        document.querySelectorAll(".wp-option").forEach(function (o) {
            o.classList.remove("active");
        });

        /* Flash the button to confirm */
        var btn = document.getElementById("rlb-set-bg");
        if (btn) {
            var orig = btn.textContent;
            btn.textContent = "APPLIED!";
            btn.classList.add("rlb-set-bg-flash");
            setTimeout(function () {
                btn.textContent = orig;
                btn.classList.remove("rlb-set-bg-flash");
            }, 1600);
        }

        /* Show the NeoMS toast if available */
        if (typeof toast === "function") toast("Wallpaper updated!", 2000);
    }

    function lbRender() {
        var img = document.getElementById("rlb-img");
        var counter = document.getElementById("rlb-counter");
        var prev = document.getElementById("rlb-prev");
        var next = document.getElementById("rlb-next");
        if (!img) return;

        /* Fade transition */
        img.style.opacity = "0";
        img.src = LB.imgs[LB.idx];
        img.onload = function () {
            img.style.opacity = "1";
        };
        /* Fallback if image is already cached */
        if (img.complete) img.style.opacity = "1";

        if (counter) counter.textContent = LB.idx + 1 + " / " + LB.imgs.length;

        /* Hide arrows when only one image */
        var multi = LB.imgs.length > 1;
        if (prev) prev.style.display = multi ? "" : "none";
        if (next) next.style.display = multi ? "" : "none";
    }

    /* ---- Inject lightbox CSS once ---- */
    (function injectLightboxCSS() {
        if (document.getElementById("rank-lightbox-style")) return;
        var style = document.createElement("style");
        style.id = "rank-lightbox-style";
        style.textContent = [
            "#rank-lightbox {",
            "  position: fixed; inset: 0; z-index: 99999;",
            "  background: rgba(0,0,0,.92);",
            "  display: flex; align-items: center; justify-content: center;",
            "  gap: 12px;",
            "  opacity: 0; pointer-events: none;",
            "  transition: opacity .2s;",
            "}",
            "#rank-lightbox.rlb-open { opacity: 1; pointer-events: auto; }",
            ".rlb-img-wrap {",
            "  max-width: calc(100vw - 120px); max-height: calc(100vh - 80px);",
            "  display: flex; align-items: center; justify-content: center;",
            "  flex: 1;",
            "}",
            "#rlb-img {",
            "  max-width: 100%; max-height: calc(100vh - 80px);",
            "  object-fit: contain; border-radius: 6px;",
            "  box-shadow: 0 0 60px rgba(0,109,255,.3), 0 0 0 1px rgba(168,200,232,.15);",
            "  opacity: 0; transition: opacity .18s;",
            "  display: block;",
            "}",
            ".rlb-arrow {",
            "  font-family: 'Press Start 2P', monospace;",
            "  font-size: 32px; line-height: 1;",
            "  width: 48px; height: 48px; flex-shrink: 0;",
            "  background: rgba(0,109,255,.15);",
            "  border: 1.5px solid #1a4a8a;",
            "  border-radius: 6px; color: #a8c8e8;",
            "  cursor: pointer; transition: .15s;",
            "  display: flex; align-items: center; justify-content: center;",
            "  padding: 0;",
            "}",
            ".rlb-arrow:hover { background: rgba(0,109,255,.4); border-color: #a8c8e8; color: #fff; }",
            ".rlb-close {",
            "  position: absolute; top: 14px; right: 16px;",
            "  font-family: Arial, sans-serif; font-size: 28px; font-weight: bold;",
            "  width: 36px; height: 36px; padding: 0;",
            "  background: rgba(242,90,120,.15); border: 1.5px solid #f25a78;",
            "  border-radius: 6px; color: #f25a78;",
            "  cursor: pointer; transition: .15s;",
            "  display: flex; align-items: center; justify-content: center;",
            "}",
            ".rlb-close:hover { background: #f25a78; color: #000; }",
            ".rlb-counter {",
            "  position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);",
            "  font-family: 'Press Start 2P', monospace; font-size: 7px; letter-spacing: 2px;",
            "  color: #354a5f; background: rgba(0,0,0,.5);",
            "  padding: 4px 10px; border-radius: 4px; pointer-events: none;",
            "}",

            /* Thumbnail strip on cards */
            ".rank-thumb-strip {",
            "  display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px;",
            "}",
            ".rank-thumb {",
            "  width: 32px; height: 32px; object-fit: cover; border-radius: 3px;",
            "  border: 1px solid #1a4a8a; cursor: pointer;",
            "  transition: .15s; opacity: .7;",
            "}",
            ".rank-thumb:hover, .rank-thumb.active { border-color: #a8c8e8; opacity: 1; }",
            ".rank-img-btn {",
            "  position: relative; cursor: pointer; flex-shrink: 0; display: block;",
            "}",
            ".rank-img-btn::after {",
            "  content: '⛶';",
            "  position: absolute; bottom: 4px; right: 4px;",
            "  font-size: 10px; color: #fff;",
            "  background: rgba(0,0,0,.55); border-radius: 3px;",
            "  padding: 1px 3px; pointer-events: none;",
            "  opacity: 0; transition: opacity .15s;",
            "}",
            ".rank-img-btn:hover::after { opacity: 1; }",

            /* Set as Background button */
            ".rlb-set-bg {",
            "  position: absolute; bottom: 14px; right: 16px;",
            "  font-family: 'Press Start 2P', monospace; font-size: 6px; letter-spacing: 1.5px;",
            "  padding: 7px 12px;",
            "  background: rgba(0,109,255,.15); border: 1.5px solid #006dff;",
            "  border-radius: 4px; color: #a8c8e8;",
            "  cursor: pointer; transition: .15s;",
            "}",
            ".rlb-set-bg:hover { background: #006dff; color: #fff; box-shadow: 0 0 10px rgba(0,109,255,.5); }",
            ".rlb-set-bg-flash { background: #00cc66 !important; border-color: #00cc66 !important; color: #000 !important; }"
        ].join("\n");
        document.head.appendChild(style);
    })();

    /* ============================================================
       HELPERS
    ============================================================ */
    function escHtml(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function escAttr(s) {
        return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    /* Resolve image list for an entry.
       Priority: entry.imgs (array) > entry.img (string) > [] */
    function resolveImgs(entry) {
        if (Array.isArray(entry.imgs) && entry.imgs.length) return entry.imgs;
        if (entry.img) return [entry.img];
        return [];
    }

    /* ============================================================
       CATEGORY HELPERS
    ============================================================ */
    function getCategories() {
        if (typeof NEOMS_RANK_DATA === "undefined") return [];
        return Object.keys(NEOMS_RANK_DATA);
    }

    /* ============================================================
       ARTIST HTML
    ============================================================ */
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

    /* ============================================================
       CARD HTML — now includes thumbnail strip + click-to-fullscreen
    ============================================================ */
    function buildCard(e) {
        var imgs = resolveImgs(e);
        var col = { SSS: "#ff6b35", SS: "#c792ea", S: "#a8c8e8" }[e.rank] || "#a8c8e8";

        /* Main image — clickable to fullscreen */
        var mainImg = imgs.length
            ? '<div class="rank-img-btn" data-imgs="' +
              escAttr(JSON.stringify(imgs)) +
              '" data-idx="0">' +
              '<img class="rank-img" src="' +
              escHtml(imgs[0]) +
              '" alt="' +
              escHtml(e.title) +
              '"/>' +
              "</div>"
            : '<div class="rank-img"></div>';

        /* Thumbnail strip (only if 2+ images) */
        var thumbStrip = "";
        if (imgs.length > 1) {
            thumbStrip =
                '<div class="rank-thumb-strip">' +
                imgs
                    .map(function (src, i) {
                        return (
                            '<img class="rank-thumb' +
                            (i === 0 ? " active" : "") +
                            '" ' +
                            'src="' +
                            escHtml(src) +
                            '" alt="slide ' +
                            (i + 1) +
                            '" ' +
                            'data-imgs="' +
                            escAttr(JSON.stringify(imgs)) +
                            '" data-idx="' +
                            i +
                            '"/>'
                        );
                    })
                    .join("") +
                "</div>";
        }

        return (
            '<div class="rank-card" style="--rv-color:' +
            col +
            '">' +
            mainImg +
            "<div>" +
            '<div class="rank-badge">' +
            escHtml(e.rank) +
            "</div>" +
            '<div class="rank-title">' +
            escHtml(e.title) +
            "</div>" +
            renderArtist(e) +
            (e.notes ? '<div class="rank-notes">' + escHtml(e.notes) + "</div>" : "") +
            thumbStrip +
            "</div>" +
            "</div>"
        );
    }

    /* ============================================================
       PUBLIC API
    ============================================================ */
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

    window.renderRank = function (cat) {
        var main = document.getElementById("rank-main");
        if (!main) return;
        var data = (typeof NEOMS_RANK_DATA !== "undefined" && NEOMS_RANK_DATA[cat]) || [];
        var filled = data.filter(function (e) {
            return e.title || e.img || e.imgs;
        });

        if (!filled.length) {
            main.innerHTML = '<p class="rank-empty">// NO ENTRIES YET.</p>';
            return;
        }

        main.innerHTML = filled.map(buildCard).join("");

        /* Wire click handlers */
        main.querySelectorAll(".rank-img-btn, .rank-thumb").forEach(function (el) {
            el.addEventListener("click", function () {
                var imgs = JSON.parse(this.getAttribute("data-imgs") || "[]");
                var idx = parseInt(this.getAttribute("data-idx"), 10) || 0;
                if (imgs.length) lbOpen(imgs, idx);

                /* Highlight active thumb if clicking a thumbnail */
                if (this.classList.contains("rank-thumb")) {
                    var strip = this.closest(".rank-thumb-strip");
                    if (strip) {
                        strip.querySelectorAll(".rank-thumb").forEach(function (t) {
                            t.classList.remove("active");
                        });
                        this.classList.add("active");

                        /* Also update the main card image to match */
                        var card = this.closest(".rank-card");
                        if (card) {
                            var mainEl = card.querySelector(".rank-img");
                            if (mainEl) mainEl.src = imgs[idx];
                        }
                    }
                }
            });
        });
    };
})();
