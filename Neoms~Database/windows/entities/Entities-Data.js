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
        img: "../../Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/TrueFormRewriteTf(Entity-PFP).gif",
        bioImages: [
            {
                src: "../../Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/RedRingsRewrite.webp",
                caption: "Wurugashikoi state — ring count 138"
            },
            {
                src: "../../Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/TrueFormRewriteTf(Entity-PFP).gif",
                caption: "True form — partial capture"
            },
            {
                src: "../../Neoms~Universal-Fonts+Images/Entities-Data/Rewrite/MidaretaState.png",
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
                location: "Site-62656, Research Wing C — quarantined terminal",
                personnel: "3 research staff (exposed) — names withheld",
                log: [
                    { t: "14:02", text: "SONIC (HEDGEHOG_v2) emulation boots on quarantined terminal." },
                    { t: "14:06", who: "REWRITE", text: "Hi! Who's watching?" },
                    { t: "14:06", who: "████", text: "[No response, per protocol]" },
                    { t: "14:08", text: "Soul-coherence monitors register a sharp drop on all three subjects." },
                    { t: "14:09", text: "Session terminated." },
                    { note: "Note: Entity remained in default state for the full session. — S-1003" }
                ],
                notes: "All three subjects placed on indefinite medical observation. E-0138's containment file formally opened.",
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
                location: "Site-62656, Remote Observation Suite 2 (unauthorised session)",
                personnel: "1 CL-2 analyst (exposed) — name withheld",
                foreword:
                    "Session was not cleared by containment staff. Reconstructed from soul-coherence monitor logs; all recording-array footage was lost.",
                log: [
                    { t: "02:41", text: "Analyst opens a remote feed to the media-isolation enclosure." },
                    { t: "02:44", text: "Entity in default state. Player character idle at level start." },
                    { t: "02:47", who: "REWRITE", text: "You're not the one holding the controller, are you?" },
                    { t: "02:47", text: "Entity turns away from the player character and faces the recording feed." },
                    { t: "02:48", who: "REWRITE", text: "Two rings. Wanna see what three looks like?" },
                    { t: "02:48", text: "Midareta state confirmed. Colour drains from the feed; dorsal quills rise." },
                    { t: "02:49", text: "Session terminated per protocol. Analyst soul-coherence: 61% and falling." },
                    { note: "Note: The in-session player character was never addressed. The entity spoke only to the observer. — S-1003" }
                ],
                notes:
                    "Analyst has not recovered full soul-coherence. Remote observation of E-0138 now requires CL-3 sign-off and two-person presence.",
                file: "NMS-138-BREACH-001.pdf",
                author: 1003
            },
            {
                title: "Persona Mimicry — MILES Manifestation",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 3,
                summary:
                    "Entity was recorded adopting the appearance and vocal cadence of MILES (PROWER_v1) for approximately 14 minutes during an incidental exposure event. The lure appeared targeted at the exposed subject's prior media history — entity had apparently profiled the target before manifestation. Persona mimicry was near-perfect; the subject did not identify the anomaly until entity broke character and addressed them by name. Subject had not provided their name at any point. This confirms entity's independent identity-retrieval capability. Persona mimicry count is now logged at 6 unique character templates.",
                location: "Site-62656, Staff Break Room — incidental exposure via personal handheld",
                personnel: "1 junior technician (exposed), 1 CL-3 researcher (responding)",
                log: [
                    { t: "12:10", text: "Technician launches an unlisted fan game on a personal handheld." },
                    { t: "12:12", who: "MILES", text: "Hey! You came back! I kept your spot warm." },
                    { t: "12:15", text: "Subject engages with the character for approx. 11 minutes. No anomaly suspected." },
                    { t: "12:24", who: "MILES", text: "Remember the old save file? The one you deleted?" },
                    { note: "Note: Subject later confirmed deleting a save file of this game in childhood. This was never disclosed to anyone. — S-1003" },
                    { t: "12:26", who: "REWRITE", text: "[Breaking character] I know your name. You never said it." },
                    { t: "12:26", text: "Subject drops the device. Responding researcher seals it in a Faraday pouch." },
                    "[Device later found to contain no game data of any kind.]"
                ],
                notes:
                    "Persona mimicry count updated to 6. Personal devices are now banned from all E-0138 wings. Subject reassigned off-site.",
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
                location: "Site-62656, Sector 4 — indirect camera relay",
                personnel: "Sector 4 shift (11 staff)",
                log: [
                    { t: "21:30", text: "Unsanctioned media playback detected on a Sector 4 display. Source unknown." },
                    { t: "21:31", text: "Relay camera 4-C captures entity in Wurugashikoi state. Red rings visible on all limbs." },
                    { t: "21:31", text: "Ring count logged: 138." },
                    { t: "21:31", who: "REWRITE", text: "One hundred and thirty-eight. Isn't that my name?" },
                    { t: "21:31", text: "All recording arrays in Sector 4 fail at once (approx. 3 s after first capture)." },
                    { t: "21:32", text: "All 11 staff report hearing their own name from no identifiable source." },
                    { note: "Note: One partial frame recovered from camera 4-C buffer. See image file. — S-1003" }
                ],
                notes:
                    "Whether the ring count matching the designation is coincidence or deliberate framing remains under review. Sector 4 displays physically disconnected.",
                file: "NMS-138-INC-003.pdf",
                author: 1003
            },
            {
                title: "Protocol Exit Failure — 'Sincere' Invocation Test",
                subtitle: "Incident",
                date: "20██-██-██",
                type: "INCIDENT",
                clr: 5,
                summary:
                    "Controlled test of the 'Protocol Exit — Sincere' phrase, the only known way to end contact with E-0138. The phrase worked on the first two invocations. On the third, the test subject was under orders to remain in-session afterwards for observation. Entity refused to honour the phrase, stating the speaker did not mean it. Findings: the phrase only binds the entity when the speaker genuinely intends to leave. Any order, hesitation, or curiosity voids it. The INTERACTION protocol at CL-2 still lists the phrase as a guaranteed exit. This was not corrected, to avoid undermining staff confidence.",
                location: "Site-62656, Isolation Booth 1 (media-isolation enclosure)",
                personnel: "1 volunteer researcher (subject), 2 CL-5 observers",
                foreword:
                    "Authorised by Overseer Prime. Subject briefed that invocation 3 is a deliberate test and that they are to stay in-session afterwards.",
                log: [
                    { t: "10:00", text: "Invocation 1. Entity in default state." },
                    { t: "10:01", who: "Subject", text: "Protocol Exit — Sincere." },
                    { t: "10:01", who: "REWRITE", text: "Aw. Okay! Bye-bye!" },
                    { t: "10:01", text: "Session closes. Monitors nominal." },
                    { t: "10:20", text: "Invocation 2. Same result. Session closes in under 2 s." },
                    { t: "10:40", text: "Invocation 3. Subject follows orders to stay in-session after speaking." },
                    { t: "10:41", who: "Subject", text: "Protocol Exit — Sincere." },
                    { t: "10:41", who: "REWRITE", text: "Hmm. No." },
                    { t: "10:41", who: "REWRITE", text: "You don't want to go. Someone told you to stay. That's not sincere." },
                    { t: "10:42", text: "Subject repeats the phrase 4 times. No effect. Midareta state begins." },
                    { t: "10:43", text: "Observers cut power to the booth. Session ends without the entity's consent." },
                    { note: "Note: The subject's soul-coherence dropped 22% in 90 seconds. The phrase is a promise, not a password. — S-1003" }
                ],
                notes:
                    "Phrase reclassified as conditional. Personnel facing E-0138 must not be given orders that conflict with leaving. Power-cut kill switches fitted to every isolation booth.",
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
                location: "Site-62656, Perimeter and Wing B",
                personnel: "Perimeter sweep team (4), 2 Wing B analysts",
                log: [
                    { t: "06:00", text: "Quarterly perimeter sweep begins." },
                    { t: "06:40", text: "Faraday enclosure integrity: 100%. No ingress events this quarter." },
                    { t: "07:15", text: "Soul-coherence monitors: nominal across all wings." },
                    { t: "07:52", who: "Analyst (Wing B)", text: "Does anyone else hear that? It's Green Hill." },
                    { t: "07:53", text: "Second analyst confirms. Audio sweep finds no active media source." },
                    { t: "07:58", text: "Audio stops. No personnel entered the 50 m exclusion zone." },
                    { note: "Note: Neither analyst could say which direction the sound came from. — S-1003" }
                ],
                notes: "Logged as a sighting per standard protocol. BREACH status maintained.",
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
        aprop: "Reactive adaptation (tekio) to any and all phenomena — entity needs only a single exposure to begin adaptation. Repeated exposure accelerates the process considerably. Upon completion, entity becomes fully immune to the encountered phenomenon. Mid-grade regeneration from severe injury. Superhuman physical strength capable of displacing targets through multiple structures with a single strike.",
        phys: "Towering muscular humanoid, estimated 3\u20134m. White colouration. Four large wings protrude from eye sockets. Tail-like appendage extends from rear cranium. Black hakama, white sash. A golden eight-spoked Dharma wheel (h\u014Djin) hovers above the entity at all times — this wheel rotates in direct response to new stimuli and serves as the visible engine of the entity's adaptation process.",
        dims: "Standard. Physical mass consistent with observed form. Entity does not exhibit spatial anomaly under normal conditions.",
        sentient: "U",
        hostile: "Y",
        safety: "LETHAL",
        discoveredBy: 1004,
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
                author: 1004
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
                author: 1004
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
                author: 1004
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
                author: 1004
            },
            {
                title: "Summoning Incantation Breach — CRITICAL",
                subtitle: "Breach",
                date: "20██-██-██",
                type: "BREACH",
                clr: 5,
                summary:
                    "A CL-4 linguist translating recovered Zenin clan records read the summoning incantation aloud inside the Site-10081 perimeter, against containment protocol. The Dharma wheel began rotating at once. Three of the eight binding anchors failed, and the entity stood upright for the first time since containment. Under the ritual's own rules, the speaker became the summoner. The ritual ended, and the binding held again, only when the summoner died from injuries taken in the entity's first strike. Casualties: 1 dead (the summoner), 4 injured. This is the only known event in which the entity left its dormant posture.",
                location: "Site-10081, Archive Annex (approx. 40 m from containment chamber)",
                personnel: "CL-4 linguist (deceased), 4 containment staff (injured), CL-4 response team",
                foreword:
                    "Reconstructed from the anomaly-spin sensor array, annex audio, and response-team radio. Incantation text in the source record is redacted below.",
                log: [
                    { t: "16:12:04", who: "Linguist", text: "[Reading aloud] '█████ ██████████ — with this treasure I summon—'" },
                    { t: "16:12:06", text: "Anomaly-spin array: Dharma wheel rotation detected. PRE-BREACH alarm." },
                    { t: "16:12:09", text: "Binding anchors 2, 5 and 7 fail at once." },
                    { t: "16:12:11", text: "Entity rises from dormant stance. First recorded upright posture." },
                    { t: "16:12:15", who: "Response Lead", text: "Who said it? Who said the words?" },
                    { t: "16:12:20", text: "Entity breaches the inner wall and moves toward the annex. Not toward the response team." },
                    { t: "16:12:31", text: "Single strike. Linguist fatally injured. 4 staff injured by debris." },
                    { t: "16:12:40", text: "Dharma wheel stops. Entity returns to the chamber and resumes dormant stance unprompted." },
                    { note: "Note: The entity ignored every armed responder and went straight for the person who summoned it. It behaved like a ritual being completed, not like an escape. — S-1004" }
                ],
                notes:
                    "Anchors replaced. The Zenin records are now held off-site, and translation is banned within 5 km of Site-10081. Unprompted wheel rotations are treated as a possible remote incantation attempt.",
                file: "NMS-008-BREACH-002.pdf",
                author: 1004
            },
            {
                title: "Containment Status Review — Binding Integrity",
                subtitle: "Sighting",
                date: "20██-04-██",
                type: "SIGHTING",
                clr: 3,
                summary:
                    "Quarterly binding integrity inspection completed. All 8 exorcism-ritual anchors confirmed at nominal tension. Dharma wheel has not rotated unprompted in 94 days — longest recorded stable period. Positive-energy field emitters operating at 97% output. Entity remains in dormant stance. No vocalisation, movement, or adaptation events logged this quarter. Containment status: STABLE. Note logged for the record: entity has not once faced toward the observation window in 94 days. This is statistically anomalous given prior behavioural data. Monitoring continues.",
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
        /* Revised containment model: distributed, nonphysical */
        alias: "The False Archangel",
        containment: "Distributed / Nonphysical",
        adminSite: "Site-10047, Izu Islands — broadcast screening, records, personnel oversight",
        vectors: [
            "Religious indoctrination",
            "Broadcast manipulation",
            "Mass sacrifice",
            "Physical manifestation",
            "Dimensional intrusion"
        ],
        disc: "20██-████-████",
        glyph: "\u271D",
        img: "../../Neoms~Universal-Fonts+Images/Entities-Data/Seraphim-Ghidorah/Seraphim-Ghidorah(Entity-PFP).gif",
        imgCaption: "Footage of E-0333 recorded during a manifestation event.",
        bioImages: [
            {
                src: "../../Neoms~Universal-Fonts+Images/Entities-Data/Seraphim-Ghidorah/Ghidorah-BlackHoles.jpg",
                caption: "Manifestation — black hole generation observed"
            }
        ],
        desc: "Designation: SERAPHIM GHIDORAH. Analog-horror class Angelic Abomination. A three-headed, two-tailed draconic entity of extradimensional origin, presented to civilian populations as a divine messenger — specifically the physical manifestation of the three Archangels: Michael (left head), Gabriel (central head), and Raphael (right head). Entity is worshipped by a fanatical cult, the Church of Ghidorah, who summoned it through mass human sacrifice at a consecrated cross site.",
        aprop: "Three light spears (simultaneous deployment, one per head). Black hole generation — capable of countering and nullifying directed energy attacks. Mass psychological influence and brainwashing via broadcast hijacking. Summoning-dependent mass conversion via human sacrifice. Mind control extended onto unshielded human targets. Public broadcast override — confirmed twice in documented incidents. Fourth-wall-class memetic hazard: entity has been observed directly addressing the viewer layer outside in-universe narrative.",
        phys: "Massive draconic body consistent with classical King Ghidorah morphology — three heads, two tails, large wingspan. Multiple eyes distributed across the entire body, concentrated on the heads. No blood. No decay. Luminous golden colouration. Presence is described by witnesses as overwhelming and devotional rather than physically threatening. Entity's scale has not been precisely documented — CODC instrumentation fails in proximity.",
        dims: "Unknown external plane of existence. Influence is transmitted into the human world through two vectors: the BROADCAST vector (television, electronic devices, GABRIEL signals) and the RELIGIOUS vector (Church indoctrination, worship, sacrificial rites). Both converge on a mass sacrifice and manifestation event, after which the entity takes physical form as a three-headed dragon with reality-distorting abilities. No permanent physical body is known to exist in this world.",
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
                desc: "Containment is distributed and nonphysical — there is no body to restrain. Site-10047 coordinates all operations. (1) PREVENT SUMMONING: track Church of Ghidorah activity and disrupt any gathering that could lead to a mass sacrifice before the blood-cloud phase begins; once the sacrifice begins, manifestation cannot be prevented. (2) SCREEN BROADCASTS: all regional broadcast infrastructure carries Ghidorah-signal filters; compromised feeds and exposed civilians are routed to the Site-10047 Screening Ward. (3) TRACK THE CHURCH: the Kyoto Heritage Zone team investigates the Church's documents and the Priestess's teachings; a field team at the perimeter of the former Kumamoto Forward Post (sealed after the light-spear impact) monitors cult movement and stands ready for emergency operations. Suspected cross sites are surveyed and, where cleared, dismantled.",
                equipment:
                    "Broadcast signal isolation array, Ghidorah-signal filters, CODC-grade memetic shielding, ritual disruption units, cult surveillance network",
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
                location: "Consecrated cross site — classified rural location",
                personnel: "Church of Ghidorah congregation (est. 200), 6 CODC-affiliated field agents",
                foreword:
                    "Audio recovered from a congregant's phone found at the cross site. Begins during the ritual; field team arrival is marked.",
                log: [
                    { t: "23:51", who: "Officiant", text: "Three voices spoke, and the heavens split to hear them." },
                    { t: "23:51", who: "Congregation", text: "Michael. Gabriel. Raphael." },
                    { t: "23:54", who: "Officiant", text: "Give what you are, and you will be carried." },
                    { t: "23:55", text: "[Detonation. Sustained ringing. Congregation continues chanting.]" },
                    { t: "23:56", who: "Congregant", text: "Look up — the cloud is red, it's red, it's beautiful—" },
                    { t: "23:59", text: "CODC field team arrives. Blood-cloud phase already under way." },
                    { t: "00:01", who: "Officiant", text: "You are late, children of the Foundation. The door does not close." },
                    { t: "00:03", text: "[Low tone recording equipment cannot capture fully. Phone audio clips.]" },
                    { note: "Note: The officiant was among the 34 confirmed dead. Phone owner never identified. — S-1007" }
                ],
                notes:
                    "Manifestation lasted approx. 19 minutes. 6 agents exposed; 3 quarantined, 1 unrecoverable. E-0333 containment file opened.",
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
                location: "Regional broadcast area; interview held at Site-10047 Screening Ward",
                personnel: "Exposed civilian (Subject 333-C-118), CODC memetic screener",
                foreword:
                    "Interview with one of the 312 civilians flagged after GABRIEL-1. Subject had no prior link to the Church of Ghidorah.",
                log: [
                    { who: "Screener", text: "Tell me what you saw on the evening broadcast." },
                    { who: "333-C-118", text: "Static, at first. Then it wasn't static. It was a choir." },
                    { who: "Screener", text: "Can you describe the sound?" },
                    { who: "333-C-118", text: "It was low. Lower than hearing. Like a hand on my chest saying 'there you are.'" },
                    { who: "Screener", text: "Have you contacted anyone since the broadcast?" },
                    { who: "333-C-118", text: "A woman left a pamphlet at my door. Three heads on the cover. I didn't call her. I didn't need to — she already knew my name." },
                    { who: "333-C-118", text: "[Unprompted] Gabriel speaks for the other two. You should listen while he's still being gentle." },
                    { note: "Note: Subject hummed the GABRIEL-TONE pattern throughout the interview without noticing. — S-1007" }
                ],
                notes:
                    "Subject placed in the monitoring programme. Broadcast filters upgraded site-wide following this incident.",
                file: "NMS-333-BREACH-001.pdf",
                author: 1007
            },
            {
                title: "Light Spear Impact Assessment — Classified Site",
                subtitle: "Observation",
                date: "20██-██-██",
                type: "OBSERVATION",
                clr: 5,
                summary:
                    "Survey of the impact site left by the entity's three light spears at a destroyed CODC forward post. Each spear had a different effect, matching its head. Left (MICHAEL): total destruction. Central (GABRIEL): every radio, phone and speaker within 2 km later played GABRIEL-TONE when powered on. Right (RAPHAEL): survivors in its zone were found fully healed of all injuries, including pre-existing conditions, and all 9 were converted. The three craters form an exact cross when seen from above. The site has been sealed, and its existence is classified CL-5.",
                location: "Former CODC Forward Post ██ — classified location",
                personnel: "CODC survey team (5), under Class-5 memetic shielding",
                foreword: "Survey carried out 48 hours after impact. The team was instructed not to look at the craters from elevation.",
                log: [
                    { t: "08:10", who: "Survey Lead", text: "Crater one, west. Nothing left. Not rubble — nothing. The ground is glass." },
                    { t: "08:42", who: "Survey Lead", text: "Crater two, centre. Recovered a field radio. Powering it on." },
                    { t: "08:42", text: "[Radio emits GABRIEL-TONE. Powered off. All devices from the zone quarantined.]" },
                    { t: "09:15", who: "Survey Lead", text: "Crater three, east. Nine survivors. Sitting in a circle. Not a scratch on them." },
                    { who: "Survivor", text: "Corporal ██████ lost his leg in the first strike. Look at him. Look." },
                    { who: "Survivor", text: "Raphael asked nothing of us. We give anyway." },
                    { t: "09:40", text: "Drone overflight against instruction. Footage shows the three craters forming a perfect cross." },
                    { note: "Note: The drone operator asked to be reassigned to the Church monitoring desk 'to be closer to it'. Request denied; operator quarantined. — S-1007" }
                ],
                notes:
                    "Site sealed. All 9 survivors in long-term quarantine. Raphael-zone healing logged as the entity's most effective conversion method. Aerial photography of any E-0333 site is banned.",
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
                    "During a routine review of archived footage from the first manifestation event, a research analyst at Site-10047 observed the entity's central head (GABRIEL designation) orient directly toward the camera recording the incident. The camera was positioned behind a concealed observation blind 800 metres from the manifestation site. Entity then vocalised a phrase in a language not yet identified. The analyst reported that the phrase felt addressed to them personally. No memetic shielding was in use during archival review — this has since been corrected as mandatory. The analyst was quarantined for 72 hours and cleared. All archived footage of E-0333 is now classified as a Class-3 memetic hazard.",
                location: "Site-10047, Archival Review Room 3 / Quarantine Cell Q-2",
                personnel: "Research analyst (quarantined 72 h), Site-10047 psychologist",
                foreword: "Quarantine interview, hour 30 of 72. Analyst requested to speak.",
                log: [
                    { who: "Psychologist", text: "You asked for this session. What did you want to say?" },
                    { who: "Analyst", text: "I want to tell you what it said. On the tape. I understand it now." },
                    { who: "Psychologist", text: "The phrase was in a language we haven't identified." },
                    { who: "Analyst", text: "It isn't a language. It's an invitation. It said: 'You were watching. So was I.'" },
                    { who: "Analyst", text: "It wasn't angry. It sounded relieved. Like it had found someone it lost." },
                    { who: "Psychologist", text: "Do you want to see the footage again?" },
                    { who: "Analyst", text: "[Long pause] Yes. That's the problem, isn't it." },
                    { note: "Note: Analyst cleared at hour 72. Devotional ideation scores returned to baseline. Analyst asked twice whether the footage had been destroyed. — S-1007" }
                ],
                notes: "Memetic shielding made mandatory for all archival review of E-0333 material.",
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
                location: "CODC holding facility — interrogation room B",
                personnel: "Detained Church of Ghidorah deacon (333-D-04), CODC interrogator",
                foreword:
                    "Deacon detained during demolition of the fourth cross site. Refused legal counsel. Asked only that the session be recorded.",
                log: [
                    { who: "Interrogator", text: "Four sites are gone. Your church is running out of places to pray." },
                    { who: "333-D-04", text: "You knocked down wood and stone. The cross was never the door. We are." },
                    { who: "Interrogator", text: "Where is the fifth site?" },
                    { who: "333-D-04", text: "You already found it. You can't touch it. Did you think that was luck?" },
                    { who: "Interrogator", text: "How many new members since the broadcast?" },
                    { who: "333-D-04", text: "I stopped counting. Michael counts. Raphael heals the ones who doubt. Gabriel only has to speak." },
                    { who: "333-D-04", text: "[Facing the camera] When he looks at you through the screen, don't look away. It's rude to ignore a guest." },
                    { note: "Note: Recording reviewed under Class-3 memetic shielding as a precaution. No anomalous effects confirmed. — S-1007" }
                ],
                notes:
                    "Deacon held pending transfer. CODC counter-cult task force doubled. Fifth site still blocked by heritage-zone protections.",
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
                    "Second confirmed broadcast hijack event. Duration: 2 minutes 08 seconds before NeoMS broadcast blackout relays engaged and severed the signal. Estimated civilian exposure: 890,000. GABRIEL-TONE was again present in the audio layer. Unlike the first event, this broadcast included a direct visual of the entity's three heads arranged symmetrically — described by exposed personnel as 'impossible to look away from.' Broadcast filter response time was 14 seconds faster than GABRIEL-1. Cross-referencing exposed population against Church of Ghidorah recruitment records will take 30 days. Mothra-signal detection array registered no activity during or after the event.",
                location: "Regional broadcast area — street-level footage, city centre",
                personnel: "Civilian crowd (unknown), 2 plain-clothes CODC observers",
                foreword:
                    "Transcribed from a CODC observer's body camera in a public square with a large screen, during the 2 m 08 s hijack.",
                log: [
                    { t: "19:42:10", text: "Public screen cuts to static. Low tone begins." },
                    { t: "19:42:31", text: "Image resolves: three heads in symmetry. Crowd noise stops." },
                    { t: "19:42:40", who: "Woman (crowd)", text: "Oh. Oh, they're so tired. Look how tired they are." },
                    { t: "19:42:55", who: "Man (crowd)", text: "Kneel. Kneel. Everybody kneel." },
                    { t: "19:43:05", text: "Approx. 40 civilians kneel. Several begin chanting 'Michael, Gabriel, Raphael.'" },
                    { t: "19:43:40", who: "Child (crowd)", text: "Mum, the middle one is looking at the camera man." },
                    { t: "19:44:18", text: "Blackout relays sever the signal. Screen goes dark. Several civilians remain kneeling." },
                    { note: "Note: The body camera's last 6 seconds before blackout are a still frame of the central head. The observer did not report looking at the screen. — S-1007" }
                ],
                notes:
                    "Exposed population being cross-checked against Church recruitment records (30 days). Body-camera footage classified as a Class-3 memetic hazard.",
                author: 1007
            },
            {
                title: "The Three Who Answered",
                subtitle: "Intelligence",
                date: "20██-██-██",
                type: "INTELLIGENCE",
                clr: 5,
                summary:
                    "Intelligence reconstruction of the full Ghidorah sequence: the Priestess's indoctrination of the Church, the sacrificial summoning at the cross, the entity's physical manifestation and battle with Godzilla, and the broadcast hijacking that followed. Each finding is marked as SOURCE (confirmed by the recovered record) or NEOMS (an interpretation by NeoMS analysts). This report replaces earlier assumptions of a permanent physical body; E-0333 is now handled under a distributed, nonphysical containment model administered from Site-10047.",
                location: "Site-10047, Archival Review Room — compiled from recovered records and field reports",
                personnel: "Site-10047 intelligence cell; Kyoto Heritage Zone and former Kumamoto Forward Post field teams",
                foreword:
                    "Entries tagged SOURCE are events established by the recovered record. Entries tagged NEOMS are analyst interpretation and must not be cited as fact. Locations marked UNVERIFIED have no confirmed coordinates.",
                log: [
                    "SOURCE — A Priestess indoctrinates followers into the Church of Ghidorah.",
                    "NEOMS — The Priestess's teachings are the root of the religious vector. The Kyoto Heritage Zone team is assigned to recover and study them.",
                    "SOURCE — The Church gathers at an ominous cross to summon the entity.",
                    "NEOMS — The cross's geographical location is UNVERIFIED. The map coordinates for the Church Cross Site are provisional.",
                    "SOURCE — A sacrificial rite precedes the entity's physical manifestation.",
                    "NEOMS — Mass sacrifice is treated as the gate between the entity's external plane and this world. Without it, no physical form has been observed.",
                    "SOURCE — The manifested entity battles Godzilla.",
                    "NEOMS — Godzilla-class engagement remains the only documented way to force the entity out of physical form (see BREACH protocol).",
                    "SOURCE — Broadcasts are hijacked.",
                    "NEOMS — The hijacks (GABRIEL-1, GABRIEL-2) show the entity can act through the broadcast vector without a physical body. Site-10047's Screening Ward is the front line.",
                    { note: "Note: The model 'three Archangels — Michael, Gabriel, Raphael' is how the Church presents the entity. It is a NEOMS record of their belief, not a confirmed fact about what the entity is. — S-1007" }
                ],
                notes:
                    "E-0333 classification: CL-4 / Existential Threat. Containment type: Distributed / Nonphysical. No Antarctic or other permanent body site is to be established without new evidence. Kyoto Heritage Zone, the former Kumamoto Forward Post (destroyed in the light-spear impact; perimeter team only) and the Church Cross Site are NeoMS-original operational designations.",
                file: "NEOMS-10047.pdf",
                author: 1007
            }
        ]
    }
];
