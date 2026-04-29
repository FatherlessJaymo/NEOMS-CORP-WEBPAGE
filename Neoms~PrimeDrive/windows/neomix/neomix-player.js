/* ============================================================
   NEOMIX PLAYER
   Loads the YouTube IFrame API once and auto-starts playback.
   Also wires the taskbar mini-player controls.
   No longer requires opening the NeoMix window first.

   ICONS:
   Uses uploaded images from /Neoms~Universal-Fonts+Images/icons/Neomix/
   for play.png, pause.png, prev.png, next.png, shuffle.png.
   Play button swaps src between play.png and pause.png on state change.

   VIDEO TOGGLE:
   The YT iframe lives inside a hidden off-screen <div id="neomix-yt-hidden">
   so playback survives the window being closed. When Video is toggled on,
   we physically move that iframe into the on-screen <div id="neomix-yt-target">.

   STUDIO DECK ADDITIONS (used by the new builder):
     - Playlist queue list rendered into #neomix-rail-list with
       click-to-jump (neomixRenderQueue, called on load + state change).
       Names come from two hardcoded sources — see NEOMIX_QUEUE_NAMES
       and NEOMIX_QUEUE_NAMES_BY_ID below.
     - Rail collapse toggle on #neomix-rail-toggle.
   Both no-op gracefully if the new elements aren't present.
============================================================ */
var NEOMIX_ICON_PATH = "/Neoms~Universal-Fonts+Images/Icons/Neomix/";

var NEOMIX_PLAYLISTS = {
  "NeoMsMix-Main": "PLV-phDrTzbSXqxdDXn9itq4bwt9bgER2g",
  SinisterMinds: "PLV-phDrTzbSVxpmsO9HWTPFftu6ooZaTS",
  "SinisterMinds (intr)": "PLV-phDrTzbSXwjyUEUYEaFUf6wtXT7ilE",
  "NeoMsMix-Rewrite": "PLV-phDrTzbSWafn5ZpEx77GgO5adfZgRf"
};

/* ============================================================
   QUEUE NAMES — hardcoded track names. TWO sources, looked up
   in this order:

   1. NEOMIX_QUEUE_NAMES_BY_ID — keyed by YouTube video ID.
      Wins over everything else. Useful when:
        - The same song appears in multiple playlists and you
          want one source of truth for its name.
        - You want names to stay correct even if you reorder
          the YouTube playlist.
      You can find a video's ID in its YouTube URL:
      https://www.youtube.com/watch?v=dQw4w9WgXcQ  ->  "dQw4w9WgXcQ"

   2. NEOMIX_QUEUE_NAMES[playlistKey][index] — per-playlist
      ordered arrays. Easier for bulk-filling because you don't
      need to look up IDs, but the array order MUST match the
      YouTube playlist order.

   3. Falls back to "Track NN" if neither is filled in.
============================================================ */

/* By-ID lookup. Highest priority. */
var NEOMIX_QUEUE_NAMES_BY_ID = {
  // "dQw4w9WgXcQ": "Never Gonna Give You Up",
  // "yourVideoId": "Your Song Name",
};

/* By-playlist ordered lookup. Index must match YouTube playlist order. */
var NEOMIX_QUEUE_NAMES = {
  "NeoMsMix-Main": [
    // "Track 1 Name",
    // "Track 2 Name",
  ],
  SinisterMinds: [
    //
  ],
  "SinisterMinds (intr)": [
    //
  ],
  "NeoMsMix-Rewrite": [
    //
  ]
};

var neomixYtPlayer = null;
var neomixYtReady = false;
var neomixIsSeeking = false;
var neomixIsVolSliding = false;
var neomixSavedVol = 50;
var neomixIsMuted = false;
var neomixIsVideoOn = false;
var neomixIsShuffleOn = false;
var neomixCurrentPl = "NeoMsMix-Main";
var neomixStatusInterval = null;
var neomixLastPlIdx = -1; /* tracks playlist index for queue re-render */

/* ---- helpers ---- */
function neomixFmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  var m = Math.floor(s / 60),
    sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function neomixUpdateSong() {
  if (!neomixYtPlayer || !neomixYtPlayer.getVideoData) return;
  var data = neomixYtPlayer.getVideoData();
  var nameEl = document.getElementById("neomix-song-name");
  if (!nameEl) return;
  var title = (data && data.title) || "";
  var author = (data && data.author) || "";
  nameEl.innerHTML = title
    ? "<marquee><b>" + title + (author ? " \u2014 " + author : "") + "</b></marquee>"
    : "<b>READY</b>";
}

/* Swap the <img> inside a play/pause button */
function neomixSetPlayImg(btn, playing) {
  if (!btn) return;
  var img = btn.querySelector("img");
  if (!img) return;
  img.src = NEOMIX_ICON_PATH + (playing ? "pause.png" : "play.png");
  img.alt = playing ? "Pause" : "Play";
}

/* Look up a hardcoded queue name. Priority order:
     1. NEOMIX_QUEUE_NAMES_BY_ID[videoId]
     2. NEOMIX_QUEUE_NAMES[playlistKey][idx]
     3. "" (caller falls back to "Track NN")
   videoId may be undefined/empty — only the playlist-array
   path will be tried in that case. */
function neomixQueueName(playlistKey, idx, videoId) {
  /* 1. Video-ID override */
  if (videoId && NEOMIX_QUEUE_NAMES_BY_ID[videoId]) {
    return NEOMIX_QUEUE_NAMES_BY_ID[videoId];
  }
  /* 2. Per-playlist array */
  var arr = NEOMIX_QUEUE_NAMES[playlistKey];
  if (arr && arr.length) {
    var name = arr[idx];
    if (typeof name === "string" && name) return name;
  }
  return "";
}

/* ---- STUDIO DECK: render the playlist queue into #neomix-rail-list ----
   Names come from NEOMIX_QUEUE_NAMES_BY_ID first, then NEOMIX_QUEUE_NAMES,
   with a "Track NN" fallback for entries that aren't filled in.
   Each row is clickable and jumps to that track via playVideoAt.
   No-op if #neomix-rail-list isn't in the DOM. */
function neomixRenderQueue() {
  var list = document.getElementById("neomix-rail-list");
  if (!list || !neomixYtPlayer || !neomixYtPlayer.getPlaylist) return;
  var pl = neomixYtPlayer.getPlaylist();
  if (!pl || !pl.length) return;

  var idx = neomixYtPlayer.getPlaylistIndex();

  var html = '<div class="rail-list-title">// QUEUE</div>';
  for (var i = 0; i < pl.length; i++) {
    var active = i === idx;
    var num = active ? "\u25B6" : (i + 1 < 10 ? "0" : "") + (i + 1);
    /* getPlaylist() returns an array of video IDs (strings) — use the
       ID for the by-ID lookup, fall back to playlist-array, fall back
       to "Track NN". */
    var videoId = pl[i];
    var name = neomixQueueName(neomixCurrentPl, i, videoId) || "Track " + (i + 1);
    if (name.length > 32) name = name.slice(0, 32) + "\u2026";
    html +=
      '<div class="rail-track' +
      (active ? " active" : "") +
      '" data-idx="' +
      i +
      '">' +
      '<span class="rail-track-num">' +
      num +
      "</span>" +
      '<span class="rail-track-name">' +
      neomixEsc(name) +
      "</span>" +
      "</div>";
  }
  list.innerHTML = html;

  /* Wire click-to-jump on each row */
  var rows = list.querySelectorAll(".rail-track");
  for (var j = 0; j < rows.length; j++) {
    rows[j].addEventListener("click", function () {
      var i = parseInt(this.getAttribute("data-idx"), 10);
      if (!isNaN(i) && neomixYtPlayer && neomixYtPlayer.playVideoAt) {
        neomixYtPlayer.playVideoAt(i);
      }
    });
  }
}

/* Tiny escaper used by the queue renderer */
function neomixEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function neomixUpdateStatus() {
  if (!neomixYtPlayer || !neomixYtPlayer.getPlayerState) return;
  var state = neomixYtPlayer.getPlayerState();
  var subEl = document.getElementById("neomix-song-sub");
  var seek = document.getElementById("neomix-seek-bar");
  var tCur = document.getElementById("neomix-time-cur");
  var tDur = document.getElementById("neomix-time-dur");
  var info = document.getElementById("neomix-track-info");
  var play = document.getElementById("neomix-play");
  var cur = neomixYtPlayer.getCurrentTime() || 0;
  var dur = neomixYtPlayer.getDuration() || 0;

  if (seek) {
    seek.max = dur;
    if (!neomixIsSeeking) seek.value = cur;
  }
  if (!neomixIsVolSliding) {
    var vb = document.getElementById("neomix-vol-bar");
    if (vb && neomixYtPlayer.getVolume) vb.value = neomixYtPlayer.getVolume();
  }
  if (tCur) tCur.textContent = neomixFmtTime(cur);
  if (tDur) tDur.textContent = neomixFmtTime(dur);
  var pl = neomixYtPlayer.getPlaylist && neomixYtPlayer.getPlaylist();
  var idx = neomixYtPlayer.getPlaylistIndex && neomixYtPlayer.getPlaylistIndex();
  if (info && pl) info.textContent = idx + 1 + " / " + pl.length;

  var ss =
    state === -1
      ? "Stopped"
      : state === 0
        ? "Ended"
        : state === 1
          ? "Playing"
          : state === 2
            ? "Paused"
            : state === 3
              ? "Loading..."
              : state === 5
                ? "Cued"
                : "Standby";
  if (subEl) {
    subEl.innerHTML =
      ss + (pl ? " " + (idx + 1) + "/" + pl.length : "") + " " + neomixFmtTime(cur) + "/" + neomixFmtTime(dur);
    subEl.className = state === 2 ? "neomix-blink" : "";
  }

  /* Play button: swap the <img> src */
  if (play) neomixSetPlayImg(play, state === 1);

  /* Studio Deck: re-render queue when the active track changes
     (keeps the "▶" indicator in the rail synced with playback) */
  if (idx !== neomixLastPlIdx) {
    neomixLastPlIdx = idx;
    neomixRenderQueue();
  }
}

function neomixLoadPlaylist(key) {
  if (!neomixYtPlayer || !neomixYtReady) return;
  neomixCurrentPl = key;
  neomixYtPlayer.stopVideo();
  neomixYtPlayer.loadPlaylist({ list: NEOMIX_PLAYLISTS[key], listType: "playlist" });
  if (neomixIsShuffleOn) neomixYtPlayer.setShuffle(true);

  /* Reset queue index tracking so the queue re-renders after the
     new playlist loads — and so the names update for the new playlist. */
  neomixLastPlIdx = -1;
}

/* ---- VIDEO TOGGLE: move the iframe between hidden and visible containers ---- */
function neomixApplyVideoMode() {
  var hiddenHost = document.getElementById("neomix-yt-hidden");
  var visibleHost = document.getElementById("neomix-yt-target");
  var displayWrap = document.getElementById("neomix-display");
  var iframe = hiddenHost ? hiddenHost.querySelector("iframe") : null;
  if (!iframe) iframe = visibleHost ? visibleHost.querySelector("iframe") : null;
  if (!iframe) return;

  if (neomixIsVideoOn && visibleHost) {
    if (iframe.parentElement !== visibleHost) visibleHost.appendChild(iframe);
    iframe.style.cssText = "width:100%;height:100%;border:0;display:block;";
    if (displayWrap) displayWrap.style.display = "block";
  } else if (hiddenHost) {
    if (iframe.parentElement !== hiddenHost) hiddenHost.appendChild(iframe);
    iframe.style.cssText = "width:1px;height:1px;border:0;display:block;";
    /* In the Studio Deck layout we DON'T hide #neomix-display — we let
       the .neomix-display-fallback message show through instead. */
  }
}

/* ---- YouTube IFrame API callback ---- */
window.onYouTubeIframeAPIReady = function () {
  neomixYtReady = true;
  var host = document.getElementById("neomix-yt-hidden");
  if (!host) {
    host = document.createElement("div");
    host.id = "neomix-yt-hidden";
    host.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(host);
  }
  var slot = document.createElement("div");
  host.appendChild(slot);

  neomixYtPlayer = new YT.Player(slot, {
    height: "1",
    width: "1",
    playerVars: { controls: 0, autoplay: 1, playsinline: 1, loop: 1, modestbranding: 1, rel: 0 },
    events: {
      onReady: function (e) {
        e.target.setVolume(50);
        e.target.setLoop(true);
        neomixLoadPlaylist(neomixCurrentPl);
        neomixApplyVideoMode();
      },
      onStateChange: function (e) {
        neomixUpdateSong();
        neomixUpdateStatus();
        if (e.data === YT.PlayerState.ENDED) {
          var pl = neomixYtPlayer.getPlaylist();
          var idx = neomixYtPlayer.getPlaylistIndex();
          if (pl && idx >= pl.length - 1) neomixYtPlayer.playVideoAt(0);
          else neomixYtPlayer.nextVideo();
        }
        clearInterval(neomixStatusInterval);
        neomixStatusInterval = setInterval(neomixUpdateStatus, 500);

        /* Studio Deck: when a playlist first loads (state 5 = cued or
           state 1 = playing) and we have tracks but no queue rendered,
           force a render. */
        if (e.data === 1 || e.data === 5) {
          var list = document.getElementById("neomix-rail-list");
          if (list && !list.querySelector(".rail-track")) neomixRenderQueue();
        }
      }
    }
  });
};

/* ---- Load YouTube IFrame API script ---- */
(function () {
  if (!document.getElementById("yt-iframe-api")) {
    var tag = document.createElement("script");
    tag.id = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }
})();

/* ---- Wire NeoMix window controls (called after window opens) ---- */
function initNeomixInWin() {
  setTimeout(function () {
    var playBtn = document.getElementById("neomix-play");
    if (!playBtn) return;
    var prevBtn = document.getElementById("neomix-prev");
    var stopBtn = document.getElementById("neomix-stop");
    var nextBtn = document.getElementById("neomix-next");
    var seekBar = document.getElementById("neomix-seek-bar");
    var volBar = document.getElementById("neomix-vol-bar");
    var muteBtn = document.getElementById("neomix-mute");
    var shufBtn = document.getElementById("neomix-shuffle");
    var vidBtn = document.getElementById("neomix-video-toggle");
    var plSel = document.getElementById("neomix-playlist-select");
    /* Studio Deck additions */
    var railToggle = document.getElementById("neomix-rail-toggle");
    var playerEl = document.getElementById("neomix-player");

    playBtn.addEventListener("click", function () {
      if (!neomixYtPlayer) return;
      neomixYtPlayer.getPlayerState() === 1 ? neomixYtPlayer.pauseVideo() : neomixYtPlayer.playVideo();
    });
    if (stopBtn)
      stopBtn.addEventListener("click", function () {
        if (neomixYtPlayer) neomixYtPlayer.stopVideo();
      });
    if (prevBtn)
      prevBtn.addEventListener("click", function () {
        if (neomixYtPlayer) neomixYtPlayer.previousVideo();
      });
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        if (!neomixYtPlayer) return;
        var pl = neomixYtPlayer.getPlaylist && neomixYtPlayer.getPlaylist();
        var idx = neomixYtPlayer.getPlaylistIndex && neomixYtPlayer.getPlaylistIndex();
        if (pl && idx >= pl.length - 1) neomixYtPlayer.playVideoAt(0);
        else neomixYtPlayer.nextVideo();
      });
    if (seekBar) {
      seekBar.addEventListener("mousedown", function () {
        neomixIsSeeking = true;
      });
      seekBar.addEventListener("input", function () {
        if (neomixYtPlayer) neomixYtPlayer.seekTo(parseFloat(this.value), true);
      });
      seekBar.addEventListener("mouseup", function () {
        neomixIsSeeking = false;
      });
    }
    if (volBar) {
      volBar.addEventListener("mousedown", function () {
        neomixIsVolSliding = true;
      });
      volBar.addEventListener("input", function () {
        var v = parseInt(this.value, 10);
        if (neomixYtPlayer) neomixYtPlayer.setVolume(v);
        neomixIsMuted = v === 0;
        if (muteBtn) muteBtn.innerHTML = neomixIsMuted ? "&#128263;" : "&#128266;";
      });
      volBar.addEventListener("mouseup", function () {
        neomixIsVolSliding = false;
      });
    }
    if (muteBtn)
      muteBtn.addEventListener("click", function () {
        if (!neomixYtPlayer) return;
        if (neomixIsMuted) {
          neomixYtPlayer.setVolume(neomixSavedVol);
          if (volBar) volBar.value = neomixSavedVol;
          muteBtn.innerHTML = "&#128266;";
          neomixIsMuted = false;
        } else {
          neomixSavedVol = parseInt(volBar ? volBar.value : 50, 10) || 50;
          neomixYtPlayer.setVolume(0);
          if (volBar) volBar.value = 0;
          muteBtn.innerHTML = "&#128263;";
          neomixIsMuted = true;
        }
      });
    if (shufBtn)
      shufBtn.addEventListener("click", function () {
        neomixIsShuffleOn = !neomixIsShuffleOn;
        this.setAttribute("state", neomixIsShuffleOn ? "on" : "off");
        if (neomixYtPlayer) {
          neomixYtPlayer.setShuffle(neomixIsShuffleOn);
          if (neomixIsShuffleOn) neomixYtPlayer.nextVideo();
        }
      });
    if (vidBtn)
      vidBtn.addEventListener("click", function () {
        neomixIsVideoOn = !neomixIsVideoOn;
        this.setAttribute("state", neomixIsVideoOn ? "on" : "off");
        neomixApplyVideoMode();
      });
    if (plSel)
      plSel.addEventListener("change", function () {
        neomixLoadPlaylist(this.value);
      });

    /* Studio Deck: rail collapse toggle */
    if (railToggle && playerEl) {
      railToggle.addEventListener("click", function () {
        playerEl.classList.toggle("rail-collapsed");
      });
    }

    /* Sync the playlist dropdown to the currently-loaded playlist
       (so reopening the window doesn't show a stale selection) */
    if (plSel && neomixCurrentPl) plSel.value = neomixCurrentPl;

    /* Reflect current state in freshly-opened buttons */
    if (vidBtn) vidBtn.setAttribute("state", neomixIsVideoOn ? "on" : "off");
    if (shufBtn) shufBtn.setAttribute("state", neomixIsShuffleOn ? "on" : "off");

    if (neomixIsVideoOn) neomixApplyVideoMode();

    neomixUpdateSong();
    neomixUpdateStatus();

    /* Studio Deck: render the queue if a playlist is already loaded */
    neomixRenderQueue();
  }, 300);
}

/* ---- Wire taskbar mini-player (called on DOMContentLoaded) ---- */
function initNeomixTaskbar() {
  var tbPlay = document.getElementById("tb-nm-play");
  var tbPrev = document.getElementById("tb-nm-prev");
  var tbNext = document.getElementById("tb-nm-next");
  var tbSeek = document.getElementById("tb-nm-seek");
  var tbVol = document.getElementById("tb-nm-vol");
  var tbTitle = document.getElementById("tb-neomix-title");
  var tbSub = document.getElementById("tb-neomix-sub");
  var tbSeeking = false;

  /* Replace glyph contents of taskbar buttons with <img> if they're still arrows */
  function installImg(btn, file, alt) {
    if (!btn) return;
    btn.innerHTML =
      '<img src="' + NEOMIX_ICON_PATH + file + '" alt="' + alt + '" class="tb-nm-img" draggable="false"/>';
  }
  installImg(tbPrev, "prev.png", "Previous");
  installImg(tbNext, "next.png", "Next");
  installImg(tbPlay, "play.png", "Play");

  if (tbPrev)
    tbPrev.addEventListener("click", function () {
      if (neomixYtPlayer) neomixYtPlayer.previousVideo();
    });
  if (tbNext)
    tbNext.addEventListener("click", function () {
      if (!neomixYtPlayer) return;
      var pl = neomixYtPlayer.getPlaylist && neomixYtPlayer.getPlaylist();
      var idx = neomixYtPlayer.getPlaylistIndex && neomixYtPlayer.getPlaylistIndex();
      if (pl && idx >= pl.length - 1) neomixYtPlayer.playVideoAt(0);
      else neomixYtPlayer.nextVideo();
    });
  if (tbPlay)
    tbPlay.addEventListener("click", function () {
      if (!neomixYtPlayer) return;
      neomixYtPlayer.getPlayerState() === 1 ? neomixYtPlayer.pauseVideo() : neomixYtPlayer.playVideo();
    });
  if (tbSeek) {
    tbSeek.addEventListener("mousedown", function () {
      tbSeeking = true;
    });
    tbSeek.addEventListener("input", function () {
      if (neomixYtPlayer) neomixYtPlayer.seekTo(parseFloat(this.value), true);
    });
    tbSeek.addEventListener("mouseup", function () {
      tbSeeking = false;
    });
  }
  if (tbVol)
    tbVol.addEventListener("input", function () {
      if (neomixYtPlayer) neomixYtPlayer.setVolume(parseInt(this.value, 10));
    });

  /* Sync mini-player every 500ms */
  setInterval(function () {
    if (!neomixYtPlayer || !neomixYtPlayer.getPlayerState) return;
    var state = neomixYtPlayer.getPlayerState();
    /* Taskbar play/pause: swap <img> src */
    neomixSetPlayImg(tbPlay, state === 1);
    var dur = neomixYtPlayer.getDuration() || 0;
    var cur = neomixYtPlayer.getCurrentTime() || 0;
    if (tbSeek && !tbSeeking) {
      tbSeek.max = dur || 100;
      tbSeek.value = cur;
      var pct = dur > 0 ? ((cur / dur) * 100).toFixed(1) + "%" : "0%";
      tbSeek.style.setProperty("--prog", pct);
    }
    if (!neomixIsVolSliding && tbVol && neomixYtPlayer.getVolume) tbVol.value = neomixYtPlayer.getVolume();
    var data = neomixYtPlayer.getVideoData && neomixYtPlayer.getVideoData();
    if (tbTitle && data && data.title)
      tbTitle.textContent = data.title.length > 28 ? data.title.slice(0, 28) + "\u2026" : data.title;
    if (tbSub) tbSub.textContent = neomixFmtTime(cur) + " / " + neomixFmtTime(dur);
  }, 500);
}

document.addEventListener("DOMContentLoaded", initNeomixTaskbar);
