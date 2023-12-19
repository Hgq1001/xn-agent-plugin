if (document.getElementById("xn-union-right-bar")) {
  $("#xn-union-right-bar").remove();
};
$(".app-wrapper").append(`
    <div style="position:fixed;right:0;top:150px;z-index:998;height:250px;width:450px;background-color:rgba(0,0,0,0.55);"></div>
    <div id="xn-union-right-bar" style="z-index:999;position:fixed;right:0;top:200px;height:250px;width:450px;overflow:hidden;outline:0;text-align:center;">
        <textarea id="union-keyword-textarea" rows="3" class="shop-textarea" placeholder="请输入关键词"/>
        <button type="button" onclick="getUnionShopInfo();" class="get-info-button-style">获取店铺数据</button>
    </div>
`);


$("body").append(
  '<div style="z-index:999;position:fixed;top:0;right:0;width:240px;height:32px;overflow:auto;outline:0;-webkit-overflow-scrolling:touch;"><button type="button" onclick="getSKU();" style="position:absolute;top:0;right:0;z-index:10;line-height:32px;color:rgba(0,0,0);font-weight:700;text-decoration:none;background:transparent;border:0;outline:0;cursor:pointer;transition:color .3s;">查看全部SKU数据</button></div>'
);

var BASE_REQUEST_TIMER = 500; // 拉数据时，请求时间间隔

function getSKU() {
  var data = [];
  $(".card").each(function () {
    data.push({
      sku: $(this)
        .find(".two a")
        .attr("href")
        .replace(/(\/|item[^\/]+|\.html)/g, ""),
      title: $(this).find(".two a").text(),
      commissionrate: $(this).find(".one span:first b").text(),
      commission: $(this).find(".one span:last b").text(),
      price: $(this).find(".three span:first").text(),
      value: $(this).find(".three span:last").text(),
      comment: $(this).find(".four span").text().replace("好评：", ""),
    });
  });
  var sHtml =
    '<table class="data"><tr><th style="width:5%">#</th><th style="width:18%">SKU</th><th style="width:45%">标题</th><th style="width:8%">佣金</th><th style="width:8%">比例</th><th style="width:8%">券后价</th><th style="width:8%">好评</th></tr>';
  sHtml += data
    .map(
      (item, i) =>
        "<tr" +
        (item["commission"] > 50 && item["comment"] > 100
          ? ' class="good"'
          : "") +
        "><td>" +
        (i + 1) +
        '</td><td><a class="id" href="https://xiaozhi.jd.com/mkt/marketing/task-management#' +
        item["sku"] +
        '" target="_blank">' +
        item["sku"] +
        '</a></td><td><a href="https://item.jd.com/' +
        item["sku"] +
        '.html" target="_blank">' +
        item["title"] +
        "</a></td><td>" +
        item["commission"] +
        "</td><td>" +
        item["commissionrate"] +
        "</td><td>" +
        item["price"] +
        "</td><td>" +
        item["comment"] +
        "</td></tr>"
    )
    .join("");
  sHtml += "</table>";
  showMasker(sHtml);
}

// 保存数据到后端(京东联盟)
function saveUnionInfo(newShopInfo, keyWord = "") {
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/opportunity/addUnion`,
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify({
      shopList: newShopInfo,
      keyWord
    }),
    contentType: "application/json",
    success: function (res) {
      if (res.status === 1) {
        alert("保存成功");
      }
    }
  });
};

// 向京东联盟查询店铺数据
function getShopLists(
  pageNo,
  pageSize,
  dataObj,
  list
) {
  $.ajax({
    url: "/api/shop/queryShopLists",
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify({
      data: {
        ...dataObj,
        key: dataObj.key,
      },
      pageNo,
      pageSize,
    }),
    contentType: "application/json",
    success: function (res) {
      if (res.code === 200) {
        const { totalCount, pageNo, pageSize } = res.data.page;
        console.log(
          "getUnionShopInfo--->totalPage",
          Math.ceil(totalCount / pageSize), pageNo
        );
        let shopInfos = res.data.unionShopInfos.map((info) => {
          return {
            shopId: info.shopId, // shopId
            shopName: info.shopName, // shopName
            mainCategories: info.mainCategories, // 主营类目
            averageCommision: info.averageCommision, // 平均佣金
            overAllRating: info.overAllRating, // 综合评分
            inOrderCount30Days: info.inOrderCount30Days, // 30天有效引入订单量
            inOrderComm30Days: info.inOrderComm30Days, // 30天累计支出佣金
            // followCount, // 店铺关注量
          };
        });
        let newShopInfos = [...list, ...shopInfos];
        // if (pageNo < 46) {
        if (pageNo < Math.ceil(totalCount / pageSize)) {
          let nextPageNo = pageNo + 1;
          getShopLists(nextPageNo, pageSize, dataObj, newShopInfos);

        } else {
          // 方法一：传数据给后端
          console.log("联盟完了--->", newShopInfos);
          saveUnionInfo(newShopInfos, dataObj.key);

          //   // 方法二：前端自动生成表格
          //   // var tableElement =
          //   //   '<table border="1" cellspacing="0" cellpadding="0" style="display:none" id="shopTable" class="data"><tr><th>店铺Id</th><th>店铺名称</th><th>主营类目</th><th>平均佣金</th><th>综合评分</th><th>30天有效引入订单量</th><th>30天累计支出佣金</th></tr>';
          //   // for (var i = 0; i < newShopInfos.length; i++) {
          //   //   tableElement +=
          //   //     "<tr><td>" +
          //   //     newShopInfos[i].shopId +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].shopName +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].mainCategories +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].averageCommision +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].overAllRating +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].inOrderCount30Days +
          //   //     "</td><td>" +
          //   //     newShopInfos[i].inOrderComm30Days +
          //   //     "</td></tr>";
          //   // }
          //   // tableElement += "</table>";
          //   // $("body").append(tableElement);
          //   // setTimeout(() => {
          //   //   var blob = new Blob(
          //   //     [document.getElementById("shopTable").outerHTML],
          //   //     {
          //   //       type: "text/plain;charset=utf-8",
          //   //     }
          //   //   );
          //   //   saveAs(blob, "店铺数据.xlsx");
          //   // }, 200);

        }
      }
    },
  });
}

function getUnionShopInfo() {
  let keywordArr = getShopDataFromExcel($('#union-keyword-textarea').val());
  console.log('关键词--->', keywordArr);
  if (keywordArr && keywordArr.length > 0) {
    keywordArr.forEach((keyword, index) => {
      (function (index) {
        setTimeout(() => {
          console.log('index---->', index, keyword)
          getShopLists(
            1,
            500,
            { key: keyword, property: "inOrderComm30Days", sort: "desc" },
            []
          );
        }, index * BASE_REQUEST_TIMER);
      })(index);
    })

  } else {
    alert('请输入关键词');
    return;
  }

};

function getShopFollowCount(shopId = "11568435") {
  console.log("getShopFollowCount--->shopId", shopId);
  $.ajax({
    url: `https://t.jd.com/follow/vender/qryFollowNum.do?venderId=${shopId}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    xhrFields: { withCredentials: true },
    success: function (res) {
      console.log("getShopFollowCount--->res", res);
    },
  });
};
