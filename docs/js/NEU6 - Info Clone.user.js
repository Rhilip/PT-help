// ==UserScript==
// @name         NEU6 Info Clone
// @namespace    neu6infoclone
// @author       Rhilip,baishuangxing
// @description  一键复制六维已有种子的信息
// @include      http://bt.neu6.edu.cn/search*
// @include      http://bt.neu6.edu.cn/forum*
// @include      http://bt.neu6.edu.cn/thread*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @icon         http://bt.neu6.edu.cn/favicon.ico
// @supportURL   http://bt.neu6.edu.cn/thread-1555682-1-1.html
// @version      20171111
// ==/UserScript==

// jQuery链接(为避免流量，请将第10行juqery源换为下面2的链接)
// 1：https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// 2：http://bt.neu6.edu.cn/static/js/mobile/jquery-1.8.3.min.js


// ~~~~~~~~~~~~~~~~~~~~~~~~可配置选项~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~常用链接配置~~~~~~~~~~~~~~~~~~~~~~~
var common_links = {
    "剧版常见问题": "http://bt.neu6.edu.cn/thread-1523211-1-1.html",
    "高清剧集版规": "http://bt.neu6.edu.cn/thread-1529941-1-1.html",
    "普通剧集版规": "http://bt.neu6.edu.cn/thread-1531028-1-1.html"
};
// ~~~~~~~~~~~~~~~~~~~~~~功能开启与关闭~~~~~~~~~~~~~~~~~~~~~~
var AutoAdd = true; //自动增加集数，可选true,false
var AutoImgRemove = false; //自动移除最后一张图片，可选true,false
var OpenSearchEnhance = true; //开启搜索加强工具，可选true,false
var SearchEnhanceDefaultShow = true; //搜索默认显示/隐藏，可选true,false
var SeedTitleBigFont = false; //标题框放大，可选true,false

var ShowFromat = false;
var ShowVideoRatioCalc = false; //显示码率计算框，可选true,false
var ShowCommonLink = true; //显示常用链接，可选true,false
var ShowSubtitle = false; //显示搜索字幕，可选true,false
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 脚本预处理阶段
var jq = jQuery.noConflict();

(function () {
    // 各板块列表
    if (jq('table#threadlisttableid').length) {
        var cat = location.href.match(/(forum-|fid=)(\d+)/)[2];
        jq("table#threadlisttableid tbody").each(function () {
            var tbody = jq(this);
            if (tbody.find('tr td:eq(1) img').length)
                tbody.find('tr td:lt(3)').css("text-align", "center");
            else if (tbody.find('tr td:eq(2) img').length)
                tbody.find('tr td:lt(4)').css("text-align", "center");

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
                    tr_img1.click(function () {
                        window.open(link);
                    });
                    downloadtorrent1.click(function () {
                        jq.get(link1, function (resp) {
                            var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                            var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                            var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                            window.open(downlink);
                        });
                    });
                    tr_img1.hover(function () {
                        td_img1.attr('title', "点击克隆种子信息");
                        td_img1.css("background-color", "#DDA0DD");
                        tr_img1.animate({
                            opacity: '0.5',
                            height: '-=2px',
                            width: '-=2px'
                        });
                    }, function () {
                        td_img1.attr('title', "");
                        td_img1.css("background-color", "rgba(0,0,0,0)");
                        tr_img1.animate({
                            opacity: '1',
                            height: '+=2px',
                            width: '+=2px'
                        });
                    });
                    downloadtorrent1.hover(function () {
                        downloadtorrent1.attr('title', "点击下载种子");
                        downloadtorrent1.css("background-color", "#DDA0DD");
                    }, function () {
                        downloadtorrent1.attr('title', "");
                        downloadtorrent1.css("background-color", "rgba(0,0,0,0)");
                    });
                } else if (tbody.find('tr td:eq(2) img').length) {
                    var tr_img2 = tbody.find('tr td:eq(2) img');
                    var td_img2 = tbody.find('tr td:eq(2)');
                    var downloadtorrent = tbody.find('tr td:eq(3)');
                    var link2 = "http://bt.neu6.edu.cn/thread-" + id + "-1-1.html";
                    tr_img2.click(function () {
                        window.open(link);
                    });
                    downloadtorrent.click(function () {
                        jq.get(link2, function (resp) {
                            var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                            var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                            var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                            window.open(downlink);
                        });
                    });
                    tr_img2.hover(function () {
                        td_img2.attr('title', "点击克隆种子信息");
                        td_img2.css("background-color", "#DDA0DD");
                        tr_img2.animate({
                            opacity: '0.5',
                            height: '-=2px',
                            width: '-=2px'
                        });
                    }, function () {
                        td_img2.attr('title', "");
                        td_img2.css("background-color", "rgba(0,0,0,0)");
                        tr_img2.animate({
                            opacity: '1',
                            height: '+=2px',
                            width: '+=2px'
                        });
                    });
                    downloadtorrent.hover(function () {
                        downloadtorrent.attr('title', "点击下载种子");
                        downloadtorrent.css("background-color", "#DDA0DD");
                    }, function () {
                        downloadtorrent.attr('title', "");
                        downloadtorrent.css("background-color", "rgba(0,0,0,0)");
                    });
                }

            }
        });
    }
    // 搜索页面
    if (jq('table.dt').length) {
        jq('table.dt tr:gt(0)').each(function () {
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
                tr_img.click(function () {
                    window.open(link);
                });
                downloadtorrent.click(function () {
                    jq.get(link1, function (resp) {
                        var str_link = resp.match(/<p class="attnm">[\s\S]*torrent<\/a>/gi)[0];
                        var downlink_temp = str_link.match(/<a href="([\s\S]*)" onmouseover/)[1];
                        var downlink = "http://bt.neu6.edu.cn/" + downlink_temp.replace(/amp[\S]/, "");
                        window.open(downlink);
                    });
                });
                tr_img.hover(function () {
                    td1.attr('title', "点击克隆种子信息");
                    td1.css("background-color", "#DDA0DD");
                    tr_img.animate({
                        opacity: '0.5',
                        height: '-=2px',
                        width: '-=2px'
                    });
                }, function () {
                    td1.attr('title', "");
                    td1.css("background-color", "rgba(0,0,0,0)");
                    tr_img.animate({
                        opacity: '1',
                        height: '+=2px',
                        width: '+=2px'
                    });
                });
                downloadtorrent.hover(function () {
                    downloadtorrent.attr('title', "点击下载种子");
                    downloadtorrent.css("background-color", "#DDA0DD");
                }, function () {
                    downloadtorrent.attr('title', "");
                    downloadtorrent.css("background-color", "rgba(0,0,0,0)");
                });
            }
        });
    }
    var value_of_forums = {
        "forum_big1": [2, 129, 29, 145, 33, 133, 358, 41, 156, 155, 153, 152, 154, 162, 147, 148, 149, 151, 150, 146],
        "forum_big2": [45, 161, 57, 48, 77, 58, 49, 59, 50, 60, 91, 92],
        "forum_big3": [13, 81, 79, 61, 14, 73, 62, 16, 72, 112, 17, 292, 96, 65, 15, 126, 144, 63, 127, 128, 44, 293, 165, 52, 125, 69, 21, 329, 78, 171, 124, 163, 56, 18, 138, 54, 66, 19, 160, 159, 84, 74, 169, 67, 20, 368, 70],
        "forum_big4": [7, 141, 4, 139, 43, 142, 175, 182, 136, 172],
        "forum_big5": [38, 121, 131, 122, 39, 119, 31, 143],
        "forum_big6": [32, 87, 123, 137, 93, 113, 114, 135, 36, 116, 115, 187],
        "forum_resource1": [45, 161, 13, 81, 79],
        "forum_resource2": [48, 77, 14, 73],
        "forum_resource3": [16, 72],
        "forum_resource4": [17, 292, 96],
        "forum_resource5": [50, 91, 15, 126, 144],
        "forum_resource6": [49, 127],
        "forum_resource7": [44, 293, 165, 52, 125],
        "forum_resource8": [21, 329, 78, 171, 124, 163],
        "forum_resource9": [18, 138, 54],
        "forum_resource10": [19, 160, 159, 84, 74, 169],
        "forum_resource11": [20, 368],
        "movie1": [45, 161, 13, 81,],
        "movie2": [45, 161],
        "movie3": [13, 81],
        "movie4": [45, 161, 57, 13, 81, 79, 61],
        "tvseries1": [48, 77, 14, 73],
        "tvseries2": [48, 77],
        "tvseries3": [14, 73],
        "tvseries4": [77, 73],
        "tvseries5": [48],
        "tvseries6": [14],
        "tvseries7": [48, 77, 58, 14, 73, 62]
    };
    // 搜索页面
    if (OpenSearchEnhance && location.href.match(/search\.php(\Smod=forum)?$/) && jq('div.sttl.mbn').length) {
        jq("table tr:eq(1)").after('<tr><th>搜索范围</th><td><p id="showsearchenhance"><b>----[显示/隐藏]----</b></p><div id="mysearchbox" hidden="true"><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[大版块]----</tr><tr><td><label class="lb"><b>[各版块]</b></label></td><td><label class="my_search lb" id="forum_big1"><input type="radio" class="pr" name="searchenhance"/>六维索引互动区</label></td><td><label class="my_search lb" id="forum_big2"><input type="radio" class="pr" name="searchenhance"/>六维高清资源区</label></td><td><label class="my_search lb" id="forum_big3"><input type="radio" class="pr" name="searchenhance"/>六维普通资源区</label></td><td><label class="my_search lb" id="forum_big4"><input type="radio" class="pr" name="searchenhance"/>六维休闲娱乐区</label></td><td><label class="my_search lb" id="forum_big5"><input type="radio" class="pr" name="searchenhance"/>六维事务处理区</label></td><td><label class="my_search lb" id="forum_big6"><input type="radio" class="pr" name="searchenhance"/>六维内部交流区</label></td></tr><tr><td><label class="lb"><b>[资源区]</b></label></td><td><label class="my_search lb" id="forum_resource1"><input type="radio" class="pr" name="searchenhance"/>电影剧场</label></td><td><label class="my_search lb" id="forum_resource2"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="forum_resource3"><input type="radio" class="pr" name="searchenhance"/>综艺娱乐</label></td><td><label class="my_search lb" id="forum_resource4"><input type="radio" class="pr" name="searchenhance"/>体育天地</label></td><td><label class="my_search lb" id="forum_resource5"><input type="radio" class="pr" name="searchenhance"/>音乐地带</label></td><td><label class="my_search lb" id="forum_resource6"><input type="radio" class="pr" name="searchenhance"/>纪录写实</label></td></tr><tr><td></td><td><label class="my_search lb" id="forum_resource7"><input type="radio" class="pr" name="searchenhance"/>卡通动漫</label></td><td><label class="my_search lb" id="forum_resource8"><input type="radio" class="pr" name="searchenhance"/>游戏天下</label></td><td><label class="my_search lb" id="forum_resource9"><input type="radio" class="pr" name="searchenhance"/>资料文档</label></td><td><label class="my_search lb" id="forum_resource10"><input type="radio" class="pr" name="searchenhance"/>软件快跑</label></td><td><label class="my_search lb" id="forum_resource11"><input type="radio" class="pr" name="searchenhance"/>其他资源</label></td></tr></table><table bgcolor="#F0F0F0" cellspacing="0" cellpadding="0"><tr>----[小版块]----</tr><tr><td><label class="lb"><b>[电- -影]</b></label></td><td><label class="my_search lb" id="movie1"><input type="radio" class="pr" name="searchenhance"/>电影--资源区</label></td><td><label class="my_search lb" id="movie2"><input type="radio" class="pr" name="searchenhance"/>电影--高清</label></td><td><label class="my_search lb" id="movie3"><input type="radio" class="pr" name="searchenhance"/>电影--普清</label></td><td><label class="my_search lb" id="movie4"><input type="radio" class="pr" name="searchenhance"/>电影--所有</label></td></tr><tr><td><label class="lb"><b>[剧- -集]</b></label></td><td><label class="my_search lb" id="tvseries1"><input type="radio" class="pr" name="searchenhance"/>剧集--资源区</label></td><td><label class="my_search lb" id="tvseries2"><input type="radio" class="pr" name="searchenhance"/>剧集--高清</label></td><td><label class="my_search lb" id="tvseries3"><input type="radio" class="pr" name="searchenhance"/>剧集--普清</label></td><td><label class="my_search lb" id="tvseries4"><input type="radio" class="pr" name="searchenhance"/>剧集--合集</label></td><td><label class="my_search lb" id="tvseries5"><input type="radio" class="pr" name="searchenhance"/>高清剧集</label></td><td><label class="my_search lb" id="tvseries6"><input type="radio" class="pr" name="searchenhance"/>电视剧集</label></td><td><label class="my_search lb" id="tvseries7"><input type="radio" class="pr" name="searchenhance"/>剧集--所有</label></td></tr></table></div></td></tr>');
    }
    jq("label.my_search").click(function () {
        var spanid = jq(this).attr("id");
        jq("select#srchfid").val(value_of_forums[spanid]);
    });
    jq("p#showsearchenhance").click(function () {
        jq("div#mysearchbox").toggle();
    });
    // 帖子页面
    if (location.href.match(/thread-\d+-\d+-\d/) || location.href.match(/mod=viewthread\Stid=\d+/)) {
        if (ShowVideoRatioCalc && jq('div.pcb div.mtw.mbw').length) {
            jq('div#fj.y label').before('<label id="malvjisuan" class="z">计算=</label><input type="text" class="px p_fre z" size="2" id="malvzhi" title="码率估算" />');
        }
        if (jq('div.pob.cl:first em').length && jq('div.pcb div.mtw.mbw').length) {
            var seedid = location.href.match(/(thread-|tid=)(\d+)/)[2];
            var a_length = jq('div#pt div.z a').length - 2;
            var cat1 = jq('div#pt div.z a:eq(' + a_length + ')').attr("href").match(/(forum-|fid=)(\d+)/)[2];
            var index = 0;

            jq('div.pob.cl').each(function () {
                var seed_p = jq(this).find('p');
                // 常用链接
                if (ShowCommonLink) {
                    var quote_id = jq('div.pcbs:eq(' + index + ') table:first td:first').attr("id").match(/postmessage_(\d+)/)[1];
                    var link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&reppost=" + quote_id;
                    if (index > 0) {
                        link_reply = "http://bt.neu6.edu.cn/forum.php?mod=post&action=reply&fid=" + cat1 + "&extra=page%3D1&tid=" + seedid + "&repquote=" + quote_id;
                    }
                    index++;
                    var commonlink = "commonlink_" + index;

                    seed_p.find('a:first').before('<a href="javascript:;" id="' + commonlink + '" onmouseover="showMenu(this.id)" class="showmenu">常用链接</a>');
                    // 添加常用链接
                    var commonlink_string = '<ul id="' + commonlink + '_menu" class="p_pop mgcmn" style="display: none;"><li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/084832wh4p2z362amsf4mv.png) no-repeat 4px 50%;" target="_blank" href="' + link_reply + '">回复本帖高级</a></li>';
                    for (var key in common_links) {
                        commonlink_string = commonlink_string + "<li><a style=\"background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/104809kzjj6ujkzpv6j6uj.png) no-repeat 4px 50%;\" target=\"_blank\" href=\"" + common_links[key] + "\">" + key + "</a></li>";
                    }
                    commonlink_string = commonlink_string + "</ul>";
                    seed_p.after(commonlink_string);
                }
                // 搜索字幕
                if (ShowSubtitle) {
                    var tvname_cn = jq('title').text().match(/\[([\S\s]+?)[\/\]]/)[1];
                    if (null !== tvname_cn) {
                        var subtitle_id = "subtitle_" + index;
                        seed_p.find('a:first').before('<a href="javascript:;" id="' + subtitle_id + '" onmouseover="showMenu(this.id)" class="showmenu">搜索字幕</a>');
                        var subtitle_links = {
                            "ZIMUZU": "http://www.zimuzu.tv/search?keyword=" + encodeURI(tvname_cn),
                            "SHOOTER": "http://assrt.net/sub/?searchword=" + encodeURI(tvname_cn),
                            "Sub HD": "http://subhd.com/search/" + encodeURI(tvname_cn),
                            "ZIMUKU": "http://www.zimuku.net/search?ad=1&q=" + encodeURI(tvname_cn),
                            "ADDIC7ED": "http://www.addic7ed.com/",
                        };
                        var subtiltelink_string = '<ul id="' + subtitle_id + '_menu" class="p_pop mgcmn" style="display: none;">';
                        for (var key_sub in subtitle_links) {
                            subtiltelink_string = subtiltelink_string + '<li><a style="background: url(http://bt.neu6.edu.cn/data/attachment/forum/201609/29/062944dfdubs5f99gr5mzu.png) no-repeat 4px 50%;" target="_blank" href="' + subtitle_links[key_sub] + '">' + key_sub + '</a></li>';
                        }
                        subtiltelink_string = subtiltelink_string + "</ul>";
                        seed_p.after(subtiltelink_string);
                    }
                }
            });
        }
    }
    // 码率估算
    jq('#malvjisuan').click(function () {
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
        jq('span#custominfo').remove();
        jq('div.specialpost.s_clear div.pbt.cl input').attr('style', 'width: 52em');
        if (SeedTitleBigFont) {
            jq('span#subjectchk').remove();
            jq('#subject').attr('style', 'width: 70em;height: 1.5em;font-size: 1.45em');
        } else
            jq('#subject').attr('style', 'width: 70em'); //更改发种界面的输入框宽度
        jq('div#postbox').before('<div class="pbt cl"><div class="ftid"><span width="80">种子信息克隆：</span></div><div class="z"><span><input type="text" style="width:300px;" id="clone_from" class="px" placeholder="要克隆的种子编号链接" onkeypress="if(event.keyCode==13){clone_btn.click();}"></span><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子链接</span><span>]</span><span id="myformat" hidden>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="foramt_title" style="size:100px;" value="标题格式化"></span></div></div><div id="seedfilename" hidden="true" class="pbt cl"><div class="ftid"><span width="80">种子文件名称：</span></div><div class="z"><input  type="text" style="width:71.5em;" class="px" id="uploadseedname"></div></div>');
        //展开标签栏，预备填写
        jq('#extra_tag_b').addClass('a');
        jq('#extra_tag_c').css('display', 'block');
    }
    // 标题格式化
    jq('#foramt_title').click(function () {
        var forum_type = location.href.match(/fid=(\d+)/)[1];
        var t_str = jq('input[name=subject]').val();
        t_str = t_str.replace(/(\s+\[\s*|\s+\]\s*|\s*\]\s+|\s*\[\s+|\s+\/\s*|\s*\/\s+)/ig, function ($1) {
            return $1.replace(/\s/g, "");
        });
        t_str = t_str.replace(/\s/g, ".");
        if (forum_type == 14 || forum_type == 73 || forum_type == 77) {
            t_str = t_str.replace(/(\[\d+)P\//, "$1p/");
            t_str = t_str.replace(/(MP4|MKV|TS|ISO|RMVB|FLV|AVI|WEB-DL|WEB|HDTV)/ig, function ($1) {
                return $1.toUpperCase();
            });
        }
        jq('input[name=subject]').attr('value', t_str);
    });

    // 自动处理并复制种子文件名
    function seedname_copy() {
        jq("div#seedfilename").show();
        // 去掉路径
        var tname = jq("div.specialpost.s_clear input").val().replace(/.*\\([^\.\\]+)/g, "$1");
        tname = tname.replace(/(\.torrent$)/, "");
        tname = tname.replace(/(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.ts$)|(\.avi$)|(\.iso$)/i, "");
        // 空格替换为.
        tname = tname.replace(/(\s)/g, ".");
        var tname_copy = tname;
        // 去掉: [发布组]
        tname = tname.replace(/(\.*\[\S+\]\.*)*/, "");
        // 去掉开头与结尾的.
        tname = tname.replace(/(^\.*)|(\.*$)/g, "");
        if (tname) {
            jq("input#uploadseedname").val(tname);
            var torrenttype = location.href.match(/fid=(\d+)/)[1];
            var en_name = tname.match(/\w[-￡@\'\w\.]+/)[0];
            if (en_name && ((torrenttype == 48 && en_name.match(/Ep?\d+/i)) || torrenttype == 13 || torrenttype == 45)) {
                var t = jq('input[name=subject]').val().replace(/\]\[[^\]]+/, "][" + en_name);
                jq('input[name=subject]').attr('value', t);
            }
        } else
            jq("input#uploadseedname").val(tname_copy);
    }

    //AutoAdd处理部分内容
    function numatostring2(num) {
        return (num < 10) ? ("0" + num) : (num.toString());
    }

    function leapyear(year) {
        return ((year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0)));
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

    jq('#clone_btn').click(function () {
        var copy_link = jq('#clone_from').val().trim();
        var info = jq('#clone_info');
        if (/^\d+$/.test(copy_link) || copy_link.match(/bt\.neu6\.edu\.cn/)) {
            var seedtype = location.search.match(/fid=(\d+)/)[1];
            var seedfrom = (/^\d+$/.test(copy_link)) ? copy_link : copy_link.match(/(thread-|tid=)(\d+)/)[2];
            if (/^\d+$/.test(seedfrom)) {
                // 如果输入了有效的编号，开始读取对应的种子页面
                info.text('正在读取');
                jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function (resp) {
                    var i = 0;
                    info.text('正在分析');
                    var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0].replace(/来自群组: <a[\s\S]*?a>/, "");
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
                                var dayofmonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                                var year = fields[0].substring(1, 5);
                                var month = fields[0].substring(5, 7);
                                var day = fields[0].substring(7, 9);
                                if (leapyear(parseInt(year))) {
                                    dayofmonths[1] += 1;
                                }
                                var monthadd = parseInt((parseInt(day) + 7) / dayofmonths[parseInt(month) - 1]);
                                day = numatostring2((parseInt(day) + 7) % dayofmonths[parseInt(month) - 1]);
                                var yearadd = 0;
                                if ((parseInt(month) + monthadd) > 12) {
                                    yearadd = 1;
                                }
                                year = parseInt(year) + yearadd;
                                month = numatostring2((parseInt(month) + monthadd) % 12);
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
                    //填写分类
                    var oldtype = page.find('a#newspecial').attr("onclick").match(/fid=(\d+)/)[1];
                    var newtype = location.href.match(/fid=(\d+)/)[1];
                    if (page.find("h1.ts a").length) {
                        var movietype = page.find("h1.ts a").text().replace(/^\[|\]$/g, '');
                        var typeid = page.find("h1.ts a").attr("href").match(/typeid=(\d+)/)[1];
                        // 如果发布种子与引用的种子的版块不一样
                        if (oldtype != newtype) {
                            var type_id_name = {
                                "48": {
                                    "247": "大陆",
                                    "248": "港台",
                                    "249": "其他1",
                                    "250": "其他2",
                                    "251": "其他",
                                    "252": "版务公告"
                                },
                                "77": {
                                    "178": "大陆",
                                    "179": "港台",
                                    "180": "其他1",
                                    "181": "其他2",
                                    "182": "其他"
                                },
                                "14": {
                                    "101": "大陆",
                                    "102": "港台",
                                    "103": "其他1",
                                    "104": "其他2",
                                    "105": "其他",
                                    "106": "版务公告"
                                },
                                "73": {
                                    "298": "大陆",
                                    "299": "港台",
                                    "300": "其他1",
                                    "301": "其他2",
                                    "302": "其他",
                                    "303": "版务公告"
                                },
                                "45": {
                                    "231": "大陆",
                                    "232": "港台",
                                    "233": "日韩",
                                    "234": "欧美",
                                    "235": "其他",
                                    "236": "版务公告"
                                },
                                "13": {
                                    "94": "大陆",
                                    "95": "港台",
                                    "96": "日韩",
                                    "97": "欧美",
                                    "98": "其他",
                                    "99": "版务公告",
                                    "100": "移动视频"
                                }
                            };
                            var matched = false;
                            for (var k in type_id_name[newtype]) {
                                if (movietype == type_id_name[newtype][k]) {
                                    typeid = k;
                                    matched = true;
                                    break;
                                }
                            }
                            typeid = (matched) ? typeid : 0;
                        }
                        if (movietype && typeid) {
                            jq('#typeid_ctrl_menu li').removeClass('current');
                            jq('#typeid_ctrl').html(movietype);
                            jq('#typeid>option').val(typeid);
                        }
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
                    //图片移除
                    if (AutoImgRemove && descr.find('img')) {
                        if (seedtype == 16 && descr.find('img').length >= 1)
                            descr.find('img:last').remove();
                        else if (descr.find('img').length > 1) {
                            descr.find('img:last').remove();
                        }
                    }
                    //图片处理（对上传的图片）
                    descr.find('ignore_js_op').each(function () {
                        var img = jq(this).find('img:first');
                        //借用file属性信息修正引用过程中出错的src信息
                        img.attr('src', 'http://bt.neu6.edu.cn' + img.attr('file'));
                        //移除引用过程中原图片无用的img属性
                        img.removeAttr('file id aid zoomfile class inpost onmouseover onclick');
                        var hideimg = img.parent('ignore_js_op'); //移动img结点
                        img.insertAfter(hideimg);
                    });
                    descr.find('img:first').removeAttr('id zoomfile onmouseover onclick');
                    //代码部分处理
                    descr.find('div.quote').remove();
                    descr.find('.blockcode').remove();
                    descr.find('blockcode').remove();
                    //移除含有图片或附件的父节点
                    descr.find('ignore_js_op').remove();
                    //填写内容 公告 announcement
                    var m_am = jq('#e_textarea').html().match(/(\Stable[\s\S]+\/table\S)/);
                    if (m_am) {
                        descr.find('table:first').remove();
                        jq('#e_iframe').contents().find('body').html(bbcode2html(m_am[1]) + descr.html());
                    } else {
                        jq('#e_iframe').contents().find('body').html(descr.contents());
                    }
                    // var contextinfo = jq('#e_textarea').html();
                    // var m_am = contextinfo.match(/\[align=center\]\[table=[\s\S]+?\[\/table\][\s\S]+?\[\/align\]/);
                    // var announcement = m_am ? m_am : contextinfo.match(/\[table=[\s\S]+?\[\/table\]/);
                    // if (announcement) {
                    // 	if (descr.find('div[align=center]:first table').length)
                    // 		descr.find('div[align=center]:first').remove();
                    // 	else
                    // 		descr.find('table:first').remove();
                    // 	jq('#e_iframe').contents().find('body').html(bbcode2html(announcement[0]) + descr.html());
                    // } else {
                    // 	jq('#e_iframe').contents().find('body').html(descr.contents());
                    // }
                    //填写标签
                    var tag = [];
                    page.find('div.ptg.mbm.mtn a').each(function () {
                        var tagtemp = jq(this).text();
                        tag.push(tagtemp);
                    });
                    var tag_fin = tag[0];
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
        } else {
            info.text("不支持的链接...");
        }
    });

    jq(document).ready(function () {
        jq("div.specialpost.s_clear input").bind("change", seedname_copy);
        if (SearchEnhanceDefaultShow) {
            jq("div#mysearchbox").show();
        }
        var match = location.href.match(/#clone_(\d+)/);
        if (match) {
            jq('#clone_from').val(match[1]);
            var link = location.href.substring(0, 64);
            history.pushState("", document.title, link);
            jq('#clone_btn').click();
        }

        if (ShowFromat) {
            jq('span#myformat').show();
        }
    });

})();