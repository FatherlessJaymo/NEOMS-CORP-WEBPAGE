# NEOMS-CORP-WEBPAGE

![NEOMS Banner](../Neoms~Universal-Fonts+Images/Banner/Banner-1.png)

> **NEO Monitoring System — Containment Log & Personal Wiki Database** A retro-OS styled, dual-deployable knowledge
> platform for organizing structured anomaly, staff, and site records.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Schema](https://img.shields.io/badge/Schema-v2.1-00cccc)](#-database-schema)
[![Build](https://img.shields.io/badge/Build-2026.02-1a4a8a)](#)
[![Web Platform](https://img.shields.io/badge/platform-web-blue)](https://developer.mozilla.org/en-US/docs/Web)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://www.w3.org/TR/html52/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://ecma-international.org)
[![JSON](https://img.shields.io/badge/JSON--ready-000000?logo=json)](https://www.json.org)

---

## 🌐 Live Sites

| Deployment       | URL                                                                                                   | Status  |
| ---------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| **Neocities**    | [fatherlessjaymo.neocities.org](https://fatherlessjaymo.neocities.org)                                | 🟢 Live |
| **GitHub Pages** | [fatherlessjaymo.github.io/NEOMS-CORP-WEBPAGE](https://fatherlessjaymo.github.io/NEOMS-CORP-WEBPAGE/) | 🟢 Live |

---

## 📖 Overview

**NEOMS-CORP-WEBPAGE** is a dual-purpose project:

1. **PrimeDrive** — a retro Windows-style portfolio / homepage shell with a working taskbar, start menu, NEOMIX media
   player, blog, and guestbook.
2. **Neoms~Database** — a containment-log "operating system" UI for browsing **Entities**, **Staff**, **Sites**, an
   interactive D3 **World Map**, a **Terminal**, and a **Source Viewer** — all gated behind a 5-tier clearance system.

All data lives in plaintext JS arrays (no backend required), so the site runs anywhere static files can be hosted.

---

## 📸 Preview

| PrimeDrive Homepage      | Database OS Desktop     |
| ------------------------ | ----------------------- |
| ![Homepage Screenshot]() | ![Database Structure]() |

---

## 🛠 Tech Stack

| Technology                                                                                    | Role                              |
| --------------------------------------------------------------------------------------------- | --------------------------------- |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)                | Structure & semantics             |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)                   | Styling & responsiveness          |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) | Interactivity & window management |
| ![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=white)                | Interactive world map             |
| ![JSON](https://img.shields.io/badge/JSON-000000?logo=json)                                   | Data storage & config             |
| ![Highlight.js](https://img.shields.io/badge/highlight.js-1a1a1a)                             | Source viewer syntax highlighting |

---

## 🚀 Features

| Feature                         | Description                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| 🖥️ **Retro-OS Window Manager**  | Drag, resize, minimize, and z-stack windows just like a desktop OS.                      |
| 📚 **Containment Log Database** | Wiki-style records for Entities, Staff, and Sites with cross-references.                 |
| 🌐 **Interactive World Map**    | Live D3 + TopoJSON facility map with breach indicators and dossier panels.               |
| 🔐 **5-Tier Clearance System**  | CL-1 through CL-5 access gating; restricted records redact automatically.                |
| 🎵 **NEOMIX Media Player**      | Embedded YouTube playlist player with shuffle, video toggle, and seek.                   |
| ⌨️ **In-OS Terminal**           | `LIST`, `GET`, `OPEN`, `SETCLR`, `OVERRIDE`, `BREACH`, `MAP`, `CODE` and more commands.  |
| 📝 **Source Viewer**            | CL-5 gated read-only viewer for the entire codebase with syntax highlighting.            |
| ✏️ **Plaintext Data**           | All records live in editable `.js` arrays — no DB, no build step, no proprietary format. |

---

## 📂 Repository Structure

```
NEOMS-CORP-WEBPAGE/
├── index.html                          # PrimeDrive homepage entry
├── Neoms~PrimeDrive/                   # Homepage shell
│   ├── CSS/                            # Taskbar, start menu, NEOMIX, content windows
│   ├── JS/                             # window-manager.js, blog, guestbook
│   └── windows/                        # Per-window HTML fragments (creators-log, etc.)
├── Neoms~Database/                     # Database OS shell
│   ├── HTML/desktop.html               # Database OS entry
│   ├── CSS/                            # Databaselog.css, desktop.css, theme-override.css
│   ├── JS/                             # desktop.js, Databaselog.js (data records)
│   └── windows/                        # Per-window modules:
│       ├── main/                       # Containment log index
│       ├── entities/                   # Entity Registry
│       ├── entity-detail/              # Single-entity dossier
│       ├── entity-scheme/              # Classification & power scale reference
│       ├── staff/                      # Staff Records
│       ├── staff-scheme/               # Personnel Position Scheme
│       ├── sites/                      # Containment Sites
│       ├── worldmap/                   # D3 facility map + world-atlas-loader.js
│       ├── terminal/                   # In-OS terminal
│       └── codeviewer/                 # CL-5 source viewer
├── Neoms~Universal-Fonts+Images/       # Shared assets (banners, icons, fonts)
├── docs/                               # README assets, this file
├── LICENSE                             # MIT
└── README.md                           # ← you are here
```

---

## 🗄 Database Schema

The NeoMS database uses three primary record types, all stored as plaintext JS objects in
`Neoms~Database/JS/Databaselog.js`. Schema version: **v2.1**.

### Entity Record

```js
{
  id:        Number,    // numeric, padded to 4 digits in display (E-0001)
  name:      String,    // display name
  cls:       String,    // one of: HD | EU | AR | NM | AP | KT
  ps:        String,    // power scale tier, e.g. "7-B", "High 4-C", "1-A"
  status:    String,    // one of: CONTAINED | MONITORED | BREACHED | NEUTRALIZED
  clr:       Number,    // minimum clearance to view (1–5)
  site:      Number,    // Site ID where contained
  disc:      String,    // discovery date, e.g. "2024.06.12"
  sentient:  String,    // "Y" | "N" | "?"
  hostile:   String,    // "Y" | "N" | "?"
  img:       String,    // optional path to dossier image
  protocols: Array,     // containment protocols (array of strings/objects)
  desc:      String     // description / lore
}
```

### Staff Record

```js
{
  id:    Number,    // S-#### display
  fname: String,
  lname: String,
  pos:   String,    // position title (matches a role in staff-scheme)
  dept:  String,    // SYNTHETICS | FACILITY UNITS | FACILITY COMMAND |
                    // CONTAINMENT ENFORCEMENT | CONTAINMENT RESEARCH | PRIME DIRECTOR
  clr:   Number,    // 1–5
  site:  Number     // assigned site ID
}
```

### Site Record

```js
{
  id:       Number,
  name:     String,    // e.g. "Site-62656"
  loc:      String,    // geographic location string
  lat:      Number,    // for world map
  lng:      Number,
  status:   String,    // OPERATIONAL | LOCKDOWN | OFFLINE
  entities: Number,    // count cached for header (auto-derivable)
  staff:    Number,    // count cached for header
  est:      String,    // establishment date
  desc:     String
}
```

---

## 🤝 Contributing

Contributions to NEOMS-CORP-WEBPAGE are welcome — whether that's adding new entities, fixing UI bugs, or extending the
database schema.

### Contributing to the Database (Schema v2.1)

This is the most common type of contribution. Records live in `Neoms~Database/JS/Databaselog.js`.

#### Adding an Entity

Append a new object to the `ENTITIES` array following the schema:

```js
{
  id:        42,
  name:      "Hollow Choir",
  cls:       "AP",                         // HD | EU | AR | NM | AP | KT
  ps:        "High 6-A",                   // see Power Scale table above
  status:    "CONTAINED",                  // CONTAINED | MONITORED | BREACHED | NEUTRALIZED
  clr:       4,                            // minimum clearance 1–5
  site:      62656,
  disc:      "2025.11.03",
  sentient:  "Y",
  hostile:   "?",
  img:       "Neoms~Universal-Fonts+Images/Entities/E-0042.png",  // no leading slash
  protocols: [
    "Subject is to be housed in an acoustically dampened cell at Site-62656.",
    "No vocal communication is permitted within 50m of containment."
  ],
  desc: "E-0042 manifests as a chorus of voices with no apparent source. Direct exposure beyond 30 seconds correlates with severe cognitive disruption in non-CL-3+ personnel."
}
```

**Rules of thumb:**

-   IDs must be unique. Check the existing array max + 1.
-   Image paths use forward slashes and **no leading slash** so they work cross-host. They will be resolved through
    `nm()` at render time.
-   Choose `cls` and `ps` honestly — see `entity-scheme.js` for full definitions.
-   Keep `desc` lore-consistent. The in-universe voice is clinical, terse, redacted where appropriate.

#### Adding a Staff Member

```js
{
  id:    87,
  fname: "Vera",
  lname: "Solanke",
  pos:   "Containment Specialist",         // must match a title in staff-scheme.js
  dept:  "CONTAINMENT RESEARCH",
  clr:   3,
  site:  62656
}
```

#### Adding a Site

```js
{
  id:       8841,
  name:     "Site-8841",
  loc:      "Subantarctic, Heard Island",
  lat:      -53.10,
  lng:      73.51,
  status:   "OPERATIONAL",
  entities: 0,
  staff:    0,
  est:      "2025.07.19",
  desc:     "Cold-storage installation tasked with long-term cryo-suspension of dormant AP-class anomalies."
}
```

After adding a site, register its coordinates so the world map renders the marker, and update `entities`/`staff` counts
(these are also auto-derivable, but cached for the header).

#### Extending the Schema

If your contribution requires a new field on an existing record type:

1. Text The Guestbox

### What Not to Do

-   Don't introduce a leading-slash absolute path. It will silently break GitHub Pages.
-   Don't add a backend / DB. The entire point is plaintext-editable static files.
-   Don't add tracking, analytics, or external API calls without raising an issue first — Neocities CSP will block most
    of them anyway.

---

## 📜 License

MIT — see [LICENSE](LICENSE).

Copyright © 2026 FatherlessJaymo.

---

## 🔗 Links

-   **Neocities:** [fatherlessjaymo.neocities.org](https://fatherlessjaymo.neocities.org)
-   **GitHub Repo:**
    [github.com/FatherlessJaymo/NEOMS-CORP-WEBPAGE](https://github.com/FatherlessJaymo/NEOMS-CORP-WEBPAGE/tree/Main-Directive)
-   **GitHub Pages:**
    [fatherlessjaymo.github.io/NEOMS-CORP-WEBPAGE](https://fatherlessjaymo.github.io/NEOMS-CORP-WEBPAGE/)

> _NeoMS Database Schema v2.1 — Build 2026.02 — Authorized access only._
