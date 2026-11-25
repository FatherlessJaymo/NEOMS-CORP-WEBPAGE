/* ============================================================
   NEOMS CONTAINMENT LOG — E-0333 FULL RECORD (SERAPHIM GHIDORAH)
   Neoms~Database/windows/entities/records/E-0333.js

   Loaded the first time this entity's dossier or a report is
   opened. Summary fields and each report's header (title, date,
   type, clr, author, file) live in ../Entities-Data.js. Report
   bodies below are matched to those headers BY POSITION —
   keep both lists in the same order.
   ============================================================ */
"use strict";

NEOMS_RECORD(333, {
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
    imgCaption: "Footage of E-0333 recorded during a manifestation event.",
    bioImages: [
        {
            src: "../../Neoms~Universal-Fonts+Images/Entities-Data/Seraphim-Ghidorah/Ghidorah-BlackHoles.jpg",
            caption: "Manifestation — black hole generation observed"
        }
    ],
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
        /* 1 — First Confirmed Manifestation — Church of Ghidorah Summoning */
        {
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
                "Manifestation lasted approx. 19 minutes. 6 agents exposed; 3 quarantined, 1 unrecoverable. E-0333 containment file opened."
        },
        /* 2 — Broadcast Hijack — Event GABRIEL-1 */
        {
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
                "Subject placed in the monitoring programme. Broadcast filters upgraded site-wide following this incident."
        },
        /* 3 — Light Spear Impact Assessment — Classified Site */
        {
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
                "Site sealed. All 9 survivors in long-term quarantine. Raphael-zone healing logged as the entity's most effective conversion method. Aerial photography of any E-0333 site is banned."
        },
        /* 4 — Fourth-Wall Contact Event — Observer Layer Breach */
        {
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
            notes: "Memetic shielding made mandatory for all archival review of E-0333 material."
        },
        /* 5 — Church of Ghidorah — Ritual Site Destruction Log */
        {
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
                "Deacon held pending transfer. CODC counter-cult task force doubled. Fifth site still blocked by heritage-zone protections."
        },
        /* 6 — Broadcast Hijack — Event GABRIEL-2 */
        {
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
                "Exposed population being cross-checked against Church recruitment records (30 days). Body-camera footage classified as a Class-3 memetic hazard."
        },
        /* 7 — The Three Who Answered */
        {
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
                "E-0333 classification: CL-4 / Existential Threat. Containment type: Distributed / Nonphysical. No Antarctic or other permanent body site is to be established without new evidence. Kyoto Heritage Zone, the former Kumamoto Forward Post (destroyed in the light-spear impact; perimeter team only) and the Church Cross Site are NeoMS-original operational designations."
        }
    ]
});
