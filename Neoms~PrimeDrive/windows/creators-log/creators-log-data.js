/* ============================================================
   CREATOR'S LOG — DATA
   The one source of truth for blog entries. Order in this list
   doesn't matter — the log sorts by date when it renders.

   Each entry has:
     date  — "YYYY.MM.DD" (e.g. "2026.04.20")
     tag   — UPDATE / NEWS / PATCH / NOTE  (matches filter chips)
     title — entry title
     body  — entry text. A blank line ("\n\n") starts a new
             paragraph; web addresses become links automatically.
     img   — OPTIONAL image path or URL, shown under the text.
             Click it to view fullscreen.

   Example:
     { date: "2026.04.20", tag: "UPDATE", title: "Database v2",
       body: "Migrated entries to JS array.\n\nFaster cold-load." }
============================================================ */
var NEOMS_BLOG_DATA = [
  /* ---- 2026.11 ---- */
  {
    date: "2026.11.21",
    tag: "NOTE",
    title: "Life update",
    body: "Been working on this site all summer but never really got around to updating it. Then college started, and I barely had time to breathe.\n\nSo I'm finally going to start pushing everything I've been working on and getting it out there. I've also got to rewrite about half of my shitty code. Turns out learning from AI is great, until you look back at some of the code you wrote a few months ago and wonder why windoweyeofgod.js was a load-bearing file. Also changed alot of file name as having to explain to my friends why a file is called impregnova is not easy. \n\nPlenty of updates coming soon!",
    img: "https://i.pinimg.com/1200x/39/e2/d3/39e2d3af82f67758a979d3341607b81d.jpg"
  },
  {
    date: "2026.11.21",
    tag: "UPDATE",
    title: "Art Gallery",
    body: "Art Gallery gets its own desktop folder, split off from Rankings. First up: the GLOBMAGEDDON Collection by yuk1draw. Click any piece to view it fullscreen."
  },
  {
    date: "2026.11.21",
    tag: "UPDATE",
    title: "Tier lists",
    body: "Rankings are now drag-and-drop tier lists (S to F). Your placements save in your browser. Instagram posts and reels play in the fullscreen viewer."
  },
  {
    date: "2026.11.21",
    tag: "UPDATE",
    title: "Window snapping",
    body: "Drag a window to a screen edge or corner to snap it. Hover the maximize button for snap layouts. Startup windows now open side by side."
  },
  {
    date: "2026.11.21",
    tag: "NEWS",
    title: "New badges",
    body: "Three new NEOMS OS badges in the Badges folder: Jova, Nova, and Jova x Nova. Copy the code and put one on your site."
  },
  {
    date: "2026.11.18",
    tag: "UPDATE",
    title: "Neocorp VM V1.2 update",
    body: "UI/QOL update. Better window and icon handling, redesigned NeoMix and world map, plus a source viewer and entity creator in the Database."
  },

  /* ---- 2026.05 ---- */
  {
    date: "2026.05.22",
    tag: "UPDATE",
    title: "Fullscreen viewer",
    body: "Entries can hold multiple images now. Click for a fullscreen viewer with swipe, arrow keys, and SET AS BG to make any image your wallpaper."
  },
  {
    date: "2026.05.03",
    tag: "UPDATE",
    title: "Database desktop",
    body: "The Database gets its own desktop with icons, windows and a start menu. Staff is now called Personnel."
  },

  /* ---- 2026.04 ---- */
  {
    date: "2026.04.28",
    tag: "UPDATE",
    title: "NeoMix revamp",
    body: "NeoMix rebuilt as a two-column studio deck with a playlist rail and new controls."
  },
  {
    date: "2026.04.26",
    tag: "UPDATE",
    title: "New windows",
    body: "Added Game Codes, Core Directive, Badges, Guest Book, Etc and Wallpaper. Core Directive explains what every desktop icon does."
  },
  {
    date: "2026.04.24",
    tag: "NEWS",
    title: "PrimeDrive desktop",
    body: "NeoMS is now a desktop: draggable icons, start menu, taskbar and windows. Launching with Creator's Log, NeoMix, Rankings and Sticker HQ."
  },
  {
    date: "2026.04.02",
    tag: "UPDATE",
    title: "NEOMS_Databased.v1",
    body: "Database-EXEs.v1 out now."
  },

  /* ---- 2026.01 – 2026.03 ---- */
  {
    date: "2026.03.17",
    tag: "NEWS",
    title: "Site goes live",
    body: "NeoMS is officially online. This is where I'll post updates, thoughts, and whatever else needs to be said."
  },
  {
    date: "2026.01.02",
    tag: "NEWS",
    title: "Neoms~Database V1",
    body: "The Neoms~Database is open. Open it from the start menu to browse entities, personnel and containment sites."
  }
];
