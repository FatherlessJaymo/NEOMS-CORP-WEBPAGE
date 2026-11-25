/* ============================================================
   NEOMS CONTAINMENT LOG — E-0138 FULL RECORD (REWRITE SONIC)
   Neoms~Database/windows/entities/records/E-0138.js

   Loaded the first time this entity's dossier or a report is
   opened. Summary fields and each report's header (title, date,
   type, clr, author, file) live in ../Entities-Data.js. Report
   bodies below are matched to those headers BY POSITION —
   keep both lists in the same order.
   ============================================================ */
"use strict";

NEOMS_RECORD(138, {
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
        /* 1 — Initial Contact — Site-62656 Ingress Event */
        {
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
            notes: "All three subjects placed on indefinite medical observation. E-0138's containment file formally opened."
        },
        /* 2 — Ring Accumulation Event — Observer Layer Breach */
        {
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
                "Analyst has not recovered full soul-coherence. Remote observation of E-0138 now requires CL-3 sign-off and two-person presence."
        },
        /* 3 — Persona Mimicry — MILES Manifestation */
        {
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
                "Persona mimicry count updated to 6. Personal devices are now banned from all E-0138 wings. Subject reassigned off-site."
        },
        /* 4 — Victim Count Update — Ring 138 */
        {
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
                "Whether the ring count matching the designation is coincidence or deliberate framing remains under review. Sector 4 displays physically disconnected."
        },
        /* 5 — Protocol Exit Failure — 'Sincere' Invocation Test */
        {
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
                "Phrase reclassified as conditional. Personnel facing E-0138 must not be given orders that conflict with leaving. Power-cut kill switches fitted to every isolation booth."
        },
        /* 6 — Ongoing Breach Status Confirmation */
        {
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
            notes: "Logged as a sighting per standard protocol. BREACH status maintained."
        }
    ]
});
