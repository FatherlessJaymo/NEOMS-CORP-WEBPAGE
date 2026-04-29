/* ============================================================
   NEOMIX — BUILDER (Studio Deck layout — 2-column)
   The window shell HTML for the NeoMix music player.
   The actual playback / YouTube logic lives in neomix-player.js.

   LAYOUT — 2-column CSS grid:
     [ rail (playlist queue) | stage (video + controls) ]
   Exposed: window.buildNeomix
============================================================ */
(function () {
  var NM = "Neoms~Universal-Fonts+Images/Icons/Neomix/";

  function imgBtn(id, file, alt) {
    return (
      '<button id="' +
      id +
      '" class="neomix-ibtn" title="' +
      alt +
      '">' +
      '<img src="' +
      NM +
      file +
      '" alt="' +
      alt +
      '" class="neomix-ibtn-img" draggable="false"/>' +
      "</button>"
    );
  }

  window.buildNeomix = function () {
    return (
      '<div id="neomix-player" data-playlist="NeoMsMix-Main" class="paused">' +
      /* === TITLE BAR === */
      '<div id="neomix-title-bar">' +
      '<span class="neomix-title-text">NEOMIX PLAYER</span>' +
      '<span class="neomix-tag">\u25CF BROADCASTING</span>' +
      "</div>" +
      /* === LEFT RAIL — playlist drawer === */
      '<aside id="neomix-rail">' +
      '<div class="rail-head">' +
      '<select id="neomix-playlist-select">' +
      '<option value="NeoMsMix-Main">NeoMsMix-Main</option>' +
      '<option value="SinisterMinds">SinisterMinds</option>' +
      '<option value="SinisterMinds (intr)">SinisterMinds (intr)</option>' +
      '<option value="NeoMsMix-Rewrite">NeoMsMix-Rewrite</option>' +
      "</select>" +
      '<button id="neomix-rail-toggle" title="Collapse playlist">\u2039</button>' +
      "</div>" +
      '<div class="rail-list" id="neomix-rail-list">' +
      '<div class="rail-list-title">// QUEUE</div>' +
      '<div class="rail-list-empty">// Loading queue...</div>' +
      "</div>" +
      "</aside>" +
      /* === CENTER STAGE — video + now-playing + controls ===
                 Kept the id #neomix-body for backwards compat with any
                 selectors / scrollbar styling that targets it. */
      '<main id="neomix-body">' +
      /* Video — always rendered. The iframe gets moved in/out
                   by neomixApplyVideoMode() based on the Video toggle. */
      '<div id="neomix-display">' +
      '<div class="neomix-live">CH-07</div>' +
      '<div id="neomix-yt-target"></div>' +
      '<div class="neomix-display-fallback">// VIDEO OFF \u2014 audio only</div>' +
      "</div>" +
      /* Now-playing card */
      '<div id="neomix-screen">' +
      '<div id="neomix-song-name"><b>Loading...</b></div>' +
      '<div id="neomix-song-sub"><br/></div>' +
      "</div>" +
      /* Seek bar */
      '<input type="range" id="neomix-seek-bar" value="0" ' +
      'style="width:100%;display:block;margin:6px 0;"/>' +
      /* Single horizontal control strip */
      '<div class="neomix-controls">' +
      '<div class="neomix-ctrls">' +
      imgBtn("neomix-prev", "prev.png", "Previous") +
      imgBtn("neomix-play", "play.png", "Play/Pause") +
      imgBtn("neomix-next", "next.png", "Next") +
      "</div>" +
      '<button id="neomix-shuffle" class="neomix-toggle-btn" state="off">' +
      '<img src="' +
      NM +
      'shuffle.gif" alt="Shuffle" ' +
      'class="neomix-toggle-img" draggable="false"/>' +
      "<span>Shuffle</span>" +
      "</button>" +
      '<button id="neomix-video-toggle" class="neomix-toggle-btn" state="off">' +
      "<span>Video</span>" +
      "</button>" +
      '<div class="neomix-info-row">' +
      '<span id="neomix-time-cur">0:00</span>/' +
      '<span id="neomix-time-dur">0:00</span>' +
      '<span id="neomix-track-info">&mdash;/&mdash;</span>' +
      "</div>" +
      '<div class="neomix-vol-group">' +
      '<button id="neomix-mute">&#128266;</button>' +
      '<input type="range" id="neomix-vol-bar" min="0" max="100" value="50"/>' +
      "</div>" +
      "</div>" +
      "</main>" +
      "</div>"
    );
  };
})();
