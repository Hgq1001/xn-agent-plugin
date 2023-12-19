
$("body").append(`
<div style="z-index:999;position:fixed;top:0;right:0;width:240px;height:96px;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;">
    <button type="button" onclick="getSKU();" style="position:absolute;top:0;right:8px;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看全部SKU</button>
    <button type="button" onclick="getCoupon();" style="position:absolute;top:32px;right:8px;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看店铺券</button>
    <button type="button" onclick="pushItem();" style="position:absolute;top:64px;right:8px;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">采集商品信息</button>
</div>`);

function getSKU(){
    var sku=[];
    $(".item[data-sku]").each(function(){
        sku.push($(this).data("sku"));
    });
    showMasker('<div style="position:absolute;top:0;left:0;background:#fff;font-size:18px;width:100%;text-align:center;line-height:100px;">' +
                'SKU '+sku.length+'个<p style="line-height:24px;margin:20px;">'+sku.join(",")+'</p>' +
                '</div>');
    return sku.length;
}

function pushItem(){
    // 类别
    var data = {
        skuid       : pageConfig.product.skuid,
        shopid      : pageConfig.product.shopId,
        shop_name   : $(".item .name a").text(),
        name        : $("#crumb-wrap .item.ellipsis").text(),
        catid       : pageConfig.product.cat,
        cat_name    : pageConfig.product.catName,
        title       : pageConfig.product.name,
        image       : pageConfig.product.src,
        brand_name  : $("#parameter-brand a").text(),
        price       : $(".summary-price .p-price .price").text(),
    };

    // console.log(data);

    $.getJSON("https://quanxiaobao.cn/api/item/save", data);

    alert("采集成功");

}

function getCoupon(){
    $(".J-open-tb").click();
    setTimeout(function() {
        var coupon=[];
        $("#J-global-toolbar iframe").contents().find("#J-coupon-items .item-wrap [id*='couponBatchId']").each(function(){
            coupon.push({
                roleid : $(this).siblings("input[id*=roleId]").val(),
                key : $(this).siblings("input[id*=key]").val(),
                text : $(this).siblings(".coupon-info").find(".condition").text().substr(0, $(this).siblings(".coupon-info").find(".condition").text().length-3) + "减" + $(this).siblings(".coupon-price").find(".coupon-val").text(),
            })
        })
        console.log(coupon);

        var sHtml = '<table class="data"><tr><th style="width:5%">#</th><th style="width:20%">条件</th><th style="width:75%">券</th></tr>';
        sHtml += coupon.map((item,i) => '<tr><td>'+(i+1)+'</td><td><a class="xzh-label-red" href="https://coupon.m.jd.com/coupons/show.action?key='+item.key+'&roleId='+item.roleid+'" target="_blank">'+item.text+'</a></td><td>'+item.roleid+'_'+item.key+'</td></tr>').join("");
        sHtml += '</table>';
        showMasker(sHtml);

    }, 1000);
}

