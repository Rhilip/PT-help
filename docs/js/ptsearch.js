// ==UserScript==
// @name         Pt-search
// @namespace    http://blog.rhilip.info
// @version      20180107
// @description  配套脚本
// @author       Rhilip
// @run-at       document-end
// @include      http://localhost*
// @include      https://rhilip.github.io/PT-help/ptsearch*
// @connect      bt.byr.cn
// @connect      npupt.com
// @connect      pt.whu.edu.cn
// @connect      ourbits.club
// @connect      hdsky.me
// @connect      hdhome.org
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
    var _size_raw_match = size.match(/([\d.]+) ?([TGMK]?i?B)/);
    if (_size_raw_match) {
        var _size_num = parseFloat(_size_raw_match[1]);
        var _size_type = _size_raw_match[2];
        switch (true) {
            case /Ti?B/.test(_size_type):
                return _size_num * Math.pow(2, 40);
            case /Gi?B/.test(_size_type):
                return _size_num * Math.pow(2, 30);
            case /Mi?B/.test(_size_type):
                return _size_num * Math.pow(2, 20);
            case /Ki?B/.test(_size_type):
                return _size_num * Math.pow(2, 10);
            default:
                return _size_num
        }
    }
    return 0;
}

const size_type_list = ["GB", "GiB", "MB", "MiB", "KB", "TB", "TiB", "B"];

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

    // 通用处理模板，如果默认解析模板可以解析该站点则请不要自建解析方法
    // NexusPHP类站点
    function NexusPHP(site, prefix, tr_list) {
        for (var i = 0; i < tr_list.length; i++) {
            var torrent_data_raw = tr_list.eq(i);
            var _tag_name = torrent_data_raw.find("a[href*='hit']");
            var _date = torrent_data_raw.find("span[title*='-'][title*=':'][title^='20']").attr("title") || torrent_data_raw.text().match(/(\d{4}-\d{2}-\d{2} ?\d{2}:\d{2}:\d{2})/)[1].replace(/-(\d{2}) ?(\d{2}):/, "-$1 $2:");

            var _tag_size, _size;
            for (var j = 0; j < size_type_list.length; j++) {
                _tag_size = torrent_data_raw.find("td:contains('" + size_type_list[j] + "')");
                if (_tag_size.text()) {
                    _size = FileSizetoLength(_tag_size.text());
                    break;
                }
            }

            table.bootstrapTable('append', {
                "site": site,
                "name": _tag_name.attr("title") || _tag_name.text(),
                "link": prefix + _tag_name.attr("href"),
                "pubdate": Date.parse(_date),
                "size": _size,
                "seeders": _tag_size.next("td").text().replace(',', ''),
                "leechers": _tag_size.next("td").next("td").text().replace(',', ''),
                "completed": _tag_size.next("td").next("td").next("td").text().replace(',', '')
            });
        }
    }


    // 搜索开始
    $("#advsearch").click(function () {
        // 获取搜索设置
        var search_text = $("#keyword").val().trim();     // 搜索文本
        var search_site = localStorage.getItem('selected_name').split(',') || [];   // 搜索站点

        // 清空已有表格信息
        table.bootstrapTable('removeAll');

        // 开始各站点遍历
        if ($.inArray("BYR", search_site) > -1) {     // BYRBT
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
                        NexusPHP("BYR", "https://bt.byr.cn/", torrent_list_table);
                    }
                    writelog("End of Search Site BYRBT.");
                }
            });
        }
        if ($.inArray("NPU", search_site) > -1) {     // NPUPT
            writelog("Start Searching in NPUPT.");
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://npupt.com/torrents.php?search=" + search_text,
                onload: function (responseDetail) {
                    var resp = responseDetail.responseText;
                    if (responseDetail.finalUrl.search("login") > -1) {
                        writelog("Not Login in Site NPUPT.");
                    } else {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var page = $(body); // 构造 jQuery 对象
                        var tr_list = page.find("#torrents_table tr");
                        for (var i = 1; i < tr_list.length; i += 3) {
                            var torrent_data_raw = tr_list.eq(i);
                            var _tag_name = torrent_data_raw.find("a[href*='hit']");
                            var _date = torrent_data_raw.find("span[title*='-'][title*=':'][title^='20']").attr("title") || $.trim(torrent_data_raw.find("div.small").text()) || torrent_data_raw.text().match(/(\d{4}-\d{2}-\d{2} ?\d{2}:\d{2}:\d{2})/)[1].replace(/-(\d{2}) ?(\d{2}):/, "-$1 $2:");
                            var _tag_size = torrent_data_raw.find("center");

                            table.bootstrapTable('append', {
                                "site": "NPU",
                                "name": _tag_name.attr("title") || _tag_name.text(),
                                "link": "https://npupt.com/" + _tag_name.attr("href"),
                                "pubdate": Date.parse(_date),
                                "size": FileSizetoLength(_tag_size.text()),
                                "seeders": torrent_data_raw.find("span.badge").eq(0).text(),
                                "leechers": torrent_data_raw.find("span.badge").eq(1).text(),
                                "completed": parseInt(torrent_data_raw.find("a[href^='viewsnatches.php?id=']").text())
                            });
                        }
                    }
                    writelog("End of Search Site NPUPT.");
                }
            });
        }
        if ($.inArray("WHU", search_site) > -1) {     // WHU
            writelog("Start Searching in WHU.");
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://pt.whu.edu.cn/torrents.php?inclbookmarked=0&search_area=0&incldead=1&indate=0&search=" + search_text,
                onload: function (responseDetail) {
                    var resp = responseDetail.responseText;
                    if (responseDetail.finalUrl.search("login") > -1) {
                        writelog("Not Login in Site WHU.");
                    } else {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var page = $(body); // 构造 jQuery 对象
                        var torrent_list_table = page.find(".torrents tr:odd");
                        writelog("Get " + torrent_list_table.length + " records in Site WHU.");
                        NexusPHP("WHU", "https://pt.whu.edu.cn/", torrent_list_table);
                    }
                    writelog("End of Search Site WHU.");
                }
            });
        }

        if ($.inArray("HDSKY", search_site) > -1) {     // HDSKY
            writelog("Start Searching in HDSKY.");
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://hdsky.me/torrents.php?incldead=1&spstate=0&inclbookmarked=0&search=" + search_text,
                onload: function (responseDetail) {
                    var resp = responseDetail.responseText;
                    if (responseDetail.finalUrl.search("login") > -1) {
                        writelog("Not Login in Site HDSKY.");
                    } else {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var page = $(body); // 构造 jQuery 对象
                        var torrent_list_table = page.find(".torrents tr.progresstr");
                        writelog("Get " + torrent_list_table.length + " records in Site Ourbits.");
                        NexusPHP("HDSKY", "https://hdsky.me/", torrent_list_table);
                    }
                    writelog("End of Search Site HDSKY.");
                }
            });

        }
        if ($.inArray("Ourbits", search_site) > -1) {     // Ourbits
            writelog("Start Searching in Ourbits.");
            GM_xmlhttpRequest({
                method: 'GET',
                url: "https://ourbits.club/torrents.php?incldead=1&spstate=0&inclbookmarked=0&search=" + search_text,
                onload: function (responseDetail) {
                    var resp = responseDetail.responseText;
                    if (responseDetail.finalUrl.search("login") > -1) {
                        writelog("Not Login in Site Ourbits.");
                    } else {
                        var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
                        var page = $(body); // 构造 jQuery 对象
                        var torrent_list_table = page.find(".torrents tr[class^='sticky_']");
                        writelog("Get " + torrent_list_table.length + " records in Site Ourbits.");
                        NexusPHP("Ourbits", "https://ourbits.club/", torrent_list_table);
                    }
                    writelog("End of Search Site Ourbits.");
                }
            });

        }
    });
});