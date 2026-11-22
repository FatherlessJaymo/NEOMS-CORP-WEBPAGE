/* ============================================================
   SHOWCASE DATA
   Edit this file to add / change tier list entries.

   IMAGE FIELDS:
     img   — single image path (original, still works)
     imgs  — array of image paths for a swipeable gallery
             e.g. imgs: ["path/a.jpg", "path/b.jpg", "path/c.jpg"]
     If both are set, imgs takes priority.
     If only img is set it is treated as a one-image gallery.

   INSTAGRAM POSTS / REELS:
     Paste the link straight into img / imgs (share-link junk
     like ?utm_source=... is fine). It plays in the fullscreen
     viewer. Instagram gives no thumbnail, so the tile shows an
     IG badge unless you add your own with the object form:
       imgs: [{ src: "https://www.instagram.com/reel/ABC123/",
                thumb: "Neoms~Universal-Fonts+Images/.../cover.jpg" }]

   Each entry:
     { img, imgs, title, artist, artistUrl,
       artistSocials: [{ icon, url, label }],
       notes, rank: "SSS" | "SS" | "S" }
============================================================ */

var NEOMS_SHOWCASE_DATA = {
    Cartoons: [
        {
            img: "",
            title: "",
            notes: "",
            rank: "SSS"
        }
    ],

    Movies: [
        {
            img: "",
            title: "",
            notes: "",
            rank: "SSS"
        }
    ],

    YouTubers: [
        {
            img: "",
            title: "",
            notes: "",
            rank: "SSS"
        }
    ]
    
};
