/* ============================================================
   RANKING WINDOW (desktop window variant)
   The lightweight ranking viewer shown inside the NeoMS desktop
   window. Reads from NEOMS_SHOWCASE_DATA (defined in ranking-data.js).
   Exposed:
     window.buildRanking    — called by window-manager router
     window.renderRank(cat) — render a category in the open window
     window.rankSelect(...) — sidebar click handler

   Categories ALL come from NEOMS_SHOWCASE_DATA keys, in their
   declaration order. Add a new category there → it appears here.

   IMAGE FIELDS (per entry):
     img  — single image path (original field, still supported)
     imgs — array of image paths for a swipeable gallery
            e.g. imgs: ["path/a.jpg", "path/b.jpg"]
     If both are set, imgs takes priority.
     If only img is set, it is treated as a single-image gallery.

   TIER LIST: each image is a draggable tile. Drag between the
   S–F rows and the UNRANKED pool; placement is saved per
   category in localStorage. Click a tile to view it full size.
     tier — optional starting row ("S".."F") for an entry's images
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
            '  <iframe id="rlb-embed" src="about:blank" allowfullscreen scrolling="no" allow="autoplay; encrypted-media"></iframe>',
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
        /* Stop any playing Instagram reel */
        var frame = document.getElementById("rlb-embed");
        if (frame) frame.src = "about:blank";
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
        if (!src || igEmbed(src)) return;

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
        var frame = document.getElementById("rlb-embed");
        var setBg = document.getElementById("rlb-set-bg");
        if (!img) return;

        /* Instagram post / reel → embedded player instead of <img> */
        var embed = igEmbed(LB.imgs[LB.idx]);
        img.style.display = embed ? "none" : "";
        frame.style.display = embed ? "block" : "none";
        if (setBg) setBg.style.display = embed ? "none" : "";
        if (embed) {
            if (frame.src !== embed) frame.src = embed;
        } else {
            frame.src = "about:blank";

            /* Fade transition */
            img.style.opacity = "0";
            img.src = LB.imgs[LB.idx];
            img.onload = function () {
                img.style.opacity = "1";
            };
            /* Fallback if image is already cached */
            if (img.complete) img.style.opacity = "1";
        }

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
            "#rlb-embed {",
            "  display: none; border: 0; background: #fff;",
            "  width: min(400px, 100%); height: min(720px, calc(100vh - 80px));",
            "  border-radius: 6px;",
            "  box-shadow: 0 0 60px rgba(0,109,255,.3), 0 0 0 1px rgba(168,200,232,.15);",
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

    /* Resolve image list for an entry as { src, thumb } items.
       Priority: entry.imgs (array) > entry.img (string) > []
       Each item may be a path/URL string or { src, thumb }. */
    function resolveImgs(entry) {
        var list = Array.isArray(entry.imgs) && entry.imgs.length ? entry.imgs : entry.img ? [entry.img] : [];
        return list
            .map(function (it) {
                return typeof it === "string" ? { src: it, thumb: "" } : { src: it.src || "", thumb: it.thumb || "" };
            })
            .filter(function (it) {
                return it.src;
            });
    }

    /* Instagram post / reel / tv link → embed URL, else null.
       Tracking params (?utm_source=...) are dropped. */
    function igEmbed(url) {
        var m = /instagram\.com\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/i.exec(String(url || ""));
        if (!m) return null;
        var type = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
        return "https://www.instagram.com/" + type + "/" + m[2] + "/embed";
    }

    /* ============================================================
       CATEGORY HELPERS
    ============================================================ */
    function getCategories() {
        if (typeof NEOMS_SHOWCASE_DATA === "undefined") return [];
        return Object.keys(NEOMS_SHOWCASE_DATA);
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
       TIER LIST
       Every image (each item of imgs / img) is its own tile.
       Placement is saved per category in localStorage.
       Optional entry field  tier: "S" | "A" | ... | "F"  sets the
       starting row; otherwise tiles start in the UNRANKED pool.
    ============================================================ */
    var TIERS = [
        { id: "S", color: "#f25a78" },
        { id: "A", color: "#ff9f43" },
        { id: "B", color: "#ffd166" },
        { id: "C", color: "#7ee081" },
        { id: "D", color: "#4ecdc4" },
        { id: "F", color: "#8a8fa8" }
    ];
    var POOL = "pool";
    var STORE_PREFIX = "neoms-tierlist-";

    function loadPlacement(cat) {
        try {
            return JSON.parse(localStorage.getItem(STORE_PREFIX + cat)) || {};
        } catch (err) {
            return {};
        }
    }

    function savePlacement(main) {
        var cat = main.getAttribute("data-cat");
        var out = {};
        main.querySelectorAll(".tier-drop").forEach(function (zone) {
            out[zone.getAttribute("data-tier")] = Array.prototype.map.call(
                zone.querySelectorAll(".tier-tile"),
                function (t) {
                    return t.getAttribute("data-src");
                }
            );
        });
        try {
            localStorage.setItem(STORE_PREFIX + cat, JSON.stringify(out));
        } catch (err) {}
    }

    /* Returns { S: [tile,...], ..., pool: [...] } */
    function placeTiles(cat, entries) {
        var tiles = {};
        var order = [];
        entries.forEach(function (e, ei) {
            resolveImgs(e).forEach(function (it, i) {
                var src = it.src;
                if (tiles[src]) return;
                tiles[src] = { src: src, thumb: it.thumb, entry: ei, idx: i, title: e.title || "" };
                order.push(src);
            });
        });

        var rows = {};
        var used = {};
        var saved = loadPlacement(cat);
        TIERS.concat({ id: POOL }).forEach(function (t) {
            rows[t.id] = (saved[t.id] || [])
                .filter(function (src) {
                    return tiles[src] && !used[src];
                })
                .map(function (src) {
                    used[src] = true;
                    return tiles[src];
                });
        });

        /* New / never-placed images: entry.tier if valid, else pool */
        order.forEach(function (src) {
            if (used[src]) return;
            var tier = String(entries[tiles[src].entry].tier || "").toUpperCase();
            (rows[tier] || rows[POOL]).push(tiles[src]);
        });
        return rows;
    }

    var IG_ICON = "Neoms~Universal-Fonts+Images/Icons/App_Icons/Instagram.png";

    /* Thumbnail markup shared by tier tiles and Art Gallery items */
    function thumbHTML(src, thumb, title) {
        var embed = igEmbed(src);
        thumb = thumb || (embed ? "" : src);
        var inner = thumb
            ? '<img src="' + escHtml(thumb) + '" alt="' + escHtml(title) + '" draggable="false" loading="lazy"/>'
            : '<div class="tier-tile-ig"><img src="' +
              IG_ICON +
              '" alt="" draggable="false"/><span>' +
              (/\/reel\//.test(embed) ? "REEL" : "POST") +
              "</span></div>";
        if (embed) inner += '<span class="tier-tile-play">&#9654;</span>';
        return inner;
    }

    function tileHTML(t) {
        var inner = thumbHTML(t.src, t.thumb, t.title);

        return (
            '<div class="tier-tile" data-src="' +
            escHtml(t.src) +
            '" data-entry="' +
            t.entry +
            '" data-idx="' +
            t.idx +
            '" title="' +
            escHtml(t.title) +
            '">' +
            inner +
            "</div>"
        );
    }

    function buildBoard(cat, entries) {
        var rows = placeTiles(cat, entries);
        var tierRows = TIERS.map(function (t) {
            return (
                '<div class="tier-row" style="--tier-color:' +
                t.color +
                '">' +
                '<div class="tier-label">' +
                t.id +
                "</div>" +
                '<div class="tier-drop" data-tier="' +
                t.id +
                '">' +
                rows[t.id].map(tileHTML).join("") +
                "</div>" +
                "</div>"
            );
        }).join("");

        return (
            '<div class="tier-toolbar">' +
            '<span class="tier-heading">// ' +
            escHtml(cat) +
            " TIER LIST</span>" +
            '<button class="tier-reset" type="button">RESET</button>' +
            "</div>" +
            '<div class="tier-board">' +
            tierRows +
            "</div>" +
            '<div class="tier-pool-label">UNRANKED // DRAG INTO A TIER &#8593;</div>' +
            '<div class="tier-drop tier-pool" data-tier="' +
            POOL +
            '">' +
            rows[POOL].map(tileHTML).join("") +
            "</div>" +
            '<div class="tier-info" id="tier-info">Hover an image for details. Click to view full size.</div>'
        );
    }

    function showInfo(main, tile) {
        var box = main.querySelector(".tier-info");
        var entries = main._tierEntries || [];
        var e = tile && entries[+tile.getAttribute("data-entry")];
        if (!box || !e) return;
        box.innerHTML =
            '<div class="rank-title">' +
            escHtml(e.title || "Untitled") +
            "</div>" +
            renderArtist(e) +
            (e.notes ? '<div class="rank-notes">' + escHtml(e.notes) + "</div>" : "");
    }

    /* Index where the dragged tile should go inside zone */
    function insertBefore(zone, tile, x, y) {
        var others = zone.querySelectorAll(".tier-tile");
        for (var i = 0; i < others.length; i++) {
            if (others[i] === tile) continue;
            var r = others[i].getBoundingClientRect();
            if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) return others[i];
        }
        return null;
    }

    /* Open the lightbox on el's entry, starting at el's image */
    function openEntry(main, el) {
        var entry = (main._tierEntries || [])[+el.getAttribute("data-entry")];
        var imgs = entry
            ? resolveImgs(entry).map(function (it) {
                  return it.src;
              })
            : [];
        if (imgs.length) lbOpen(imgs, +el.getAttribute("data-idx") || 0);
    }

    /* Pointer-based drag so it works with mouse AND touch */
    function wireBoard(main) {
        if (main._tierWired) return;
        main._tierWired = true;

        main.addEventListener("mouseover", function (e) {
            var tile = e.target.closest && e.target.closest(".tier-tile");
            if (tile) showInfo(main, tile);
        });

        main.addEventListener("click", function (e) {
            if (!e.target.closest(".tier-reset")) return;
            try {
                localStorage.removeItem(STORE_PREFIX + main.getAttribute("data-cat"));
            } catch (err) {}
            renderRank(main.getAttribute("data-cat"));
        });

        main.addEventListener("pointerdown", function (e) {
            var tile = e.target.closest(".tier-tile");
            if (!tile || e.button > 0) return;
            e.preventDefault();

            var startX = e.clientX;
            var startY = e.clientY;
            var rect = tile.getBoundingClientRect();
            var offX = startX - rect.left;
            var offY = startY - rect.top;
            var ghost = null;
            var overZone = null;

            function move(ev) {
                if (!ghost) {
                    if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) < 6) return;
                    ghost = tile.cloneNode(true);
                    ghost.className = "tier-tile tier-ghost";
                    ghost.style.width = rect.width + "px";
                    ghost.style.height = rect.height + "px";
                    document.body.appendChild(ghost);
                    tile.classList.add("tier-dragging");
                    showInfo(main, tile);
                }
                ghost.style.left = ev.clientX - offX + "px";
                ghost.style.top = ev.clientY - offY + "px";

                var under = document.elementFromPoint(ev.clientX, ev.clientY);
                var row = under && under.closest(".tier-row");
                var zone = under && (under.closest(".tier-drop") || (row && row.querySelector(".tier-drop")));
                if (zone && !main.contains(zone)) zone = null;

                if (overZone !== zone) {
                    if (overZone) overZone.classList.remove("tier-over");
                    if (zone) zone.classList.add("tier-over");
                    overZone = zone;
                }
                if (zone) {
                    var before = insertBefore(zone, tile, ev.clientX, ev.clientY);
                    if (tile.nextSibling !== before || tile.parentNode !== zone) zone.insertBefore(tile, before);
                }
            }

            function up() {
                document.removeEventListener("pointermove", move);
                document.removeEventListener("pointerup", up);
                document.removeEventListener("pointercancel", up);
                if (overZone) overZone.classList.remove("tier-over");

                if (!ghost) {
                    /* Plain click → fullscreen gallery for that entry */
                    openEntry(main, tile);
                    return;
                }
                ghost.remove();
                tile.classList.remove("tier-dragging");
                savePlacement(main);
            }

            document.addEventListener("pointermove", move);
            document.addEventListener("pointerup", up);
            document.addEventListener("pointercancel", up);
        });
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
        var data = (typeof NEOMS_SHOWCASE_DATA !== "undefined" && NEOMS_SHOWCASE_DATA[cat]) || [];
        var filled = data.filter(function (e) {
            return e.title || e.img || e.imgs;
        });

        if (!filled.length) {
            main.innerHTML = '<p class="rank-empty">// NO ENTRIES YET.</p>';
            return;
        }

        main.setAttribute("data-cat", cat);
        main._tierEntries = filled;
        main.innerHTML = buildBoard(cat, filled);
        wireBoard(main);
    };

    /* Shared with the Art Gallery window (windows/art-gallery) */
    window.NeomsShowcase = {
        lbOpen: lbOpen,
        resolveImgs: resolveImgs,
        renderArtist: renderArtist,
        thumbHTML: thumbHTML
    };
})();
