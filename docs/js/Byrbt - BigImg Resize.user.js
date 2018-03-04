// ==UserScript==
// @name         Byrbt : Big Img Resize
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  For the too width img in byrbt
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @supportURL   http://bt.byr.cn/forums.php?action=viewtopic&topicid=10609
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20BigImg%20Resize.user.js
// ==/UserScript==

var ControlWidth = 1080;

$(document).ready(function () {
    $("div#kdescr img").each(function () {
        var img = $(this);
        var width = img.width();
        var orginstyle = img.attr("style");
        if (width > ControlWidth) {
            img.attr("style", "max-width: 100%;");
            img.click(function () {
                if (img.attr("style") === "max-width: 100%;") {
                    img.attr("style", orginstyle);
                } else {
                    img.attr("style", "max-width: 100%;");
                }
            });
        }
    });
});


/**
 * Created by Rhilip on 2017/1/18.
 */
