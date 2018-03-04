// ==UserScript==
// @name         Byrbt : Enhanced log
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  为log页面增加为有关种子（字幕）添加访问链接和快速搜索关键词，针对管理员设置种子优惠的情况能直接查询优惠类型；在种子页面的热度表中添加种子日志查询入口
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php?id=*
// @include      /^https?:\/\/bt\.byr\.cn\/log\.php((\?query\=.+)?(\?action\=dailylog(.+?)?(\&page\=\d+)?$|$))/
// @icon         http://bt.byr.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Enhanced%20log.user.js
// ==/UserScript==

$(document).ready(function () {
    if (location.pathname === "/log.php") {
        $("form").after("<b>常用快捷搜索关键词：</b>" +
            "<a href='/log.php?query=was+added+by&search=all&action=dailylog'><u>(Offer) was added by</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=was+uploaded+by&search=all&action=dailylog'><u>(Torrent) was uploaded by</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=was+edited+by&search=all&action=dailylog'><u>(Torrent) was edited by</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=was+deleted+by&search=all&action=dailylog'><u>(Torrent) was deleted by</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=首页置顶种子&search=all&action=dailylog'><u>首页置顶种子(竞价置顶)</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=批量置顶了种子&search=all&action=dailylog'><u>批量置顶了种子</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=批量设置了种子优惠&search=all&action=dailylog'><u>批量设置了种子优惠</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=Mod+Edit&search=all&action=dailylog'><u>Mod Edit</u></a>&nbsp;&nbsp;" +
            "<a href='/log.php?query=allowed+offer&search=all&action=dailylog'><u>allowed offer</u></a>&nbsp;&nbsp;");

        $("td#outer > table:last > tbody tr").each(function () {
            var tr = $(this);
            if (tr.find('td:nth-child(2) > font').length) {
                var logfont = tr.find('td:nth-child(2) > font');
                var logtext = logfont.text();
                if (logtext.match((/Torrent (\d+) \((.+)\)/)) && logtext.match(/edited|uploaded/)) {     // (torrent) uploaded,edited,deleted
                    var tid = logtext.match(/Torrent (\d+)/)[1];
                    logfont.html(logtext.replace(/(\((.+?])\))/, "<a href='/details.php?id=" + tid + "' style='color: " + logfont.attr('color') + " ' target='_blank'><u>$1</u></a>"));
                    logfont.parent().append("<a href='/edit.php?id=" + tid + "' style='display: inline-block;float: right;' target='_blank'>快速编辑</a>");
                }
                if (logtext.match(/批量/)) {      // 批量设置了种子优惠|批量置顶了种子|批量取消了置顶
                    logfont.html(logtext.replace(/(\d+),/g, "<a href='/details.php?id=$1' style='color: " + logfont.attr('color') + "' target='_blank'><u>$1</u></a>,"));
                    logfont.parent().append("<div class='foundbuff' style='display: inline-block;float: right;'>查询优惠类型</div>");
                }
                if (logtext.match(/Subtitle/)) {         // subtitle
                    logfont.html(logtext.replace(/\((.+?)\)/, "(<a href='/subtitles.php?search=$1' style='color: " + logfont.attr('color') + "' target='_blank'><u>$1</u></a>)"));
                }
                if (logtext.match(/首页置顶种子/)) {
                    logfont.html(logtext.replace(/] (\[.+?])成功/, "]&nbsp;<a href='/details.php?id=" + logtext.match(/id:(\d+)/)[1] + "' style='color: " + logfont.attr('color') + " ' target='_blank'><u>$1</u></a>成功"));
                }
            }
        });


        $("div.foundbuff").one("click", function () {      //查询种子优惠
            var foundbuff = $(this);
            var tid = foundbuff.siblings("font").text().match(/(\d+)/)[1];
            $.get('details.php?id=' + tid + '&hit=1', function (resp) {
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var buff = $(body).find("h1#share > b").text();
                foundbuff.text(buff);
            });
        });
        $("td#outer > table:last > tbody tr:first > td:nth-child(2)").append("<div class='foundbuff_all' style='display: inline-block;float: right;'>批量查询该页优惠类型</div>");
        $("div.foundbuff_all").click(function () {
            $("div.foundbuff").click();
        });
    }

    if (location.pathname === "/details.php") {
        $("td.no_border_wide:last").after("<td class=\"no_border_wide\"><b>种子日志：</b><a id='log' href='javascript:void(0)'>[查看日志]</a></td>")
            .parents("td").append("<span id='loglist'></span>");
        $("#log").click(function () {
            var logbtn = $(this);
            var loglist = $("#loglist");
            if (logbtn.text() === "[查看日志]") {
                if (loglist.html()) {
                    loglist.show();
                } else {
                    var tid = location.href.match(/id=(\d+)/)[1];
                    $.get('/log.php?query=' + tid + '&search=all&action=dailylog', function (resp) {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var table = $(body).find("#outer > table:last").removeAttr("width");
                        loglist.html(table);
                    });
                }
                logbtn.text("[隐藏日志]");
            } else {
                loglist.hide();
                logbtn.text("[查看日志]");
            }
        });
    }
});


/**
 * Created by Rhilip on 01/22/17.
 */
