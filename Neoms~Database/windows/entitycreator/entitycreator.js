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

/* ── Tab switching ───────────────────────────────────────── */
var tabBar = document.getElementById("ec-tabs");
if (tabBar) {
  tabBar.addEventListener("click", function (e) {
    var btn = e.target.closest(".ec-tab");
    if (!btn) return;
    var target = btn.dataset.tab;

    tabBar.querySelectorAll(".ec-tab").forEach(function (t) {
      t.classList.remove("ec-tab--active");
    });
    btn.classList.add("ec-tab--active");

    document.querySelectorAll(".ec-panel").forEach(function (p) {
      p.classList.add("ec-hidden");
    });
    var panel = document.getElementById("ec-panel-" + target);
    if (panel) panel.classList.remove("ec-hidden");
  });
}

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
    '<label class="ec-label">FILE REFERENCE (optional)</label>' +
    '<input class="ec-input" id="ec-report-file-' +
    idx +
    '" type="text" placeholder="NMS-XXX-TYPE-001.pdf">' +
    "</div>" +
    '<div class="ec-field">' +
    '<label class="ec-label">AUTHOR (personnel ID)</label>' +
    '<input class="ec-input" id="ec-report-author-' +
    idx +
    '" type="number" placeholder="e.g. 1003">' +
    "</div>" +
    "</div>";

  reportList.appendChild(card);
}

/* ── Remove any entry card ───────────────────────────────── */
function removeEntry(id) {
  var el = document.getElementById(id);
  if (el) el.remove();
}

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

/* ── Collect reports ─────────────────────────────────────── */
function collectReports() {
  var results = [];
  for (var i = 1; i <= reportCount; i++) {
    if (!document.getElementById("ec-report-" + i)) continue;
    var fileVal = gv("ec-report-file-" + i);
    var authorVal = gn("ec-report-author-" + i);
    var entry = {
      title: gv("ec-report-title-" + i) || "",
      subtitle: gv("ec-report-sub-" + i) || "",
      date: gv("ec-report-date-" + i) || "",
      type: gv("ec-report-type-" + i) || "INCIDENT",
      clr: parseInt(gv("ec-report-clr-" + i) || "1", 10),
      summary: gv("ec-report-summary-" + i) || ""
    };
    if (fileVal) entry.file = fileVal;
    if (authorVal) entry.author = authorVal;
    results.push(entry);
  }
  return results;
}

/* ── JS object pretty-printer ────────────────────────────── */
function stringify(obj, indent) {
  indent = indent || "    ";
  var lines = [];
  var keys = Object.keys(obj);
  keys.forEach(function (k, ki) {
    var v = obj[k];
    var comma = ki < keys.length - 1 ? "," : "";
    var key = k + ": ";
    if (v === null) {
      lines.push(indent + key + "null" + comma);
    } else if (typeof v === "number") {
      lines.push(indent + key + v + comma);
    } else if (typeof v === "string") {
      lines.push(indent + key + JSON.stringify(v) + comma);
    } else if (Array.isArray(v)) {
      if (v.length === 0) {
        lines.push(indent + key + "[]" + comma);
      } else {
        lines.push(indent + key + "[");
        v.forEach(function (item, ii) {
          var subComma = ii < v.length - 1 ? "," : "";
          if (typeof item === "object" && item !== null) {
            lines.push(indent + "  {");
            var subKeys = Object.keys(item);
            subKeys.forEach(function (sk, ski) {
              var sc = ski < subKeys.length - 1 ? "," : "";
              var sv = item[sk];
              if (sv === null) {
                lines.push(indent + "    " + sk + ": null" + sc);
              } else if (typeof sv === "number") {
                lines.push(indent + "    " + sk + ": " + sv + sc);
              } else {
                lines.push(indent + "    " + sk + ": " + JSON.stringify(sv) + sc);
              }
            });
            lines.push(indent + "  }" + subComma);
          } else {
            lines.push(indent + "  " + JSON.stringify(item) + subComma);
          }
        });
        lines.push(indent + "]" + comma);
      }
    }
  });
  return lines.join("\n");
}

/* ── Generate output ─────────────────────────────────────── */
function generateOutput() {
  var id = gn("ec-id");
  var name = gv("ec-name");

  /* Validate required */
  var valid = true;
  ["ec-id", "ec-name", "ec-cls", "ec-status", "ec-clr"].forEach(function (fid) {
    var el = document.getElementById(fid);
    if (el) {
      if (!el.value || el.value.trim() === "") {
        el.classList.add("ec-invalid");
        valid = false;
        setTimeout(function () {
          el.classList.remove("ec-invalid");
        }, 2000);
      }
    }
  });
  if (!valid) {
    var pre = document.getElementById("ec-output-pre");
    if (pre)
      pre.textContent =
        "// ⚠ Required fields missing: ID, Name, Classification, Status, Clearance.\n// Fill them in on the PROFILE tab, then regenerate.";
    return;
  }

  var siteVal = gv("ec-site");
  var imgVal = gv("ec-img");
  var discBy = gn("ec-discoveredby");

  var obj = {
    id: id,
    clr: parseInt(gv("ec-clr") || "1", 10),
    site: siteVal ? parseInt(siteVal, 10) : null,
    name: name,
    cls: gv("ec-cls") || "AR",
    ps: gv("ec-ps") || "",
    status: gv("ec-status") || "CONTAINED",
    disc: gv("ec-disc") || "20██-██-██",
    glyph: gv("ec-glyph") || "○",
    img: imgVal || null,
    desc: gv("ec-desc") || "",
    aprop: gv("ec-aprop") || "",
    phys: gv("ec-phys") || "",
    dims: gv("ec-dims") || "",
    sentient: gv("ec-sentient") || "U",
    hostile: gv("ec-hostile") || "U",
    safety: gv("ec-safety") || "HAZARDOUS",
    discoveredBy: discBy,
    contributors: [],
    sources: [],
    protocols: collectProtocols(),
    reports: collectReports()
  };

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
    /* Ensure output is generated and valid first */
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

    submitBtn.innerHTML = "<span>&#x29D6;</span><span>SENDING&hellip;</span>";
    submitBtn.disabled = true;

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
          setTimeout(function () {
            submitBtn.innerHTML = "<span>&#x21E7;</span><span>SUBMIT</span>";
            submitBtn.classList.remove("ec-submit-btn--ok");
            submitBtn.disabled = false;
          }, 3000);
        } else {
          throw new Error(JSON.stringify(data));
        }
      })
      .catch(function (err) {
        console.error("Formspree error:", err);
        submitBtn.innerHTML = "<span>&#x2717;</span><span>FAILED</span>";
        submitBtn.classList.add("ec-submit-btn--err");
        setTimeout(function () {
          submitBtn.innerHTML = "<span>&#x21E7;</span><span>SUBMIT</span>";
          submitBtn.classList.remove("ec-submit-btn--err");
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}
