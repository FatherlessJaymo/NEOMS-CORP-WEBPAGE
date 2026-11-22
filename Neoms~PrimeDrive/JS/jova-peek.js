/* ============================================================
   JOVA PEEK
   Every so often Jova pops up from behind the taskbar at a
   random spot, spins (jova_001–005 in Creator/frames), stops
   facing front for a moment, then sinks back down.

   Tweak the timing below. window.jovaPeek() triggers it now.
   Skipped for visitors with "reduce motion" turned on.
============================================================ */
(function () {
    var FRAME_DIR = "Neoms~Universal-Fonts+Images/Creator/frames/";
    var FRAMES = ["jova_001.png", "jova_002.png", "jova_003.png", "jova_004.png", "jova_005.png"];

    var FIRST_DELAY = [15, 30]; /* seconds before the first peek (min, max) */
    var DELAY = [40, 100]; /* seconds between peeks (min, max) */
    var FRAME_MS = 80; /* time per spin frame */
    var SPINS = 3; /* full spins while popping up */
    var HOLD_MS = 1400; /* time spent facing front before sinking */
    var MOVE_MS = 450; /* rise / sink duration (match jova-peek.css) */

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var busy = false;
    var stage, img;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function build() {
        stage = document.createElement("div");
        stage.id = "jova-peek";
        stage.setAttribute("aria-hidden", "true");
        img = document.createElement("img");
        img.alt = "";
        img.src = FRAME_DIR + FRAMES[0];
        stage.appendChild(img);
        document.body.appendChild(stage);

        /* Preload every frame so the spin doesn't flicker */
        FRAMES.forEach(function (f) {
            new Image().src = FRAME_DIR + f;
        });
    }

    function peek() {
        if (busy || !stage) return;
        busy = true;

        /* Random spot along the taskbar, kept on screen */
        var w = img.offsetWidth || 90;
        img.style.left = Math.round(rand(0.1, 0.9) * (window.innerWidth - w)) + "px";

        var i = 0;
        var total = SPINS * FRAMES.length;
        img.src = FRAME_DIR + FRAMES[0];
        stage.classList.add("up");

        var spin = setInterval(function () {
            i++;
            img.src = FRAME_DIR + FRAMES[i % FRAMES.length];
            if (i < total) return;

            /* Done spinning — face front, wait, then sink */
            clearInterval(spin);
            img.src = FRAME_DIR + FRAMES[0];
            setTimeout(function () {
                stage.classList.remove("up");
                setTimeout(function () {
                    busy = false;
                }, MOVE_MS);
            }, HOLD_MS);
        }, FRAME_MS);
    }

    function schedule(range) {
        setTimeout(function () {
            if (!document.hidden) peek();
            schedule(DELAY);
        }, rand(range[0], range[1]) * 1000);
    }

    window.jovaPeek = peek;

    document.addEventListener("DOMContentLoaded", function () {
        build();
        if (!reduceMotion) schedule(FIRST_DELAY);
    });
})();
