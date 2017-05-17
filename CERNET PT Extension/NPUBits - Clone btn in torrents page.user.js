// ==UserScript==
// @name         NPU - Add Clone btn in torrents page
// @namespace    http://blog.rhilip.info
// @version      0.1
// @description  Direct Clone button in torrent list page
// @author       Rhilip
// @match        http*://npupt.com/torrents.php*
// @icon         http://npupt.com/favicon.ico
// @grant        none
// ==/UserScript==

$(document).ready(function(){

    if($('table#torrents_table > tbody > tr > td.rowfollow.th-fat > table > tbody').length){
        $('table#torrents_table > tbody > tr > td.rowfollow.th-fat > table > tbody > tr').each(function(){
            var tr = $(this);
            if(tr.find('span').length){
                var id  = tr.find('a[href^="details.php?id="]').attr('href').match(/id=(\d+)/)[1];
                tr.find('div > span:last').after('<span class="torrent_property_item"><a href="upload.php?torrent=' + id + '" title="新窗口打开" target="_blank">引用发布</a></span>');
            }
        });
    }
});

/**
 * Created by Rhilip on 2016/11/11.
 */