/* ============================================================
   CREATOR'S LOG — DATA
   This array is the LIVE source of truth for blog entries.
   blog-entries.html is kept as a backup mirror; if the data
   array is empty or missing, the loader falls back to fetching
   blog-entries.html (legacy path).

   Each entry has:
     date  — display date (any format you like, e.g. "2026.04.20")
     tag   — UPDATE / NEWS / PATCH / NOTE  (matches filter chips)
     title — entry title
     body  — entry body text


   Example (uncomment and edit):
     { date: "2026.04.20", tag: "UPDATE", title: "Database v2",
       body: "Migrated entries to JS array. Faster cold-load." }
============================================================ */
var NEOMS_BLOG_DATA = [
  {
    date: "2026.01.2",
    tag: "NEWS",
    title: "NeomsDatabase V1 Live",
    body: "NeoMS is officially online. This is where I'll post updates, thoughts, and whatever else needs to be said."
  },
  { date: "2026.02.15", tag: "PATCH", title: "Database v1", body: "Moblie View" },
  { date: "2026.03.5", tag: "UPDATE", title: "Database v1.2", body: "Revamp UI" }
];
