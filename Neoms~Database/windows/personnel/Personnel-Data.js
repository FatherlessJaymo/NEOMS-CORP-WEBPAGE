/* ============================================================
   NEOMS CONTAINMENT LOG — personnel DATA
   Neoms~Database/JS/Personnel-Data.js
   ============================================================ */
"use strict";

const DEPTS = [
    "SYNTHETICS",
    "FACILITY UNITS",
    "FACILITY COMMAND",
    "CONTAINMENT ENFORCEMENT",
    "CONTAINMENT RESEARCH",
    "PRIME DIRECTOR"
];

const personnel = [
    {
        id: 2004,
        fname: "Fatherless",
        lname: "Jaymo",
        pos: "[REDACTED]",
        dept: "[REDACTED]",
        clr: 5,
        site: null,
        active: "Y",
        img: "../../Neoms~Universal-Fonts+Images/Creator/Creator-icon-2.png"
    },
    {
        id: 1002,
        fname: "Nova",
        lname: "",
        pos: "AI Overseer",
        dept: "PRIME DIRECTOR",
        clr: 5,
        site: null,
        active: "N"
    },
    {
        id: 1003,
        fname: "Dr.Springless",
        lname: "Echo",
        pos: "Anomaly Research Specialist",
        dept: "CONTAINMENT RESEARCH",
        clr: 3,
        site: 62656,
        active: "Y",
        img: "https://unavatar.io/x/SpringlessEcho"
    },
    {
        id: 1004,
        fname: "Dr.Gege",
        lname: "Akutami",
        pos: "Anomaly Research Specialist",
        dept: "CONTAINMENT RESEARCH",
        clr: 3,
        site: 10081,
        active: "Y",
        img: "https://static.wikia.nocookie.net/jujutsu-kaisen/images/f/fd/Gege_Akutami.png/revision/latest?cb=20250726004032"
    },
    {
        id: 1007,
        fname: "Dr.Tool",
        lname: "Zilla",
        pos: "Anomaly Research Analyst",
        dept: "CONTAINMENT RESEARCH",
        clr: 3,
        site: 10047,
        active: "N",
        img: "https://unavatar.io/youtube/toolzilla6829"
    }
];

/* Auto-incrementing personnel ID for interview intake */
let nextpersonnelId = 2000;
