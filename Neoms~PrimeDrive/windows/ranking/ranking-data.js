/* ============================================================
   SHOWCASE DATA
   Edit this file to add / change tier list entries.

   IMAGE FIELDS:
     img   — single image path (original, still works)
     imgs  — array of image paths for a swipeable gallery
             e.g. imgs: ["path/a.jpg", "path/b.jpg", "path/c.jpg"]
     If both are set, imgs takes priority.
     If only img is set it is treated as a one-image gallery.

   Each entry:
     { img, imgs, title, artist, artistUrl,
       artistSocials: [{ icon, url, label }],
       notes, rank: "SSS" | "SS" | "S" }
============================================================ */

var NEOMS_SHOWCASE_DATA = {
    Art: [
        {
            /* Multiple images — user can swipe through them in fullscreen */
            imgs: [
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide0.jpeg",
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide1.jpeg",
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide2.jpeg",
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide3.jpeg",
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide4.jpeg",
                "Neoms~Universal-Fonts+Images/Rankings/Art/YUKI_Slide5.jpeg"
            ],
            title: "GLOBMAGEDDON",
            artist: "yuk1draw",
            artistUrl: "",
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
            notes: "Great Artist All Around But This Is One Of My Top 10",
            rank: "SSS"
        }
    ]

    /*
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
            title: "CoryxKenshin",
            notes: "",
            rank: "SSS"
        }
    ]
    */
};
