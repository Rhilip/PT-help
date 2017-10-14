// ==UserScript==
// @name        BYRBT : Get Movie Info Directly
// @author      Rhilip
// @description 从其他信息站点（Douban、Bangumi）获取种子简介信息
// @include      /^https?:\/\/bt\.byr\.cn\/upload\.php\?type=40(8|1|4)/
// @icon        http://bt.byr.cn/favicon.ico
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @version     20171014
// ==/UserScript==

$(document).ready(function() {
    // 构造本脚本和用户交互行
    $('#compose').find('> table > tbody > tr:eq(2)').after('<tr id="ben_help"><td class="rowhead nowrap">快速填写信息</td><td class="rowfollow" valign="top" align="left"><input type="text" id="ben_url" placeholder="相应网站上资源信息页的 URL" size="80"> 简介美化：<input type="checkbox" id="ben_format"> <input type="button" id="ben_btn" value="搜索/导入">&nbsp;&nbsp;<span id="ben_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题tag信息（在正确类型下）及简介。目前仅支持电影 / 剧集 / 动漫区。<br><span id="ben_extra" style="display:none"></span></td></tr>');

    var ben_info = $("#ben_info");
    var ben_format_btn  = $("#ben_format");

    $('#ben_btn').click(function () {
        var subject_url = $('#ben_url').val().trim();

        var cat = location.href.match(/(\d+)$/)[1]; // 408,电影 ; 401,剧集 ; 404, 动漫

        if (subject_url.match(/^http/)) {
            ben_info.text("识别输入内容为链接格式，请求源数据中....");

            var myData = new FormData();
            myData.append("url", subject_url);
            GM_xmlhttpRequest({
                method: "POST",
                data: myData,
                url: "https://api.rhilip.info/tool/movieinfo/gen", // 通过接口调用
                onload: function (res) {
                    if (res.status >= 200 && res.status < 400) {
                        ben_info.text("请求成功，填写数据.....");
                        var resj = JSON.parse(res.responseText);  // 解析成Json格式
                        if (resj.success) {
                            var raw = resj.format;
                            raw = raw.replace(/\n/g, "<br />");   // 将原始字符串（为BBCode格式）中的`\n` 替换为 `<br>`
                            var descr = raw;

                            $("input[name$=cname]").val(resj.title.replace(/ \/ /g, "\/"));  // 填写中文名
                            $("input[name=url]").val(resj.imdb_url);
                            $("input[name=dburl]").val(resj.douban_url);
                            if (cat === "408"){   // 电影区
                                // 填写标题项
                                $("#movie_type").val(resj.genres.replace(/ /g, ""));

                                // 剧集区格式化选项
                                if (ben_format_btn.prop('checked')) {
                                    descr = '<br />\n' +
                                        '<fieldset style="font-family: Consolas;">\n' +
                                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;海报&nbsp;</span></legend><span style="color:#ff0000;">请在此处上传图片。</span></fieldset>\n' +
                                        '<br />\n' +
                                        '<fieldset style="font-family: Consolas;">\n' +
                                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;简介&nbsp;</span></legend>' + descr + '</fieldset>\n' +
                                        '<br />\n' +
                                        '<fieldset style="font-family: Consolas;">\n' +
                                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;iNFO&nbsp;</span></legend><span style="color:#ff0000;">请在此处替换为电影的Mediainfo信息</span></fieldset>\n' +
                                        '<br />\n';
                                }
                            } else if (cat === "401") {  // 剧集区
                                // 暂无QAQ
                            } else if (cat === "404") {  // 动漫区
                                // 填写标题项
                                $("input[name=comic_year]").val(resj.air_date);

                                // 动漫区格式化
                                if (ben_format_btn.prop('checked')) {
                                    descr = descr.replace(/\[b](.+?)\[\/b]/g,"<span style=\"color: #008080;font-family: Impact,serif;font-size: large;\"> $1 </span><br>");
                                }
                            }

                            // 对简介中出现的图片字符串进行标红处理
                            descr = descr.replace(/^(http.+?\.jpg)/,"<span style=\"color:#ff0000;\">$1</span>");

                            // 添加图片信息
                            if (resj.img) {
                                var img_html  = "<hr>你可能需要下载下列图片，并上传到本站。（注意，如果图片名中含有特殊字符串或较长，请修改图片文件名）<table id=\"ben_img_table\">";
                                for (var i=0;i<resj.img.length;i++) {
                                    img_html += "<tr><td><a href='" + resj.img[i] +"' target='_blank'>" + resj.img[i] + "</a></td></tr>";
                                }
                                img_html += "</table>";

                                $("#ben_extra").html(img_html).show();
                            }

                            CKEDITOR.instances.descr.setData(descr);
                            // GM_setClipboard(raw);
                            ben_info.text("已完成填写，你也可以使用`Ctrl + V`粘贴简介部分内容原始源码。");
                        } else {
                            ben_info.text("不知道为什么失败了，原因为：" + resj.error);
                        }
                    } else {
                        ben_info.text("不知道为什么失败了，原因为：" + res.status);
                    }
                },

                onerror: function () {
                    ben_info.text("不知道为什么就是失败了嘛23333");
                }
            });
        } else {
            ben_info.text("识别输入内容为文字格式，尝试搜索");

            if ($.inArray(cat, ['408', '401']) !== -1){    // 电影区，剧集区
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.douban.com/v2/movie/search?q=" + subject_url, // 通过接口调用
                    onload: function (res) {
                        if (res.status >= 200 && res.status < 400) {
                            ben_info.text("请求成功，请在下方选择对应链接。");
                            var resj = JSON.parse(res.responseText);  // 解析成Json格式
                            if (resj.total !== 0) {
                                var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"ben_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                                for(var i_douban = 0;i_douban < resj.subjects.length ; i_douban ++) {
                                    var i_item = resj.subjects[i_douban];
                                    search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year+ "</td><td class='rowfollow' align='center'>" + i_item.subtype+ "</td><td class='rowfollow'>" + i_item.title+ "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt+ "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.alt +"'>选择</a></td></tr>";
                                }
                                search_html += "</table>";
                                $("#ben_extra").html(search_html).show();

                                $("a.gen_search_choose").click(function () {
                                    var tag = $(this);
                                    $('#ben_url').val(tag.attr("data-url"));
                                    $('#ben_btn').click();
                                });
                            } else {
                                ben_info.text("无搜索结果");
                            }
                        }
                    }
                });
            } else if (cat === "404") {   // 动漫区

            }
        }
    });
});


/**
 * Created by Rhilip on 10/12/2017.
 * 20171014: 改用自己API来进行导入。
 * 20171012: Test Version~ , Thanks those Userscript:
 *           1. Bangumi - Info Export.user.js: https://github.com/Rhilip/My-Userscript/blob/master/Bangumi%20-%20Info%20Export.user.js
 *           2. 豆瓣评分pt字幕: https://github.com/Exhen/douban/blob/master/20171012.js
 *           3. QptUserScript Transmit: https://github.com/zunsthy/QingyingptUserScript/blob/master/QptUserScript_Transmit.user.js
 */
