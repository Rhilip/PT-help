// ==UserScript==
// @name         Bangumi Info Export
// @namespace    blog.rhilip.info
// @version      20180306
// @description  Export Anime Info form Bangumi as BBCode or Html
// @author       Rhilip
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/subject\//
// @grant        GM_setClipboard
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Bangumi%20-%20Info%20Export.user.js
// ==/UserScript==

////////////////////////////////////////////////////////////////
// 以下为自定义输出参数，请按照说明修改
const STAFFSTART = 4;                 // 读取Staff栏的起始位置（假定bgm的顺序为中文名、话数、放送开始、放送星期... ，staff从第四个 导演 起算）；初始值为 4
const STAFFNUMBER = 9;                // 读取Staff栏数目；初始9，可加大，溢出时按最大可能的staff数读取，如需读取全部请设置值为 Number.MAX_VALUE (或一个你觉得可能最大的值 eg.20)
const MENU = ["STORY : ", "STAFF : ", "CAST : "];   //输出Menu控制(大小写？)
const STYLE = {
    "UBB": {                          // !--预设BBCode生成样式
    before: "[b]",                    // before && after 放在 MENU字段 前后
    after: "[/b]",                    // 请保证before after 自闭合
    linedivision: "\n",              //行间分割控制
    sectiondivision: "\n\n"           //段间分割控制
    },
    "HTML": {                         // !--预设Html生成样式
    before: "<font color=\"#008080\" face=\"Impact\" size=\"5\" style=\"margin: 0px; padding: 0px; word-wrap: break-word;\">",
    after: '</font>',
    linedivision: "<br>",
    sectiondivision: "<br><br>"
    }
};
const OUTFORMAT = "UBB";               //默认输出格式（在不点击输出格式的情况下）；初始UBB，可选 "HTML" "NONE"(不自动生成，点击输出)
////////////////////////////////////////////////////////////////

// Begin~
$(document).ready(function () {
    // 创建初始交互按钮与交互窗口
    $("div#headerSubject > div > ul >li:last").after("<div id=\"output\" class=\"rr\"><a class=\"infogen\" title=\"导出Bamgumi简介\"  href=\"#TB_inline?tb&height=500&width=500&inlineId=gen\">导出Bamgumi简介</a></div>");
    $('<div style="display:none;" id="gen"><div class="bibeBox" style="padding:10px"><div class="tagList"><span>导出格式：</span><div class="inner"><a class="btnGray" id="OuttoUBB" data-style="UBB">BBcode</a>&nbsp;&nbsp;<a class="btnGray" id="OuttoHtml" data-style="HTML">Html</a></div></div><textarea name="Out_text" id="Out_text" cols="32" rows="20" class="quick" onclick="$(this).select()"></textarea></div></div>').insertBefore('#output');
    tb_init('a.infogen');  //Re-init the element we just inserted.

    //数据获取
    var img = $("div#bangumiInfo > div > div:nth-child(1) > a > img").attr("src").replace(/cover\/[lcmsg]/, "cover/l");
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

    //生成输出信息
    $("a[id^='Outto']").click(function () {
        var style = $(this).attr("data-style");
        var descr = ((style === "UBB") ? ("[img]" + img + "[/img]") : ("<img src='" + img + "'>")) + STYLE[style].sectiondivision +
            STYLE[style].before + MENU[0] + STYLE[style].after + STYLE[style].linedivision +
            story + STYLE[style].sectiondivision +
            STYLE[style].before + MENU[1] + STYLE[style].after + STYLE[style].linedivision +
            raw_staff.join(STYLE[style].linedivision) + STYLE[style].sectiondivision +
            STYLE[style].before + MENU[2] + STYLE[style].after + STYLE[style].linedivision +
            raw_cast.join(STYLE[style].linedivision) + STYLE[style].sectiondivision +
            "(来源于 " + window.location.href + " )" + STYLE[style].linedivision;
        $("#Out_text").val(descr).select();              // 向输出框填入合成的信息并自动全选
        GM_setClipboard(descr);                          // 向剪贴板输出合成的信息
    });

    $('#Outto' + OUTFORMAT).click();
});

/**
 * Created by Rhilip on 2016/12/21.
 * version:
 *   20161222 写出了第一个版本的，大体实现了原来想要的所有功能。
 *   20170105 发现没有开启点击遮罩层关闭窗口的功能，补上。其他没变~
 *   20170722 使用GM_setClipboard在输出时直接复制到剪贴板中。
 *   20180109 修正一个未启用的功能的typeerror。
 *   20180305 使用Bangumi自带的tb_init来生成浮动窗口
 */
