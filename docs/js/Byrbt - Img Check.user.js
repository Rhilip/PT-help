// ==UserScript==
// @name         Byrbt : Img Check
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  检查外链图片、未完全显示的图片数目
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php?id=*
// @match        http*://bt.byr.cn/offers.php?id=*
// @icon         http://bt.byr.cn/favicon.ico
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Img%20Check.user.js
// ==/UserScript==

$(document).ready(function () {

    var infoNode = $("div#kdescr");

    var totalimg = infoNode.find("img").length;

    infoNode.find("img[src*='file:///']").addClass("Unupimg");    // 未完成上传的图片
    infoNode.find("img[src^='data:image']").addClass("Unupimg");  // 使用Base64编码的图片
    var unupimg = infoNode.find("img.Unupimg").length;

    infoNode.find("img[src*='byr.cn']").addClass("Inbyrimg");     // 域名在byr的图片
    infoNode.find("img[src*='ckfinder']").addClass("Inbyrimg");   // 为以防万一，使用相对地址的图片
    var outimg = totalimg - infoNode.find("img.Inbyrimg").length;

    infoNode.closest("tr").before('<tr><td class="rowhead" valign="top">图片检查</td><td class="rowfollow" align="left" valign="top">该种子简介共用 <span id="totalimg"><b>' + totalimg + '</b></span> 张图片，其中可能有 <span id="outimg"><b>' + outimg + '</b></span> 张外链图<span id="unupimghide" style="display:none">（其中含本地未上传或以Base64编码的图片 <span id="localimg" style="color:#ff0000;"><b>' + unupimg + '</b></span> 张）</span><span id="img_check" style="display: none"> <- 这个判断很傻，如存在外链图请根据下表再次核对。<hr><table id="img_check_table" style="table-layout:fixed ; width:100%"></table></span></td></tr>');
    if (outimg) {
        $('span#outimg').attr("style", "color:#ff0000;");
        if (unupimg) {
            $('span#unupimghide').show();
        }

        var table_html = "";
        infoNode.find("img").each(function () {
            var src = $(this).attr("src");
            table_html += "<tr><td style='overflow:hidden; text-overflow:ellipsis;'>" + src + "</td></tr>";
        });
        $("table#img_check_table").html(table_html);
        $("span#img_check").show();
    }
});

/**
 * Created by Rhilip on 2016/11/21.
 * Update history:
 *   2017.10.15 更新判断逻辑（时隔将近一年之后233333）
 *   2017.10.14 在可能存在外链图的情况下，通过表格显示所有使用的图片的链接。
 */
