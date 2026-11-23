/* ============================================================
   NEOMS — ENTITY CREATOR WINDOW
   Neoms~Database/windows/entitycreator/entitycreator.js
   Globals available: ENTITIES, personnel, SITES, DEPTS, CLS_LABELS,
   sessionpersonnel, userClearance, openWin, closeWin
   ============================================================ */

/* ── Populate site dropdown from live SITES data ─────────── */
var siteSelect = document.getElementById("ec-site");
if (siteSelect && SITES && SITES.length) {
  SITES.forEach(function (s) {
    var opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name + " (" + s.loc + ")";
    siteSelect.appendChild(opt);
  });
}

/* ── Steps (guided tabs) ─────────────────────────────────── */
var tabBar = document.getElementById("ec-tabs");

function ecGoTo(target) {
  if (!tabBar) return;
  tabBar.querySelectorAll(".ec-tab").forEach(function (t) {
    var on = t.dataset.tab === target;
    t.classList.toggle("ec-tab--active", on);
    t.setAttribute("aria-selected", String(on));
  });
  document.querySelectorAll(".ec-panel").forEach(function (p) {
    p.classList.toggle("ec-hidden", p.id !== "ec-panel-" + target);
  });
  var body = document.querySelector(".ec-body");
  if (body) body.scrollTop = 0;
  if (target === "review") ecRenderReview();
  ecRenderPreview();
}

if (tabBar) {
  tabBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".ec-tab");
    if (btn) ecGoTo(btn.dataset.tab);
  });
}
/* Back / Next buttons at the foot of each step */
document.querySelector(".ec-body").addEventListener("click", function (e) {
  var nav = e.target.closest("[data-goto]");
  if (nav) ecGoTo(nav.dataset.goto);
});

/* ── Protocol list ───────────────────────────────────────── */
var protocolList = document.getElementById("ec-protocols-list");
var protocolCount = 0;

function addProtocol() {
  protocolCount++;
  var idx = protocolCount;

  if (protocolList.querySelector(".ec-empty-msg")) {
    protocolList.innerHTML = "";
  }

  var card = document.createElement("div");
  card.className = "ec-entry-card";
  card.id = "ec-proto-" + idx;
  card.innerHTML =
    '<div class="ec-entry-header">' +
    '<span class="ec-entry-num">PROTOCOL #' +
    idx +
    "</span>" +
    '<button class="ec-entry-remove" onclick="removeEntry(\'ec-proto-' +
    idx +
    "')\">&#215; REMOVE</button>" +
    "</div>" +
    '<div class="ec-entry-body">' +
    '<div class="ec-field">' +
    '<label class="ec-label">TYPE</label>' +
    '<select class="ec-input" id="ec-proto-type-' +
    idx +
    '">' +
    '<option value="CONTAINMENT">CONTAINMENT</option>' +
    '<option value="INTERACTION">INTERACTION</option>' +
    '<option value="BREACH">BREACH</option>' +
    '<option value="TERMINATION">TERMINATION</option>' +
    "</select>" +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">CLEARANCE LEVEL</label>' +
    '<select class="ec-input" id="ec-proto-clr-' +
    idx +
    '">' +
    '<option value="1">CL-1</option>' +
    '<option value="2">CL-2</option>' +
    '<option value="3">CL-3</option>' +
    '<option value="4">CL-4</option>' +
    '<option value="5">CL-5</option>' +
    "</select>" +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">DESCRIPTION</label>' +
    '<textarea class="ec-input ec-ta" id="ec-proto-desc-' +
    idx +
    '" style="height:80px;" placeholder="Protocol procedure…"></textarea>' +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">EQUIPMENT</label>' +
    '<input class="ec-input" id="ec-proto-equip-' +
    idx +
    '" type="text" placeholder="e.g. Anomaly-grade observation array, soul-coherence monitors">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">DURATION (mins, blank = null)</label>' +
    '<input class="ec-input" id="ec-proto-dur-' +
    idx +
    '" type="number" min="1" placeholder="null">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">personnel REQUIRED</label>' +
    '<input class="ec-input" id="ec-proto-personnel-' +
    idx +
    '" type="text" placeholder="e.g. 5 or ALL FACILITY UNITS">' +
    "</div>" +
    "</div>";

  protocolList.appendChild(card);
}

/* ── Report list ─────────────────────────────────────────── */
var reportList = document.getElementById("ec-reports-list");
var reportCount = 0;

function addReport() {
  reportCount++;
  var idx = reportCount;

  if (reportList.querySelector(".ec-empty-msg")) {
    reportList.innerHTML = "";
  }

  var card = document.createElement("div");
  card.className = "ec-entry-card";
  card.id = "ec-report-" + idx;
  card.innerHTML =
    '<div class="ec-entry-header">' +
    '<span class="ec-entry-num">REPORT #' +
    idx +
    "</span>" +
    '<button class="ec-entry-remove" onclick="removeEntry(\'ec-report-' +
    idx +
    "')\">&#215; REMOVE</button>" +
    "</div>" +
    '<div class="ec-entry-body">' +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">TITLE</label>' +
    '<input class="ec-input" id="ec-report-title-' +
    idx +
    '" type="text" placeholder="Report title…">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">SUBTITLE</label>' +
    '<input class="ec-input" id="ec-report-sub-' +
    idx +
    '" type="text" placeholder="e.g. Incident">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">DATE</label>' +
    '<input class="ec-input" id="ec-report-date-' +
    idx +
    '" type="text" placeholder="20██-██-██">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">TYPE</label>' +
    '<select class="ec-input" id="ec-report-type-' +
    idx +
    '">' +
    '<option value="INCIDENT">INCIDENT</option>' +
    '<option value="BREACH">BREACH</option>' +
    '<option value="OBSERVATION">OBSERVATION</option>' +
    '<option value="SIGHTING">SIGHTING</option>' +
    "</select>" +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">CLEARANCE</label>' +
    '<select class="ec-input" id="ec-report-clr-' +
    idx +
    '">' +
    '<option value="1">CL-1</option>' +
    '<option value="2">CL-2</option>' +
    '<option value="3">CL-3</option>' +
    '<option value="4">CL-4</option>' +
    '<option value="5">CL-5</option>' +
    "</select>" +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">SUMMARY</label>' +
    '<textarea class="ec-input ec-ta" id="ec-report-summary-' +
    idx +
    '" style="height:80px;" placeholder="Report summary…"></textarea>' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">LOCATION (optional)</label>' +
    '<input class="ec-input" id="ec-report-location-' +
    idx +
    '" type="text" placeholder="e.g. Site-62656, Research Wing C">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">PERSONNEL (optional)</label>' +
    '<input class="ec-input" id="ec-report-personnel-' +
    idx +
    '" type="text" placeholder="e.g. 3 research staff (exposed)">' +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">FOREWORD (optional)</label>' +
    '<textarea class="ec-input ec-ta" id="ec-report-foreword-' +
    idx +
    '" style="height:50px;" placeholder="Context before the log…"></textarea>' +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">LOG (optional — one line per entry)</label>' +
    '<textarea class="ec-input ec-ta ec-log-ta" id="ec-report-log-' +
    idx +
    '" style="height:110px;" placeholder="[14:02] Emulation boots on quarantined terminal.\n[14:06] REWRITE: Hi! Who\'s watching?\n████: [No response, per protocol]\nNote: Entity remained in default state. — S-1003"></textarea>' +
    "</div>" +
    '<div class="ec-field ec-span2">' +
    '<label class="ec-label">CLOSING STATEMENT (optional)</label>' +
    '<textarea class="ec-input ec-ta" id="ec-report-notes-' +
    idx +
    '" style="height:50px;" placeholder="Outcome, follow-up actions…"></textarea>' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">FILE REFERENCE (optional)</label>' +
    '<input class="ec-input" id="ec-report-file-' +
    idx +
    '" type="text" placeholder="NMS-XXX-TYPE-001.pdf">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">WITH (personnel IDs — filed by Nova)</label>' +
    '<input class="ec-input" id="ec-report-author-' +
    idx +
    '" type="text" placeholder="e.g. 1003, 2004">' +
    "</div>" +
    "</div>";

  reportList.appendChild(card);
}

/* ── Remove any entry card ───────────────────────────────── */
function removeEntry(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}
window.removeEntry = removeEntry;

/* Wire add buttons */
var addProtoBtn = document.getElementById("ec-add-protocol");
if (addProtoBtn) addProtoBtn.addEventListener("click", addProtocol);

var addReportBtn = document.getElementById("ec-add-report");
if (addReportBtn) addReportBtn.addEventListener("click", addReport);

/* ── Helper: get value or null ───────────────────────────── */
function gv(id) {
  var el = document.getElementById(id);
  if (!el) return null;
  var v = el.value.trim();
  return v === "" ? null : v;
}
function gn(id) {
  var v = gv(id);
  return v === null ? null : parseInt(v, 10) || null;
}

/* ── Collect protocols ───────────────────────────────────── */
function collectProtocols() {
  var results = [];
  document
    .querySelectorAll(
      "[id^='ec-proto-'][id$='-1'],[id^='ec-proto-'][id$='-2'],[id^='ec-proto-'][id$='-3'],[id^='ec-proto-'][id$='-4'],[id^='ec-proto-'][id$='-5'],[id^='ec-proto-'][id$='-6'],[id^='ec-proto-'][id$='-7'],[id^='ec-proto-'][id$='-8']"
    )
    .forEach(function () {});

  for (var i = 1; i <= protocolCount; i++) {
    if (!document.getElementById("ec-proto-" + i)) continue;
    var dur = gv("ec-proto-dur-" + i);
    var st = gv("ec-proto-personnel-" + i);
    var stVal = st ? (isNaN(Number(st)) ? st : Number(st)) : null;
    results.push({
      type: gv("ec-proto-type-" + i) || "CONTAINMENT",
      clr: parseInt(gv("ec-proto-clr-" + i) || "1", 10),
      desc: gv("ec-proto-desc-" + i) || "",
      equipment: gv("ec-proto-equip-" + i),
      duration: dur ? parseInt(dur, 10) : null,
      personnel: stVal
    });
  }
  return results;
}

/* ── Parse the LOG textarea into entries ─────────────────────
     "[14:06] REWRITE: Hi!" → { t, who, text }
     "Note: …"              → { note }
     anything else          → plain string line                */
function parseLog(raw) {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean)
    .map(function (line) {
      if (/^note:/i.test(line)) return { note: line };
      var entry = {};
      var ts = line.match(/^\[([^\]]+)\]\s*(.*)$/);
      if (ts) {
        entry.t = ts[1];
        line = ts[2];
      }
      var who = line.match(/^([^:\[]{1,30}):\s+(.+)$/);
      if (who) {
        entry.who = who[1].trim();
        line = who[2];
      }
      if (!entry.t && !entry.who) return line;
      entry.text = line;
      return entry;
    });
}

/* ── Collect reports ─────────────────────────────────────── */
function collectReports() {
  var results = [];
  for (var i = 1; i <= reportCount; i++) {
    if (!document.getElementById("ec-report-" + i)) continue;
    var fileVal = gv("ec-report-file-" + i);
    /* "With" box: any personnel IDs, comma/space separated → contributors */
    var withIds = (gv("ec-report-author-" + i) || "")
      .split(/[\s,]+/)
      .map(function (s) {
        return parseInt(s.replace(/^S-/i, ""), 10);
      })
      .filter(function (n) {
        return n > 0;
      });
    var entry = {
      title: gv("ec-report-title-" + i) || "",
      subtitle: gv("ec-report-sub-" + i) || "",
      date: gv("ec-report-date-" + i) || "",
      type: gv("ec-report-type-" + i) || "INCIDENT",
      clr: parseInt(gv("ec-report-clr-" + i) || "1", 10),
      summary: gv("ec-report-summary-" + i) || ""
    };
    ["location", "personnel", "foreword"].forEach(function (k) {
      var v = gv("ec-report-" + k + "-" + i);
      if (v) entry[k] = v;
    });
    var log = parseLog(gv("ec-report-log-" + i));
    if (log.length) entry.log = log;
    var notesVal = gv("ec-report-notes-" + i);
    if (notesVal) entry.notes = notesVal;
    if (fileVal) entry.file = fileVal;
    if (withIds.length) entry.contributors = withIds;
    results.push(entry);
  }
  return results;
}

/* ── JS object pretty-printer ────────────────────────────────
   Recursive, so nested arrays (e.g. a report's log lines) get
   one entry per line instead of being crammed onto one.     */
function formatValue(v, indent) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  var inner = indent + "  ";
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    return "[\n" + v.map(function (item) {
      return inner + formatValue(item, inner);
    }).join(",\n") + "\n" + indent + "]";
  }
  var keys = Object.keys(v);
  if (keys.length === 0) return "{}";
  return "{\n" + keys.map(function (k) {
    return inner + k + ": " + formatValue(v[k], inner);
  }).join(",\n") + "\n" + indent + "}";
}

function stringify(obj, indent) {
  indent = indent || "    ";
  return Object.keys(obj).map(function (k) {
    return indent + k + ": " + formatValue(obj[k], indent);
  }).join(",\n");
}

/* ── Build the entity object from the form ───────────────────
   Used by the live preview, the review step, the code output and
   the submission. Links (not device pictures) go into img/bioImages. */
var EC_GALLERY = [1, 2, 3];

function ecBuildEntity() {
  var siteVal = gv("ec-site");
  var obj = {
    id: gn("ec-id"),
    clr: parseInt(gv("ec-clr") || "1", 10),
    site: siteVal ? parseInt(siteVal, 10) : null,
    name: gv("ec-name") || "",
    cls: gv("ec-cls") || "AR",
    ps: gv("ec-ps") || "",
    status: gv("ec-status") || "CONTAINED",
    disc: gv("ec-disc") || "20██-██-██",
    glyph: gv("ec-glyph") || "○",
    img: gv("ec-img") || null
  };
  if (gv("ec-imgcap")) obj.imgCaption = gv("ec-imgcap");
  var gallery = EC_GALLERY.map(function (n) {
    return { src: gv("ec-gal-src-" + n), caption: gv("ec-gal-cap-" + n) || "" };
  }).filter(function (g) { return g.src; });
  if (gallery.length) obj.bioImages = gallery;
  obj.desc = gv("ec-desc") || "";
  obj.aprop = gv("ec-aprop") || "";
  obj.phys = gv("ec-phys") || "";
  obj.dims = gv("ec-dims") || "";
  obj.sentient = gv("ec-sentient") || "U";
  obj.hostile = gv("ec-hostile") || "U";
  obj.safety = gv("ec-safety") || "HAZARDOUS";
  obj.discoveredBy = gn("ec-discoveredby");
  obj.contributors = [];
  obj.sources = [];
  obj.protocols = collectProtocols();
  obj.reports = collectReports();
  return obj;
}

/* Blocking problems (errors) and gentle nudges (warnings) */
function ecValidate() {
  var errors = [], warnings = [];
  var id = gn("ec-id");
  var taken = (typeof ENTITIES !== "undefined" ? ENTITIES : []).some(function (e) { return e.id === id; });
  if (!gv("ec-name")) errors.push({ msg: "Give the entity a name.", step: "basics", field: "ec-name" });
  if (!id) errors.push({ msg: "Choose an entity number.", step: "basics", field: "ec-id" });
  else if (taken) errors.push({ msg: "E-" + String(id).padStart(4, "0") + " is already in the archive — pick another number.", step: "basics", field: "ec-id" });
  if (!gv("ec-desc")) errors.push({ msg: "Write a description.", step: "desc", field: "ec-desc" });
  if (!gv("ec-img")) {
    warnings.push({
      msg: ecLocalImgs.main ? "Your profile picture is only on your device — add its link so it's included." : "No profile picture link yet (recommended).",
      step: "pictures", field: "ec-img"
    });
  }
  EC_GALLERY.forEach(function (n) {
    if (ecLocalImgs["gal" + n] && !gv("ec-gal-src-" + n)) {
      warnings.push({ msg: "Gallery picture " + n + " is only on your device — add its link.", step: "pictures", field: "ec-gal-src-" + n });
    }
  });
  ["ec-img"].concat(EC_GALLERY.map(function (n) { return "ec-gal-src-" + n; })).forEach(function (f) {
    var v = gv(f);
    if (v && !/^https?:\/\//i.test(v) && v.indexOf("../") !== 0) {
      warnings.push({ msg: "A picture link doesn't start with https:// — check it was copied fully.", step: "pictures", field: f });
    }
  });
  if (!gv("ec-aprop") && !gv("ec-phys")) warnings.push({ msg: "Anomalous properties or a physical description would make the file richer.", step: "desc", field: "ec-aprop" });
  return { errors: errors, warnings: warnings };
}

/* ── Generate output ─────────────────────────────────────── */
function generateOutput() {
  var v = ecValidate();
  if (v.errors.length) {
    var pre0 = document.getElementById("ec-output-pre");
    if (pre0)
      pre0.textContent =
        "// ⚠ Fix these first:\n" + v.errors.map(function (e) { return "//   • " + e.msg; }).join("\n");
    return;
  }

  var obj = ecBuildEntity();
  var padId = String(obj.id || 0).padStart(4, "0");
  var out =
    "    /* ════════════════════════════════════════════════════════\n" +
    "       E-" +
    padId +
    " — " +
    (obj.name || "UNNAMED") +
    "\n" +
    "       ════════════════════════════════════════════════════════ */\n" +
    "    {\n" +
    stringify(obj) +
    "\n" +
    "    }";

  var pre = document.getElementById("ec-output-pre");
  if (pre) pre.textContent = out;
}

/* ── Copy to clipboard ───────────────────────────────────── */
var copyBtn = document.getElementById("ec-copy-btn");
if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    var pre = document.getElementById("ec-output-pre");
    if (!pre) return;
    var text = pre.textContent;
    if (text.indexOf("//") === 0) {
      generateOutput();
    }
    text = pre.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.innerHTML = "<span>✓</span><span>COPIED</span>";
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.innerHTML = "<span>⧉</span><span>COPY</span>";
          copyBtn.classList.remove("copied");
        }, 2000);
      });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copyBtn.innerHTML = "<span>✓</span><span>COPIED</span>";
      copyBtn.classList.add("copied");
      setTimeout(function () {
        copyBtn.innerHTML = "<span>⧉</span><span>COPY</span>";
        copyBtn.classList.remove("copied");
      }, 2000);
    }
  });
}

/* ── Generate button ─────────────────────────────────────── */
var genBtn = document.getElementById("ec-gen-btn");
if (genBtn) genBtn.addEventListener("click", generateOutput);

/* ── Submit to Formspree ─────────────────────────────────── */
var submitBtn = document.getElementById("ec-submit-btn");
if (submitBtn) {
  submitBtn.addEventListener("click", function () {
    /* Anything required missing? Show it on the review list instead */
    if (ecValidate().errors.length) {
      ecGoTo("review");
      return;
    }
    generateOutput();
    var pre = document.getElementById("ec-output-pre");
    if (!pre) return;
    var outputText = pre.textContent;
    if (outputText.indexOf("// \u26a0") === 0 || outputText.indexOf("// Click") === 0) {
      return; /* validation already shown in pre */
    }

    /* Collect a flat summary payload for Formspree */
    var payload = {
      entity_id: gv("ec-id") || "",
      name: gv("ec-name") || "",
      classification: gv("ec-cls") || "",
      clearance: gv("ec-clr") || "",
      status: gv("ec-status") || "",
      site: gv("ec-site") || "",
      power_scaling: gv("ec-ps") || "",
      discovery_date: gv("ec-disc") || "",
      sentient: gv("ec-sentient") || "",
      hostile: gv("ec-hostile") || "",
      safety_rating: gv("ec-safety") || "",
      discovered_by: gv("ec-discoveredby") || "",
      description: gv("ec-desc") || "",
      anomalous_properties: gv("ec-aprop") || "",
      physical_description: gv("ec-phys") || "",
      dimensional_data: gv("ec-dims") || "",
      protocol_count: protocolCount,
      report_count: reportCount,
      generated_object: outputText
    };

    var ent = ecBuildEntity();
    payload.submitted_by = gv("ec-credit") || "(anonymous)";
    payload.profile_image_link = ent.img || "";
    payload.photo_caption = ent.imgCaption || "";
    payload.gallery_links = (ent.bioImages || []).map(function (g) { return g.src + (g.caption ? " — " + g.caption : ""); }).join("\n");

    var msg = document.getElementById("ec-submit-msg");
    var idle = "<span>&#x21E7;</span><span>SUBMIT FOR REVIEW</span>";
    submitBtn.innerHTML = "<span>&#x29D6;</span><span>SENDING&hellip;</span>";
    submitBtn.disabled = true;
    if (msg) msg.textContent = "";

    fetch("https://formspree.io/f/mojrejvd", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.ok || data.next) {
          submitBtn.innerHTML = "<span>&#x2713;</span><span>SUBMITTED</span>";
          submitBtn.classList.add("ec-submit-btn--ok");
          if (msg) msg.textContent = "Received — thank you! It will be reviewed before joining the archive.";
          if (typeof arcNotify === "function") arcNotify("ENTITY SUBMITTED · E-" + String(ent.id).padStart(4, "0"), "file");
          setTimeout(function () {
            submitBtn.innerHTML = idle;
            submitBtn.classList.remove("ec-submit-btn--ok");
            submitBtn.disabled = false;
          }, 4000);
        } else {
          throw new Error(JSON.stringify(data));
        }
      })
      .catch(function (err) {
        console.error("Formspree error:", err);
        submitBtn.innerHTML = "<span>&#x2717;</span><span>FAILED</span>";
        submitBtn.classList.add("ec-submit-btn--err");
        if (msg) msg.textContent = "Couldn't send — check your connection and try again. Your draft is saved.";
        setTimeout(function () {
          submitBtn.innerHTML = idle;
          submitBtn.classList.remove("ec-submit-btn--err");
          submitBtn.disabled = false;
        }, 4000);
      });
  });
}

/* ════════════════════════════════════════════════════════════
   GUIDED-CREATOR EXTRAS: pictures, live preview, review, ID hint
   ════════════════════════════════════════════════════════════ */

/* Pictures chosen from the device: kept in memory for the preview
   only (too big for draft storage); submissions use the links. */
var ecLocalImgs = {};
var EC_MAX_IMG = 8 * 1024 * 1024;

function ecThumb(key, src) {
  var id = key === "main" ? "ec-img-thumb" : "ec-gal-thumb-" + key.replace("gal", "");
  var box = document.getElementById(id);
  if (!box) return;
  box.innerHTML = src
    ? '<img src="' + ecEsc(src) + '" alt="" />'
    : "<span>" + (key === "main" ? "No picture" : "Empty") + "</span>";
}

function ecRefreshThumbs() {
  ecThumb("main", ecLocalImgs.main || gv("ec-img"));
  EC_GALLERY.forEach(function (n) {
    ecThumb("gal" + n, ecLocalImgs["gal" + n] || gv("ec-gal-src-" + n));
  });
}

function ecPickFile(input, key) {
  var file = input.files && input.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) {
    alert("That file isn't a picture.");
    input.value = "";
    return;
  }
  if (file.size > EC_MAX_IMG) {
    alert("That picture is over 8 MB — please choose a smaller one.");
    input.value = "";
    return;
  }
  var reader = new FileReader();
  reader.onload = function () {
    ecLocalImgs[key] = reader.result;
    ecRefreshThumbs();
    ecRenderPreview();
  };
  reader.readAsDataURL(file);
}

document.getElementById("ec-img-file").addEventListener("change", function () {
  ecPickFile(this, "main");
});
EC_GALLERY.forEach(function (n) {
  document.getElementById("ec-gal-file-" + n).addEventListener("change", function () {
    ecPickFile(this, "gal" + n);
  });
});

/* ── Live preview: the real entity document, built as you type ── */
var ecPreviewTimer = null;

function ecPreviewEntity() {
  var e = ecBuildEntity();
  if (!e.name) e.name = "UNNAMED ENTITY";
  if (!e.id) e.id = 0;
  /* Device pictures show in the preview even before a link exists */
  if (ecLocalImgs.main) e.img = ecLocalImgs.main;
  var gal = EC_GALLERY.map(function (n) {
    var src = ecLocalImgs["gal" + n] || gv("ec-gal-src-" + n);
    return src ? { src: src, caption: gv("ec-gal-cap-" + n) || "" } : null;
  }).filter(Boolean);
  if (gal.length) e.bioImages = gal;
  return e;
}

function ecRenderPreview() {
  clearTimeout(ecPreviewTimer);
  var box = document.getElementById("ec-preview");
  if (!box) return;
  if (typeof nvEntityDoc !== "function") {
    box.innerHTML = '<p class="ec-preview-none">Preview unavailable here.</p>';
    return;
  }
  box.innerHTML = nvEntityDoc(ecPreviewEntity());
}

function ecSchedulePreview() {
  clearTimeout(ecPreviewTimer);
  ecPreviewTimer = setTimeout(function () {
    ecRenderPreview();
    ecRefreshThumbs();
    ecIdHint();
  }, 250);
}

var ecPreviewOpen = document.getElementById("ec-preview-open");
if (ecPreviewOpen) {
  ecPreviewOpen.addEventListener("click", function () {
    if (typeof termViewer !== "function") return;
    var e = ecPreviewEntity();
    termViewer("PREVIEW · E-" + String(e.id).padStart(4, "0"), nvEntityDoc(e));
  });
}

/* ── Entity number hint: shows taken numbers / the next free one ── */
function ecIdHint() {
  var hint = document.getElementById("ec-id-hint");
  if (!hint) return;
  var ids = (typeof ENTITIES !== "undefined" ? ENTITIES : []).map(function (e) { return e.id; }).sort(function (a, b) { return a - b; });
  var id = gn("ec-id");
  var free = 1;
  while (ids.indexOf(free) !== -1) free++;
  if (id && ids.indexOf(id) !== -1) {
    hint.textContent = "E-" + String(id).padStart(4, "0") + " is already taken. Taken: " + ids.join(", ") + ".";
    hint.className = "ec-help ec-help--bad";
  } else if (id) {
    hint.textContent = "Will be filed as E-" + String(id).padStart(4, "0") + ".";
    hint.className = "ec-help ec-help--ok";
  } else {
    hint.textContent = "Becomes its E-number, e.g. 451 → E-0451. Taken: " + ids.join(", ") + ".";
    hint.className = "ec-help";
  }
}

/* ── Review step: what's missing, with buttons to jump there ── */
function ecRenderReview() {
  var ul = document.getElementById("ec-review");
  if (!ul) return;
  var v = ecValidate();
  var e = ecBuildEntity();
  var items = v.errors.map(function (x) { return { cls: "bad", x: x }; })
    .concat(v.warnings.map(function (x) { return { cls: "warn", x: x }; }));
  var summary = (e.protocols.length || e.reports.length)
    ? '<li class="ec-review-item ec-review-item--info">Includes ' + e.protocols.length + " protocol" + (e.protocols.length === 1 ? "" : "s") +
      " and " + e.reports.length + " report" + (e.reports.length === 1 ? "" : "s") + ".</li>"
    : "";
  ul.innerHTML = (items.length
    ? items.map(function (it) {
        return '<li class="ec-review-item ec-review-item--' + it.cls + '"><span>' + (it.cls === "bad" ? "&#10007; " : "! ") + ecEsc(it.x.msg) +
          '</span><button type="button" data-goto="' + it.x.step + '" data-focus="' + it.x.field + '">Fix</button></li>';
      }).join("")
    : '<li class="ec-review-item ec-review-item--ok">&#10003; Everything required is filled in — ready to submit.</li>') + summary;
  var btn = document.getElementById("ec-submit-btn");
  if (btn && !btn.classList.contains("ec-submit-btn--ok")) btn.disabled = v.errors.length > 0;
}

/* "Fix" buttons: jump to the step and focus the field */
document.getElementById("ec-review").addEventListener("click", function (e) {
  var b = e.target.closest("[data-focus]");
  if (!b) return;
  setTimeout(function () {
    var f = document.getElementById(b.dataset.focus);
    if (f) f.focus();
  }, 30);
});

/* Typing anywhere refreshes the preview (and review if it's open) */
document.querySelector(".ec-body").addEventListener("input", function () {
  ecSchedulePreview();
  if (!document.getElementById("ec-panel-review").classList.contains("ec-hidden")) ecRenderReview();
});
document.querySelector(".ec-body").addEventListener("change", ecSchedulePreview);
document.querySelector(".ec-body").addEventListener("click", function (e) {
  if (e.target.closest(".ec-add-btn, .ec-entry-remove")) ecSchedulePreview();
});

/* ── DRAFTS ──────────────────────────────────────────────────
   Each entity in progress is a draft saved in localStorage, so several
   can be open as tabs and they survive a reload. There is still one
   form: switching tabs saves the current draft and loads the other. */
var EC_DRAFTS_KEY = "neoms_ec_drafts";
var EC_FIELDS = [
  "ec-id", "ec-clr", "ec-name", "ec-site", "ec-cls", "ec-status", "ec-ps", "ec-disc",
  "ec-glyph", "ec-sentient", "ec-hostile", "ec-safety", "ec-img", "ec-discoveredby",
  "ec-desc", "ec-aprop", "ec-phys", "ec-dims",
  /* Guided creator: picture links/captions and the credit name */
  "ec-imgcap", "ec-gal-src-1", "ec-gal-cap-1", "ec-gal-src-2", "ec-gal-cap-2",
  "ec-gal-src-3", "ec-gal-cap-3", "ec-credit"
];
/* Field suffixes inside protocol/report cards, e.g. ec-proto-type-3 */
var EC_PROTO_KEYS = ["type", "clr", "desc", "equip", "dur", "personnel"];
var EC_REPORT_KEYS = [
  "title", "sub", "date", "type", "clr", "summary",
  "location", "personnel", "foreword", "log", "notes", "file", "author"
];
var EC_EMPTY_OUTPUT = "// Click ▶ GENERATE to build your entity object.";

var ecStore = ecLoadStore();
var ecSaveTimer = null;

function ecLoadStore() {
  try {
    var s = JSON.parse(localStorage.getItem(EC_DRAFTS_KEY));
    if (s && Array.isArray(s.drafts)) return s;
  } catch (e) {}
  return { drafts: [], open: [], active: null, explorer: false };
}

function ecPersist() {
  try {
    localStorage.setItem(EC_DRAFTS_KEY, JSON.stringify(ecStore));
  } catch (e) {}
}

function ecDraft(id) {
  return ecStore.drafts.filter(function (d) { return d.id === id; })[0];
}

function ecEsc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

/* ── Form <-> draft data ── */
function ecEntryValues(prefix, count, keys) {
  var rows = [];
  for (var i = 1; i <= count; i++) {
    if (!document.getElementById(prefix + i)) continue;
    var row = {};
    keys.forEach(function (k) {
      var el = document.getElementById(prefix + k + "-" + i);
      row[k] = el ? el.value : "";
    });
    rows.push(row);
  }
  return rows;
}

function ecFillEntry(prefix, i, row) {
  Object.keys(row).forEach(function (k) {
    var el = document.getElementById(prefix + k + "-" + i);
    if (el) el.value = row[k];
  });
}

function ecSnapshot() {
  var fields = {};
  EC_FIELDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) fields[id] = el.value;
  });
  return {
    fields: fields,
    protocols: ecEntryValues("ec-proto-", protocolCount, EC_PROTO_KEYS),
    reports: ecEntryValues("ec-report-", reportCount, EC_REPORT_KEYS)
  };
}

function ecApply(data) {
  EC_FIELDS.forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var v = data && data.fields ? data.fields[id] : undefined;
    if (v === undefined) v = el.tagName === "SELECT" ? el.options[0].value : "";
    el.value = v;
  });

  protocolList.innerHTML = '<div class="ec-empty-msg">No protocols added. Click "+ ADD PROTOCOL" to begin.</div>';
  protocolCount = 0;
  ((data && data.protocols) || []).forEach(function (p) {
    addProtocol();
    ecFillEntry("ec-proto-", protocolCount, p);
  });

  reportList.innerHTML = '<div class="ec-empty-msg">No reports added. Click "+ ADD REPORT" to begin.</div>';
  reportCount = 0;
  ((data && data.reports) || []).forEach(function (r) {
    addReport();
    ecFillEntry("ec-report-", reportCount, r);
  });

  var pre = document.getElementById("ec-output-pre");
  if (pre) pre.textContent = EC_EMPTY_OUTPUT;

  /* Device pictures belong to the draft they were picked in */
  ecLocalImgs = {};
  document.querySelectorAll('.ec-root input[type="file"]').forEach(function (f) { f.value = ""; });
  ecRefreshThumbs();
  ecIdHint();
  ecRenderPreview();
}

function ecLabel(d) {
  var f = (d.data && d.data.fields) || {};
  if (f["ec-name"]) return f["ec-name"];
  if (f["ec-id"]) return "E-" + String(f["ec-id"]).padStart(4, "0");
  return "Untitled draft";
}

/* Nothing typed yet: no text in any input and no protocols/reports */
function ecIsEmpty(d) {
  var x = d.data;
  if (!x) return true;
  if (x.protocols.length || x.reports.length) return false;
  return EC_FIELDS.every(function (id) {
    var el = document.getElementById(id);
    return (el && el.tagName === "SELECT") || !x.fields[id];
  });
}

/* ── Draft actions ── */
function ecSaveActive() {
  clearTimeout(ecSaveTimer);
  var d = ecDraft(ecStore.active);
  if (!d) return;
  d.data = ecSnapshot();
  d.updated = Date.now();
  ecPersist();
  ecRenderDrafts();
}

function ecScheduleSave() {
  clearTimeout(ecSaveTimer);
  ecSaveTimer = setTimeout(ecSaveActive, 300);
}

function ecActivate(id) {
  if (id === ecStore.active) return;
  if (ecStore.active) ecSaveActive();
  var d = ecDraft(id);
  if (!d) return;
  if (ecStore.open.indexOf(id) === -1) ecStore.open.push(id);
  ecStore.active = id;
  ecApply(d.data);
  ecPersist();
  ecRenderDrafts();
}

function ecNewDraft() {
  /* Reuse the current draft if nothing has been typed into it yet */
  var cur = ecDraft(ecStore.active);
  if (cur) ecSaveActive();
  if (!cur || !ecIsEmpty(cur)) {
    var d = { id: "d" + Date.now().toString(36), updated: Date.now(), data: null };
    ecStore.drafts.unshift(d);
    ecActivate(d.id);
  }
  ecGoTo("basics");
  var nameField = document.getElementById("ec-name");
  if (nameField) nameField.focus();
}

/* Remove id from the open tabs; if it was active, open its neighbour */
function ecDropTab(id) {
  var i = ecStore.open.indexOf(id);
  if (i !== -1) ecStore.open.splice(i, 1);
  if (id !== ecStore.active) return;
  ecStore.active = null;
  var next = ecStore.open[Math.min(i, ecStore.open.length - 1)];
  if (next) ecActivate(next);
  else ecNewDraft();
}

function ecCloseTab(id) {
  if (id === ecStore.active) ecSaveActive();
  var d = ecDraft(id);
  /* Closing a blank draft discards it; anything else stays in DRAFTS */
  if (d && ecIsEmpty(d)) {
    ecStore.drafts = ecStore.drafts.filter(function (x) { return x.id !== id; });
  }
  ecDropTab(id);
  ecPersist();
  ecRenderDrafts();
}

function ecDeleteDraft(id) {
  var d = ecDraft(id);
  if (!d) return;
  if (id === ecStore.active) ecSaveActive();
  if (!ecIsEmpty(d) && !confirm('Delete draft "' + ecLabel(d) + '"? This cannot be undone.')) return;
  ecStore.drafts = ecStore.drafts.filter(function (x) { return x.id !== id; });
  ecDropTab(id);
  ecPersist();
  ecRenderDrafts();
}

/* ── Rendering ── */
function ecRenderDrafts() {
  var tabs = document.getElementById("ec-draft-tabs");
  if (tabs) {
    tabs.innerHTML = ecStore.open.map(function (id) {
      var d = ecDraft(id);
      if (!d) return "";
      var on = id === ecStore.active;
      var label = ecEsc(ecLabel(d));
      return (
        '<div class="ec-draft-tab' + (on ? " ec-draft-tab--active" : "") + '">' +
        '<button class="ec-draft-tab-name" role="tab" aria-selected="' + on + '" data-draft="' + id + '" title="' + label + '">' +
        label + "</button>" +
        '<button class="ec-draft-tab-close" data-close="' + id + '" aria-label="Close ' + label +
        '" title="Close tab (draft stays saved)">&#215;</button></div>'
      );
    }).join("");
  }

  var list = document.getElementById("ec-explorer-list");
  if (list) {
    list.innerHTML = ecStore.drafts.length
      ? ecStore.drafts.map(function (d) {
          var f = (d.data && d.data.fields) || {};
          var meta = [
            f["ec-id"] ? "E-" + String(f["ec-id"]).padStart(4, "0") : null,
            f["ec-cls"] || null,
            new Date(d.updated).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
          ].filter(Boolean).join(" · ");
          var on = d.id === ecStore.active;
          var open = ecStore.open.indexOf(d.id) !== -1;
          return (
            '<li class="ec-explorer-item' + (on ? " ec-explorer-item--active" : "") + '">' +
            '<button class="ec-explorer-open" data-open="' + d.id + '">' +
            '<span class="ec-explorer-name">' + (open ? "&#9679; " : "") + ecEsc(ecLabel(d)) + "</span>" +
            '<span class="ec-explorer-meta">' + ecEsc(meta) + "</span></button>" +
            '<button class="ec-explorer-del" data-del="' + d.id + '" aria-label="Delete ' + ecEsc(ecLabel(d)) +
            '" title="Delete draft">&#128465;</button></li>'
          );
        }).join("")
      : '<li class="ec-explorer-empty">No saved drafts.</li>';
  }

  var count = document.getElementById("ec-drafts-count");
  if (count) count.textContent = "(" + ecStore.drafts.length + ")";
}

function ecSetExplorer(show) {
  var ex = document.getElementById("ec-explorer");
  var btn = document.getElementById("ec-drafts-toggle");
  if (ex) ex.hidden = !show;
  if (btn) btn.setAttribute("aria-expanded", String(show));
  ecStore.explorer = show;
  ecPersist();
}

/* ── Wiring ── */
var ecDraftTabs = document.getElementById("ec-draft-tabs");
if (ecDraftTabs) {
  ecDraftTabs.addEventListener("click", function (e) {
    var close = e.target.closest("[data-close]");
    if (close) return ecCloseTab(close.dataset.close);
    var tab = e.target.closest("[data-draft]");
    if (tab) ecActivate(tab.dataset.draft);
  });
  /* Middle-click closes a tab, like a browser */
  ecDraftTabs.addEventListener("auxclick", function (e) {
    var tab = e.button === 1 && e.target.closest("[data-draft]");
    if (tab) ecCloseTab(tab.dataset.draft);
  });
}

var ecExplorerList = document.getElementById("ec-explorer-list");
if (ecExplorerList) {
  ecExplorerList.addEventListener("click", function (e) {
    var del = e.target.closest("[data-del]");
    if (del) return ecDeleteDraft(del.dataset.del);
    var open = e.target.closest("[data-open]");
    if (open) ecActivate(open.dataset.open);
  });
}

var ecNewBtn = document.getElementById("ec-draft-new");
if (ecNewBtn) ecNewBtn.addEventListener("click", ecNewDraft);

var ecToggleBtn = document.getElementById("ec-drafts-toggle");
if (ecToggleBtn) {
  ecToggleBtn.addEventListener("click", function () {
    ecSetExplorer(document.getElementById("ec-explorer").hidden);
  });
}

/* Autosave: typing, dropdowns, and adding/removing protocol or report cards */
var ecBody = document.querySelector(".ec-body");
if (ecBody) {
  ecBody.addEventListener("input", ecScheduleSave);
  ecBody.addEventListener("change", ecScheduleSave);
  ecBody.addEventListener("click", function (e) {
    if (e.target.closest(".ec-add-btn, .ec-entry-remove")) ecScheduleSave();
  });
}
window.addEventListener("pagehide", function () {
  if (ecSaveTimer) ecSaveActive();
});

/* ── Restore last session ── */
ecStore.open = ecStore.open.filter(function (id) { return ecDraft(id); });
var ecStart = ecDraft(ecStore.active) ? ecStore.active : ecStore.open[0];
ecStore.active = null;
if (ecStart) ecActivate(ecStart);
else ecNewDraft();
ecSetExplorer(!!ecStore.explorer);
ecGoTo("basics");
