/* ============================================================
   NEOMS — SOURCE VIEWER FILE LIST
   Neoms~Database/windows/codeviewer/codeviewer-files.js

   Paths are relative to Neoms~Database/HTML/archive.html
   (no leading slash, so they work on GitHub Pages too).
   ============================================================ */
"use strict";

var CV_FILES = [
  /* ── Data files ── */
  { label: "Entities-Data.js", path: "../../Neoms~Database/windows/entities/Entities-Data.js", lang: "js", clr: 3, dir: "windows/entities", desc: "Entity records + classification labels" },
  { label: "Personnel-Data.js", path: "../../Neoms~Database/windows/personnel/Personnel-Data.js", lang: "js", clr: 3, dir: "windows/personnel", desc: "Personnel roster + departments" },
  { label: "Sites-Data.js", path: "../../Neoms~Database/windows/sites/Sites-Data.js", lang: "js", clr: 3, dir: "windows/sites", desc: "Containment site records" },

  /* ── Core JS ── */
  { label: "archive-shell.js", path: "../../Neoms~Database/JS/archive-shell.js", lang: "js", clr: 2, dir: "JS", desc: "Archive shell + window loader" },
  { label: "db-common.js", path: "../../Neoms~Database/JS/db-common.js", lang: "js", clr: 2, dir: "JS", desc: "Shared database helpers" },
  { label: "desktop-core.js", path: "../../Neoms~Database/JS/desktop-core.js", lang: "js", clr: 2, dir: "JS", desc: "Session guard, menus, clearance" },
  { label: "intake.js", path: "../../Neoms~Database/JS/intake.js", lang: "js", clr: 2, dir: "JS", desc: "Intake terminal logic" },

  /* ── HTML ── */
  { label: "archive.html", path: "../../Neoms~Database/HTML/archive.html", lang: "html", clr: 1, dir: "HTML", desc: "Archive shell markup" },
  { label: "intake.html", path: "../../Neoms~Database/HTML/intake.html", lang: "html", clr: 1, dir: "HTML", desc: "Intake terminal markup" },

  /* ── CSS ── */
  { label: "Databaselog.css", path: "../../Neoms~Database/CSS/Databaselog.css", lang: "css", clr: 1, dir: "CSS", desc: "Main stylesheet" },
  { label: "archive.css", path: "../../Neoms~Database/CSS/archive.css", lang: "css", clr: 1, dir: "CSS", desc: "Archive theme" },
  { label: "intake.css", path: "../../Neoms~Database/CSS/intake.css", lang: "css", clr: 1, dir: "CSS", desc: "Intake terminal styles" },

  /* ── Windows ── */
  { label: "main.html", path: "../../Neoms~Database/windows/main/main.html", lang: "html", clr: 1, dir: "windows/main", desc: "Containment Log window" },
  { label: "main.js", path: "../../Neoms~Database/windows/main/main.js", lang: "js", clr: 2, dir: "windows/main", desc: "Containment Log logic" },
  { label: "entities.html", path: "../../Neoms~Database/windows/entities/entities.html", lang: "html", clr: 1, dir: "windows/entities", desc: "Entity Registry window" },
  { label: "entities.js", path: "../../Neoms~Database/windows/entities/entities.js", lang: "js", clr: 2, dir: "windows/entities", desc: "Entity Registry logic" },
  { label: "entity-detail.html", path: "../../Neoms~Database/windows/entity-detail/entity-detail.html", lang: "html", clr: 1, dir: "windows/entity-detail", desc: "Entity Detail window" },
  { label: "entity-detail.js", path: "../../Neoms~Database/windows/entity-detail/entity-detail.js", lang: "js", clr: 2, dir: "windows/entity-detail", desc: "Entity Detail logic" },
  { label: "entity-scheme.html", path: "../../Neoms~Database/windows/entity-scheme/entity-scheme.html", lang: "html", clr: 1, dir: "windows/entity-scheme", desc: "Entity Classification Scheme window" },
  { label: "entity-scheme.js", path: "../../Neoms~Database/windows/entity-scheme/entity-scheme.js", lang: "js", clr: 2, dir: "windows/entity-scheme", desc: "Entity Classification Scheme logic" },
  { label: "entity-scheme.css", path: "../../Neoms~Database/windows/entity-scheme/entity-scheme.css", lang: "css", clr: 1, dir: "windows/entity-scheme", desc: "Entity Classification Scheme styles" },
  { label: "entitycreator.html", path: "../../Neoms~Database/windows/entitycreator/entitycreator.html", lang: "html", clr: 1, dir: "windows/entitycreator", desc: "Entity Creator window" },
  { label: "entitycreator.js", path: "../../Neoms~Database/windows/entitycreator/entitycreator.js", lang: "js", clr: 2, dir: "windows/entitycreator", desc: "Entity Creator logic" },
  { label: "personnel.html", path: "../../Neoms~Database/windows/personnel/personnel.html", lang: "html", clr: 1, dir: "windows/personnel", desc: "Personnel Records window" },
  { label: "personnel.js", path: "../../Neoms~Database/windows/personnel/personnel.js", lang: "js", clr: 2, dir: "windows/personnel", desc: "Personnel Records logic" },
  { label: "sites.html", path: "../../Neoms~Database/windows/sites/sites.html", lang: "html", clr: 1, dir: "windows/sites", desc: "Sites window" },
  { label: "sites.js", path: "../../Neoms~Database/windows/sites/sites.js", lang: "js", clr: 2, dir: "windows/sites", desc: "Sites logic" },
  { label: "terminal.html", path: "../../Neoms~Database/windows/terminal/terminal.html", lang: "html", clr: 1, dir: "windows/terminal", desc: "Terminal window" },
  { label: "terminal.js", path: "../../Neoms~Database/windows/terminal/terminal.js", lang: "js", clr: 2, dir: "windows/terminal", desc: "Terminal logic" },
  { label: "terminal.css", path: "../../Neoms~Database/windows/terminal/terminal.css", lang: "css", clr: 1, dir: "windows/terminal", desc: "Terminal styles" },
  { label: "worldmap.html", path: "../../Neoms~Database/windows/worldmap/worldmap.html", lang: "html", clr: 1, dir: "windows/worldmap", desc: "World Map window" },
  { label: "worldmap.js", path: "../../Neoms~Database/windows/worldmap/worldmap.js", lang: "js", clr: 2, dir: "windows/worldmap", desc: "World Map logic" },
  { label: "worldmap.css", path: "../../Neoms~Database/windows/worldmap/worldmap.css", lang: "css", clr: 1, dir: "windows/worldmap", desc: "World Map styles" },
  { label: "codeviewer.html", path: "../../Neoms~Database/windows/codeviewer/codeviewer.html", lang: "html", clr: 1, dir: "windows/codeviewer", desc: "Code Viewer window" },
  { label: "codeviewer.js", path: "../../Neoms~Database/windows/codeviewer/codeviewer.js", lang: "js", clr: 2, dir: "windows/codeviewer", desc: "Code Viewer logic" },
  { label: "codeviewer.css", path: "../../Neoms~Database/windows/codeviewer/codeviewer.css", lang: "css", clr: 1, dir: "windows/codeviewer", desc: "Code Viewer styles" }
];
