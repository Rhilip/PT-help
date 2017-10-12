// ==UserScript==
// @name        BYRBT : Get Movie Info Directly
// @author      Rhilip
// @description 从其他信息站点（Douban、Bangumi）获取种子简介信息
// @include      /^https?:\/\/bt\.byr\.cn\/upload\.php\?type=40(8|1|4)/
// @icon        http://bt.byr.cn/favicon.ico
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @version     20171012
// ==/UserScript==

$(document).ready(function(){
    // 构造本脚本和用户交互行
    $('#compose').find('> table > tbody > tr:eq(2)').after('<tr id="ben_help"><td class="rowhead nowrap">快速填写信息</td><td class="rowfollow" valign="top" align="left"><input type="text" id="ben_url" placeholder="相应网站上资源信息页的 URL" size="80"> <input type="button" id="ben_btn" value="导入">&nbsp;&nbsp;<span id="ben_info"></span><br> 此功能可以从 豆瓣 / Bangumi 上抓取信息，并生成标题tag信息（在正确类型下）及简介。目前仅支持电影 / 剧集 / 动漫区。<br></td></tr>');

    var ben_info = $("#ben_info");

    // 识别板块

    $('#ben_btn').click(function(){
        var subject_url = $('#ben_url').val().trim();
        var img_list = [];
        var descr = "<br><br>";

        if (subject_url.match(/(http|subject|douban).+\d+/)){
            ben_info.text("识别到链接： "+ subject_url);
            GM_xmlhttpRequest({
                method: "GET",
                url: subject_url,
                headers: {
                    'User-Agent': window.navigator.userAgent,
                    'Content-type': null
                },
                onload: function(res) {
                    ben_info.text("获取简介资源成功，正在分析.....");
                    var resp = res.responseText;

                    var title_tag = resp.match(/<title[^>]*>[\s\S]*<\/title>/gi)[0];
                    var body_tag = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                    var page = $(body_tag); // 构造 jQuery 对象

                    if (subject_url.match(/douban/)){   // 豆瓣
                        var title,title_en = "";
                        title  = title_en = page.find('#content > h1 > span')[0].textContent.split(' ');
                        title = title.shift();
                        title_en = title_en.join(' ').trim();
                        var aka = page.find('div.article #info').contents().filter(function () {
                            return (this.nodeType === 3) && ($(this).prev().text() === "又名:");
                        }).text();
                        if (aka) {
                            aka = aka.split(' / ');
                            aka = aka.filter(function (x) {
                                return /[\u4E00-\u9FA5]/.test(x);
                            });
                            aka = aka.join(' / ').trim();
                        }

                        descr += '◎译　　名　' + [title, aka].join(' / ').trim() + '</br>';
                        descr += '◎片　　名　' + title_en + '</br>';
                        descr += '◎年　　代　' + page.find('#content > h1 > span.year').text().substr(1, 4) + '</br>';
                        descr += '◎产　　地　' + page.find('div.article #info').contents().filter(function () {
                            return (this.nodeType === 3) && ($(this).prev().text() === "制片国家/地区:");
                        }).text().trim() + '</br>';

                        var genres_temp = $("<div></div>");
                        genres_temp.append(page.find('div.article #info span[property="v:genre"]').clone());
                        genres_temp.find('span').each(function () {
                            $(this).append('<div> / </div>');
                        });
                        genres_temp.find("div:last").remove();
                        var genres = genres_temp.text();
                        descr += '◎类　　别　' + genres + '<br>';
                        descr += '◎语　　言　' +  page.find('div.article #info').contents().filter(function () {
                            return (this.nodeType === 3) && ($(this).prev().text() === "语言:");
                        }).text().trim() + '<br>';
                        descr += '◎上映日期　' + page.find('div.article #info [property="v:initialReleaseDate"]').text() + '</br>';
                        descr += '◎IMDb评分　' + page.find('.rating_imdb strong.ll').text() + '/10 from ' + page.find('.rating_imdb a.rating_people').text() + '</br>';
                        var imdb_link = page.find('div.article #info a:last').attr('href');
                        descr += '◎IMDb链接　' + imdb_link + '</br>';
                        descr += '◎豆瓣评分　' + page.find('.rating_douban strong.ll').text() + '/10 from ' + page.find('.rating_douban a.rating_people').text() + '</br>';
                        descr += '◎豆瓣链接　' + subject_url + '</br>';
                        descr += '◎片　　长　' + page.find('div.article #info').contents().filter(function () {
                            return ($(this).prev().attr('property') === "v:runtime") || ($(this).prev().text() === "片长:");
                        }).text().trim() + '</br>';
                        descr += '◎导　　演　' + page.find('div.article #info span.attrs:first').text() + '</br>';
                        descr += '◎主　　演　' + page.find('div.article #info span.actor span.attrs span').text() + '</br>';  // TODO check;
                        descr += '<p>◎简　　介</p><p>' + page.find('div.article div.related-info [property="v:summary"]').html() + '</p>';

                        if (page.find('ul').hasClass("award")) {
                            var award_tag = $('<div></div>');
                            page.find('ul.award').each(function () {
                                award_tag.append('　　'+ $(this).text() + '</br>');
                            });
                            // $('div.article div.related-info').before(temp);
                            descr += '<p>◎获奖情况</p>' + award_tag.html() + '</br>';
                        }
                        $("input[name$=cname]").val(title);
                        $("#movie_type").val(genres.replace(/ /g,""));
                        $("input[name=url]").val(imdb_link);
                        $("input[name=dburl]").val(subject_url);
                    }
                    else if(subject_url.match(/(bgm\.tv|bangumi\.tv|chii\.in)\/subject\//)){   // Bangumi
                        var match = title_tag.match(/ \| Bangumi 番组计划/);
                        if (!match) {
                            ben_info.text('失败，可能由于对应资源不存在或者网络问题');
                            return;
                        }

                        img_list.push(page.find("div#bangumiInfo > div > div:nth-child(1) > a > img").attr("src"));

                        var story = page.find("div#subject_summary").text();             //Story
                        var raw_staff = [], staff_box = page.find("ul#infobox");        //Staff
                        var che_name,start_time = "";
                        for (var staff_number = 0; staff_number < Math.min(12, staff_box.children("li").length); staff_number++) {
                            var raw_text = staff_box.children("li").eq(staff_number).text();
                            raw_staff.push(raw_text);
                            var key = raw_text.split(":");

                            if (key[0].trim() === "中文名"){
                                che_name = key[1].trim();
                            } else if (key[0].trim() === "放送开始"){
                                var tim = key[1].trim().match(/(\d+)年(\d+)月/);
                                start_time = tim[1] + "." + tim[2];
                            }
                        }

                        var raw_cast = [], cast_box = page.find("ul#browserItemList");      //Cast
                        for (var cast_number = 0; cast_number < cast_box.children("li").length; cast_number++) {    //cast_box.children("li").length
                            var cast_name = cast_box.children("li").eq(cast_number).find("span.tip").text();
                            var cast_tag = cast_box.children("li").eq(cast_number);
                            if (!(cast_name.length)) {     //如果不存在中文名，则用cv日文名代替
                                cast_name = cast_tag.find("div > strong > a").text().replace(/(^\s*)|(\s*$)/g, "");   //#browserItemList > li > div > strong > a
                            }
                            var cv_name = cast_tag.find("span.tip_j > a").text();
                            raw_cast.push(cast_name + ' : ' + cv_name);
                        }

                        descr += '<span style="color: #008080;font-family: Impact,serif;font-size: large;"> STORY : </span><br>' + story +
                            '<br><br><span style="color: #008080;font-family: Impact,serif;font-size: large;"> STAFF : </span><br>' + raw_staff.join("<br>") +
                            '<br><br><span style="color: #008080;font-family: Impact,serif;font-size: large;"> CAST : </span><br>' + raw_cast.join("<br>") +
                            "<br><br>(来源于" + subject_url +")<br>";

                        $("#comic_cname").val(che_name);
                        $("#comic_year").val(start_time);
                    }

                    CKEDITOR.instances.descr.setData(descr);
                    GM_setClipboard(descr);
                    ben_info.text("已填写标题内容和简介部分，你也可以使用`Ctrl + V`粘贴简介部分内容源码。");
                },
                onerror: function() {
                    ben_info.text("不知道为什么失败了");
                }
            });
        }
        else if (subject_url){
            ben_info.text("未识别到链接，你输入的信息为："+ subject_url);
            // TODO 搜索
        }else {
            ben_info.text("真的有链接吗？你什么都没告诉我呀23333");
        }

    });
});

/**
 * Created by Rhilip on 10/12/2017.
 * 20171012: Test Version~ , Thanks those Userscript:
 *           1. Bangumi - Info Export.user.js: https://github.com/Rhilip/My-Userscript/blob/master/Bangumi%20-%20Info%20Export.user.js
 *           2. 豆瓣评分pt字幕: https://github.com/Exhen/douban/blob/master/20171012.js
 *           3. QptUserScript Transmit: https://github.com/zunsthy/QingyingptUserScript/blob/master/QptUserScript_Transmit.user.js
 */
