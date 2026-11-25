/* ============================================================
   NEOMS CONTAINMENT LOG — E-0008 FULL RECORD (DIVINE MAHORAGA)
   Neoms~Database/windows/entities/records/E-0008.js

   Loaded the first time this entity's dossier or a report is
   opened. Summary fields and each report's header (title, date,
   type, clr, author, file) live in ../Entities-Data.js. Report
   bodies below are matched to those headers BY POSITION —
   keep both lists in the same order.
   ============================================================ */
"use strict";

NEOMS_RECORD(8, {
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
        /* 1 — Initial Summoning Incident — Zenin Clan Records */
        {
            summary:
                "Entity was first logged following recovery of Zenin clan summoning records detailing an unsuccessful taming attempt. All summoners involved were confirmed deceased. The exorcism-ritual binding anchors now in use at Site-10081 are adapted from a partial containment schema found within those records. Entity's Dharma wheel was observed rotating continuously for 72 hours following the binding — rotation ceased without explanation. Classified as a PRE-BREACH event. No personnel casualties during initial containment setup."
        },
        /* 2 — Adaptation Confirmation — Cursed Energy Exposure */
        {
            summary:
                "A CL-4 research team conducted a controlled single-exposure test using a low-grade cursed energy pulse directed at the containment barrier. Entity's Dharma wheel registered a full rotation within 0.3 seconds of exposure. Subsequent identical pulse was deflected entirely — entity had fully adapted. Test was terminated after one exposure per protocol. Confirms that even indirect energy contact through the barrier is sufficient to trigger the tekio cycle. All future observation must be strictly passive."
        },
        /* 3 — Dharma Wheel Unprompted Rotation — PRE-BREACH Event */
        {
            summary:
                "At 03:14 local time, the anomaly-spin sensor array registered an unprompted Dharma wheel rotation lasting approximately 8 seconds. No external stimulus was identified. All personnel were placed on PRE-BREACH alert for 48 hours. No breach occurred. Entity returned to dormant posture by morning watch. The cause of the unprompted rotation remains unresolved. Current hypothesis: entity may be adapting to stimuli outside the observable spectrum. Recommendation to upgrade sensor array to Class-5 submitted to Overseer Prime."
        },
        /* 4 — Regeneration Rate Assessment */
        {
            summary:
                "Following a structural failure in the eastern binding anchor (non-entity cause — seismic activity), the entity sustained a minor laceration from the anchor collapse debris before the backup anchor engaged. Full tissue regeneration was documented in 11 minutes. The adaptation cycle was not observed to trigger in response to the physical damage — confirming regeneration and tekio are independent systems. The damaged anchor has since been replaced. No breach occurred. Entity did not react to the repair crew."
        },
        /* 5 — Summoning Incantation Breach — CRITICAL */
        {
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
                "Anchors replaced. The Zenin records are now held off-site, and translation is banned within 5 km of Site-10081. Unprompted wheel rotations are treated as a possible remote incantation attempt."
        },
        /* 6 — Containment Status Review — Binding Integrity */
        {
            summary:
                "Quarterly binding integrity inspection completed. All 8 exorcism-ritual anchors confirmed at nominal tension. Dharma wheel has not rotated unprompted in 94 days — longest recorded stable period. Positive-energy field emitters operating at 97% output. Entity remains in dormant stance. No vocalisation, movement, or adaptation events logged this quarter. Containment status: STABLE. Note logged for the record: entity has not once faced toward the observation window in 94 days. This is statistically anomalous given prior behavioural data. Monitoring continues."
        },
        /* 7 — Observation Window Orientation Event */
        {
            summary:
                "On day 97 of the stable period, the night-watch observer logged the entity turning its head toward the observation window for the first time since containment. No sensor registered the movement, and the anomaly-spin array showed no Dharma wheel rotation. The entity held the orientation for 6 minutes, then returned to its dormant posture. Night-watch rotation was changed immediately afterwards. The observer reported that the entity appeared to be watching the reflection in the glass, not the observer. No adaptation, binding or barrier events were recorded. Containment status remains CONTAINED. Sighting logged per standard protocol.",
            location: "Site-10081, Observation Gallery (Window 2)",
            personnel: "1 night-watch observer (CL-3), 2 CL-4 duty officers",
            log: [
                { t: "02:47", text: "Night watch begins. Entity in dormant stance, facing away from Window 2." },
                { t: "03:14", who: "Observer", text: "It's turning. Its head is turning toward the glass." },
                { t: "03:14", text: "Anomaly-spin array: no Dharma wheel rotation. Motion sensors: no movement registered." },
                { t: "03:15", text: "Duty officers arrive at the gallery. They confirm the entity is oriented toward Window 2." },
                { t: "03:17", who: "Observer", text: "It's not looking at me. It's looking at the reflection." },
                { t: "03:20", text: "Entity returns to dormant stance. Sensors still show no movement at any point." },
                { note: "Note: 03:14 is the same minute as the earlier unprompted wheel rotation (NMS-008-BREACH-001). This may not be a coincidence. — S-1004" }
            ],
            notes:
                "Window 2 fitted with an anti-reflective film. Visual-only observation is now paired with a second observer at all times, because the sensors cannot be trusted to log this behaviour. The 94-day stable period is declared ended."
        }
    ]
});
