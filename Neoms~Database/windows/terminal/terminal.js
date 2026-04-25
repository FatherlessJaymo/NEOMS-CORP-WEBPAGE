/* terminal window JS
   termKey() and termRun() live in desktop.js — they reference
   document.getElementById("term-out") and document.getElementById("term-in")
   which are now inside this window's HTML, so they work as-is. */

/* Boot messages */
termPrint("NeoMs Terminal — Authorized Access Only", "ok");
termPrint("Build 2026.02 — Schema v2.1", "dim");
termPrint("Type HELP for command list.", "dim");
termPrint("");

/* Focus the input */
const inp = document.getElementById("term-in");
if (inp) inp.focus();
