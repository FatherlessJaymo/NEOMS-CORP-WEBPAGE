/* ============================================================
   CREATOR'S LOG (Director's Log)
   Exposes window.initCreatorsLog() to be called AFTER the
   Creator's Log window is injected into the DOM by
   window-manager.js (the window mounts the admin form, sort
   button, filter chips, and feed container with the IDs
   referenced below).

   Admin form requires a passcode; accepted entries are saved
   to localStorage and always render above the hardcoded ones.
   Hardcoded entries live in
     /Neoms~PrimeDrive/windows/creators-log/blog-entries.html
   and are fetched once per window-open.

   PROMOTE-TO-HARDCODED FLOW:
     1. Post entries via the admin form (saved in localStorage).
     2. Click "EXPORT HTML" — formatted <article> markup for every
        localStorage entry is copied to the clipboard.
     3. Paste into blog-entries.html on NeoCities and save.
     4. Click "CLEAR LOCAL" to wipe localStorage now those entries
        are permanently in the HTML file.
============================================================ */
(function () {
    var DIRECTOR_PASS = "neoms--2026";
    var STORAGE_KEY = "directors_log";
    var SORT_KEY = "directors_log_sort";
    var FILTER_KEY = "directors_log_filter";
    var ENTRIES_SRC = "/Neoms~PrimeDrive/windows/creators-log/blog-entries.html";

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
       FETCH HARDCODED ENTRIES
    ================================================================ */
    function loadHardcodedEntries(cb) {
        if (hardcodedLoaded) {
            cb && cb();
            return;
        }
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
                console.warn("CreatorsLog: could not load blog-entries.html —", err.message);
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
            '<span class="Blog-Date">' +
            escapeHTML(e.date) +
            "</span>" +
            '<span class="Blog-Tag">' +
            escapeHTML(e.tag) +
            "</span>" +
            "</div>" +
            '<h3 class="Blog-Entry-Title">' +
            escapeHTML(e.title) +
            "</h3>" +
            '<p class="Blog-Entry-Body">' +
            escapeHTML(e.body) +
            "</p>";
        return art;
    }

    /* ================================================================
       EXPORT — turn localStorage entries into paste-ready HTML.
       Output matches the exact markup used in blog-entries.html so
       it drops in cleanly and renders identically.
    ================================================================ */
    function readLocalEntries() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch (e) {
            return [];
        }
    }

    function buildExportHTML(entries) {
        if (!entries.length) return "";
        var header =
            "<!-- === PROMOTED FROM LOCALSTORAGE " +
            new Date().toISOString() +
            " (" +
            entries.length +
            " entries, newest first) === -->\n\n";
        var body = entries
            .map(function (e) {
                return (
                    '<article class="Blog-Entry">\n' +
                    '    <div class="Blog-Entry-Meta">\n' +
                    '        <span class="Blog-Date">' +
                    escapeHTML(e.date) +
                    "</span>\n" +
                    '        <span class="Blog-Tag">' +
                    escapeHTML(e.tag) +
                    "</span>\n" +
                    "    </div>\n" +
                    '    <h3 class="Blog-Entry-Title">' +
                    escapeHTML(e.title) +
                    "</h3>\n" +
                    '    <p class="Blog-Entry-Body">' +
                    escapeHTML(e.body) +
                    "</p>\n" +
                    "</article>"
                );
            })
            .join("\n\n");
        return header + body + "\n";
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        /* Fallback for old browsers */
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
        btn.classList.add("flashed");
        setTimeout(function () {
            btn.textContent = prev;
            btn.classList.remove("flashed");
            btn.classList.remove("error");
        }, 2200);
    }

    function doExport() {
        var entries = readLocalEntries();
        if (!entries.length) {
            flashStatus(exportBtn, "NO LOCAL ENTRIES", true);
            return;
        }
        var html = buildExportHTML(entries);
        copyToClipboard(html).then(
            function () {
                flashStatus(exportBtn, "COPIED " + entries.length + "!");
            },
            function () {
                flashStatus(exportBtn, "COPY FAILED", true);
            }
        );
    }

    function doClearLocal() {
        var entries = readLocalEntries();
        if (!entries.length) {
            flashStatus(clearBtn, "ALREADY CLEAR", true);
            return;
        }
        var ok = window.confirm(
            "Delete " +
                entries.length +
                " local entr" +
                (entries.length === 1 ? "y" : "ies") +
                "?\n\nOnly do this AFTER you've pasted the EXPORT HTML into " +
                "blog-entries.html on NeoCities — otherwise they'll be lost."
        );
        if (!ok) return;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {}
        flashStatus(clearBtn, "CLEARED");
        renderFeed();
    }

    /* ================================================================
       DROPDOWN
    ================================================================ */
    function openDropdown() {
        if (!sortDrop || !sortBtn) return;
        var r = sortBtn.getBoundingClientRect();
        var dropW = 220;
        sortDrop.style.top = r.bottom + 6 + "px";
        sortDrop.style.left = Math.max(4, r.right - dropW) + "px";
        sortDrop.classList.add("open");
        sortBtn.classList.add("active");
    }
    function closeDropdown() {
        if (!sortDrop) return;
        sortDrop.classList.remove("open");
        sortBtn && sortBtn.classList.remove("active");
    }
    function isDropdownOpen() {
        return sortDrop && sortDrop.classList.contains("open");
    }

    function syncDropdownUI() {
        if (sortDrop) {
            sortDrop.querySelectorAll(".Blog-Dropdown-Opt").forEach(function (opt) {
                opt.classList.toggle("active", opt.getAttribute("data-sort") === sortDir);
            });
        }
        if (filterArea) {
            filterArea.querySelectorAll(".Blog-Filter-Chip").forEach(function (chip) {
                chip.classList.toggle("active", chip.getAttribute("data-tag") === activeFilter);
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
