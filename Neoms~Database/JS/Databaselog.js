/* ============================================================
   NEOMS CONTAINMENT LOG — CORE SCRIPT
   Neoms~Database/JS/Databaselog.js
   ============================================================ */
"use strict";

/* ── CONSTANTS ───────────────────────────────────────────────── */
const LS_KEY = "neoms_session_personnel";
const FORMSPREE_URL = "https://formspree.io/f/xwvwybya";

/* ── STATE ───────────────────────────────────────────────────── */
let wins = {};
let winZ = 50;
let activeWin = null;
let entFilter = "ALL";
let userClearance = 1;
let sessionpersonnel = null;

/* ── LOCAL STORAGE HELPERS ───────────────────────────────────── */
function lsSave(record) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(record));
    } catch (e) {}
}
function lsLoad() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY));
    } catch (e) {
        return null;
    }
}
function lsClear() {
    try {
        localStorage.removeItem(LS_KEY);
    } catch (e) {}
}

/* ── CLEARANCE ───────────────────────────────────────────────── */
const LS_CLR_KEY = "neoms_clearance";

function setClearance(level) {
    level = Math.max(1, Math.min(5, parseInt(level, 10) || 1));
    userClearance = level;
    for (let i = 1; i <= 5; i++) {
        const dot = document.getElementById("cd" + i);
        if (dot) dot.classList.toggle("active", i <= level);
    }
    // Save to localStorage so it persists across page loads
    try {
        localStorage.setItem(LS_CLR_KEY, String(level));
    } catch (e) {}
    return level;
}
function cycleClearance() {
    setClearance((userClearance % 5) + 1);
    const ind = document.getElementById("clearance-indicator");
    if (ind) {
        ind.style.outline = "1px solid var(--teal-b)";
        setTimeout(() => (ind.style.outline = ""), 300);
    }
}

/* ── CLOCK ───────────────────────────────────────────────────── */
function updateClock() {
    const now = new Date();
    const el = document.getElementById("sys-clock");
    if (el) el.textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
}
updateClock();
setInterval(updateClock, 10000);

/* ── START MENU ──────────────────────────────────────────────── */
function toggleStartMenu() {
    document.getElementById("start-menu").classList.toggle("open");
}
function closeMenu() {
    document.getElementById("start-menu").classList.remove("open");
}
document.addEventListener("click", function (e) {
    if (!e.target.closest("#start-menu") && !e.target.closest("#taskbar-start")) closeMenu();
});

/* ── WINDOW MANAGEMENT ───────────────────────────────────────── */
function makeDraggable(win, titlebar) {
    let dragging = false,
        ox = 0,
        oy = 0;
    titlebar.addEventListener("mousedown", function (e) {
        if (e.target.closest(".win-controls")) return;
        dragging = true;
        ox = e.clientX - win.offsetLeft;
        oy = e.clientY - win.offsetTop;
        bringToFront(win.id);
        document.addEventListener("mousemove", onMove);
        document.addEventListener(
            "mouseup",
            () => {
                dragging = false;
                document.removeEventListener("mousemove", onMove);
            },
            { once: true }
        );
    });
    function onMove(e) {
        if (!dragging) return;
        win.style.left = Math.max(0, Math.min(e.clientX - ox, window.innerWidth - 60)) + "px";
        win.style.top = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - 80)) + "px";
    }
}

function bringToFront(id) {
    winZ++;
    document.getElementById(id).style.zIndex = winZ;
    document.querySelectorAll(".win").forEach((w) => w.classList.remove("active-win"));
    document.getElementById(id).classList.add("active-win");
    activeWin = id;
    updateTaskbar();
}

function updateTaskbar() {
    const bar = document.getElementById("taskbar-wins");
    bar.innerHTML = "";
    Object.entries(wins).forEach(([id, info]) => {
        const b = document.createElement("div");
        b.className = "tb-win" + (id === activeWin ? " active" : "");
        b.textContent = info.title;
        b.onclick = function () {
            const el = document.getElementById(id);
            if (el && el.style.height === "22px") el.style.height = wins[id].savedH || "500px";
            bringToFront(id);
        };
        bar.appendChild(b);
    });
}

function createWin(id, titleHTML, width, height, bodyHTML) {
    if (document.getElementById(id)) {
        bringToFront(id);
        return;
    }
    const container = document.getElementById("wins-container");
    const w = document.createElement("div");
    w.className = "win";
    w.id = id;
    const ow = Math.min(width, window.innerWidth - 40);
    const oh = Math.min(height, window.innerHeight - 80);
    const lx = 80 + Object.keys(wins).length * 22;
    const ly = 30 + Object.keys(wins).length * 22;
    w.style.cssText = `left:${lx}px;top:${ly}px;width:${ow}px;height:${oh}px;display:flex;`;
    w.innerHTML =
        `<div class="win-titlebar" id="tb_${id}">
           <div class="win-title">${titleHTML}</div>
           <div class="win-controls">
             <button class="win-btn" title="Minimise"  onclick="toggleMinWin('${id}')">_</button>
             <button class="win-btn" title="Maximise"  onclick="toggleMaxWin('${id}')">&#9633;</button>
             <button class="win-btn close-btn" title="Close" onclick="closeWin('${id}')">X</button>
           </div>
         </div>` + bodyHTML;
    container.appendChild(w);
    wins[id] = { title: titleHTML.replace(/<[^>]+>/g, "").trim() };
    makeDraggable(w, document.getElementById("tb_" + id));
    bringToFront(id);
}

function toggleMinWin(id) {
    const w = document.getElementById(id);
    if (!w) return;
    if (w.style.height === "22px") {
        w.style.height = wins[id].savedH || "500px";
        w.style.width = wins[id].savedW || "600px";
    } else {
        wins[id].savedH = w.style.height;
        wins[id].savedW = w.style.width;
        w.style.height = "22px";
    }
}

function toggleMaxWin(id) {
    const w = document.getElementById(id);
    const area = document.getElementById("desktop-area");
    if (!w || !area) return;
    if (wins[id].maximised) {
        w.style.left = wins[id].savedL || "80px";
        w.style.top = wins[id].savedT || "30px";
        w.style.width = wins[id].savedW || "600px";
        w.style.height = wins[id].savedH || "500px";
        wins[id].maximised = false;
    } else {
        wins[id].savedL = w.style.left;
        wins[id].savedT = w.style.top;
        wins[id].savedW = w.style.width;
        wins[id].savedH = w.style.height;
        w.style.left = "0px";
        w.style.top = "0px";
        w.style.width = area.offsetWidth + "px";
        w.style.height = area.offsetHeight + "px";
        wins[id].maximised = true;
        bringToFront(id);
    }
}

function closeWin(id) {
    const w = document.getElementById(id);
    if (w) w.remove();
    delete wins[id];
    activeWin = null;
    updateTaskbar();
}

/* ── TAB SWITCHING ───────────────────────────────────────────── */
function switchTab(wid, tab, btn) {
    document.querySelectorAll("#" + wid + "_tabs > div").forEach((d) => (d.style.display = "none"));
    document.getElementById(wid + "_" + tab).style.display = "block";
    btn.closest(".win-tabs")
        .querySelectorAll(".win-tab")
        .forEach((b) => b.classList.remove("active-tab"));
    btn.classList.add("active-tab");
}

/* ── ENTITY LIST HELPERS ─────────────────────────────────────── */
function setEntFilter(cls, btn) {
    entFilter = cls;
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");
    renderEntList();
}

function renderEntList() {
    const q = (document.getElementById("ent-search") || { value: "" }).value.toLowerCase();
    const tbody = document.getElementById("ent-tbody");
    if (!tbody) return;
    const filtered = ENTITIES.filter((e) => {
        if (entFilter !== "ALL" && e.cls !== entFilter) return false;
        if (q && !e.name.toLowerCase().includes(q) && !String(e.id).includes(q)) return false;
        return true;
    });
    tbody.innerHTML =
        filtered
            .map(
                (e) => `
        <tr onclick="openWin('entity',${e.id})">
          <td class="ent-id">E-${String(e.id).padStart(4, "0")}</td>
          <td class="ent-name">${e.name}</td>
          <td><span class="class-badge class-${e.cls}">${e.cls}</span></td>
          <td class="ent-ps">${e.ps}</td>
          <td><span class="status-chip status-${e.status}">${e.status}</span></td>
          <td class="ent-site">${e.site ? "Site-" + e.site : "N/A"}</td>
        </tr>`
            )
            .join("") || `<tr><td colspan="6" class="ent-empty">NO RECORDS MATCH CURRENT FILTER</td></tr>`;
}

function refreshpersonnelTable() {
    const tbody = document.getElementById("personnel-tbody");
    if (!tbody) return;
    tbody.innerHTML = personnel.map(
        (s) => `
        <tr>
          <td class="personnel-id">${s.id}</td>
          <td class="personnel-name">${s.fname} ${s.lname}</td>
          <td class="personnel-pos">${s.pos}</td>
          <td class="personnel-dept">${s.dept}</td>
          <td>
            <span class="clr-pip clr-${s.clr}"></span>
            <span class="personnel-clr-label">CL-${s.clr}</span>
          </td>
          <td class="personnel-site">${s.site ? "Site-" + s.site : "—"}</td>
          <td class="personnel-status">
            <span class="${s.active === "Y" ? "personnel-active" : "personnel-inactive"}">
              ${s.active === "Y" ? "ACTIVE" : "INACTIVE"}
            </span>
          </td>
        </tr>`
    ).join("");
}

/* ── WINDOW ROUTER ───────────────────────────────────────────── */
function openWin(type, data) {
    if (type === "main") openMainWin();
    else if (type === "entities") openEntitiesWin();
    else if (type === "entity" && data !== undefined) openEntityWin(data);
    else if (type === "personnel") openpersonnelWin();
    else if (type === "sites") openSitesWin();
    else if (type === "terminal") openTerminalWin();
    else if (type === "worldmap") openMapWin();
    else if (type === "codeviewer") openCodeViewerWin();
}

/* ── TERMINAL ────────────────────────────────────────────────── */
const termHistory = [];
let termHIdx = -1;

function termKey(e) {
    const inp = document.getElementById("term-in");
    if (!inp) return;
    if (e.key === "Enter") {
        const cmd = inp.value.trim();
        if (cmd) {
            termHistory.unshift(cmd);
            termHIdx = -1;
            termPrint("C:\\NEOMS> " + cmd);
            termRun(cmd);
            inp.value = "";
        }
    } else if (e.key === "ArrowUp") {
        if (termHIdx < termHistory.length - 1) inp.value = termHistory[++termHIdx] || "";
    } else if (e.key === "ArrowDown") {
        inp.value = termHIdx > 0 ? termHistory[--termHIdx] : ((termHIdx = -1), "");
    }
}

function termPrint(txt, cls) {
    const out = document.getElementById("term-out");
    if (!out) return;
    const d = document.createElement("div");
    if (cls === "err") d.style.color = "#ff4444";
    else if (cls === "warn") d.style.color = "#ffaa00";
    else if (cls === "ok") d.style.color = "#00ee88";
    else if (cls === "dim") d.style.color = "#335544";
    d.textContent = txt;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
}

function termRun(raw) {
    const parts = raw.split(" ");
    const cmd = parts[0].toUpperCase();
    const args = parts.slice(1);
    switch (cmd) {
        case "HELP":
            [
                "HELP              — show this list",
                "LIST              — list records  (LIST ENTITIES | LIST personnel | LIST SITES)",
                "GET               — get entity by ID  (GET ENTITY ID)",
                "OPEN              — open entity window  (OPEN ENTITY ID)",
                "STATUS            — overall system status",
                "BREACH            — list breached entities",
                "MAP               — open interactive facility map (D3 — pan/zoom/click)",
                "CODE              — open source file viewer",
                "CLEAR             — clear terminal output",
                "VER               — version info",
                "SETCLR <1-5>      — set your clearance level",
                "CLRINFO           — show current clearance level",
                "WHOAMI            — show session identity",
                "TRANSMIT          — send your record to NeoMS Registry",
                "CLEARINTAKE       — wipe saved session and re-run intake"
            ].forEach((l) => termPrint("  " + l, "dim"));
            break;

        case "VER":
            termPrint("NeoMs OS Build 2026.02 — Schema v2.1", "ok");
            termPrint("Copyright NeoMS_Systems.");
            break;

        case "CLEAR": {
            const o = document.getElementById("term-out");
            if (o) o.innerHTML = "";
            break;
        }

        case "STATUS":
            termPrint("SYSTEM STATUS:", "ok");
            ENTITIES.forEach((e) =>
                termPrint(
                    "  E-" +
                        String(e.id).padStart(4, "0") +
                        " [" +
                        e.cls +
                        "] " +
                        e.name.padEnd(32, " ") +
                        " STATUS: " +
                        e.status,
                    e.status === "BREACHED" ? "err" : e.status === "MONITORED" ? "warn" : "dim"
                )
            );
            break;

        case "BREACH": {
            const br = ENTITIES.filter((e) => e.status === "BREACHED");
            br.length
                ? br.forEach((e) => termPrint("  [BREACH] E-" + String(e.id).padStart(4, "0") + " — " + e.name, "err"))
                : termPrint("  No active breaches.", "ok");
            break;
        }

        case "MAP":
            openMapWin();
            termPrint("Opening interactive facility map... (Pan: drag | Zoom: scroll | Click: site dossier)", "ok");
            break;

        case "CODE":
            openCodeViewerWin();
            termPrint("Opening NeoMS source file viewer...", "ok");
            break;

        case "LIST": {
            const sub = (args[0] || "").toUpperCase();
            if (sub === "ENTITIES" || sub === "")
                ENTITIES.forEach((e) =>
                    termPrint("  E-" + String(e.id).padStart(4, "0") + " [" + e.cls + "/" + e.ps + "] " + e.name)
                );
            else if (sub === "personnel")
                personnel.forEach((s) =>
                    termPrint("  S-" + s.id + " [CL-" + s.clr + "] " + s.fname + " " + s.lname + " — " + s.pos)
                );
            else if (sub === "SITES")
                SITES.forEach((s) => termPrint("  " + s.name + " — " + s.loc + " (" + s.status + ")"));
            else termPrint("Unknown list target. Try: LIST ENTITIES | LIST personnel | LIST SITES", "err");
            break;
        }

        case "GET": {
            const gs = (args[0] || "").toUpperCase(),
                gi = parseInt(args[1]);
            if (gs === "ENTITY" && !isNaN(gi)) {
                const e = ENTITIES.find((x) => x.id === gi);
                if (e) {
                    termPrint("--- E-" + String(e.id).padStart(4, "0") + " ---", "ok");
                    ["name", "cls", "ps", "status", "site", "protocols"].forEach((k) =>
                        termPrint(
                            "  " +
                                k.padEnd(10, " ") +
                                ": " +
                                (k === "site" ? "Site-" + e[k] : k === "protocols" ? e[k].length : e[k]),
                            e.status === "BREACHED" && k === "status" ? "err" : ""
                        )
                    );
                    termPrint("  [Tip: OPEN ENTITY " + gi + " to open wiki viewer]", "dim");
                } else termPrint("Entity ID " + gi + " not found.", "err");
            } else termPrint("Usage: GET ENTITY <id>", "err");
            break;
        }

        case "OPEN": {
            const os = (args[0] || "").toUpperCase(),
                oi = parseInt(args[1]);
            if (os === "ENTITY" && !isNaN(oi)) {
                const e = ENTITIES.find((x) => x.id === oi);
                e
                    ? (openWin("entity", oi), termPrint("Opening E-" + String(oi).padStart(4, "0") + "...", "ok"))
                    : termPrint("Entity not found.", "err");
            } else termPrint("Usage: OPEN ENTITY <id>", "err");
            break;
        }

        case "SETCLR": {
            const lvl = parseInt(args[0], 10);
            if (isNaN(lvl) || lvl < 1 || lvl > 5) {
                termPrint("Usage: SETCLR <1-5>", "err");
                break;
            }
            setClearance(lvl);
            termPrint("Clearance updated to CL-" + lvl + ". Taskbar indicator refreshed.", "ok");
            break;
        }

        case "CLRINFO":
            termPrint("Current clearance: CL-" + userClearance, "ok");
            termPrint(
                userClearance < 5 ? "  Access restricted. Some protocols may be filtered." : "  Full access granted.",
                "dim"
            );
            break;

        case "WHOAMI":
            if (sessionpersonnel) {
                termPrint("Session identity:", "ok");
                termPrint("  ID       : S-" + sessionpersonnel.id);
                termPrint("  Name     : " + sessionpersonnel.fname + " " + sessionpersonnel.lname);
                termPrint("  Dept     : " + sessionpersonnel.dept);
                termPrint("  CLR      : CL-" + sessionpersonnel.clr);
                termPrint("  Site     : Site-" + sessionpersonnel.site);
                termPrint(
                    "  Stored   : " + (lsLoad() ? "YES — session persisted locally" : "NO — session in memory only"),
                    "dim"
                );
            } else termPrint("No session identity on record.", "warn");
            break;

        case "TRANSMIT":
            if (!sessionpersonnel) {
                termPrint("No session identity. Complete intake first.", "err");
                break;
            }
            termPrint("Transmitting record to NeoMS Registry...", "warn");
            transmitToRegistry(sessionpersonnel)
                .then(() => {
                    termPrint("TRANSMISSION COMPLETE — record logged to central registry.", "ok");
                    termPrint("  S-" + sessionpersonnel.id + " / " + sessionpersonnel.fname + " " + sessionpersonnel.lname, "dim");
                })
                .catch((err) => {
                    termPrint("TRANSMISSION FAILED — " + err.message, "err");
                    termPrint("  Check connection or try again later.", "dim");
                });
            break;

        case "CLEARINTAKE":
            lsClear();
            sessionpersonnel = null;
            termPrint("Session data cleared from local storage.", "ok");
            termPrint("Reloading intake terminal in 3 seconds...", "warn");
            setTimeout(() => location.reload(), 3000);
            break;

        case "":
            break;
        default:
            termPrint("Unknown command: " + cmd + ". Type HELP.", "err");
    }
}

/* ═══════════════════════════════════════════════════════════════
   FORMSPREE TRANSMISSION
   ═══════════════════════════════════════════════════════════════ */
function transmitToRegistry(record) {
    return fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            personnel_id: "S-" + record.id,
            first_name: record.fname,
            last_name: record.lname,
            department: record.dept,
            clearance: "CL-" + record.clr,
            site: "Site-" + record.site,
            position: record.pos,
            timestamp: new Date().toISOString()
        })
    }).then((res) => {
        if (!res.ok) throw new Error("Server returned " + res.status);
        return res.json();
    });
}

/* ═══════════════════════════════════════════════════════════════
   INTERVIEW / BOOT SEQUENCE
   ═══════════════════════════════════════════════════════════════ */
const INTERVIEW_LINES = [
    { delay: 0, text: "NEOMS_OS v2.1 — Initializing..." },
    { delay: 600, text: "Loading containment partition... OK" },
    { delay: 1100, text: "Soul-coherence arrays: ONLINE" },
    { delay: 1600, text: "REWRITE boundary monitors: ELEVATED" },
    { delay: 2200, text: "Personnel authentication required." },
    { delay: 2800, text: "────────────────────────────────────────" },
    { delay: 3200, text: "NEW SYNTHETIC UNIT INTAKE PROTOCOL" },
    { delay: 3700, text: "Please provide identification for system registration." }
];

/* ── RETURNING USER — fast boot ──────────────────────────────── */
function fastBoot(record) {
    const screen = document.getElementById("iv-screen");
    const overlay = document.getElementById("iv-overlay");

    const lines = [
        { delay: 0, text: "NEOMS_OS v2.1 — Initializing..." },
        { delay: 500, text: "Loading containment partition... OK" },
        { delay: 900, text: "Soul-coherence arrays: ONLINE" },
        { delay: 1200, text: "────────────────────────────────────────" },
        { delay: 1400, text: "SESSION RECORD FOUND" },
        { delay: 1600, text: "personnel ID : S-" + record.id },
        { delay: 1750, text: "NAME     : " + record.fname + " " + record.lname },
        { delay: 1900, text: "DEPT     : " + record.dept },
        { delay: 2050, text: "CLR      : CL-" + record.clr },
        { delay: 2200, text: "────────────────────────────────────────" },
        { delay: 2400, text: "Welcome back, " + record.fname + ". Resuming session..." }
    ];

    lines.forEach(({ delay, text }) => {
        setTimeout(() => {
            const line = document.createElement("div");
            line.className = "iv-line iv-line-ok";
            line.textContent = text;
            screen.appendChild(line);
            screen.scrollTop = screen.scrollHeight;
        }, delay);
    });

    setTimeout(() => {
        overlay.classList.add("iv-fadeout");
        setTimeout(() => {
            overlay.style.display = "none";
            launchDesktop();
        }, 900);
    }, 2900);
}

/* ── NEW USER — full interview ───────────────────────────────── */
function startBoot() {
    const screen = document.getElementById("iv-screen");
    const form = document.getElementById("iv-form");
    let maxDelay = 0;

    INTERVIEW_LINES.forEach(({ delay, text }) => {
        maxDelay = Math.max(maxDelay, delay);
        setTimeout(() => {
            const line = document.createElement("div");
            line.className = "iv-line";
            line.textContent = text;
            screen.appendChild(line);
            screen.scrollTop = screen.scrollHeight;
        }, delay);
    });

    setTimeout(() => {
        form.classList.add("visible");
    }, maxDelay + 600);
}

/* ── SUBMIT INTERVIEW FORM ───────────────────────────────────── */
let nextpersonnelId = 2000;

function submitInterview() {
    const fname = document.getElementById("iv-fname").value.trim();
    const lname = document.getElementById("iv-lname").value.trim();
    const err = document.getElementById("iv-err");

    if (!fname || !lname) {
        err.textContent = "BOTH FIELDS REQUIRED";
        return;
    }
    err.textContent = "";

    const record = {
        id: nextpersonnelId++,
        fname,
        lname,
        pos: "Synthetic Intake Unit",
        dept: "SYNTHETICS",
        clr: 1,
        site: 62656,
        active: "Y"
    };

    personnel.push(record);
    sessionpersonnel = record;
    lsSave(record);
    setClearance(1);

    document.getElementById("iv-form").classList.remove("visible");
    showTransmitStep(record);
}

/* ── TRANSMISSION STEP ───────────────────────────────────────── */
function showTransmitStep(record) {
    const screen = document.getElementById("iv-screen");
    [
        "────────────────────────────────────────",
        "REGISTRATION COMPLETE",
        "personnel ID : S-" + record.id,
        "NAME     : " + record.fname + " " + record.lname,
        "DEPT     : SYNTHETICS",
        "CLR      : CL-1",
        "SITE     : Site-62656",
        "────────────────────────────────────────"
    ].forEach((t, i) => {
        setTimeout(() => {
            const l = document.createElement("div");
            l.className = "iv-line iv-line-ok";
            l.textContent = t;
            screen.appendChild(l);
            screen.scrollTop = screen.scrollHeight;
        }, i * 110);
    });

    setTimeout(
        () => {
            const txPanel = document.getElementById("iv-transmit");
            if (txPanel) txPanel.classList.add("visible");
        },
        9 * 110 + 200
    );
}

/* ── SEND TO FORMSPREE ───────────────────────────────────────── */
function doTransmit() {
    const btn = document.getElementById("iv-tx-btn");
    const status = document.getElementById("iv-tx-status");
    btn.disabled = true;
    btn.textContent = "TRANSMITTING...";
    status.textContent = "";
    status.style.color = "#ffaa00";
    status.textContent = "Establishing link to NeoMS Central Registry...";

    transmitToRegistry(sessionpersonnel)
        .then(() => {
            status.style.color = "#00ffaa";
            status.textContent = "TRANSMISSION CONFIRMED — record logged to central registry.";
            btn.textContent = "TRANSMITTED \u2713";
            setTimeout(proceedToDesktop, 1800);
        })
        .catch((err) => {
            status.style.color = "#ff4444";
            status.textContent = "TRANSMISSION FAILED — " + err.message + ". Session saved locally.";
            btn.disabled = false;
            btn.textContent = "\u25B6 RETRY TRANSMIT";
        });
}

/* ── SKIP TRANSMIT ───────────────────────────────────────────── */
function skipTransmit() {
    const screen = document.getElementById("iv-screen");
    const l = document.createElement("div");
    l.className = "iv-line";
    l.style.color = "#445566";
    l.textContent = "Transmission skipped. Session saved locally only.";
    screen.appendChild(l);
    screen.scrollTop = screen.scrollHeight;
    setTimeout(proceedToDesktop, 800);
}

/* ── PROCEED TO DESKTOP ──────────────────────────────────────── */
function proceedToDesktop() {
    const screen = document.getElementById("iv-screen");
    const overlay = document.getElementById("iv-overlay");
    const txPanel = document.getElementById("iv-transmit");
    if (txPanel) txPanel.classList.remove("visible");

    const l = document.createElement("div");
    l.className = "iv-line iv-line-ok";
    l.textContent = "Welcome, " + sessionpersonnel.fname + ". Booting desktop...";
    screen.appendChild(l);
    screen.scrollTop = screen.scrollHeight;

    setTimeout(() => {
        overlay.classList.add("iv-fadeout");
        setTimeout(() => {
            overlay.style.display = "none";
            launchDesktop();
        }, 900);
    }, 700);
}

function launchDesktop() {
    openMainWin();
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
    const clrInd = document.getElementById("clearance-indicator");
    if (clrInd) {
        clrInd.style.cursor = "pointer";
        clrInd.title = "Click to cycle clearance (or use SETCLR in terminal)";
        clrInd.addEventListener("click", cycleClearance);
    }

    // Restore saved clearance level first
    let savedClr = 1;
    try {
        savedClr = parseInt(localStorage.getItem("neoms_clearance"), 10) || 1;
    } catch (e) {}

    const saved = lsLoad();
    if (saved && saved.fname && saved.lname) {
        sessionpersonnel = saved;
        personnel.push(saved);
        setClearance(savedClr); // use persisted level, not session default
        fastBoot(saved);
    } else {
        setClearance(savedClr);
        startBoot();
    }
});
