// ==UserScript==
// @name         NEU6 Info Clone
// @namespace    neu6infoclone
// @author       Rhilip,baishuangxing
// @description  一键复制六维已有种子的信息
// @grant        GM_xmlhttpRequest
// @include      http://bt.neu6.edu.cn*/search.php*
// @include      http://bt.neu6.edu.cn*/forum*
// @include      http://bt.neu6.edu.cn/thread*
// @include      http://bt.neu6.edu.cn/forum.php?mod=*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @icon         http://bt.neu6.edu.cn/favicon.ico
// @supportURL   http://bt.neu6.edu.cn/thread-1555682-1-1.html
// @version      20161118
// ==/UserScript==
// http://code.jquery.com/jquery-2.2.4.min.js
// ~~~~~~~~~~~~~~~~~~~~~~~~可配置选项~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~常用链接配置~~~~~~~~~~~~~~~~~~~~~~~
var common_link1 = "http://bt.neu6.edu.cn/thread-1523211-1-1.html";
var common_link1_name = "剧版常见问题";
var common_link2 = "http://bt.neu6.edu.cn/thread-1529941-1-1.html";
var common_link2_name = "高清剧集版规";
var common_link3 = "http://bt.neu6.edu.cn/thread-1531028-1-1.html";
var common_link3_name = "普通剧集版规";
// ~~~~~~~~~~~~~~~~~~~~~~功能开启与关闭~~~~~~~~~~~~~~~~~~~~~~
var AutoAdd = true; //自动增加集数，可选true,false
var AutoImgRemove = true; //自动移除最后一张图片，可选true,false
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 脚本预处理阶段
var jq = jQuery.noConflict();

(function() {
    // 各板块列表
    if (jq('table#threadlisttableid').length) {
        var cat = 0;
        var match = location.href.match(/forum-(\d+)-1/);
        if (match) {
            cat = match[1];
        } else {
            cat = location.href.match(/fid=(\d+)/)[1];
        }
        jq("table#threadlisttableid tbody").each(function() {
            var tbody = jq(this);
            if (tbody.find('tr td:eq(1) img').length) {
                tbody.find('tr td:lt(3)').css("text-align", "center");
            } else {
                tbody.find('tr td:lt(4)').css("text-align", "center");
            }
            var id = 0;
            if (typeof(tbody.attr('id')) != "undefined" && tbody.attr("id") != "separatorline") {
                id = tbody.attr('id').match(/(\d+)/)[1];
            }
            var size = 0;
            if (tbody.find('tr td').length > 3) {
                size = parseInt(tbody.find('tr td:eq(3)').text());
            }
            if (!(size < 1 || id === 0 || tbody.attr("id") == "separatorline")) {
                var link = "http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id;
                if (tbody.find('tr td:eq(1) img').length) {
                    var tr_img1 = tbody.find('tr td:eq(1) img');
                    var td_img1 = tbody.find('tr td:eq(1)');
                    var downloadtorrent1 = tbody.find('tr td:eq(2)');
                    var link1 = "http://bt.neu6.edu.cn/thread-" + id + "-1-1.html";
                    tr_img1.click(function() {
                        window.open(link);
                    });
                    downloadtorrent1.click(function() {
                        jq.get(link1, function(resp) {
                            var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                            var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                            var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                            window.open(downlink);
                        });
                    });
                    tr_img1.mouseenter(function() {
                        td_img1.css("background-color", "#DDA0DD");
                        tr_img1.animate({
                            opacity: '0.5',
                            height: '-=2px',
                            width: '-=2px'
                        });
                    });
                    tr_img1.mouseleave(function() {
                        td_img1.css("background-color", "rgba(0,0,0,0)");
                        tr_img1.animate({
                            opacity: '1',
                            height: '+=2px',
                            width: '+=2px'
                        });
                    });
                    downloadtorrent1.mouseenter(function() {
                        downloadtorrent1.css("background-color", "#DDA0DD");
                    });
                    downloadtorrent1.mouseleave(function() {
                        downloadtorrent1.css("background-color", "rgba(0,0,0,0)");
                    });
                } else if (tbody.find('tr td:eq(2) img').length) {
                    var tr_img2 = tbody.find('tr td:eq(2) img');
                    var td_img2 = tbody.find('tr td:eq(2)');
                    var downloadtorrent = tbody.find('tr td:eq(3)');
                    var link2 = "http://bt.neu6.edu.cn/thread-" + id + "-1-1.html";
                    tr_img2.click(function() {
                        window.open(link);
                    });
                    downloadtorrent.click(function() {
                        jq.get(link2, function(resp) {
                            var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                            var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                            var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                            window.open(downlink);
                        });
                    });
                    tr_img2.mouseenter(function() {
                        td_img2.css("background-color", "#DDA0DD");
                        tr_img2.animate({
                            opacity: '0.5',
                            height: '-=2px',
                            width: '-=2px'
                        });
                    });
                    tr_img2.mouseleave(function() {
                        td_img2.css("background-color", "rgba(0,0,0,0)");
                        tr_img2.animate({
                            opacity: '1',
                            height: '+=2px',
                            width: '+=2px'
                        });
                    });
                    downloadtorrent.mouseenter(function() {
                        downloadtorrent.css("background-color", "#DDA0DD");
                    });
                    downloadtorrent.mouseleave(function() {
                        downloadtorrent.css("background-color", "rgba(0,0,0,0)");
                    });
                }

            }
        });
    }
    // 搜索页面
    if (jq('table.dt').length) {
        jq('table.dt tr:gt(0)').each(function() {
            var tr = jq(this);
            tr.find('td:lt(2)').css("text-align", "center");
            var cat = tr.find('td:eq(4) a').attr('href').match(/forum-(\d+)-1/)[1];
            var id = tr.find('td:eq(2) a').attr('href').match(/thread-(\d+)-1/)[1];
            var link = "http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id;
            if (tr.find('td:eq(0) img').length) {
                var tr_img = tr.find('td:eq(0) img');
                var td1 = tr.find('td:eq(0)');
                var downloadtorrent = tr.find('td:eq(1)');
                var link1 = "http://bt.neu6.edu.cn/thread-" + id + "-1-1.html";
                tr_img.click(function() {
                    window.open(link);
                });
                downloadtorrent.click(function() {
                    jq.get(link1, function(resp) {
                        var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                        var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                        var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                        window.open(downlink);
                    });
                });
                tr_img.mouseenter(function() {
                    td1.css("background-color", "#DDA0DD");
                    tr_img.animate({
                        opacity: '0.5',
                        height: '-=2px',
                        width: '-=2px'
                    });
                });
                tr_img.mouseleave(function() {
                    td1.css("background-color", "rgba(0,0,0,0)");
                    tr_img.animate({
                        opacity: '1',
                        height: '+=2px',
                        width: '+=2px'
                    });
                });
                downloadtorrent.mouseenter(function() {
                    downloadtorrent.css("background-color", "#DDA0DD");
                });
                downloadtorrent.mouseleave(function() {
                    downloadtorrent.css("background-color", "rgba(0,0,0,0)");
                });
            }
        });
    }
    // 帖子页面
    if (location.href.match(/thread-\d+-\d+-\d/) || location.href.match(/mod=viewthread\Stid=\d+/)) {
        if (jq('div.pcb div.mtw.mbw').length) {
            jq('div#fj.y label').before('<label id="malvjisuan" class="z">计算=</label><input type="text" class="px p_fre z" size="2" id="malvzhi" title="码率估算" />');
        }
        if (jq('div.pob.cl:first em').length && jq('div.pcb div.mtw.mbw').length) {
            var seedid_match = location.href.match(/thread-(\d+)-\d-\d/);
            var seedid = 0;
            if (seedid_match) {
                seedid = seedid_match[1];
            } else {
                seedid = location.href.match(/tid=(\d+)/)[1];
            }
            var a_length = jq('div#pt div.z a').length - 2;
            var cat1 = 0;
            var cat1_match = jq('div#pt div.z a:eq(' + a_length + ')').attr("href").match(/forum-(\d+)-1/);
            if (cat1_match) {
                cat1 = cat1_match[1];
            } else {
                cat1 = jq('div#pt div.z a:eq(' + a_length + ')').attr("href").match(/fid=(\d+)/)[1];
            }
            var index = 0;

            jq('div.pob.cl').each(function() {
                var quote_id = jq('div.pcbs:eq(' + index + ') table:first td:first').attr("id").match(/postmessage_(\d+)/)[1];
                var link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&reppost=" + quote_id;
                if (index > 0) {
                    link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&repquote=" + quote_id;
                }
                index++;
                var commonlink = "commonlink_" + index;
                var seed_p = jq(this).find('p');
                seed_p.find('a:first').before('<a href="javascript:;" id="' + commonlink + '" onmouseover="showMenu(this.id)" class="showmenu">常用链接</a>');
                seed_p.after('<ul id="' + commonlink + '_menu" class="p_pop mgcmn" style="display: none;"><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/084832wh4p2z362amsf4mv.png) no-repeat 4px 50%;" target="_blank" href="' + link_reply + '">回复本帖高级</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;" target="_blank" href="' + common_link1 + '">' + common_link1_name + '</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;" target="_blank" href="' + common_link2 + '">' + common_link2_name + '</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;" target="_blank" href="' + common_link3 + '">' + common_link3_name + '</a><li></ul>');
                var tvname_cn = jq('title').text().match(/\[([\S\s]+?)[\/\]]/)[1];
                if (null !== tvname_cn) {
                    var subtitle_id = "subtitle_" + index;
                    var link1 = "http://www.zimuzu.tv/search?keyword=" + encodeURI(tvname_cn);
                    var link2 = "http://assrt.net/sub/?searchword=" + encodeURI(tvname_cn);
                    var link3 = "http://subhd.com/search/" + encodeURI(tvname_cn);
                    var link4 = "http://www.zimuku.net/search?ad=1&q=" + encodeURI(tvname_cn);
                    var link5 = "http://www.addic7ed.com/";
                    seed_p.find('a:first').before('<a href="javascript:;" id="' + subtitle_id + '" onmouseover="showMenu(this.id)" class="showmenu">搜索字幕</a>');
                    seed_p.after('<ul id="' + subtitle_id + '_menu" class="p_pop mgcmn" style="display: none;"><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + link1 + '">ZIMUZU</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + link2 + '">SHOOTER</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + link3 + '">Sub HD</a></li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + link4 + '">ZIMUKU</a><li><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + link5 + '">ADDIC7ED</a><li></ul>');
                }
            });
        }
    }
    // 码率估算
    jq('#malvjisuan').click(function() {
        var bitrate_dur = jq('#malvzhi').val();
        var seed_size_info = jq('div.pcb div.mtw.mbw').text();
        var seed_size = seed_size_info.match(/(\d+[.]{0,1}\d*)/)[1];
        var seed_size_unit = seed_size_info.match(/([a-zA-Z]+)/)[1];
        if ("GB" === seed_size_unit) {
            seed_size = parseFloat(seed_size) * 1024 * 1024 * 8;
        } else if ("MB" === seed_size_unit) {
            seed_size = parseFloat(seed_size) * 1024 * 8;
        }
        var bitrate_val = (seed_size / 60.0 / bitrate_dur).toFixed(0);
        jq('#malvzhi').val(bitrate_val);

    });
    // 对发种界面的修改
    if (location.href.match(/action=newthread/) || location.href.match(/action=edit/)) {
        jq('div.specialpost.s_clear div.pbt.cl input').attr('style', 'width: 52em');
        jq('#subject').attr('style', 'width: 70em'); //更改发种界面的输入框宽度
        //jq('#custominfo_pmenu').hide();
        jq('div#postbox').before('<div class="pbt cl"><div class="ftid"><span width="80">种子信息克隆：</span></div><div class="z"><span><input type="text" style="width:300px;" id="clone_from" class="px" placeholder="要克隆的种子编号链接" onkeypress="if(event.keyCode==13){clone_btn.click();}"></span><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子链接</span><span>]</span></div></div><div class="pbt cl" id="seedfromtitleinfo"><div class="ftid"><span width="80">引用资源标题：</span></div><div class="z"><span><input type="text" style="width:71.5em;" id="seed_from_title" class="px"></span></div></div>');
        //展开标签栏，预备填写
        jq('#extra_tag_b').addClass('a');
        jq('#extra_tag_c').css('display', 'block');
    }
    //AutoAdd处理部分内容
    function numatostring2(num) {
        var res = 0;
        res = num;
        if (res < 10)
            return "0" + res;
        return res.toString();
    }

    function leapyear(year) {
        if (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0))
            return true;
        else
            return false;
    }

    function tvseasonhandle(str, type) {
        if (str.match(/\[\d+[Pp]\]/)) {
            return str;
        }
        var aaatv = str.match(/\d+/g);
        var bbbtv = str.match(/\D+/g);
        if (aaatv && aaatv.length == 1) {
            str = numatostring2(parseInt(aaatv[0]) + 1);
            if (bbbtv) {
                str = bbbtv[0] + str;
                if (bbbtv && bbbtv.length > 1)
                    str = str + bbbtv[1];
            }

        }
        if (aaatv && aaatv.length == 2) {
            if (bbbtv && bbbtv.length >= 2 && bbbtv[1] == "E") {
                aaatv[1] = numatostring2(parseInt(aaatv[1]) + 1);
            } else {
                var temp = parseInt(aaatv[1]) - parseInt(aaatv[0]);
                aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
                aaatv[1] = numatostring2(parseInt(aaatv[0]) + temp);
            }
            if (bbbtv && bbbtv.length == 1)
                str = aaatv[0] + bbbtv[0] + aaatv[1];
            else if (bbbtv && bbbtv.length == 2)
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
            else if (bbbtv && bbbtv.length == 3) {
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
            }

        }
        return str;
    }
    // 外站请求函数
    function requestData(url, successHandle, timeoutHandle, options) {
        var headers = options ? options : {
            'User-Agent': navigator.userAgent,
            'Accept': '"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"'
        };
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: headers,
            timeout: 2048,
            onreadystatechange: successHandle,
            ontimeout: timeoutHandle,
        });
    }

    function requestHTML(url, callback, options) {
        requestData(url, function(response) {
            // console.log(response.readyState, response.status);
            if (response.readyState == 4) {
                callback(response.responseText
                    .match(/<head[^>]*?>([\S\s]+)<\/body>/)[1]
                    .replace(/<script(\s|>)[\S\s]+?<\/script>/g, '')
                );
            }
        }, function(response) {
            // console.log(response);
            jq('#clone_info').val('Error<---->Timeout');
        }, options);
    }

    function requestJson(url, callback, options) {
        requestData(url, function(response) {
            if (response.readyState == 4) {
                callback(JSON.parse(response.responseText));
            }
        }, function(response) {
            jq('#clone_info').val('Error<---->Timeout');
        }, options);
    }

    function changedescibe(descr) {
        //填写内容
        var gonggaomatch = jq('#e_textarea').html().match(/(\Stable[\s\S]+\/table\S)/);
        if (gonggaomatch) {
            jq('#e_iframe').contents().find('body').html(bbcode2html(gonggaomatch[1]) + descr);
        } else {
            jq('#e_iframe').contents().find('body').html(descr);
        }
    }

    function imagehandle(imglink) {
        if (imglink.length < 1) {
            return;
        }
        ImgWindow = window.open('', '');
        ImgWindow.document.write("<h1 align=\"center\"><---请选择图片下载到本地再上传到六维---></h1>");
        for (var i = 0; i < imglink.length; i++) {
            ImgWindow.document.write("<div style=\"width:20%;float:left;\"><img src=" + imglink[i] + "></div>");
        }
        ImgWindow.focus();
    }

    jq('#clone_btn').click(function() {
        var copy_link = jq('#clone_from').val().trim();
        var info = jq('#clone_info');
        if (/^\d+$/.test(copy_link) || copy_link.match(/bt\.neu6\.edu\.cn/)) {
            var seedtype = location.search.match(/fid=(\d+)/)[1];
            var seedfrom = jq('#clone_from').val().trim();
            var match = seedfrom.match(/thread-(\d+)/);
            var match1 = seedfrom.match(/tid=(\d+)/);
            if (match !== null) {
                seedfrom = match[1];
            } else if (match1 !== null) {
                seedfrom = match1[1];
            }
            if (/^\d+$/.test(seedfrom)) {
                // 如果输入了有效的编号，开始读取对应的种子页面
                info.text('正在读取');
                jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function(resp) {
                    var i = 0;
                    info.text('正在分析');
                    var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                    // 移除来自群组
                    var group = body.match(/来自群组: <a[\s\S]*?a>/);
                    if (group) {
                        body = body.substring(0, group.index) + body.substring(group.index + group[0].length, body.length);
                    }
                    // body.replace(/来自群组: <a[\s\S]+?<\/a>/,"");
                    var page = jq(body); // 构造 jQuery 对象，用于后期处理
                    var title = page.find("span#thread_subject").text();
                    if (!title) {
                        info.text('失败，可能由于种子不存在或者网络问题');
                        return;
                    }
                    if (AutoAdd) {
                        if (seedtype == 48) { //高清剧集
                            var tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                            if (tv_name) {
                                var tv_season = tvseasonhandle(tv_name[0], 48);
                                title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                            }
                        } else if (seedtype == 14) { //电视剧集
                            var tv_name1 = title.match(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/);
                            if (tv_name1) {
                                var tv_season1 = tvseasonhandle(tv_name1[0], 14);
                                title = title.replace(/\[[ESP]{0,2}\d{2}[-\w]*\d{0,2}\]/, tv_season1);
                            }
                        } else if (seedtype == 44) { //动漫
                            var fields_1 = title.match(/\[[^\]]*\]/g);
                            var tv_name2 = title.match(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/);
                            if (tv_name2) {
                                var tv_season2 = tvseasonhandle(tv_name2[0], 44);
                                title = title.replace(/\[[ES]{0,2}\d{2,3}[-E\/]{0,2}\d{0,3}[\s\S]*?\]/, tv_season2);
                            }
                        } else if (seedtype == 16) { //综艺娱乐
                            var fields = title.match(/\[[^\]]*\]/g);
                            if (fields[0].length === 10) {
                                var dayofmonths = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
                                var year = fields[0].substring(1, 5);
                                var month = fields[0].substring(5, 7);
                                var day = fields[0].substring(7, 9);
                                if (leapyear(parseInt(year))) {
                                    dayofmonths[1] += 1;
                                }
                                var monthadd = parseInt((parseInt(day) + 7) / 30);
                                day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
                                var yearadd = parseInt((parseInt(month) + monthadd) / 12);
                                month = numatostring2((parseInt(month) + monthadd) % 12);
                                year = parseInt(year) + yearadd;
                                fields[0] = "[" + year + month + day + "]";
                            }
                            fields[3] = "[]";
                            title = "";
                            for (i = 0; i < fields.length; i++) {
                                title = title + fields[i];
                            }
                        }
                    }

                    jq('input[name=subject]').attr('value', title); //填写标题
                    var movietype = page.find("h1.ts a").text().replace(/^\[|\]$/g, '');
                    var typeid = page.find("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
                    if (movietype && typeid) {
                        jq('#typeid_ctrl_menu li').removeClass('current');
                        jq('#typeid_ctrl').html(movietype);
                        jq('#typeid>option').val(typeid);
                    }
                    //对将要填入的内容部分进行预处理
                    var descr = page.find('td.t_f').first();
                    //如果存在修改信息(本帖最后由 xxxxxx 于 yyyy-MM-dd HH:mm 编辑)，则删除
                    if (descr.find('.pstatus').length) {
                        descr.find('.pstatus').remove();
                        //删除修改信息与正文之间两个空行
                        descr.find('br').eq(0).remove();
                        descr.find('br').eq(0).remove();
                    }
                    //图片处理（对上传的图片）
                    descr.find('ignore_js_op').each(function() {
                        var img = jq(this).find('img:first');
                        //移除引用过程中原图片无用的img属性
                        img.removeAttr('id');
                        img.removeAttr('aid');
                        img.removeAttr('zoomfile');
                        img.removeAttr('class');
                        img.removeAttr('inpost');
                        img.removeAttr('onmouseover');
                        img.removeAttr('onclick');
                        //借用file属性信息修正引用过程中出错的src信息
                        img.attr('src', 'http://bt.neu6.edu.cn' + img.attr('file'));
                        img.removeAttr('file');
                        var hideimg = img.parent('ignore_js_op'); //移动img结点
                        img.insertAfter(hideimg);
                    });
                    //图片移除
                    if (AutoImgRemove && descr.find('img')) {
                        if (seedtype == 16 && descr.find('img').length >= 1)
                            descr.find('img:last').remove();
                        else if (descr.find('img').length > 1) {
                            descr.find('img:last').remove();
                        }
                    }
                    //代码部分处理
                    if (descr.find('div.quote')) {
                        descr.find('div.quote').remove();
                    }
                    if (descr.find('.blockcode')) {
                        descr.find('.blockcode').remove();
                    }
                    if (descr.find('blockcode')) {
                        descr.find('blockcode').remove();
                    }
                    descr.find('ignore_js_op').remove(); //移除含有图片或附件的父节点
                    //填写内容
                    var gonggaomatch = jq('#e_textarea').html().match(/(\Stable[\s\S]+\/table\S)/);
                    if (gonggaomatch) {
                        descr.find('table:first').remove();
                        jq('#e_iframe').contents().find('body').html(bbcode2html(gonggaomatch[1]) + descr.html());
                    } else {
                        jq('#e_iframe').contents().find('body').html(descr.contents());
                    }
                    //填写标签
                    var tag = new Array();
                    page.find('div.ptg.mbm.mtn a').each(function() {
                        var tagtemp = jq(this).text();
                        tag.push(tagtemp);
                    });
                    var tag_fin = "";
                    tag_fin = tag[0];
                    if (tag.length > 1) {
                        for (i = 1; i < tag.length; i++) {
                            tag_fin = tag_fin + "," + tag[i];
                        }
                    }
                    jq('#tags').val(tag);
                    info.text('克隆完成');
                });
            } else {
                info.text('请输入有效的种子链接...');
            }
        } else if (/https?:\/\/movie\.douban\.com\/subject\/\d+/.test(copy_link)) {
            var matchdouban = copy_link.match(/\/(\d+)/);
            if (matchdouban) {
                doubanid = matchdouban[1];
            }
            var new_link = "https://api.douban.com/v2/movie/" + doubanid;
            requestJson(new_link, function(resp) {
                if (jq('#seedfromtitleinfo').length) {
                    jq('#seedfromtitleinfo').show();
                }
                var i = 0;
                var tag = "";
                var descr_content = "<br/><br/><span>※※※※※※※　简介　※※※※※※※</span><br/><br/>";
                if (resp.alt_title) {
                    descr_content = descr_content + "<span>◎译　　名&nbsp;&nbsp;&nbsp;&nbsp" + resp.alt_title + "</span><br/>";
                    tag = tag + resp.alt_title.replace(/[\s]*\/[\s]*/, ",");
                }
                if (resp.title) {
                    descr_content = descr_content + "<span>◎片　　名&nbsp;&nbsp;&nbsp;&nbsp" + resp.title + "</span><br/>";
                    tag = tag + "," + resp.title.replace(/[\s]*\/[\s]*/, ",");
                }
                if (resp.attrs.year)
                    descr_content = descr_content + "<span>◎年　　代&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.year + "</span><br/>";
                if (resp.attrs.country)
                    descr_content = descr_content + "<span>◎国　　家&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.country + "</span><br/>";
                if (resp.attrs.movie_type) {
                    descr_content = descr_content + "<span>◎类　　别&nbsp;&nbsp;&nbsp;&nbsp";
                    for (i = 0; i < resp.attrs.movie_type.length; i++) {
                        if (i == (resp.attrs.movie_type.length - 1)) {
                            descr_content = descr_content + resp.attrs.movie_type[i] + "</span><br/>";
                        } else {
                            descr_content = descr_content + resp.attrs.movie_type[i] + "/";
                        }
                    }
                }
                if (resp.attrs.language)
                    descr_content = descr_content + "<span>◎语　　言&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.language + "</span><br/>";
                if (resp.attrs.pubdate)
                    descr_content = descr_content + "<span>◎上映日期&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.pubdate + "</span><br/>";
                if (resp.attrs.rating)
                    descr_content = descr_content + "<span>◎豆瓣评分&nbsp;&nbsp;&nbsp;&nbsp" + resp.rating.average + "/10 from " + resp.rating.numRaters + " users</span><br/>";
                if (resp.alt)
                    descr_content = descr_content + "<span>◎豆瓣链接&nbsp;&nbsp;&nbsp;&nbsp" + resp.alt.replace(/\/movie\//, "/subject/") + "</span><br/>";
                if (resp.attrs.episodes)
                    descr_content = descr_content + "<span>◎集　　数&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.episodes + "</span><br/>";
                if (resp.attrs.movie_duration)
                    descr_content = descr_content + "<span>◎片　　长&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.movie_duration + "</span><br/>";
                if (resp.attrs.director) {
                    descr_content = descr_content + "<span>◎导　　演</span><br/>";
                    for (i = 0; i < resp.attrs.director.length; i++) {
                        descr_content = descr_content + "<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.director[i] + "</span><br/>";
                    }
                    descr_content = descr_content + "<span>◎主　　演</span><br/>";
                    for (i = 0; i < resp.attrs.cast.length; i++) {
                        descr_content = descr_content + "    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" + resp.attrs.cast[i] + "</span><br/>";
                    }
                    descr_content = descr_content + "<br/>";
                }
                if (resp.summary)
                    descr_content = descr_content + "<p>◎简　　介</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp" + resp.summary;
                descr_content = descr_content + "<br/><br/><p>※※※※※※※※※※※※※※※※※※</p>";
                jq('#seed_from_title').val(resp.alt_title + " " + resp.title);
                var imagelink = [resp.image];
                imagehandle(imagelink);
                changedescibe(descr_content);
                jq('#tags').val(tag);
                info.text("Douban Link<---->克隆完成");
            });
        } else if (/https?:\/\/bt\.byr\.cn\/details\.php\?id=\d+/.test(copy_link)) {
            requestHTML(copy_link, function(doc) {
                if (jq('#seedfromtitleinfo').length) {
                    jq('#seedfromtitleinfo').show();
                }
                var sub = jq(doc);
                var title = sub.find('#share').html()
                        .replace(/\]&[\S\s]+/, "]").trim(),
                    descr = sub.find('#kdescr');
                var imagelink = new Array();
                descr.find('img').each(function() {
                    var imglink = jq(this).attr('src');
                    imagelink.push(imglink);
                });
                imagehandle(imagelink);
                descr.find('img').remove();
                jq('#seed_from_title').val(title);
                changedescibe(descr.html());
                info.text("BYR Link<---->克隆完成");
            });
        } else if (/https?:\/\/pt\.whu\.edu\.cn\/details\.php\?id=\d+/.test(copy_link)) {
            requestHTML(copy_link, function(doc) {
                if (jq('#seedfromtitleinfo').length) {
                    jq('#seedfromtitleinfo').show();
                }
                var sub = jq(doc);
                var title = sub.find('#page-title').html()
                        .replace(/<a[\S\s]+/, '').trim(),
                    subtitle = sub.find('div#outer dl#torrenttable dd:eq(1)').text();
                var descr = sub.find('#kdescr > .bbcode');
                var imagelink = new Array();
                descr.find('img').each(function() {
                    var imglink = jq(this).attr('full');
                    if (/^attachments/.test(imglink)) {
                        imglink = 'https://pt.whu.edu.cn/' + imglink;
                    }
                    imagelink.push(imglink);
                });
                imagehandle(imagelink);
                jq('#seed_from_title').val(title + " " + subtitle);
                descr.find('img').remove();
                changedescibe(descr.html());
                info.text("WHU link<---->克隆完成");
            });
        } else if (/https?:\/\/hdchina\.club\/details\.php\?id=\d+/.test(copy_link)) {
            requestHTML(copy_link, function(doc) {
                if (jq('#seedfromtitleinfo').length) {
                    jq('#seedfromtitleinfo').show();
                }
                var sub = jq(doc);
                var title = sub.find('h2#top').text(),
                    subtitle = sub.find('div.m_name h3').text(),
                    descr = sub.find("#kdescr");
                var imagelink = new Array();
                descr.find('img').each(function() {
                    var imglink = jq(this).attr('src');
                    if (/^attachments/.test(imglink)) {
                        imglink = 'https://hdchina.club/' + imglink;
                    }
                    imagelink.push(imglink);
                });
                imagehandle(imagelink);
                jq('#seed_from_title').val(title + " " + subtitle);
                descr.find('img').remove();
                changedescibe(descr.html());
                info.text("HDChina link<---->克隆完成");
            });
        } else if (/https?:\/\/www\.hdarea\.co\/details\.php\?id=\d+/.test(copy_link)) {
            requestHTML(copy_link, function(doc) {
                if (jq('#seedfromtitleinfo').length) {
                    jq('#seedfromtitleinfo').show();
                }
                var sub = jq(doc);
                var title = sub.find('h1#top[align="center"]').html()
                        .replace(/([^<]+)<[\S\s]+/, "$1")
                        .replace(/&nbsp;/g, '')
                        .trim(),
                    descr = sub.find('#kdescr');
                var imagelink = new Array();
                descr.find('img').each(function() {
                    var imglink = jq(this).attr('src');
                    if (/https?:\/\//.test(imglink)) {
                        imagelink.push(imglink);
                    }
                });
                imagehandle(imagelink);
                jq('#seed_from_title').val(title);
                descr.find('img').remove();
                changedescibe(descr.html());
                info.text("HDArea link<---->克隆完成");
            });
        } else {
            info.text("不支持的链接...");
        }
    });

    jq(document).ready(function() {
        if (jq('#seedfromtitleinfo').length) {
            jq('#seedfromtitleinfo').hide();
        }
        var match = location.href.match(/#clone[_]{0,3}(\d+)/);
        if (match) {
            jq('#clone_from').val(match[1]);
            var link = location.href.substring(0, 64);
            history.pushState("", document.title, link);
            jq('#clone_btn').click();
        }
    });

})();
