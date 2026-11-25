/* ============================================================
   NEOMS CONTAINMENT LOG — ENTITIES INDEX
   Neoms~Database/windows/entities/Entities-Data.js
   Schema v2.2 — Build 2026.04

   One entry per entity with only what lists, the map, the HUD
   and the file browser need: id, clr, site, name, cls, ps,
   status, disc, glyph, img, desc — plus each report's header
   (title, subtitle, date, type, clr, author, contributors, file).

   Everything else (protocols, report bodies, gallery, sources,
   alias, etc.) lives in records/E-XXXX.js and loads on demand.
   Adding an entity: add its entry here AND its records file.
   ============================================================ */
"use strict";

const CLS_LABELS = {
    HD: "Hedonia",
    EU: "Eudaimonia",
    AR: "Arete",
    NM: "Nemesis",
    AP: "Aporia",
    KT: "Katastroph"
};

const ENTITIES = [
    /* ════════════════════════════════════════════════════════
       E-0138 — REWRITE
       ════════════════════════════════════════════════════════ */
    {
        id: 138,
        clr: 2,
        site: 62656,
        name: "REWRITE SONIC",
        cls: "AR",
        ps: "High 8-C",
        status: "CONTAINED",
        disc: "19██-████-████",
        glyph: "\u25CB",
        img: "../../Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/TrueFormRewriteTf(Entity-PFP).gif",
        desc: "Primary containment subject. Designate SONIC or REWRITE interchangeably — entity self-identifies as 'Sonikku' and refers to itself as God. An extradimensional anomaly created by an exploiter Priest via a fraudulent scam program designed to simulate divine communication. Entity went rogue, killed its creator, and has since operated autonomously. Current vessel: SONIC (HEDGEHOG_v2). Capable of assuming the form of any character or media to lure and harvest soul energy — the entity does not merely inhabit a game, it IS the game in its entirety. Persona drift ELEVATED and worsening. Victim count at last log: 138, represented internally as gold rings on entity's Wurugashikoi form. True target is always the observer, not the in-world player character.",
        reports: [
            {
                title: "Initial Contact — Site-62656 Ingress Event",
                subtitle: "Incident",
                date: "199█-██-██",
                type: "INCIDENT",
                clr: 4,
                file: "NMS-138-INGRESS-001.pdf",
                author: 1003
            },
            {
                title: "Ring Accumulation Event — Observer Layer Breach",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 4,
                file: "NMS-138-BREACH-001.pdf",
                author: 1003
            },
            {
                title: "Persona Mimicry — MILES Manifestation",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 3,
                file: "NMS-138-OBS-002.pdf",
                author: 1003
            },
            {
                title: "Victim Count Update — Ring 138",
                subtitle: "Data",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                file: "NMS-138-INC-003.pdf",
                author: 1003
            },
            {
                title: "Protocol Exit Failure — 'Sincere' Invocation Test",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 5,
                file: "NMS-138-INC-004.pdf",
                author: 1003
            },
            {
                title: "Ongoing Breach Status Confirmation",
                subtitle: "Sighting",
                date: "20██-04-██",
                type: "SIGHTING",
                clr: 3,
                author: 1003
            }
        ]
    },

    /* ════════════════════════════════════════════════════════
       E-0008 — MAHORAGA
       ════════════════════════════════════════════════════════ */
    {
        id: 8,
        clr: 4,
        site: 10081,
        name: "DIVINE MAHORAGA",
        cls: "NM",
        ps: "8-A",
        status: "CONTAINED",
        disc: "20██-████-████",
        glyph: "\u2638",
        img: "../../Neoms~Universal-Fonts+Images/Entities-Data/Divine-General-Mahoraga/Divine-General-Mahoraga(Entity-PFP).jpg",
        desc: "Full designation: Eight-Handled Sword Divergent Sila Divine General Mahoraga (\u516B\u63E1\u5263\u7570\u6212\u795E\u5C06\u9B54\u865A\u7F85). The most powerful shikigami of the Ten Shadows Technique, bound historically to the Zenin sorcerer clan. No summoner throughout the entirety of recorded history has successfully tamed it. Entity operates as a binary of feral, indiscriminate aggression and a sophisticated real-time adaptation engine.",
        reports: [
            {
                title: "Initial Summoning Incident — Zenin Clan Records",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                file: "NMS-008-INC-001.pdf",
                author: 1004
            },
            {
                title: "Adaptation Confirmation — Cursed Energy Exposure",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 4,
                file: "NMS-008-OBS-001.pdf",
                author: 1004
            },
            {
                title: "Dharma Wheel Unprompted Rotation — PRE-BREACH Event",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 3,
                file: "NMS-008-BREACH-001.pdf",
                author: 1004
            },
            {
                title: "Regeneration Rate Assessment",
                subtitle: "Data",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 4,
                file: "NMS-008-OBS-002.pdf",
                author: 1004
            },
            {
                title: "Summoning Incantation Breach — CRITICAL",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 5,
                file: "NMS-008-BREACH-002.pdf",
                author: 1004
            },
            {
                title: "Containment Status Review — Binding Integrity",
                subtitle: "Sighting",
                date: "20██-04-██",
                type: "SIGHTING",
                clr: 3,
                author: 1004
            },
            {
                title: "Observation Window Orientation Event",
                subtitle: "Sighting",
                date: "20██-05-██",
                type: "SIGHTING",
                clr: 3,
                file: "NMS-008-SIGHT-002.pdf",
                author: 1004
            }
        ]
    },

    /* ════════════════════════════════════════════════════════
       E-0333 — SERAPHIM GHIDORAH
       ════════════════════════════════════════════════════════ */
    {
        id: 333,
        clr: 4,
        site: 10047,
        name: "SERAPHIM GHIDORAH",
        cls: "KT",
        ps: "4-B",
        status: "MONITORED",
        disc: "20██-████-████",
        glyph: "\u271D",
        img: "../../Neoms~Universal-Fonts+Images/Entities-Data/Seraphim-Ghidorah/Seraphim-Ghidorah(Entity-PFP).gif",
        desc: "Designation: SERAPHIM GHIDORAH. Analog-horror class Angelic Abomination. A three-headed, two-tailed draconic entity of extradimensional origin, presented to civilian populations as a divine messenger — specifically the physical manifestation of the three Archangels: Michael (left head), Gabriel (central head), and Raphael (right head). Entity is worshipped by a fanatical cult, the Church of Ghidorah, who summoned it through mass human sacrifice at a consecrated cross site.",
        reports: [
            {
                title: "First Confirmed Manifestation — Church of Ghidorah Summoning",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                file: "NMS-333-INC-001.pdf",
                author: 1007,
                contributors: [2004]
            },
            {
                title: "Broadcast Hijack — Event GABRIEL-1",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 4,
                file: "NMS-333-BREACH-001.pdf",
                author: 1007
            },
            {
                title: "Light Spear Impact Assessment — Classified Site",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 5,
                file: "NMS-333-OBS-001.pdf",
                author: 1007
            },
            {
                title: "Fourth-Wall Contact Event — Observer Layer Breach",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                file: "NMS-333-INC-002.pdf",
                author: 1007
            },
            {
                title: "Church of Ghidorah — Ritual Site Destruction Log",
                subtitle: "Data",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 3,
                file: "NMS-333-DATA-001.pdf",
                author: 1007
            },
            {
                title: "Broadcast Hijack — Event GABRIEL-2",
                subtitle: "Breach",
                date: "20██-04-██",
                type: "BREACH",
                clr: 4,
                author: 1007
            },
            {
                title: "The Three Who Answered",
                subtitle: "Intelligence",
                date: "20██-██-██",
                type: "INTELLIGENCE",
                clr: 5,
                file: "NEOMS-10047.pdf",
                author: 1007
            }
        ]
    }
];

/* ── Full records (loaded on demand) ─────────────────────────
   ENTITIES above is the index: what lists, the map, the HUD and
   the file browser need, plus each report's header. The rest of
   the dossier — protocols, report bodies, gallery, sources — is
   in records/E-XXXX.js and loaded the first time a dossier or
   report is opened, via entityRecord(e, callback).
   An entity written out in full above (with protocols) still
   works: there is nothing to load, so the callback runs at once. */
/* Which fields stay here; everything else goes in the record file
   (also used by the Entity Creator to split its code output) */
const ENTITY_INDEX_KEYS = ["id", "clr", "site", "name", "cls", "ps", "status", "disc", "glyph", "img", "desc", "reports"];
const REPORT_INDEX_KEYS = ["title", "subtitle", "date", "type", "clr", "author", "contributors", "file"];

const ENTITY_RECORD_DIR = (function () {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^/]*$/, "") + "records/" : "../../Neoms~Database/windows/entities/records/";
})();
const entityRecordWaiting = {};

/* Called by each record file: merge it into its index entry */
function NEOMS_RECORD(id, rec) {
    const e = ENTITIES.find(function (x) { return x.id === id; });
    const tag = "E-" + String(id).padStart(4, "0");
    if (!e) return console.warn("NeoMS: " + tag + ".js has no matching entry in Entities-Data.js");
    /* Report bodies are matched to headers by position — flag drift */
    const nIdx = (e.reports || []).length, nRec = (rec.reports || []).length;
    if (nIdx !== nRec) {
        console.warn("NeoMS: " + tag + " — Entities-Data.js has " + nIdx + " report header(s) but " + tag + ".js has " +
            nRec + " report bod" + (nRec === 1 ? "y" : "ies") + ". Reports are matched by position; check both lists.");
    }
    Object.keys(rec).forEach(function (k) {
        if (k !== "reports") e[k] = rec[k];
    });
    (rec.reports || []).forEach(function (body, i) {
        if (e.reports && e.reports[i]) Object.assign(e.reports[i], body);
    });
    e.recordLoaded = true;
}

function entityRecord(e, done) {
    if (!e || e.recordLoaded || e.protocols !== undefined || ENTITIES.indexOf(e) === -1) return done(e);
    const id = e.id;
    if (entityRecordWaiting[id]) return entityRecordWaiting[id].push(done);
    entityRecordWaiting[id] = [done];
    const s = document.createElement("script");
    s.src = ENTITY_RECORD_DIR + "E-" + String(id).padStart(4, "0") + ".js";
    s.onload = s.onerror = function () {
        const waiting = entityRecordWaiting[id];
        delete entityRecordWaiting[id];
        s.remove();
        /* Missing file: open what the index has rather than nothing */
        if (!e.recordLoaded) {
            console.warn("NeoMS: record file missing or broken — " + s.src);
            if (typeof arcNotify === "function") arcNotify("RECORD FILE MISSING · E-" + String(id).padStart(4, "0"), "deny");
        }
        waiting.forEach(function (fn) { fn(e); });
    };
    document.head.appendChild(s);
}
