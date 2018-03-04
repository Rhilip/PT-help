// ==UserScript==
// @name         Byrbt : Auto thanks torrent's uploader
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  自动感谢种子发布者
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @grant        none
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Auto%20Thanks.user.js
// ==/UserScript==

// == Control Options ==
var AutoThx = 1; //Auto Click thanks button  (2 - Thanks all;1 - Just thanks yourself;0 - No thanks)

// == Main part ==
$(document).ready(function () {
    var thxBtn = $("#saythanks[value*='说谢谢']");
    switch (AutoThx) {
        case 0:
            break;
        case 1:
            if (($("td#outer > table > tbody > tr:nth-child(1) > td.rowfollow > span > a > b").text()) === ($("table#info_block > tbody > tr > td > table > tbody > tr > td:nth-child(1) > span > span > a > b").text())) {
                thxBtn.parent().siblings(":last").after('<div style="float:right">Auto_thanks Powered by Byrbt MOD help</div>');
                thxBtn.click();
            }
            break;
        case 2:
            thxBtn.parent().siblings(":last").after('<div style="float:right">Auto_thanks Powered by Byrbt MOD help</div>');
            thxBtn.click();
            break;
    }
});

/**
 * Created by Rhilip on 2016/11/21.
 */
