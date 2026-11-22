/* ============================================================
   ART GALLERY DATA
   Edit this file to add / change art gallery entries.
   Each entry becomes its own section in the Art Gallery window.

   IMAGE FIELDS:
     img   — single image path
     imgs  — array of image paths (swipeable in fullscreen)
             e.g. imgs: ["path/a.jpg", "path/b.jpg"]
     If both are set, imgs takes priority.

   INSTAGRAM POSTS / REELS:
     Paste the link straight into img / imgs. Add your own cover
     with the object form:
       imgs: [{ src: "https://www.instagram.com/reel/ABC123/",
                thumb: "Neoms~Universal-Fonts+Images/.../cover.jpg" }]

   Each entry:
     { img, imgs, title, artist, artistUrl,
       artistSocials: [{ icon, url, label }], notes }
============================================================ */

var NEOMS_ART_GALLERY = [
    {
        imgs: [
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide0.jpeg",
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide1.jpeg",
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide2.jpeg",
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide3.jpeg",
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide4.jpeg",
            "Neoms~Universal-Fonts+Images/Art-Gallery/YUKI_Slide5.jpeg"
        ],
        title: "GLOBMAGEDDON Collection",
        artist: "yuk1draw",
        artistUrl: "mailto:yuk1drawsanything@gmail.com",
        artistSocials: [
            {
                icon: "Neoms~Universal-Fonts+Images/Icons/App_Icons/TikTok.png",
                url: "https://www.tiktok.com/@yuk1draw",
                label: "TikTok"
            },
            {
                icon: "Neoms~Universal-Fonts+Images/Icons/App_Icons/Instagram.png",
                url: "https://www.instagram.com/yuk1draw/",
                label: "Instagram"
            }
        ],
        notes: "Underrated Artist All Around Recommend You Go Follow"
    }
];
