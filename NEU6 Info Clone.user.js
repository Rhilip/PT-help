// ==UserScript==
// @name         NEU6 Info Clone
// @namespace    http://rhilip.info/
// @author       Rhilip,baishuangxing
// @description  一键复制六维已有种子的信息
// @grant        none
// @include      http://bt.neu6.edu.cn*/search.php*
// @include      http://bt.neu6.edu.cn*/forum*
// @include      http://bt.neu6.edu.cn/forum.php?mod=post&action*
// @require      http://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @icon         http://bt.neu6.edu.cn/favicon.ico
// @supportURL   http://bt.neu6.edu.cn/thread-1555682-1-1.html
// @version      1.1.1(20160920)
// ==/UserScript==

// 脚本控制选项(1为开启，0为关闭)
var signaltoquote = 1; //为种子信号图标添加点击事件，点击信号图标自动跳转并填写
var autoadd = 1; //实现剧集自动增加集数；动漫自动增加集数；综艺自动增加时间，删除节目内容
var delimginetm = 1; //移除综艺娱乐版块的图片；保留全部游戏天下图片

// 脚本预处理阶段
var jq = jQuery.noConflict(); //因为引入jQuery库，为防止与Discuz!冲突，更改默认指示符$为jq(让出对$的控制权)

(function() {
    //将种子界面和搜索界面的信号强度改为引用发布的入口
    if (signaltoquote) {
        // 各板块列表
        if (jq('table#threadlisttableid').length) {
            var cat = location.href.substring(28, 30);
            jq("table#threadlisttableid tbody:gt(0)").each(function() {
                var tbody = jq(this);
                var id = 0;
                if (typeof(tbody.attr('id')) != "undefined") {
                    id = tbody.attr('id').substring(12);
                }
                var size = 0;
                if (tbody.find('tr td').length > 3) {
                    size = parseInt(tbody.find('tr td:eq(3)').text());
                }
                if (!(size < 1 || id === 0 || tbody.attr("id") == "separatorline")) {
                    var link = "http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id;
                    if (tbody.find('tr td:eq(1) img').length) {
                        tbody.find('tr td:eq(1) img').click(function() {
                            window.open(link);
                        });
                    } else if (tbody.find('tr td:eq(2) img').length) {
                        tbody.find('tr td:eq(2) img').click(function() {
                            window.open(link);
                        });
                    }

                }
            });
        }
        // 搜索页面
        if (jq('table.dt').length) {
            jq('table.dt tr:gt(0)').each(function() {
                var tr = jq(this);
                var cat = tr.find('td:eq(4) a').attr('href').match(/forum-(\d+)-1/)[1];
                var id = tr.find('td:eq(2) a').attr('href').match(/thread-(\d+)-1/)[1];
                var link = "http://bt.neu6.edu.cn/forum.php?mod=post&action=newthread&fid=" + cat + "#clone_" + id;
                if (tr.find('td:eq(0) img').length) {
                    tr.find('td:eq(0) img').click(function() {
                        window.open(link);
                    });
                }
            });
        }
    }

    // 对发种界面的修改
    if (location.pathname == '/forum.php') {
        jq('#subject').attr('style','width: 70em');         //更改发种界面的输入框宽度
        //jq('#custominfo_pmenu').hide();                   //隐藏发种界面右端提示信息
        // 在表单中添加一行，用于本脚本和用户交互（增加引用栏、得到引用网址）
        jq('div#postbox').before('<div class="pbt cl"><div class="ftid"><span width="80">种子信息克隆：</span></div><div class="z"><span><input type="text" style="width:300px;" id="clone_from" class="px" placeholder="要克隆的种子编号或者链接" onkeypress="if(event.keyCode==13){clone_btn.click();}"></span><input type="button" id="clone_btn" style="size:100px;" value=" 克   隆 ">&nbsp;&nbsp;&nbsp;&nbsp;<span>[克隆状态：</span><span id="clone_info">请输入要克隆的种子编号或者链接</span><span>]</span></div></div>');
        //展开标签栏，预备填写
        jq('#extra_tag_b').addClass('a');
        jq('#extra_tag_c').css('display', 'block');
    }

    //Autoadd处理部分内容
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

    function tvseasonhandle(str) {
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
                aaatv[0] = numatostring2(parseInt(aaatv[1]) + 1);
                aaatv[1] = numatostring2(parseInt(aaatv[0]) + 1);
            }
            if (bbbtv && bbbtv.length == 1)
                str = aaatv[0] + bbbtv[0] + aaatv[1];
            else if (bbbtv && bbbtv.length == 2)
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1];
            else if (bbbtv && bbbtv.length == 3)
                str = bbbtv[0] + aaatv[0] + bbbtv[1] + aaatv[1] + bbbtv[2];
        }
        return str;
    }

    jq('#clone_btn').click(function() {
        // 获取要克隆的种子编号
        var seedtype = location.search.match(/fid=(\d+)/)[1];
        var seedfrom = jq('#clone_from').val().trim();
        var info = jq('#clone_info');
        var match = seedfrom.match(/thread-(\d+)/);
        if (match !== null) {
            seedfrom = match[1];
        }
        if (/^\d+$/.test(seedfrom)) {
            // 如果输入了有效的编号，开始读取对应的种子页面
            info.text('正在读取');
            jq.get('http://bt.neu6.edu.cn/thread-' + seedfrom + '-1-1.html', function(resp) {
                var i = 0;
                info.text('正在分析');
                var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                var page = jq(body); // 构造 jQuery 对象，用于后期处理
                var title = page.find("span#thread_subject").text();
                if (!title) {
                    info.text('失败，可能由于种子不存在或者网络问题');
                    return;
                }
                //Autoadd实现部分内容
                if (autoadd) {
                    if (seedtype == 48) { //高清剧集
                        var tv_name = title.match(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/);
                        if (tv_name) {
                            var tv_season = tvseasonhandle(tv_name[0]);
                            title = title.replace(/[\s\.][ES][P]{0,1}\d{2}[-\w]*\d{0,2}[\s\.]/, tv_season);
                        }
                    } else if (seedtype == 14) { //电视剧集
                        var tv_name1 = title.match(/\[[ES][P]{0,1}\d{2}[-\w]*\d{0,2}\]/);
                        if (tv_name1) {
                            var tv_season1 = tvseasonhandle(tv_name1[0]);
                            title = title.replace(/\[[ES][P]{0,1}\d{2}[-\w]*\d{0,2}\]/, tv_season1);
                        }
                    } else if (seedtype == 44) { //动漫
                        var tv_name2 = title.match(/\[[ES]{0,1}\d{0,3}[-\w]*\d{0,2}\]/);
                        if (tv_name2) {
                            var tv_season2 = tvseasonhandle(tv_name2[0]);
                            title = title.replace(/\[[ES]{0,1}\d{0,3}[-\w]*\d{0,2}\]/, tv_season2);
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
                // jq("#typeid").val(115);
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
                  img.attr('src','http://bt.neu6.edu.cn'+img.attr('file'));
                  img.removeAttr('file');
                  var hideimg = img.parent('ignore_js_op'); //移动img结点
                  img.insertAfter(hideimg);
                });
                //移除综艺娱乐版块的图片；保留全部游戏天下图片
                if (delimginetm && descr.find('img')) {
                    if (seedtype == 16 && descr.find('img').length == 1) {
                        descr.find('img').remove();
                    } else if (seedtype == 21) {
                        jq.noop();
                    } else {
                        descr.find('img:gt(0)').remove();
                    }
                }
                //代码部分处理
                if (descr.find('.blockcode')) {
                    descr.find('.blockcode').remove();
                }
                descr.find('ignore_js_op').remove(); //移除含有图片或附件的父节点
                //填写内容
                jq('#e_iframe').contents().find('body').html(descr.contents());
                //填写标签
                var tag = new Array();
                page.find('div.ptg.mbm.mtn a').each(function() {
                    var tagtemp = jq(this).text();
                    tag.push(tagtemp);
                });
                var tag_fin = "";
                tag_fin = tag[0];
                if (tag.length > 1) {
                    for (i = 1; i < tag.length - 1; i++) {
                        tag_fin = tag_fin + "," + tag[i];
                    }
                }
                jq('#tags').val(tag);
                info.text('克隆完成');
            });
        } else {
            info.text('请输入有效的种子编号或者链接...');
        }
    });

    jq(document).ready(function() {
        var match = location.href.match(/#clone_(\d+)/);
        if (match) {
            jq('#clone_from').val(match[1]);
            var link = location.href.substring(0, 64);
            history.pushState("", document.title, link);
            jq('#clone_btn').click();
        }
        var match1 = location.href;
        if (match1.length > 72 && match1[71] == "_") {
            var id = match1.substring(72);
            var link1 = match1.substring(0, 64);
            jq('#clone_from').val(id);
            history.pushState("", document.title, link1);
            jq('#clone_btn').click();
        }
    });

})();
