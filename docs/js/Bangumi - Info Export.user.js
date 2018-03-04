// ==UserScript==
// @name         Bangumi Info Export
// @namespace    blog.rhilip.info
// @version      20180304
// @description  Export Anime Info form Bangumi as BBCode or Html
// @author       Rhilip
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/subject\//
// @require      http://cdn.bootcss.com/simplemodal/1.4.4/jquery.simplemodal.min.js
// @grant        GM_setClipboard
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Bangumi%20-%20Info%20Export.user.js
// ==/UserScript==

////////////////////////////////////////////////////////////////
// 以下为自定义输出参数，请按照说明修改
const STAFFSTART = 4;                 // 读取Staff栏的起始位置（假定bgm的顺序为中文名、话数、放送开始、放送星期... ，staff从第四个 导演 起算）；初始值为 4
const STAFFNUMBER = 9;                // 读取Staff栏数目；初始9，可加大，溢出时按最大可能的staff数读取，如需读取全部请设置值为 Number.MAX_VALUE (或一个你觉得可能最大的值 eg.20)
const MENU = ["STORY : ", "STAFF : ", "CAST : "];   //输出Menu控制(大小写？)
const UBB = {                          // !--预设BBCode生成样式
    before: "[b]",                    // before && after 放在 MENU字段 前后
    after: "[/b]",                    // 请保证before after 自闭合
    linedivision: "\n",              //行间分割控制
    sectiondivision: "\n\n"           //段间分割控制
};
const HTML = {                         // !--预设Html生成样式
    before: "<font color=\"#008080\" face=\"Impact\" size=\"5\" style=\"margin: 0px; padding: 0px; word-wrap: break-word;\">",
    after: '</font>',
    linedivision: "<br>",
    sectiondivision: "<br><br>"
};
const OUTFORMAT = "UBB";               //默认输出格式（在不点击输出格式的情况下）；初始UBB，可选 "HTML" "NONE"(不自动生成，点击输出)
////////////////////////////////////////////////////////////////

// Begin~
$(document).ready(function () {
    //创建初始交互按钮
    $("div#headerSubject > div > ul >li:last").after("<div id=\"output\" class=\"rr\"><a>导出Bamgumi简介</a></div>");

    //数据获取
    var img = $("div#bangumiInfo > div > div:nth-child(1) > a > img").attr("src");
    var story = $("div#subject_summary").text();             //Story
    var raw_staff = [], staff_box = $("ul#infobox");        //Staff
    for (var staff_number = STAFFSTART; staff_number < Math.min(STAFFNUMBER + STAFFSTART, staff_box.children("li").length); staff_number++) {
        raw_staff[staff_number - STAFFSTART] = staff_box.children("li").eq(staff_number).text();
        //console.log(raw_staff[staff_number]);
    }
    var raw_cast = [], cast_box = $("ul#browserItemList");      //Cast
    for (var cast_number = 0; cast_number < cast_box.children("li").length; cast_number++) {    //cast_box.children("li").length
        var cast_name = cast_box.children("li").eq(cast_number).find("span.tip").text();
        if (!(cast_name.length)) {     //如果不存在中文名，则用cv日文名代替
            cast_name = cast_box.children("li").eq(cast_number).find("div > strong > a").text().replace(/(^\s*)|(\s*$)/g, "");   //#browserItemList > li > div > strong > a
        }
        var cv_name = cast_box.children("li").eq(cast_number).find("span.tip_j > a").text();
        raw_cast[cast_number] = cast_name + ' : ' + cv_name;
        //console.log(raw_cast[cast_number]);
    }
    var base_link = window.location.href;     //Base link

    $("div#output").click(function () {
        //创建输出窗口
        $.modal('<div id="Out_window" style="box-shadow:0px 0 15px #AAA;margin:0;border:2px;border-radius:0px 0px 10px 10px;">' +
            '<div id="Out_Title"><div id="Out_ajaxWindowTitle">Bangumi信息导出</div><div id="Out_closeWindowButton" title="close" class="simplemodal-close">X 关闭</div></div>' +  //<div id="Out_closeAjaxWindow"><small>Esc键可以快速关闭</small></div>
            '<div id="Out_Content"><div class="collectBox clearit"><form id="Out_BoxForm" name="OutBoxForm"><div class="cell"><div class="tagList"><span class="tip_j ll">导出格式：</span><div class="inner">' +
            '<a class="btnGray" id="OuttoUBB">BBcode</a><a class="btnGray" id="OuttoHtml">Html</a>' +
            '</div></div></div>' +
            '<hr />' +
            '<div class="cell"><textarea name="Out_text" id="Out_text" cols="32" rows="20" class="quick"></textarea></div></form></div></div>' +
            '</div>', {                    // !-- SimpleModal插件属性
            //containerCss:{"margin-left": "-265px","width": "530px","margin-top": "-195px","display":"block"},
            autoPosition: true,         // 自动定位
            zIndex: 102,
            escClose: true,             //按ESC关闭模态窗口
            overlayClose: true          //按overlay（遮罩层）关闭模态窗口

        });
        //仿照Bgm的修改窗口添加样式（待进一步完善）
        $("#Out_window").css({"background": "#fff","color": "#000","text-align": "left","top": "50%","left": "50%"});
        $("#Out_Title").css({"background": "#e8e8e8 url(/img/bangumi/bangumi_ui_1.png) repeat-x scroll 0 -113px","height": "30px","color": "#FFF","position": "relative"});
        $("#Out_ajaxWindowTitle").css({"float": "left","padding": "0 15px","line-height": "30px","font-size": "13px"});
        $("#Out_closeWindowButton").css({"color": "#FFF","text-indent": "-9999px","background": "url(/img/ico/closebox.png)","width": "30px","height": "30px", "cursor": "pointer","position": "absolute","top": "-12px","right": "-12px"});

        //生成输出信息
        var outTextBox = $("#Out_text").click(function () {
            $(this).select();                                         //输出栏绑定 点击全选 事件
        });

        var toUBBbtn = $("#OuttoUBB").click(function () {                //BBCode
            var outubb = //"[img]" + img + "[/img]" + UBB.sectiondivision +
                UBB.before + MENU[0] + UBB.after + UBB.linedivision +
                story + UBB.sectiondivision +
                UBB.before + MENU[1] + UBB.after + UBB.linedivision +
                raw_staff.join(UBB.linedivision) + UBB.sectiondivision +
                UBB.before + MENU[2] + UBB.after + UBB.linedivision +
                raw_cast.join(UBB.linedivision) + UBB.sectiondivision +
                "(来源于" + base_link + ")" + UBB.linedivision;
            outTextBox.val(outubb).select();                           //向输出框填入合成的BBcode代码并自动全选
            GM_setClipboard(outubb);
        });

        var toHtmlbtn = $("#OuttoHtml").click(function () {              //Html
            var outhtml = //"<img src='" + img +"'>" + HTML.sectiondivision +
                HTML.before + MENU[0] + HTML.after + HTML.linedivision +
                story + HTML.sectiondivision +
                HTML.before + MENU[1] + HTML.after + HTML.linedivision +
                raw_staff.join(HTML.linedivision) + HTML.sectiondivision +
                HTML.before + MENU[2] + HTML.after + HTML.linedivision +
                raw_cast.join(HTML.linedivision) + HTML.sectiondivision +
                "(来源于" + base_link + ")" + HTML.linedivision;
            outTextBox.val(outhtml).select();
            GM_setClipboard(outhtml);
        });

        switch (OUTFORMAT) {
            case "NONE" :
                break;
            case "UBB" :
                toUBBbtn.click();
                break;
            case "HTML" :
                toHtmlbtn.click();
                break;
        }
    });
});

/**
 * Created by Rhilip on 2016/12/21.
 * version:
 *   20161222 写出了第一个版本的，大体实现了原来想要的所有功能。
 *   20170105 发现没有开启点击遮罩层关闭窗口的功能，补上。其他没变~
 *   20170722 使用GM_setClipboard在输出时直接复制到剪贴板中。
 *   20180109 修正一个未启用的功能的typeerror。
 */
