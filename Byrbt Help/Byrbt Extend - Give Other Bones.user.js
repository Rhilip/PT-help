// ==UserScript==
// @name         Byrbt : Give Other Bonus
// @namespace    http://blog.rhilip.info
// @version      20170118
// @description  You can give any number of Bones you want(not 25,50,100,200,400) to torrent's owner
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @grant        none
// ==/UserScript==

$(document).ready(function(){

    $('td.rowfollow').find('input[id^=thankbutton]:last').after('<span>  For Other Number: <input type="text" name="gift" placeholder="请输入一个正浮点数"> <input class="btn" type="button" id="thankbuttonother" value="赠送"></span>');
    var torId = location.href.match(/id=(\d+)/)[1];
    var bonus0 = $("#thankbutton25").attr("onclick").match(/,((\d*|0).\d*)\)/)[1];
    var bonustext = $('input[type="text"][name="gift"]');
    var bonus,rate=1;
    if (bonustext.val().match(/\*/)){
        bonus = bonustext.val().match(/((\d*|0).\d*)\*(\d*)/)[1];
        rate = bonustext.val().match(/((\d*|0).\d*)\*(\d*)/)[3];
    }else{
        bonus = bonustext.val();
    }

    $('input#thankbuttonother').click(function(){
        if(bonus*rate <bonus0){
            for(var i=0;i<rate;i++){
                $.ajax({
                    url: 'givebonus.php',
                    data: 'type=torrents&torrentid=' + torId + '&bonus=' + bonus,
                    dataType: 'json',
                    type: 'POST',
                    success: function(result) {
                        if (result.usererror) {
                            alert("抱歉，该用户无法接受您的" + bonus + "个茉莉汁 =_= .");
                            return false;
                        }
                        if (result.state) {
                            document.getElementById("nothanksbonus").innerHTML = "";
                            document.getElementById("addcuruserbonus").innerHTML = document.getElementById("curuserbonus").innerHTML + "(" + bonus + ".0)";
                            console.log("您已成功赠送 " + bonus + " 个茉莉汁 ^_^ ");
                        } else {
                            alert("抱歉，您的茉莉汁少于 " + bonus + " >_< ");
                        }
                    }
                });
            }
            alert("您已成功赠送 " + bonus + " 个茉莉汁 ^_^ *" + i);
        }
    });
});

/**
 * Created by Rhilip on 2017/1/18.
 */
