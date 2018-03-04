// ==UserScript==
// @name         xauat6 - Remove dead torrents
// @namespace    https://blog.rhilip.info/
// @version      20180304
// @description  Remove dead torrent in pt.xauat6.edu.cn
// @author       Rhilip
// @match        http://pt.xauat6.edu.cn/torrents.php*
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/xauat6%20-%20Remove%20dead%20torrents.user.js
// ==/UserScript==

(function () {
    jQuery("#outer > table.torrents > tbody > tr").each(function () {
        var tr = jQuery(this);
        if (tr.find("td:nth-child(6) > span").text() == "0") {
            tr.remove();
        }
    });
})();
