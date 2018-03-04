// ==UserScript==
// @name        Putao : Get Movie Info Directly
// @namespace   http://blog.rhilip.info
// @version     20180304
// @author      Rhilip
// @description 从其他信息站点（Douban、Bangumi）获取种子简介信息
// @include     https://pt.sjtu.edu.cn/upload.php
// @icon        https://pt.sjtu.edu.cn/favicon.ico
// @run-at      document-end
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @updateURL   https://github.com/Rhilip/PT-help/raw/master/docs/js/Putao%20-%20Get%20Movie%20Info%20Directly.user.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}


$(document).ready(function () {
    // 构造本脚本和用户交互行
    $('#compose').find('> table > tbody > tr:eq(1)').after('<tr><td class="rowhead" valign="top" align="right">快速填写信息</td><td class="rowfollow" valign="top" align="left"><select name="type" id="gen_search_type"><option value="douban">豆瓣</option><option value="bangumi">Bangumi</option></select><input type="text" name="gen_url" id="gen_url" placeholder="相应网站上资源信息页的 URL 或 资源名称（搜索时请左侧正确选择搜索源）" style="width: 500px;"> <input type="button" id="gen_btn" value="搜索/导入">&nbsp;&nbsp;<span id="gen_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题部分信息及简介。目前仅建议电影 / 剧集 / 动漫区使用。<br><span id="gen_extra" style="display:none"></span></td></tr>');

    var gen_info = $("#gen_info");

    $('#gen_btn').click(function () {
        var subject_url = $('#gen_url').val().trim();

        if (subject_url.match(/^http/)) {
            gen_info.text("识别输入内容为链接格式，请求源数据中....");
            var myData = new FormData();
            myData.append("url", subject_url);
            GM_xmlhttpRequest({
                method: "POST",
                data: myData,
                url: "https://api.rhilip.info/tool/movieinfo/gen", // 通过接口调用
                onload: function (res) {
                    if (res.status >= 200 && res.status < 400) {
                        gen_info.text("请求成功，填写数据.....");
                        var resj = JSON.parse(res.responseText);  // 解析成Json格式
                        console.log(resj);
                        if (resj.success) {
                            $("input[name$=small_descr]").val(resj.title.replace(/ \/ /g, "\/"));  // 填写中文名到副标题中
                            $("input[name=url]").val(resj.imdb_link);
                            $("input[name=douban_url]").val(resj.douban_link);
                            $("textarea[name=descr]").val("\n\n" + resj.format);  // 前空两行

                            // 添加图片信息
                            if (resj.img) {
                                var img_html = "<hr>你可能需要使用下列图片<table id=\"gen_img_table\">";
                                for (var i = 0; i < resj.img.length; i++) {
                                    img_html += "<tr><td><a href='" + resj.img[i] + "' target='_blank'>" + resj.img[i] + "</a></td></tr>";
                                }
                                img_html += "</table>";

                                $("#gen_extra").html(img_html).show();
                            }

                            // GM_setClipboard(raw);
                            gen_info.text("已完成填写。");
                        } else {
                            gen_info.text("不知道为什么失败了，原因为：" + resj.error);
                        }
                    } else {
                        gen_info.text("不知道为什么失败了，原因为：" + res.status);
                    }
                },
                onerror: function () {
                    gen_info.text("不知道为什么就是失败了嘛23333");
                }
            });
        } else {
            gen_info.text("识别输入内容为文字格式，尝试搜索");

            var search_from = $("#gen_search_type").val(); // 408,电影 ; 401,剧集 ; 404, 动漫
            if (search_from === "douban") {    // 电影区，剧集区
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.douban.com/v2/movie/search?q=" + subject_url, // 通过接口调用
                    onload: function (res) {
                        if (res.status >= 200 && res.status < 400) {
                            gen_info.text("请求成功，请在下方选择对应链接。");
                            var resj = JSON.parse(res.responseText);  // 解析成Json格式
                            if (resj.total !== 0) {
                                var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"ben_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                                for (var i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                                    var i_item = resj.subjects[i_douban];
                                    search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year + "</td><td class='rowfollow' align='center'>" + i_item.subtype + "</td><td class='rowfollow'>" + i_item.title + "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.alt + "'>选择</a></td></tr>";
                                }
                                search_html += "</table>";
                                $("#gen_extra").html(search_html).show();

                                $("a.gen_search_choose").click(function () {
                                    var tag = $(this);
                                    $('#gen_url').val(tag.attr("data-url"));
                                    $('#gen_btn').click();
                                });
                            } else {
                                gen_info.text("无搜索结果");
                            }
                        } else {
                            gen_info.text("不知道为什么失败了，原因为：" + res.status);
                        }
                    },
                    onerror: function () {
                        gen_info.text("向豆瓣API请求数据失败，可能是你的网络问题吧2333");
                    }
                });
            } else if (search_from === "bangumi") {   // 动漫区
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.bgm.tv/search/subject/" + subject_url + "?responseGroup=large&max_results=20&start=0", // 通过接口调用
                    onload: function (res) {
                        if (res.status >= 200 && res.status < 400) {
                            gen_info.text("请求成功，请在下方选择对应链接。");
                            var resj = JSON.parse(res.responseText);  // 解析成Json格式
                            if (resj.results !== 0) {
                                var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"ben_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>放送开始</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>名称</td><td class=\"colhead\" align='center'>Bangumi链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                                for (var i_bgm = 0; i_bgm < resj.list.length; i_bgm++) {
                                    var i_item = resj.list[i_bgm];
                                    var tp = i_item.type;
                                    if (tp === 1) tp = "漫画/小说";
                                    else if (tp === 2) tp = "动画/二次元番";
                                    else if (tp === 3) tp = "音乐";
                                    else if (tp === 4) tp = "游戏";
                                    else if (tp === 6) tp = "三次元番";

                                    search_html += "<tr><td class='rowfollow' align='center'>" + i_item.air_date + "</td><td class='rowfollow' align='center'>" + tp + "</td><td class='rowfollow'>" + i_item.name_cn + " | " + i_item.name + "</td><td class='rowfollow'><a href='" + i_item.url + "' target='_blank'>" + i_item.url + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.url + "'>选择</a></td></tr>";
                                }
                                search_html += "</table>";
                                $("#gen_extra").html(search_html).show();

                                $("a.gen_search_choose").click(function () {
                                    var tag = $(this);
                                    $('#gen_url').val(tag.attr("data-url"));
                                    $('#gen_btn').click();
                                });
                            } else {
                                gen_info.text("无搜索结果");
                            }
                        }
                    },
                    onerror: function () {
                        gen_info.text("向Bangumi请求数据失败，可能是你的网络问题吧2333");
                    }
                });
            }
        }
    });
});


/**
 * Created by Rhilip on 10/14/2017.
 * 20171014: 在某人的收买下，从 Byrbt - Get Movie Info Directly.user.js 适配修改。
 */
