/* ============================================================
   CREATOR'S LOG (Director's Log)
   Exposes window.initCreatorsLog() to be called AFTER the
   Creator's Log window is injected into the DOM by
   window-manager.js (the window mounts the admin form, sort
   button, filter chips, and feed container with the IDs
   referenced below).

   Admin form requires a passcode; accepted entries are saved
   to localStorage and always render above the hardcoded ones.

   DATA SOURCES (in priority order):
     1. NEOMS_BLOG_DATA — live source of truth. Defined in
        creators-log-data.js, loaded before this script.
     2. blog-entries.html — legacy backup. Only fetched if
        NEOMS_BLOG_DATA is missing or empty. Same markup as
        the EXPORT-HTML output, so the two can stay in sync.

   PROMOTE-TO-LIVE FLOW (admin):
     1. Post entries via the admin form (saved in localStorage).
     2. Click "EXPORT" — paste-ready entries copied to clipboard.
        - Default copy format is JS array entries for
          creators-log-data.js (the live source).
        - Hold Shift while clicking for the legacy HTML format
          (for blog-entries.html backup).
     3. Paste into creators-log-data.js, save & redeploy.
     4. Click "CLEAR LOCAL" to wipe localStorage now those
        entries are permanently in the data file.
============================================================ */
(function () {
    var DIRECTOR_PASS = "neoms--2026";
    var STORAGE_KEY = "directors_log";
    var SORT_KEY = "directors_log_sort";
    var FILTER_KEY = "directors_log_filter";
    var ENTRIES_SRC = "Neoms~PrimeDrive/windows/creators-log/blog-entries.html";

    /* Module-level state so re-opens don't re-fetch */
    var hardcodedData = [];
    var hardcodedLoaded = false;
    var wired = false;

    var sortDir, activeFilter;
    var toggleBtn,
        form,
        cancelBtn,
        statusEl,
        feed,
        countEl,
        sortBtn,
        sortWrap,
        sortDrop,
        filterArea,
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
       LOAD HARDCODED ENTRIES
       Priority 1: NEOMS_BLOG_DATA (defined in creators-log-data.js).
       Priority 2: blog-entries.html (legacy, only if 1 is empty).
    ================================================================ */
    function loadHardcodedEntries(cb) {
        if (hardcodedLoaded) {
            cb && cb();
            return;
        }

        /* Priority 1 — JS data array */
        if (typeof NEOMS_BLOG_DATA !== "undefined" && Array.isArray(NEOMS_BLOG_DATA) && NEOMS_BLOG_DATA.length) {
            hardcodedData = NEOMS_BLOG_DATA.map(function (e) {
                return {
                    date: e.date || "",
                    tag: e.tag || "NOTE",
                    title: e.title || "",
                    body: e.body || "",
                    hardcoded: true
                };
            });
            hardcodedLoaded = true;
            cb && cb();
            return;
        }

        /* Priority 2 — legacy HTML backup */
        fetch(ENTRIES_SRC + "?nocache=" + Date.now())
            .then(function (r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.text();
            })
            .then(function (html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString("<div>" + html + "</div>", "text/html");
                doc.querySelectorAll(".Blog-Entry").forEach(function (el) {
                    var tagEl = el.querySelector(".Blog-Tag");
                    var dateEl = el.querySelector(".Blog-Date");
                    var titleEl = el.querySelector(".Blog-Entry-Title");
                    var bodyEl = el.querySelector(".Blog-Entry-Body");
                    hardcodedData.push({
                        date: dateEl ? dateEl.textContent.trim() : "",
                        tag: tagEl ? tagEl.textContent.trim() : "",
                        title: titleEl ? titleEl.textContent.trim() : "",
                        body: bodyEl ? bodyEl.textContent.trim() : "",
                        hardcoded: true
                    });
                });
                hardcodedLoaded = true;
                cb && cb();
            })
            .catch(function (err) {
                console.warn("CreatorsLog: NEOMS_BLOG_DATA empty and could not load blog-entries.html —", err.message);
                hardcodedLoaded = true;
                cb && cb();
            });
    }

    /* ================================================================
       HELPERS
    ================================================================ */
    function escapeHTML(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
                '<span class="Blog-Date">' + escapeHTML(e.date) + '</span>' +
                '<span class="Blog-Tag">' + escapeHTML(e.tag) + '</span>' +
            '</div>' +
            '<h3 class="Blog-Entry-Title">' + escapeHTML(e.title) + '</h3>' +
            '<p class="Blog-Entry-Body">' + escapeHTML(e.body) + '</p>';
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
            var label = sortDir === "desc" ? "NEW\u2192OLD" : "OLD\u2192NEW";
            if (activeFilter !== "ALL") label += " \u00b7 " + activeFilter;
            sortBtn.textContent = label + " \u25be";
        }
    }

    /* ================================================================
       RENDER FEED
    ================================================================ */
    function renderFeed() {
        var saved = readLocalEntries();

        var ordered;
        if (sortDir === "desc") {
            ordered = saved.concat(hardcodedData);
        } else {
            ordered = hardcodedData.slice().reverse().concat(saved.slice().reverse());
        }

        feed.innerHTML = "";
        var visible = 0;
        ordered.forEach(function (e) {
            if (activeFilter !== "ALL" && e.tag !== activeFilter) return;
            feed.appendChild(buildArticle(e));
            visible++;
        });

        if (visible === 0) {
            var empty = document.createElement("p");
            empty.className = "Blog-Empty";
            empty.textContent = "NO ENTRIES FOR THIS TAG.";
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
       EXPORT
       Default: JS array entries for creators-log-data.js (live source).
       Shift-click: legacy HTML for blog-entries.html (backup).
    ================================================================ */
    function buildExportJS(entries) {
        if (!entries.length) return "";
        var header =
            "// === PROMOTED FROM LOCALSTORAGE " + new Date().toISOString() +
            " (" + entries.length + " entries, newest first) ===\n" +
            "// Paste these inside the NEOMS_BLOG_DATA array.\n\n";
        var body = entries.map(function (e) {
            return (
                '  {\n' +
                '    date:  "' + String(e.date).replace(/"/g, '\\"') + '",\n' +
                '    tag:   "' + String(e.tag).replace(/"/g, '\\"') + '",\n' +
                '    title: "' + String(e.title).replace(/"/g, '\\"') + '",\n' +
                '    body:  "' + String(e.body).replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"\n' +
                '  },'
            );
        }).join("\n");
        return header + body + "\n";
    }

    function buildExportHTML(entries) {
        if (!entries.length) return "";
        var header =
            "<!-- === PROMOTED FROM LOCALSTORAGE " +
            new Date().toISOString() + " (" + entries.length + " entries, newest first) === -->\n\n";
        var body = entries.map(function (e) {
            return (
                '<article class="Blog-Entry">\n' +
                '    <div class="Blog-Entry-Meta">\n' +
                '        <span class="Blog-Date">' + escapeHTML(e.date) + '</span>\n' +
                '        <span class="Blog-Tag">' + escapeHTML(e.tag) + '</span>\n' +
                '    </div>\n' +
                '    <h3 class="Blog-Entry-Title">' + escapeHTML(e.title) + '</h3>\n' +
                '    <p class="Blog-Entry-Body">' + escapeHTML(e.body) + '</p>\n' +
                '</article>'
            );
        }).join("\n\n");
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

    function doExport(ev) {
        var saved = readLocalEntries();
        if (!saved.length) {
            flashStatus(exportBtn, "NO LOCAL ENTRIES", true);
            return;
        }
        var asHTML = ev && ev.shiftKey;
        var text = asHTML ? buildExportHTML(saved) : buildExportJS(saved);
        copyToClipboard(text).then(function () {
            flashStatus(exportBtn, asHTML ? "COPIED HTML" : "COPIED JS");
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
       BUILDER — moved from window-manager.js so all Creator's Log
       code lives in this folder.
    ================================================================ */
    window.buildPrime = function () {
        return (
            '<div class="Blog-Header">' +
              '<div class="Blog-Header-Left">' +
                '<span class="Blog-Header-Title">CREATOR\'S LOG</span>' +
                '<span class="Blog-Entry-Count" id="Blog-Entry-Count">0 ENTRIES</span>' +
              '</div>' +
              '<div class="Blog-Header-Right">' +
                '<div class="Blog-Sort-Wrap" id="Blog-Sort-Wrap">' +
                  '<button class="Blog-Sort-Btn" id="Blog-Sort-Btn">NEW\u2192OLD \u25be</button>' +
                  '<div class="Blog-Sort-Dropdown" id="Blog-Sort-Dropdown">' +
                    '<div class="Blog-Dropdown-Section-Title">SORT</div>' +
                    '<div class="Blog-Dropdown-Opt" data-sort="desc">NEW \u2192 OLD</div>' +
                    '<div class="Blog-Dropdown-Opt" data-sort="asc">OLD \u2192 NEW</div>' +
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
                '<button class="Blog-Export-Btn" id="Blog-Export-Btn" title="Default: copy entries as JS for creators-log-data.js. Shift+click: copy as HTML for blog-entries.html backup.">EXPORT</button>' +
                '<button class="Blog-Clear-Btn" id="Blog-Clear-Btn" title="Delete all local entries">CLEAR LOCAL</button>' +
                '<button class="Blog-Admin-Toggle" id="Blog-Admin-Toggle" title="New entry">+ NEW</button>' +
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
                '<textarea class="Blog-Admin-Input Blog-Admin-Textarea" id="Blog-Admin-Body" rows="3" placeholder="entry body"></textarea>' +
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
            '</div>'
        );
    };

    /* ================================================================
       PUBLIC INIT
    ================================================================ */
    window.initCreatorsLog = function () {
        toggleBtn = document.getElementById("Blog-Admin-Toggle");
        form = document.getElementById("Blog-Admin-Form");
        cancelBtn = document.getElementById("Blog-Admin-Cancel");
        statusEl = document.getElementById("Blog-Admin-Status");
        feed = document.getElementById("Blog-Feed");
        countEl = document.getElementById("Blog-Entry-Count");
        sortBtn = document.getElementById("Blog-Sort-Btn");
        sortWrap = document.getElementById("Blog-Sort-Wrap");
        sortDrop = document.getElementById("Blog-Sort-Dropdown");
        filterArea = document.getElementById("Blog-Filter-Chips");
        exportBtn = document.getElementById("Blog-Export-Btn");
        clearBtn = document.getElementById("Blog-Clear-Btn");

        if (!feed) return;

        loadPrefs();
        wireEvents();
        loadHardcodedEntries(renderFeed);
    };
})();
