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
// @grant       GM_setValue
// @updateURL   https://github.com/Rhilip/PT-help/raw/master/docs/js/Putao%20-%20Get%20Movie%20Info%20Directly.user.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}


$(document).ready(function () {
    // 构造本脚本和用户交互行
    $('form#compose > table > tbody > tr:eq(1)').after('<tr><td class="rowhead" valign="top" align="right">快速填写信息</td><td class="rowfollow" valign="top" align="left"><select name="type" id="gen_search_type"><option value="douban">豆瓣</option><option value="bangumi">Bangumi</option></select><input type="text" name="gen_url" id="gen_url" placeholder="相应网站上资源信息页的 URL 或 资源名称（搜索时请左侧正确选择搜索源）" style="width: 500px;"> <input type="button" id="gen_btn" value="搜索/导入">&nbsp;&nbsp;<span id="gen_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题部分信息及简介。目前仅建议电影 / 剧集 / 动漫区使用。<br><span id="gen_extra" style="display:none"></span></td></tr>');

    // 注册脚本添加的相关DOM
    var gen_info = $("#gen_info");
    var gen_extra = $("#gen_extra");

    var img_list = [];

    function getDoc(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (res) {
                // 页面解析
                var doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');
                var body = doc.querySelector("body");
                var page = $(body); // 构造 jQuery 对象
                callback(res, doc, body, page);    // 回调地狱~
            },
            onerror: function (res) {
                gen_info.text("向对应服务器请求数据失败，可能是你的网络问题吧2333");
            }
        });
    }

    function gen_descr_raw_to_editor(raw) {  // Putao 相关表单填入方法
        if (img_list) {
            var img_html = "<hr>你可能需要下载下列图片，并上传到本站。（注意，如果图片名中含有特殊字符串或较长，请修改图片文件名）<table id=\"gen_img_table\" style=\"table-layout:fixed ; width:100%\">";
            for (var i = 0; i < img_list.length; i++) {
                img_html += "<tr><td style='overflow:hidden; text-overflow:ellipsis;'><a href='" + img_list[i] + "' target='_blank'>" + img_list[i] + "</a></td></tr>";
            }
            img_html += "</table>";

            gen_extra.html(img_html).show();
        }

        $("textarea[name=descr]").val(raw);  // 填写简介
        $("input[name=douban_url]").val(raw.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/) ? raw.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/)[1] : "");
        $("input[name=url]").val(raw.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/) ? raw.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/)[1] : "");
        // $("input[name$=small_descr]").val(resj.title.replace(/ \/ /g, "\/"));  // 填写中文名到副标题中
        gen_info.text("已完成填写。");
    }

    $('#gen_btn').click(function () {

        img_list = [];
        var subject_url = $('#gen_url').val().trim();

        if (subject_url.match(/^http/)) {
            gen_info.text("识别输入内容为链接格式，请求源数据中....");

            // 以下内容请保持与Byrbt对应脚本一致
            if (subject_url.match(/movie\.douban\.com/)) {   // 豆瓣链接
                gen_info.text("你似乎输入的是豆瓣链接，尝试请求对应豆瓣页面....");
                // 以下豆瓣相关解析修改自 `https://greasyfork.org/zh-CN/scripts/38878-电影信息查询脚本` 对此表示感谢a
                var fetch = function (anchor) {
                    return anchor[0].nextSibling.nodeValue.trim();
                };
                getDoc(subject_url, function (res, doc, body, page) {
                    // 检查对应资源是否存在
                    if (/<title>页面不存在<\/title>/.test(res.responseText)) {
                        gen_info.text("该链接对应的资源似乎并不存在，你确认没填错");
                    } else {
                        gen_info.text("已成功获取源页面，开始解析");

                        var description_text = [];
                        var movie_id = res.finalUrl.match(/\/subject\/(\d+)/)[1];

                        var this_title, trans_title;
                        var chinese_title = doc.title.replace('(豆瓣)', '').trim();
                        var foreign_title = page.find('#content h1>span[property="v:itemreviewed"]').text().replace(chinese_title, '').trim();
                        var aka_anchor = page.find('#info span.pl:contains("又名")');
                        var aka;
                        if (aka_anchor[0]) {
                            aka = fetch(aka_anchor).split(' / ').sort(function (a, b) {//首字(母)排序
                                return a.localeCompare(b);
                            }).join('/');
                        }
                        if (foreign_title) {
                            trans_title = chinese_title + (aka ? ('/' + aka) : '');
                            this_title = foreign_title;
                        } else {
                            trans_title = aka ? aka : '';
                            this_title = chinese_title;
                        }
                        //年代
                        var year = page.find('#content>h1>span.year').text().slice(1, -1);
                        //产地
                        var regions_anchor = page.find('#info span.pl:contains("制片国家/地区")');
                        var region;
                        if (regions_anchor[0]) {
                            region = fetch(regions_anchor).split(' / ').join('/');
                        }
                        //类别
                        var genre = page.find('#info span[property="v:genre"]').map(function () {
                            return $(this).text().trim();
                        }).toArray().join('/');
                        //语言
                        var language_anchor = page.find('#info span.pl:contains("语言")');
                        var language;
                        if (language_anchor[0]) {
                            language = fetch(language_anchor).split(' / ').join('/');
                        }
                        //上映日期
                        var playdate = page.find('#info span[property="v:initialReleaseDate"]').map(function () {
                            return $(this).text().trim();
                        }).toArray().sort(function (a, b) {//按上映日期升序排列
                            return new Date(a) - new Date(b);
                        }).join('/');
                        //IMDb链接
                        var imdb_link_anchor = page.find('#info span.pl:contains("IMDb链接")');
                        var imdb_link;
                        if (imdb_link_anchor[0]) {
                            imdb_link = imdb_link_anchor.next().attr('href').replace(/(\/)?$/, '/');
                        }
                        //豆瓣链接
                        var douban_link = 'https://' + res.finalUrl.match(/movie.douban.com\/subject\/\d+\//);
                        //集数
                        var episodes_anchor = page.find('#info span.pl:contains("集数")');
                        var episodes;
                        if (episodes_anchor[0]) {
                            episodes = fetch(episodes_anchor);
                        }
                        //片长
                        var duration_anchor = page.find('#info span.pl:contains("单集片长")');
                        var duration;
                        if (duration_anchor[0]) {
                            duration = fetch(duration_anchor);
                        } else {
                            duration = page.find('#info span[property="v:runtime"]').text().trim();
                        }

                        var director, writer, cast;
                        var awards;
                        var douban_average_rating, douban_votes, douban_rating, introduction, poster;
                        var imdb_average_rating, imdb_votes, imdb_rating;
                        var tags;

                        gen_info.text("豆瓣主页面解析完成，开始请求补充信息");
                        var requests = [];

                        // 该影片的评奖信息
                        requests.push(
                            getDoc(douban_link + 'awards', function (res, doc, body, page) {
                                awards = page.find('#content>div>div.article').html()
                                    .replace(/[ \n]/g, '')
                                    .replace(/<\/li><li>/g, '</li> <li>')
                                    .replace(/<\/a><span/g, '</a> <span')
                                    .replace(/<(div|ul)[^>]*>/g, '\n')
                                    .replace(/<[^>]+>/g, '')
                                    .replace(/&nbsp;/g, ' ')
                                    .replace(/ +\n/g, '\n')
                                    .trim();
                            })
                        );

                        //豆瓣评分，简介，海报，导演，编剧，演员，标签
                        requests.push(
                            $.ajax({
                                type: 'get',
                                url: 'https://api.douban.com/v2/movie/' + movie_id,
                                dataType: 'jsonp',
                                jsonpCallback: 'callback',
                                success: function (json) {
                                    douban_average_rating = json.rating.average;
                                    douban_votes = json.rating.numRaters.toLocaleString();
                                    douban_rating = douban_average_rating + '/10 from ' + douban_votes + ' users';
                                    introduction = json.summary.replace(/^None$/g, '暂无相关剧情介绍');
                                    poster = json.image.replace(/s(_ratio_poster|pic)/g, 'l$1');
                                    director = json.attrs.director ? json.attrs.director.join(' / ') : '';
                                    writer = json.attrs.writer ? json.attrs.writer.join(' / ') : '';
                                    cast = json.attrs.cast ? json.attrs.cast.join('\n') : '';
                                    tags = json.tags.map(function (member) {
                                        return member.name;
                                    }).join(' | ');
                                }
                            }));

                        // IMDb信息
                        if (imdb_link) {
                            requests.push(
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: 'https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
                                    onload: function (res) {
                                        var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                        var a = JSON.parse(try_match[1]);
                                        imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                        imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                        imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                    }
                                })
                            );
                        }

                        var descriptionGenerator = function () {
                            if (poster) {
                                // description_text.push('[img]'+poster+'[/img]\n');
                                img_list.push(poster);
                            }
                            if (trans_title) {
                                description_text.push('◎译　　名　' + trans_title);
                            }
                            if (this_title) {
                                description_text.push('◎片　　名　' + this_title);
                            }
                            if (year) {
                                description_text.push('◎年　　代　' + year);
                            }
                            if (region) {
                                description_text.push('◎产　　地　' + region);
                            }
                            if (genre) {
                                description_text.push('◎类　　别　' + genre);
                            }
                            if (language) {
                                description_text.push('◎语　　言　' + language);
                            }
                            if (playdate) {
                                description_text.push('◎上映日期　' + playdate);
                            }
                            if (imdb_rating) {
                                description_text.push('◎IMDb评分  ' + imdb_rating);
                            }
                            if (imdb_link) {
                                description_text.push('◎IMDb链接  ' + imdb_link);
                            }
                            if (douban_rating) {
                                description_text.push('◎豆瓣评分　' + douban_rating);
                            }
                            if (douban_link) {
                                description_text.push('◎豆瓣链接　' + douban_link);
                            }
                            if (episodes) {
                                description_text.push('◎集　　数　' + episodes);
                            }
                            if (duration) {
                                description_text.push('◎片　　长　' + duration);
                            }
                            if (director) {
                                description_text.push('◎导　　演　' + director);
                            }
                            if (writer) {
                                description_text.push('◎编　　剧　' + writer);
                            }
                            if (cast) {
                                description_text.push('◎主　　演　' + cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim());
                            }
                            if (tags) {
                                description_text.push('\n◎标　　签　' + tags);
                            }
                            if (introduction) {
                                description_text.push('\n◎简　　介\n\n　　' + introduction.replace(/\n/g, '\n' + '　'.repeat(2)));
                            }
                            if (awards) {
                                description_text.push('\n◎获奖情况\n\n　　' + awards.replace(/\n/g, '\n' + '　'.repeat(2)));
                            }

                            gen_descr_raw_to_editor(description_text.join('\n'));
                        };
                        $.when.apply($, requests).then(function () {   // 等待
                            descriptionGenerator();
                        });
                    }
                });
            }
            else if (subject_url.match(/(bgm\.tv|bangumi\.tv|chii\.in)\/subject/)) {
                gen_info.text("你似乎输入的是Bgm链接，尝试请求对应Bgm页面....");

                // 以下Bgm相关解析修改自 `https://github.com/Rhilip/PT-help/blob/master/docs/js/Bangumi%20-%20Info%20Export.user.js` 对此表示感谢a
                const STAFFSTART = 4;                 // 读取Staff栏的起始位置（假定bgm的顺序为中文名、话数、放送开始、放送星期... ，staff从第四个 导演 起算）；初始值为 4（对于新番比较合适）
                const STAFFNUMBER = 9;                // 读取Staff栏数目；初始9，可加大，溢出时按最大可能的staff数读取，如需读取全部请设置值为 Number.MAX_VALUE (或一个你觉得可能最大的值 eg.20)

                getDoc(subject_url, function (res, doc, body, page) {
                    var img = page.find("div#bangumiInfo > div > div:nth-child(1) > a > img").attr("src").replace(/cover\/[lcmsg]/, "cover/l");
                    img_list.push(img);

                    // 使用GM_getValue,GM_setValue 传递的表单信息
                    GM_setValue("comic_cname", page.find("#infobox > li:contains('中文名')").text().replace("中文名: ", "").trim());

                    var on_air_date = page.find("#infobox > li:contains('放送开始')").text().replace("放送开始: ", "");
                    try {  // 尝试将日期转成 yyyy.mm 格式
                        on_air_date = on_air_date.toDateEx().format("yyyy.MM")
                    } catch (error) {
                        console.log(error);
                    } finally {
                        GM_setValue("comic_year", on_air_date);
                    }

                    // 主介绍
                    var story = page.find("div#subject_summary").text();             //Story
                    var raw_staff = [], staff_box = page.find("ul#infobox");        //Staff
                    for (var staff_number = STAFFSTART; staff_number < Math.min(STAFFNUMBER + STAFFSTART, staff_box.children("li").length); staff_number++) {
                        raw_staff[staff_number - STAFFSTART] = staff_box.children("li").eq(staff_number).text();
                        //console.log(raw_staff[staff_number]);
                    }
                    var raw_cast = [], cast_box = page.find("ul#browserItemList");      //Cast
                    for (var cast_number = 0; cast_number < cast_box.children("li").length; cast_number++) {    //cast_box.children("li").length
                        var cast_name = cast_box.children("li").eq(cast_number).find("span.tip").text();
                        if (!(cast_name.length)) {     //如果不存在中文名，则用cv日文名代替
                            cast_name = cast_box.children("li").eq(cast_number).find("div > strong > a").text().replace(/(^\s*)|(\s*$)/g, "");   //#browserItemList > li > div > strong > a
                        }
                        var cv_name = cast_box.children("li").eq(cast_number).find("span.tip_j > a").text();
                        raw_cast[cast_number] = cast_name + ' : ' + cv_name;
                        //console.log(raw_cast[cast_number]);
                    }

                    var outtext = "\n\n" + // img + "\n\n" +
                        "[b]STORY : [/b]\n" + story + "\n\n" +
                        "[b]STAFF : [/b]\n" + raw_staff.join("\n") + "\n\n" +
                        "[b]CAST : [/b]\n" + raw_cast.join("\n") + "\n\n" +
                        "(来源于 " + res.finalUrl + " )\n";

                    gen_descr_raw_to_editor(outtext);
                })
            }
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
                                var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"gen_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
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
                                var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"gen_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>放送开始</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>名称</td><td class=\"colhead\" align='center'>Bangumi链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
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
