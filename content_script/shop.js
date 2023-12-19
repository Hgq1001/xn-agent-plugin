// 店铺全部SKU
function getSKU(){
    var data=[];
    $(".jSearchListArea li[sid]").each(function(){
        data.push($(this).attr("sid"));
    })
    showMasker('<div style="position:absolute;top:0;left:0;background:#fff;font-size:18px;width:100%;text-align:center;line-height:100px;">' +
            'SKU '+data.length+'个<p style="line-height:24px;margin:20px;">'+data.join(",")+'</p>' +
            '</div>');
    $(".xzh-data-wrapper").css("right", "37px");
}

$("body").append('<div style="z-index:999;position:fixed;top:0;right:50px;width:240px;height:32px;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;"><button type="button" onclick="getSKU();" style="position:absolute;top:0;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看本店SKU</button></div>');
