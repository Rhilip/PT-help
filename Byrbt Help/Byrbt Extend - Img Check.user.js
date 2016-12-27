// ==UserScript==
// @name         Byrbt : Img Check
// @namespace    http://blog.rhilip.info
// @version      20161121
// @description  检查外链图片、未完全显示的图片数目
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @grant        none
// ==/UserScript==

$(document).ready(function(){

    var infoNode = $("div#kdescr");

    var totalimg = infoNode.find("img").length;
    var unupimg =infoNode.find("img[src*='file:///']").length;
    var outimg = totalimg - infoNode.find("img[src*='ckfinder']").addClass("Inbyrimg").length;

    infoNode.closest("tr").before('<tr><td class="rowhead" valign="top">图片检查</td><td class="rowfollow" align="left" valign="top"><table border="0" cellspacing="0"><tbody><tr><td class="embedded">该种子简介共用 <span id="totalimg"><b>' + totalimg + '</b></span> 张图片，其中 <span id="outimg"><b>' + outimg + '</b></span> 张外链图<span id="unupimghide" style="display:none">（含本地未上传图片 <span id="localimg"><b>'+ unupimg +'</b></span> 张）</span></td></tr></tbody></table></td></tr>');
    if(outimg) {
        $('span#outimg').attr("style","color:#ff0000;");
        if (unupimg) {
            $('span#unupimghide').attr("style", "inline-block;color:#ff0000;");
        }
    }
});

/**
 * Created by Rhilip on 2016/11/21.
 */
