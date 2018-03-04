// ==UserScript==
// @name         Byrbt : Give Other Bonus
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  You can give any number of Bones you want(not 25,50,100,200,400) to torrent's owner
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Give%20Other%20Bones.user.js
// ==/UserScript==

$(document).ready(function () {

    $('td.rowfollow').find('input[id^=thankbutton]:last').after('<span>  For Other Number: <input type="text" name="gift" placeholder="请输入一个正浮点数"> <input class="btn" type="button" id="thankbuttonother" value="赠送"></span>');
    var torId = location.href.match(/id=(\d+)/)[1];
    var bonus0 = $("#thankbutton25").attr("onclick").match(/,((\d*|0).\d*)\)/)[1];
    var bonustext = $('input[type="text"][name="gift"]');

    $('input#thankbuttonother').click(function () {
        givebonus(torId, bonustext.val(), bonus0);
    });

});

/**
 * Created by Rhilip on 2017/1/18.
 */
