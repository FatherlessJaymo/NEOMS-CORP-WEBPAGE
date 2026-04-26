/* ============================================================
   GUEST BOOK
   Embeds a Cbox iframe. No interactive logic on our side.
============================================================ */
(function () {
    window.buildGuestbook = function () {
        return (
            '<div class="gb-wrap">' +
              '<div class="gb-header">' +
                '<span class="gb-title">Guest Book</span>' +
                '<a class="copy-btn gb-chat-link" href="https://my.cbox.ws/Neoms-systems-log" target="_blank" rel="noopener">Chat</a>' +
              '</div>' +
              '<iframe id="Guestbook-Frame" class="gb-frame" ' +
                'src="https://www3.cbox.ws/box/?boxid=3553385&boxtag=ohcaCT" ' +
                'title="NeoMS Guest Book" allow="autoplay"></iframe>' +
            '</div>'
        );
    };
})();
