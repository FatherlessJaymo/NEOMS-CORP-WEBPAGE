/* ============================================================
   CREATOR'S LOG (Director's Log)
   Exposes window.buildPrime() (window HTML) and
   window.initCreatorsLog() (called by window-manager.js after
   the window is mounted).

   DATA
     NEOMS_BLOG_DATA in creators-log-data.js is the only source.
     Entries posted with the admin form are saved in THIS
     browser's localStorage and merged in; the feed is always
     sorted by date, so array order doesn't matter.

   ADMIN TOOLS (hidden from visitors)
     Toggle with Ctrl+Shift+L, or open the site with ?admin
     in the address (for phones). Remembered per browser.
     NOTE: the passcode is readable in this public file — it
     only keeps casual visitors out of the form. Posts never
     reach the live site; they stay in the browser that made
     them until you EXPORT and paste them into the data file.

   PROMOTE-TO-LIVE FLOW (admin):
     1. Post entries via the admin form (saved in localStorage).
     2. Click EXPORT — entries are copied as JS for the data file.
     3. Paste into creators-log-data.js, save & redeploy.
     4. Click CLEAR LOCAL. (Local entries whose title + tag
        already exist in the data file are hidden anyway.)
============================================================ */
(function () {
    var DIRECTOR_PASS = "neoms--2026";
    var STORAGE_KEY = "directors_log";
    var SORT_KEY = "directors_log_sort";
    var FILTER_KEY = "directors_log_filter";
    var ADMIN_KEY = "directors_log_admin";

    /* Module-level state so re-opens don't redo work */
    var hardcodedData = [];
    var hardcodedLoaded = false;
    var wired = false;

    var sortDir, activeFilter;
    var rootEl,
        toggleBtn,
        form,
        cancelBtn,
        statusEl,
        feed,
        countEl,
        sortBtn,
        sortWrap,
        sortDrop,
        exportBtn,
        clearBtn;

    /* ================================================================
       PERSISTED PREFS
    ================================================================ */
    function loadPrefs() {
        sortDir = "desc";
        try {
            var _s = localStorage.getItem(SORT_KEY);
            if (_s === "asc" || _s === "desc") sortDir = _s;
        } catch (e) {}
        activeFilter = "ALL";
        try {
            var _f = localStorage.getItem(FILTER_KEY);
            if (_f) activeFilter = _f;
        } catch (e) {}
    }
    function saveSortDir() {
        try {
            localStorage.setItem(SORT_KEY, sortDir);
        } catch (e) {}
    }
    function saveFilter() {
        try {
            localStorage.setItem(FILTER_KEY, activeFilter);
        } catch (e) {}
    }

    /* ================================================================
       ADMIN MODE
    ================================================================ */
    function isAdmin() {
        try {
            return localStorage.getItem(ADMIN_KEY) === "1";
        } catch (e) {
            return false;
        }
    }
    function setAdmin(on) {
        try {
            if (on) localStorage.setItem(ADMIN_KEY, "1");
            else localStorage.removeItem(ADMIN_KEY);
        } catch (e) {}
        applyAdmin();
    }
    function applyAdmin() {
        if (!rootEl) return;
        var on = isAdmin();
        rootEl.classList.toggle("Blog-Admin-On", on);
        if (!on && form) form.classList.remove("visible");
    }
    /* ?admin in the URL turns admin mode on (phones have no keyboard) */
    if (/[?&]admin\b/.test(location.search)) {
        try {
            localStorage.setItem(ADMIN_KEY, "1");
        } catch (e) {}
    }

    /* ================================================================
       LOAD HARDCODED ENTRIES (creators-log-data.js)
    ================================================================ */
    function loadHardcodedEntries() {
        if (hardcodedLoaded) return;
        var src = typeof NEOMS_BLOG_DATA !== "undefined" && Array.isArray(NEOMS_BLOG_DATA) ? NEOMS_BLOG_DATA : [];
        hardcodedData = src.map(function (e) {
            return {
                date: e.date || "",
                tag: e.tag || "NOTE",
                title: e.title || "",
                body: e.body || "",
                hardcoded: true
            };
        });
        hardcodedLoaded = true;
    }

    /* ================================================================
       HELPERS
    ================================================================ */
    function escapeHTML(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /* "2026.4.2", "2026-04-02", "2026/04/02" → 20260402 (0 if unreadable) */
    function dateKey(d) {
        var p = String(d || "").match(/\d+/g);
        if (!p || p.length < 3) return 0;
        return parseInt(p[0], 10) * 10000 + parseInt(p[1], 10) * 100 + parseInt(p[2], 10);
    }

    /* Escaped text → paragraphs, line breaks and clickable links.
       Escaping happens first, so no HTML from an entry can run. */
    function formatBody(text) {
        return String(text)
            .split(/\n\s*\n/)
            .map(function (para) {
                var html = escapeHTML(para.trim())
                    .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)\]])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
                    .replace(/\n/g, "<br/>");
                return '<p class="Blog-Entry-Body">' + html + "</p>";
            })
            .join("");
    }

    function updateCount(n) {
        if (!countEl) return;
        countEl.textContent = n + (n === 1 ? " ENTRY" : " ENTRIES");
    }

    function buildArticle(e) {
        var art = document.createElement("article");
        art.className = "Blog-Entry";
        art.setAttribute("data-tag", e.tag || "");
        art.innerHTML =
            '<div class="Blog-Entry-Meta">' +
            '<span class="Blog-Date">' + escapeHTML(e.date) + "</span>" +
            '<span class="Blog-Tag">' + escapeHTML(e.tag) + "</span>" +
            (e.hardcoded ? "" : '<span class="Blog-Local-Badge" title="Only saved in this browser">LOCAL</span>') +
            "</div>" +
            '<h3 class="Blog-Entry-Title">' + escapeHTML(e.title) + "</h3>" +
            formatBody(e.body);
        return art;
    }

    /* ================================================================
       LOCAL ENTRIES (admin form output)
    ================================================================ */
    function readLocalEntries() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch (e) {
            return [];
        }
    }

    /* Local entries already promoted into the data file (same title + tag) */
    function notPromoted(e) {
        var key = (e.title + "|" + e.tag).toLowerCase();
        return !hardcodedData.some(function (h) {
            return (h.title + "|" + h.tag).toLowerCase() === key;
        });
    }

    /* ================================================================
       DROPDOWN HELPERS
    ================================================================ */
    function isDropdownOpen() {
        return sortDrop && sortDrop.classList.contains("open");
    }
    function openDropdown() {
        if (!sortDrop || !sortBtn) return;
        var rect = sortBtn.getBoundingClientRect();
        sortDrop.style.top = rect.bottom + 4 + "px";
        sortDrop.style.right = window.innerWidth - rect.right + "px";
        sortDrop.classList.add("open");
        sortBtn.classList.add("active");
    }
    function closeDropdown() {
        if (!sortDrop) return;
        sortDrop.classList.remove("open");
        if (sortBtn) sortBtn.classList.remove("active");
    }

    function syncDropdownUI() {
        if (sortDrop) {
            sortDrop.querySelectorAll(".Blog-Dropdown-Opt").forEach(function (o) {
                o.classList.toggle("active", o.getAttribute("data-sort") === sortDir);
            });
            sortDrop.querySelectorAll(".Blog-Filter-Chip").forEach(function (c) {
                c.classList.toggle("active", c.getAttribute("data-tag") === activeFilter);
            });
        }
        if (sortBtn) {
            /* Plain text only — Press Start 2P has no arrow glyphs.
               The ▾ caret is drawn in CSS (.Blog-Sort-Btn::after). */
            var label = sortDir === "desc" ? "NEWEST" : "OLDEST";
            if (activeFilter !== "ALL") label += " · " + activeFilter;
            sortBtn.textContent = label;
        }
    }

    /* ================================================================
       RENDER FEED
    ================================================================ */
    function renderFeed() {
        var all = readLocalEntries()
            .filter(notPromoted)
            .concat(hardcodedData)
            .map(function (e, i) {
                return { e: e, k: dateKey(e.date), i: i };
            });

        /* Sort by date; same-day entries keep their list order */
        all.sort(function (a, b) {
            if (a.k !== b.k) return sortDir === "desc" ? b.k - a.k : a.k - b.k;
            return a.i - b.i;
        });

        feed.innerHTML = "";
        var visible = 0;
        all.forEach(function (x) {
            if (activeFilter !== "ALL" && x.e.tag !== activeFilter) return;
            feed.appendChild(buildArticle(x.e));
            visible++;
        });

        if (visible === 0) {
            var empty = document.createElement("p");
            empty.className = "Blog-Empty";
            empty.textContent = activeFilter === "ALL" ? "NO ENTRIES YET." : "NO " + activeFilter + " ENTRIES YET.";
            feed.appendChild(empty);
        }

        updateCount(visible);
        syncDropdownUI();
    }

    function addEntry(e) {
        try {
            var saved = readLocalEntries();
            saved.unshift(e);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
        } catch (err) {}
        renderFeed();
    }

    /* ================================================================
       EXPORT — JS entries for creators-log-data.js
    ================================================================ */
    function buildExportJS(entries) {
        if (!entries.length) return "";
        var header =
            "// === PROMOTED FROM LOCALSTORAGE " + new Date().toISOString() +
            " (" + entries.length + " entries) ===\n" +
            "// Paste these inside the NEOMS_BLOG_DATA array.\n\n";
        var body = entries.map(function (e) {
            return (
                "  {\n" +
                '    date:  "' + String(e.date).replace(/"/g, '\\"') + '",\n' +
                '    tag:   "' + String(e.tag).replace(/"/g, '\\"') + '",\n' +
                '    title: "' + String(e.title).replace(/"/g, '\\"') + '",\n' +
                '    body:  "' + String(e.body).replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"\n' +
                "  },"
            );
        }).join("\n");
        return header + body + "\n";
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        return new Promise(function (resolve, reject) {
            try {
                var ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    function flashStatus(btn, msg, isError) {
        var prev = btn.textContent;
        btn.textContent = msg;
        btn.classList.toggle("error", !!isError);
        btn.classList.toggle("flashed", !isError);
        setTimeout(function () {
            btn.textContent = prev;
            btn.classList.remove("error", "flashed");
        }, 1800);
    }

    function doExport() {
        var saved = readLocalEntries();
        if (!saved.length) {
            flashStatus(exportBtn, "NO LOCAL ENTRIES", true);
            return;
        }
        copyToClipboard(buildExportJS(saved)).then(function () {
            flashStatus(exportBtn, "COPIED");
        }).catch(function () {
            flashStatus(exportBtn, "COPY FAILED", true);
        });
    }

    function doClearLocal() {
        var saved = readLocalEntries();
        if (!saved.length) {
            flashStatus(clearBtn, "NOTHING TO CLEAR", true);
            return;
        }
        if (!confirm("Delete " + saved.length + " local entr" + (saved.length === 1 ? "y" : "ies") + "? (Make sure you've pasted them into creators-log-data.js first.)")) return;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        flashStatus(clearBtn, "CLEARED");
        renderFeed();
    }

    /* ================================================================
       WIRE EVENTS
    ================================================================ */
    function wireEvents() {
        if (sortBtn) {
            sortBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                isDropdownOpen() ? closeDropdown() : openDropdown();
            });
        }

        if (sortDrop) {
            sortDrop.addEventListener("click", function (e) {
                e.stopPropagation();
                var opt = e.target.closest(".Blog-Dropdown-Opt");
                if (opt) {
                    sortDir = opt.getAttribute("data-sort");
                    saveSortDir();
                    renderFeed();
                    return;
                }
                var chip = e.target.closest(".Blog-Filter-Chip");
                if (chip) {
                    activeFilter = chip.getAttribute("data-tag");
                    saveFilter();
                    renderFeed();
                }
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener("click", function () {
                form.classList.toggle("visible");
                if (form.classList.contains("visible")) {
                    var dateEl = document.getElementById("Blog-Admin-Date");
                    if (dateEl && !dateEl.value) {
                        var d = new Date();
                        dateEl.value = d.getFullYear() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + String(d.getDate()).padStart(2, "0");
                    }
                    var passEl = document.getElementById("Blog-Admin-Pass");
                    if (passEl) passEl.focus();
                }
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener("click", function () {
                form.classList.remove("visible");
                form.reset();
                statusEl.textContent = "";
                statusEl.className = "Blog-Admin-Status";
            });
        }

        if (form) {
            form.addEventListener("submit", function (ev) {
                ev.preventDefault();
                var pass = document.getElementById("Blog-Admin-Pass").value.trim();
                var date = document.getElementById("Blog-Admin-Date").value.trim();
                var tag = document.getElementById("Blog-Admin-Tag").value;
                var title = document.getElementById("Blog-Admin-Title").value.trim();
                var body = document.getElementById("Blog-Admin-Body").value.trim();

                if (pass !== DIRECTOR_PASS) {
                    statusEl.textContent = "INCORRECT PASSCODE";
                    statusEl.className = "Blog-Admin-Status error";
                    return;
                }
                if (!date || !title || !body) {
                    statusEl.textContent = "ALL FIELDS REQUIRED";
                    statusEl.className = "Blog-Admin-Status error";
                    return;
                }
                if (!dateKey(date)) {
                    statusEl.textContent = "DATE MUST BE YYYY.MM.DD";
                    statusEl.className = "Blog-Admin-Status error";
                    return;
                }
                addEntry({ date: date, tag: tag, title: title, body: body });
                form.reset();
                form.classList.remove("visible");
                statusEl.textContent = "";
                statusEl.className = "Blog-Admin-Status";
            });
        }

        if (exportBtn) exportBtn.addEventListener("click", doExport);
        if (clearBtn) clearBtn.addEventListener("click", doClearLocal);

        /* Global listeners — only attach once per page load */
        if (!wired) {
            document.addEventListener("click", function (e) {
                if (sortWrap && !sortWrap.contains(e.target)) closeDropdown();
            });
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape") closeDropdown();
                /* Ctrl+Shift+L — show / hide the admin tools */
                if (e.ctrlKey && e.shiftKey && (e.key === "L" || e.key === "l")) {
                    e.preventDefault();
                    var on = !isAdmin();
                    setAdmin(on);
                    if (typeof toast === "function") toast(on ? "CREATOR'S LOG: ADMIN ON" : "CREATOR'S LOG: ADMIN OFF");
                }
            });
            window.addEventListener(
                "scroll",
                function () {
                    if (isDropdownOpen()) openDropdown();
                },
                { passive: true }
            );
            window.addEventListener("resize", function () {
                if (isDropdownOpen()) openDropdown();
            });
            wired = true;
        }
    }

    /* ================================================================
       BUILDER — window HTML
    ================================================================ */
    window.buildPrime = function () {
        return (
            '<div class="Blog-Root" id="Blog-Root">' +
            '<div class="Blog-Header">' +
              '<div class="Blog-Header-Left">' +
                '<span class="Blog-Header-Title">CREATOR\'S LOG</span>' +
                '<span class="Blog-Entry-Count" id="Blog-Entry-Count">0 ENTRIES</span>' +
              '</div>' +
              '<div class="Blog-Header-Right">' +
                '<div class="Blog-Sort-Wrap" id="Blog-Sort-Wrap">' +
                  '<button class="Blog-Sort-Btn" id="Blog-Sort-Btn" title="Sort and filter">NEWEST</button>' +
                  '<div class="Blog-Sort-Dropdown" id="Blog-Sort-Dropdown">' +
                    '<div class="Blog-Dropdown-Section-Title">SORT</div>' +
                    '<div class="Blog-Dropdown-Opt" data-sort="desc">NEWEST FIRST</div>' +
                    '<div class="Blog-Dropdown-Opt" data-sort="asc">OLDEST FIRST</div>' +
                    '<div class="Blog-Dropdown-Section-Title">FILTER BY TAG</div>' +
                    '<div class="Blog-Filter-Chips" id="Blog-Filter-Chips">' +
                      '<button class="Blog-Filter-Chip active" data-tag="ALL">ALL</button>' +
                      '<button class="Blog-Filter-Chip" data-tag="UPDATE">UPDATE</button>' +
                      '<button class="Blog-Filter-Chip" data-tag="NEWS">NEWS</button>' +
                      '<button class="Blog-Filter-Chip" data-tag="PATCH">PATCH</button>' +
                      '<button class="Blog-Filter-Chip" data-tag="NOTE">NOTE</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                /* Admin-only — hidden unless .Blog-Admin-On is on #Blog-Root */
                '<div class="Blog-Admin-Tools">' +
                  '<button class="Blog-Export-Btn" id="Blog-Export-Btn" title="Copy local entries as JS for creators-log-data.js">EXPORT</button>' +
                  '<button class="Blog-Clear-Btn" id="Blog-Clear-Btn" title="Delete all local entries">CLEAR LOCAL</button>' +
                  '<button class="Blog-Admin-Toggle" id="Blog-Admin-Toggle" title="New entry">+ NEW</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<form class="Blog-Admin-Form" id="Blog-Admin-Form" autocomplete="off">' +
              '<div class="Blog-Admin-Row">' +
                '<label class="Blog-Admin-Label" for="Blog-Admin-Pass">PASSCODE</label>' +
                '<input class="Blog-Admin-Input" type="password" id="Blog-Admin-Pass" placeholder="director\'s passcode"/>' +
              '</div>' +
              '<div class="Blog-Admin-Row Blog-Admin-Row-Split">' +
                '<div>' +
                  '<label class="Blog-Admin-Label" for="Blog-Admin-Date">DATE</label>' +
                  '<input class="Blog-Admin-Input" type="text" id="Blog-Admin-Date" placeholder="YYYY.MM.DD"/>' +
                '</div>' +
                '<div>' +
                  '<label class="Blog-Admin-Label" for="Blog-Admin-Tag">TAG</label>' +
                  '<select class="Blog-Admin-Input" id="Blog-Admin-Tag">' +
                    '<option value="UPDATE">UPDATE</option>' +
                    '<option value="NEWS">NEWS</option>' +
                    '<option value="PATCH">PATCH</option>' +
                    '<option value="NOTE">NOTE</option>' +
                  '</select>' +
                '</div>' +
              '</div>' +
              '<div class="Blog-Admin-Row">' +
                '<label class="Blog-Admin-Label" for="Blog-Admin-Title">TITLE</label>' +
                '<input class="Blog-Admin-Input" type="text" id="Blog-Admin-Title" placeholder="entry title"/>' +
              '</div>' +
              '<div class="Blog-Admin-Row">' +
                '<label class="Blog-Admin-Label" for="Blog-Admin-Body">BODY</label>' +
                '<textarea class="Blog-Admin-Input Blog-Admin-Textarea" id="Blog-Admin-Body" rows="3" placeholder="entry body (blank line = new paragraph)"></textarea>' +
              '</div>' +
              '<div class="Blog-Admin-Footer">' +
                '<span class="Blog-Admin-Status" id="Blog-Admin-Status"></span>' +
                '<div class="Blog-Admin-Btns">' +
                  '<button type="button" class="Blog-Admin-Cancel" id="Blog-Admin-Cancel">CANCEL</button>' +
                  '<button type="submit" class="Blog-Admin-Submit">POST</button>' +
                '</div>' +
              '</div>' +
            '</form>' +
            '<div id="Blog-Feed">' +
              '<p class="Blog-Empty">Loading entries...</p>' +
            '</div>' +
            '</div>'
        );
    };

    /* ================================================================
       PUBLIC INIT
    ================================================================ */
    window.initCreatorsLog = function () {
        rootEl = document.getElementById("Blog-Root");
        toggleBtn = document.getElementById("Blog-Admin-Toggle");
        form = document.getElementById("Blog-Admin-Form");
        cancelBtn = document.getElementById("Blog-Admin-Cancel");
        statusEl = document.getElementById("Blog-Admin-Status");
        feed = document.getElementById("Blog-Feed");
        countEl = document.getElementById("Blog-Entry-Count");
        sortBtn = document.getElementById("Blog-Sort-Btn");
        sortWrap = document.getElementById("Blog-Sort-Wrap");
        sortDrop = document.getElementById("Blog-Sort-Dropdown");
        exportBtn = document.getElementById("Blog-Export-Btn");
        clearBtn = document.getElementById("Blog-Clear-Btn");

        if (!feed) return;

        loadPrefs();
        applyAdmin();
        wireEvents();
        loadHardcodedEntries();
        renderFeed();
    };
})();
