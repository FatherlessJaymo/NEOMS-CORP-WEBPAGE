/* ============================================================
   NEOMIX — BUILDER (Studio Deck layout — 2-column)
   The window shell HTML for the NeoMix music player.
   The actual playback / YouTube logic lives in neomix-player.js.

   LAYOUT — 2-column CSS grid inside a size container:
     [ rail (playlist queue) | stage ]
     stage: display → now playing → seek row → transport → controls
   The rail shrinks to a number strip when the window is narrow
   (see @container rules in neomix-player.css).
   Exposed: window.buildNeomix
============================================================ */
(function () {
  var NM = "Neoms~Universal-Fonts+Images/Icons/Neomix/";

  /* Drawn transport icons (prev / next) — crisp at any size */
  var SVG_PREV =
    '<svg viewBox="0 0 24 24" class="neomix-ico" aria-hidden="true">' +
    '<rect x="5" y="5" width="2.5" height="14" rx="1"/>' +
    '<path d="M19 5.5v13a.8.8 0 0 1-1.2.7L8.6 12.7a.8.8 0 0 1 0-1.4l9.2-6.5a.8.8 0 0 1 1.2.7z"/></svg>';
  var SVG_NEXT =
    '<svg viewBox="0 0 24 24" class="neomix-ico" aria-hidden="true">' +
    '<rect x="16.5" y="5" width="2.5" height="14" rx="1"/>' +
    '<path d="M5 5.5v13a.8.8 0 0 0 1.2.7l9.2-6.5a.8.8 0 0 0 0-1.4L6.2 4.8A.8.8 0 0 0 5 5.5z"/></svg>';

  window.buildNeomix = function () {
    return (
      '<div class="neomix-shell">' +
      '<div id="neomix-player" data-playlist="NeoMsMix-Main" class="paused">' +
      /* === LEFT RAIL — playlist drawer === */
      '<aside id="neomix-rail">' +
      '<div class="rail-head">' +
      '<select id="neomix-playlist-select" title="Playlist">' +
      '<option value="NeoMsMix-Main">NeoMsMix-Main</option>' +
      '<option value="SinisterMinds">SinisterMinds</option>' +
      '<option value="SinisterMinds (intr)">SinisterMinds (intr)</option>' +
      '<option value="NeoMsMix-Rewrite">NeoMsMix-Rewrite</option>' +
      "</select>" +
      '<button id="neomix-rail-toggle" class="neomix-btn" title="Show / hide playlist">‹</button>' +
      "</div>" +
      '<div class="rail-list" id="neomix-rail-list">' +
      '<div class="rail-list-title">// QUEUE</div>' +
      '<div class="rail-list-empty">// Loading queue...</div>' +
      "</div>" +
      "</aside>" +
      /* === CENTER STAGE (id #neomix-body kept for the player script) === */
      '<main id="neomix-body">' +
      /* Video — the iframe is moved in/out by neomixApplyVideoMode().
         With video off, the cover art fallback shows instead. */
      '<div id="neomix-display">' +
      '<div class="neomix-live">CH-07 <span class="neomix-live-tag">BROADCASTING</span></div>' +
      '<div id="neomix-yt-target"></div>' +
      '<div class="neomix-display-fallback">' +
      '<img src="' + NM + 'Neomix-Sonic.jpg" alt="" class="neomix-cover" draggable="false"/>' +
      '<span class="neomix-cover-cap">AUDIO ONLY</span>' +
      "</div>" +
      "</div>" +
      /* Now-playing card */
      '<div id="neomix-screen">' +
      '<div id="neomix-song-name"><span class="nm-title-text">Loading...</span></div>' +
      '<div id="neomix-song-sub">Standby</div>' +
      "</div>" +
      /* Seek row: current time — bar — duration */
      '<div class="neomix-seek-row">' +
      '<span id="neomix-time-cur">0:00</span>' +
      '<input type="range" id="neomix-seek-bar" value="0" min="0" max="100" title="Seek"/>' +
      '<span id="neomix-time-dur">0:00</span>' +
      "</div>" +
      /* Row 1 — transport */
      '<div class="neomix-transport">' +
      '<button id="neomix-prev" class="neomix-btn neomix-ibtn" title="Previous">' + SVG_PREV + "</button>" +
      '<button id="neomix-play" class="neomix-btn neomix-ibtn" title="Play / Pause">' +
      '<img src="' + NM + 'play.png" alt="Play" class="neomix-ibtn-img" draggable="false"/>' +
      "</button>" +
      '<button id="neomix-next" class="neomix-btn neomix-ibtn" title="Next">' + SVG_NEXT + "</button>" +
      "</div>" +
      /* Row 2 — toggles + volume */
      '<div class="neomix-controls">' +
      '<button id="neomix-shuffle" class="neomix-btn neomix-toggle-btn" state="off" title="Shuffle">' +
      '<img src="' + NM + 'shuffle.gif" alt="" class="neomix-toggle-img" draggable="false"/>' +
      "<span>Shuffle</span>" +
      "</button>" +
      '<button id="neomix-video-toggle" class="neomix-btn neomix-toggle-btn" state="off" title="Show video">' +
      "<span>Video</span>" +
      "</button>" +
      '<div class="neomix-vol-group">' +
      '<button id="neomix-mute" class="neomix-btn" title="Mute">&#128266;</button>' +
      '<input type="range" id="neomix-vol-bar" min="0" max="100" value="50" title="Volume"/>' +
      "</div>" +
      "</div>" +
      "</main>" +
      "</div>" +
      "</div>"
    );
  };
})();
