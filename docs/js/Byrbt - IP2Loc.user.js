// ==UserScript==
// @name         Byrbt : IP2Loc
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  It's an userscript show peer's loc due to their IPv6 address(,only for uesrs who's Level is highter than Moderator)
// @author       Rhilip
// @match        http*://bt.byr.cn/*
// @icon         http://bt.byr.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20IP2Loc.user.js
// ==/UserScript==

function trueIp(ip) {
    return ip.match(/(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/) || ip.match(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/);      //Check IPv4 or IPv6 address
}

$(document).ready(function () {
    if (location.pathname == "/details.php") {
        $('span#hidepeer > a').after('<br><a id="toloc" class="sublink">[地点查询]</a>');
        $('a#toloc').click(function () {
            $("div#peerlist > table > tbody > tr > td:nth-child(1) > br").remove();                 //Display Peer's name in a row,Please Make sure you NEED or not!
            var maintable = $('div#peerlist > table > tbody > tr > td:nth-child(2)');
            maintable.each(function () {
                var node = $(this);
                var ip = node.text();
                if (trueIp(ip)) {
                    var url = 'http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                    $.getJSON(url, function (data) {
                        node.text(data.geo.loc);
                        node.attr("title", data.geo.ip);
                    });
                }
                node.attr("width", "9%");
            });
        });
    }
    //In page viewsnatches.php and iphistory.php(Automatically)
    if (location.pathname == "/viewsnatches.php" || location.pathname == "/iphistory.php") {
        var maintable = $("td#outer > table.main > tbody > tr > td > table > tbody > tr > td:nth-child(2)");
        maintable.each(function () {
            var node = $(this);
            var ip = node.text();
            if (trueIp(ip)) {
                var url = 'http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                $.getJSON(url, function (data) {
                    if (location.pathname == "/viewsnatches.php") {
                        node.html(ip + "<br>" + "(" + data.geo.loc + ")");
                    } else if (location.pathname == "/iphistory.php") {
                        node.after("<td align='center'>" + data.geo.loc + "</td>");
                    }
                });
            } else {
                if (location.pathname == "/viewsnatches.php") {
                    node.text("IP/地点");
                } else if (location.pathname == "/iphistory.php") {
                    node.parents("table:eq(0)").attr("width", "600");
                    node.after('<td class="colhead" align="center" width="30%">地点</td>');
                }
            }
        });
    }
});

/**
 * Created by Rhili on 5/17/2017.
 */
