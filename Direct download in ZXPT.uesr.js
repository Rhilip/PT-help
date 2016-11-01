// ==UserScript==
// @name         Direct download in ZXPT
// @namespace    http://blog.rhilip.info
// @version      0.1
// @description  It's an userscript which helped people in ZXPT download directly in torrent list page
// @author       Rhilip
// @match        http*://pt.zhixing.bjtu.edu.cn/*
// @icon         http://pt.zhixing.bjtu.edu.cn/favicon.ico
// @grant        none
// ==/UserScript==

//Control Options
var loc =1; //0放置在左边 1修改原来的感谢为下载按钮

$(document).ready(function(){
    var table = $("#mainContent > table > tbody");
    table.find("tr[id^=t]").each(function () {
        var tr = $(this);
        var trid = tr.find('td.l > a').attr("href").match(/\/torrents\/(\d+)\//)[1];
        var dlink = "/torrents/" + trid + "/download/";
        if(loc){
            tr.find("td:nth-child(3) > div").children().eq(0).after('<a href="'+ dlink +'" class="button thumbs-up">下载</a>');
            var thx = tr.find("td:nth-child(3) > div > a:nth-child(1)").addClass("fav_link").removeClass("button thumbs-up");
            tr.find("td:nth-child(3) > div > ul").children().eq(0).before("<li></li>");
            tr.find("td:nth-child(3) > div > ul > li").eq(0).append(thx);
        }else{
            tr.find("td.l").children().eq(0).prepend('<a href="'+ dlink +'" class="button button-blue" onclick="return alert_price(0)">▼ 下载种子</a>');
        }
    });
});

/**
 * Created by Rhilip on 2016/10/30.
 */
