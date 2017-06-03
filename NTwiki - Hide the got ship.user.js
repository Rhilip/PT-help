// ==UserScript==
// @name Hide the got ship in ntwiki
// @namespace http://blog.rhilip.info
// @version 20170126
// @description 在舰少数据库中隐藏已经打捞到的船只
// @author Rhilip
// @match http://js.ntwikis.com/jsp/apps/cancollezh/maps/detailnew.jsp?detailid=*
// ==/UserScript==

have_raw = ["1-14",16,"18-77","80-100",102,"104-115",117,119,"122-144",147,"149-155",157,158,"160-162","164-169","171-183","185-188","192-195","197-200",
            203,206,209,211,214,219,223,225,227,228,"233-236",238,239,241,248,"253-254","259-260",265,"268-270","275-276","278-279","289-290",294,298,301,"303-304","306-307",309,312,315,316,318];


have = [];
for (var i in have_raw){
    key = have_raw[i];
    if (typeof key == "number"){
    have.push(key);
    }else if(typeof key == "string") {
    var match = key.match(/(\d+)-(\d+)/);
    for (j=parseInt(match[1]);j<=parseInt(match[2]);j++){
            have.push(j);
        }
    }
}

//$.getJSON("http://static.jianrmod.cn/ShortShipInfo.json",function (json) {
//    var origin = json;
//    cidlist = {};
//    for (var i=0;i<origin.length;i++) {
//        cidlist[origin[i].pic_id] = origin[i];
//    }
//});

function wrapship() {
    var ship = $("ul#map-detail-dropinfos > li > p > a:even");
    var ship_rep = ship.next("a");
    for(var i=0;i<ship.length;i++){
        var ship_id = ship_rep.eq(i).attr("onclick").match(/,'(\d+)',/)[1];
        //ship_rep.eq(i).attr("href","http://www.jianrmod.cn/data/shipGetInfo.html?type=0&cid=" + cidlist[ship_id].cid).attr("target",'_blank');
        var ship_class = "<span class='nothave ship_" + ship_id +"'></span>";
        $([ship[i],ship[i].nextSibling,ship_rep[i],ship_rep[i].nextSibling]).wrapAll(ship_class);
    }
}

function hideship() {
    $("ul#map-detail-dropinfos > li.ui-li-divider.ui-bar-inherit.ui-first-child")
        .append("<div style=\"display:inline-block;float:right\" id='hidehave'>隐藏已捞出船只</div>");
    $("div#hidehave").click(function () {
        if ($(this).text().match(/隐藏已捞出船只/)){
            wrapship();
            for (var i=0;i<have.length;i++){
                $("span.ship_"+have[i]+"").removeClass("nothave");
            }
            $("span[class^=ship_]:not(.nothave)").hide();
            $(this).text("显示已隐藏的船只");
        }else {
            $("span[class^=ship]:hidden").show();
            $(this).text("隐藏已捞出船只");
        }
    }).click();
}

function check() {
    if (!$("div#hidehave").html()) {
        hideship();
    }
}

$(document).ready(function(){
    setInterval(check,1000);
});

/**
 * Created by Rhilip on 01/25/17.
 */
