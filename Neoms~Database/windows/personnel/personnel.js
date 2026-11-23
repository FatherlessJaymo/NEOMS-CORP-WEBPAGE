/* ============================================================
   NEOMS — PERSONNEL RECORDS WINDOW
   Neoms~Database/windows/personnel/personnel.js
   A file browser over ~/personnel — one .nms file per person;
   hovering shows their card, clicking opens their file.
   See JS/file-browser.js.
   ============================================================ */

fbMount(document.querySelector("#wbody_" + winId + " .fb-root"), ["personnel"]);
