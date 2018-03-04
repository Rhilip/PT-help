// ==UserScript==
// @name         ZXPT - Direct download in Homepage
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  It's an userscript which helped people in ZXPT download directly in torrent list page
// @author       Rhilip
// @match        http*://pt.zhixing.bjtu.edu.cn/*
// @icon         http://pt.zhixing.bjtu.edu.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/ZXPT%20-%20Direct%20download%20in%20Homepage.user.js
// ==/UserScript==

$(document).ready(function () {
    var table = $("div#mainContent > table > tbody");
    table.find("tr[id^=t]").each(function () {
        var tr = $(this);
        var trid = tr.find('td.l > a').attr("href").match(/\/torrents\/(\d+)\//)[1];             //获取种子编号
        var dlink = "/torrents/" + trid + "/download/";              //构造下载链接
        tr.find("td:nth-child(3) > div").children().eq(0).after('<a href="' + dlink + '" class="button thumbs-up">下载</a>');    //添加下载按钮
        //移动原来的感谢按钮到下拉栏
        var thx = tr.find("td:nth-child(3) > div > a:nth-child(1)").addClass("fav_link").removeClass("button thumbs-up");
        tr.find("td:nth-child(3) > div > ul").children().eq(0).before("<li></li>");
        tr.find("td:nth-child(3) > div > ul > li").eq(0).append(thx);
    });
});

/**
 * Created by Rhilip on 2016/10/30.
 * Update v0.2 :1.Remove function "download button in left side"
 *              2.Add some Notes
 */
