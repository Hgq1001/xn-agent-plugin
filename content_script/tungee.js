const INTERFACE_TIMER = 4000;

if (document.getElementById("xn-tungee-right-bar")) {
  $("#xn-tungee-right-bar").remove();
}
// <textarea id="tungee-shop-info-textarea" rows="3" class="shop-textarea" placeholder="若手动获取，则填写此项店铺名称（从表格复制店铺名称列）"/>
$("body").append(`
    <div style="position:fixed;right:0;top:150px;z-index:998;height:250px;width:450px;background-color:rgba(0,0,0,0.55);"></div>
    <div id="xn-tungee-right-bar" style="z-index:999;position:fixed;right:0;top:200px;height:250px;width:450px;overflow:hidden;outline:0;text-align:center;">
        <textarea id="tungee-keyword-textarea" rows="3" class="shop-textarea" placeholder="请输入关键词"/>
        <button type="button" onclick="getInfo();" class="get-info-button-style">获取信息(keyword)</button>
        <button type="button" onclick="getTjInfoFromExcelData();" class="get-info-button-style">获取信息(excel)</button>
    </div>
`);

// 后端接口获取店铺名称
function getAllForTj(keyword) {
  console.log("探迹关键词--->", keyword);
  let shopData = [];
  if (!keyword) {
    shopNameData = [];
  } else {
    $.ajax({
      url: `${XN_BASE_REQUEST_URL}business/opportunity/getAllForTj`,
      type: "GET",
      dataType: "json",
      async: false,
      data: {
        keyword,
      },
      contentType: "application/json",
      success: function (res) {
        console.log("获取探迹店铺名称--->", res);
        if (res.code === 200 && res.data) {
          // shopData = res.data.map((i) => i.shopName);
          shopData = res.data;
        }
      },
    });
  }

  return shopData;
}

// 更新探迹数据到后端
function saveTungeeInfo(newShopInfo, keyWord = "") {
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/opportunity/updateTj`,
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify({
      shopList: newShopInfo,
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

function getInfo() {
  const keyWordArr = getShopDataFromExcel($("#tungee-keyword-textarea").val());
  // // 1.销售提供excel店铺名称数据时,手动操作
  // var textarea_value = getShopDataFromExcel($('#tungee-shop-info-textarea').val());
  // if (textarea_value && textarea_value.length > 0) {
  //   shopNames = textarea_value;
  //   console.log("textarea_value--->", textarea_value);
  // };

  // 2.后端接口获取店铺名称
  if (keyWordArr && keyWordArr.length > 0) {
    keyWordArr.forEach((keyword, i) => {
      let tungeeShopInfoData = [];
      (function (i) {
        setTimeout(() => {
          let shopNameArr = [];
          shopNameArr = getAllForTj(keyword);
          console.log("shopNameArr店铺名称--->", shopNameArr);
          shopNameArr.forEach((shopName, index) => {
            let tungeeShopInfoDataItem = {
              shopName,
              address: "", // 网店位置
              enterpriseName: "", // 所属企业
              enterpriseId: "", // 公司id
              totalSaleQty: "", // 网店累计销量
              totalSaleAmount: "", // 网店累计销售额
              contactTj: "", // 联系方式
            };
            let shopBaseInfo = getBaseInfoForSearch(shopName);
            if (shopBaseInfo.id) {
              console.log("shopBaseInfo--->", shopBaseInfo);
              if (shopBaseInfo.lockStatus === 0) {
                unlockShop(shopBaseInfo.id);
              }
              unlockEnterprise(shopBaseInfo.id);
              let leadInfo = getShopLeadInfo(shopBaseInfo.id);
              if (leadInfo.lead_ids) {
                leadsTake(leadInfo);
              }
              let shopDetail = getShopDetail(shopBaseInfo.id);
              let businessInfo = getShopDetailInfo(shopBaseInfo.id);
              let contactsInfo = getShopContacts(shopDetail.enterpriseId);
              tungeeShopInfoDataItem = {
                ...tungeeShopInfoDataItem,
                ...shopDetail,
                ...businessInfo,
                ...contactsInfo,
              };
            } else {
              tungeeShopInfoDataItem = {
                shopName,
                address: "/", // 网店位置
                enterpriseName: "/", // 所属企业
                enterpriseId: "", // 公司id
                totalSaleQty: "/", // 网店累计销量
                totalSaleAmount: "/", // 网店累计销售额
                contactTj: "/", // 联系方式
              };
            }
            console.log(
              "tungeeShopInfoDataItem--->",
              index,
              tungeeShopInfoDataItem
            );
            tungeeShopInfoData.push(tungeeShopInfoDataItem);
            if (index === shopNameArr.length - 1) {
              // 方法一：更新数据给后端
              saveTungeeInfo(tungeeShopInfoData, keyWord);

              // 方法二：前端自动生成表格
              console.log("数据完毕--->tungeeShopInfoData", tungeeShopInfoData);
              // if (document.getElementById("shopTable")) {
              //   $("#shopTable").remove();
              // };
              // var tableElement =
              //   '<table border="1" cellspacing="0" cellpadding="0" style="display:none" id="shopTable" class="data">' +
              //   "<tr><th>店铺名称</th><th>网店位置</th><th>所属企业</th><th>网店累计销量</th><th>网店累计销售额</th><th>联系方式</th></tr>";
              // for (var i = 0; i < tungeeShopInfoData.length; i++) {
              //   tableElement +=
              //     "<tr><td>" +.
              //     tungeeShopInfoData[i].shopName +
              //     "</td><td>" +
              //     tungeeShopInfoData[i].address +
              //     "</td><td>" +
              //     tungeeShopInfoData[i].enterpriseName +
              //     "</td><td>" +
              //     tungeeShopInfoData[i].totalSaleQty +
              //     "</td><td>" +
              //     tungeeShopInfoData[i].totalSaleAmount +
              //     "</td><td>" +
              //     tungeeShopInfoData[i].contacts +
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
              //   saveAs(blob, "探迹.xls");
              // }, 200);
            }
          });
        }, i * 500);
      })(i);
    });
  } else {
    alert("请输入关键词");
    return;
  }
}

// 后端接口获取店铺名称--指定excel数据
function getAllForTjWithExcel() {
  let shopData = [];

  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/out/getTj`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      console.log("指定excel数据--->", res);
      if (res.code === 200 && res.data) {
        // shopData = res.data.map((i) => i.shopName);
        shopData = res.data.slice(0, 10);
      }
    },
  });

  return shopData;
}

// 更新探迹数据到后端--指定excel数据
function saveTungeeInfoWithExcel(newShopInfo, count) {
  $.ajax({
    url: `${XN_BASE_REQUEST_URL}business/out/updateTj`,
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify(newShopInfo),
    contentType: "application/json",
    success: function (res) {
      console.log("更新探迹保存数据--->", res);
      if (res.code === 200) {
        let nextCount = count + newShopInfo.length;
        console.log("已经更新的数量--->nextCount", nextCount);
        if (nextCount === 500) {
          alert("今天跑够了，休息一下，明天继续啊！！！！");
        } else {
          getTjInfoFromExcelData(nextCount);
        }
      }
    },
  });
}

// 销售提供指定店铺数据，去获取探迹数据
function getTjInfoFromExcelData(count = 0) {
  // 后端接口获取店铺名称
  let shopData = getAllForTjWithExcel();
  console.log("getTjInfoFromExcelData--->shopData", shopData);
  // return;
  // let shopData = [
  //   { shopName: "海尔上海之升空调专卖店", shopId: 728614 },
  //   { shopName: "奥迪双钻官方旗舰店", shopId: 109705 },
  //   { shopName: "乐开怀食品饮料专营店", shopId: 783985 },
  // ];
  let tungeeShopInfoData = [];
  shopData.forEach((shop, index) => {
    (function (index) {
      setTimeout(() => {
        // shopData = getAllForTjWithExcel(keyword);
        // shopNameArr.forEach((shopName, index) => {
        let shopName = shop.shopName;
        console.log(
          "店铺--->",
          shopName,
          "时间--->",
          moment().format("YYYY-MM-DD HH:mm:ss"),
          "index--->",
          index
        );
        let tungeeShopInfoDataItem = {
          ...shop,
          shopAddress: "", // 网店位置
          enterpriseName: "", // 所属企业
          enterpriseId: "", // 公司id
          contactTj: "", // 联系方式
        };
        let shopBaseInfo = getBaseInfoForSearch(shopName);
        if (shopBaseInfo.id && shopBaseInfo.enterpriseName) {
          let lockFlag = true; // 默认是解锁状态
          // 未解锁
          if (shopBaseInfo.lockStatus === 0) {
            // 调用解锁接口，看是否成功
            lockFlag = unlockShop(shopBaseInfo.id);
          }
          if (lockFlag) {
            unlockEnterprise(shopBaseInfo.id);
            let leadInfo = getShopLeadInfo(shopBaseInfo.id);
            if (leadInfo.lead_ids) {
              leadsTake(leadInfo);
            }
            let shopDetail = getShopDetail(shopBaseInfo.id);
            let contactsInfo = getShopContacts(shopDetail.enterpriseId);
            let enterpriseInfo = getEnterpriseInfo(shopDetail.enterpriseId);
            tungeeShopInfoDataItem = {
              ...tungeeShopInfoDataItem,
              ...shopDetail,
              ...contactsInfo,
              ...enterpriseInfo,
            };
          }
        } else {
          tungeeShopInfoDataItem = {
            ...shop,
            shopAddress: "/", // 网店位置
            enterpriseName: "/", // 所属企业
            enterpriseAddress: "/", // 企业地址
            enterpriseId: "", // 公司id
            contactTj: "/", // 联系方式
          };
        }
        tungeeShopInfoData.push(tungeeShopInfoDataItem);
        if (index === shopData.length - 1) {
          console.log("数据完毕--->tungeeShopInfoData", tungeeShopInfoData);
          // 方法一：更新数据给后端
          saveTungeeInfoWithExcel(tungeeShopInfoData, count);

          // 方法二：前端自动生成表格
          // if (document.getElementById("shopTable")) {
          //   $("#shopTable").remove();
          // }
          // var tableElement =
          //   '<table border="1" cellspacing="0" cellpadding="0" style="display:none" id="shopTable" class="data">' +
          //   "<tr><th>店铺Id</th><th>店铺名称</th><th>网店位置</th><th>所属企业</th><th>企业地址</th><th>联系方式</th></tr>";
          // for (var i = 0; i < tungeeShopInfoData.length; i++) {
          //   tableElement +=
          //     "<tr><td>" +
          //     tungeeShopInfoData[i].shopId +
          //     "</td><td>" +
          //     tungeeShopInfoData[i].shopName +
          //     "</td><td>" +
          //     tungeeShopInfoData[i].shopAddress +
          //     "</td><td>" +
          //     tungeeShopInfoData[i].enterpriseName +
          //     "</td><td>" +
          //     tungeeShopInfoData[i].enterpriseAddress +
          //     "</td><td>" +
          //     tungeeShopInfoData[i].contactTj +
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
          //   saveAs(blob, "探迹.xls");
          // }, 200);
        }
      }, index * INTERFACE_TIMER);
    })(index);
  });
}

function getTjDataCommon() {}

// 获取店铺leadInfo信息，用于调取领取线索接口
function getShopLeadInfo(id) {
  let leadInfo = {
    lead_ids: "",
    lead_pool_id: "",
  };
  if (id) {
    $.ajax({
      url: `https://sales.tungee.com/api/eshop/lead-info?eshop_id=${id}`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        if (res.stat === 1 && res.lead) {
          leadInfo.lead_ids = res.lead._id || "";
          leadInfo.lead_pool_id = res.lead.belong_to_id || "";
        }
      },
    });
  }
  return leadInfo;
}

// 领取线索接口
function leadsTake(leadInfo) {
  let isLeakTake = false;
  if (leadInfo.lead_ids) {
    var formData = new FormData();
    formData.append("lead_ids", leadInfo.lead_ids);
    formData.append("lead_pool_id", leadInfo.lead_pool_id);
    formData.append("entity_type", "enterprise");
    $.ajax({
      url: `https://sales.tungee.com/api/leads/take`,
      type: "PUT",
      dataType: "json",
      async: false,
      // contentType: "multipart/form-data",
      contentType: false,
      processData: false,
      data: formData,
      success: function (res) {
        isLeakTake = true;
      },
    });
  }
  return isLeakTake;
}

// 搜索列表-店铺解锁
function unlockShop(id) {
  let isLock = false;
  var formData = new FormData();
  formData.append("eshop_ids", id);
  $.ajax({
    url: `https://sales.tungee.com/api/eshop/unlock`,
    type: "POST",
    dataType: "json",
    async: false,
    // contentType: "multipart/form-data",
    contentType: false,
    processData: false,
    data: formData,
    success: function (res) {
      if (res.stat === 1) {
        isLock = true;
      }
    },
    error: function (res) {},
  });
  return isLock;
}

// 通过shopName去获取店铺id
function getBaseInfoForSearch(shopName) {
  var shopBaseInfo = {
    id: "",
    lockStatus: 0,
    enterpriseId: "",
    enterpriseName: "",
  };
  var formData = new FormData();
  formData.append("begin", 0);
  formData.append("end", 10);
  formData.append("keywords", shopName);
  $.ajax({
    url: `https://sales.tungee.com/api/eshop/store/search`,
    type: "POST",
    dataType: "json",
    async: false,
    // contentType: "multipart/form-data",
    contentType: false,
    processData: false,
    data: formData,
    success: function (res) {
      if (res.stat === 1) {
        if (res.data.length > 0) {
          shopBaseInfo.id = res.data[0]._id;
          shopBaseInfo.lockStatus = res.data[0].eshop_unlock;
          shopBaseInfo.enterpriseId = res.data[0].enterpriseId || "";
          shopBaseInfo.enterpriseName = res.data[0].enterpriseName || "";
        }
      }
    },
  });
  return shopBaseInfo;
}

// 解锁 公司信息
function unlockEnterprise(id) {
  if (id) {
    var formData = new FormData();
    formData.append("eshop_id", id);
    $.ajax({
      url: `https://sales.tungee.com/api/lead/eshop/unlock/enterprise`,
      type: "PUT",
      dataType: "json",
      async: false,
      // contentType: "multipart/form-data",
      contentType: false,
      processData: false,
      data: formData,
      success: function (res) {},
    });
  }
}

// 通过店铺Id获取店铺地址信息
function getShopDetail(id) {
  let shopDetail = {
    shopAddress: "",
    enterpriseName: "",
    enterpriseId: "",
  };
  if (id) {
    $.ajax({
      url: `https://sales.tungee.com/api/eshop/${id}/detail`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        if (res.stat === 1 && res.data) {
          shopDetail.shopAddress = res.data.address || "/"; // 网店位置
          shopDetail.enterpriseName = res.data.enterpriseName || "/"; // 所属企业
          shopDetail.enterpriseId = res.data.enterpriseId || ""; // 公司id
        }
      },
    });
  }
  return shopDetail;
}

// 获取联系人
function getShopContacts(enterpriseId) {
  let contactsInfo = {
    contactTj: "",
  };
  if (enterpriseId) {
    $.ajax({
      url: `https://sales.tungee.com/api/lead/contacts?enterprise_id=${enterpriseId}&type=company`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        if (res.stat === 1 && res.lead) {
          // contactType = 0 手机
          if (res.contacts) {
            let tempContacts = res.contacts
              .filter((item) => item.contactType === 0)
              .slice(0, 10);
            contactsInfo.contactTj = tempContacts
              .map((item) => {
                return `${item.contact_label}-${item.contactName || ""}，`;
              })
              .join("");
          } else {
            contactsInfo.contactTj = "/";
          }
        }
      },
    });
  } else {
    contactsInfo.contactTj = "/";
  }
  return contactsInfo;
}

// 获取企业地址
function getEnterpriseInfo(enterpriseId) {
  let enterpriseInfo = {
    enterpriseAddress: "",
  };
  if (enterpriseId) {
    $.ajax({
      url: `https://sales.tungee.com/api/enterprise/info/basic?enterprise_id=${enterpriseId}`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        if (res.stat === 1) {
          enterpriseInfo.enterpriseAddress = res.address || ""; // 企业地址
        }
      },
    });
  } else {
    enterpriseInfo.enterpriseAddress = "/";
  }
  return enterpriseInfo;
}
