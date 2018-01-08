// ==UserScript==
// @name         Pt-search
// @namespace    http://blog.rhilip.info
// @version      20180107
// @description  配套脚本
// @author       Rhilip
// @run-at       document-end
// @include      http://localhost*
// @include      https://rhilip.github.io/PT-help-server/ptsearch*
// @connect      bt.byr.cn
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

/**
 * @return {number}
 */
function FileSizetoLength(size) {
    var _size_raw_match = size.match(/([\d.]+) ?([TGMK]?B)/);
    if (_size_raw_match) {
        var _size_num = parseFloat(_size_raw_match[1]);
        switch (_size_raw_match[2]) {
            case "B":
                return _size_num;
            case "KB":
                return _size_num * Math.pow(2, 10);
            case "MB":
                return _size_num * Math.pow(2, 20);
            case "GB":
                return _size_num * Math.pow(2, 30);
            case "TB":
                return _size_num * Math.pow(2, 40);
        }
    }
    return 0;
}

const size_type_list = ["GB", "MB", "KB", "TB", "B"];

/**
 * @return {string}
 */
function TimeStampFormatter(data) {
    var unixTimestamp = new Date(data);
    return unixTimestamp.toLocaleString();
}

$(document).ready(function () {
    var table = $("#table");
    if (table) {    // 存在Bootstrap Table
        // 移除Tampermonkey提示，显示隐藏表格
        $("#use-tampermonkey").hide();
        $("#hide-without-tampermonkey").show();
    }

    var search_log = $("#search-log");

    function writelog(text) {
        search_log.append("<li>" + TimeStampFormatter(Date.now()) + " - " + text + "</li>");
    }

    // 搜索开始
    $("#advsearch").click(function () {
        // 获取搜索设置
        var search_text = $("#keyword").val().trim();     // 搜索文本
        var search_site = localStorage.getItem('selected_name').split(',') || [];   // 搜索站点

        // 开始各站点遍历
        var site_name = "", site_prefix = "";
        if ($.inArray("BYR", search_site) > -1) {     // BYRBT
            site_name = "BYR";
            site_prefix = "https://bt.byr.cn/";
            writelog("Start Searching in BYRBT.");
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://bt.byr.cn/torrents.php?search=" + search_text,
                onload: function (responseDetail) {
                    var resp = responseDetail.responseText;
                    if (responseDetail.finalUrl.search("login") > -1) {
                        writelog("Not Login in Site BYRBT.");
                    } else {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var page = $(body); // 构造 jQuery 对象
                        var torrent_list_table = page.find(".torrents tr:odd");
                        writelog("Get " + torrent_list_table.length + " records in Site BYRBT.");
                        for (var i = 0; i < torrent_list_table.length; i++) {
                            var torrent_data_raw = torrent_list_table.eq(i);
                            var _tag_name = torrent_data_raw.find("a[href*='hit']");
                            var _date = torrent_data_raw.find("span[title*=-]").attr("title") || torrent_data_raw.text().match(/(\d{4}-\d{2}-\d{2} ?\d{2}:\d{2}:\d{2})/)[1].replace(/-(\d{2}) ?(\d{2}):/, "-$1 $2:");

                            var _tag_size, _size;
                            for (var j = 0; j < size_type_list.length; j++) {
                                _tag_size = torrent_data_raw.find("td:contains('" + size_type_list[j] + "')");
                                if (_tag_size.text()) {
                                    _size = FileSizetoLength(_tag_size.text());
                                    break;
                                }
                            }
                            var _data_dict = {
                                "site": site_name,
                                "name": _tag_name.attr("title") || _tag_name.text(),
                                "link": site_prefix + _tag_name.attr("href"),
                                "pubdate": Date.parse(_date),
                                "size": _size,
                                "seeders": _tag_size.next("td").text(),
                                "leechers": _tag_size.next("td").next("td").text(),
                                "completed": _tag_size.next("td").next("td").next("td").text()
                            };
                            table.bootstrapTable('append', _data_dict);
                        }
                    }
                    writelog("End of Search Site BYRBT.");
                }
            });

        }
    });
});