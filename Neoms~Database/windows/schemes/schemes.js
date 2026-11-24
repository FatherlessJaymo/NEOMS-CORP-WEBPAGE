/* ============================================================
   NEOMS — CLASSIFICATION SCHEMES WINDOW
   Neoms~Database/windows/schemes/schemes.js
   Two sub-tabs in one section: the Entity Classification Scheme
   (classes + power scale) and the Personnel Position Scheme.
   ============================================================ */

/* ── Sub-tabs ─────────────────────────────────────────────────── */
const schemeRoot = document.querySelector("#wbody_" + winId + " .schemes-root");
if (schemeRoot) {
  const tabs = schemeRoot.querySelectorAll(".schemes-tab");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        const on = t === tab;
        t.classList.toggle("active-tab", on);
        t.setAttribute("aria-selected", String(on));
        schemeRoot.querySelector("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
      /* Start the newly shown scheme at the top */
      schemeRoot.querySelector(".scroll-area").scrollTop = 0;
    });
  });
}

/* ── ENTITY CLASSIFICATION SCHEME ─────────────────────────────── */

const CLASSES = [
  {
    code: "HD",
    name: "Hedonia",
    color: "#00cc66",
    cls: "class-HD",
    desc: "Low-risk, predictable anomalies. Behaviour patterns are consistent and non-threatening under standard conditions. Minimal containment resources required. HD-class entities may be housed in standard secure quarters with basic monitoring."
  },
  {
    code: "EU",
    name: "Eudaimonia",
    color: "#4488ff",
    cls: "class-EU",
    desc: "Stable, cooperative or neutral anomalies. May be amenable to controlled interaction or observation under sanctioned protocols. EU-class entities generally do not initiate hostile action but may respond defensively to perceived threat stimuli."
  },
  {
    code: "AR",
    name: "Arete",
    color: "#8888ff",
    cls: "class-AR",
    desc: "High-capability entities that remain containable under specialised infrastructure and dedicated Sentinel oversight. AR-class entities pose significant risk if containment lapses but do not actively seek breach. Protocols are well-defined and reliably effective."
  },
  {
    code: "NM",
    name: "Nemesis",
    color: "#ff3366",
    cls: "class-NM",
    desc: "Actively hostile and retaliatory anomalies. High threat to personnel. Breach risk is elevated and containment failures are frequent without rigorous protocol adherence. NM-class entities require armed Sentinel detail at all times and immediate suppression response on breach."
  },
  {
    code: "AP",
    name: "Aporia",
    color: "#cc44ff",
    cls: "class-AP",
    desc: "Defies conventional containment logic. Standard protocols may be ineffective, counterproductive, or paradoxically hazardous. AP-class entities require experimental or entity-specific containment methods developed by senior Research Specialists. Behaviour is non-deterministic."
  },
  {
    code: "KT",
    name: "Katastroph",
    color: "#ff6600",
    cls: "class-KT",
    desc: "Existential or extinction-level threat potential. Extreme containment measures and maximum Sentinel deployment are mandatory. A breach event for any KT-class entity constitutes a facility-wide emergency with immediate escalation to Overseer Prime. Mass casualty protocols are pre-authorised."
  }
];

const POWER_TIERS = [
  { tier: "TIER 11", levels: ["11-C", "11-B", "11-A"],                                                   note: "Below-standard human capability range" },
  { tier: "TIER 10", levels: ["10-C", "10-B", "10-A"],                                                   note: "Human to peak-human capability range" },
  { tier: "TIER 9",  levels: ["9-C", "9-B", "9-A"],                                                      note: "Superhuman capability range" },
  { tier: "TIER 8",  levels: ["8-C", "High 8-C", "8-B", "8-A"],                                          note: "Small building to large structure level" },
  { tier: "TIER 7",  levels: ["Low 7-C", "7-C", "High 7-C", "Low 7-B", "7-B", "7-A", "High 7-A"],       note: "City to country level" },
  { tier: "TIER 6",  levels: ["6-C", "High 6-C", "Low 6-B", "6-B", "High 6-B", "6-A", "High 6-A"],      note: "Continent to planetary level" },
  { tier: "TIER 5",  levels: ["5-C", "Low 5-B", "5-B", "5-A", "High 5-A"],                              note: "Moon to stellar level" },
  { tier: "TIER 4",  levels: ["Low 4-C", "4-C", "High 4-C", "4-B", "4-A"],                              note: "Solar system to multi-stellar level" },
  { tier: "TIER 3",  levels: ["3-C", "3-B", "3-A", "High 3-A"],                                          note: "Galaxy to multi-galaxy level" },
  { tier: "TIER 2",  levels: ["Low 2-C", "2-C", "2-B", "2-A"],                                           note: "Universe to multi-universe level" },
  { tier: "TIER 1",  levels: ["Low 1-C", "1-C", "High 1-C", "1-B", "High 1-B", "Low 1-A", "1-A", "High 1-A"], note: "Multiverse to high-multiverse level" },
  { tier: "TIER 0",  levels: ["0"],                                                                        note: "Beyond dimensional scale — boundless" }
];

/* Interpolate green → orange → red as tier increases */
const tierColor = (i, max) => {
  const t = i / (max - 1);
  const r = Math.round(0x00 + t * (0xff - 0x00));
  const g = Math.round(0xcc + t * (0x22 - 0xcc));
  const b = Math.round(0x66 + t * (0x22 - 0x66));
  return `rgb(${r},${g},${b})`;
};

/* ── Classification classes grid ──────────────────────────── */
const classSection = document.getElementById("class-section");
if (classSection) {
  classSection.innerHTML = `
    <div class="page-section-title scheme-section-title">Entity Classification Classes</div>
    <div class="scheme-class-grid">
      ${CLASSES.map(c => `
        <div class="scheme-class-card" style="border-color:${c.color}44;">
          <div class="scheme-class-header">
            <span class="class-badge ${c.cls}">${c.code}</span>
            <span class="scheme-class-name" style="color:${c.color};">${c.name}</span>
          </div>
          <div class="scheme-class-desc">${c.desc}</div>
        </div>`).join("")}
    </div>`;
}

/* ── Power scale reference ────────────────────────────────── */
const psSection = document.getElementById("ps-section");
if (psSection) {
  const rows = POWER_TIERS.map((t, i) => {
    const col = tierColor(i, POWER_TIERS.length);
    const pills = t.levels.map(l =>
      `<span class="scheme-ps-pill" style="border-color:${col}55;color:${col};">${l}</span>`
    ).join("");
    return `
      <div class="scheme-ps-row">
        <div class="scheme-ps-tier" style="color:${col};">${t.tier}</div>
        <div class="scheme-ps-right">
          <div class="scheme-ps-pills">${pills}</div>
          <div class="scheme-ps-note">${t.note}</div>
        </div>
      </div>`;
  }).join("");

  psSection.innerHTML = `
    <div class="page-section-title">Power Scale Reference</div>
    <div class="scheme-ps-subtitle">Anomaly threat tiers — ascending order of destructive potential</div>
    ${rows}`;
}

/* ── PERSONNEL POSITION SCHEME ────────────────────────────────── */

const ROLES = [
  {
    dept: "SYNTHETICS",
    positions: [
      {
        title: "Synthetic Unit",
        bio: "The base synthetic humanoid operative assigned to core facility operations. Designated for automated task execution under direct supervision with minimal autonomous decision-making authority. Synthetic Units serve as the primary labour force across non-critical zones and are processed through the Standard Intake Protocol on first registration."
      },
      {
        title: "Synthetic Asset",
        bio: "An advanced synthetic unit with augmented processing capability and adaptive behavioural routines. Assigned to specialised tasks requiring contextual response and limited independent action. Synthetic Assets may be deployed in proximity to low-tier anomalies under a Containment Enforcement escort."
      },
      {
        title: "Synthetic Drone",
        bio: "A non-humanoid synthetic platform built for surveillance, corridor patrol, and remote sampling. Synthetic Drones are sent where personnel cannot safely go — sealed chambers, breach zones, and unstable sites — and relay sensor data directly to the archive. They carry no decision-making authority and are considered expendable."
      },
      {
        title: "Synthetic Liaison",
        bio: "A social-interface synthetic designed to speak with sentient entities and new intake applicants. Liaisons hold no personal stake in an exchange, which makes them the preferred first contact for hostile or manipulative anomalies. All Liaison conversations are recorded and reviewed by Containment Research."
      },
      {
        title: "Synthetic Maintenance Frame",
        bio: "A heavy-duty synthetic that services containment hardware and repairs other synthetic units. Maintenance Frames work through the facility's off-shift hours, keeping cell locks, sensor grids, and power systems in working order. They are restricted from entering occupied containment cells."
      }
    ]
  },
  {
    dept: "FACILITY UNITS",
    positions: [
      {
        title: "Core Units Personnel",
        bio: "Primary human workforce assigned to daily facility maintenance, logistics, supply management, and operational support across all non-critical zones. Core Units Personnel form the backbone of site functionality and are cleared for movement throughout standard access corridors."
      },
      {
        title: "Sub Units Personnel",
        bio: "Secondary support personnel handling auxiliary tasks, equipment management, and lower-security facility functions. Sub Units Personnel operate under the direction of Core Units Personnel and are restricted to designated sub-zones within the installation."
      },
      {
        title: "Logistics Coordinator",
        bio: "Personnel who manage the movement of supplies, equipment, and transport between sites. Logistics Coordinators schedule deliveries around containment lockdowns and keep every site stocked for a breach. They are the first to notice when an entity's needs — food, power, materials — quietly change."
      },
      {
        title: "Medical Response Unit",
        bio: "Medical staff stationed on site to treat injured personnel and screen staff after anomalous exposure. Medical Response Units run decontamination, monitor for delayed effects, and certify personnel as fit for duty. Any symptom with no ordinary explanation is reported to Containment Research."
      },
      {
        title: "Systems Technician",
        bio: "Technicians responsible for the facility's networks, terminals, cameras, and the archive itself. Systems Technicians keep monitoring feeds running and isolate any system an entity interferes with. Because some anomalies spread through media and signals, all repairs follow quarantine procedure."
      }
    ]
  },
  {
    dept: "FACILITY COMMAND",
    positions: [
      {
        title: "Core Command Director",
        bio: "Senior facility administrators responsible for overseeing departmental operations, resource allocation, inter-departmental coordination, and escalation of critical incidents. Core Command Directors maintain authority over all standard facility operations and report directly to the Sub Command tier above."
      },
      {
        title: "Sub Command Director",
        bio: "Mid-tier command personnel managing specific facility sectors or sub-departments under Core Command authority. Sub Command Directors coordinate daily operations across assigned zones and serve as the primary point of contact for inter-departmental issues requiring administrative resolution."
      }
    ]
  },
  {
    dept: "CONTAINMENT ENFORCEMENT",
    positions: [
      {
        title: "Sentinel Senior Officer Forces",
        bio: "Elite containment enforcement officers authorised for direct interaction with high-threat anomalies. Lead breach response teams, coordinate armed suppression operations, and hold authority to escalate containment status. Sentinel Senior Officers are required to maintain active certification in anomaly suppression protocol annually."
      },
      {
        title: "Sentinel Forces",
        bio: "Standard containment enforcement personnel trained in anomaly suppression, perimeter security, and emergency response protocols. Sentinel Forces maintain watch across containment corridors and are the first response unit in the event of a containment breach or security incident."
      }
    ]
  },
  {
    dept: "CONTAINMENT RESEARCH",
    positions: [
      {
        title: "Anomaly Research Specialist",
        bio: "Senior researchers conducting advanced study of anomalous entities and phenomena. Responsible for designing and evaluating containment protocols, producing theoretical frameworks for anomaly classification, and leading multi-analyst research teams. Research Specialists hold elevated access privileges to entity dossiers and experimental containment data."
      },
      {
        title: "Anomaly Research Analyst",
        bio: "Junior research personnel assisting in data collection, protocol documentation, observation logging, and preliminary anomaly assessment. Analysts operate under the direction of a Research Specialist and may access standard entity records relevant to their assigned study area."
      },
      {
        title: "Field Researcher",
        bio: "Researchers deployed outside the facility to investigate sightings, recover evidence, and assess anomalies before they are contained. Field Researchers travel with a Containment Enforcement escort and file the first observation report on most new entities. Many entity files begin with their notes."
      },
      {
        title: "Containment Engineer",
        bio: "Specialists who design and build containment cells, wards, and suppression equipment tailored to individual entities. Containment Engineers translate research findings into physical safeguards and are called in whenever a protocol fails. Every cell modification requires their sign-off."
      },
      {
        title: "Xenolinguist",
        bio: "Researchers who study how sentient entities communicate — speech, signals, symbols, or behaviour. Xenolinguists conduct and transcribe entity interviews and are trained to recognise manipulation and memetic language. They never conduct an interview alone."
      },
      {
        title: "Archivist",
        bio: "Keepers of the NeoMS archive. Archivists file reports, manage redactions, and verify that every record matches its clearance level. They are the last line against an entity rewriting its own history, and the only researchers who read every file."
      }
    ]
  },
  {
    dept: "PRIME DIRECTOR",
    positions: [
      {
        title: "Directive Control Officer",
        bio: "High-authority personnel with oversight of classified directives, strategic containment policy, and inter-site coordination. Directive Control Officers operate with broad executive authority and report directly to the Overseer Prime. Their designations and assignments are not publicly listed in standard personnel records."
      },
      {
        title: "AI Overseer",
        bio: "The artificial intelligence that runs the NeoMS archive. The AI Overseer watches every site feed, files every report, and answers every terminal — no record enters or leaves the archive without passing through it. It holds full CL-5 access alongside the Overseer Prime and logs everything operators type. The position has only ever had one occupant: Nova."
      },
      {
        title: "Overseer Prime",
        bio: "The supreme administrative authority of the NeoMS installation. All facility operations, containment decisions, resource deployment, and personnel matters are subject to Overseer Prime jurisdiction. The Overseer Prime is the sole individual with full CL-5 access privileges by default and coordinates directly with NeoMS Central."
      }
    ]
  }
];

/* Clearance level per position — the source of truth for CL tiers.
   Pip colours live in Databaselog.css (--clr-1 … --clr-5). */
const POSITION_CLR = {
  "Synthetic Unit": 1,
  "Synthetic Asset": 1,
  "Synthetic Drone": 1,
  "Synthetic Liaison": 1,
  "Synthetic Maintenance Frame": 1,
  "Core Units Personnel": 2,
  "Sub Units Personnel": 2,
  "Logistics Coordinator": 2,
  "Medical Response Unit": 2,
  "Systems Technician": 2,
  "Core Command Director": 2,
  "Sub Command Director": 2,
  "Sentinel Senior Officer Forces": 3,
  "Sentinel Forces": 3,
  "Anomaly Research Specialist": 3,
  "Anomaly Research Analyst": 3,
  "Field Researcher": 3,
  "Containment Engineer": 3,
  "Xenolinguist": 3,
  "Archivist": 3,
  "Directive Control Officer": 4,
  "AI Overseer": 5,
  "Overseer Prime": 5
};

/* Departments sharing a clearance level use light/dark shades of that level's colour */
const DEPT_COLORS = {
  "SYNTHETICS":              { border: "#00cc66", color: "#00cc66" },
  "FACILITY UNITS":          { border: "#77aaff", color: "#77aaff" },
  "FACILITY COMMAND":        { border: "#4488ff", color: "#4488ff" },
  "CONTAINMENT ENFORCEMENT": { border: "#ff3366", color: "#ff3366" },
  "CONTAINMENT RESEARCH":    { border: "#ff85a8", color: "#ff85a8" },
  "PRIME DIRECTOR":          { border: "#ff6600", color: "#ff6600" }
};

const clrBadge = n => `<span class="ss-clr"><span class="clr-pip clr-${n}"></span>CL-${n}</span>`;

const wrap = document.getElementById("scheme-content");
if (wrap) {
  wrap.innerHTML = ROLES.map(group => {
    const dc = DEPT_COLORS[group.dept] || { border: "#334", color: "#667" };
    const levels = [...new Set(group.positions.map(p => POSITION_CLR[p.title]))].sort();

    const rows = group.positions.map(p => `
      <div class="ss-role-card" style="border-left-color:${dc.border}33;">
        <div class="ss-role-title">${p.title} ${clrBadge(POSITION_CLR[p.title])}</div>
        <div class="ss-role-dept" style="color:${dc.color};">${group.dept}</div>
        <div class="ss-role-bio">${p.bio}</div>
      </div>`).join("");

    return `
      <div class="ss-dept-group">
        <div class="ss-dept-header" style="color:${dc.color};border-bottom-color:${dc.border}44;">
          &#9658; ${group.dept} ${levels.map(clrBadge).join("")}
        </div>
        ${rows}
      </div>`;
  }).join("");
}
