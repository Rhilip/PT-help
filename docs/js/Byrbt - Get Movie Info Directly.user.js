// ==UserScript==
// @name        Byrbt : Get Movie Info Directly
// @namespace   http://blog.rhilip.info
// @version     20180307
// @description 从其他信息站点（Douban、Bangumi）获取种子简介信息，并辅助表单信息填写与美化
// @author      Rhilip
// @include     /^https?:\/\/(bt\.byr\.cn|byr\.rhilip\.info)\/upload\.php\?type=40(8|1|4)/
// @icon        http://bt.byr.cn/favicon.ico
// @run-at      document-end
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @updateURL   https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Get%20Movie%20Info%20Directly.user.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};
String.prototype.toDateEx = function () {
    var data = {y: 0, M: 0, d: 0, h: 0, m: 0, s: 0, ms: 0};
    var cn = {"年": "y", "月": "M", "日": "d", "时": "h", "分": "m", "秒": "s", "毫秒": "ms"}; //中文单位与英文单位对应
    var result = this.match(/\d+((ms)|[yMdhms年月日时分秒]|(毫秒))/ig); //第一步，取出数字与单位，如10月,2009年
    for (var i = 0; i < result.length; i++) {  //第二步，循环取出数字，再根据单位把数据赋值到data中
        RegExp(/(\d+)([yMdhms年月日时分秒]|(毫秒))/).test(result[i]);
        //例：2009年这个时间中，RegExp.$2应该是年，而data[年]是取不到合法的值的，
        //所以值为undefined，这样我们就可以判断是中文的值
        if (data[RegExp.$2] === undefined) {
            data[cn[RegExp.$2]] = RegExp.$1;
        } else {
            data[RegExp.$2] = RegExp.$1;
        }
    }
    return new Date(data.y, data.M - 1, data.d, data.h, data.m, data.s, data.ms);
};

var cat = parseInt(location.href.match(/(\d+)$/)[1]); // 408,电影 ; 401,剧集 ; 404, 动漫

function limit_item(raw_str, limit) {
    limit = limit || 3;
    var _str = raw_str.replace(/ \/ /g, "/");  // 统一
    return _str.split("/").slice(0, limit).join("/");  // 分割，切片，组合
}

CKEDITOR.on('instanceReady', function (evt) {
    // 构造本脚本和用户交互行
    $('form#compose > table > tbody > tr:eq(2)').after('<tr id="gen_help"><td class="rowhead nowrap">快速填写信息</td><td class="rowfollow" valign="top" align="left"><input type="text" id="gen_url" placeholder="相应网站上资源信息页的 URL 或资源名称" size="80" class="clone_skip"> <input type="button" id="gen_btn" value="搜索/导入">&nbsp;<input type="button" id="gen_format" value="简介美化/辅助填写">&nbsp;&nbsp;<span id="gen_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题tag信息（在正确类型下）及简介。目前仅支持电影 / 剧集 / 动漫区。<br><span id="gen_extra"></span></td></tr>');

    // 注册脚本添加的相关DOM
    var gen_info = $("#gen_info");
    var gen_extra = $("#gen_extra");

    var img_list = [];

    function gen_input_help() {   // 表单辅助填写
        var descr = CKEDITOR.instances.descr.getData();

        function input_rewrite(selector, value) {
            $(selector).val(function (index, old_value) {   // 豆瓣链接
                return old_value || value;
            });
        }

        // 通用的 - 中文名，豆瓣链接，IMDb链接
        if (descr.match(/[片译]　　名　(.+?)</)) {  // 填写中文名
            var this_name, trans_title, _title;   // 片名，译名
            this_name = descr.match(/片　　名　(.+?)</) ? descr.match(/片　　名　(.+?)</)[1] : "";
            trans_title = descr.match(/译　　名　(.+?)</) ? descr.match(/译　　名　(.+?)</)[1] : "";
            _title = (this_name ? (this_name + "/") : "") + trans_title;   // 获得所有片名与译名

            // 移除其中的非中文名称
            _title = _title.split("/");
            _title = _title.filter(function (x) {
                return /[\u4E00-\u9FA5]/.test(x);
            });
            _title = _title.join('/');

            input_rewrite("input[name$=cname]", limit_item(_title));
        }

        input_rewrite("input[name=dburl]", descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/) ? descr.match(/(https?:\/\/movie\.douban\.com\/subject\/\d+\/?)/)[1] : "");  // 豆瓣链接
        input_rewrite("input[name=url]", descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/) ? descr.match(/(https?:\/\/www\.imdb\.com\/title\/tt\d+\/)/)[1] : "");   // IMDb链接

        // 各版块不同的
        switch (cat) {
            case 401:   // 剧集区
                // 暂无QAQ
                break;
            case 408:   // 电影区
                input_rewrite("#movie_type", limit_item(descr.match(/类　　别　(.+?)</) ? descr.match(/类　　别　(.+?)</)[1] : ""));    // 电影类别
                input_rewrite("#movie_country", limit_item(descr.match(/产　　地　(.+?)</) ? descr.match(/产　　地　(.+?)</)[1] : ""));  // 制片国家/地区
                break;
            case 404:   // 动漫区（动漫区辅助填写依赖脚本自动抓取的简介信息，暂不能根据已有信息填充）
                input_rewrite("#comic_cname", GM_getValue("comic_cname") || "");
                input_rewrite("#comic_year", GM_getValue("comic_year") || "");
                break;
        }
    }

    function gen_descr_raw_to_editor(raw) {
        // 添加图片信息
        if (img_list) {
            var img_html = "<hr>你可能需要下载下列图片，并上传到本站。（注意，如果图片名中含有特殊字符串或较长，请修改图片文件名）<table id=\"gen_img_table\" style=\"table-layout:fixed ; width:100%\">";
            for (var i = 0; i < img_list.length; i++) {
                img_html += "<tr><td style='overflow:hidden; text-overflow:ellipsis;'><a href='" + img_list[i] + "' target='_blank'>" + img_list[i] + "</a></td></tr>";
            }
            img_html += "</table>";

            gen_extra.html(img_html).show();
        }

        var descr = raw.replace(/\n/g, "<br />");  // 将原始字符串（为BBCode格式）中的`\n` 替换为 `<br>`
        CKEDITOR.instances.descr.setData(descr);  // 填入原始简介
        $("#gen_format").click();   // 模拟点击，美化简介及辅助填写表单
        gen_info.text("已完成填写。");
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
            gen_info.text("简介美化完成。");
        } else {
            gen_info.text("简介已被美化，请勿再次美化。");
        }
    }

    function getDoc(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (res) {
                var doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');  // 页面解析
                var body = doc.querySelector("body");
                var page = $(body); // 构造 jQuery 对象
                callback(res, doc, body, page);    // 回调地狱~
            },
            onerror: function (res) {
                gen_info.text("向对应服务器请求数据失败，可能是你的网络问题吧2333");
                // console.log(res);
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
                gen_info.text("向对应API服务器请求数据失败，可能是你的网络问题吧2333");
                // console.log(res);
            }
        });
    }

    $("#gen_format").click(function () {
        gen_descr_format();  // 格式化
        gen_input_help();    // 辅助填写表单
    });

    $('#gen_btn').click(function () {
        var subject_url = $('#gen_url').val().trim();

        if (/^http/.test(subject_url)) {
            gen_info.text("识别输入内容为链接格式，开始请求源数据....");

            img_list = [];  // 清空图片缓存列表
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

                        var descriptionGenerator = function () {
                            var descr = "";
                            descr += trans_title ? ('◎译　　名　' + trans_title + "\n") : "";
                            descr += this_title ? ('◎片　　名　' + this_title + "\n") : "";
                            descr += year ? ('◎年　　代　' + year + "\n") : "";
                            descr += region ? ('◎产　　地　' + region + "\n") : "";
                            descr += genre ? ('◎类　　别　' + genre + "\n") : "";
                            descr += language ? ('◎语　　言　' + language + "\n") : "";
                            descr += playdate ? ('◎上映日期　' + playdate + "\n") : "";
                            descr += imdb_rating ? ('◎IMDb评分  ' + imdb_rating + "\n") : "";
                            descr += imdb_link ? ('◎IMDb链接  ' + imdb_link + "\n") : "";
                            descr += douban_rating ? ('◎豆瓣评分　' + douban_rating + "\n") : "";
                            descr += douban_link ? ('◎豆瓣链接　' + douban_link + "\n") : "";
                            descr += episodes ? ('◎集　　数　' + episodes + "\n") : "";
                            descr += duration ? ('◎片　　长　' + duration + "\n") : "";
                            descr += director ? ('◎导　　演　' + director + "\n") : "";
                            descr += writer ? ('◎编　　剧　' + writer + "\n") : "";
                            descr += cast ? ('◎主　　演　' + cast.replace(/\n/g, '\n' + '　'.repeat(4) + '  　').trim() + "\n") : "";
                            descr += tags ? ('\n◎标　　签　' + tags + "\n") : "";
                            descr += introduction ? ('\n◎简　　介\n\n　　' + introduction.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";
                            descr += awards ? ('\n◎获奖情况\n\n　　' + awards.replace(/\n/g, '\n' + '　'.repeat(2)) + "\n") : "";

                            gen_descr_raw_to_editor(descr);
                        };

                        descriptionGenerator();   // 预生成一次
                        gen_info.text("豆瓣主页面解析完成，开始(异步)请求补充信息，简介可能会多次刷新。");

                        // IMDb信息（最慢，最先请求）
                        if (imdb_link) {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: 'https://p.media-imdb.com/static-content/documents/v1/title/' + imdb_link.match(/tt\d+/) + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json',
                                onload: function (res) {
                                    var try_match = res.responseText.match(/imdb.rating.run\((.+)\)/);
                                    var a = JSON.parse(try_match[1]);
                                    imdb_average_rating = (parseFloat(a.resource.rating).toFixed(1) + '').replace('NaN', '');
                                    imdb_votes = a.resource.ratingCount ? a.resource.ratingCount.toLocaleString() : '';
                                    imdb_rating = imdb_votes ? imdb_average_rating + '/10 from ' + imdb_votes + ' users' : '';
                                    descriptionGenerator();   // 成功后刷新简介
                                }
                            });
                        }

                        // 该影片的评奖信息
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
                            descriptionGenerator();
                        });

                        //豆瓣评分，简介，海报，导演，编剧，演员，标签
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

                                if (poster) {
                                    // description_text.push('[img]'+poster+'[/img]\n');
                                    img_list.push(poster);
                                }
                                descriptionGenerator();
                            }
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
                        on_air_date = on_air_date.toDateEx().format("yyyy.MM");
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
                });
            }
            else {
                gen_info.text("似乎并不认识这种链接(ノ｀Д)ノ");
                gen_extra.html('<hr>你输入的链接格式不在接受的范围内，脚本支持的链接格式有' +
                    '<table id="gen_link" style="width: 100%" align="center"><tbody>' +
                    '<tr><td class="colhead" align="center">站点类型</td><td class="colhead" align="center">网址示例</td></tr>' +
                    '<tr><td class="rowfollow" align="center"><a href="https://www.douban.com/" target="_blank">豆瓣 Douban</a></td><td class="rowfollow" align="center">https://movie.douban.com/subject/:d/</td></tr>' +
                    '<tr><td class="rowfollow" align="center"><a href="https://bgm.tv/" target="_blank">番组计划 Bangumi</a></td><td class="rowfollow" align="center">https://bgm.tv/subject/:d/ , http://bangumi.tv/subject/:d/ , http://chii.in/subject/:d/</td></tr>' +
                    '</tbody></table>');
            }
        } else {
            gen_info.text("识别输入内容为文字格式，尝试搜索.......");

            var Search_From_API = function (url, callback) {
                getJSON(url, function (res, resj) {
                    gen_info.text("请求成功，请在下方选择对应链接。");
                    var search_html = callback(res, resj);
                    if (search_html) {
                        $("#gen_extra").html(search_html).show();

                        $("a.gen_search_choose").click(function () {
                            var tag = $(this);
                            $('#gen_url').val(tag.attr("data-url"));
                            $('#gen_btn').click();
                        });
                    } else {
                        gen_info.text("无搜索结果");
                    }
                });
            };

            if ([408, 401].indexOf(cat) > -1) {    // 电影区，剧集区
                Search_From_API("https://api.douban.com/v2/movie/search?q=" + subject_url, function (res, resj) {
                    var search_html = "";
                    if (resj.total !== 0) {
                        search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"gen_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>年代</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>标题</td><td class=\"colhead\" align='center'>豆瓣链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                        for (var i_douban = 0; i_douban < resj.subjects.length; i_douban++) {
                            var i_item = resj.subjects[i_douban];
                            search_html += "<tr><td class='rowfollow' align='center'>" + i_item.year + "</td><td class='rowfollow' align='center'>" + i_item.subtype + "</td><td class='rowfollow'>" + i_item.title + "</td><td class='rowfollow'><a href='" + i_item.alt + "' target='_blank'>" + i_item.alt + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.alt + "'>选择</a></td></tr>";
                        }
                        search_html += "</table>";
                    }
                    return search_html;
                });
            } else if (cat === 404) {   // 动漫区
                Search_From_API("https://api.bgm.tv/search/subject/" + subject_url + "?responseGroup=large&max_results=20&start=0", function (res, resj) {
                    var search_html = "";
                    if (resj.results !== 0) {
                        search_html = "<hr>下面为可能的搜索结果，请确认<table id=\"gen_search_table\" style='width: 100%' align='center'><tr><td class=\"colhead\" align='center'>放送开始</td><td class=\"colhead\" align='center'>类别</td><td class=\"colhead\" align='center'>名称</td><td class=\"colhead\" align='center'>Bangumi链接</td><td class=\"colhead\" align='center'>行为</td></tr>";
                        var tp_dict = {1: "漫画/小说", 2: "动画/二次元番", 3: "音乐", 4: "游戏", 6: "三次元番"};
                        for (var i_bgm = 0; i_bgm < resj.list.length; i_bgm++) {
                            var i_item = resj.list[i_bgm];
                            search_html += "<tr><td class='rowfollow' align='center'>" + i_item.air_date + "</td><td class='rowfollow' align='center'>" + tp_dict[i_item.type] + "</td><td class='rowfollow'>" + i_item.name_cn + " | " + i_item.name + "</td><td class='rowfollow'><a href='" + i_item.url + "' target='_blank'>" + i_item.url + "</a></td><td class='rowfollow' align='center'><a href='javascript:void(0);' class='gen_search_choose' data-url='" + i_item.url + "'>选择</a></td></tr>";
                        }
                        search_html += "</table>";
                    }
                    return search_html;
                });
            }
        }
    });
});


/**
 * Created by Rhilip on 10/12/2017.
 * 20180305：补充Bangumi相关解析，修改豆瓣链接异步获取的监听方法。
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
