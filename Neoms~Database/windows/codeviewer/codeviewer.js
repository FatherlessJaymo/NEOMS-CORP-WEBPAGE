/* ============================================================
   NEOMS — SOURCE CODE VIEWER
   Neoms~Database/windows/codeviewer/codeviewer.js

   CLR RULE: Source code files max CLR-3.
   CL-4+ personnel cannot set source file access to 4 or 5.
   Files are accessible to any user whose clearance >= file.clr.
============================================================ */
(function () {
  const allFiles = (typeof CV_FILES !== "undefined" && Array.isArray(CV_FILES)) ? CV_FILES : [];
  const clr = typeof userClearance !== "undefined" ? userClearance : 1;

  /* Filter: show files up to user's clearance; source files cap at CLR 3 */
  const SOURCE_FILES = allFiles.map(f => ({
    ...f,
    clr: Math.min(f.clr || 1, 3)      /* enforce max CLR-3 for all source files */
  }));

  /* ── UI elements ────────────────────────────────────────── */
  var fileList  = document.getElementById("cv-file-list");
  var codeEl    = document.getElementById("cv-code-display");
  var filepath  = document.getElementById("cv-filepath");
  var linecount = document.getElementById("cv-linecount");
  var copyBtn   = document.getElementById("cv-copy-btn");

  if (!fileList || !codeEl) return;

  if (SOURCE_FILES.length === 0) {
    codeEl.textContent = "// No source files configured.\n// CV_FILES not defined.";
    return;
  }

  var currentRaw = "";
  var firstAccessible = null;

  /* ── Populate sidebar ────────────────────────────────────── */
  SOURCE_FILES.forEach(function (file, idx) {
    const accessible = clr >= (file.clr || 1);
    var btn = document.createElement("button");
    btn.className = "cv-file-btn" + (accessible ? "" : " cv-locked");
    btn.style.cssText = accessible ? "" : "opacity:0.4;cursor:not-allowed;";
    btn.innerHTML =
      (file.dir ? '<span class="cv-dir">' + escHtml(file.dir) + '</span>' : '') +
      (accessible ? "" : '<span style="color:#553333;font-size:9px;display:block;">\u{1F512} CL-' + file.clr + ' REQUIRED</span>') +
      escHtml(file.label) +
      (file.desc ? '<span class="cv-fdesc">' + escHtml(file.desc) + '</span>' : '');
    btn.title = accessible ? (file.path || file.label) : "Clearance " + file.clr + " required";
    btn.setAttribute("data-idx", idx);

    btn.addEventListener("click", function () {
      if (!accessible) {
        codeEl.textContent = "// ACCESS DENIED\n// This file requires CL-" + file.clr + " clearance.\n// Your current clearance: CL-" + clr + "\n// Contact PRIME DIRECTOR to request elevated access.";
        if (typeof hljs !== "undefined") {
          codeEl.removeAttribute("data-highlighted");
          hljs.highlightElement(codeEl);
        }
        if (filepath) filepath.textContent = "[RESTRICTED] " + (file.path || file.label);
        if (linecount) linecount.textContent = "";
        document.querySelectorAll(".cv-file-btn").forEach(b => b.classList.remove("cv-active"));
        btn.classList.add("cv-active");
        return;
      }
      document.querySelectorAll(".cv-file-btn").forEach(b => b.classList.remove("cv-active"));
      btn.classList.add("cv-active");
      loadFile(file);
    });

    fileList.appendChild(btn);
    if (accessible && !firstAccessible) firstAccessible = btn;
  });

  /* Select first accessible file */
  if (firstAccessible) firstAccessible.click();

  /* ── Copy button ─────────────────────────────────────────── */
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (!currentRaw) return;
      var orig = copyBtn.textContent;
      navigator.clipboard
        .writeText(currentRaw)
        .then(function () {
          copyBtn.textContent = "COPIED";
          setTimeout(function () { copyBtn.textContent = orig; }, 2000);
        })
        .catch(function () {
          copyBtn.textContent = "FAILED";
          setTimeout(function () { copyBtn.textContent = orig; }, 2000);
        });
    });
  }

  /* ── Load file ───────────────────────────────────────────── */
  function loadFile(file) {
    var displayPath = file.path || file.label;
    if (filepath) filepath.textContent = displayPath;
    if (linecount) linecount.textContent = "";
    codeEl.textContent = "// Loading " + displayPath + "...";
    if (typeof hljs !== "undefined") hljs.highlightElement(codeEl);

    fetch(displayPath)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (text) {
        currentRaw = text;
        if (linecount) linecount.textContent = text.split("\n").length + " lines";
        codeEl.textContent = text;
        if (typeof hljs !== "undefined") {
          codeEl.removeAttribute("data-highlighted");
          hljs.highlightElement(codeEl);
        }
      })
      .catch(function (err) {
        currentRaw = "";
        codeEl.textContent = "// Failed to load: " + err.message;
        if (linecount) linecount.textContent = "";
        if (typeof hljs !== "undefined") {
          codeEl.removeAttribute("data-highlighted");
          hljs.highlightElement(codeEl);
        }
      });
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
