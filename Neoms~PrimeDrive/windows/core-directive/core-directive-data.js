/* ============================================================
   CORE DIRECTIVE — DATA
   Desktop icon guide entries.

   Each entry has:
     id       — window id (matches WIN_DEFS / WIN_ICONS).
                Resolved via window.iconImg() at render time so
                whatever image the desktop uses is what shows
                in the guide.
     name     — display name in the guide row
     desc     — what this window does
     category — Apps | Tools | Social | System
                (used by the filter chips at the top)
     icon     — OPTIONAL explicit image path (overrides id lookup).
                Use for entries that don't have a window-id (e.g.
                the Neoms~Database tab launcher).

   Add a new desktop icon → add an entry here.
============================================================ */
var NEOMS_CORE_GUIDE = [
  {
    id: "prime",
    name: "Creator's Log",
    category: "System",
    desc: "Blog feed and update log. Posts about NeoMS development, Neoms~Database progress, and general notes. Tag-filterable; new entries can be added via the admin form."
  },

  {
    id: "neomix",
    name: "NeoMix",
    category: "Apps",
    desc: "Embedded music player backed by YouTube playlists (NeoMsMix-Main, SinisterMinds, NeoMsMix-Rewrite, and more). Supports shuffle, video mode, and a mini-player in the taskbar."
  },

  {
    id: "core",
    name: "Core Directive",
    category: "System",
    desc: "This window. A guide to every desktop icon and what each one contains."
  },

  {
    id: "guestbook",
    name: "Guest Book",
    category: "Social",
    desc: "Public chat/guestbook (powered by Cbox). Leave a message, say hi, or open the full chat in a new tab."
  },

  {
    id: "sticker",
    name: "Sticker HQ",
    category: "Apps",
    desc: "Click a sticker in the tray to spawn it on the desktop. Drag stickers anywhere; positions persist across visits. Hover a sticker to remove it."
  },

  {
    id: "badges",
    name: "Badges",
    category: "Tools",
    desc: "Grab the NEOMS badge for your own Neocities site. Copy the embed code and paste it into your page."
  },

  {
    id: "ranking",
    name: "Showcase",
    category: "Apps",
    desc: "Tier-list viewer. Categories: Art, Cartoons, Movies, YouTubers. Each entry is ranked SSS / SS / S with notes."
  },

  {
    id: "etc",
    name: "Etc",
    category: "Social",
    desc: "Links to my other profiles around the web (AniList, etc.). Use this for things that don't fit anywhere else."
  },

  {
    id: "friendcodes",
    name: "Game Codes",
    category: "Apps",
    desc: "Friend codes for the games I play. Each entry shows the game and the code with a one-click copy button."
  },

  {
    id: "wallpaper",
    name: "Wallpaper",
    category: "Tools",
    desc: 'Right-click the desktop and choose "Change Wallpaper" to swap the background. (Sonic CD / Neo Metal currently available.)'
  },

  /* The Neoms~Database row uses an explicit icon since it isn't a
       proper window — double-click on the desktop opens it in a new tab. */
  {
    id: "database",
    name: "Neoms~Database",
    category: "System",
    icon: "Neoms~Universal-Fonts+Images/Icons/Desktop/VM.jpg",
    desc: "Opens the Neoms~Database wiki in a new tab \u2014 the structured knowledge base behind NeoMS. Double-click the icon on the desktop to launch."
  }
];
