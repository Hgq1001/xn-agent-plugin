$("body").append(`
    <div style="z-index:999;position:fixed;top:0;right:20px;width:240px;height:400px;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;">
        <button type="button" onclick="getSKU();" style="position:absolute;top:0;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看全部SKU</button>
        <button type="button" onclick="getShopId();" style="position:absolute;top:32px;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看全部SHOPID</button>
        <button type="button" onclick="getKeywords();" style="position:absolute;top:64px;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">批量采集竞品</button>
        <button type="button" onclick="searchBrandSkuPincount();" style="position:absolute;top:96px;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">品牌SKU人数预估</button>
    </div>`);

let GOODS_LABEL_OPTION_TYPE_CONFIG = {};

let GOODS_LABEL_CONFIG = {
  浏览: {
    1: 183,
    3: 184,
    7: 185,
    15: 186,
    30: 187,
  },
  // 商品
  加购: {
    1: 195,
    3: 196,
    7: 197,
    15: 198,
    30: 199,
    60: 200,
    90: 201,
  },
  // 商品
  付款: {
    1: 202,
    3: 203,
    7: 204,
    15: 205,
    30: 206,
    60: 207,
    90: 208,
    180: 263,
    360: 264,
    720: 265,
  },
};

let brandSkuData = JSON.parse(localStorage.getItem("brandSku")) || [];

window.addEventListener(
  "message",
  function (e) {
    if (e.data) {
      const { render, result } = e.data;
      if (render) {
        renderUI(result);
      }
    }
  },
  false
);

function globalPostMessage({ url, type, api, params, headers, ...props }) {
  window.postMessage({
    params,
    url,
    type,
    api,
    headers,
    ...props,
  });
}

function renderUI(result) {
  const { api } = result;
  switch (api) {
    case "pin-count": // 预估
      pinCountToRender(result);
      break;
    default:
  }
}

function getSKU() {
  var sku = [];
  // $("#J_goodsList li[data-sku] .p-img a").each(function(){
  //     var item = $(this).attr("href");
  //     item = item.substr(item.lastIndexOf("/")+1);
  //     item = item.substr(0,item.length-5);
  //     sku.push(item);
  //     // console.log(item)
  // });
  $("#J_goodsList li[data-sku]").each(function () {
    sku.push($(this).data("sku"));
  });
  showMasker(
    '<div style="position:absolute;top:0;left:0;background:#fff;font-size:18px;width:100%;text-align:center;line-height:100px;">' +
      "SKU " +
      sku.length +
      '个<p style="line-height:24px;margin:20px;">' +
      sku.join(",") +
      "</p>" +
      "</div>"
  );
  return sku.length;
}
function getShopId() {
  var shopid = [];
  $("#J_goodsList li[data-sku] .hd-shopname").each(function () {
    var sid = $(this).attr("onclick");
    if (!sid) return;
    sid = sid.substr(13, sid.length - 20);
    if (shopid.indexOf(sid) >= 0) return;
    shopid.push(sid);
  });
  showMasker(
    '<div style="position:absolute;top:0;left:0;background:#fff;font-size:18px;width:100%;text-align:center;line-height:100px;">' +
      "SHOPID " +
      shopid.length +
      '个<p style="line-height:24px;margin:20px;">' +
      shopid.join(",") +
      "</p>" +
      "</div>"
  );
  return shopid.length;
}

function getKeywords() {
  showMasker(
    '<div style="position:absolute;top:0;left:0;background:#fff;font-size:18px;width:100%;text-align:center;line-height:32px;">' +
      '<div style="padding-top:32px;"><textarea id="xzh-text-keywords" style="margin:0px;width:600px;height:320px;"></textarea></div>' +
      '<div style="padding-top:16px;"><button id="xzh-btn-keywords" class="button___1iBD7 button-type-primary___2i--z xzh-btn-nomargin xzh-btn xzh-btn-green xzh-btn-large"><i></i>批量搜索采集</button>' +
      "</div></div>"
  );

  $("#xzh-text-keywords").bind("tripleclick", function (event) {
    $.getJSON("https://quanxiaobao.cn/api/noncompete", function (res) {
      $("#xzh-text-keywords").val(res.join("\n"));
    });
  });

  $("#xzh-btn-keywords").bind("click", function () {
    var data = $("#xzh-text-keywords").val().trim().split("\n");
    if (!data) return;
    console.log(data);

    var sHtml =
      '<table class="data"><tr><th style="width:5%">#</th><th style="width:15%">关键词</th><th style="width:80%">SKU</th></tr>';
    sHtml += data
      .map(
        (item, i) =>
          "<tr><td>" +
          (i + 1) +
          "</td><td>" +
          item +
          '</td><td class="xz-word-break xzh-keyword-' +
          i +
          '" id="xzh-keyword-' +
          i +
          '">-</td></tr>'
      )
      .join("");
    sHtml += "</table>";
    sHtml +=
      '采集间隔<input id="xzh-search-time" style="width:16px" value="5">秒<button id="xzh-btn-multi-keywords" type="button" class="button___1iBD7 button-type-primary___2i--z xzh-btn xzh-btn-green xzh-btn-large"><span>开始采集</span></button>';
    showMasker(sHtml);

    $("#xzh-btn-multi-keywords").bind("click", function () {
      // console.log("开始采集", data);
      var keywords = [];
      var j = 0;
      for (i = 0; i < data.length; i++) {
        if (!data[i]) {
          continue;
        }
        var idx = keywords.indexOf(data[i]);
        if (idx > -1) {
          $("#xzh-keyword-" + i).addClass("xzh-keyword-" + idx);
          s = $("#xzh-keyword-" + idx).text();
          $("#xzh-keyword-" + i).text(s);
          continue;
        }
        keywords[i] = data[i];
        (function (i) {
          var t = $("#xzh-search-time").val() * 1000;
          t = t < 3000 ? 5000 : t;
          console.log(t);
          setTimeout(function () {
            search(data[i], i);
          }, j * t);
        })(i);
        j++;
      }
      $(this).remove();
    });
  });
}

var search_times = 0;

function search(keyword, i) {
  search_times = 0;
  $.ajax({
    url: "/Search?keyword=" + keyword + "&enc=utf-8",
    success: function (res) {
      findSkuId(res, i, keyword);
    },
  });
  $.ajax({
    url:
      "/s_new.php?keyword=" + keyword + "&qrst=1&stock=1&page=2&s=30&click=0",
    success: function (res) {
      findSkuId(res, i, keyword);
    },
  });
  $.ajax({
    url:
      "/s_new.php?keyword=" + keyword + "&qrst=1&stock=1&page=3&s=57&click=0",
    success: function (res) {
      findSkuId(res, i, keyword);
    },
  });
}

function findSkuId(str, i, keyword) {
  search_times++;
  var reg = /p-img">\n\s+(?:.+\n)*?.+item\.jd\.com\/(\d+)\.html/g;
  var sku = [];
  while ((m = reg.exec(str))) {
    sku.push(m[1]);
  }
  var skuid = $("#xzh-keyword-" + i).text();
  $(".xzh-keyword-" + i).text(
    skuid == "-" ? sku.join() : skuid + "," + sku.join()
  );
  // 提交到服务器
  if (search_times >= 3) {
    skuid = $("#xzh-keyword-" + i).text();
    console.log(keyword, skuid);
    $.getJSON("https://quanxiaobao.cn/api/pushcompete", {
      keyword: keyword,
      skuids: skuid,
    });
  }
}

function searchJDPageHtml(url) {
  let html = null;
  $.ajax({
    url,
    type: "GET",
    dataType: "text",
    headers: {
      "Content-Type": "text/html;charset=utf8",
    },
    contentType: "text/html",
    async: false,
    success: function (res) {
      html = res;
    },
  });
  return html;
}

// 查询sku预估人数
function searchBrandSkuPincount() {
  var sHtml =
    '<div style="width:98%;margin:20px;" id="sku-pin-count-container">' +
    '<h1 style="text-align: center">竞品SKU查询</h1>' +
    '<div style="margin-top:30px"><textarea style="font-size:18px;padding:15px" id="jd-search-page-url" placeholder="输入要查询的品牌名" rows="7" class="ant-input"></textarea></div>' +
    '<div class="custom-button-box"><button id="btn-jd-page" onclick="parseJdSearchPage();" type="button" class="custom-button larger"><span>查询品牌SKU</span></button></div>' +
    "</div>";
  showMasker(sHtml);

  $("#sku-pin-count-container input:radio").bind("click", function () {
    $(this).parent().addClass("ant-radio-checked");
    $(this)
      .parents("label")
      .siblings()
      .children(".ant-radio")
      .removeClass("ant-radio-checked");
  });
}

function parseJdSearchPage() {
  localStorage.removeItem("brandSku");
  console.log("清除成功！");
  const brandLis = $(".sl-v-logos .J_valueList li");
  console.log("brandLis--->", brandLis);
  if (!brandLis.length) {
    alert("该关键词下品牌为空！");
    return;
  }
  const brands = document.getElementById("jd-search-page-url").value;
  console.log("brands--->", brands);
  let brandsArr = [];
  if (brands) {
    brandsArr = brands.split("\n");
  }
  console.log("brandsArr--->", brandsArr);
  let urls = [];
  brandLis.each(function (i) {
    let curHref = "https://search.jd.com/" + $(this).children("a").attr("href");
    let curTitle = $(this).children("a").attr("title");
    if (!brandsArr.length) {
      if (i < 10) {
        urls.push(curHref);
      }
    }
    if (brandsArr.length && brandsArr.includes(curTitle)) {
      urls.push(curHref);
    }
  });
  if (brandsArr.length && !urls.length) {
    alert("该关键词下的品牌列表中未找到指定品牌！");
    return;
  }
  console.log("urls--->", urls);
  let data = [];
  urls.forEach((url) => {
    let html = searchJDPageHtml(url);
    let keyword = $($(html).find(".search-key")[0]).text().replace(/"/g, "");
    let brand = "";
    $(html)
      .find(".crumb-select-item b")
      .each(function () {
        if ($(this).text().includes("品牌")) {
          brand = $(this).next().text();
        }
      });
    let sku = [];
    $(html)
      .find("#J_goodsList li[data-sku]")
      .each(function () {
        sku.push($(this).data("sku"));
      });
    sku = sku.join();
    data.push({
      keyword,
      brand,
      sku,
    });
  });
  console.log("data--->", data);
  localStorage.setItem("brandSku", JSON.stringify(data));

  if ($("#day-radio").length > 0) {
    $("#day-radio").remove();
  }

  if ($("#sku-pin-count-table").length > 0) {
    $("#sku-pin-count-table").remove();
  }

  if ($("#btn-search-sku-pin-count-box").length > 0) {
    $("#btn-search-sku-pin-count-box").remove();
  }

  let daysRadioElement =
    '<div id="day-radio" class="custom-radio-group" style="margin:35px 0">' +
    "<span>预估天数：</span>" +
    '<span class="custon-radio-span"><input type="radio" name="xzh-radio-sku-pin-count-days" class="custom-radio-input" value="30" checked />30</span>' +
    '<span class="custon-radio-span"><input name="xzh-radio-sku-pin-count-days" type="radio" class="custom-radio-input" value="15" />15</span>' +
    '<span class="custon-radio-span"><input name="xzh-radio-sku-pin-count-days" type="radio" class="custom-radio-input" value="7" />7</span>' +
    '<span class="custon-radio-span"><input name="xzh-radio-sku-pin-count-days" type="radio" class="custom-radio-input" value="3" />3</span>' +
    '<span class="custon-radio-span"><input name="xzh-radio-sku-pin-count-days" type="radio" class="custom-radio-input" value="1" />1</span>' +
    "</div>";

  $("#sku-pin-count-container").append(daysRadioElement);

  var day = $("input[name=xzh-radio-sku-pin-count-days]:checked").val();

  let tableElemet =
    '<table class="data" style="margin-top:15px" id="sku-pin-count-table"><tr><th width="5%">#</th><th width="8%">三级品类</th><th width="5%">品牌</th><th width="52%">SKU</th><th width="10%">' +
    `<span class="th-day">${day}</span>` +
    '日浏览</th><th width="10%">' +
    `<span class="th-day">${day}</span>` +
    "日付款</th>" +
    '<th width="10%">' +
    `<span class="th-day">${day}</span>` +
    "日加购</th>" +
    "</tr>";
  tableElemet += data
    .map(
      (item, i) =>
        `<tr><td>${i + 1}</td><td>${item.keyword}</td><td>${
          item.brand
        }</td><td id="xzh-sku-data-${i}">${
          item.sku
        }</td><td id="xzh-sku-liulan-${i}">-</td><td id="xzh-sku-fukuan-${i}">-</td><td id="xzh-sku-jiagou-${i}">-</td></tr>`
    )
    .join("");
  tableElemet += "</table>";
  $("#sku-pin-count-container").append(tableElemet);

  let btnPincountElement =
    '<div class="custom-button-box" id="btn-search-sku-pin-count-box"><button onclick="startSearchBrandSkuPinCount();" type="button" class="custom-button larger"><span>查询预估人数</span></button></div>';
  $("#sku-pin-count-container").append(btnPincountElement);

  $("#sku-pin-count-container input:radio").bind("click", function () {
    let nowDay = $("input[name=xzh-radio-sku-pin-count-days]:checked").val();
    $(".th-day").each(function () {
      $(this).text(nowDay);
    });
  });
}

// 查询预估人数
function startSearchBrandSkuPinCount() {
  let data = JSON.parse(localStorage.getItem("brandSku"));
  if (!data || !data.length) {
    alert("请先获取品牌SKU信息！");
    return;
  }

  var day = $("input[name=xzh-radio-sku-pin-count-days]:checked").val();

  for (i = 0; i < data.length; i++) {
    (function (i) {
      var t = 15000;
      if (data.length <= 5) {
        t = 4000;
      }
      // 查询浏览
      setTimeout(function () {
        getPinCount(
          {
            behavior: "浏览",
            days: day,
            sku: data[i].sku,
          },
          `xzh-sku-liulan-${i}`
        );
      }, (i + 1) * t + 1000);
      // 查询付款
      setTimeout(function () {
        getPinCount(
          {
            behavior: "付款",
            days: day,
            sku: data[i].sku,
          },
          `xzh-sku-fukuan-${i}`
        );
      }, (i + 1) * t * 2 + 1000);
      // 查询加购
      setTimeout(function () {
        getPinCount(
          {
            behavior: "加购",
            days: day,
            sku: data[i].sku,
          },
          `xzh-sku-jiagou-${i}`
        );
      }, (i + 1) * t * 2.5 + 1000);
    })(i);
    if (i === data.length - 1) {
    }
  }
}

function getPinCount(option, id) {
  const { behavior, days, sku } = option;
  let labelOptions = [
    {
      operator: "DEFAULT",
      label: {
        type: "INTSCT",
        labels: [
          {
            labelId: GOODS_LABEL_CONFIG[behavior][days],
            labelOptionType: 5,
            value: JSON.stringify({ gte: 1, sku }),
          },
        ],
      },
    },
  ];
  globalPostMessage({
    url: `https://xiaozhi.jd.com/mkt/api/crowd/pin-count`,
    type: "post",
    params: { crowdScopeType: 1, labelOptions },
    api: "pin-count",
    id,
  });
}

function pinCountToRender(result) {
  const { data, id } = result;
  if (data) {
    const { finished, requestId, count } = data;
    if (finished) {
      $(`#${id}`).text(count);
    } else {
      setTimeout(() => {
        console.log("时间--->refresh", moment().format("YYYY-MM-DD HH:mm:ss"));
        getRefreshPinCount(requestId, id);
      }, 5000);
    }
  } else {
    $(`#${id}`).text(result.result);
  }
}

function getRefreshPinCount(requestId, elementId) {
  globalPostMessage({
    url: `https://xiaozhi.jd.com/mkt/api/crowd/polling/refresh-pin-count/${requestId}`,
    type: "get",
    api: "pin-count",
    id: elementId,
  });
}
