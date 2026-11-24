/* ============================================================
   NEOMS — PERSONNEL CREATOR WINDOW
   Neoms~Database/windows/personnelcreator/personnelcreator.js
   A guided form for submitting a new staff file. Visitors type the
   details, see the finished personnel document build itself, and
   send it to Formspree for review.
   Globals available: personnel, SITES, DEPTS, sessionpersonnel,
   userClearance, openWin
   ============================================================ */

var pcPane = document.getElementById("wbody_" + winId) || document;

function pcEl(id) {
  return document.getElementById(id);
}
function pcVal(id) {
  var el = pcEl(id);
  return el ? el.value.trim() : "";
}

/* ── Which creator: the switch back to the Entity Creator ──── */
pcPane.querySelector(".ec-mode").addEventListener("click", function (e) {
  var b = e.target.closest("[data-open]");
  if (b) openWin(b.dataset.open);
});

/* ── Departments, positions and their clearance (from the Schemes
   tab's Personnel Position Scheme; CL-5 roles aren't offered) ── */
var PC_POSITIONS = {
  "SYNTHETICS": [["Synthetic Unit", 1], ["Synthetic Asset", 1], ["Synthetic Drone", 1], ["Synthetic Liaison", 1],
    ["Synthetic Maintenance Frame", 1]],
  "FACILITY UNITS": [["Core Units Personnel", 2], ["Sub Units Personnel", 2], ["Logistics Coordinator", 2],
    ["Medical Response Unit", 2], ["Systems Technician", 2]],
  "FACILITY COMMAND": [["Core Command Director", 2], ["Sub Command Director", 2]],
  "CONTAINMENT ENFORCEMENT": [["Sentinel Senior Officer Forces", 3], ["Sentinel Forces", 3]],
  "CONTAINMENT RESEARCH": [["Anomaly Research Specialist", 3], ["Anomaly Research Analyst", 3], ["Field Researcher", 3],
    ["Containment Engineer", 3], ["Xenolinguist", 3], ["Archivist", 3]],
  "PRIME DIRECTOR": [["Directive Control Officer", 4]]
};
var PC_OTHER = "__other";

(DEPTS && DEPTS.length ? DEPTS : Object.keys(PC_POSITIONS)).forEach(function (d) {
  var opt = document.createElement("option");
  opt.value = d;
  opt.textContent = d;
  pcEl("pc-dept").appendChild(opt);
});
pcEl("pc-dept").value = "CONTAINMENT RESEARCH";

(SITES || []).forEach(function (s) {
  var opt = document.createElement("option");
  opt.value = s.id;
  opt.textContent = s.name + " (" + s.loc + ")";
  pcEl("pc-site").appendChild(opt);
});

function pcFillPositions(keep) {
  var list = PC_POSITIONS[pcVal("pc-dept")] || [];
  var sel = pcEl("pc-pos");
  sel.innerHTML = list.map(function (p) {
    return '<option value="' + escHtml(p[0]) + '">' + escHtml(p[0]) + " — CL-" + p[1] + "</option>";
  }).join("") + '<option value="' + PC_OTHER + '">Other — type my own…</option>';
  sel.value = keep || (list.length ? list[0][0] : PC_OTHER);
  if (!sel.value) sel.value = PC_OTHER;
}

/* Show the custom box for "Other"; a listed position sets the clearance */
function pcSyncPosition(setClr) {
  var v = pcEl("pc-pos").value;
  pcEl("pc-pos-custom").hidden = v !== PC_OTHER;
  if (!setClr || v === PC_OTHER) return;
  var hit = (PC_POSITIONS[pcVal("pc-dept")] || []).filter(function (p) { return p[0] === v; })[0];
  if (hit) pcEl("pc-clr").value = String(hit[1]);
}

function pcPosition() {
  var v = pcEl("pc-pos").value;
  return v === PC_OTHER ? pcVal("pc-pos-custom") : v;
}

pcEl("pc-dept").addEventListener("change", function () {
  pcFillPositions();
  pcSyncPosition(true);
});
pcEl("pc-pos").addEventListener("change", function () {
  pcSyncPosition(true);
  if (this.value === PC_OTHER) pcEl("pc-pos-custom").focus();
});

/* ── Steps ───────────────────────────────────────────────── */
var pcTabs = pcEl("pc-tabs");
var pcBody = pcPane.querySelector(".ec-body");

function pcGoTo(target) {
  pcTabs.querySelectorAll(".ec-tab").forEach(function (t) {
    var on = t.dataset.tab === target;
    t.classList.toggle("ec-tab--active", on);
    t.setAttribute("aria-selected", String(on));
  });
  pcPane.querySelectorAll(".ec-panel").forEach(function (p) {
    p.classList.toggle("ec-hidden", p.id !== "pc-panel-" + target);
  });
  pcBody.scrollTop = 0;
  if (target === "review") pcRenderReview();
  pcRenderPreview();
}

pcTabs.addEventListener("click", function (e) {
  var btn = e.target.closest(".ec-tab");
  if (btn) pcGoTo(btn.dataset.tab);
});
pcBody.addEventListener("click", function (e) {
  var nav = e.target.closest("[data-goto]");
  if (!nav) return;
  pcGoTo(nav.dataset.goto);
  /* "Fix" buttons also focus the field */
  if (nav.dataset.focus) {
    setTimeout(function () {
      var f = pcEl(nav.dataset.focus);
      if (f) f.focus();
    }, 30);
  }
});

/* ── The personnel record ────────────────────────────────── */
function pcBuild() {
  var p = {
    id: parseInt(pcVal("pc-id"), 10) || 0,
    fname: pcVal("pc-fname"),
    lname: pcVal("pc-lname"),
    pos: pcPosition(),
    dept: pcVal("pc-dept"),
    clr: parseInt(pcVal("pc-clr"), 10) || 1,
    site: parseInt(pcVal("pc-site"), 10) || null,
    active: pcVal("pc-active") || "Y"
  };
  if (pcVal("pc-img")) p.img = pcVal("pc-img");
  if (pcVal("pc-specialty")) p.specialty = pcVal("pc-specialty");
  if (pcVal("pc-joined")) p.joined = pcVal("pc-joined");
  if (pcVal("pc-bio")) p.bio = pcVal("pc-bio");
  return p;
}

function pcTakenIds() {
  return (personnel || []).map(function (p) { return p.id; }).sort(function (a, b) { return a - b; });
}

function pcValidate() {
  var p = pcBuild();
  var errors = [], warnings = [];
  if (!p.fname) errors.push({ msg: "Give them a first name or title.", step: "identity", field: "pc-fname" });
  if (!p.id) errors.push({ msg: "Give them a personnel number.", step: "identity", field: "pc-id" });
  else if (pcTakenIds().indexOf(p.id) !== -1) errors.push({ msg: "S-" + p.id + " is already taken — pick another number.", step: "identity", field: "pc-id" });
  if (!p.pos) errors.push({ msg: "Type their position.", step: "assignment", field: "pc-pos-custom" });

  if (pcLocalImg && !p.img) warnings.push({ msg: "Your photo is only on your device — add an image link so it's included.", step: "photo", field: "pc-img" });
  else if (!p.img) warnings.push({ msg: "No ID photo link (optional).", step: "photo", field: "pc-img" });
  else if (!/^(https:\/\/|\.\.\/)/.test(p.img)) warnings.push({ msg: "The photo link should start with https://", step: "photo", field: "pc-img" });
  if (!p.bio) warnings.push({ msg: "No profile written yet (optional).", step: "profile", field: "pc-bio" });
  return { errors: errors, warnings: warnings };
}

/* Code for Personnel-Data.js, in the same layout as the file */
function pcCode(p) {
  var lines = ["id: " + p.id, "fname: " + JSON.stringify(p.fname), "lname: " + JSON.stringify(p.lname),
    "pos: " + JSON.stringify(p.pos), "dept: " + JSON.stringify(p.dept), "clr: " + p.clr,
    "site: " + (p.site || "null"), "active: " + JSON.stringify(p.active)];
  ["img", "specialty", "joined", "bio"].forEach(function (k) {
    if (p[k]) lines.push(k + ": " + JSON.stringify(p[k]));
  });
  return "    {\n        " + lines.join(",\n        ") + "\n    },";
}

/* ── ID photo: a device picture shows in the preview only ─── */
var pcLocalImg = null;

function pcRefreshThumb() {
  var src = pcLocalImg || pcVal("pc-img");
  pcEl("pc-img-thumb").innerHTML = src ? '<img src="' + escHtml(src) + '" alt="" />' : "<span>No photo</span>";
}

pcEl("pc-img-file").addEventListener("change", function () {
  var input = this, file = input.files && input.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) {
    alert("That file isn't a picture.");
    input.value = "";
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    alert("That picture is over 8 MB — please choose a smaller one.");
    input.value = "";
    return;
  }
  var reader = new FileReader();
  reader.onload = function () {
    pcLocalImg = reader.result;
    pcRefreshThumb();
    pcRenderPreview();
  };
  reader.readAsDataURL(file);
});

/* ── Live preview ────────────────────────────────────────── */
function pcPreviewPerson() {
  var p = pcBuild();
  if (!p.fname && !p.lname) p.fname = "UNNAMED STAFF";
  if (!p.id) p.id = "????";
  if (pcLocalImg) p.img = pcLocalImg;
  return p;
}

function pcRenderPreview() {
  var box = pcEl("pc-preview");
  box.innerHTML = typeof nvPersonDoc === "function"
    ? nvPersonDoc(pcPreviewPerson())
    : '<p class="ec-preview-none">Preview unavailable here.</p>';
}

pcEl("pc-preview-open").addEventListener("click", function () {
  if (typeof termViewer !== "function") return;
  var p = pcPreviewPerson();
  termViewer("PREVIEW · S-" + p.id, nvPersonDoc(p));
});

/* ── Personnel number hint ───────────────────────────────── */
function pcIdHint() {
  var hint = pcEl("pc-id-hint");
  var ids = pcTakenIds();
  var id = parseInt(pcVal("pc-id"), 10);
  var free = 1001;
  while (ids.indexOf(free) !== -1) free++;
  if (id && ids.indexOf(id) !== -1) {
    hint.textContent = "S-" + id + " is already taken. Next free: " + free + ".";
    hint.className = "ec-help ec-help--bad";
  } else if (id) {
    hint.textContent = "Will be filed as S-" + id + ".";
    hint.className = "ec-help ec-help--ok";
  } else {
    hint.textContent = "Becomes their S-number. Taken: " + ids.join(", ") + ". Next free: " + free + ".";
    hint.className = "ec-help";
  }
}

/* ── Review step ─────────────────────────────────────────── */
function pcRenderReview() {
  var v = pcValidate();
  var items = v.errors.map(function (x) { return { cls: "bad", x: x }; })
    .concat(v.warnings.map(function (x) { return { cls: "warn", x: x }; }));
  var fix = function (it) {
    var field = it.x.field === "pc-pos-custom" && pcEl("pc-pos").value !== PC_OTHER ? "pc-pos" : it.x.field;
    return '<li class="ec-review-item ec-review-item--' + it.cls + '"><span>' + (it.cls === "bad" ? "&#10007; " : "! ") +
      escHtml(it.x.msg) + '</span><button type="button" data-goto="' + it.x.step + '" data-focus="' + field + '">Fix</button></li>';
  };
  pcEl("pc-review").innerHTML = v.errors.length
    ? items.map(fix).join("")
    : '<li class="ec-review-item ec-review-item--ok">&#10003; Everything required is filled in — ready to submit.</li>' +
      v.warnings.map(function (x) { return fix({ cls: "warn", x: x }); }).join("");
  var btn = pcEl("pc-submit-btn");
  if (!btn.classList.contains("ec-submit-btn--ok")) btn.disabled = v.errors.length > 0;
  pcEl("pc-output-pre").textContent = v.errors.length ? "// Fix the items marked ✗ first." : pcCode(pcBuild());
}

pcEl("pc-copy-btn").addEventListener("click", function () {
  var text = pcEl("pc-output-pre").textContent;
  var btn = this;
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(function () {
    btn.innerHTML = "<span>&#10003;</span><span>COPIED</span>";
    setTimeout(function () { btn.innerHTML = "<span>&#10697;</span><span>COPY</span>"; }, 1500);
  });
});

/* ── Draft: one personnel file, saved in this browser ────── */
var PC_DRAFT_KEY = "neoms_pc_draft";
var PC_FIELDS = ["pc-fname", "pc-lname", "pc-id", "pc-active", "pc-img", "pc-dept", "pc-pos", "pc-pos-custom",
  "pc-clr", "pc-site", "pc-specialty", "pc-joined", "pc-bio", "pc-credit"];

function pcSaveDraft() {
  var d = {};
  PC_FIELDS.forEach(function (id) { d[id] = pcEl(id).value; });
  try { localStorage.setItem(PC_DRAFT_KEY, JSON.stringify(d)); } catch (err) { /* storage full or blocked */ }
}

function pcLoadDraft() {
  var d = null;
  try { d = JSON.parse(localStorage.getItem(PC_DRAFT_KEY) || "null"); } catch (err) { d = null; }
  if (!d) {
    pcFillPositions();
    pcSyncPosition(true);
    return;
  }
  PC_FIELDS.forEach(function (id) {
    if (id === "pc-pos" || d[id] === undefined) return;
    pcEl(id).value = d[id];
    /* pc-dept fills the position list, so it goes before pc-pos */
    if (id === "pc-dept") pcFillPositions(d["pc-pos"]);
  });
  pcSyncPosition(false);
}

pcEl("pc-reset").addEventListener("click", function () {
  if (!confirm("Clear this personnel file and start over?")) return;
  localStorage.removeItem(PC_DRAFT_KEY);
  PC_FIELDS.forEach(function (id) {
    var el = pcEl(id);
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });
  pcEl("pc-dept").value = "CONTAINMENT RESEARCH";
  pcFillPositions();
  pcSyncPosition(true);
  pcLocalImg = null;
  pcEl("pc-img-file").value = "";
  pcRefreshThumb();
  pcIdHint();
  pcGoTo("identity");
  pcEl("pc-fname").focus();
});

/* Typing anywhere saves the draft and refreshes the preview */
var pcTimer = null;
function pcChanged() {
  clearTimeout(pcTimer);
  pcTimer = setTimeout(function () {
    pcSaveDraft();
    pcRenderPreview();
    pcRefreshThumb();
    pcIdHint();
    if (!pcEl("pc-panel-review").classList.contains("ec-hidden")) pcRenderReview();
  }, 250);
}
pcBody.addEventListener("input", pcChanged);
pcBody.addEventListener("change", pcChanged);

/* ── Submit for review (Formspree) ───────────────────────── */
var pcSubmit = pcEl("pc-submit-btn");
pcSubmit.addEventListener("click", function () {
  if (pcValidate().errors.length) {
    pcGoTo("review");
    return;
  }
  var p = pcBuild();
  var site = (SITES || []).filter(function (s) { return s.id === p.site; })[0];
  var payload = {
    form_type: "personnel",
    personnel_id: "S-" + p.id,
    name: (p.fname + " " + p.lname).trim(),
    position: p.pos,
    department: p.dept,
    clearance: "CL-" + p.clr,
    site: site ? site.name : "Unassigned",
    status: p.active === "Y" ? "Active" : "Inactive",
    specialty: p.specialty || "",
    joined: p.joined || "",
    profile: p.bio || "",
    photo_link: p.img || "",
    submitted_by: pcVal("pc-credit") || "(anonymous)",
    generated_object: pcCode(p)
  };

  var msg = pcEl("pc-submit-msg");
  var idle = "<span>&#8679;</span><span>SUBMIT FOR REVIEW</span>";
  pcSubmit.innerHTML = "<span>&#10710;</span><span>SENDING&hellip;</span>";
  pcSubmit.disabled = true;
  msg.textContent = "";

  fetch("https://formspree.io/f/mojrejvd", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload)
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!(data.ok || data.next)) throw new Error(JSON.stringify(data));
      pcSubmit.innerHTML = "<span>&#10003;</span><span>SUBMITTED</span>";
      pcSubmit.classList.add("ec-submit-btn--ok");
      msg.textContent = "Received — thank you! It will be reviewed before joining the archive.";
      if (typeof arcNotify === "function") arcNotify("PERSONNEL SUBMITTED · S-" + p.id, "file");
      setTimeout(function () {
        pcSubmit.innerHTML = idle;
        pcSubmit.classList.remove("ec-submit-btn--ok");
        pcSubmit.disabled = false;
      }, 4000);
    })
    .catch(function (err) {
      console.error("Formspree error:", err);
      pcSubmit.innerHTML = "<span>&#10007;</span><span>FAILED</span>";
      pcSubmit.classList.add("ec-submit-btn--err");
      msg.textContent = "Couldn't send — check your connection and try again. Your draft is saved.";
      setTimeout(function () {
        pcSubmit.innerHTML = idle;
        pcSubmit.classList.remove("ec-submit-btn--err");
        pcSubmit.disabled = false;
      }, 4000);
    });
});

/* ── Start ───────────────────────────────────────────────── */
pcLoadDraft();
pcRefreshThumb();
pcIdHint();
pcGoTo("identity");
