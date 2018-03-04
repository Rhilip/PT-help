// ==UserScript==
// @name         Byrbt : Quote in CKEditor
// @namespace    http://blog.rhilip.info
// @version      20180304
// @description  为BYRBT的编辑器添加代码（code）引用框
// @author       Rhilip
// @match        http*://bt.byr.cn/edit.php*
// @match        http*://bt.byr.cn/upload.php*
// @icon         http://bt.byr.cn/favicon.ico
// @require      https://cdn.bootcss.com/simplemodal/1.4.4/jquery.simplemodal.min.js
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/Byrbt%20-%20Quote%20in%20CKEditor.user.js
// ==/UserScript==

const DEFAULT_STYLE = [
    {
        "name": "类似其他PT站的代码格式",
        "style": "<div class=\"codetop\" style=\"padding: 3px; font-weight: bold; margin: 0 auto;\">{0}</div><div class=\"codemain\" style=\"font-family: Consolas; border-width: 1px; border-style: solid; padding: 6px; margin: 0 auto;\">{1}</div>",
    }, {
        "name": "类似其他PT站的引用格式",
        "style": "<fieldset><legend><b>{0}</b></legend><div style=\"font-family: Consolas;\">{1}</div></fieldset>",
    }, {
        "name": "@DoxHead个人美化版",
        "style": "<fieldset style=\"font-family: Consolas;\"><legend><span style=\"color:#ffffff;background-color:#000000;\">&nbsp;{0}&nbsp;</span></legend>{1}</fieldset>",
        "checked": true
    }, {
        "name": "类似TTG的引用格式",
        "style": "<div class=\"sub\"><b>{0}</b></div><table border=\"1\" cellpadding=\"6\" cellspacing=\"0\" style=\"background-color:#5a5;\"><td style=\"font-family: Consolas; border: 1px black dotted\">{1}</td></table>",
    }, {
        "name": "本站块引用增强",
        "style": "<blockquote style=\"box-sizing: border-box; padding: 8px; margin: 5px; font-size: small; border-width: 1px 1px 1px 5px; border-style: solid;\"><p style=\"box-sizing: border-box; margin: 0px 0px 10px;\">{0}</p><div style=\"font-family: Consolas;\">{1}</div></blockquote>",
    }, {
        "name": "本站表格增强",
        "style": "<table width=\"100%\"><tbody><tr><td class=\"colhead\">{0}</td></tr><tr><td><div style=\"font-family: Consolas;\">{1}</div></td></tr></tbody></table>",
    }
];

const CODE_IMG = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDUyMi40NjggNTIyLjQ2OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTIyLjQ2OCA1MjIuNDY5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMyNS43NjIsNzAuNTEzbC0xNy43MDYtNC44NTRjLTIuMjc5LTAuNzYtNC41MjQtMC41MjEtNi43MDcsMC43MTVjLTIuMTksMS4yMzctMy42NjksMy4wOTQtNC40MjksNS41NjhMMTkwLjQyNiw0NDAuNTMgICAgYy0wLjc2LDIuNDc1LTAuNTIyLDQuODA5LDAuNzE1LDYuOTk1YzEuMjM3LDIuMTksMy4wOSwzLjY2NSw1LjU2OCw0LjQyNWwxNy43MDEsNC44NTZjMi4yODQsMC43NjYsNC41MjEsMC41MjYsNi43MS0wLjcxMiAgICBjMi4xOS0xLjI0MywzLjY2Ni0zLjA5NCw0LjQyNS01LjU2NEwzMzIuMDQyLDgxLjkzNmMwLjc1OS0yLjQ3NCwwLjUyMy00LjgwOC0wLjcxNi02Ljk5OSAgICBDMzMwLjA4OCw3Mi43NDcsMzI4LjIzNyw3MS4yNzIsMzI1Ljc2Miw3MC41MTN6IiBmaWxsPSIjOTFEQzVBIi8+CgkJPHBhdGggZD0iTTE2Ni4xNjcsMTQyLjQ2NWMwLTIuNDc0LTAuOTUzLTQuNjY1LTIuODU2LTYuNTY3bC0xNC4yNzctMTQuMjc2Yy0xLjkwMy0xLjkwMy00LjA5My0yLjg1Ny02LjU2Ny0yLjg1NyAgICBzLTQuNjY1LDAuOTU1LTYuNTY3LDIuODU3TDIuODU2LDI1NC42NjZDMC45NSwyNTYuNTY5LDAsMjU4Ljc1OSwwLDI2MS4yMzNjMCwyLjQ3NCwwLjk1Myw0LjY2NCwyLjg1Niw2LjU2NmwxMzMuMDQzLDEzMy4wNDQgICAgYzEuOTAyLDEuOTA2LDQuMDg5LDIuODU0LDYuNTY3LDIuODU0czQuNjY1LTAuOTUxLDYuNTY3LTIuODU0bDE0LjI3Ny0xNC4yNjhjMS45MDMtMS45MDIsMi44NTYtNC4wOTMsMi44NTYtNi41NyAgICBjMC0yLjQ3MS0wLjk1My00LjY2MS0yLjg1Ni02LjU2M0w1MS4xMDcsMjYxLjIzM2wxMTIuMjA0LTExMi4yMDFDMTY1LjIxNywxNDcuMTMsMTY2LjE2NywxNDQuOTM5LDE2Ni4xNjcsMTQyLjQ2NXoiIGZpbGw9IiM5MURDNUEiLz4KCQk8cGF0aCBkPSJNNTE5LjYxNCwyNTQuNjYzTDM4Ni41NjcsMTIxLjYxOWMtMS45MDItMS45MDItNC4wOTMtMi44NTctNi41NjMtMi44NTdjLTIuNDc4LDAtNC42NjEsMC45NTUtNi41NywyLjg1N2wtMTQuMjcxLDE0LjI3NSAgICBjLTEuOTAyLDEuOTAzLTIuODUxLDQuMDktMi44NTEsNi41NjdzMC45NDgsNC42NjUsMi44NTEsNi41NjdsMTEyLjIwNiwxMTIuMjA0TDM1OS4xNjMsMzczLjQ0MiAgICBjLTEuOTAyLDEuOTAyLTIuODUxLDQuMDkzLTIuODUxLDYuNTYzYzAsMi40NzgsMC45NDgsNC42NjgsMi44NTEsNi41N2wxNC4yNzEsMTQuMjY4YzEuOTA5LDEuOTA2LDQuMDkzLDIuODU0LDYuNTcsMi44NTQgICAgYzIuNDcxLDAsNC42NjEtMC45NTEsNi41NjMtMi44NTRMNTE5LjYxNCwyNjcuOGMxLjkwMy0xLjkwMiwyLjg1NC00LjA5NiwyLjg1NC02LjU3ICAgIEM1MjIuNDY4LDI1OC43NTUsNTIxLjUxNywyNTYuNTY1LDUxOS42MTQsMjU0LjY2M3oiIGZpbGw9IiM5MURDNUEiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K";

// Add format function for string~
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

CKEDITOR.on('instanceReady', function (evt) {
    $("#cke_52").after('<span id="cke_55" class="cke_toolbar" role="toolbar"><span class="cke_toolbar_start"></span><span class="cke_toolgroup" role="presentation"><span class="cke_button"><a id="cke_28"class="cke_button_code cke_off"><img src="{0}"/></a></span></span><span class="cke_toolbar_end"></span></span>'.format(CODE_IMG));
    var code_btn = $("#cke_55");
    code_btn.click(function () {
        // Generate the modal code
        var code = '<div id="modal_out_window"><div id="modal_out_title">Code Properties</div><div id="modal_data"><div id="modal_choose"><div><span>Style: (具体展示见 <a href="/forums.php?action=viewtopic&forumid=9&topicid=11235" target="_blank">新手学园-->资源简介美化——引用nfo格式</a> )</span><a id="modal_more_style_btn" style="float:right;" href="javascript:void(0);">↓ Show</a><div id="modal_style"><div style="display: flex;">';
        for (var i = 0; i < DEFAULT_STYLE.length; i++) {
            var choose = (DEFAULT_STYLE[i].checked || (DEFAULT_STYLE[i].checked = false)) === true ? ' checked=""' : '';
            code += '<label style="width:50%;"><input type="radio" name="code_style" value="{0}" {1}> {2}</label>'.format(i, choose, DEFAULT_STYLE[i].name);
            if ((i + 1) % 2 === 0) {
                code += '</div><div style="display: flex;">';
            }
        }
        code += '</div></div><hr><form><div><label for="modal_title">Title:</label><input id="modal_title" type="text" value="Quote:" class="form-control" style="width:100%"></div><div><label for="modal_textarea">CODE iNFO:</label><textarea id="modal_textarea" rows="6" style="width:100%"></textarea></div><div><label><input id="modal_skip_clone" type="checkbox" checked=""> Skip When Next Clone Time~</label></div></form></div><div id="modal_btn" align="right"><button type="button" id="modal_update">OK</button> <button type="button" class="simplemodal-close" id="modal_exit">Cancel</button></div></div></div>';

        $(code).modal({            // !-- SimpleModal插件属性
                autoPosition: true,         // 自动定位
                zIndex: 102,
                minWidth: "420 px",
                autoResize: true,
                escClose: true,             //按ESC关闭模态窗口
                overlayClose: true          //按overlay（遮罩层）关闭模态窗口
            }
        );

        // TODO Add style
        $("#modal_out_window").css({"border":"solid 1px #ddd","padding":"5px","background-color":"#fff","border-radius":"5px"});
        $("#modal_out_title").css({"font-weight":" bold","font-size": "14px","padding": "3px 3px 8px","border-bottom": "1px solid #eee"});
        $("#modal_data").css({"background-color": "#ebebeb","border": "solid 1px #fff","border-bottom": "none","overflow": "auto","padding": "17px 10px 5px 10px","border-top-left-radius": "5px","border-top-right-radius": "5px",});

        var more_style = $("#modal_style > div:gt(1)");
        var more_style_btn = $("#modal_more_style_btn");

        more_style.hide();
        more_style_btn.click(function () {
            more_style.toggle();
            more_style_btn.text(more_style.is(":visible") ? "↑ Hide" : "↓ Show");
        });

        $("#modal_update").click(function () {
            var quote_style_id = parseInt($("input[name='code_style']:checked").val());
            var menu_str = $("input#modal_title").val();
            var info_str = $("#modal_textarea").val();

            var insert_data_raw = DEFAULT_STYLE[quote_style_id].style.format(menu_str, info_str.split("\n").join("<br>"));  // info_str.replace("/\n/g","<br>"));

            // 对用户提交的数据进行部分替换(转义成字符实体)
            insert_data_raw = insert_data_raw.replace(/0[Xx]/g, "0&times;"); // x -> &times;

            if ($("#modal_skip_clone").attr("checked") === "checked") {
                insert_data_raw = "<div class='byrbt_info_clone_ignore'>" + insert_data_raw + "</div>";
            }

            CKEDITOR.instances.descr.setData(CKEDITOR.instances.descr.getData() + insert_data_raw);
            $(".simplemodal-close").click();   // Automatically close
        });
    });
});

/**
 * Created by Rhilip on 6/30/2017.
 * 20180104: Code style Fix.
 * 20171102: Fix `0x` lost in descr after publish.
 * 20170917: Fix When number of Style gt(4)
 * 20170912: Use CKEDITOR.on('instanceReady', function(){}) instead of waitForKeyElements("#cke_descr", function () {})
 * 20170808: USE the dict list to manage the code style
 * 20170630: Test Version~
 */
