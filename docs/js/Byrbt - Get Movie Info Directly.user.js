// ==UserScript==
// @name        Byrbt : Get Movie Info Directly
// @namespace   http://blog.rhilip.info
// @version     20180304.1
// @description 从其他信息站点（Douban、Bangumi）获取种子简介信息，并辅助表单信息填写与美化
// @author      Rhilip
// @include     /^https?:\/\/(bt\.byr\.cn|byr\.rhilip\.info)\/upload\.php\?type=40(8|1|4)/
// @icon        http://bt.byr.cn/favicon.ico
// @run-at      document-end
// @connect     *
// @grant       GM_xmlhttpRequest
// @updateURL   https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Get%20Movie%20Info%20Directly.user.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

var cat = parseInt(location.href.match(/(\d+)$/)[1]); // 408,电影 ; 401,剧集 ; 404, 动漫

function limit_item(raw_str, limit) {
    limit = limit || 3;
    var _str = raw_str.replace(/ \/ /g, "/");  // 统一
    return _str.split("/").slice(0, limit).join("/");  // 分割，切片，组合
}

CKEDITOR.on('instanceReady', function (evt) {
    // 构造本脚本和用户交互行
    $('#compose').find('> table > tbody > tr:eq(2)').after('<tr id="ben_help"><td class="rowhead nowrap">快速填写信息</td><td class="rowfollow" valign="top" align="left"><input type="text" id="ben_url" placeholder="相应网站上资源信息页的 URL 或资源名称" size="80" class="clone_skip"> <input type="button" id="ben_btn" value="搜索/导入">&nbsp;<input type="button" id="ben_format" value="简介美化/辅助填写">&nbsp;&nbsp;<span id="ben_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题tag信息（在正确类型下）及简介。目前仅支持电影 / 剧集 / 动漫区。（如有问题，请带上链接和错误信息及时<a href="https://bt.byr.cn/sendmessage.php?receiver=222616" target="_blank"><img class="button_pm" src="data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="></a>）<br><span id="ben_extra"><hr><span>你也可以手动从简介生成工具（如： <a href=\'http://movieinfogen.sinaapp.com/\' target=\'_blank\'>http://movieinfogen.sinaapp.com/ (需要豆瓣账号)</a>， <a href=\'http://huancun.org/\' target=\'_blank\'>http://huancun.org/</a> ）获取数据并填入，然后点击`简介美化`。</span></span></td></tr>');

    // 注册脚本添加的相关DOM
    var ben_info = $("#ben_info");
    var ben_extra = $("#ben_extra");

    var img_list = [];

    function gen_input_help() {   // 表单辅助填写
        var descr = CKEDITOR.instances.descr.getData();
        // 电影区相关
        if (descr.match(/译　　名　(.+?)</)) {  // 填写中文名
            $("input[name$=cname]").val(limit_item(descr.match(/译　　名　(.+?)</)[1]));
        }
        if (descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/)) {  // 豆瓣链接
            $("input[name=dburl]").val(descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/)[1]);
        }
        if (descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/?)/)) {  // IMDb链接
            $("input[name=url]").val(descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/)[1]);
        }
        if (descr.match(/类　　别　(.+?)</)) {  // 电影类别
            $("#movie_type").val(limit_item(descr.match(/类　　别　(.+?)</)[1]));
        }
        if (descr.match(/产　　地　(.+?)</)) {  // 制片国家/地区
            $("#movie_country").val(limit_item(descr.match(/产　　地　(.+?)</)[1]));
        }
    }

    function gen_descr_raw_to_ckeditor(raw) {
        // 添加图片信息
        if (img_list) {
            var img_html = "<hr>你可能需要下载下列图片，并上传到本站。（注意，如果图片名中含有特殊字符串或较长，请修改图片文件名）<table id=\"ben_img_table\" style=\"table-layout:fixed ; width:100%\">";
            for (var i = 0; i < img_list.length; i++) {
                img_html += "<tr><td style='overflow:hidden; text-overflow:ellipsis;'><a href='" + img_list[i] + "' target='_blank'>" + img_list[i] + "</a></td></tr>";
            }
            img_html += "</table>";

            ben_extra.html(img_html).show();
        }

        var descr = raw.replace(/\n/g, "<br />");  // 将原始字符串（为BBCode格式）中的`\n` 替换为 `<br>`
        CKEDITOR.instances.descr.setData(descr);  // 填入原始简介
        $("#ben_format").click();   // 模拟点击，美化简介及辅助填写表单
        ben_info.text("已完成填写。");
    }

    function gen_descr_format() {   // 简介美化
        var descr = CKEDITOR.instances.descr.getData();

        if (!descr.match("byrbt_info_gen")) {   // 如果没有发现`Gen`信息
            switch (cat) {
                case 401:   // 剧集区
                // 暂无QAQ （所以先用电影区的~）
                case 408:   // 电影区
                    descr = '<br />\n' +
                        '<fieldset style="font-family: Consolas;">\n' +
                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;海报&nbsp;</span></legend>请在此处<span style="color:#ff0000;">上传图片</span>。</fieldset>\n' +
                        '<br />\n' +
                        '<fieldset style="font-family: Consolas;">\n' +
                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;简介&nbsp;</span></legend>' + ( descr || "请在此处<span style=\"color:#ff0000;\">填写简介</span>。" ) + '</fieldset>\n' +
                        '<br />\n' +
                        '<fieldset style="font-family: Consolas;">\n' +
                        '\t<legend><span style="color:#ffffff;background-color:#000000;">&nbsp;iNFO&nbsp;</span></legend>请在此处<span style="color:#ff0000;">替换为资源的Mediainfo信息</span>。  </fieldset>\n' +
                        '<br />\n';
                    break;
                case 404:   // 动漫区
                    if (descr) {
                        descr = descr.replace(/\[b](.+?)\[\/b]/g, "<span style=\"color: #008080;font-family: Impact,serif;font-size: large;\"> $1 </span><br>");
                    } else {  // TODO 似乎没有用.......
                        descr = '<br />\n' +
                            "<span style=\"color: #008080;font-family: Impact,serif;font-size: large;\">STORY : </span><br>" +
                            '<div id="descr_story"><br /><br /><br /><br /></div><br />\n' +
                            "<span style=\"color: #008080;font-family: Impact,serif;font-size: large;\">STAFF : </span><br>" +
                            '<div id="descr_staff"><br /><br /><br /><br /></div><br />\n' +
                            "<span style=\"color: #008080;font-family: Impact,serif;font-size: large;\">CAST : </span><br>" +
                            '<div id="descr_cast"><br /><br /><br /><br /></div><br />\n';
                    }
                    break;
            }

            // 对简介中出现的图片字符串进行标红处理
            descr = descr.replace(/(http.+?\.jpg)/, "<span style=\"color:#ff0000;\">$1</span>");

            // 添加`Gen`信息，以防止二次格式化
            descr += '<div class=\"byrbt_info_gen\" data-version=\"' + script_version + '\" style=\"display:none\">Info Format Powered By @Rhilip</div>';

            CKEDITOR.instances.descr.setData(descr);
            ben_info.text("简介美化完成。");
        } else {
            ben_info.text("简介已被美化，请勿再次美化。");
        }
    }

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
                ben_info.text("向对应服务器请求数据失败，可能是你的网络问题吧2333");
            }
        });
    }

    function getJSON(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (res) {
                if (res.status >= 200 && res.status < 400) {
                    var resj = JSON.parse(res.responseText);  // 解析成Json格式
                    callback(res, resj);
                }
            },
            onerror: function (res) {
                ben_info.text("向对应API服务器请求数据失败，可能是你的网络问题吧2333");
            }
        });
    }

    $("#ben_format").click(function () {
        gen_descr_format();  // 格式化
        gen_input_help();    // 辅助填写表单
    });

    $('#ben_btn').click(function () {

        img_list = [];
        var subject_url = $('#ben_url').val().trim();

        if (/^http/.test(subject_url)) {
            ben_info.text("识别输入内容为链接格式，开始请求源数据....");

            if (subject_url.match(/movie\.douban\.com/)) {   // 豆瓣链接
                // 以下豆瓣相关解析修改自 `https://greasyfork.org/zh-CN/scripts/38878-电影信息查询脚本` 对此表示感谢
                ben_info.text("你似乎输入的是豆瓣链接，尝试请求对应豆瓣页面....");

                var fetch = function (anchor) {
                    return anchor[0].nextSibling.nodeValue.trim();
                };
                getDoc(subject_url, function (res, doc, body, page) {
                    // 检查对应资源是否存在
                    if (/<title>页面不存在<\/title>/.test(res.responseText)) {
                        ben_info.text("该链接对应的资源似乎并不存在，你确认没填错");
                    } else {
                        ben_info.text("已成功获取源页面，开始解析");

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

                        ben_info.text("豆瓣主页面解析完成，开始请求补充信息");
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
                            var imdb_url = 'https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json';
                            requests.push(
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: imdb_url,
                                    onload: function (res) {
                                        var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                        if (try_match) {
                                            var a = JSON.parse(try_match[1]);
                                            imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                            imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                            imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                        }
                                    },
                                    onerror: function (res) {
                                        switch (res.status) {
                                            case 404:
                                                console.log('IMDb链接不存在！');
                                                imdb_link = '';
                                                break;
                                            default:
                                                console.log('无法获取IMDb评分！');
                                                break;
                                        }
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

                            gen_descr_raw_to_ckeditor(description_text.join('\n'));
                        };
                        $.when.apply($, requests).then(function () {   // 等待
                            descriptionGenerator();
                        });
                    }
                });
            }
            else if (subject_url.match(/(bgm\.tv|bangumi\.tv|chii\.in)\/subject/)) {
                // TODO From `Bangumi Info Export`
            }
        } else {
            ben_info.text("识别输入内容为文字格式，尝试搜索");

            if ([408, 401].indexOf(cat) > -1) {    // 电影区，剧集区
                getJSON("https://api.douban.com/v2/movie/search?q=" + subject_url, function (res, resj) {
                    ben_info.text("请求成功，请在下方选择对应链接。");
                    if (resj.total !== 0) {
                        var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"ben_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                        for (var i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                            var i_item = resj.subjects[i_douban];
                            search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year + "</td><td class='rowfollow' align='center'>" + i_item.subtype + "</td><td class='rowfollow'>" + i_item.title + "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.alt + "'>选择</a></td></tr>";
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
                });
            } else if (cat === 404) {   // 动漫区
                getJSON("https://api.bgm.tv/search/subject/" + subject_url + "?responseGroup=large&max_results=20&start=0", function (res, resj) {
                    if (resj.results !== 0) {
                        var search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"ben_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>放送开始</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>名称</td><td class=\"colhead\" align='center'>Bangumi链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                        for (var i_bgm = 0; i_bgm < resj.list.length; i_bgm++) {
                            var i_item = resj.list[i_bgm];
                            var tp = i_item.type;
                            switch (tp) {
                                case 1:
                                    tp = "漫画/小说";
                                    break;
                                case 2:
                                    tp = "动画/二次元番";
                                    break;
                                case 3:
                                    tp = "音乐";
                                    break;
                                case 4:
                                    tp = "游戏";
                                    break;
                                case 6:
                                    tp = "三次元番";
                                    break;
                            }

                            search_html += "<tr><td class='rowfollow' align='center'>" + i_item.air_date + "</td><td class='rowfollow' align='center'>" + tp + "</td><td class='rowfollow'>" + i_item.name_cn + " | " + i_item.name + "</td><td class='rowfollow'><a href='" + i_item.url + "' target='_blank'>" + i_item.url + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.url + "'>选择</a></td></tr>";
                        }
                        search_html += "</table>";
                        ben_extra.html(search_html).show();

                        $("a.gen_search_choose").click(function () {
                            var tag = $(this);
                            $('#ben_url').val(tag.attr("data-url"));
                            $('#ben_btn').click();
                        });
                    } else {
                        ben_info.text("无搜索结果");
                    }
                });
            }
        }
    });
});


/**
 * Created by Rhilip on 10/12/2017.
 * 20180303: 根据 `https://greasyfork.org/zh-CN/scripts/38878-电影信息查询脚本` 脚本重写。
 * 20171031：修改网址输入框的class，防止与魂酱的自引用脚本冲突。
 * 20171027: 大幅度修改脚本，允许直接使用其他简介生成工具提供的简介，并美化及辅助填写。
 * 20171021: 增加在后端API未返回正确信息({"status": false})的情况下，提示使用另外的简介生成工具。并对于电影版提供简介美化及一键填写功能。
 * 20171014: 改用自己API来进行导入。增加搜索方法。
 * 20171012: Test Version~ , Thanks those Userscript:
 *           1. Bangumi - Info Export.user.js: https://github.com/Rhilip/My-Userscript/blob/master/Bangumi%20-%20Info%20Export.user.js
 *           2. 豆瓣评分pt字幕: https://github.com/Exhen/douban/blob/master/20171012.js
 *           3. QptUserScript Transmit: https://github.com/zunsthy/QingyingptUserScript/blob/master/QptUserScript_Transmit.user.js
 */
