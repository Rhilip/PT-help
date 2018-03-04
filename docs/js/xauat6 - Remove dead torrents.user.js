// ==UserScript==
// @name         xauat6 - Remove dead torrents
// @namespace    https://blog.rhilip.info/
// @version      0.1
// @description  Remove dead torrent in pt.xauat6.edu.cn
// @author       You
// @match        http://pt.xauat6.edu.cn/torrents.php*
// @grant        none
// ==/UserScript==

(function () {
    jQuery("#outer > table.torrents > tbody > tr").each(function () {
        var tr = jQuery(this);
        if (tr.find("td:nth-child(6) > span").text() == "0") {
            tr.remove();
        }
    });
})();
