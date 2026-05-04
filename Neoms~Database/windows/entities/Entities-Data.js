/* ============================================================
   NEOMS CONTAINMENT LOG — ENTITIES DATA
   Neoms~Database/windows/entities/Entities-Data.js
   Schema v2.2 — Build 2026.04
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
        img: "/Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/TrueFormRewriteTf(Entity-PFP).gif",
        bioImages: [
            {
                src: "/Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/RedRingsRewrite.webp",
                caption: "Wurugashikoi state — ring count 138"
            },
            {
                src: "/Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/TrueFormRewriteTf(Entity-PFP).gif",
                caption: "True form — partial capture"
            },
            {
                src: "/Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/MidaretaState.png",
                caption: "Midareta state — 2 rings confirmed"
            }
        ],
        desc: "Primary containment subject. Designate SONIC or REWRITE interchangeably — entity self-identifies as 'Sonikku' and refers to itself as God. An extradimensional anomaly created by an exploiter Priest via a fraudulent scam program designed to simulate divine communication. Entity went rogue, killed its creator, and has since operated autonomously. Current vessel: SONIC (HEDGEHOG_v2). Capable of assuming the form of any character or media to lure and harvest soul energy — the entity does not merely inhabit a game, it IS the game in its entirety. Persona drift ELEVATED and worsening. Victim count at last log: 138, represented internally as gold rings on entity's Wurugashikoi form. True target is always the observer, not the in-world player character.",
        aprop: "Soul harvesting via ring accumulation mechanic. Reality boundary dissolution. Persona mimicry across all media formats. Mind reading and progressive psychological contamination of targets. Existence as the medium itself — entity is not in the game, it is the game. Cross-dimensional observation and targeting of the observer layer. Limb detachment and free spatial movement. Environmental destabilisation proportional to self-awareness state.",
        phys: "Default: anthropomorphic blue hedgehog approx. 1m tall with elongated legs, thick glove and shoe cuffs, and pupils that freely constrict and dilate. Distinctive wide, permanent grin. No blood stains or red eyes unlike similar EXE-class entities. Midareta state (2 rings): monochromatic colouration, dark realistic pupils, rising dorsal quills. Wurugashikoi state (3 rings / full soul harvest): red rings appear on limbs, eyes hollow. True form: undocumented. All recording equipment exposed to true form has failed.",
        dims: "Variable. Entity is not confined to a single spatial container — it occupies whatever digital medium it currently inhabits in totality.",
        sentient: "Y",
        hostile: "Y",
        safety: "LETHAL",
        discoveredBy: 1003,
        contributors: [],
        sources: [
            {
                type: "wiki",
                label: "The Sonic Oddities Wiki",
                url: "https://continued-exe.fandom.com/wiki/Rewrite"
            },
            {
                type: "youtube",
                label: "Sonic.EXE — Full Lore & Origin Explained",
                url: "https://www.youtube.com/watch?v=WIJRKBDYyKk&t=158s"
            }
        ],
        protocols: [
            {
                type: "CONTAINMENT",
                clr: 2,
                desc: "Current protocol is observation-only. All personnel below must not acknowledge REWRITE directly. Maintain minimum 50m exclusion radius. Do not collect rings within containment zone. Do not run, load, or emulate any digital Sonic the Hedgehog media within Site-62656 perimeter — entity may use it as an ingress vector. Personnel must not provide their name under any circumstances if entity initiates contact.",
                equipment:
                    "Anomaly-grade observation array, soul-coherence monitors, media-isolation Faraday enclosure",
                duration: null,
                personnel: 10
            },
            {
                type: "INTERACTION",
                clr: 2,
                desc: "No direct interaction authorised at any clearance level. If REWRITE initiates contact, do not respond to personal questions. Do not provide your name. Terminate session immediately by speaking the phrase: 'Protocol Exit — Sincere.' Entity is contractually bound to honour this phrase. Do not attempt to outplay, outsmart, or beat the entity — it treats this as engagement and escalates. If entity enters Midareta state during contact, evacuate the digital environment immediately.",
                equipment: "Memetic filter headgear (Class-3), soul-coherence personal monitor",
                duration: 5,
                personnel: 5
            },
            {
                type: "BREACH",
                clr: 3,
                desc: "In the event of boundary dissolution event: immediately evacuate all vessels from SOUL_CACHE. Do not attempt to close the program — entity will interpret this as continued engagement. Initiate Rule-6 invocation. If entity has entered Wurugashikoi state, personnel exposure to the anomaly must be considered total — assume soul-coherence failure. Cordon Site-62656 entirely. Casualties should be expected. Note: entity's true target is always the observer.",
                equipment: "Emergency evacuation units, Class-A memetic barriers, observer-layer isolation protocol",
                duration: null,
                personnel: "ALL FACILITY UNITS"
            }
        ],
        reports: [
            {
                title: "Initial Contact — Site-62656 Ingress Event",
                subtitle: "Incident",
                date: "199█-██-██",
                type: "INCIDENT",
                clr: 4,
                summary:
                    "First confirmed ingress event at Site-62656. Entity manifested within a SONIC (HEDGEHOG_v2) emulation running on a quarantined terminal in Research Wing C. Three personnel were exposed before the session was terminated. Soul-coherence monitors registered degraded readings on all three subjects post-exposure. Entity was observed in default state throughout — no state escalation occurred. Personnel have since been placed on indefinite medical observation. This incident marks the formal opening of E-0138's containment file.",
                file: "NMS-138-INGRESS-001.pdf",
                author: 1003
            },
            {
                title: "Ring Accumulation Event — Observer Layer Breach",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 4,
                summary:
                    "Entity transitioned from default state to Midareta state (2 rings confirmed) during an unauthorised remote observation session conducted by a CL-2 analyst. Entity appeared to detect the observer through the recording feed — not the in-session player character. Session was terminated upon Midareta confirmation per protocol. The analyst has not recovered full soul-coherence. Recording array was wiped clean of all footage; only the soul-coherence monitor logs remain. REWRITE is now confirmed to actively monitor the observer layer independent of in-world interaction.",
                file: "NMS-138-BREACH-001.pdf",
                author: 1003
            },
            {
                title: "Persona Mimicry — TAILS Manifestation",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 3,
                summary:
                    "Entity was recorded adopting the appearance and vocal cadence of TAILS (PROWER_v1) for approximately 14 minutes during an incidental exposure event. The lure appeared targeted at the exposed subject's prior media history — entity had apparently profiled the target before manifestation. Persona mimicry was near-perfect; the subject did not identify the anomaly until entity broke character and addressed them by name. Subject had not provided their name at any point. This confirms entity's independent identity-retrieval capability. Persona mimicry count is now logged at 6 unique character templates.",
                file: "NMS-138-OBS-002.pdf",
                author: 1003
            },
            {
                title: "Victim Count Update — Ring 138",
                subtitle: "Data",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                summary:
                    "Entity's Wurugashikoi form was briefly observed via indirect camera relay during an unsanctioned media playback event in Sector 4. Ring count confirmed at 138 — matching the entity's own designation. Whether this is coincidence or deliberate framing by the entity is under active debate. Entity was in Wurugashikoi state for approximately 3 seconds before all recording arrays failed. One partial image was recovered. All personnel in Sector 4 at the time reported hearing their own name spoken from no identifiable source.",
                file: "NMS-138-INC-003.pdf",
                author: 1003
            },
            {
                title: "Protocol Exit Failure — 'Sincere' Invocation Test",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 5,
                summary: "[SUMMARY CLASSIFIED — CL-5 CLEARANCE REQUIRED]",
                file: "NMS-138-INC-004.pdf",
                author: 1003
            },
            {
                title: "Ongoing Breach Status Confirmation",
                subtitle: "Sighting",
                date: "20██-04-██",
                type: "SIGHTING",
                clr: 3,
                summary:
                    "Routine perimeter sweep confirmed entity remains uncontained and active. Media-isolation Faraday enclosure is holding; no new ingress events have been recorded this quarter. Soul-coherence monitors at nominal. However, two analysts in Wing B reported hearing a faint audio cue — the opening notes of GREEN HILL ZONE — with no active media source identified. No personnel entered the 50m exclusion zone. Logging as a sighting event per standard protocol. BREACH status maintained.",
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
        img: "/Neoms~Universal-Fonts+Images/Entities-Data/Divine-General-Mahoraga/Divine-General-Mahoraga(Entity-PFP).jpg",
        desc: "Full designation: Eight-Handled Sword Divergent Sila Divine General Mahoraga (\u516B\u63E1\u5263\u7570\u6212\u795E\u5C06\u9B54\u865A\u7F85). The most powerful shikigami of the Ten Shadows Technique, bound historically to the Zenin sorcerer clan. No summoner throughout the entirety of recorded history has successfully tamed it. Entity operates as a binary of feral, indiscriminate aggression and a sophisticated real-time adaptation engine.",
        aprop: "Reactive adaptation (tekio) to any and all phenomena — entity needs only a single exposure to begin adaptation. Repeated exposure accelerates the process considerably. Upon completion, entity becomes fully immune to the encountered phenomenon. Mid-grade regeneration from severe injury. Superhuman physical strength capable of displacing targets through multiple structures with a single strike.",
        phys: "Towering muscular humanoid, estimated 3\u20134m. White colouration. Four large wings protrude from eye sockets. Tail-like appendage extends from rear cranium. Black hakama, white sash. A golden eight-spoked Dharma wheel (h\u014Djin) hovers above the entity at all times — this wheel rotates in direct response to new stimuli and serves as the visible engine of the entity's adaptation process.",
        dims: "Standard. Physical mass consistent with observed form. Entity does not exhibit spatial anomaly under normal conditions.",
        sentient: "U",
        hostile: "Y",
        safety: "LETHAL",
        discoveredBy: 1003,
        contributors: [],
        sources: [
            {
                type: "wiki",
                label: "Mahoraga — Jujutsu Kaisen Wiki (Fandom)",
                url: "https://jujutsu-kaisen.fandom.com/wiki/Eight-Handled_Sword_Divergent_Sila_Divine_General_Mahoraga"
            }
        ],
        protocols: [
            {
                type: "CONTAINMENT",
                clr: 4,
                desc: "Entity is held under provisional exorcism-ritual binding. This containment is NOT guaranteed to hold indefinitely. Under no circumstances should the summoning incantation ('Furube Yurayura...') be spoken within Site-10081 perimeter. The entity's Dharma wheel must be monitored at all times — any unprompted rotation constitutes a PRE-BREACH condition and must be reported to CL-4 personnel immediately.",
                equipment:
                    "Anomaly-spin sensor array, positive-energy field emitters (Class-4), full-perimeter cursed barrier, exorcism-ritual binding anchors (x8)",
                duration: null,
                personnel: 16
            },
            {
                type: "INTERACTION",
                clr: 4,
                desc: "No direct interaction permitted below CL-4. Entity does not communicate verbally. CRITICAL RULE: Do not repeat any technique, attack pattern, or action more than once in the entity's presence. Single-exposure adaptation has been confirmed. Engagement must use a maximum-output single strike or not be attempted at all.",
                equipment:
                    "Positive-energy containment suit, cursed-energy suppression monitoring array, remote failsafe detonator",
                duration: 10,
                personnel: 4
            },
            {
                type: "BREACH",
                clr: 4,
                desc: "In the event of containment failure, standard engagement protocols DO NOT APPLY. Do not use repeated techniques — the entity will adapt and become immune before the second attempt lands. Do not deploy curse-type weapons. Any viable breach response requires a single maximum-output strike capable of total obliteration before the adaptation cycle completes.",
                equipment:
                    "Maximum-output anomaly strike units, Site-wide barrier collapse switch, Class-A evacuation units",
                duration: null,
                personnel: "ALL FACILITY UNITS"
            }
        ],
        reports: [
            {
                title: "Initial Summoning Incident — Zenin Clan Records",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                summary:
                    "Entity was first logged following recovery of Zenin clan summoning records detailing an unsuccessful taming attempt. All summoners involved were confirmed deceased. The exorcism-ritual binding anchors now in use at Site-10081 are adapted from a partial containment schema found within those records. Entity's Dharma wheel was observed rotating continuously for 72 hours following the binding — rotation ceased without explanation. Classified as a PRE-BREACH event. No personnel casualties during initial containment setup.",
                file: "NMS-008-INC-001.pdf",
                author: 1003
            },
            {
                title: "Adaptation Confirmation — Cursed Energy Exposure",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 4,
                summary:
                    "A CL-4 research team conducted a controlled single-exposure test using a low-grade cursed energy pulse directed at the containment barrier. Entity's Dharma wheel registered a full rotation within 0.3 seconds of exposure. Subsequent identical pulse was deflected entirely — entity had fully adapted. Test was terminated after one exposure per protocol. Confirms that even indirect energy contact through the barrier is sufficient to trigger the tekio cycle. All future observation must be strictly passive.",
                file: "NMS-008-OBS-001.pdf",
                author: 1003
            },
            {
                title: "Dharma Wheel Unprompted Rotation — PRE-BREACH Event",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 3,
                summary:
                    "At 03:14 local time, the anomaly-spin sensor array registered an unprompted Dharma wheel rotation lasting approximately 8 seconds. No external stimulus was identified. All personnel were placed on PRE-BREACH alert for 48 hours. No breach occurred. Entity returned to dormant posture by morning watch. The cause of the unprompted rotation remains unresolved. Current hypothesis: entity may be adapting to stimuli outside the observable spectrum. Recommendation to upgrade sensor array to Class-5 submitted to Overseer Prime.",
                file: "NMS-008-BREACH-001.pdf",
                author: 1003
            },
            {
                title: "Regeneration Rate Assessment",
                subtitle: "Data",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 4,
                summary:
                    "Following a structural failure in the eastern binding anchor (non-entity cause — seismic activity), the entity sustained a minor laceration from the anchor collapse debris before the backup anchor engaged. Full tissue regeneration was documented in 11 minutes. The adaptation cycle was not observed to trigger in response to the physical damage — confirming regeneration and tekio are independent systems. The damaged anchor has since been replaced. No breach occurred. Entity did not react to the repair crew.",
                file: "NMS-008-OBS-002.pdf",
                author: 1003
            },
            {
                title: "Summoning Incantation Breach — CRITICAL",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 5,
                summary: "[SUMMARY CLASSIFIED — CL-5 CLEARANCE REQUIRED]",
                file: "NMS-008-BREACH-002.pdf",
                author: 1003
            },
            {
                title: "Containment Status Review — Binding Integrity",
                subtitle: "Sighting",
                date: "20██-04-██",
                type: "SIGHTING",
                clr: 3,
                summary:
                    "Quarterly binding integrity inspection completed. All 8 exorcism-ritual anchors confirmed at nominal tension. Dharma wheel has not rotated unprompted in 94 days — longest recorded stable period. Positive-energy field emitters operating at 97% output. Entity remains in dormant stance. No vocalisation, movement, or adaptation events logged this quarter. Containment status: STABLE. Note logged for the record: entity has not once faced toward the observation window in 94 days. This is statistically anomalous given prior behavioural data. Monitoring continues.",
                author: 1003
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
        img: "/Neoms~Universal-Fonts+Images/Entities-Data/Seraphim-Ghidorah/Seraphim-Ghidorah(Entity-PFP.jpg",
        desc: "Designation: SERAPHIM GHIDORAH. Analog-horror class Angelic Abomination. A three-headed, two-tailed draconic entity of extradimensional origin, presented to civilian populations as a divine messenger — specifically the physical manifestation of the three Archangels: Michael (left head), Gabriel (central head), and Raphael (right head). Entity is worshipped by a fanatical cult, the Church of Ghidorah, who summoned it through mass human sacrifice at a consecrated cross site.",
        aprop: "Three light spears (simultaneous deployment, one per head). Black hole generation — capable of countering and nullifying directed energy attacks. Mass psychological influence and brainwashing via broadcast hijacking. Summoning-dependent mass conversion via human sacrifice. Mind control extended onto unshielded human targets. Public broadcast override — confirmed twice in documented incidents. Fourth-wall-class memetic hazard: entity has been observed directly addressing the viewer layer outside in-universe narrative.",
        phys: "Massive draconic body consistent with classical King Ghidorah morphology — three heads, two tails, large wingspan. Multiple eyes distributed across the entire body, concentrated on the heads. No blood. No decay. Luminous golden colouration. Presence is described by witnesses as overwhelming and devotional rather than physically threatening. Entity's scale has not been precisely documented — CODC instrumentation fails in proximity.",
        dims: "Extradimensional. Entity's primary existence is in a plane not subject to conventional physical laws. Physical manifestation in observed dimension is secondary and summoning-dependent.",
        sentient: "Y",
        hostile: "Y",
        safety: "LETHAL",
        discoveredBy: 1007,
        contributors: [],
        sources: [
            {
                type: "youtube",
                label: "Seraphim Ghidorah — Origin",
                url: "https://www.youtube.com/watch?v=URy_bv9PqKI&t=1147s"
            },
            {
                type: "wiki",
                label: "Seraphim Ghidorah — GODZILLA JUST PRAY (Tropes)",
                url: "https://tvtropes.org/pmwiki/pmwiki.php/WebAnimation/GodzillaJustPray"
            }
        ],
        protocols: [
            {
                type: "CONTAINMENT",
                clr: 5,
                desc: "Conventional containment is not viable. Entity's primary form is extradimensional. CODC-affiliated personnel are to monitor all Church of Ghidorah activity and disrupt summoning rituals before blood-cloud phase initiates — once the sacrificial detonation begins, entity manifestation cannot be prevented. Destroy all physical consecrated cross sites identified as summoning loci. Broadcast infrastructure must be equipped with Ghidorah-signal filters.",
                equipment:
                    "Ritual disruption units, broadcast signal isolation array, CODC-grade memetic shielding, cross-site demolition teams",
                duration: null,
                personnel: null
            },
            {
                type: "INTERACTION",
                clr: 5,
                desc: "No direct interaction authorised at any level. If entity initiates contact — including through broadcast, audio, visual, or written medium — personnel must not respond, pray, or acknowledge the signal. Memetic shielding is mandatory. Any personnel reporting devotional feelings toward the entity, hearing voices, or urge to 'turn to the call' must be quarantined immediately.",
                equipment:
                    "Class-5 memetic filter headgear, psychological monitoring band, broadcast-isolating field emitter",
                duration: 15,
                personnel: 20
            },
            {
                type: "BREACH",
                clr: 3,
                desc: "In the event of full manifestation: evacuate all civilian population from broadcast range immediately. Do not deploy directed-energy assets as primary weapons — confirmed nullification via black hole. Do not allow massed prayer or congregation in entity's proximity. Coordinate with any available Godzilla-class asset for direct engagement — currently the only documented method of forcing entity back to extradimensional state.",
                equipment:
                    "Civilian evacuation units, broadcast blackout relays, Godzilla-class engagement coordination, Mothra-signal detection array",
                duration: null,
                personnel: "ALL AVAILABLE"
            }
        ],
        reports: [
            {
                title: "First Confirmed Manifestation — Church of Ghidorah Summoning",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                summary:
                    "First confirmed full manifestation event, triggered by a mass sacrifice ritual conducted by the Church of Ghidorah at a consecrated cross site in a classified rural location. NeoMS CODC-affiliated personnel arrived 4 minutes after the blood-cloud phase initiated — too late to prevent manifestation. Entity was present in the physical dimension for approximately 19 minutes before retreating extradimensionally. Civilian casualties from the sacrifice: 34 confirmed. Personnel exposed to entity presence: 6. All 6 reported compulsive devotional ideation within 24 hours. Three were quarantined; one was unable to be recovered. This incident formally opens E-0333's containment file.",
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
                summary:
                    "Entity commandeered regional television and radio broadcast infrastructure for 6 minutes and 41 seconds during peak evening hours. Broadcast content consisted of visual static interspersed with the central head's vocalisation pattern — a subsonic sequence that has since been designated GABRIEL-TONE. Post-broadcast surveys estimated 2.4 million civilian exposures. Follow-up memetic screening of the affected population identified 312 individuals displaying early-stage devotional fixation consistent with Church of Ghidorah conversion profiles. All 312 were flagged for monitoring. Broadcast filters were upgraded site-wide following this incident.",
                file: "NMS-333-BREACH-001.pdf",
                author: 1007
            },
            {
                title: "Light Spear Impact Assessment — Classified Site",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 5,
                summary: "[SUMMARY CLASSIFIED — CL-5 CLEARANCE REQUIRED]",
                file: "NMS-333-OBS-001.pdf",
                author: 1007
            },
            {
                title: "Fourth-Wall Contact Event — Observer Layer Breach",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 4,
                summary:
                    "During a routine review of archived footage from the first manifestation event, a research analyst at Site-10047 observed the entity's central head (GABRIEL designation) orient directly toward the camera recording the incident. The camera was positioned behind a concealed observation blind 800 metres from the manifestation site. Entity then vocalised a phrase in a language not yet identified. The analyst reported that the phrase felt addressed to them personally. No memetic shielding was in use during archival review — this has since been corrected as mandatory. The analyst was quarantined for 72 hours and cleared. All archived footage of E-0333 is now classified as a Class-3 memetic hazard.',",
                file: "NMS-333-INC-002.pdf",
                author: 1007
            },
            {
                title: "Church of Ghidorah — Ritual Site Destruction Log",
                subtitle: "Data",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 3,
                summary:
                    "CODC demolition teams confirmed the destruction of 4 consecrated cross sites identified as active summoning loci this quarter. A fifth site was located but could not be demolished due to its position within a civilian protected heritage zone — bureaucratic obstruction ongoing. Church of Ghidorah membership estimates have risen by approximately 18% since the GABRIEL-1 broadcast event. Recruitment appears to be accelerating among populations that were within range of the broadcast. CODC counter-cult task force strength has been doubled in response. Monitoring of known Church leadership continues.",
                file: "NMS-333-DATA-001.pdf",
                author: 1007
            },
            {
                title: "Broadcast Hijack — Event GABRIEL-2",
                subtitle: "Breach",
                date: "20██-04-██",
                type: "BREACH",
                clr: 4,
                summary:
                    "Second confirmed broadcast hijack event. Duration: 2 minutes 08 seconds before NeoMS broadcast blackout relays engaged and severed the signal. Estimated civilian exposure: 890,000. GABRIEL-TONE was again present in the audio layer. Unlike the first event, this broadcast included a direct visual of the entity's three heads arranged symmetrically — described by exposed personnel as 'impossible to look away from.' Broadcast filter response time was 14 seconds faster than GABRIEL-1. Cross-referencing exposed population against Church of Ghidorah recruitment records will take 30 days. Mothra-signal detection array registered no activity during or after the event.',",
                author: 1007
            }
        ]
    }
];
