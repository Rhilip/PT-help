// ==UserScript==
// @name         Byrbt MOD help
// @namespace    http://blog.rhilip.info
// @version      0.2
// @description  It's an userscript prepared for uesrs who's Level is highter than Moderator in Byrbt
// @author       Rhilip
// @match        http*://bt.byr.cn/*
// @icon         http://bt.byr.cn/favicon.ico
// @grant        none
// ==/UserScript==

//Control Options
var IPv6toLoc = 1;   //Change IPv6 address to Location in page detail.php and viewsnatches.php
var Subcheck = 1;    //

$(document).ready(function(){
    //Change IPv6 address
    if(IPv6toLoc){
        //In page detail.php
        if (location.pathname == "/details.php"){
            $('#hidepeer > a').after('<br><a id="toloc" class="sublink">[地点查询]</a>');
            $('#toloc').click(function(){
                var maintable = $('#peerlist > table > tbody > tr > td:nth-child(2)');
                maintable.each(function(){
                    var node = $(this);
                    var ip = node.text();
                    if (ip.match(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/)){
                        var url='http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                        $.getJSON(url,function(data){
                            node.text(data.geo.loc);
                            node.attr("title",data.geo.ip);
                        });
                    }
                    node.attr("width","9%");
                });
            });
        }
        //In page viewsnatches.php and iphistory.php(Automatically)
        if (location.pathname == "/viewsnatches.php" || location.pathname == "/iphistory.php"){
            var maintable = $("#outer > table.main > tbody > tr > td > table > tbody > tr > td:nth-child(2)");
            maintable.each(function(){
                var node = $(this);
                var ip = node.text();
                if (ip.match(/(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)/) || ip.match(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/)){
                    var url='http://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=' + ip;
                    $.getJSON(url,function(data){
                        if (location.pathname == "/viewsnatches.php"){
                            node.html(ip +"<br>"+ "(" +data.geo.loc + ")");
                        }else if(location.pathname == "/iphistory.php"){
                            node.after("<td align='center'>"+data.geo.loc+"</td>");
                        }
                    });
                }else{
                    if (location.pathname == "/viewsnatches.php"){
                        node.text("IP/地点");
                    }else if(location.pathname == "/iphistory.php"){
                        node.parents("table:eq(0)").attr("width","600");
                        node.after('<td class="colhead" align="center" width="30%">地点</td>');
                    }
                }
            });
        }
    }

        });
    //Make the input box in page report.php Wider
    if(location.pathname == "/report.php"){
        $("#outer > table.main > tbody > tr > td > table > tbody > tr > td > form > input:nth-child(3)").attr("style","width: 400px");
    }
});
