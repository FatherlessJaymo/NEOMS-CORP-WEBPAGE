/* ============================================================
   NEOMS — ENTITY CLASSIFICATION SCHEME WINDOW
   Neoms~Database/windows/entity-scheme/entity-scheme.js
   ============================================================ */

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
