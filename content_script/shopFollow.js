if (document.getElementById("xn-shopFollow-right-bar")) {
  $("#xn-shopFollow-right-bar").remove();
}
$("#container").append(`
    <div style="position:fixed;right:0;top:150px;z-index:998;height:250px;width:450px;background-color:rgba(0,0,0,0.55);"></div>
    <div id="xn-shopFollow-right-bar" style="z-index:999;position:fixed;right:0;top:200px;height:250px;width:450px;overflow:hidden;outline:0;text-align:center;">
        <textarea id="shopFollow-keyword-textarea" rows="3" class="shop-textarea" placeholder="请输入关键词"/>
        <button type="button" onclick="getShopFollowCount();" class="get-info-button-style">获取店铺粉丝数</button>
        <button type="button" onclick="getShopFollowCountFromExcel();" class="get-info-button-style">获取店铺粉丝数(excel)</button>
    </div>
`);

// shopid需要从后端获取
function getShopIdData(keyWord) {
  let shopIdData = [];
  if (keyWord) {
    $.ajax({
      url: `${XN_BASE_REQUEST_URL}business/opportunity/getAllForFollow`,
      type: "GET",
      dataType: "json",
      data: {
        keyword: keyWord,
      },
      async: false,
      contentType: "application/json",
      success: function (res) {
        console.log("获取关注的店铺ID--->", res);
        if (res.code === 200 && res.data) {
          shopIdData = res.data.map((i) => i.shopId);
        }
      },
    });
  }
  return shopIdData;
}

// 获取店铺关注数
function getFollowCount(shopId) {
  var count = "";
  if (shopId) {
    $.ajax({
      url: `https://t.jd.com/follow/vender/qryFollowNum.do?venderId=${shopId}`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        console.log("getShopFollowCount--->res", res);
        count = res.data;
      },
    });
  }
  return count;
}

// 更新店铺关注数据到后端
function saveFollowInfo(newFollowInfo, keyWord = "") {
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/opportunity/updateFollow`,
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify({
      shopList: newFollowInfo,
      keyWord,
    }),
    contentType: "application/json",
    success: function (res) {
      console.log("更新探迹保存数据--->", res);
      if (res.code === 200) {
        console.log("保存成功");
      }
    },
  });
}

// 获取关注数-关键词
function getShopFollowCount() {
  const keyWordArr = getShopDataFromExcel(
    $("#shopFollow-keyword-textarea").val()
  );
  if (keyWordArr && keyWordArr.length > 0) {
    keyWordArr.forEach((keyword, i) => {
      console.log("关注的关键词--->", keyword);
      // 从后端获取店铺id
      let shopFollowData = [];
      (function (i) {
        setTimeout(() => {
          let shopIdArr = [];
          shopIdArr = getShopIdData(keyword);
          shopIdArr.forEach((shopId, index) => {
            let followCount = getFollowCount(shopIdArr[index]);
            console.log("获取数据中--->followCount", followCount);
            shopFollowData.push({ shopId: shopId, follow: followCount });
            if (index === shopIdArr.length - 1) {
              console.log("数据完毕--->shopFollowData", shopFollowData);
              // 方法一：传数据给后端
              saveFollowInfo(shopFollowData, keyword);

              // 方法二：前端自动生成表格
              // var tableElement =
              //   '<table border="1" cellspacing="0" cellpadding="0" style="display:none" id="shopTable" class="data"><tr><th>店铺Id</th><th>关注数</th></tr>';
              // for (var i = 0; i < shopFollowData.length; i++) {
              //   tableElement +=
              //     "<tr><td>" +
              //     shopFollowData[i].shopId +
              //     "</td><td>" +
              //     shopFollowData[i].follow +
              //     "</td></tr>";
              // }
              // tableElement += "</table>";
              // $("body").append(tableElement);
              // setTimeout(() => {
              //   var blob = new Blob(
              //     [document.getElementById("shopTable").outerHTML],
              //     {
              //       type: "text/plain;charset=utf-8",
              //     }
              //   );
              //   saveAs(blob, "关注数据.xls");
              // }, 200);
            }
            //   }, index * 500);
            // })(index);
          });
        }, i * 500);
      })(i);
    });
  } else {
    alert("请输入关键词");
    return;
  }
}

// 获取店铺数据--指定excel
function getShopDataWithExcel() {
  let shopData = [];
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/out/getTjFollow`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      console.log("指定excel数据--->", res);
      if (res.code === 200 && res.data) {
        shopData = res.data.slice(0, 20);
      }
    },
  });

  return shopData;
}

// 保存关注数-指定excel
function saveFollowInfoWithExcel(shopFollowData) {
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/out/updateTjFollow`,
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify(shopFollowData),
    contentType: "application/json",
    success: function (res) {
      console.log("更新探迹保存数据--->", res);
      if (res.code === 200) {
        console.log("保存成功", new Date().getHours());
        if (new Date().getHours() === 18) {
          console.log("今天跑够了，休息一下，明天继续啊！！！！");
        } else {
          getShopFollowCountFromExcel();
        }
      }
    },
  });
}

// 获取关注数-指定excel
function getShopFollowCountFromExcel() {
  // 后端接口获取店铺名称
  let shopData = getShopDataWithExcel();
  console.log("getShopDataWithExcel--->shopData", shopData);
  let shopFollowData = [];
  shopData.forEach((shop, index) => {
    (function (index) {
      setTimeout(() => {
        console.log(
          "店铺--->",
          shop.shopName,
          "时间--->",
          moment().format("YYYY-MM-DD HH:mm:ss"),
          "index--->",
          index
        );
        let followCount = getFollowCount(shop.shopId);
        console.log("获取数据中--->followCount", followCount);
        shopFollowData.push({ ...shop, follow: followCount });
        if (index === shopData.length - 1) {
          console.log("数据完毕--->shopFollowData", shopFollowData);
          // 方法一：传数据给后端
          saveFollowInfoWithExcel(shopFollowData);

          // 方法二：前端自动生成表格
          // var tableElement =
          //   '<table border="1" cellspacing="0" cellpadding="0" style="display:none" id="shopTable" class="data"><tr><th>店铺Id</th><th>关注数</th></tr>';
          // for (var i = 0; i < shopFollowData.length; i++) {
          //   tableElement +=
          //     "<tr><td>" +
          //     shopFollowData[i].shopId +
          //     "</td><td>" +
          //     shopFollowData[i].follow +
          //     "</td></tr>";
          // }
          // tableElement += "</table>";
          // $("body").append(tableElement);
          // setTimeout(() => {
          //   var blob = new Blob(
          //     [document.getElementById("shopTable").outerHTML],
          //     {
          //       type: "text/plain;charset=utf-8",
          //     }
          //   );
          //   saveAs(blob, "关注数据.xls");
          // }, 200);
        }
      }, index * 1000);
    })(index);
  });
}
