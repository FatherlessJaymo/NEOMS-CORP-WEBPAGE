/* ============================================================
   NEOMIX — BUILDER
   The window shell HTML for the NeoMix music player.
   The actual playback / YouTube logic lives in neomix-player.js.

   Exposed: window.buildNeomix
============================================================ */
(function () {
    var NM = "Neoms~Universal-Fonts+Images/Icons/Neomix/";

    function imgBtn(id, file, alt) {
        return (
            '<button id="' + id + '" class="neomix-ibtn" title="' + alt + '">' +
              '<img src="' + NM + file + '" alt="' + alt +
                '" class="neomix-ibtn-img" draggable="false"/>' +
            '</button>'
        );
    }

    window.buildNeomix = function () {
        return (
            '<div id="neomix-player">' +
              '<div id="neomix-title-bar">NEOMIX PLAYER</div>' +
              '<div id="neomix-body">' +
                '<div id="neomix-display" style="display:none;">' +
                  '<div id="neomix-yt-target"></div>' +
                '</div>' +
                '<div id="neomix-screen">' +
                  '<div id="neomix-song-name"><b>Loading...</b></div>' +
                  '<div id="neomix-song-sub"><br/></div>' +
                '</div>' +
                '<div class="neomix-row">' +
                  '<button id="neomix-mute">&#128266;</button>' +
                  '<input type="range" id="neomix-vol-bar" min="0" max="100" value="50"/>' +
                  '<select id="neomix-playlist-select" style="flex-shrink:0;font-size:7px;max-width:120px;">' +
                    '<option value="NeoMsMix-Main">NeoMsMix-Main</option>' +
                    '<option value="SinisterMinds">SinisterMinds</option>' +
                    '<option value="SinisterMinds (intr)">SinisterMinds (intr)</option>' +
                    '<option value="NeoMsMix-Rewrite">NeoMsMix-Rewrite</option>' +
                  '</select>' +
                '</div>' +
                '<div class="neomix-row">' +
                  '<button id="neomix-video-toggle" class="neomix-toggle-btn" state="off"><span>Video</span></button>' +
                  '<button id="neomix-shuffle" class="neomix-toggle-btn" state="off">' +
                    '<img src="' + NM + 'shuffle.gif" alt="Shuffle" class="neomix-toggle-img" draggable="false"/>' +
                    '<span>Shuffle</span>' +
                  '</button>' +
                '</div>' +
                '<input type="range" id="neomix-seek-bar" value="0" style="width:100%;display:block;margin:6px 0;"/>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">' +
                  '<div class="neomix-ctrls">' +
                    imgBtn("neomix-prev", "prev.png", "Previous") +
                    imgBtn("neomix-play", "play.png", "Play/Pause") +
                    imgBtn("neomix-next", "next.png", "Next") +
                  '</div>' +
                  '<div class="neomix-info-row">' +
                    '<span id="neomix-time-cur">0:00</span>/' +
                    '<span id="neomix-time-dur">0:00</span>' +
                    '<span id="neomix-track-info">&mdash;/&mdash;</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
        );
    };
})();
