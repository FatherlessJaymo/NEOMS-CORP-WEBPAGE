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
        active: "Y"
    },
    {
        id: 1002,
        fname: "Metal",
        lname: "Sonic",
        pos: "Overseer Prime",
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
        clr: 4,
        site: 62656,
        active: "Y"
    },
    {
        id: 1003,
        fname: "Dr.Gege",
        lname: "Akutami",
        pos: "Anomaly Research Specialist",
        dept: "CONTAINMENT RESEARCH",
        clr: 4,
        site: 10081,
        active: "Y"
    },
    {
        id: 1007,
        fname: "Dr.Tool",
        lname: "Zilla",
        pos: "Anomaly Research Analyst",
        dept: "CONTAINMENT RESEARCH",
        clr: 4,
        site: 10047,
        active: "N"
    }
];

/* Auto-incrementing personnel ID for interview intake */
let nextpersonnelId = 2000;
