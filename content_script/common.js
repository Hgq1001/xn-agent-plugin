// 公共函数

// CSS
$("head").append(`<style type="text/css">
    #xzh-footbar .ant-radio-group .ant-radio-wrapper,#xzh-footbar .ant-checkbox-wrapper{color:#fff}
    #xzh-footbar .radio___2utzi+.radio___2utzi{margin:0 4px;}
    #xzh-footbar span.ant-radio+*, #xzh-footbar .ant-checkbox+span{padding-left:4px;}
    table.data{width:98%;}
    table.data th{border:1px solid #ddd;padding:8px;background-color:#eee}
    table.data td{text-align:center;border-bottom:1px dashed #ddd;padding:8px;}
    table.data tfoot td{background-color:#feeee3;}
    table.data tr.error td{background-color:#fee3e3;border-bottom:2px solid #ff311c;}
    table.data tr.ok td{background-color:#f0fff0;border-bottom:1px solid #07720b;}
    table.data td p{padding:0;margin:0}
    .xzh-label-tips{color:#aaa;font-size:12px;background:#fafafa;border-radius:8px;border:1px solid #eee;margin-left:4px;}
    .xzh-label-comma{color:#ddd}
    .xzh-label-gray{color:#999;}
    .xzh-label-red{color:#ff1d1d;}
    .xzh-label-green{color:#07720b;}
    .xzh-label-blue{color:#2196f3;}
    .xzh-label-bold{font-weight:bold;}
    .xzh-label-dx,.xzh-label-dd{background-color:#4caf50;font-size:12px;padding:2px 4px;border-radius:8px;color:#fff;}
    .xzh-label-dd{background-color:#2196f3;}
    .xzh-btn {
        display: -ms-inline-flexbox;
        display: inline-flex;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-pack: center;
        justify-content: center;
        height: 32px;
        padding: 0 14px;
        color: #fff;
        border-color: transparent;
        border-radius: 16px;
    }
    button.button___1iBD7.button-type-primary___2i--z.xzh-btn-green{background:linear-gradient(90deg,#4caf50,#009688);}
    button.button___1iBD7.button-type-primary___2i--z.xzh-btn-green:hover{background:linear-gradient(90deg,#009688,#4caf50);}
    button.button___1iBD7.button-type-primary___2i--z.xzh-btn-large{width:30%;margin-left:35%;}
    button.button___1iBD7.button-type-primary___2i--z.xzh-btn-nomargin{margin-left:auto;}
</style>`);

var xzh_maskid = 1;
function showMasker(sHtml) {
    sHtml = '<div id="xzh-datamasker' + xzh_maskid + '">' +
        '<div style="position:fixed;top:0;right:0;bottom:0;left:0;z-index:10000;height:100%;background-color:rgba(0,0,0,.45);"></div>' +
        '<div class="xzh-data-wrapper" style="background:#fff;width:90%;padding:20px;z-index:10000;position:fixed;top:0;right:0;bottom:0;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;">' +
        '<button type="button" onclick="$(\'#xzh-datamasker' + xzh_maskid + '\').remove();" style="position:absolute;top:0;right:0;z-index:10;padding:12px;color:rgba(0,0,0,.45);font-weight:700;line-height:1;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">' +
        '<svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>' +
        '</button>' +
        '<div style="word-wrap:break-word;word-break:break-all;">' + sHtml + '</div>' +
        '</div></div>';
    $("body").append(sHtml);
    xzh_maskid++;
}

// 日期数据扩展
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}
Date.prototype.daydiff = function (days) {
    return new Date(this.getTime() + 24 * 3600 * 1000 * days);
}
Date.prototype.diff = function (date, type = "d") {
    var diff = 24 * 3600 * 1000;
    switch (datatype(date)) {
        case "Undefined":
            date = new Date().getTime();
            break;
        case "Date":
            date = date.getTime();
            break;
        case "String":
            date = !date ? new Date().getTime() : new Date(date).getTime();
            break;
    }
    switch (type) {
        // 秒
        case "s":
            diff = 1000;
            break;
        // 分
        case "m":
            diff = 60 * 1000;
            break;
        // 时
        case "h":
            diff = 3600 * 1000;
            break;
        // 天
        case "d":
        default:
            diff = 24 * 3600 * 1000;
            break;
    }
    return Math.floor((date + 8 * 3600000) / diff) - Math.floor((this.getTime() + 8 * 3600000) / diff);
}
String.prototype.diff = function (date, type = "d") {
    return new Date(this).diff(date, type);
}
Number.prototype.diff = function (date, type = "d") {
    return new Date(this).diff(date, type);
}
function datatype(data) {

    // ''               String
    // 1                Number
    // true             Boolean
    // Symbol()         Symbol
    // undefined        Undefined
    // null             Null
    // new Function()   Function
    // new Date()       Date
    // []               Array
    // new RegExp()     RegExp
    // new Error()      Error
    // document         HTMLDocument
    // window           global

    var type = Object.prototype.toString.call(data);
    return type.substr(8, type.length - 9);
}

// 三击
jQuery.event.special.tripleclick = {
    setup: function (data, namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.bind('click', jQuery.event.special.tripleclick.handler);
    },
    teardown: function (namespaces) {
        var elem = this, $elem = jQuery(elem);
        $elem.unbind('click', jQuery.event.special.tripleclick.handler);
    },
    handler: function (event) {
        var elem = this, $elem = jQuery(elem), clicks = $elem.data('clicks') || 0;
        clicks += 1;
        if (clicks === 3) {
            clicks = 0;
            event.type = "tripleclick";
            // jQuery.event.handle.apply(this, arguments)
            jQuery.event.dispatch.apply(this, arguments)
        }
        $elem.data('clicks', clicks);
    }
};

// var XN_BASE_REQUEST_URL = "https://oper.xiaoneng.cn/oper/"; // 小能代理商接口地址前缀-正式环境
var XN_BASE_REQUEST_URL = "https://cd-uat.xiaoneng.cn/oper/"; // 小能代理商接口地址前缀-测试环境
// var XN_BASE_REQUEST_URL = "https://172.16.13.15:8080/oper/"; // 代理商接口地址前缀-王展

// 从已有excel，复制店铺名称列，粘贴到textarea标签中，再处理数据得到店铺名称数据
function getShopDataFromExcel(textValue) {
    console.log('数据--->', textValue)
    let shopData = textValue.split("\n");
    // shopData.splice(0, 1);
    shopData = shopData.filter((item) => item);
    console.log('数据1--->', shopData)
    return shopData;
}


