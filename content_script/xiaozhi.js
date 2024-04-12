var pin = $.cookie("pin");
var user = $.cookie("xn_user");
var xn_token = $.cookie("xn_token");
var operator = {
  dengzhongzhuan: "XT",
};

var ADD_TASK_LESS_THAN_3_TIMER = 2000; // 当任务总数小于3个时，创建任务时间间隔为2s
var ADD_TASK_TIMER = 3800; // 20次/分 600次/小时 1000次/天
var ADD_TASK_COUNT_PER_MINUTE = 60000 / ADD_TASK_TIMER; // 每分钟发多少个任务
var BASE_REQUEST_TIMER = 3000; // 拉数据时，请求时间间隔

var BASE_REQUEST_URL = "https://oper.xiaoneng.cn/oper/"; // 接口地址前缀-生产环境
// var BASE_REQUEST_URL = "https://cd-uat.xiaoneng.cn/oper/"; // 接口地址前缀-测试环境

var CITY_LEVEL_LABEL_ID = 282; // 所在城市级别
var BRAND_MEMBER_LABEL_ID = 170; // 用户是店铺/品牌会员
var PLUS_MEMBER_LABEL_ID = 353; // 用户是京东PLUS会员
var ADDRESS_LABEL_ID = 173; // 常用收货地址-labelId
var COMMON_WAYS_OF_ORDER_APP_ID = 362; //  常用下单途径-APP id
var COMMON_WAYS_OF_ORDER_APP_LABEL_ID = 214; //  常用下单途径-APP labelId
var SHOP_LIU_LAN_30_DAYS_LABEL_ID = 101; //  店铺30日浏览 labelId
var TOUCHED_LABEL_ID = 226; //已触达标签 labelId
var COMMON_WAYS_OF_ORDER_APP_LABEL_VALUE = "app&m"; //  常用下单途径-APP labelId

var MAX_PERIOD = 4; // 任务效果分析数据-最大period

var MAX_TOUCHED_DAYS_SEND = 30; // 排除已触达用户最大天数
var MAX_TOUCHED_TASK_ID_LENGTH = 10; // 排除已触达用户最大任务数
var MIN_SKU_AND_SHOP_LENGTH = 5; // 商品标签最小sku个数/店铺标签最小shopId个数
var MAX_SKU_LENGTH = 99; // 商品标签最大sku个数
var MAX_SHOP_ID_LENGTH = 20; // 单个店铺标签最大shopId个数
var MAX_SKU_LENGTH_FOR_ONCE_TASK = 1000; // 每次任务SKU最大数量
var MAX_SEARCH_LABEL_KEYWORD_LENGTH = 10; // 单个搜索标签下最大关键词数 10

var EXCLUDE_DAYS_LIU_LAN = ["1", "3", "7", "15", "30"]; // 商品标签-浏览 天数
var EXCLUDE_DAYS_JIA_GOU_ADN_FU_KUAN = ["1", "3", "7", "15", "30", "60", "90"]; // 商品标签-付款-加购 天数
let COMPARE_CONFIG = {
  gte: "大于等于 ",
  lte: "介于 "
}; // 比较

const USER_DATA_SOURCE_PIN_UPLOAD = 1; // 上传买家pin或手机号
const USER_DATA_SOURCE_TAG = 2; // 标签
const USER_DATA_SOURCE_PIN_ENTER = 3; // 输入买家pin
const USER_DATA_SOURCE_SMART_RINGER = 4; // 智能圈选

var crowdOptions_ = {}; // 存放人群包id

const isUat = window.location.hostname.includes("uat"); // 是否是uat环境

const TEMPLATE_TEXT = {
  咚咚: "dd",
  短信: "sms",
};

var sendMaxConfig = {}; // 发送上限配置

// 实时标签配置
var REAL_TIME_LABEL_CONFIG = {
  商品实时浏览: {
    labelId: 223,
    labelOptionType: 5,
  },
  商品实时付款: {
    labelId: 220,
    labelOptionType: 5,
  },
  商品实时加购: {
    labelId: 217,
    labelOptionType: 5,
  },
  店铺实时浏览: {
    labelId: 221,
    labelOptionType: 6,
  },
  店铺实时付款: {
    labelId: 218,
    labelOptionType: 6,
  },
  店铺实时加购: {
    labelId: 215,
    labelOptionType: 6,
  },
  品类实时浏览: {
    labelId: 222,
    labelOptionType: 11,
  },
  品类实时付款: {
    labelId: 219,
    labelOptionType: 11,
  },
  品类实时加购: {
    labelId: 216,
    labelOptionType: 11,
  },
  实时搜索: {
    labelId: 225,
    labelOptionType: 7,
  },
};

// 标签配置
var LABEL_OPTION_CONFIG = {
  // 商品
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
  // 店铺
  店铺浏览: {
    1: 97,
    3: 99,
    7: 98,
    15: 100,
    30: 101,
  },
  店铺加购: {
    1: 102,
    3: 103,
    7: 104,
    15: 105,
    30: 106,
    60: 107,
    90: 108,
  },
  店铺付款: {
    1: 123,
    3: 124,
    7: 125,
    15: 126,
    30: 127,
    60: 128,
    90: 129,
    180: 224,
    360: 259,
    720: 260,
  },
  店铺咨询: {
    1: 109,
    3: 110,
    7: 111,
    15: 112,
    30: 113,
    60: 114,
    90: 115,
  },
  店铺关注: {
    1: 116,
    3: 117,
    7: 118,
    15: 119,
    30: 120,
    60: 121,
    90: 122,
  },
  搜索: {
    3: 174,
    7: 175,
    15: 176,
    30: 177,
  },
  // 品类付款
  品类: {
    1: 153,
    3: 154,
    7: 155,
    15: 156,
    30: 157,
    60: 158,
    90: 159,
    180: 266,
    360: 267,
    720: 268,
  },
  // 品类付款
  品类付款: {
    1: 153,
    3: 154,
    7: 155,
    15: 156,
    30: 157,
    60: 158,
    90: 159,
    180: 266,
    360: 267,
    720: 268,
  },
  // // 品类浏览-uat
  // 品类浏览: {
  //   1: 164,
  //   3: 165,
  //   7: 166,
  //   15: 167,
  //   30: 168,
  // },
  // 品类浏览-producat
  品类浏览: {
    1: 162,
    3: 163,
    7: 164,
    15: 165,
    30: 166,
  },
  // 品类加购
  品类加购: {
    1: 139,
    3: 140,
    7: 141,
    15: 142,
    30: 143,
    60: 144,
    90: 145,
  },
  购买力: {
    土豪: {
      id: 314,
      labelId: 179,
      value: "1",
    },
    高级白领: {
      id: 315,
      labelId: 179,
      value: "2",
    },
    小白领: {
      id: 316,
      labelId: 179,
      value: "3",
    },
    蓝领: {
      id: 317,
      labelId: 179,
      value: "4",
    },
    收入很少: {
      id: 318,
      labelId: 179,
      value: "5",
    },
  },
  婚姻状况: {
    未婚: {
      id: 327,
      labelId: 181,
      value: "未婚",
    },
    已婚: {
      id: 328,
      labelId: 181,
      value: "已婚",
    },
  },
  学历: {
    初中及以下: {
      id: 349,
      labelId: 211,
      value: "1",
    },
    "高中(中专)": {
      id: 350,
      labelId: 211,
      value: "2",
    },
    "大学(专科及本科)": {
      id: 351,
      labelId: 211,
      value: "3",
    },
    "研究生(硕士及以上)": {
      id: 352,
      labelId: 211,
      value: "4",
    },
  },
  职业: {
    "个体经营/服务业": {
      id: 353,
      labelId: 212,
      value: "1",
    },
    公司职员: {
      id: 354,
      labelId: 212,
      value: "2",
    },
    工人: {
      id: 355,
      labelId: 212,
      value: "3",
    },
    公务员: {
      id: 356,
      labelId: 212,
      value: "4",
    },
    医务人员: {
      id: 357,
      labelId: 212,
      value: "5",
    },
    学生: {
      id: 358,
      labelId: 212,
      value: "6",
    },
    教职工: {
      id: 359,
      labelId: 212,
      value: "7",
    },
  },
  店铺会员: {
    是: {
      id: 275,
      labelId: 169,
      value: "1",
    },
  },
  用户级别: {
    注册会员: {
      id: 319,
      labelId: 180,
      value: "注册会员",
    },
    铜牌会员: {
      id: 320,
      labelId: 180,
      value: "铜牌会员",
    },
    银牌会员: {
      id: 321,
      labelId: 180,
      value: "银牌会员",
    },
    金牌会员: {
      id: 322,
      labelId: 180,
      value: "金牌会员",
    },
    钻石会员: {
      id: 323,
      labelId: 180,
      value: "钻石会员",
    },
    易迅会员: {
      id: 324,
      labelId: 180,
      value: "易迅会员",
    },
    VIP会员: {
      id: 325,
      labelId: 180,
      value: "VIP会员",
    },
  },
  小孩年龄: {
    "孕期0-3个月": {
      id: 367,
      labelId: 255,
      value: "0",
    },
    "孕期4-6个月": {
      id: 368,
      labelId: 255,
      value: "1",
    },
    "孕期7-9个月": {
      id: 369,
      labelId: 255,
      value: "2",
    },
    "0-3个月": {
      id: 370,
      labelId: 255,
      value: "3",
    },
    "4-6个月": {
      id: 371,
      labelId: 255,
      value: "4",
    },
    "7-9月": {
      id: 372,
      labelId: 255,
      value: "5",
    },
    "10-12月": {
      id: 373,
      labelId: 255,
      value: "6",
    },
    "13-18月": {
      id: 374,
      labelId: 255,
      value: "7",
    },
    "19-24月": {
      id: 375,
      labelId: 255,
      value: "8",
    },
    "25-36月": {
      id: 376,
      labelId: 255,
      value: "9",
    },
    "3岁（37-48月）": {
      id: 377,
      labelId: 255,
      value: "10",
    },
    "4岁（49-59月）": {
      id: 378,
      labelId: 255,
      value: "11",
    },
    "5-6岁（60-71月）": {
      id: 379,
      labelId: 255,
      value: "12",
    },
    "7-12岁": {
      id: 380,
      labelId: 255,
      value: "13",
    },
    "13-14岁": {
      id: 381,
      labelId: 255,
      value: "14",
    },
  },
  性别: {
    男: {
      id: 360,
      labelId: 213,
      value: "男",
    },
    女: {
      id: 361,
      labelId: 213,
      value: "女",
    },
  },
  年龄: {
    "0-15岁": {
      id: 382,
      labelId: 256,
      value: "0",
    },
    "16-20岁": {
      id: 383,
      labelId: 256,
      value: "1",
    },
    "21-25岁": {
      id: 384,
      labelId: 256,
      value: "2",
    },
    "26-30岁": {
      id: 385,
      labelId: 256,
      value: "3",
    },
    "31-35岁": {
      id: 386,
      labelId: 256,
      value: "4",
    },
    "36-40岁": {
      id: 387,
      labelId: 256,
      value: "5",
    },
    "41-45岁": {
      id: 388,
      labelId: 256,
      value: "6",
    },
    "46-50岁": {
      id: 389,
      labelId: 256,
      value: "7",
    },
    "51-55岁": {
      id: 390,
      labelId: 256,
      value: "8",
    },
    "56-60岁": {
      id: 391,
      labelId: 256,
      value: "9",
    },
    "61-65岁": {
      id: 392,
      labelId: 256,
      value: "10",
    },
    "66-70岁": {
      id: 393,
      labelId: 256,
      value: "11",
    },
    "70岁以上": {
      id: 394,
      labelId: 256,
      value: "12",
    },
  },
  RFM全品类: {
    重要价值客户: {
      id: 337,
      labelId: 209,
      value: "rfm1_重要价值客户",
    },
    重要发展客户: {
      id: 338,
      labelId: 209,
      value: "rfm2_重要发展客户",
    },
    重要保持客户: {
      id: 339,
      labelId: 209,
      value: "rfm3_重要保持客户",
    },
    重要挽留客户: {
      id: 340,
      labelId: 209,
      value: "rfm4_重要挽留客户",
    },
    一般价值客户: {
      id: 341,
      labelId: 209,
      value: "rfm5_一般价值客户",
    },
    一般发展客户: {
      id: 342,
      labelId: 209,
      value: "rfm6_一般发展客户",
    },
    一般保持客户: {
      id: 343,
      labelId: 209,
      value: "rfm7_一般保持客户",
    },
    一般挽留客户: {
      id: 344,
      labelId: 209,
      value: "rfm8_一般挽留客户",
    },
  },
  用户价值: {
    价值低: {
      id: 345,
      labelId: 210,
      value: "价值低",
    },
    价值中: {
      id: 346,
      labelId: 210,
      value: "价值中",
    },
    价值高: {
      id: 347,
      labelId: 210,
      value: "价值高",
    },
    非常高: {
      id: 348,
      labelId: 210,
      value: "非常高",
    },
  },
  忠诚度: {
    "高度-忠诚型": {
      id: 329,
      labelId: 182,
      value: "高度-忠诚型",
    },
    "中度-忠诚型": {
      id: 330,
      labelId: 182,
      value: "中度-忠诚型",
    },
    "近期-普通型": {
      id: 331,
      labelId: 182,
      value: "近期-普通型",
    },
    "远期-普通型": {
      id: 332,
      labelId: 182,
      value: "远期-普通型",
    },
    "近期-偶然型": {
      id: 333,
      labelId: 182,
      value: "近期-偶然型",
    },
    "近期-投机型": {
      id: 334,
      labelId: 182,
      value: "近期-投机型",
    },
    "远期-偶然型": {
      id: 335,
      labelId: 182,
      value: "远期-偶然型",
    },
    "远期-投机型": {
      id: 336,
      labelId: 182,
      value: "远期-投机型",
    },
  },
  "促销敏感度-近一年有复购用户": {
    不敏感: {
      id: "L1-1",
      labelId: 172,
      value: "L1-1",
    },
    轻度敏感: {
      id: "L1-2",
      labelId: 172,
      value: "L1-2",
    },
    中度敏感: {
      id: "L1-3",
      labelId: 172,
      value: "L1-3",
    },
    高度敏感: {
      id: "L1-4",
      labelId: 172,
      value: "L1-4",
    },
    极度敏感: {
      id: "L1-5",
      labelId: 172,
      value: "L1-5",
    },
  },
  "促销敏感度-近一年无复购用户": {
    不敏感: {
      value: "L2-1",
      labelId: 172,
      value: "L2-1",
    },
    轻度敏感: {
      id: "L2-2",
      labelId: 172,
      value: "L2-2",
    },
    中度敏感: {
      id: "L2-3",
      labelId: 172,
      value: "L2-3",
    },
    高度敏感: {
      id: "L2-4",
      labelId: 172,
      value: "L2-4",
    },
    极度敏感: {
      id: "L2-5",
      labelId: 172,
      value: "L2-5",
    },
  },
  "促销敏感度-一年前有复购用户": {
    不敏感: {
      id: "L3-1",
      labelId: 172,
      value: "L3-1",
    },
    轻度敏感: {
      id: "L3-2",
      labelId: 172,
      value: "L3-2",
    },
    中度敏感: {
      id: "L3-3",
      labelId: 172,
      value: "L3-3",
    },
    高度敏感: {
      id: "L3-4",
      labelId: 172,
      value: "L4-4",
    },
    极度敏感: {
      id: "L3-5",
      labelId: 172,
      value: "L5-5",
    },
  },
  "促销敏感度-一年前无复购用户": {
    不敏感: {
      id: "L4-1",
      labelId: 172,
      value: "L4-1",
    },
    轻度敏感: {
      id: "L4-2",
      labelId: 172,
      value: "L4-2",
    },
    中度敏感: {
      id: "L4-3",
      labelId: 172,
      value: "L4-3",
    },
    高度敏感: {
      id: "L4-4",
      labelId: 172,
      value: "L4-4",
    },
    极度敏感: {
      id: "L4-5",
      labelId: 172,
      value: "L4-5",
    },
  },
  所在城市级别: {
    一线城市: {
      id: "410",
      labelId: 282,
      value: "一线城市",
    },
    二线城市: {
      id: "411",
      labelId: 282,
      value: "二线城市",
    },
    三线城市: {
      id: "412",
      labelId: 282,
      value: "三线城市",
    },
    四线城市: {
      id: "413",
      labelId: 282,
      value: "一线城市",
    },
    五线城市: {
      id: "414",
      labelId: 282,
      value: "五线城市",
    },
  },
};

window.addEventListener(
  "message",
  function (e) {
    if (e.data) {
      const {
        render,
        result
      } = e.data;
      if (render) {
        renderUI(result);
      }
    }
  },
  false
);

function globalPostMessage({
  url,
  type,
  api,
  params,
  headers,
  ...props
}) {
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
  const {
    api
  } = result;
  switch (api) {
    case "login": // 登录
      loginToRender(result);
      break;
    case "taskLastUpdateDate": // 查询上次任务数据更新情况
      taskLastUpdateDateToRender(result);
      break;
    case "taskUpdate": // 更新任务数据
      taskUpdateToRender(result);
      break;
    case "statsLastUpdateDate": // 查询上次任务效果分析数据更新情况
      statsLastUpdateDateToRender(result);
      break;
    case "statsUpdate": // 更新任务效果分析数据
      statsUpdateToRender(result);
      break;
    case "getSkuInfo": // 查询sku相关信息
      getSkuInfoToRender(result);
      break;
    case "importTask": // 导入任务
      importTaskToRender(result);
      break;
    default:
  }
}

$("body").append(`
    <div class="tip-box" id="tip-box">
      <div class="tip-inner-box">
        <span class="tip-icon">X</span>
        <span class="tip-txt" id="tip-txt"></span>
      </div>
    </div>
`);

// 登录相关-start
$("body").append(`
    <div id="user-info-text" class="user-info-box">未登录</div>
    <div id="login-wrap" class="wrap">
        <div class="login-box">
            <span id="close-login-box" class="icon-close">X</span>
            <h2>登录</h2>
            <form action="" method="post" id="form">
                <input id="account-input"  type="text" class="input ant-input" style="margin-bottom:10px" placeholder="账号" />
                <input id="password-input"  type="password" class="input ant-input" placeholder="密码" />
                <button id="login-btn" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z">登 录</button>
                <button id="login-cancel-btn" type="button" class="ant-btn">取 消</button>
            </form>
        </div>
    </div>
`);

if ($(".search-box___SIbW").length > 0 && $("#xzh-btn-edit-task").length == 0) {
  $(".search-box___SIbW").append(
    `<button id="xzh-btn-delete-task" type="button" class="ant-btn css-r3n9ey ant-btn-default button__Q1Ng3 xz-button__Dw8L6 button-type-primary__R405K"><span>批量删除任务</span></button>`
  );
}

$("#xzh-btn-delete-task").bind("click", function () {
  let sHtml = `
    <div>
      删除任务，从第 <input id="startPage" type="text" placeholder="开始页码" /> 页，到第 <input id="endPage" type="text" placeholder="结束页码" /> 页
      <button id="batch-delete-task" onclick="batchDeleteTask();" type="button" class="ant-btn">删除</button>
      <span style="color:red;font-size:12px">页码均为数字，开始页码必填，结束页码若不填，则默认删除开始页码的任务！</span>
    </div>
  `;
  showMasker(sHtml);
});

// 批量修改执行时间
if ($(".search-box__TisDE").length > 0 && $("#xzh-btn-edit-task").length == 0) {
  $(".search-box__TisDE").append(
    `<button id="xzh-btn-edit-task" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>批量修改任务/再营销</span></button>`
  );
}

$("#xzh-btn-edit-task").bind("click", function () {
  var sHtml = `<style>
    #tablist ul,#tablist li{list-style:none}#tablist ul{overflow:hidden}#tablist li{float:left;color:#333;padding:4px 40px;margin-right:8px;cursor:pointer;border:1px solid #ccc;transition:all ease .3s}.box{width:88%;margin:8px;position:relative}#tablist li:hover{background:#44ac55;color:#fff}#tablist li.tabin{border:1px solid #079982;background:#079982;color:#fff}.content-box{width:100%;height:180px;background:#eee;position:absolute;left:0;top:30px;overflow:hidden;border:1px solid #079982}.content{clear:both;color:#333;padding:10px;display:none;position:absolute;top:0;left:0}.content-box .contentin{display:block;}.content h1{font-size:18px;margin-bottom:20px;margin-top:20px}.content p{font-size:12px;margin:4px 12px}.content p span.title{font-weight:bold;color:#999}
    table.data th{padding:0;}table.data tr.total td{background-color:#ffe}table.data tr td.percent{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWM4/f/8fwAIywOZbbg6KgAAAABJRU5ErkJggg==);background-repeat:no-repeat;background-size:1px 50%;background-position:center left;background-color:#f3fdf6;}table.data tr td.percent.percent_red{background-color:#ffecee;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4f/rCfwAJAQOaUJXpYAAAAABJRU5ErkJggg==);}</style>

      <div style="padding:8px">
      加载第
      <input id="xzh-data-page-start" style="width:36px;padding:0 2px;text-align:center" class="ant-input" value="1" />
      到
      <input id="xzh-data-page" style="width:36px;padding:0 2px;text-align:center" class="ant-input" value="1" />
      页任务，
      关键词/任务名：<input id="xzh-data-keyword" style="width:150px;padding:0 2px;text-align:left" class="ant-input" value="" />
      <label><input style="margin-left: 10px; margin-right:4px" id="groupby" name="groupby" type="checkbox" value="1" />按商品类目归类</label>
      <button id="xzh-btn-load-task-data" style="margin-left: 10px" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>立即获取</span></button></div>
      
      <div class="taskTableWrapper"></div>

      <div class="box">
          <ul id="tablist">
              <li class="tabin">批量修改任务时间</li>
              <li>批量修改任务发送上限</li>
              <li>批量再营销</li>
          </ul>
          <div class="content-box">
              <div class="content contentin">
                <p><span class="title">开始时间：</span><input id="xzh-data-task-time" style="color:red;width:148px;padding:0 2px;text-align:center" class="ant-input" /></p>
                <p><span class="title">任务分布：</span>每分钟<input id="xzh-data-task-diff" style="color:red;width:48px;padding:0 2px;text-align:center" class="ant-input" value="10" />个</p>
                <p><button id="xzh-btn-update-task" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span> 立即批量修改任务时间 </span></button></p>
              </div>
              <div class="content">
                 <p><span class="title">发送上限：</span><input id="xzh-data-task-send-upper-limit" style="color:red;width:48px;padding:0 2px;text-align:center" class="ant-input" value="1000" />人</p>
                <p><button id="xzh-btn-update-task-send-limit" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span> 立即批量修改任务发送上限 </span></button></p>
              </div>
              <div class="content">
                <p><span class="title">任务名称：</span>原标题+<input id="xzh-data-retask-title" style="color:red;width:148px;padding:0 2px;text-align:center" class="ant-input" /></p>
                <p><span class="title">开始时间：</span>从<input id="xzh-data-retask-time" style="color:red;width:148px;padding:0 2px;text-align:center" class="ant-input" />开始，每分钟<input id="xzh-data-retask-diff" style="color:red;width:48px;padding:0 2px;text-align:center" class="ant-input" value="10" />个</p>
                <p><span class="title">发送咚咚内容：</span><input id="xzh-data-retask-content-dd" style="color:red;width:168px;padding:0 2px;text-align:center" class="ant-input" placeholder="咚咚编号，可以不填" /></p>
                <p><span class="title">发送短息内容：</span><input id="xzh-data-retask-content-sms" style="color:red;width:168px;padding:0 2px;text-align:center" class="ant-input" placeholder="短信编号，可以不填" /></p>
                <p id="xzh-data-retask-user"><span class="title">发送用户：</span>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="1"><span class="ant-checkbox-inner"></span></span><span>发送失败</span></label>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="2"><span class="ant-checkbox-inner"></span></span><span>发送成功未产生任何行为</span></label>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="3"><span class="ant-checkbox-inner"></span></span><span>浏览未下单</span></label>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="4"><span class="ant-checkbox-inner"></span></span><span>加购未下单</span></label>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="5"><span class="ant-checkbox-inner"></span></span><span>咨询未下单</span></label>
                  <label class="ant-checkbox-wrapper checkbox__3vNvP no-margin-left__16oxp"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input" value="6"><span class="ant-checkbox-inner"></span></span><span>关注未下单</span></label>
                </p>
                <p><button id="xzh-btn-add-retask" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span> 批量创建再营销任务 </span></button></p>
              </div>
          </div>
      </div>

      `;
  showMasker(sHtml);

  $(".box").hide();

  $(".ant-checkbox-wrapper input:checkbox").bind("click", function () {
    $(this).parent().toggleClass("ant-checkbox-checked");
  });

  $("#tablist li").each(function (index) {
    $(this).click(function () {
      $(".contentin").removeClass("contentin");
      $(".tabin").removeClass("tabin");
      $(".content-box div").eq(index).addClass("contentin");
      $(this).addClass("tabin");
    });
  });
  var tableHtml = `<table class="data">
    <tr><th width="10%">#</th><th width="15%">任务ID</th><th width="20%">任务名</th><th width="10%">发送人数</th><th width="10%">发送上限</th><th width="10%">任务状态</th><th width="15%">开始时间</th><th width="10%">操作</th></tr>
  </table>`;
  var update_data = {};
  var tableData = [];

  $("#xzh-btn-load-task-data").bind("click", function () {
    var page = $("#xzh-data-page").val();
    const keyword = $("#xzh-data-keyword").val();
    var start_page = $("#xzh-data-page-start").val();
    getTaskDataByPage(page, keyword).then((data) => {
      data = data.result;
      // 加载数据到页面
      // console.log(data);
      var startCount = keyword ? 0 : (start_page - 1) * 10;
      tableData = data.slice(startCount);
      update_data = renderTaskTable(startCount, data, tableHtml);
    });
  });
  //批量修改任务时间
  $("#xzh-btn-update-task").bind("click", function () {
    $(this).remove();
    var start_time = new Date($("#xzh-data-task-time").val());
    console.log("start_time", start_time);
    var i = 0;
    for (let id in update_data) {
      if (i % $("#xzh-data-task-diff").val() == 0) {
        start_time = new Date(start_time.getTime() + 60 * 1000);
        // console.log("Add 1", start_time);
      }
      update_data[id].execRule = start_time.format("mm hh dd MM ? yyyy");
      // console.log(update_data[id]);

      setTimeout(() => {
        $.ajax({
          url: "/mkt/api/mt/task/update",
          type: "PUT",
          dataType: "json",
          data: JSON.stringify(update_data[id]),
          contentType: "application/json",
          success: function (res) {
            $("table.data tr[data-id=" + id + "] td:has(a)").text(
              res.data ? res.data : res.result
            );
          },
        });
      }, i * 5000);
      i++;
    }
  });

  //批量修改任务发送上限
  $("#xzh-btn-update-task-send-limit").bind("click", function () {
    const sendUpperLimit = $("#xzh-data-task-send-upper-limit").val();
    console.log("sendUpperLimit--->", sendUpperLimit);
    console.log("update_data--->", update_data);
    if (sendUpperLimit < 1000) {
      alert("发送上限必须大于1000！");
      return;
    }
    $(this).remove();
    var i = 0;
    for (let id in update_data) {
      // update_data[id].maxPinCount = sendUpperLimit;
      update_data[id].maxPinCount = $(
        "table.data tr[data-id=" + id + "] td input.maxPinCount"
      ).val();
      update_data[id].maxPinCount = update_data[id].maxPinCount ?
        update_data[id].maxPinCount :
        sendUpperLimit;
      console.log(update_data[id]);

      setTimeout(() => {
        $.ajax({
          url: "/mkt/api/mt/task/update",
          type: "PUT",
          dataType: "json",
          data: JSON.stringify(update_data[id]),
          contentType: "application/json",
          success: function (res) {
            $("table.data tr[data-id=" + id + "] td:has(a)").text(
              res.data ? res.data : res.result
            );
          },
        });
      }, i * 5000);
      i++;
    }
  });

  //批量再营销
  $("#xzh-btn-add-retask").bind("click", function () {
    $(this).remove();
    var start_time = new Date($("#xzh-data-retask-time").val());
    console.log("start_time", start_time);
    var i = 0;
    for (let id in update_data) {
      setTimeout(() => {
        if (i % $("#xzh-data-retask-diff").val() == 0) {
          start_time = new Date(start_time.getTime() + 60 * 1000);
        }
        update_data[id].execRule = start_time.format("mm hh dd MM ? yyyy");

        var reMarketingRule = [];
        $("#xzh-data-retask-user input:checked").each(function (
          index,
          element
        ) {
          reMarketingRule.push($(element).val());
        });
        var data = {
          name: update_data[id].name + $("#xzh-data-retask-title").val(),
          taskType: update_data[id].taskType,
          execRule: update_data[id].execRule,
          channel: update_data[id].channel,
          isCopyTask: false,
          parentId: update_data[id].id,
          abType: update_data[id].abType,
          reMarketingRule: reMarketingRule,
          pinCount: update_data[id].pinCount,
          maxPinCount: update_data[id].maxPinCount,
        };

        var dd_template_id = Number($("#xzh-data-retask-content-dd").val());
        var sms_template_id = Number($("#xzh-data-retask-content-sms").val());
        if (dd_template_id || sms_template_id) {
          data.channel.dd_template_id = dd_template_id;
          data.channel.sms_template_id = sms_template_id;

          if (dd_template_id) {
            data.channel.sequence = {
              1: "dd:1",
              2: "sms:0",
            };
          }
          if (sms_template_id) {
            data.channel.sequence = {
              1: "dd:0",
              2: "sms:1",
            };
          }
        }
        $.ajax({
          url: "/mkt/api/mt/task/re/add",
          type: "POST",
          dataType: "json",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: function (res) {
            $("table.data tr[data-id=" + id + "] td:has(a)").text(
              res.data ? res.data : res.result
            );
          },
        });
      }, i * 5000);
      i++;
    }
  });
});

function batchDeleteTask() {
  let reg = /^[1-9]+[0-9]*$/;
  const startPage = $("#startPage").val();
  console.log("startPage-->", startPage);
  const endPage = $("#endPage").val();
  console.log("endPage-->", endPage);
  if (!startPage || !reg.test(startPage)) {
    alert("请输入正确的开始页码！");
    return;
  }
  if (endPage && !reg.test(endPage)) {
    alert("请输入正确的结束页码！");
    return;
  }
  getTaskList(Number(startPage), Number(endPage), []);
  $("#batch-delete-task").css("display", "none");
}

function getTaskList(startPage = 1, endPage, list = []) {
  let taskList = [...list];
  $.ajax({
    url: `/mkt/api/mt/task/list?page=${startPage}&pageSize=10&keyword=&type=1`,
    type: "GET",
    dataType: "json",
    // async: false,
    contentType: "application/json",
    success: function (res) {
      if (res.data) {
        const {
          result,
          pageCount,
          currentPage
        } = res.data;
        taskList = [...taskList, ...result];
        if (currentPage === endPage || pageCount === currentPage) {
          let taskIds = taskList.map((task) => task.id);
          deleteTask(taskIds);
        } else {
          const nextPage = startPage + 1;
          getTaskList(nextPage, endPage, taskList);
        }
      }
    },
  });
}

function deleteTask(ids) {
  console.log("deleteTask--->", ids);
  if (ids.length) {
    ids.forEach((id, index) => {
      (function (index) {
        setTimeout(() => {
          $.ajax({
            url: `/mkt/api/mt/task/delete/${id}`,
            type: "delete",
            dataType: "json",
            // async: false,
            contentType: "application/json",
            success: function (res) {
              if (index === ids.length - 1) {
                $("#batch-delete-task").css("display", "inline-flex");
                alert("任务删除完毕！");
              }
            },
          });
        }, index * 200);
      })(index);
    });
  }
}

// 获取智能筛选列表
function getAiList() {
  $.ajax({
    url: "/mkt/api/canvas/view/ai/list/2",
    type: "GET",
    dataType: "json",
    success: function (res) {
      localStorage.setItem("aiList", JSON.stringify(res.data));
    },
  });
}

// 获取小智账号信息
function getUserInfo() {
  console.log('getUserInfo--->111')
  $.ajax({
    url: "/mkt/api/session/context",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log('getUserInfo--->', res)
      const {
        botId,
        venderId,
        venderName
      } = res.data;
      localStorage.setItem("botId", botId);
      localStorage.setItem("venderId", venderId);
      localStorage.setItem("venderName", venderName);
    },
  });
}

// 设置发送上限
function setSendMax() {
  const params = {
    mtBudgetSwitch: 1,
    ddMax: sendMaxConfig["咚咚"] || "",
    richDdMax: sendMaxConfig["富媒体咚咚"] || "",
    smsMax: sendMaxConfig["短信"] || "",
    richSmsMax: sendMaxConfig["富媒体短信"] || "",
    callMax: "",
  };
  $.ajax({
    url: "/mkt/api/mt/config/budget/update",
    type: "PUT",
    async: false,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(params),
    success: function (res) {
      console.log("setSendMax--->", res);
    },
  });
}

// 获取发送上限
function getBudget() {
  console.log("getBudget--->11111");
  let trafficBudget = null;
  $.ajax({
    url: "/mkt/api/mt/config/budget/query",
    type: "GET",
    async: false,
    dataType: "json",
    success: function (res) {
      console.log("getBudget--->budget", res);
      const {
        ddMax,
        richDdMax,
        smsMax,
        richSmsMax
      } = res.data
      trafficBudget = {
        ddMax,
        richDdMax,
        smsMax,
        richSmsMax
      }
    },
  });
  return trafficBudget
}

// 获取流量单价详情
function getPriceDetail() {
  console.log("getBudget--->11111");
  let priceDetail = null;
  $.ajax({
    url: "/mkt/api/mt/config/price/detail",
    type: "GET",
    async: false,
    dataType: "json",
    success: function (res) {
      console.log("getPriceDetail--->priceDetail", res);
      const {
        ddPriceBig,
        richDdPriceBig,
        smsPriceBig,
        richSmsPriceBig
      } = res.data
      priceDetail = {
        ddPriceBig,
        richDdPriceBig,
        smsPriceBig,
        richSmsPriceBig
      }
    },
  });
  return priceDetail
}

// 计算当日营销成本
function getMaxMarketingCost() {
  let trafficBudget = getBudget();
  let priceDetail = getPriceDetail();
  let dailyMarketingCostsElement;
  if (!trafficBudget) {
    dailyMarketingCostsElement = `<div style="min-width:250px;color:red;font-size:22px">当日营销成本：因发送上限无法获取，故无法计算成本</div>`;
  } else if (!priceDetail) {
    dailyMarketingCostsElement = `<div style="min-width:250px;color:red;font-size:22px">当日营销成本：因单价无法获取，故无法计算成本</div>`;
  } else {
    let {
      ddMax,
      richDdMax,
      smsMax,
      richSmsMax
    } = trafficBudget
    let {
      ddPriceBig,
      richDdPriceBig,
      smsPriceBig,
      richSmsPriceBig
    } = priceDetail;
    const dailyMarketingCosts = ddPriceBig * (ddMax > 1000 ? ddMax : 0) +
      richDdPriceBig * (richDdMax > 1000 ? richDdMax : 0) +
      smsPriceBig * (smsMax > 1000 ? smsMax : 0) +
      richSmsPriceBig * (richSmsMax > 1000 ? richSmsMax : 0)
    dailyMarketingCostsElement = `<div style="min-width:250px;color:red;font-size:22px">当日营销成本：${Math.floor(dailyMarketingCosts)}元</div>`;
  }
  const sendMaxBtn = $(".new-flag-wrapper__oefVL")
  if (sendMaxBtn.length > 0) {
    $(dailyMarketingCostsElement).insertBefore(sendMaxBtn);
  } else {
    $(".search-box___SIbW").append(dailyMarketingCostsElement)
  }
}
getMaxMarketingCost()

// 批量
$("body").bind("DOMNodeInserted", function () {
  if (
    ($(".content__FKDJl").length > 0 &&
      $(".channel-chooser__t_JjF").length > 0)
  ) {
    var multi = $("#dialog-multi");
    if (multi.length == 0) {
      // 默认值
      let xzh_jp_default = localStorage.getItem("xzh_jp_" + pin);
      let xzh_tag_default = localStorage.getItem("xzh_tag_" + pin);
      xzh_jp_default = xzh_jp_default ? xzh_jp_default : "";
      xzh_tag_default = xzh_tag_default ? xzh_tag_default : "";

      var sHtml =
        '<div class="modal__1URM8" id="dialog-multi" style="left:-505px;background:#fff;width:500px;float:right;position:absolute;top:0;z-index:99999"><div class="ant-modal-content">' +
        '<div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle0"><div class="title__2CoZR title__QVWfk has-icon__3dNRu"><span class="icon-wrapper__23vff"><span class="item__1SH3J">创建批量任务</span></div></div></div>' +
        '<div class="ant-modal-body"><div class="content__34BVq content__UWhFl"><div class="header__1FeKd"></div><div class="main__-PQXV main__WU9uP">' +
        '<div class="header-panel__2ZvKo cross-task__1E5P2 xz-vertical-gap header-panel__H2eYO send-content__R2NlL">' +
        '<div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq title__EG5AW"><div class="title__2CoZR title__QVWfk">统一配置项</div></span></div>' +
        '<div class="body__2wdPq body__SOXZp">' +
        '<div class="content-panel__1Q316 content-panel__ju4Hf">' +
        '<div class="content__1OYv3">' +
        '<input id="xzh-execute-date" style="width:280px" class="ant-input input__2_rbb task__1t_R5" placeholder="执行日期, 如: xxxx/xx/xx, 2022/10/9" type="text" value="">' +
        '<input id="xzh-template-date"  style="width:280px" class="ant-input xz-vertical-gap input__2_rbb task__1t_R5" placeholder="文案日期, 如: xxxx/xx/xx, 2022/10/9" type="text" value="">' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="header-panel__2ZvKo xz-vertical-gap header-panel__H2eYO send-content__2POVc">' +
        '<div class="content-row__3nMQe">' +
        '<div class="content-col__3ruDH">' +
        '<div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq title__EG5AW"><div class="title__2CoZR title__QVWfk">发送上限</div></span></div>' +
        '<div class="body__2wdPq  body__SOXZp">' +
        '<div class="content-panel__1Q316 content-panel__ju4Hf">' +
        '<textarea id="send-max" rows="3" class="ant-input"></textarea>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="header-panel__2ZvKo xz-vertical-gap header-panel__H2eYO send-content__2POVc">' +
        '<div class="content-row__3nMQe">' +
        '<div class="content-col__3ruDH">' +
        '<div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq title__EG5AW"><div class="title__2CoZR title__QVWfk">批量任务</div></span></div>' +
        '<div class="body__2wdPq  body__SOXZp">' +
        '<div class="content-panel__1Q316 content-panel__ju4Hf">' +
        '<textarea id="xzh-task-list" rows="3" class="ant-input"></textarea>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="header-panel__2ZvKo xz-vertical-gap header-panel__H2eYO send-content__2POVc">' +
        '<div class="content-row__3nMQe">' +
        '<div class="content-col__3ruDH">' +
        '<div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq"><div class="title__2CoZR title__QVWfk">排除竞品</div></span></div>' +
        '<div class="body__2wdPq  body__SOXZp">' +
        '<div class="content-panel__1Q316 content-panel__ju4Hf">' +
        `<textarea id="xzh-jp-list" rows="3" class="ant-input">${xzh_jp_default}</textarea>` +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="header-panel__2ZvKo xz-vertical-gap header-panel__H2eYO send-content__2POVc">' +
        '<div class="content-row__3nMQe">' +
        '<div class="content-col__3ruDH">' +
        '<div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq title__EG5AW"><div class="title__2CoZR title__QVWfk">人群画像</div></span></div>' +
        '<div class="body__2wdPq  body__SOXZp">' +
        '<div class="content-panel__1Q316 content-panel__ju4Hf">' +
        `<textarea id="xzh-tag-list" rows="3" class="ant-input">${xzh_tag_default}</textarea>` +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="ant-modal-footer"><input id="sms_template_id" type="hidden" /><button id="xzh-btn-multi-check" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z"><span>批量查询</span></button><button id="xzh-btn-multi-submit" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>批量创建</span></button></div>' +
        "</div></div>";
      $("div[role='dialog']").append(sHtml);

      if (!operator.hasOwnProperty(pin)) {
        $("#xzh-btn-task-improt").remove();
      }

      // $("#xzh-task-list").bind("tripleclick", function () {
      //   importTask();
      // });

      // 导入任务
      $("#xzh-btn-task-improt").bind("click", function () {
        importTask();
      });

      getUserInfo();
      getAiList();
      getAllCategory()


      var category = getAllCategory();
      // console.log("CATEGORY", category);

      $("#dialog-multi .content__1OYv3 button.button-size-small__1kSJV").bind(
        "click",
        function () {
          var days = $(this).text();
          days = days.substr(0, days.length - 1);
          getExcludeTask(days);
        }
      );

      // 批量查询、投放
      $("#xzh-btn-multi-check,#xzh-btn-multi-submit").bind(
        "click",
        function () {
          var is_check = true;
          if ($(this)[0].id == "xzh-btn-multi-submit") {
            is_check = false;
          }
          // console.log(is_check);

          // 处理发送上限
          const sendMaxData = table($("#send-max").val())[0];
          console.log("sendMaxData---->", sendMaxData, typeof sendMaxData);

          if (!sendMaxData) {
            alert("请设置发送上限！");
            return;
          } else {
            sendMaxConfig = {
              ...sendMaxConfig,
              咚咚: Number(sendMaxData["咚咚"]),
              富媒体咚咚: Number(sendMaxData["富媒体咚咚"]),
              短信: Number(sendMaxData["短信"]),
              富媒体短信: Number(sendMaxData["富媒体短信"]),
              // 营销成本: Number(sendMaxData["营销成本"])
            };
            console.log("sendMaxConfig--->", sendMaxConfig);
            if (Object.values(sendMaxConfig).every((value) => !value)) {
              alert("发送上限不能全为空");
              return;
            }
            // if (!sendMaxConfig['营销成本'] || sendMaxConfig['营销成本'] < 0) {
            //   alert("营销成本不能为空且必须大于0");
            //   return;
            // }
            setSendMax();
          }
          console.log("当前环境---->", isUat);
          // 每次进入投放页面重置人群包id
          crowdOptions_ = {};

          // 处理投放任务
          var data = table($("#xzh-task-list").val());
          if (!data) {
            alert("没有投放数据");
            return;
          }

          var search_keyword = 0;
          var convert_url = 0;

          // 人群画像
          var tags = getTags();
          console.log("TAGS", tags);

          let executeDate = $("#xzh-execute-date").val();
          console.log("executeDate--->日期", executeDate);

          // 处理投放策略
          for (var i = 0; i < data.length; i++) {
            if (!data[i].hasOwnProperty("投放策略") || !data[i]["投放策略"]) {
              data[i]["error"] = "无投放策略";
              continue;
            }
            // 解析投放策略
            var m = data[i]["投放策略"].match(
              /^(.+)[\(（](\d+)([<>](\d+))?(?:\/(\d+))?([A-Z]?)-(\d+)(?:-(\d+))?[\)）]$/
            );
            console.log("m", m);
            if (!m) {
              data[i]["error"] = "投放策略错误";
              continue;
            }

            data[i]["行为"] = m[1].substr(-2);
            console.log("行为--->", data[i]["行为"]);

            data[i]["圈选商品"] = [];

            const labelType = m[1];
            console.log("解析--->标签类型--->labelType", labelType);
            const conditionsStr = data[i]["圈选条件"];
            console.log("解析--->圈选条件--->conditionsStr", conditionsStr);
            const conditionsArr = conditionsStr.split("\n");
            console.log("解析--->圈选条件--->conditionsArr", conditionsArr);

            if (
              labelType.length === 4 && ["商品", "竞品", "跨品"].some((item) => labelType.includes(item))
            ) {
              // 商品标签 1-sku;2-sku;3-关键词;4-品类
              console.log("标签类型--->商品标签--->111");
              if (conditionsArr[0]) {
                data[i]["圈选商品"] = [explode(conditionsArr[0])];
              }
              if (conditionsArr[1]) {
                data[i]["圈选商品"] = [
                  ...data[i]["圈选商品"],
                  explode(conditionsArr[1]),
                ];
              }
              if (conditionsArr[2]) {
                data[i]["关键词"] = conditionsArr[2];
              }
              if (conditionsArr[3]) {
                data[i]["圈选品类"] = [explode(conditionsArr[3])];
              }
            } else if (
              ["品牌词", "产品词", "活动词", "竞品词", "行业词"].includes(
                labelType
              )
            ) {
              // 全是关键词
              console.log("标签类型--->搜索标签--->222");
              data[i]["关键词"] = conditionsArr.join(",");
            } else if (
              labelType.length === 4 && ["店铺"].some((item) => labelType.includes(item))
            ) {
              // 店铺标签 1-shopId(1:本店铺);2-shopId(1:本店铺);3-sku;4-关键词;5-品类
              console.log("标签类型--->店铺标签--->333");
              if (conditionsArr[0]) {
                data[i]["圈选店铺"] = [explode(conditionsArr[0])];
              }
              if (conditionsArr[1]) {
                data[i]["圈选店铺"] = [
                  ...data[i]["圈选店铺"],
                  explode(conditionsArr[1]),
                ];
              }
              if (conditionsArr[2]) {
                data[i]["圈选商品"] = [explode(conditionsArr[2])];
              }
              if (conditionsArr[3]) {
                data[i]["关键词"] = conditionsArr[3];
              }
              if (conditionsArr[4]) {
                data[i]["圈选品类"] = [explode(conditionsArr[4])];
              }
            } else if (
              labelType.length === 4 && ["品类"].some((item) => labelType.includes(item))
            ) {
              console.log("标签类型--->品类标签--->444");
              // 1-品类；2-品类；3-关键词
              if (conditionsArr[0]) {
                data[i]["圈选品类"] = [explode(conditionsArr[0])];
              }
              if (conditionsArr[1]) {
                data[i]["圈选品类"] = [
                  ...data[i]["圈选品类"],
                  explode(conditionsArr[1]),
                ];
              }
              if (conditionsArr[2]) {
                data[i]["关键词"] = conditionsArr[2];
              }
            } else if (labelType.includes("实时")) {
              // 所有实时标签
              console.log(
                "data--->实时任务时间",
                data[i],
                data[i]["实时任务时间"]
              );
              if (!data[i]["实时任务时间"]) {
                alert("实时标签没有设置时间！");
                return;
              }
              const tempHourData = data[i]["实时任务时间"].replace("~", ",");
              let tempRealTimeLabel = [];
              if (["商品", "竞品"].some((item) => labelType.includes(item))) {
                console.log("标签类型--->商品实时标签--->555");
                // 商品实时标签 1-sku;2-sku;3-关键词;4-品类
                if (conditionsArr[0]) {
                  tempRealTimeLabel.push(
                    `商品实时${data[i]["行为"]}|${tempHourData}|${conditionsArr[0]}`
                  );
                }
                if (conditionsArr[1]) {
                  tempRealTimeLabel.push(
                    `商品实时${data[i]["行为"]}1|${tempHourData}|${conditionsArr[1]}`
                  );
                }
                if (conditionsArr[2]) {
                  tempRealTimeLabel.push(
                    `实时搜索|${tempHourData}|${conditionsArr[2]}`
                  );
                }
                if (conditionsArr[3]) {
                  tempRealTimeLabel.push(
                    `品类实时${data[i]["行为"]}|${tempHourData}|${conditionsArr[3]}`
                  );
                }
              } else if (labelType === "实时搜索") {
                console.log("标签类型--->实时搜索标签--->666");
                // 商品实时标签 1-关键词;2-关键词;3-关键词;
                if (conditionsArr[0]) {
                  tempRealTimeLabel.push(
                    `实时搜索|${tempHourData}|${conditionsArr[0]}`
                  );
                }
                if (conditionsArr[1]) {
                  tempRealTimeLabel.push(
                    `实时搜索1|${tempHourData}|${conditionsArr[1]}`
                  );
                }
                if (conditionsArr[2]) {
                  tempRealTimeLabel.push(
                    `实时搜索2|${tempHourData}|${conditionsArr[2]}`
                  );
                }
              } else if (labelType.includes("店铺")) {
                console.log("标签类型--->店铺实时标签--->777");
                // 商品实时标签 1-shopId;2-shopId;3-sku;4-关键词;5-品类
                if (conditionsArr[0]) {
                  tempRealTimeLabel.push(
                    `${labelType}|${tempHourData}|${conditionsArr[0]}`
                  );
                }
                if (conditionsArr[1]) {
                  tempRealTimeLabel.push(
                    `${labelType}1|${tempHourData}|${conditionsArr[1]}`
                  );
                }
                if (conditionsArr[2]) {
                  tempRealTimeLabel.push(
                    `商品实时${data[i]["行为"]}|${tempHourData}|${conditionsArr[2]}`
                  );
                }
                if (conditionsArr[3]) {
                  tempRealTimeLabel.push(
                    `实时搜索|${tempHourData}|${conditionsArr[3]}`
                  );
                }
                if (conditionsArr[4]) {
                  tempRealTimeLabel.push(
                    `品类实时${data[i]["行为"]}|${tempHourData}|${conditionsArr[4]}`
                  );
                }
              } else if (labelType.includes("品类")) {
                console.log("标签类型--->品类实时标签--->888");
                // 商品实时标签 1-品类;2-品类;3-关键词
                if (conditionsArr[0]) {
                  tempRealTimeLabel.push(
                    `${labelType}|${tempHourData}|${conditionsArr[0]}`
                  );
                }
                if (conditionsArr[1]) {
                  tempRealTimeLabel.push(
                    `${labelType}1|${tempHourData}|${conditionsArr[1]}`
                  );
                }
                if (conditionsArr[2]) {
                  tempRealTimeLabel.push(
                    `实时搜索|${tempHourData}|${conditionsArr[2]}`
                  );
                }
              }
              console.log("实时标签--->tempRealTimeLabel", tempRealTimeLabel);
              data[i]["实时标签"] = tempRealTimeLabel;
            }

            let launchDate = executeDate || data[i]["执行日期"] || "";
            console.log("launchDate--->", launchDate);

            data[i]["圈选天数"] = m[2];
            data[i]["比较方式"] = m[3] == "<" ? "lte" : "gte";
            data[i]["比较数值"] = m[4] ? m[4] : 1;
            data[i]["搜索天数"] = m[5] ? m[5] : m[2];
            data[i]["人群画像"] = m[6];
            data[i]["排除已购天数"] = m[7];
            data[i]["排除已触达天数"] = m[8];
            // data[i]["圈选商品"] = explode(data[i]["圈选商品"]);
            data[i]["关键词"] = explode(data[i]["关键词"]);
            data[i]["投放日期"] =
              launchDate && data[i]["投放时间"] ?
              new Date(launchDate + " " + data[i]["投放时间"]) :
              null;
            data[i]["预估人数"] = data[i]["预估人数"] ?
              parseInt(data[i]["预估人数"]) :
              0;
            data[i]["排除任务"] = explode(data[i]["排除任务"]);
            data[i]["填空商品"] = explode(data[i]["空商品"]);

            if (!isSku(data[i]["竞品"])) {
              search_keyword++;
              data[i]["竞品搜索"] = explode(data[i]["竞品"]);
              data[i]["竞品"] = null;
            }

            data[i]["竞品"] = explode(data[i]["竞品"]);

            // if (
            //   data[i]["投放渠道"] == "咚咚" &&
            //   data[i]["文案内容"] &&
            //   data[i]["文案内容"].indexOf("http") < 0 &&
            //   data[i]["文案内容"].indexOf("jd.com") < 0 &&
            //   data[i]["文案内容"].indexOf("3.cn") < 0
            // ) {
            //   data[i]["文案转链"] = true;
            //   convert_url++;
            // }

            // if (data[i]["投放渠道"] == "短信") {
            //   data[i]["文案内容"] = null;
            // }
          }
          console.log("DATA", data);

          // 处理竞品
          var jp = table($("#xzh-jp-list").val());
          console.log("处理竞品---->11", jp);
          var tempJp = jp;
          if (jp) {
            var arr = [];
            for (i in jp) {
              // 竞品数据
              if (!jp[i]["SKU"] || !jp[i]["品类"]) continue;
              if (!arr.hasOwnProperty(jp[i]["品类"])) {
                arr[jp[i]["品类"]] = {
                  SKU: [],
                  品类: [],
                  店铺: [],
                  品类类型: jp[i]["品类类型"],
                  天数: jp[i]["天数"],
                };
              }

              // 处理单品、品类
              if (isSku(jp[i]["SKU"])) {
                arr[jp[i]["品类"]]["SKU"].push.apply(
                  arr[jp[i]["品类"]]["SKU"],
                  explode(jp[i]["SKU"])
                );
              } else {
                // 排除本店铺 加购、浏览、付款
                if (jp[i]["SKU"].includes("店铺")) {
                  arr[jp[i]["品类"]]["品类"].push.apply(
                    arr[jp[i]["品类"]]["店铺"],
                    explode(jp[i]["SKU"]),
                    "\\n"
                  );
                } else {
                  arr[jp[i]["品类"]]["品类"].push.apply(
                    arr[jp[i]["品类"]]["品类"],
                    explode(jp[i]["SKU"]),
                    "\\n"
                  );
                }
              }
            }
            jp = arr;
          }
          console.log("竞品", jp);

          var sHtml =
            '<table class="data"><tr><th style="width:5%">#</th><th style="width:25%">投放策略</th><th style="width:55%">SKU</th><th style="width:5%">竞品</th><th style="width:10%">' +
            (is_check ? "用户数" : "投放状态") +
            "</th></tr>";
          for (i = 0; i < data.length; i++) {
            var exsku_num = data[i]["竞品"] ? data[i]["竞品"].length : 0;
            if (jp && jp.hasOwnProperty(data[i]["品类"])) {
              exsku_num += jp[data[i]["品类"]]["SKU"] ? [...new Set(jp[data[i]["品类"]]["SKU"])].filter(
                  (item) => item
                ).length :
                0;
            }
            var skuid = data[i]["圈选商品"]
              .map(
                (item) =>
                '<a href="https://item.jd.com/' +
                item +
                '.html" target="_blank">' +
                item +
                "</a>"
              )
              .join(",");
            if (data[i]["关键词"]) {
              if (skuid.length > 0) skuid += "<br />";
              skuid += data[i]["关键词"];
            }
            if (data[i]["文案转链"]) {
              skuid +=
                '<p id="xzh-content-' + i + '">' + data[i]["文案内容"] + "</p>";
            }
            var channel = "";
            if (data[i]["投放渠道"] && !is_check) {
              channel =
                '<span class="' +
                (data[i]["投放渠道"] == "短信" ?
                  "xzh-label-dx" :
                  "xzh-label-dd") +
                '">' +
                data[i]["投放渠道"] +
                "</span>";
            }
            var title = data[i]["投放策略"];
            // console.log(skuid);
            if (data[i]["任务名"]) {
              title =
                "<strong>" +
                data[i]["任务名"] +
                "</strong>" +
                channel +
                "<br />" +
                title;
            } else {
              title += channel;
            }
            sHtml +=
              "<tr><td>" +
              (i + 1) +
              "</td><td>" +
              title +
              '</td><td class="xz-word-break">' +
              skuid +
              "</td><td>" +
              exsku_num +
              '</td><td id="pincount_' +
              i +
              '"' +
              (data[i]["投放渠道"] == "短信" ?
                ' class="sms_' + data[i]["文案"] + '"' :
                "") +
              ">" +
              (is_check ?
                "计算中" :
                data[i]["文案转链"] ?
                '<span class="xzh-label-red" id="xzh-content-status-' +
                i +
                '">等待转链</span>' :
                "等待投放") +
              "</td></tr>";
          }
          // sHtml += '<tfoot><tr><td colspan="4">排除竞品：'+jp.length+'个</td></tr></tfoot>';
          sHtml += "</table>";
          sHtml +=
            '<button id="xzh-btn-multi-linker" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-large"><span>转链</span></button>';
          sHtml +=
            '<button id="xzh-btn-multi-execute" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green xzh-btn-large"><span>立即投放</span></button>';

          showMasker(sHtml);

          if (convert_url > 0) {
            $("#xzh-btn-multi-execute").hide();
          } else {
            $("#xzh-btn-multi-linker").remove();
          }

          // 生成条件
          var options = [];
          var sms_check = [];
          for (i = 0; i < data.length; i++) {
            console.log("生成条件--->", data[i]);
            var option = {};
            var exsku = [];

            const behavior = data[i]["行为"];
            // 店铺浏览、加购、付款
            if (data[i]["圈选店铺"] && data[i]["圈选店铺"].length > 0) {
              console.log("店铺标签--->111", data[i]["圈选店铺"]);
              let shopIdData = data[i]["圈选店铺"];
              console.log("店铺标签--->shopIdData", shopIdData);
              shopIdData.forEach((shopId, index) => {
                let count = data[i]["比较数值"];
                let lastShopId = shopId[shopId.length - 1];
                // 自定义次数
                if (shopId[shopId.length - 1].includes(">")) {
                  count = shopId[shopId.length - 1].split(">")[1];
                  lastShopId = shopId[shopId.length - 1].split(">")[0];
                }
                let optionValue = {
                  days: data[i]["圈选天数"],
                  counts: count,
                  logic: data[i]["比较方式"],
                  shop: [
                    ...shopId.filter(
                      (item, index) => index !== shopId.length - 1
                    ),
                    lastShopId,
                  ],
                };
                if (option["店铺" + behavior]) {
                  option["店铺" + behavior + index] = optionValue;
                } else {
                  option["店铺" + behavior] = optionValue;
                }
              });
            }
            // 品类浏览、加购、付款
            if (data[i]["圈选品类"] && data[i]["圈选品类"].length > 0) {
              let cateData = data[i]["圈选品类"];
              console.log("品类标签--->cateData", cateData);
              cateData.forEach((cate, index) => {
                let curCate = cate;
                let curBehavior = behavior;

                let count = data[i]["比较数值"];
                let lastCate = curCate[curCate.length - 1];
                // 自定义次数
                if (curCate[curCate.length - 1].includes(">")) {
                  count = curCate[curCate.length - 1].split(">")[1];
                  lastCate = curCate[curCate.length - 1].split(">")[0];
                }
                // 跨标签维度
                if (curCate.join(",").includes("-")) {
                  curCate = cate.join(",").split("-")[0].split(",");
                  curBehavior = cate.join(",").split("-")[1];
                  lastCate = curCate[curCate.length - 1];
                }
                let optionValue = {
                  days: data[i]["圈选天数"],
                  counts: count,
                  cate: [
                    ...curCate.filter(
                      (item, index, arr) => index !== arr.length - 1
                    ),
                    lastCate,
                  ],
                };
                if (option["品类" + curBehavior]) {
                  option["品类" + curBehavior + index] = optionValue;
                } else {
                  option["品类" + curBehavior] = optionValue;
                }
              });
              // option["品类" + data[i]["行为"]] = {
              //   days: data[i]["圈选天数"],
              //   cate: [data[i]["圈选品类"]],
              // };
            }
            // 浏览、加购、付款
            if (data[i]["圈选商品"].length > 0) {
              console.log("商品标签--->111", data[i]["圈选商品"]);
              let skuData = data[i]["圈选商品"];
              skuData.forEach((sku, index) => {
                let curSku = sku;
                let curBehavior = behavior;

                let count = data[i]["比较数值"];
                let lastSku = curSku[curSku.length - 1];
                console.log("跨标签维度--->lastSku", lastSku);
                // 自定义次数
                if (curSku[curSku.length - 1].includes(">")) {
                  count = curSku[curSku.length - 1].split(">")[1];
                  lastSku = curSku[curSku.length - 1].split(">")[0];
                }
                // 跨标签维度
                if (sku.join(",").includes("-")) {
                  curSku = sku.join(",").split("-")[0].split(",");
                  curBehavior = sku.join(",").split("-")[1];
                  lastSku = curSku[curSku.length - 1];
                  console.log("跨标签维度--->curSku", curSku, curBehavior);
                }
                let optionValue = {
                  days: data[i]["圈选天数"],
                  counts: count,
                  logic: data[i]["比较方式"],
                  spacer: data[i]["填空商品"],
                  sku: [
                    ...[...new Set(curSku)]
                    .filter((item) => item)
                    .filter((item, index, arr) => index !== arr.length - 1),
                    lastSku,
                  ], //排重
                };
                if (option[curBehavior]) {
                  option[curBehavior + index] = optionValue;
                } else {
                  option[curBehavior] = optionValue;
                }
              });
              // 排除自己
              exsku = skuData.flat(Infinity);
            }
            // 实时标签
            if (data[i]["实时标签"] && data[i]["实时标签"].length > 0) {
              console.log("实时标签--->222", data[i]["实时标签"]);
              let realTimeLabelArr = data[i]["实时标签"]
                .filter((item) => item)
                .map((item) => {
                  if (item.includes(">")) {
                    return item.replace(">", "|&|");
                  }
                  return item;
                });
              realTimeLabelArr.forEach((item, index) => {
                let realTimeLabelItem = item.split("|");
                if (option[realTimeLabelItem[0]]) {
                  option[realTimeLabelItem[0] + index] = realTimeLabelItem;
                } else {
                  option[realTimeLabelItem[0]] = realTimeLabelItem;
                }
              });
            }

            // 排除竞品
            if (data[i]["竞品"]) {
              exsku = exsku.concat(data[i]["竞品"]);
            }

            console.log("tempJp---->", tempJp);
            // let jpData = tempJp && tempJp.filter(item=>item["品类"] === data[i]["品类"])
            let jpData = jp && jp[data[i]["品类"]];
            console.log("jpData---->", jpData);
            if (jp && jpData) {
              if (jpData["SKU"].length > 0) {
                // SKU竞品
                exsku = exsku.concat(jp[data[i]["品类"]]["SKU"]);
              }
            }

            console.log("options----00>", option);
            // 排除标签
            if (tempJp) {
              // 执行表与竞品分析表品类对应上
              var tempJpCateData = tempJp.filter(
                (item) => item["品类"] === data[i]["品类"]
              );
              console.log("tempJpCateData---->", tempJpCateData);
              let newTempJpCateData = [];
              // 如果竞品分析中，品类类型是 付款|浏览|加购 格式，则需遍历
              tempJpCateData.forEach((item, index) => {
                let categoryType = item["品类类型"].split("|");
                if (categoryType.length > 1) {
                  categoryType.forEach((type) => {
                    newTempJpCateData.push({
                      ...item,
                      品类类型: type,
                    });
                  });
                } else {
                  newTempJpCateData.push(item);
                }
              });
              console.log("newTempJpCateData---->", newTempJpCateData);
              newTempJpCateData.forEach((item, index) => {
                if (!item["SKU"]) return;
                let days = item["天数"] || data[i]["排除已购天数"];
                // 如果浏览类型-天数大于30
                if (
                  item["品类类型"].includes("浏览") &&
                  !EXCLUDE_DAYS_LIU_LAN.includes(days)
                ) {
                  days = data[i]["排除已购天数"];
                }
                let optionValue = {};
                if (item["品类类型"].includes("实时")) {
                  optionValue = [];
                  optionValue[0] = item["品类类型"];
                  optionValue[1] = item["天数"].replace("~", ",");
                  optionValue[2] = item["SKU"];
                  optionValue[3] = "-";
                  optionValue[4] = item["次数"];
                } else if (item["品类类型"].includes("店铺")) {
                  // 本店铺加购、浏览、付款
                  if (item["SKU"] === "本店铺") {
                    optionValue = {
                      days: item["天数"],
                      counts: item["次数"] || data[i]["比较数值"] || 1,
                      logic: data[i]["比较方式"],
                      shop: ["1"],
                      diff: true,
                    };
                  } else {
                    // 店铺加购、浏览、付款
                    optionValue = {
                      days: item["天数"],
                      counts: item["次数"] || data[i]["比较数值"] || 1,
                      logic: data[i]["比较方式"],
                      shop: [...new Set(item["SKU"].split(","))]
                        .filter((item) => item)
                        .map((item) => item.trim()),
                      diff: true,
                    };
                  }
                } else if (item["品类类型"] === "搜索") {
                  // 搜索标签
                  optionValue = {
                    days: days,
                    keywords: item["SKU"].split(","),
                    diff: true,
                    counts: item["次数"] || data[i]["比较数值"] || 1,
                  };
                } else if (isSku(item["SKU"])) {
                  // SKU 相关
                  optionValue = {
                    days: days,
                    sku: [...new Set(item["SKU"].split(","))]
                      .filter((item) => item)
                      .map((item) => item.trim()), //排重
                    diff: true,
                    counts: item["次数"] || data[i]["比较数值"] || 1,
                  };
                } else {
                  // 品类竞品
                  optionValue = {
                    days: days,
                    cate: item["SKU"],
                    diff: true,
                    counts: item["次数"] || data[i]["比较数值"] || 1,
                  };
                }
                let type = item["品类类型"];
                // 如果品类类型存在，则key值+1，因为存在天数维度不同的原因
                if (option[type + "1"]) {
                  option[type + (index + 1 + 1)] = optionValue;
                } else {
                  option[type + "1"] = optionValue;
                }
              });
            }
            console.log("options----11>", option);

            // 搜索关键词
            if (data[i]["关键词"] && data[i]["关键词"].length > 0) {
              if (data[i]["行为"] != "搜索" && !data[i]["搜索天数"]) {
                data[i]["搜索天数"] = data[i]["圈选天数"];
              }
              if (data[i]["搜索天数"] == 1) {
                alert("无1日搜索");
                $("#pincount_" + i).text("无1日搜索");
                options[i] = undefined;
                continue;
              }
              option["搜索"] = {
                days: data[i]["行为"] == "搜索" ?
                  data[i]["圈选天数"] : data[i]["搜索天数"],
                keywords: data[i]["关键词"],
              };
            }

            // 已触达标签（对应表格中的排除任务）
            if (data[i]["排除任务"] && data[i]["排除任务"].length > 0) {
              option["排除任务"] = data[i]["排除任务"];
            }

            if (data[i]["人群画像"]) {
              if (!tags || !tags.hasOwnProperty(data[i]["人群画像"])) {
                alert("无人群画像【" + data[i]["人群画像"] + "】");
                $("#pincount_" + i).text("无人群画像");
                $("#pincount_" + i)
                  .parent()
                  .addClass("error");
                return;
              }
              $.extend(option, tags[data[i]["人群画像"]]);
            }
            // options.push(option);

            console.log("options----22>", option);
            options[i] = option;
          }

          // return;
          console.log("人群包名称1--->", options, data, is_check);
          // console.log('stop-->停止')
          // return
          if (is_check) {
            // 查询默认执行
            for (i = 0; i < options.length; i++) {
              if (options[i] == undefined) {
                continue;
              }
              (function (i) {
                var t = 12500;
                if (options.length <= 10) {
                  t = 10000;
                }

                setTimeout(function () {
                  getPinCount({
                      ...options[i],
                      data: data[i],
                      number: i,
                    },
                    function (res) {
                      if (res.state == "FAILURE" || res.state == "ERROR") {
                        $("#pincount_" + i).text(res.result);
                        $("#pincount_" + i)
                          .parent()
                          .addClass("error");
                        return;
                      }
                      $("#pincount_" + i).text(res.data);
                      if (res.data) {
                        data[i]["pincount"] = parseInt(res.data);
                      }
                      if (res.id) {
                        data[i]["crowdId"] = parseInt(res.id);
                      }
                    }
                  );
                }, (i + 1) * t);
              })(i);
            }
          }
          // 执行投放
          $("#xzh-btn-multi-execute").bind("click", function () {
            var sms_template_id = $("#sms_template_id").val();
            var exclude_task_id = $("#xzh-exclude-task").val();

            for (i = 0; i < options.length; i++) {
              // 增加一键重投
              if (
                options[i] == undefined ||
                $("#pincount_" + i)
                .parent()
                .hasClass("ok")
              ) {
                continue;
              }
              if (
                $("#pincount_" + i)
                .parent()
                .hasClass("error")
              ) {
                $("#pincount_" + i)
                  .parent()
                  .removeClass("error");
                $("#pincount_" + i).text("重新投放");
              }
              (function (i) {
                var t = ADD_TASK_TIMER;
                if (options.length <= 3) {
                  t = ADD_TASK_LESS_THAN_3_TIMER;
                }

                setTimeout(function () {
                  console.log(
                    "这是第" +
                    (i + 1) +
                    "个任务，时间为：" +
                    moment().format("YYYY-MM-DD HH:mm:ss")
                  );
                  if (
                    exclude_task_id &&
                    exclude_task_id.length > 0 &&
                    !data[i]["排除任务"].length
                  ) {
                    data[i]["排除任务"] = exclude_task_id.split(",");
                  }
                  var res = addTask(
                    data[i],
                    options[i],
                    i,
                    data.length,
                    function (res) {
                      if (res.state == "FAILURE" || res.state == "ERROR") {
                        $("#pincount_" + i).text(res.result);
                        $("#pincount_" + i)
                          .parent()
                          .addClass("error");
                        $("#xzh-btn-multi-execute").show();
                        $("#xzh-btn-multi-execute span").text("失败重投");
                        return;
                      }
                      $("#pincount_" + i).text(res.data);
                      $("#pincount_" + i)
                        .parent()
                        .addClass("ok");
                      // 回传数据
                      var res_data = $.parseJSON(this.data);
                      console.log(this.data);
                    }
                  );
                  if (!res.ok) {
                    $("#pincount_" + i).text(res.msg);
                    $("#pincount_" + i)
                      .parent()
                      .addClass("error");
                    $("#xzh-btn-multi-execute").show();
                    $("#xzh-btn-multi-execute span").text("失败重投");
                  }
                  console.log("RES" + i, res);
                }, (i + 1) * t + 2000);
              })(i);
            }
            $(this).hide();
          });

          $("#xzh-btn-multi-linker").bind("click", function () {
            convertUrls(data);
            $(this).remove();
            setTimeout(function () {
              $("#xzh-btn-multi-execute").show();
            }, convert_url * 500);
          });
        }
      );
    }

    // 保存数据
    $("#xzh-jp-list").bind("input propertychange", function () {
      var val = $("#xzh-jp-list").val();
      var key = "xzh_jp_" + pin;
      if (val.length == 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, val);
      }
    });
    $("#xzh-tag-list").bind("input propertychange", function () {
      var val = $("#xzh-tag-list").val();
      var key = "xzh_tag_" + pin;
      if (val.length == 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, val);
      }
    });

    // 获取短信ID
    $("a.link__1hhMI:contains('使用')").bind("click", function () {
      $("#sms_template_id").val(
        $(this).parent().parent("[data-row-key]").data("row-key")
      );
    });


  }

  // 批量短信
  if (
    $(".add-sms-form__1rIGm").length > 0 ||
    $(".add-sms-form__Rdh3C").length > 0
  ) {
    var multi = $("#dialog-multi-sms");
    if (multi.length == 0) {
      // 默认值
      var sHtml =
        '<div class="modal__1URM8" id="dialog-multi-sms" style="left:-454px;background:#fff;width:450px;float:right;position:absolute;top:0;z-index:99999"><div class="ant-modal-content">' +
        '<div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle0"><div class="title__2CoZR title__QVWfk has-icon__3dNRu"><span class="icon-wrapper__23vff"><span class="item__1SH3J">创建批量任务</span></div></div></div>' +
        '<div class="ant-modal-body"><div class="content__34BVq"><div class="header__1FeKd"></div><div class="main__-PQXV">' +
        '<div class="header-panel__2ZvKo send-content__2POVc header-panel__H2eYO send-content__R2NlL"><div class="content-row__3nMQe content-row__IsJpm"><div class="content-col__3ruDH content-col__D6uWW"><div class="header__3Yc35 header__eAyP9"><span class="title__kyJLq title__EG5AW"><div class="title__2CoZR title__QVWfk">批量创建模板</div></span><span class="header-right__2MwE0"></span></div>' +
        '<div class="body__2wdPq"><div class="content-panel__1Q316"><textarea id="xzh-sms-list" rows="20" class="ant-input"></textarea></div>' +
        "</div></div>" +
        "</div>" +
        '<div class="ant-modal-footer"><button id="xzh-btn-multi-submit" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>批量创建模板</span></button></div>' +
        "</div></div>";
      $("div[role='dialog']").append(sHtml);

      // 批量查询、投放
      $("#xzh-btn-multi-submit").bind("click", function () {
        // 处理投放任务
        var data = table($("#xzh-sms-list").val());
        // console.log("DATA", data);
        if (!data) {
          alert("没有短信数据");
          return;
        }

        console.log("DATA", data);

        var sHtml =
          '<table class="data"><tr><th style="width:5%">#</th><th style="width:10%">模板类型</th><th style="width:10%">模板名称</th><th style="width:40%">文案内容</th><th style="width:10%">商品ID</th><th style="width:10%">活动配置key</th><th style="width:10%">优惠券链接</th><th style="width:10%">状态</th></tr>';
        for (i = 0; i < data.length; i++) {
          sHtml +=
            "<tr><td>" +
            (i + 1) +
            "</td><td>" +
            data[i]["模板类型"] +
            "</td><td>" +
            data[i]["模板名称"] +
            '</td><td class="xz-word-break">' +
            data[i]["文案内容"] +
            "</td>" +
            `<td>${data[i]["商品id"] || "--"}</td>` +
            `<td>${data[i]["活动配置key"] || "--"}</td>` +
            `<td>${data[i]["优惠券链接"] || "--"}</td>` +
            '<td id="pincount_' +
            i +
            '">等待创建</td></tr>';
        }
        sHtml += "</table>";
        sHtml +=
          '<input id="sms_signature"><button id="xzh-btn-multi-execute" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green xzh-btn-large"><span>立即创建</span></button>';

        showMasker(sHtml);

        // 获取短信签名
        $.ajax({
          url: "/mkt/api/sms/signature/list",
          type: "GET",
          dataType: "json",
          success: function (res) {
            for (var i = 0; i < res.data.length; i++) {
              console.log(res.data[i]);
              if (res.data[i].status == 1) {
                $("#sms_signature").val(res.data[i].newSignature);
                return;
              }
            }
          },
        });

        // 执行投放
        $("#xzh-btn-multi-execute").bind("click", function () {
          for (i = 0; i < data.length; i++) {
            if (data[i] == undefined) {
              continue;
            }
            (function (i) {
              var t = 100;

              setTimeout(function () {
                var res = addSms(data[i], function (res) {
                  if (res.state == "FAILURE" || res.state == "ERROR") {
                    $("#pincount_" + i).text(res.result);
                    $("#pincount_" + i)
                      .parent()
                      .addClass("error");
                    return;
                  }
                  $("#pincount_" + i).text(res.data);
                  $("#pincount_" + i)
                    .parent()
                    .addClass("ok");
                });
                if (!res.ok) {
                  $("#pincount_" + i).text(res.msg);
                  $("#pincount_" + i)
                    .parent()
                    .addClass("error");
                }
                console.log("RES" + i, res);
              }, (i + 1) * ADD_TASK_TIMER);
            })(i);
          }
          $(this).remove();
        });
      });
    }

    // 保存数据
    $("#xzh-jp-list").bind("input propertychange", function () {
      var val = $("#xzh-jp-list").val();
      var key = "xzh_jp_" + pin;
      if (val.length == 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, val);
      }
    });
    $("#xzh-tag-list").bind("input propertychange", function () {
      var val = $("#xzh-tag-list").val();
      var key = "xzh_tag_" + pin;
      if (val.length == 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, val);
      }
    });

    // 获取短信ID
    $("a.link__1hhMI:contains('使用')").bind("click", function () {
      $("#sms_template_id").val(
        $(this).parent().parent("[data-row-key]").data("row-key")
      );
    });
  }

  // 批量删除人群包
  if (
    $("#rc-tabs-0-panel-crowd_list").length > 0 &&
    $("#xzh-btn-one-click-clear").length == 0
  ) {
    $(".button-wrapper__M8J0Q")
      // .eq(1)
      .append(
        `<button id="xzh-btn-one-click-clear" type="button" class="ant-btn css-r3n9ey ant-btn-default button__Q1Ng3 xz-button__Dw8L6 button-type-primary__R405K"><span>一键清除</span></button>`
      );

    $("#xzh-btn-one-click-clear").bind("click", function () {
      var sHtml = `<style>
      #tablist ul,#tablist li{list-style:none}#tablist ul{overflow:hidden}#tablist li{float:left;color:#333;padding:4px 40px;margin-right:8px;cursor:pointer;border:1px solid #ccc;transition:all ease .3s}.box{width:88%;margin:8px;position:relative}#tablist li:hover{background:#44ac55;color:#fff}#tablist li.tabin{border:1px solid #079982;background:#079982;color:#fff}.content-box{width:100%;height:180px;background:#eee;position:absolute;left:0;top:30px;overflow:hidden;border:1px solid #079982}.content{clear:both;color:#333;padding:10px;display:none;position:absolute;top:0;left:0}.content-box .contentin{display:block;}.content h1{font-size:18px;margin-bottom:20px;margin-top:20px}.content p{font-size:12px;margin:4px 12px}.content p span.title{font-weight:bold;color:#999}
      table.data th{padding:0;}table.data tr.total td{background-color:#ffe}table.data tr td.percent{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWM4/f/8fwAIywOZbbg6KgAAAABJRU5ErkJggg==);background-repeat:no-repeat;background-size:1px 50%;background-position:center left;background-color:#f3fdf6;}table.data tr td.percent.percent_red{background-color:#ffecee;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4f/rCfwAJAQOaUJXpYAAAAABJRU5ErkJggg==);}</style>

        <div style="padding:8px">加载第<input id="xzh-data-page-start" style="width:36px;padding:0 2px;text-align:center" class="ant-input" value="1" />到<input id="xzh-data-page" style="width:36px;padding:0 2px;text-align:center" class="ant-input" value="1" />页人群包，
        <button id="xzh-btn-load-crowd-data" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>立即获取</span></button>
        <button id="one-click-clear" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green"><span>一键清除</span></button></div>
        <div class="tableWrapper">
        <table class="data">
          <tr><th width="5%">#</th><th width="15%">人群包ID</th><th width="25%">人群包名称</th><th width="10%">创建时间</th><th width="10%">操作</th></tr>
        </table>
        </div>
        `;
      showMasker(sHtml);

      $(".ant-checkbox-wrapper input:checkbox").bind("click", function () {
        $(this).parent().toggleClass("ant-checkbox-checked");
      });

      var update_data = {};
      var newTable = `<table class="data">
            <tr><th width="5%">#</th><th width="15%">人群包ID</th><th width="25%">人群包名称</th><th width="10%">创建时间</th><th width="10%">操作</th></tr>
            </table>`;
      $("#xzh-btn-load-crowd-data").bind("click", function () {
        $("table.data").remove();
        $(".tableWrapper").append(newTable);
        var page = $("#xzh-data-page").val();
        var start_page = $("#xzh-data-page-start").val();
        getCrowdDataByPage(page).then((data) => {
          data = data.result;
          // 加载数据到页面
          console.log(data);
          var sHtml = "";
          for (var i = (start_page - 1) * 10; i < data.length; i++) {
            sHtml +=
              `<tr data-id="` +
              data[i].id +
              `">
            <td>` +
              (i + 1) +
              `</td>
            <td>` +
              data[i].id +
              `</td>
            <td>` +
              data[i].name +
              `</td>
            <td>` +
              data[i].createTime +
              `</td>
            <td><a>取消</a></td></tr>`;
            update_data[data[i].id] = {
              id: data[i].id,
              name: data[i].name,
            };
          }
          $("table.data").append(sHtml);
          $("table.data td a").bind("click", function () {
            var tr = $(this).parent().parent();
            delete update_data[tr.data("id")];
            tr.remove();
          });
        });
      });

      $("#one-click-clear").bind("click", function () {
        var crowdIds = [];
        Object.keys(update_data).forEach((key) => {
          crowdIds.push(key);
        });
        $.ajax({
          url: "/mkt/api/crowd/delete",
          type: "POST",
          dataType: "json",
          data: JSON.stringify(crowdIds),
          contentType: "application/json",
          success: function (res) {
            $("table.data").remove();
            $(".tableWrapper").append(newTable);
          },
        });
      });
    });
  }
});

// 底部工具条
$("#root").append('<div style="height:64px;"></div>');
$("body").append(`
    <div style="position:fixed;right:0;bottom:0;left:0;z-index:998;height:64px;background-color:rgba(0,0,0,.75);">
      <div id="xzh-footbar" style="z-index:999;position:fixed;right:0;bottom:0;left:0;height:64px;overflow:hidden;outline:0;display:flex;align-items: center;justify-content: center;">
          <div class="ant-radio-group ant-radio-group-outline">
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="90"><span class="ant-radio-inner"></span></span><span>90</span></label>
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="60"><span class="ant-radio-inner"></span></span><span>60</span></label>
              <label class="ant-radio-wrapper ant-radio-wrapper-checked radio__2utzi"><span class="ant-radio ant-radio-checked"><input type="radio" name="xzh-radio-days" class="ant-radio-input" value="30" checked><span class="ant-radio-inner"></span></span><span>30</span></label>
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="15"><span class="ant-radio-inner"></span></span><span>15</span></label>
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="7"><span class="ant-radio-inner"></span></span><span>7</span></label>
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="3"><span class="ant-radio-inner"></span></span><span>3</span></label>
              <label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-days" type="radio" class="ant-radio-input" value="1"><span class="ant-radio-inner"></span></span><span>1</span></label>
          </div>
          <input id="xzh-skuid" class="ant-input" placeholder="多个SKU用逗号、空格、回车分隔" style="width:240px;margin-right:12px;" />
          <label class="ant-checkbox-wrapper checkbox__3vNvP"><span class="ant-checkbox"><input type="checkbox" class="ant-checkbox-input"><span class="ant-checkbox-inner"></span></span><span>合</span></label>
          <button type="button" onclick="getSkuData();" class="ant-btn button__1iBD7 button-type-primary__2i--z" style="padding:12px;font-weight:700;line-height:1;text-decoration:none;border:0;outline:0;cursor:pointer;transition:color .3s;">查询SKU转化率</button>
          <button type="button" onclick="checkSkuStatus();" class="ant-btn button__1iBD7 button-type-primary__2i--z" style="width:168px;float:right;top:16px;right:20px;padding:12px;font-weight:700;line-height:1;text-decoration:none;border:0;outline:0;cursor:pointer;transition:color .3s;">校验SKU是否下架</button>
          <button type="button" onclick="totalExpense();" class="ant-btn button__1iBD7 button-type-primary__2i--z" style="float:right;top:16px;right:20px;padding:12px;font-weight:700;line-height:1;text-decoration:none;border:0;outline:0;cursor:pointer;transition:color .3s;">查看投放费用</button>
          <button type="button" onclick="searchSkuPinCount();" class="ant-btn button__1iBD7 button-type-primary__2i--z" style="width:168px;float:right;top:16px;right:20px;padding:12px;font-weight:700;line-height:1;text-decoration:none;border:0;outline:0;cursor:pointer;transition:color .3s;">查询SKU预估人数</button>
      </div>
    </div>
`);

$("#xzh-skuid").val(window.location.hash.substr(1));

$("#xzh-footbar input:radio").bind("click", function () {
  $(this).parent().addClass("ant-radio-checked");
  $(this)
    .parents("label")
    .siblings()
    .children(".ant-radio")
    .removeClass("ant-radio-checked");
});
$("#xzh-footbar input:checkbox").bind("click", function () {
  $(this).parent().toggleClass("ant-checkbox-checked");
});

function importTask() {
  globalPostMessage({
    url: "https://quanxiaobao.cn/api/gettask",
    type: "getJSON",
    api: "importTask",
  });
  // $.getJSON("https://quanxiaobao.cn/api/gettask", function (res) {
  //   // console.log(res)
  // });
}

function importTaskToRender(result) {
  const {
    res
  } = result;
  var task_list = [
    [
      "任务名",
      "执行日期",
      "投放策略",
      "圈选条件",
      "竞品",
      "投放时间",
      "投放渠道",
      "文案内容",
      // '预估投放量',
      "投放上限",
      "填空商品",
    ],
  ];
  var action = {
    10: "浏览",
    20: "加购",
    30: "搜索",
  };
  // var days = {1,3,7,15,30,60,90};
  for (i in res) {
    if (!res) {
      continue;
    }
    if (!res[i].diff) {
      res[i].diff = 90;
    }
    var plan = "商品" + action[res[i].action] + "(" + res[i].days;
    plan += "-" + res[i].diff;
    plan += ")";

    // if (res[i].spacer) {
    //     res[i].skuid += "," + res[i].spacer;
    // }

    if (res[i].content.indexOf("\n")) {
      res[i].content = '"' + res[i].content + '"';
    }

    var task_name = prefix(res[i].task_id, 7);
    if (res[i].brand_name && res[i].cid3_name) {
      res[i].brand_name = res[i].brand_name.indexOf("（") ?
        res[i].brand_name.substr(0, res[i].brand_name.indexOf("（")) :
        res[i].brand_name;
      task_name =
        res[i].brand_name.substr(0, 4) +
        res[i].cid3_name.substr(0, 4) +
        task_name;
    }

    task_list.push([
      task_name,
      new Date(res[i].start_time * 1000).format("yyyy-MM-dd"),
      plan,
      res[i].skuid,
      res[i].compete_skuid,
      new Date(res[i].start_time * 1000).format("hh:mm"),
      res[i].skuid == 2 ? "短信" : "咚咚",
      res[i].content,
      // '预估投放量',
      res[i].max_count,
      res[i].spacer,
    ]);
  }
  task_list = task_list.map((item) => item.join("\t"));
  $("#xzh-task-list").val(task_list.join("\n"));
}

function getSkuData() {
  var sku = explode($("#xzh-skuid").val());
  if ($("#xzh-footbar input:checkbox").is(":checked")) {
    sku = [sku.join(",")];
  }
  console.log("sku--->", sku);
  var days = $("#xzh-footbar input:radio:checked").val();
  var sHtml =
    '<table class="data"><tr><th width="5%">#</th><th width="35%">SKU</th><th width="8%">价格</th><th width="8%">' +
    days +
    '日浏览</th><th width="8%">' +
    days +
    '日付款</th><th width="8%">转化率</th><th width="8%">AURP</th><th width="8%">佣金</th><th width="12%">预估ROI</th></tr>';
  sHtml += sku
    .map(
      (item, i) =>
      "<tr><td>" +
      (i + 1) +
      '</td><td id="xzh_data_sku_' +
      i +
      '"><a href="https://item.jd.com/' +
      item +
      '.html" target="_blank">' +
      item +
      '</a></td><td id="xzh_data_price_' +
      i +
      '">-</td><td id="xzh_data_pv_' +
      i +
      '">-</td><td id="xzh_data_order_' +
      i +
      '">-</td><td id="xzh_data_cr_' +
      i +
      '">-</td><td id="xzh_data_aurp_' +
      i +
      '" class="xzh-label-bold">-</td><td id="xzh_data_comm_' +
      i +
      '">-</td><td><p><span class="xzh-label-dx">信</span> <span id="xzh_data_roi_dx1_' +
      i +
      '">-</span> <span class="xzh-label-comma">|</span> <span id="xzh_data_roi_dx2_' +
      i +
      '">-</span></p><p><span class="xzh-label-dd">咚</span> <span id="xzh_data_roi_dd1_' +
      i +
      '">-</span> <span class="xzh-label-comma">|</span> <span id="xzh_data_roi_dd2_' +
      i +
      '">-</span></p></td></tr>'
    )
    .join("");
  sHtml += "</table>";

  showMasker(sHtml);

  for (i = 0; i < sku.length; i++) {
    (function (i) {
      var t = 12500;
      if (sku.length <= 5) {
        t = 500;
      }
      // 查询SKU基础信息
      setTimeout(function () {
        getSkuInfo(sku[i], i);
      }, i * 100);
      // 查询浏览
      setTimeout(function () {
        getPinCount({
            浏览: {
              days: days,
              sku: sku[i],
            },
          },
          function (res) {
            $("#xzh_data_pv_" + i).text(res.data);
            setSkuData(i);
            putSkuData({
              days: days,
              skuid: sku[i],
              creater: pin,
              uv: res.data,
            });
          },
          false
        );
      }, i * t);
      // 查询付款订单
      setTimeout(function () {
        getPinCount({
            付款: {
              days: days,
              sku: sku[i],
            },
          },
          function (res) {
            $("#xzh_data_order_" + i).text(res.data);
            setSkuData(i);
            putSkuData({
              days: days,
              skuid: sku[i],
              creater: pin,
              order: res.data,
            });
          },
          false
        );
      }, (i + 1) * t + 1000);
    })(i);
  }
}

function putSkuData(data) {
  globalPostMessage({
    url: "https://quanxiaobao.cn/api/item/data",
    type: "getJSON",
    params: data,
  });
  // $.getJSON("https://quanxiaobao.cn/api/item/data", data);
}

function setSkuData(i) {
  var pv = $("#xzh_data_pv_" + i).text();
  var order = $("#xzh_data_order_" + i).text();
  var cr = $("#xzh_data_cr_" + i).text();

  // 转化率
  if (pv == "-" || order == "-") return;
  if (cr != "-") {
    cr = cr.substr(0, cr.length - 1);
  }
  if (cr == "-") {
    cr = 0;
    if (pv > 0) {
      cr = ((order / pv) * 100).toFixed(2);
    }
    $("#xzh_data_cr_" + i).text(cr + "%");
  }

  // 计算ROI
  var price = $("#xzh_data_price_" + i).text();
  var comm = $("#xzh_data_commtotal_" + i).text();
  if (price == "-") return;

  $("#xzh_data_aurp_" + i).text(((price * cr) / 100).toFixed(2));

  var ccr = cr * 1.5 + 3;
  var roi = {
    roi_dx1: price / ((100 / cr / 0.03) * 0.23),
    roi_dx2: comm / ((100 / ccr / 0.03) * 0.12),
    roi_dd1: price / ((100 / cr / 0.006) * 0.06),
    roi_dd2: comm / ((100 / ccr / 0.006) * 0.036),
  };

  for (k in roi) {
    $("#xzh_data_" + k + "_" + i).text(roi[k].toFixed(2));
    if (roi[k] > 3) {
      $("#xzh_data_" + k + "_" + i).addClass("xzh-label-red");
    }
    if (roi[k] < 1) {
      $("#xzh_data_" + k + "_" + i).addClass("xzh-label-gray");
    }
  }
}

function totalExpense() {
  let xzh_dx_fee = localStorage.getItem("xzh_dx_fee_" + pin) ?
    localStorage.getItem("xzh_dx_fee_" + pin) :
    "0.23";
  let xzh_dd_fee = localStorage.getItem("xzh_dd_fee_" + pin) ?
    localStorage.getItem("xzh_dd_fee_" + pin) :
    "0.06";
  var days = $("input[name=xzh-radio-days]:checked").val();

  var sHtml =
    "<style>table.data th{padding:0;}table.data tr.total td{background-color:#ffe}table.data tr td.percent{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWM4/f/8fwAIywOZbbg6KgAAAABJRU5ErkJggg==);background-repeat:no-repeat;background-size:1px 50%;background-position:center left;background-color:#f3fdf6;}table.data tr td.percent.percent_red{background-color:#ffecee;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYGWP4f/rCfwAJAQOaUJXpYAAAAABJRU5ErkJggg==);}</style>";
  sHtml +=
    '<div style="padding:8px" id="xzh-fee">短信<input style="width:48px;padding:0 2px" data-channel="dx" class="ant-input" value="' +
    xzh_dx_fee +
    '" />元/条，咚咚<input data-channel="dd" style="width:48px;padding:0 2px" class="ant-input" value="' +
    xzh_dd_fee +
    '" />元/条，周期性任务无预估数据</div>';
  sHtml +=
    '<table class="data"><tr><th width="9%" rowspan="3">日期</th><th width="6%" rowspan="3">任务数</th><th colspan="5">计划</th><th colspan="7">实际</th></tr>';
  sHtml +=
    '<tr><th colspan="2">短信</th><th colspan="2">咚咚</th><th width="8%" rowspan="2">投放预算</th><th colspan="2">短信</th><th colspan="2">咚咚</th><th width="8%" rowspan="2">实际花费</th><th width="6%" rowspan="2">24h ROI</th><th width="6%" rowspan="2">7d ROI</th></tr>';
  sHtml +=
    '<tr><th width="6%">圈选</th><th width="6%">上限</th><th width="6%">圈选</th><th width="6%">上限</th><th width="6%">成功</th><th width="10%">ROI</th><th width="6%">成功</th><th width="10%">ROI</th></tr>';
  sHtml +=
    '<tr class="total"><td>共计</td><td><span id="xzh_task_total">-</span><span class="xzh-label-tips" id="xzh_task_repeat_total"></span></td><td id="xzh_pre_dx_total">-</td><td id="xzh_max_dx_total" class="percent">-</td><td id="xzh_pre_dd_total">-</td><td id="xzh_max_dd_total" class="percent">-</td><td id="xzh_budget_total">-</td><td id="xzh_dx_total" class="percent">-</td><td><span id="xzh_dx_roi_total">-</span> / <span id="xzh_dx_7droi_total">-</span></td><td id="xzh_dd_total" class="percent">-</td><td><span id="xzh_dd_roi_total">-</span> / <span id="xzh_dd_7droi_total">-</span></td><td id="xzh_expense_total">-</td><td id="xzh_roi_total">-</td><td id="xzh_7droi_total">-</td></tr>';
  for (var i = 0; i < days; i++) {
    var date = new Date();
    date.setTime(date.getTime() - 24 * 3600 * 1000 * i);
    sHtml +=
      "<tr><td>" +
      date.format("yyyy-MM-dd") +
      '</td><td><span id="xzh_task_' +
      i +
      '">-</span><span class="xzh-label-tips" id="xzh_task_repeat_' +
      i +
      '"></span></td><td id="xzh_pre_dx_' +
      i +
      '">-</td><td id="xzh_max_dx_' +
      i +
      '" class="percent">-</td><td id="xzh_pre_dd_' +
      i +
      '">-</td><td id="xzh_max_dd_' +
      i +
      '" class="percent">-</td><td id="xzh_budget_' +
      i +
      '">-</td><td id="xzh_dx_' +
      i +
      '" class="percent">-</td><td><span id="xzh_dx_roi_' +
      i +
      '">-</span> / <span id="xzh_dx_7droi_' +
      i +
      '">-</span></td><td id="xzh_dd_' +
      i +
      '" class="percent">-</td><td><span id="xzh_dd_roi_' +
      i +
      '">-</span> / <span id="xzh_dd_7droi_' +
      i +
      '">-</span></td><td id="xzh_expense_' +
      i +
      '">-</td><td id="xzh_roi_' +
      i +
      '">-</td><td id="xzh_7droi_' +
      i +
      '">-</td></tr>';
  }
  sHtml += "</table>";

  showMasker(sHtml);

  $(".xzh-label-tips").hide();

  getTask(days);

  // 保存数据
  $("#xzh-fee input").bind("input propertychange", function () {
    var val = $(this).val();
    var key = "xzh_" + $(this).data("channel") + "_fee_" + pin;
    if (val.length == 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, val);
    }
  });
}

function getTask(days = 30, page = 1, times = 0, repeat = []) {
  console.log("投放费用--->days", days);

  // 递归次数限制
  if (times > 10) return;

  var is_end = false;
  $.ajax({
    url: "/mkt/api/mt/task/list?page=" + page + "&pageSize=500&type=1&keyword=",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      // console.log(res);
      is_end = res.data.lastPage;

      var last_date = "";

      // 过滤掉高阶任务
      let filterTaskList = res.data.result.filter(
        (item) => item.taskEdition !== 3
      );
      for (var i = 0; i < filterTaskList.length; i++) {
        var channel =
          filterTaskList[i].channel.sms_template_id > 0 ? "dx" : "dd";

        var datetime = new Date(
          filterTaskList[i].execRule.replace(
            /^(\d+)\s(\d+)\s(\d+)\s(\d+)\s\?\s(\d+)$/,
            "$5/$4/$3 $2:$1"
          )
        );
        var j = datetime.diff();

        let pinCount = filterTaskList[i].pinCount;
        let maxPinCount = filterTaskList[i].maxPinCount;
        if (pinCount < 0) {
          pinCount = getEstimateSize(filterTaskList[i].name);
        }

        //周期任务
        if (filterTaskList[i].execRule.indexOf("? ? ? ?") > 0) {
          repeat.push(filterTaskList[i].id);
          // 有下一次执行时间
          if (filterTaskList[i].nextExecTime) {
            addDataTable({
              pinCount: pinCount,
              maxPinCount: pinCount < maxPinCount || !maxPinCount ? pinCount : maxPinCount,
              successPercent: 0,
              date: filterTaskList[i].nextExecTime,
              channel: channel,
              repeat: true,
            });
          }
          // 周期任务T+1数据，加上昨天的数据【报表数据提前，会导致数据重复】
          if (
            filterTaskList[i].startTime.diff() > 0 &&
            filterTaskList[i].endTime.diff() < 1
          ) {
            addDataTable({
              pinCount: pinCount,
              maxPinCount: pinCount < maxPinCount || !maxPinCount ? pinCount : maxPinCount,
              successPercent: filterTaskList[i].successPinPercent ?
                filterTaskList[i].successPinPercent.substr(
                  0,
                  filterTaskList[i].successPinPercent.length - 1
                ) : 0,
              date: new Date().daydiff(-1).format("yyyy-MM-dd"),
              channel: channel,
              index: 1,
              repeat: true,
            });
          }
          continue;
        }

        // console.log("datetime:"+channel+i+"->"+j, datetime, filterTaskList[i].execRule);

        if (j >= days) {
          console.log(
            "datetime:" + i + "->" + j,
            datetime.format("yyyy-MM-dd")
          );
          last_date = new Date(datetime.getTime() + 86400000);
          is_end = true;
          break;
        }

        addDataTable({
          pinCount,
          maxPinCount: pinCount < maxPinCount || !maxPinCount ? pinCount : maxPinCount,
          successPercent: filterTaskList[i].successPinPercent ?
            filterTaskList[i].successPinPercent.substr(
              0,
              filterTaskList[i].successPinPercent.length - 1
            ) : 0,
          date: datetime.format("yyyy-MM-dd"),
          channel: channel,
          index: j,
        });

        last_date = datetime;
      }
      if (!is_end) {
        getTask(days, res.data.nextPage, ++times, repeat);
      }

      // 处理订单数据
      if (is_end) {
        last_date = last_date ? last_date : new Date();
        // 24小时ROI
        $.ajax({
          url: "/mkt/api/mt/task/stats?dtFrom=" +
            last_date.format("yyyy-MM-dd") +
            "&dtTo=" +
            new Date().format("yyyy-MM-dd") +
            "&taskId=&planId=&period=1&viewMode=1&statType=1",
          type: "GET",
          dataType: "json",
          contentType: "application/json",
          success: function (res) {
            var list = res.data.list;
            console.log("24小时ROI--->", res);
            var pay_amount = [];
            for (var i = 0; i < list.length; i++) {
              var index = new Date(list[i].dt).diff();
              var channel = list[i].successSmsUserNum ? "dx" : "dd";
              // 周期任务，加数
              if (repeat.indexOf(list[i].taskId) > -1) {
                addDataTable({
                    pinCount: list[i].targetUserNum,
                    maxPinCount: list[i].targetUserNum,
                    successPinCount: list[i].successUserNum,
                    successPercent: list[i].successRate,
                    date: list[i].dt,
                    index: index,
                    channel: channel,
                    repeat: true,
                  },
                  false
                );
              }
              if (!pay_amount[index]) {
                pay_amount[index] = [];
              }
              if (!pay_amount[index][channel]) {
                pay_amount[index][channel] = 0;
              }
              pay_amount[index][channel] += list[i].payAmount ?
                list[i].payAmount :
                0;
            }
            // 计算ROI
            console.log("计算ROI--->", pay_amount);
            updateDataTableRoi(pay_amount, 1);
          },
        });

        // 7日ROI
        $.ajax({
          url: "/mkt/api/mt/task/stats?dtFrom=" +
            last_date.format("yyyy-MM-dd") +
            "&dtTo=" +
            new Date().format("yyyy-MM-dd") +
            "&taskId=&planId=&period=2&viewMode=1&statType=1",
          type: "GET",
          dataType: "json",
          contentType: "application/json",
          success: function (res) {
            // console.log(res)
            var list = res.data.list;
            var pay_amount = [];
            for (var i = 0; i < list.length; i++) {
              var index = new Date(list[i].dt).diff();
              var channel = list[i].successSmsUserNum ? "dx" : "dd";
              // 周期任务，加数
              if (repeat.indexOf(list[i].taskId) > -1) {
                addDataTable({
                    pinCount: list[i].targetUserNum,
                    maxPinCount: list[i].targetUserNum,
                    successPinCount: list[i].successUserNum,
                    successPercent: list[i].successRate,
                    date: list[i].dt,
                    index: index,
                    channel: channel,
                    repeat: true,
                  },
                  false
                );
              }
              if (!pay_amount[index]) {
                pay_amount[index] = [];
              }
              if (!pay_amount[index][channel]) {
                pay_amount[index][channel] = 0;
              }
              pay_amount[index][channel] += list[i].payAmount ?
                list[i].payAmount :
                0;
            }
            // 计算ROI
            // console.log(pay_amount);
            updateDataTableRoi(pay_amount, 2);
          },
        });
      }
    },
  });

  // console.log("repeat", repeat);
}

// 获取人群包预估人数
function getEstimateSize(name) {
  let size = 0;
  $.ajax({
    url: `/mkt/api/crowd/list?page=1&pageSize=10&keyword=${name}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      size =
        res.data.result && res.data.result.length ? res.data.result[0].size : 0;
    },
  });
  return size;
}

function updateDataTableRoi(data, period = 1) {
  var fees = {
    dx: $("#xzh-fee input:first").val(),
    dd: $("#xzh-fee input:last").val(),
  };
  var amount = [];
  var total = {
    dx: 0,
    dd: 0
  };
  var type = period == 1 ? "_roi_" : "_7droi_";
  for (i in data) {
    // console.log(data[i]);
    for (j in data[i]) {
      var expense =
        ($("#xzh_" + j + "_" + i).text() == "-" ?
          0 :
          $("#xzh_" + j + "_" + i).text()) * fees[j];
      // console.log("expense_"+j+i, expense, data[i][j]);
      $("#xzh_" + j + type + i).text(
        expense ? Math.round(data[i][j] / expense) / 100 : 0
      );
      if (!amount[i]) amount[i] = 0;
      amount[i] += data[i][j];
      total[j] += data[i][j];
    }
  }
  // 日ROI
  for (i in data) {
    var expense =
      $("#xzh_expense_" + i).text() == "-" ? 0 : $("#xzh_expense_" + i).text();
    $("#xzh" + type + i).text(
      expense ? Math.round(amount[i] / expense) / 100 : 0
    );
  }

  // 总ROI
  var expense = {
    dx: ($("#xzh_dx_total").text() == "-" ? 0 : $("#xzh_dx_total").text()) *
      fees.dx,
    dd: ($("#xzh_dd_total").text() == "-" ? 0 : $("#xzh_dd_total").text()) *
      fees.dd,
  };
  $("#xzh_dx" + type + "total").text(
    expense.dx ? Math.round(total.dx / expense.dx) / 100 : 0
  );
  $("#xzh_dd" + type + "total").text(
    expense.dd ? Math.round(total.dd / expense.dd) / 100 : 0
  );

  var expense =
    $("#xzh_expense_total").text() == "-" ? 0 : $("#xzh_expense_total").text();
  $("#xzh" + type + "total").text(
    expense ? Math.round((total.dd + total.dx) / expense) / 100 : 0
  );
}

function addDataTable(data, update_percent = true) {
  var fees = {
    dx: $("#xzh-fee input:first").val(),
    dd: $("#xzh-fee input:last").val(),
  };
  // console.log(fees);

  if (!data.index) {
    data.index = new Date(data.date).diff();
  }

  var task_total =
    $("#xzh_task_total").text() == "-" ?
    1 :
    parseInt($("#xzh_task_total").text()) + 1;
  var task_count =
    $("#xzh_task_" + data.index).text() == "-" ?
    1 :
    parseInt($("#xzh_task_" + data.index).text()) + 1;
  if (data.repeat) {
    var task_repeat_count = $("#xzh_task_repeat_" + data.index).text() ?
      parseInt($("#xzh_task_repeat_" + data.index).text()) + 1 :
      1;
    $("#xzh_task_repeat_" + data.index).text(task_repeat_count);
    $("#xzh_task_repeat_" + data.index).show();
  }

  data.successPinCount = data.successPinCount ?
    data.successPinCount :
    Math.round((data.successPercent * data.maxPinCount) / 100);
  data.maxExpense = fees[data.channel] * data.maxPinCount;
  data.successExpense = fees[data.channel] * data.successPinCount;

  // console.log(data);

  var pre_total =
    ($("#xzh_pre_" + data.channel + "_total").text() == "-" ?
      0 :
      parseInt($("#xzh_pre_" + data.channel + "_total").text())) +
    data.pinCount;
  var max_total =
    ($("#xzh_max_" + data.channel + "_total").text() == "-" ?
      0 :
      parseInt($("#xzh_max_" + data.channel + "_total").text())) +
    data.maxPinCount;
  var pin_total =
    ($("#xzh_" + data.channel + "_total").text() == "-" ?
      0 :
      parseInt($("#xzh_" + data.channel + "_total").text())) +
    data.successPinCount;
  var budget_total =
    ($("#xzh_budget_total").text() == "-" ?
      0 :
      parseFloat($("#xzh_budget_total").text())) + data.maxExpense;
  var expense_total =
    ($("#xzh_expense_total").text() == "-" ?
      0 :
      parseFloat($("#xzh_expense_total").text())) + data.successExpense;

  var pre =
    ($("#xzh_pre_" + data.channel + "_" + data.index).text() == "-" ?
      0 :
      parseInt($("#xzh_pre_" + data.channel + "_" + data.index).text())) +
    data.pinCount;
  var max =
    ($("#xzh_max_" + data.channel + "_" + data.index).text() == "-" ?
      0 :
      parseInt($("#xzh_max_" + data.channel + "_" + data.index).text())) +
    data.maxPinCount;
  var success_count =
    ($("#xzh_" + data.channel + "_" + data.index).text() == "-" ?
      0 :
      parseInt($("#xzh_" + data.channel + "_" + data.index).text())) +
    data.successPinCount;
  var budget =
    ($("#xzh_budget_" + data.index).text() == "-" ?
      0 :
      parseFloat($("#xzh_budget_" + data.index).text())) + data.maxExpense;
  var expense =
    ($("#xzh_expense_" + data.index).text() == "-" ?
      0 :
      parseFloat($("#xzh_expense_" + data.index).text())) +
    data.successExpense;

  $("#xzh_task_total").text(task_total);
  $("#xzh_pre_" + data.channel + "_total").text(pre_total);
  $("#xzh_max_" + data.channel + "_total").text(max_total);
  $("#xzh_" + data.channel + "_total").text(pin_total);
  $("#xzh_budget_total").text(budget_total.toFixed(2));
  $("#xzh_expense_total").text(expense_total.toFixed(2));

  $("#xzh_task_" + data.index).text(task_count);
  $("#xzh_pre_" + data.channel + "_" + data.index).text(pre);
  $("#xzh_max_" + data.channel + "_" + data.index).text(max);
  $("#xzh_" + data.channel + "_" + data.index).text(success_count);
  $("#xzh_budget_" + data.index).text(budget.toFixed(2));
  $("#xzh_expense_" + data.index).text(expense.toFixed(2));

  if (update_percent) {
    if (max / pre < 0.5) {
      $("#xzh_max_" + data.channel + "_" + data.index).addClass("percent_red");
    } else {
      $("#xzh_max_" + data.channel + "_" + data.index).removeClass(
        "percent_red"
      );
    }

    $("#xzh_max_" + data.channel + "_" + data.index).css(
      "background-size",
      ((max / pre) * 100).toFixed(0) + "% 50%"
    );
    $("#xzh_" + data.channel + "_" + data.index).css(
      "background-size",
      ((success_count / max) * 100).toFixed(0) + "% 50%"
    );
    $("#xzh_max_" + data.channel + "_total").css(
      "background-size",
      ((max_total / pre_total) * 100).toFixed(0) + "% 50%"
    );
    $("#xzh_" + data.channel + "_total").css(
      "background-size",
      ((pin_total / max_total) * 100).toFixed(0) + "% 50%"
    );
  }
}

function convertUrls(data) {
  // console.log(data)
  if (!data) {
    return false;
  }
  for (i = 0; i < data.length; i++) {
    if (!data[i]) {
      continue;
    }
    if (
      !data[i]["SKU"] &&
      data[i]["圈选条件"] &&
      isSku(data[i]["圈选条件"]) &&
      data[i]["圈选条件"].indexOf(",") < 0
    ) {
      data[i]["SKU"] = data[i]["圈选条件"];
    }
    if (!data[i]["SKU"]) {
      continue;
    }
    if (data[i]["投放渠道"] && data[i]["投放渠道"] == "短信") {
      continue;
    }

    (function (i) {
      var t = 500;
      // 联盟
      setTimeout(function () {
        if (operator.hasOwnProperty(pin)) {
          var m = data[i]["文案内容"].match(
            /##?长?(?:HTTP_?)?URL(!|！)?(?:_(\d{8})_(\w{32}))?(?:[（\(](\w+)[）\)])?/
          );
          var coupon = "";
          var giftkey = "";
          if (!m) {
            m =
              data["投放渠道"] == "短信" ? ["#URL"] : ["#HTTP_URL", undefined, undefined, "HTTP_"];
            data[i]["文案内容"] += m[0];
          }
          // 强行转链
          if (m[1]) {
            coupon = "NO_COUPON";
          }
          // 优惠券
          if (m[2] && m[3]) {
            coupon =
              "https://coupon.m.jd.com/coupons/show.action?key=" +
              m[3] +
              "&roleId=" +
              m[2];
          }
          // 礼金
          if (m[4]) {
            giftkey = m[4];
          }
          // console.log(coupon)
          makeUnionLink({
              sku: data[i]["SKU"],
              sid: operator[pin],
              no: data[i]["任务名"] ? data[i]["任务名"].substr(-4) : "",
              coupon: coupon,
              giftkey: giftkey,
            },
            function (res) {
              if (res.error) {
                $("#xzh-content-status-" + i).text(res.message);
                $("#xzh-content-status-" + i)
                  .parents("tr")
                  .addClass("error");
                return;
              }
              url = res.result.link;
              // console.log("URL"+i, url);
              convertUrl(data[i], i, url);
            }
          );
        } else {
          convertUrl(data[i], i);
        }
      }, i * t);
    })(i);
  }
}

function convertUrl(data, i, url) {
  url = url ? url : "https://item.jd.com/" + data["SKU"] + ".html";
  data["中转页"] = data["中转页"] ? data["中转页"] : "否";
  data["短链接"] = data["短链接"] ? data["短链接"] : "是";

  // 解析链接类型
  var m = data["文案内容"].match(
    /#(#)?(长)?(HTTP_?)?URL[!|！]?(?:_\d{8}_\w{32})?/
  );
  if (!m) {
    return;
  }
  // 中转页
  if (m[1]) {
    data["中转页"] = "是";
  }
  // 短链接
  if (m[2]) {
    data["短链接"] = "否";
  }
  // HTTP
  data["HTTP"] = m[3] ? true : false;

  if (data["中转页"] == "是") {
    var long_url =
      "https://xngwtest.jd.com/erp/jd.html?a=" +
      data["SKU"] +
      "&date=" +
      new Date().format("yyMMdd");
    if (operator.hasOwnProperty(pin)) {
      url = long_url + "&d=" + url.substring(url.lastIndexOf("/") + 1);
    } else {
      url = long_url + "&u=" + encodeURIComponent(url);
    }
    $("#xzh-link-jump-" + i).text(url);
  }
  if (data["短链接"] == "是") {
    makeShortUrl(url, function (res) {
      url =
        data["HTTP"] && res.data.indexOf("http") < 0 ?
        "https://" + res.data :
        res.data;
      data["文案内容"] = data["文案内容"].replace(m[0], " " + url + " ");

      $("#xzh-link-shorturl-" + i).text(url);
      $("#xzh-content-" + i).text(data["文案内容"]);
      $("#xzh-content-status-" + i).text("转链成功");
      $("#xzh-content-status-" + i).addClass("xzh-label-green");
      $("#xzh-content-status-" + i).removeClass("xzh-label-red");
    });
  } else {
    url = data["HTTP"] && url.indexOf("http") < 0 ? "https://" + url : url;
    data["文案内容"] = data["文案内容"].replace(m[0], " " + url + " ");

    $("#xzh-content-" + i).text(data["文案内容"]);
    $("#xzh-content-status-" + i).text("转链成功");
    $("#xzh-content-status-" + i).addClass("xzh-label-green");
    $("#xzh-content-status-" + i).removeClass("xzh-label-red");
  }
}

function checkSkuStatus() {
  var sHtml =
    '<div style="width:80%;margin:40px 80px;">' +
    '<h1 style="text-align: center">查询SKU是否下架</h1>' +
    '<div><textarea id="xzh-check-sku" placeholder="输入要查询的SKU" rows="5" class="ant-input"></textarea></div>' +
    '<div style="margin-top:20px"><button id="xzh-btn-check-sku" onclick="startCheckSku();" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green xzh-btn-large"><span>查询</span></button></div>' +
    '在售SKU：<textarea id="xzh-sku-on-sale" rows="5" class="ant-input"></textarea>' +
    '下架SKU：<textarea id="xzh-sku-off-sale" rows="5" class="ant-input"></textarea>' +
    "</div>";
  showMasker(sHtml);
}

// 查询sku在售状态
function getSkuStutas(sku) {
  let isSkuOnSale = false;
  if (sku) {
    $.ajax({
      url: `/mkt/api/product/view/${sku}`,
      type: "GET",
      dataType: "json",
      async: false,
      contentType: "application/json",
      success: function (res) {
        if (res && res.data && res.data[0].price !== null) {
          isSkuOnSale = true;
        }
      },
    });
  }
  return isSkuOnSale;
}

// 开始校验sku是否下架
function startCheckSku() {
  $("#xzh-btn-check-sku").attr("disabled", true);
  $("#xzh-btn-check-sku").text("查询中。。。");
  var skusStr = $("#xzh-check-sku").val();
  let skuList = skusStr.split(",");
  let onSaleSkus = [];
  let offSaleSkus = [];
  skuList.forEach((sku, index) => {
    (function (index) {
      setTimeout(() => {
        let isCurSkuOnSale = getSkuStutas(sku);
        if (isCurSkuOnSale) {
          onSaleSkus = [...onSaleSkus, sku];
        } else {
          offSaleSkus = [...offSaleSkus, sku];
        }
        if (index === skuList.length - 1) {
          $("#xzh-sku-on-sale").val(onSaleSkus.join(","));
          $("#xzh-sku-off-sale").val(offSaleSkus.join(","));
          $("#xzh-btn-check-sku").attr("disabled", false);
          $("#xzh-btn-check-sku").text("查询");
        }
      }, index * 200);
    })(index);
  });
}

// 查询sku预估人数
function searchSkuPinCount() {
  var sHtml =
    '<div style="width:98%;margin:20px;" id="sku-pin-count-container">' +
    '<h1 style="text-align: center">查询SKU预估人数</h1>' +
    "<span>预估天数：</span>" +
    '<div class="ant-radio-group ant-radio-group-outline" style="margin:15px 0">' +
    '<label class="ant-radio-wrapper ant-radio-wrapper-checked radio__2utzi"><span class="ant-radio ant-radio-checked"><input type="radio" name="xzh-radio-sku-pin-count-days" class="ant-radio-input" value="30" checked><span class="ant-radio-inner"></span></span><span>30</span></label>' +
    '<label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-sku-pin-count-days" type="radio" class="ant-radio-input" value="15"><span class="ant-radio-inner"></span></span><span>15</span></label>' +
    '<label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-sku-pin-count-days" type="radio" class="ant-radio-input" value="7"><span class="ant-radio-inner"></span></span><span>7</span></label>' +
    '<label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-sku-pin-count-days" type="radio" class="ant-radio-input" value="3"><span class="ant-radio-inner"></span></span><span>3</span></label>' +
    '<label class="ant-radio-wrapper radio__2utzi"><span class="ant-radio"><input name="xzh-radio-sku-pin-count-days" type="radio" class="ant-radio-input" value="1"><span class="ant-radio-inner"></span></span><span>1</span></label>' +
    "</div>" +
    '<div><textarea id="xzh-search-sku-pin-count" placeholder="输入要查询的SKU" rows="7" class="ant-input"></textarea></div>' +
    '<div style="margin-top:20px"><button id="xzh-btn-search-sku-pin-count" onclick="startSearchSkuPinCount();" type="button" class="ant-btn button__1iBD7 button-type-primary__2i--z xzh-btn-green xzh-btn-large"><span>查询</span></button></div>' +
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

// 查询sku
function startSearchSkuPinCount() {
  var skuStrs = $("#xzh-search-sku-pin-count").val();
  if ($("#sku-pin-count-table").length > 0) {
    $("#sku-pin-count-table").remove();
  }
  if (!skuStrs) {
    alert("请输入sku！");
    return;
  }
  $("#xzh-btn-search-sku-pin-count").attr("disabled", true);
  $("#xzh-btn-search-sku-pin-count").text("查询中。。。");
  let skuData = skuStrs.split("\n");
  skuData = skuData.filter((item) => item);
  var day = $("input[name=xzh-radio-sku-pin-count-days]:checked").val();

  let tableElemet =
    '<table class="data" style="margin-top:15px" id="sku-pin-count-table"><tr><th width="5%">#</th><th width="50%">SKU</th><th width="15%">' +
    day +
    '日浏览</th><th width="15%">' +
    day +
    "日付款</th>" +
    '<th width="15%">' +
    day +
    "日加购</th>" +
    "</tr>";
  tableElemet += skuData
    .map(
      (sku, i) =>
      `<tr><td>${
          i + 1
        }</td><td id="xzh-sku-data-${i}">${sku}</td><td id="xzh-sku-liulan-${i}">-</td><td id="xzh-sku-fukuan-${i}">-</td><td id="xzh-sku-jiagou-${i}">-</td></tr>`
    )
    .join("");
  tableElemet += "</table>";
  $("#sku-pin-count-container").append(tableElemet);

  for (i = 0; i < skuData.length; i++) {
    (function (i) {
      var t = 12500;
      if (skuData.length <= 5) {
        t = 500;
      }
      // 查询浏览
      setTimeout(function () {
        getPinCount({
            浏览: {
              days: day,
              sku: skuData[i],
            },
          },
          function (res) {
            $("#xzh-sku-liulan-" + i).text(
              typeof res.data === "number" ? res.data : res.result
            );
          },
          false
        );
      }, i * t);
      // 查询付款
      setTimeout(function () {
        getPinCount({
            付款: {
              days: day,
              sku: skuData[i],
            },
          },
          function (res) {
            $("#xzh-sku-fukuan-" + i).text(
              typeof res.data === "number" ? res.data : res.result
            );
          },
          false
        );
      }, (i + 1) * t * 1.5 + 1000);
      // 查询加购
      setTimeout(function () {
        getPinCount({
            加购: {
              days: day,
              sku: skuData[i],
            },
          },
          function (res) {
            $("#xzh-sku-jiagou-" + i).text(
              typeof res.data === "number" ? res.data : res.result
            );
            let liulanTotal = 0;
            let fukuanTotal = 0;
            let jiagouTotal = 0;
            if (i === skuData.length - 1) {
              skuData.forEach((sku, i) => {
                liulanTotal += isNaN($(`#xzh-sku-liulan-${i}`).text()) ?
                  0 :
                  Number($(`#xzh-sku-liulan-${i}`).text());
                fukuanTotal += isNaN($(`#xzh-sku-fukuan-${i}`).text()) ?
                  0 :
                  Number($(`#xzh-sku-fukuan-${i}`).text());
                jiagouTotal += isNaN($(`#xzh-sku-jiagou-${i}`).text()) ?
                  0 :
                  Number($(`#xzh-sku-jiagou-${i}`).text());
              });
              let totalRow = `<tr><td>总计</td><td id="xzh-sku-data">-</td><td id="xzh-sku-liulan-total">${liulanTotal}</td><td id="xzh-sku-fukuan-total">${fukuanTotal}</td><td id="xzh-sku-jiagou-total">${jiagouTotal}</td></tr>`;
              $("#sku-pin-count-table").append(totalRow);
            }
          },
          false
        );
      }, (i + 1) * t * 2 + 1000);
    })(i);
    if (i === skuData.length - 1) {
      $("#xzh-btn-search-sku-pin-count").attr("disabled", false);
      $("#xzh-btn-search-sku-pin-count").text("查询");
    }
  }
}

function makeUnionLink(data, func) {
  var params = "";
  for (k in data) {
    params += "&" + k + "=" + encodeURIComponent(data[k]);
  }
  $.ajax({
    url: "https://yes.wth03.cn/jdapi.php?method=union.url&" + params,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: func,
  });
}

function makeShortUrl(url, func) {
  url = encodeURIComponent(url);
  $.ajax({
    url: "/mkt/api/sms/template/short-url?longUrl=" + url,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: func,
  });
}

// 处理画像数据
function getTags() {
  var s = $("#xzh-tag-list").val().trim();
  if (s.length == 0) {
    return false;
  }

  var tags = s.split("\n");
  var col = [];
  var data = {};
  // console.log("tags", tags);

  for (var i = 0; i < tags.length; i++) {
    var a = tags[i].split("\t");
    // 画像类型
    if (i == 0) {
      col = a;
      // console.log("col", col);
      continue;
    }
    for (var j = 1; j < a.length; j++) {
      // console.log(col[j]+"."+a[0], a[j]);
      if (a[j].length == 0 || a[j] == "/") {
        continue;
      }
      if (!data.hasOwnProperty(col[j])) {
        data[col[j]] = {};
      }
      data[col[j]][a[0]] = a[j].split("、");
    }
  }
  // console.log("TAGS", data);
  return data;
}

// 判断模板是否存在
function isHasTemplate(textId) {
  let template_id;
  $.ajax({
    url: `/mkt/api/template/view/${textId}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      if (res) {
        template_id = res.data;
      }
    },
  });
  return template_id;
}

// 解析投放任务
function getOptions(data, func, withApp) {
  console.log("getOptions--->000", data);

  // 关键圈选条件，浏览、加购、付款、搜索
  $key_option = false;

  var options = [];
  for (var k in data) {
    var operate = data[k]["diff"] ? "DIFF" : "INTSCT";
    switch (k) {
      case "浏览":
      case "加购":
      case "付款":
      case "浏览1":
      case "加购1":
      case "付款1":
      case "浏览2":
      case "加购2":
      case "付款2":
      case "浏览3":
      case "加购3":
      case "付款3":
      case "浏览4":
      case "加购4":
      case "付款4":
      case "浏览5":
      case "加购5":
      case "付款5":
      case "浏览6":
      case "加购6":
      case "付款6":
        console.log("商品--->", k, data[k]);
        if (datatype(data[k]) == "Array") {
          for (var i = 0; i < data[k].length; i++) {
            options.push.apply(
              options,
              getOptions({
                [k]: data[k][i],
              })
            );
          }
          break;
        }
        if (typeof data[k]["sku"] == "string") {
          data[k]["sku"] = explode(data[k]["sku"]);
        }
        if (data[k]["logic"] == undefined) {
          data[k]["logic"] = "gte";
        }
        if (data[k]["counts"] == undefined) {
          data[k]["counts"] = 1;
        }

        var sku = splitArray(data[k]["sku"]);
        let endKey = k.substring(0, 2);
        for (var i = 0; i < sku.length; i++) {
          // 填空商品
          if (
            data[k]["spacer"] &&
            data[k]["spacer"].length &&
            data[k]["spacer"].length >= MIN_SKU_AND_SHOP_LENGTH &&
            operate == "INTSCT"
          ) {
            sku[i].push.apply(sku[i], data[k]["spacer"]);
            // 增加排除条件
            options.push({
              labelId: LABEL_OPTION_CONFIG[endKey][data[k]["days"]],
              labelOptionType: 5,
              value: '{"' +
                data[k]["logic"] +
                '":"' +
                data[k]["counts"] +
                '","sku":"' +
                data[k]["spacer"].join(",") +
                '"}',
              operate: "DIFF",
            });
          }
          var s = sku[i].join(",");
          // sku不能单个查询
          if (/^\d+$/.test(s)) {
            s = (s + ",").repeat(4) + s;
          }
          options.push({
            labelId: LABEL_OPTION_CONFIG[endKey][data[k]["days"]],
            labelOptionType: 5,
            value: '{"' +
              data[k]["logic"] +
              '":"' +
              data[k]["counts"] +
              '","sku":"' +
              s +
              '"}',
            operate: operate,
          });
        }
        $key_option = true;
        break;

        // 处理店铺条件
      case "店铺浏览":
      case "店铺加购":
      case "店铺付款":
      case "店铺咨询":
      case "店铺关注":
      case "店铺浏览1":
      case "店铺加购1":
      case "店铺付款1":
      case "店铺咨询1":
      case "店铺关注1":
      case "店铺浏览2":
      case "店铺加购2":
      case "店铺付款2":
      case "店铺咨询2":
      case "店铺关注2":
      case "店铺浏览3":
      case "店铺加购3":
      case "店铺付款3":
      case "店铺咨询3":
      case "店铺关注3":
      case "店铺浏览4":
      case "店铺加购4":
      case "店铺付款4":
      case "店铺咨询4":
      case "店铺关注4":
      case "店铺浏览5":
      case "店铺加购5":
      case "店铺付款5":
      case "店铺咨询5":
      case "店铺关注5":
        let valueData = data[k];
        let shopKey = k.substring(0, 4);
        console.log("店铺条件---->", valueData);
        let shop = valueData["shop"];
        let value = {
          [valueData["logic"]]: valueData["counts"],
        };
        if (shop && shop.length && shop.length >= MIN_SKU_AND_SHOP_LENGTH) {
          value.otherShops = true;
          // 公域
          value.shop = shop.join(",");
        } else {
          // 私域
          // value.shop = localStorage.getItem("shopId");
          value.shop =
            (data["data"] && data["data"]["私域店铺"]) ||
            localStorage.getItem("shopId");
        }
        console.log("店铺条件--->", k);
        options.push({
          labelId: LABEL_OPTION_CONFIG[shopKey][data[k]["days"]],
          labelOptionType: 6,
          operate: operate,
          value: JSON.stringify(value),
        });
        $key_option = true;
        break;

      case "品类":
      case "品类浏览":
      case "品类付款":
      case "品类加购":
      case "品类浏览1":
      case "品类付款1":
      case "品类加购1":
      case "品类浏览2":
      case "品类付款2":
      case "品类加购2":
      case "品类浏览3":
      case "品类付款3":
      case "品类加购3":
      case "品类浏览4":
      case "品类付款4":
      case "品类加购4":
        console.log("品类---->", data[k]);
        let cateKey = k;
        if (k.length >= 4) {
          cateKey = k.substring(0, 4);
        }
        if (datatype(data[k]) == "Array") {
          for (var i = 0; i < data[k].length; i++) {
            options.push.apply(
              options,
              getOptions({
                [k]: data[k][i],
              })
            );
          }
          break;
        }
        if (typeof data[k]["cate"] == "string") {
          data[k]["cate"] = data[k]["cate"].split("\n");
        }

        let allCateArr = explode(data[k]["cate"]);
        console.log("品类标签--->allCateArr", allCateArr);
        var cate = {
          cList: []
        };
        var valueCount = {
          gte: data[k].counts || 1
        };
        console.log("品类标签--->", LABEL_OPTION_CONFIG[cateKey]);
        for (var i = 0; i < allCateArr.length; i++) {
          let cateObj = {
            labelId: LABEL_OPTION_CONFIG[cateKey][data[k]["days"]],
            labelOptionType: 11,
            value: "",
            operate: operate,
          };
          if (
            allCateArr[i].indexOf("&") !== -1 &&
            allCateArr[i].split("&").length > 1
          ) {
            // 如果有&符号的代表为一个混合标签，其他都是单个标签
            allCateArr[i].split("&").forEach((item, index) => {
              cate.cList[index] = getCatsDataFromCatNames(item);
            });
            cateObj.value = JSON.stringify({
              ...cate,
              ...valueCount,
            });
            options.push(cateObj);
          } else {
            cate.cList[0] = getCatsDataFromCatNames(allCateArr[i]);
            cateObj.value = JSON.stringify({
              ...cate,
              ...valueCount
            });
            options.push(cateObj);
          }
        }
        $key_option = true;
        break;

      case "搜索":
      case "搜索1":
      case "搜索2":
      case "搜索3":
      case "实时搜索":
      case "实时搜索1":
      case "实时搜索2":
      case "实时搜索3":
      case "实时搜索4":
        console.log("搜索标签--->", data[k]);
        let searchLabelKey = k;
        if (searchLabelKey.includes("实时")) {
          searchLabelKey = searchLabelKey.substring(0, 4);
        } else {
          searchLabelKey = searchLabelKey.substring(0, 2);
        }
        let curLabelId =
          searchLabelKey === "搜索" ?
          LABEL_OPTION_CONFIG[searchLabelKey][data[k]["days"]] :
          REAL_TIME_LABEL_CONFIG[searchLabelKey].labelId;

        // 支持圈选天数大于三十天的的时候，关键词搜索默认最大值三十天
        if (Number(data[k]["days"]) > 30) {
          curLabelId = LABEL_OPTION_CONFIG[searchLabelKey]["30"];
        }

        let words =
          searchLabelKey === "搜索" ?
          data[k]["keywords"] :
          data[k][2].split(",");
        console.log("搜索标签--->words", words);
        let allKeywordsArr = explode(words);
        console.log("搜索标签--->allKeywordsArr", allKeywordsArr);
        let tempKeywords;
        if (allKeywordsArr.length && allKeywordsArr[0].includes("&")) {
          tempKeywords = allKeywordsArr[0].split("&");
        } else {
          tempKeywords = allKeywordsArr;
        }
        if (tempKeywords.length > 10) {
          alert("单个标签的搜索词不能超过10个词！");
          return;
        }
        let hourDataObj = {};
        if (searchLabelKey === "实时搜索") {
          if (data[k][3] && data[k][3].includes("-")) {
            operate = "DIFF";
          }
          let hourArr = data[k][1].split(",");
          hourDataObj.startHour =
            hourArr[0] < 10 ? "0" + hourArr[0] : hourArr[0];
          hourDataObj.endHour = hourArr[1] < 10 ? "0" + hourArr[1] : hourArr[1];
        }

        allKeywordsArr.forEach((i) => {
          let word = i;
          let count = data[k].counts || 1;
          if (searchLabelKey === "实时搜索") {
            count = data[k][4];
          } else {
            if (i.includes(">")) {
              word = i.split(">")[0];
              count = i.split(">")[1];
            }
          }
          let countObj = {
            gte: count
          };
          let keywordObj = {
            labelId: curLabelId,
            labelOptionType: 7,
            value: "",
            operate: operate,
          };
          if (word.indexOf("&") !== -1) {
            // 如果有&符号的代表为一个混合标签，其他都是单个标签
            keywordObj.value = JSON.stringify({
              keyword: word.split("&").join(","),
              ...hourDataObj,
              ...countObj,
            });
            options.push(keywordObj);
          } else {
            keywordObj.value = JSON.stringify({
              keyword: word,
              ...hourDataObj,
              ...countObj,
            });
            options.push(keywordObj);
          }
          $key_option = true;
        });
        break;

      case "收货地址":
      case "常用收货地址":
        console.log("收货地址--->", data[k]);
        var a = data[k];

        let addressArr = a[0].split("，").map((item) => item.trim());
        let diffAddressArr = addressArr
          .filter((item) => item.includes("-"))
          .map((item) => item.substr(1));
        let defaultAddressArr = addressArr.filter(
          (item) => !item.includes("-")
        );
        if (diffAddressArr.length) {
          let tempDi;
          options.push({
            labelId: ADDRESS_LABEL_ID,
            labelOptionType: 2,
            value: diffAddressArr.join(","),
            operate: "DIFF",
          });
        }
        if (defaultAddressArr.length) {
          options.push({
            labelId: ADDRESS_LABEL_ID,
            labelOptionType: 2,
            value: defaultAddressArr.join(","),
            operate: operate,
          });
        }

        break;
      case "用户是店铺/品牌会员":
        console.log("用户是店铺/品牌会员-->", data[k]);
        if (data[k][0].includes("是")) {
          let curValueObj = {
            shop: localStorage.getItem("shopId"),
            value: "1",
          };
          options.push({
            labelId: BRAND_MEMBER_LABEL_ID,
            labelOptionType: 9,
            value: JSON.stringify(curValueObj),
            operate: data[k][0].includes("-") ? "DIFF" : operate,
          });
        }
        break;
      case "用户是京东PLUS会员":
        console.log("用户是京东PLUS会员-->", data[k]);
        if (data[k][0].includes("是")) {
          let curValueObj = {
            431: "1",
          };
          options.push({
            labelId: PLUS_MEMBER_LABEL_ID,
            labelOptionType: 1,
            value: JSON.stringify(curValueObj),
            operate: data[k][0].includes("-") ? "DIFF" : operate,
          });
        }
        break;
      case "所在城市级别":
        console.log("所在城市级别-->", k, data[k], LABEL_OPTION_CONFIG[k]);
        if (data[k].length) {
          let diffCity = data[k].filter((item) => item.includes("-"));
          let intsctCity = data[k].filter((item) => !item.includes("-"));
          if (diffCity.length) {
            let diffCityLevelValueObj = {};
            diffCity.forEach((item) => {
              let city = item.replace("-", "");
              let id = LABEL_OPTION_CONFIG[k][city].id;
              let value = LABEL_OPTION_CONFIG[k][city].value;
              diffCityLevelValueObj[id] = value;
            });
            options.push({
              labelId: CITY_LEVEL_LABEL_ID,
              labelOptionType: 1,
              value: JSON.stringify(diffCityLevelValueObj),
              operate: "DIFF",
            });
          }
          if (intsctCity.length) {
            let intsctCityLevelValueObj = {};
            intsctCity.forEach((city) => {
              let id = LABEL_OPTION_CONFIG[k][city].id;
              let value = LABEL_OPTION_CONFIG[k][city].value;
              intsctCityLevelValueObj[id] = value;
            });
            options.push({
              labelId: CITY_LEVEL_LABEL_ID,
              labelOptionType: 1,
              value: JSON.stringify(intsctCityLevelValueObj),
              operate,
            });
          }
        }
        break;
      case "排除任务":
        // 校验排除任务是否符合要求--对应已触达标签
        if (data["排除任务"] && data["排除任务"].length > 0) {
          let touchedLabelValue = data["排除任务"];
          let touchedOption = {
            labelId: TOUCHED_LABEL_ID,
            labelOptionType: 13,
            operate: "DIFF",
          };
          if (touchedLabelValue.length > MAX_TOUCHED_TASK_ID_LENGTH) {
            $("#pincount_" + i).text(
              `排除任务模板错误，任务ID上限为${MAX_TOUCHED_TASK_ID_LENGTH}个`
            );
            $("#pincount_" + i)
              .parent()
              .addClass("error");
            return;
          }

          if (
            touchedLabelValue.some((item) => item <= MAX_TOUCHED_DAYS_SEND) &&
            touchedLabelValue.some((item) => item > MAX_TOUCHED_DAYS_SEND)
          ) {
            $("#pincount_" + i).text(
              "排除任务模板错误，天数和任务ID不可同时存在"
            );
            $("#pincount_" + i)
              .parent()
              .addClass("error");
            return;
          }

          if (
            touchedLabelValue.some((item) => item <= MAX_TOUCHED_DAYS_SEND) &&
            touchedLabelValue.length > 1
          ) {
            $("#pincount_" + i).text("排除任务模板错误，天数不能多个");
            $("#pincount_" + i)
              .parent()
              .addClass("error");
            return;
          }

          if (
            touchedLabelValue.some(
              (item) => Number(item) <= MAX_TOUCHED_DAYS_SEND
            ) &&
            touchedLabelValue.length === 1
          ) {
            let value = {
              filterBy: "days",
              value: Number(touchedLabelValue[0]),
              status: {
                dd: 1,
                sms: 1,
                call: 1
              },
            };
            touchedOption.value = JSON.stringify(value);
          }

          if (touchedLabelValue.every((item) => item > MAX_TOUCHED_DAYS_SEND)) {
            let value = {
              filterBy: "tasks",
              value: touchedLabelValue.join(","),
              status: {
                dd: 1,
                sms: 1,
                call: 1
              },
            };
            touchedOption.value = JSON.stringify(value);
          }

          options.push(touchedOption);
        }
        break;

      case "商品实时浏览":
      case "商品实时付款":
      case "商品实时加购":
      case "店铺实时浏览":
      case "店铺实时付款":
      case "店铺实时加购":
      case "品类实时浏览":
      case "品类实时付款":
      case "品类实时加购":

      case "商品实时浏览1":
      case "商品实时付款1":
      case "商品实时加购1":
      case "店铺实时浏览1":
      case "店铺实时付款1":
      case "店铺实时加购1":
      case "品类实时浏览1":
      case "品类实时付款1":
      case "品类实时加购1":

      case "商品实时浏览2":
      case "商品实时付款2":
      case "商品实时加购2":
      case "店铺实时浏览2":
      case "店铺实时付款2":
      case "店铺实时加购2":
      case "品类实时浏览2":
      case "品类实时付款2":
      case "品类实时加购2":

      case "商品实时浏览3":
      case "商品实时付款3":
      case "商品实时加购3":
      case "店铺实时浏览3":
      case "店铺实时付款3":
      case "店铺实时加购3":
      case "品类实时浏览3":
      case "品类实时付款3":
      case "品类实时加购3":

      case "商品实时浏览4":
      case "商品实时付款4":
      case "商品实时加购4":
      case "店铺实时浏览4":
      case "店铺实时付款4":
      case "店铺实时加购4":
      case "品类实时浏览4":
      case "品类实时付款4":
      case "品类实时加购4":
        // 0-标签类型；1-时间；2-value值；3-交集/差集；4-count
        console.log("实时标签-->数据转换", data[k]);
        let labelData = data[k];
        console.log("实时标签-->labelData", labelData);
        let labelKey = labelData[0];
        if (labelKey.length >= 6) {
          labelKey = labelKey.substring(0, 6);
        }
        let labelDataValue = labelData[2].split(",");
        if (labelData[3] && labelData[3].includes("-")) {
          operate = "DIFF";
        }
        let counts = labelData[4] || 1;
        console.log("实时标签-->labelDataValue", labelDataValue);
        let tempOption = {
          labelId: REAL_TIME_LABEL_CONFIG[labelKey].labelId,
          labelOptionType: REAL_TIME_LABEL_CONFIG[labelKey].labelOptionType,
          operate,
        };
        console.log("实时标签-->tempOption", tempOption);
        let valueObj = {};
        let hourData = labelData[1].split(",");
        valueObj.startHour = hourData[0] < 10 ? "0" + hourData[0] : hourData[0];
        valueObj.endHour = hourData[1] < 10 ? "0" + hourData[1] : hourData[1];
        if (
          tempOption.labelOptionType === 5 &&
          (labelDataValue.length < MIN_SKU_AND_SHOP_LENGTH ||
            labelDataValue.length > MAX_SKU_LENGTH)
        ) {
          $("#pincount_" + i).text("实时标签模板错误，sku个数不符合要求");
          $("#pincount_" + i)
            .parent()
            .addClass("error");
          console.log("error--->11111");
          return;
        }
        if (
          tempOption.labelOptionType === 6 &&
          labelDataValue.length > MAX_SHOP_ID_LENGTH
        ) {
          $("#pincount_" + i).text("实时标签模板错误，shop id个数不符合要求");
          $("#pincount_" + i)
            .parent()
            .addClass("error");
          console.log("error--->222222");
          return;
        }
        // 商品实时标签
        if (tempOption.labelOptionType === 5) {
          valueObj["gte"] = counts;
          valueObj["sku"] = labelData[2];
          options.push({
            ...tempOption,
            value: JSON.stringify(valueObj),
          });
        }
        // 店铺实时标签
        else if (tempOption.labelOptionType === 6) {
          valueObj["gte"] = counts;
          if (
            labelDataValue.length &&
            labelDataValue.length >= MIN_SKU_AND_SHOP_LENGTH
          ) {
            valueObj.otherShops = true;
            // 公域
            valueObj.shop = labelData[2];
          } else {
            // 私域
            // valueObj.shop = localStorage.getItem("shopId");
            valueObj.shop =
              (data["data"] && data["data"]["私域店铺"]) ||
              localStorage.getItem("shopId");
          }
          console.log("店铺实时标签--->valueObj", valueObj);
          options.push({
            ...tempOption,
            value: JSON.stringify(valueObj),
          });
        }
        // 品类实时标签
        else if (tempOption.labelOptionType === 11) {
          let catData = [];
          if (typeof labelData[2] == "string") {
            catData = labelData[2].split("\n");
          }

          let allCateArr = explode(catData[0]);
          console.log("实时标签-->品类标签--->allCateArr", allCateArr);
          var cate = {
            cList: []
          };
          for (var i = 0; i < allCateArr.length; i++) {
            let cateObj = tempOption;
            if (
              allCateArr[i].indexOf("&") !== -1 &&
              allCateArr[i].split("&").length > 1
            ) {
              // 如果有&符号的代表为一个混合标签，其他都是单个标签
              allCateArr[i].split("&").forEach((item, index) => {
                cate.cList[index] = getCatsDataFromCatNames(item);
              });
              cateObj.value = JSON.stringify({
                ...cate,
                ...valueObj,
                ...{
                  gte: counts
                },
              });
              options.push(cateObj);
            } else {
              cate.cList[0] = getCatsDataFromCatNames(allCateArr[i]);
              cateObj.value = JSON.stringify({
                ...cate,
                ...valueObj,
                ...{
                  gte: counts
                },
              });
              options.push(cateObj);
            }
          }
        }
        console.log("实时标签--valueObj", valueObj);
        $key_option = true;
        break;
      default:
        var a = data[k];
        if (typeof data[k] == "string") {
          a = data[k].split("、");
        }
        var is_alert = false;
        let tempValueObj = {};
        for (var i = 0; i < a.length; i++) {
          // console.log(k, a[i]);
          if (!LABEL_OPTION_CONFIG.hasOwnProperty(k)) {
            var keys = [];
            for (var p in LABEL_OPTION_CONFIG) keys.push(p);
            alert(
              "画像名称填写不规范【" + k + "】\n参考值：" + keys.join("、")
            );
          }
          if (!LABEL_OPTION_CONFIG[k].hasOwnProperty(a[i]) && !is_alert) {
            is_alert = true;
            var keys = [];
            for (var p in LABEL_OPTION_CONFIG[k]) keys.push(p);
            alert(
              "画像填写不规范【" +
              k +
              "：" +
              a[i] +
              "】\n参考值：" +
              keys.join("、")
            );
          }
          tempValueObj = {
            ...tempValueObj,
            ...{
              [LABEL_OPTION_CONFIG[k][a[i]]["id"]]: LABEL_OPTION_CONFIG[k][a[i]]["value"],
            },
          };
        }
        if (LABEL_OPTION_CONFIG[k]) {
          options.push({
            labelId: LABEL_OPTION_CONFIG[k][a[0]]["labelId"],
            labelOptionType: 1,
            value: JSON.stringify(tempValueObj),
            operate: operate,
          });
        }
    }
  }

  // 只投APP
  if (withApp) {
    options.push({
      labelId: COMMON_WAYS_OF_ORDER_APP_LABEL_ID,
      labelOptionType: 1,
      value: JSON.stringify({
        [COMMON_WAYS_OF_ORDER_APP_ID]: COMMON_WAYS_OF_ORDER_APP_LABEL_VALUE,
      }),
      operate: "INTSCT",
    });
  }

  // 没有出现关键条件，报错
  if (!$key_option && !(data["data"]["人群包id"] || data["data"]["crowdId"])) {
    alert("圈选条件过大，请检查");
    options = false;
  }

  // 将数据处理为人群包需要的标签格式
  var crowdOptions = null;
  if (data["data"] && (data["data"]["人群包id"] || data["data"]["crowdId"])) {
    crowdOptions = data["data"]["人群包id"] || data["data"]["crowdId"];
  } else {
    const excludeTouchedChannels = []; // 排除平台已触达渠道
    console.log("人群包--->123456", data, data["data"]);
    if (data["data"] && data["data"]["排除平台已触达渠道"]) {
      if (data["data"]["排除平台已触达渠道"].includes("咚咚")) {
        excludeTouchedChannels.push("dd");
      }
      if (data["data"]["排除平台已触达渠道"].includes("短信")) {
        excludeTouchedChannels.push("sms");
      }
    }
    console.log("人群包--->123456excludeTouchedChannels", excludeTouchedChannels);
    crowdOptions = {
      // name: (data["data"] && data["data"]["人群包名称"]) || "",
      name: isUat ?
        `测试-${moment().format("HH:mm:ss")}` : (data["data"] && data["data"]["人群包名称"]) ||
        (data["data"] && data["data"]["任务名"]) ||
        `预估人数-${moment().format("HH:mm:ss")}`,
      labelOptions: [{
          operator: "DEFAULT",
          label: {
            labels: options
              .filter((i) => i.operate === "INTSCT")
              .map((i) => {
                const {
                  operate,
                  ...other
                } = i;
                return other;
              }),
            type: "INTSCT",
          },
        },
        {
          operator: "DIFF",
          label: {
            labels: options
              .filter((i) => i.operate === "DIFF")
              .map((i) => {
                const {
                  operate,
                  ...other
                } = i;
                return other;
              }),
            type: "UNION",
          },
        },
      ],
      dataSource: 2,
      dataType: 1,
      crowdScopeType: 1,
      excludeTouchedChannels
    };
  }
  console.log("crowdOptions", crowdOptions);
  return crowdOptions;
}

// 查询人群包是否存在
function searchCrowd(name) {
  let existCrowdId = null;
  $.ajax({
    url: `/mkt/api/crowd/list?page=1&pageSize=10&keyword=${name}`, // 人群包2.0版---人群包列表
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      console.log("查询人群包是否存在--->existCrowdId", res);
      if (res.code === "success") {
        if (res.data && res.data.result && res.data.result.length > 0) {
          existCrowdId = res.data.result[0].id;
        }
      }
    },
  });
  return existCrowdId;
}

// 删除人群包
function deleteCrowd(id) {
  $.ajax({
    url: `/mkt/api/crowd/delete`, // 人群包2.0版---人群包列表
    type: "POST",
    dataType: "json",
    async: false,
    data: JSON.stringify([id]),
    contentType: "application/json",
    success: function (res) {
      console.log("删除人群包--->existCrowdId", res);
      if (res.code === "success") {
        console.log("人群包删除成功--->existCrowdId");
      }
    },
  });
}

function addCrowdFunc(options, number) {
  console.log("人群包--->add--->options", options);
  let resData = null;
  if (options && options.labelOptions) {
    if (!options.name) {
      $("#pincount_" + number).text("人群包名称不能为空");
      $("#pincount_" + number)
        .parent()
        .addClass("error");
      return;
    }
    const curCrowdId = searchCrowd(options.name);
    if (curCrowdId) {
      console.log("人群包--->存在--->isExistCrowd--->删除它");
      deleteCrowd(curCrowdId);
    }
    $.ajax({
      url: "/mkt/api/crowd/add", // 人群包2.0版---新增人群包
      type: "POST",
      dataType: "json",
      async: false,
      data: JSON.stringify(options),
      contentType: "application/json",
      success: function (res) {
        console.log("新增人群包的res1--->", res);
        if (res.state == "FAILURE" || res.state == "ERROR") {
          $("#pincount_" + number).text(res.result);
          $("#pincount_" + number)
            .parent()
            .addClass("error");
          resData = res.result + "&&人群包创建失败";
          return;
        }
        resData = res.data;
      },
    });
  } else {
    resData = options;
  }

  return resData;
}

function getSkuInfo(sku, index, func) {
  globalPostMessage({
    url: "http://quanxiaobao.cn/api/getskudata?sku=" + sku,
    type: "getJSON",
    api: "getSkuInfo",
    index,
    sku,
  });
}

// 获取sku信息后，渲染页面
function getSkuInfoToRender(data) {
  console.log("getSkuInfoToRender--->data", data);
  const {
    index: i,
    res,
    sku
  } = data;
  if (!res.result || !res.result.length) {
    alert(`未查到sku：${sku}的数据！`);
    return;
  }
  // $("#xzh_data_price_"+i).text(res.result.data[0].final_price);
  $("#xzh_data_price_" + i).text(res.result[0].goods_price);
  $("#xzh_data_comm_" + i).html(
    "<p>" +
    res.result[0].commisionRatioWl +
    '%</p><p id="xzh_data_commtotal_' +
    i +
    '" class="xzh-label-gray">' +
    (
      (res.result[0].goods_price * res.result[0].commisionRatioWl) /
      100
    ).toFixed(2) +
    "</p>"
  );
  $("#xzh_data_sku_" + i).append(
    "<p>" + res.result[0].goods_name.substr(0, 30) + "</p>"
  );
  setSkuData(i);
}

function getExcludeTask(days, page = 1, times = 0) {
  // console.log("Task", days, page, times);
  $("#xzh-exclude-task").attr("disabled", "disabled");

  // 递归次数限制
  if (times > 5) {
    return;
  }
  $.ajax({
    url: "/mkt/api/mt/task/list?page=" + page + "&pageSize=500&keyword=",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      // console.log(res);
      var is_end = res.data.lastPage;
      var task = $("#xzh-exclude-task")
        .val()
        .replace(/["\s\n，]/g, ",")
        .replace(/,,/g, ",")
        .split(",");
      if (task[0] == "") task.shift();
      for (var i = 0; i < res.data.result.length; i++) {
        if (res.data.result[i].status != 4) continue;
        // console.log(i, "OK", res.data.result[i])
        var datetime = new Date(
          res.data.result[i].execRule.replace(
            /^(\d+)\s(\d+)\s(\d+)\s(\d+)\s\?\s(\d+)$/,
            "$5/$4/$3 $2:$1"
          )
        );
        // console.log(days, datetime);
        if (
          datetime.getTime() + days * 24 * 3600 * 1000 <
          new Date().getTime()
        ) {
          is_end = true;
          break;
        }
        if ($.inArray(res.data.result[i].id, task) < 0) {
          task.push(res.data.result[i].id);
        }
      }
      // console.log(task);
      $("#xzh-exclude-task").removeAttr("disabled");
      $("#xzh-exclude-task").val(task.join(","));
      if (!is_end) {
        getExcludeTask(days, res.data.nextPage, ++times);
      }
    },
  });
}

function getPinCount(options, func, withApp = true) {
  let id = null;
  let labelOptions = [];
  console.log("options--->", options);
  // 校验投放的任务是否为当前登录的本店铺的任务
  if (options["data"] && options["data"]["店铺id"]) {
    const currentVenderId = localStorage.getItem("venderId");
    if (currentVenderId !== options["data"]["店铺id"]) {
      func({
        state: "FAILURE",
        result: "此条任务不属于当前店铺的任务！",
      });
      return;
    }
  }

  // 判断模板是否存在
  if (
    options["data"] &&
    options["data"]["投放渠道"] &&
    options["data"]["文案"]
  ) {
    const template_id = isHasTemplate(options["data"]["文案"]);
    if (!template_id) {
      func({
        state: "FAILURE",
        result: `${options["data"]["投放渠道"]}模板错误`,
      });
      return;
    } else if (template_id && template_id.channel) {
      if (
        TEMPLATE_TEXT[options["data"]["投放渠道"]] &&
        TEMPLATE_TEXT[options["data"]["投放渠道"]] !== template_id.channel
      ) {
        func({
          state: "FAILURE",
          result: `投放渠道${options["data"]["投放渠道"]}中不存在此文案模板`,
        });
        return;
      }
    }
  }

  if (
    options["data"] &&
    (options["data"]["人群包id"] || options["data"]["crowdId"])
  ) {
    id = options["data"]["人群包id"] || options["data"]["crowdId"];
  } else {
    const crowdOptions = getOptions(options, func, withApp);
    console.log("crowdOptions--->", crowdOptions);
    if (crowdOptions && crowdOptions.labelOptions.length > 0) {
      labelOptions = crowdOptions.labelOptions;
    }
  }

  if (id || labelOptions.length > 0) {
    let params = null;
    if (id) {
      params = {
        id
      };
    } else {
      params = {
        crowdScopeType: 1,
        labelOptions
      };
    }

    $.ajax({
      // url: "/mkt/api/label/options/pin-count",
      url: "/mkt/api/crowd/pin-count", // 人群包2.0版---任务中心的预估接口
      type: "POST",
      dataType: "json",
      data: JSON.stringify(params),
      contentType: "application/json",
      success: function (res) {
        console.log("预估的res--->", res);
        if (res.data) {
          const {
            finished,
            requestId
          } = res.data;
          if (finished) {
            func({
              data: res.data.count,
              id
            });
          } else {
            getRefreshPinCount(requestId, func, id);
          }
        } else {
          func(res);
        }
      },
    });
  }
}

function getRefreshPinCount(requestId, func, id) {
  $.ajax({
    url: "/mkt/api/crowd/polling/refresh-pin-count/" + requestId,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      if (res.data) {
        const {
          count,
          finished,
          requestId
        } = res.data;
        if (finished) {
          func({
            data: count,
            id
          });
        } else {
          setTimeout(() => {
            getRefreshPinCount(requestId, func, id);
          }, 5000);
        }
      } else {
        func(res);
      }
    },
  });
}

function getAllCategory() {
  let categoryTreeData = $.parseJSON(localStorage.getItem("xzh_category"));
  if (!categoryTreeData) {
    $.ajax({
      url: "/mkt/api/category/all",
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: function (res) {
        localStorage.setItem("xzh_category", JSON.stringify(res.data));
      },
    });
  }
}

function getCateData(name, categoryTreeData) {
  let cateData = {}
  categoryTreeData.forEach((cat1) => {
    if (cat1.categoryName === name) {
      cateData = {
        ...cat1,
        levelOneCategoryId: cat1.categoryId
      };
    } else {
      (cat1.children || []).forEach((cat2) => {
        // 二级品类
        if (cat2.categoryName === name) {
          cateData = {
            ...cat2,
            levelOneCategoryId: cat1.categoryId
          };
        } else {
          // 三级品类
          (cat2.children || []).forEach((cat3) => {
            if (cat3.categoryName === name) {
              cateData = {
                ...cat3,
                levelOneCategoryId: cat1.categoryId,
                levelTwoCategoryId: cat2.categoryId
              };
            } else {
              // 四级品类
              (cat3.children || []).forEach((cat4) => {
                if (cat4.categoryName === name) {
                  cateData = {
                    ...cat4,
                    levelOneCategoryId: cat1.categoryId,
                    levelTwoCategoryId: cat2.categoryId,
                    levelThreeCategoryId: cat3.categoryId
                  };
                }
              });
            }
          });
        }
      });
    }
  });
  return cateData
}

// 根据品类id 获取相关数据
function getCatsDataFromCatNames(name) {
  console.log('getCatsDataFromCatNames--->names', name)
  let categoryTreeData = $.parseJSON(localStorage.getItem("xzh_category"))
  let id = '';
  const cateNames = name.split('|');
  console.log('getCatsDataFromCatNames--->cateNames', cateNames)
  let data
  for (let i = 0; i < cateNames.length; i++) {
    let cateTreeData = data?.children || categoryTreeData
    data = getCateData(cateNames[i], cateTreeData);
  }
  console.log('getCatsDataFromCatNames--->data', data)
  if (data.categoryId) {
    if (data?.categoryClass === 2) {
      id = `${data.levelOneCategoryId}_${data.levelTwoCategoryId}_${data.categoryId}`
    }
    if (data?.categoryClass === 3) {
      id = `${data.levelOneCategoryId}_${data.levelTwoCategoryId}_${data.levelThreeCategoryId}_${data.categoryId}`
    }
    return {
      cId: id
    }
  }
  alert("【" + name + "】没有匹配到品类，请检查");
  return false;
};


function table(s, is_col = true) {
  if (!s) {
    return null;
  }

  s = s.trim().replace(/""/g, "{quote}");

  var wrap = s.match(/\"[^\"]+\"/g);
  if (wrap) {
    for (var i = wrap.length - 1; i >= 0; i--) {
      s = s.replace(
        wrap[i],
        wrap[i].substr(1, wrap[i].length - 2).replace(/\n/g, "{n}")
      );
    }
  }

  var arr = s.split("\n");
  var col = [];
  var data = [];
  for (var i = 0; i < arr.length; i++) {
    var a = arr[i]
      .replace(/{n}/g, "\n")
      .replace(/{quote}/g, '"')
      .split("\t");
    if (is_col) {
      if (i == 0) {
        col = a;
        continue;
      }
      a.map((item, j) => (a[col[j]] = item));
      a.splice(0, col.length);
    }
    data.push(a);
  }
  return data;
}

function explode(s, split = "\\n\\s，、,") {
  if (!s) {
    return [];
  }
  var data = [];
  if (typeof s == "string") {
    if (s.substr(0, 1) == "'") {
      s = s.substr(1);
    }
    data = s.replace(eval("/[" + split + "]/g"), "{split}").split("{split}");
  } else {
    data = s;
  }
  return data.filter((s) => s && s.trim());
}

function isSku(s) {
  return /^[\d,\n\s，、]+$/.test(s);
}

function prefix(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

// 创建任务
function addTask(data, options, i, length, func) {
  // 校验投放的任务是否为当前登录的本店铺的任务
  if (data["店铺id"]) {
    const currentVenderId = localStorage.getItem("venderId");
    if (currentVenderId !== data["店铺id"]) {
      return {
        ok: false,
        msg: "此条任务不属于当前店铺的任务！",
      };
    }
  }

  // 判断模板是否存在
  if (data["投放渠道"] && data["文案"]) {
    const template_id = isHasTemplate(data["文案"]);
    if (!template_id) {
      return {
        ok: false,
        msg: `${data["投放渠道"]}模板错误`
      };
    } else if (template_id && template_id.channel) {
      if (
        TEMPLATE_TEXT[data["投放渠道"]] &&
        TEMPLATE_TEXT[data["投放渠道"]] !== template_id.channel
      ) {
        return {
          ok: false,
          msg: `投放渠道${data["投放渠道"]}中不存在此文案模板`,
        };
      }
    }
  }

  let userDataSource = USER_DATA_SOURCE_TAG; // 1-上传买家pin 2-标签 3-输入买家pin 4-智能圈选
  let currentCrowdId = [];
  let userDataDetail = data["买家pin"];
  if (userDataDetail) {
    userDataSource = USER_DATA_SOURCE_PIN_ENTER;
  }
  if (!data.hasOwnProperty("投放日期") || !data["投放日期"]) {
    return {
      ok: false,
      msg: "无投放日期"
    };
  }
  if (!data.hasOwnProperty("任务名") || !data["任务名"]) {
    return {
      ok: false,
      msg: "任务名称为空"
    };
  }

  let templateDate = $("#xzh-template-date").val();
  console.log("templateDate--->日期", templateDate);

  var task = {
    // name:
    //   data.hasOwnProperty("任务名") && data["任务名"]
    //     ? data["任务名"]
    //     : data["品类"].substr(0, 8) +
    //     "-" +
    //     data["投放策略"].substr(0, 4) +
    //     "-" +
    //     data["投放渠道"].substr(1, 1),
    name: isUat ? `测试-${moment().format("HH:mm:ss")}` : data["任务名"],
    // name: data["任务名"],
    execRule: data["投放日期"].getMinutes() +
      " " +
      data["投放日期"].getHours() +
      " " +
      data["投放日期"].getDate() +
      " " +
      (data["投放日期"].getMonth() + 1) +
      " ? " +
      data["投放日期"].getFullYear(),
    channel: {
      mode: "0",
    },
    abType: null,
    taskType: 1, // 1-一次性 2-周期性: 每日 3-周期性: 每周 4-周期性: 每月
    userDataSource, // 1-上传买家pin 2-标签 3-输入买家pin 4-智能圈选
    userDataType: 1, // 1-上传pin、输入pin、选择标签 3-上传手机号
  };

  // 数据源为标签
  if (userDataSource === USER_DATA_SOURCE_TAG) {
    let crowdId = null;
    // 组装数据，合计品类类型的sku个数
    // {"浏览":45,"付款":145}
    let optionsKeyValues = {};
    let totalSku = 0;
    for (let key in options) {
      let newKey = key.substring(0, 2);
      if (options[key]["sku"]) {
        let spacerLength = options[key]["spacer"] ?
          options[key]["spacer"].length :
          0;
        if (!optionsKeyValues[newKey]) {
          optionsKeyValues[options[key]["days"] + "日" + newKey] =
            options[key]["sku"].length + spacerLength;
        } else {
          optionsKeyValues[options[key]["days"] + "日" + newKey] =
            optionsKeyValues[options[key]["days"] + "日" + newKey] +
            options[key]["sku"].length +
            spacerLength;
        }
      }
    }

    // 校验标签sku数量是否符合要求
    for (let key in optionsKeyValues) {
      totalSku += optionsKeyValues[key];
      if (optionsKeyValues[key] > MAX_SKU_LENGTH) {
        return {
          ok: false,
          msg: `${key}维度标签sku个数大于${MAX_SKU_LENGTH}`
        };
      }
      if (optionsKeyValues[key] < MIN_SKU_AND_SHOP_LENGTH) {
        return {
          ok: false,
          msg: `${key}维度标签sku个数小于${MIN_SKU_AND_SHOP_LENGTH}`,
        };
      }
    }
    // 校验sku总数是否符合要求
    if (totalSku >= MAX_SKU_LENGTH_FOR_ONCE_TASK) {
      return {
        ok: false,
        msg: `单个任务SKU总数超过${MAX_SKU_LENGTH_FOR_ONCE_TASK}个，请修改后再提交!`,
      };
    }

    console.log("人群包--->crowdOptions_", crowdOptions_);
    if (data["人群包id"]) {
      currentCrowdId = data["人群包id"];
    } else {
      if (
        Object.keys(crowdOptions_).length !== length &&
        !crowdOptions_[data["人群包名称"]]
      ) {
        console.log("人群包--->111");
        currentCrowdId = addCrowdFunc(
          getOptions({
              ...options,
              data: data,
            },
            func,
            true
          ),
          i
        );
        console.log("人群包--->111", currentCrowdId);
        crowdOptions_[data["人群包名称"]] = currentCrowdId;
      } else {
        console.log("人群包--->222");
        currentCrowdId = crowdOptions_[data["人群包名称"]];
      }
    }

    console.log("currentCrowdId--->111222", currentCrowdId);
    // 当为标签选择时、需要给后端传userDataDetail，也就是人群包id
    task["userDataDetail"] = currentCrowdId;

    if (isNaN(currentCrowdId) && currentCrowdId.includes("创建失败")) {
      return {
        ok: false,
        msg: `${currentCrowdId.split("&&")[0]}`
      };
    }

    if (!currentCrowdId) {
      return {
        ok: false,
        msg: `圈选条件出错！`
      };
    }
  }

  // 上限
  if (data["投放上限"] > 0) {
    task["maxPinCount"] = data["投放上限"];
  } else {
    task["maxPinCount"] = 5000;
  }
  if (data["预估投放量"] > 0) {
    task["pinCount"] = data["预估投放量"];
  }

  // 活跃用户时间
  if (data["活跃用户时间"]) {
    let activeStopTime = moment(data["活跃用户时间"]).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    let execTime = moment(data["投放日期"]).format("YYYY-MM-DD HH:mm:ss");
    let diffTime = moment(activeStopTime).diff(moment(execTime), "hour");
    if (diffTime < 3) {
      return {
        ok: false,
        msg: "活跃用户推送模式结束时间距离开始时间不满足3小时！",
      };
    }
    task["activeMode"] = 1;
    task["activeStopTime"] = activeStopTime;
  } else {
    task["activeMode"] = 0;
  }

  // 数据源为输入买家pin
  if (userDataSource === USER_DATA_SOURCE_PIN_ENTER) {
    task["userDataDetail"] = userDataDetail;
    task["pinCount"] = userDataDetail.split(",").length;
  }

  let finalTemplateId = data["文案"] || "";

  if (templateDate) {
    let templateName = templateDate + "-" + data["品类"];
    console.log("templateName--->", templateName);
    let channel = data["投放渠道"] == "短信" ? "sms" : "dd";
    console.log("channel--->", channel);
    finalTemplateId = getTemplateIdWithName(
      templateName,
      channel,
      data["投放渠道"]
    );
    if (!finalTemplateId) {
      return {
        ok: false,
        msg: "暂未找到文案日期对应的模板，请检查文案日期是否正确！",
      };
    }
  }

  if (!sendMaxConfig[data["投放渠道"]]) {
    return {
      ok: false,
      msg: "未设置相应渠道的投放上限！",
    };
  }

  if (!finalTemplateId) {
    return {
      ok: false,
      msg: "无渠道模板"
    };
  }

  // 短信
  if (data["投放渠道"] == "短信") {
    task["channel"]["sequence"] = {
      1: "dd:0",
      2: "sms:1"
    };
    task["channel"]["sms_template_id"] = finalTemplateId;
    if (task["channel"]["sms_template_id"].length == 0) {
      return {
        ok: false,
        msg: "无短信模板"
      };
    }
  } else {
    task["channel"]["sequence"] = {
      1: "dd:1",
      2: "sms:0"
    };
    task["channel"]["dd_template_id"] = finalTemplateId;
    if (task["channel"]["dd_template_id"].length == 0) {
      return {
        ok: false,
        msg: "无咚咚模板"
      };
    }
  }

  // 智能筛选
  if (data["智能筛选"]) {
    let aiListStr = localStorage.getItem("aiList");
    let curAiFilter = data["智能筛选"];
    if (aiListStr) {
      let aiList = JSON.parse(aiListStr);
      let curAiFilterId = aiList.find((item) => item.desc === curAiFilter).id;
      if (curAiFilterId) {
        task.modelType = curAiFilterId;
      }
    }
  }
  console.log("task--->", task);
  console.log("stop-->停止");
  // return;
  $.ajax({
    url: "/mkt/api/mt/task/add",
    type: "POST",
    dataType: "json",
    data: JSON.stringify(task),
    contentType: "application/json",
    success: function (res) {
      func(res);
    },
  });

  return {
    ok: true,
    msg: "成功"
  };
}

function getTemplateIdWithName(name, channel, channelDesc) {
  let id = "";
  $.ajax({
    url: `/mkt/api/template/list?pageNum=1&pageSize=500&searchStatus=1&channel=${channel}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      if (res.state === "SUCCESS") {
        const templateList = res.data.templateList;
        if (templateList.length > 0) {
          let targetExtension = channelDesc.includes("富");
          let targetTemplate = templateList.find(
            (item) =>
            item.name.trim() === name && targetExtension === !!item.extension
          );
          if (targetTemplate) {
            id = targetTemplate.id;
          }
        }
      }
    },
  });
  return id;
}

// 替换为a标签
const linkUrlElement = (url) =>
  `<a href="${url}" target="_self" class="J_Link">${url}</a>`;

// 创建短信
function addSms(data, func) {
  console.log("sms--->", data);
  let channel = data["模板类型"].includes("短信") ?
    "sms" :
    data["模板类型"].includes("咚咚") ?
    "dd" :
    "";
  if (!channel) {
    return {
      ok: false,
      msg: "模板类型有误"
    };
  }
  let content = data["文案内容"];
  if (channel === "dd") {
    content = content.replace(/ +/g, "&nbsp;");
  }
  // 转化 链接
  content = Autolinker.link(content, {
    replaceFn: function (match) {
      switch (match.type) {
        case "url":
          const matchedText = match.getMatchedText();
          let shortUrl = getShortUrl(matchedText);
          console.log("shortUrl--->", shortUrl);
          if (!shortUrl) {
            return "短链转化错误，请核查！";
          }
          if (channel === "sms") {
            return shortUrl;
          }
          let transUrl = "";
          if (
            shortUrl.toLowerCase().startsWith("http://") ||
            shortUrl.toLowerCase().startsWith("https://")
          ) {
            transUrl = shortUrl;
          } else if (shortUrl.startsWith("//")) {
            transUrl = `https:${shortUrl}`;
          } else {
            transUrl = `https://${shortUrl}`;
          }
          console.log("transUrl--->", transUrl);
          return linkUrlElement(transUrl); // let Autolinker perform its normal anchor tag replacement
      }
    },
  });
  if (content.includes("短链转化错误")) {
    return {
      ok: false,
      msg: "URL地址不合法，只能是jd.com，jd.hk，item.jd.com，m.jd.com，jd.local后缀的链接",
    };
  }
  if (channel === "dd") {
    // 模拟为富文本内容
    content = `<p>${content}</p>`;
  }
  const params = {
    // name: isUat ? `测试-${moment().format("HH:mm:ss")}` : data["模板名称"],
    name: data["模板名称"],
    content,
    channel,
  };
  // 富媒体咚咚-商品
  if (data["商品id"] && channel === "dd") {
    let extension = {
      type: 3,
      data: {
        skuIds: data["商品id"].split(",").map((sku) => Number(sku)),
      },
    };
    console.log("extension--->", extension);
    params.extension = JSON.stringify(extension);
  }
  // 富媒体咚咚-优惠券
  if (data["活动配置key"] && data["优惠券链接"] && channel === "dd") {
    let couponInfo = getCouponInfo(data["活动配置key"]);
    console.log("couponInfo--->", couponInfo);
    let extension = {
      type: 2,
      data: {
        couponName: couponInfo.name,
        couponBeginTime: couponInfo.beginTime,
        couponEndTime: couponInfo.endTime,
        couponKey: data["活动配置key"],
        couponUrl: data["优惠券链接"],
      },
    };
    console.log("extension--->", extension);
    params.extension = JSON.stringify(extension);
  }
  console.log("params--->", params);
  // return;

  // 判断短信长度
  if (params.channel == "sms") {
    // 短信签名
    var sms_signature = $("#sms_signature").val();
    if (sms_signature.length == 0) {
      return {
        ok: false,
        msg: "签名有误"
      };
    }
    // 超过70个字
    if (params.content.length + sms_signature.length + 7 > 70) {
      return {
        ok: false,
        msg: "超过70个字"
      };
    }
  }
  // return
  $.ajax({
    url: "/mkt/api/template/add",
    type: "POST",
    dataType: "json",
    data: JSON.stringify(params),
    contentType: "application/json",
    success: function (res) {
      if (res.state === "SUCCESS") {
        getTempleteId(params.name, func);
      } else {
        func(res);
      }
    },
  });

  return {
    ok: true,
    msg: "成功"
  };
}

function getTempleteId(name, func) {
  console.log("getTempleteId--->", name);
  $.ajax({
    url: `/mkt/api/template/list?pageNum=1&pageSize=10`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      if (res.state === "SUCCESS") {
        const templateList = res.data.templateList;
        if (templateList.length > 0) {
          const curTemplate = templateList[0];
          if (curTemplate) {
            func({
              data: curTemplate.id
            });
          } else {
            func({
              data: "未生成此模板！"
            });
          }
        }
      }
    },
  });
}

// 获取短链接
function getShortUrl(longUrl = "") {
  let shortUrl = "";
  $.ajax({
    url: `/mkt/api/template/short-url?longUrl=${longUrl}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      if (res.state === "SUCCESS") {
        shortUrl = res.data;
      }
    },
  });
  return shortUrl;
}

// 获取优惠券信息
function getCouponInfo(key) {
  let couponInfo = null;
  $.ajax({
    url: `/mkt/api/template/view/coupon/${key}`,
    type: "GET",
    dataType: "json",
    async: false,
    contentType: "application/json",
    success: function (res) {
      if (res.state === "SUCCESS") {
        couponInfo = res.data;
      }
    },
  });
  return couponInfo;
}

function findHttpString(s) {
  var reg =
    /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  s = s.match(reg);
  if (s && s.length) {
    return s[0];
  }
  return "";
}

function replaceLinkToElement(link) {
  return `<a href="${link}" target="_self" class="J_Link">${link}</a>`;
}

function splitArray(
  data = [],
  n = MAX_SKU_LENGTH,
  m = MIN_SKU_AND_SHOP_LENGTH
) {
  console.log("报错--->", data);
  if (data.length < n || data.length < m || n < m * 2) return [data];
  let i = 0;
  let a = [];
  var j = data.length % n;
  var l = j < m && j > 0 ? Math.floor(data.length / n) : 0;
  while (i < data.length) {
    if (l > 0 && i == (l - 1) * n) {
      a.push(data.slice(i, (i += n - m + j)));
    }
    a.push(data.slice(i, (i += n)));
  }
  return a;
}

/**
 * 获取指定页码任务数据
 * @param {*} page 页码
 */
function getTaskDataByPage(page = 1, keyword = "") {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/mkt/api/mt/task/list?page=1&keyword=${keyword}&type=1&pageSize=` +
        10 * page,
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

/**
 * 获取指定页码任人群包数据
 * @param {*} page 页码
 */
function getCrowdDataByPage(page = 1) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/mkt/api/crowd/list?page=1&keyword=&pageSize=" + 10 * page,
      type: "GET",
      dataType: "json",
      contentType: "application/json",
      success: function (res) {
        resolve(res.data);
      },
    });
  });
}

function renderTaskTable(startCount, data, tableHtml) {
  $("table.data").remove();
  $(".taskTableWrapper").append(tableHtml);
  var update_data = {};

  var is_groupby = $("#groupby").prop("checked");
  // 先排序
  if (is_groupby) {
    data.sort((a, b) => a.name.localeCompare(b.name, "zh"));
  }

  var rowspan = 1;
  for (var i = startCount; i < data.length; i++) {
    var datetime =
      data[i].execRule &&
      data[i].execRule.replace(
        /^(\d+)\s(\d+)\s(\d+)\s(\d+)\s\?\s(\d+)$/,
        "$5/$4/$3 $2:$1"
      );
    var sHtml = `<tr data-id="` + data[i].id + `">`;

    if (
      is_groupby &&
      i > 0 &&
      data[i].name.substr(0, 3) == data[i - rowspan].name.substr(0, 3)
    ) {
      var td = $(
        "table.data tr[data-id=" + data[i - rowspan].id + "] td[rowspan]"
      );
      rowspan++;
      td.attr("rowspan", rowspan);
      var n = td.children("span").text();
      if (n != "计算中" && data[i].pinCount > 0) {
        td.children("span").text(parseInt(n) + data[i].pinCount);
      }
    } else {
      sHtml +=
        `<td rowspan="1">` +
        (is_groupby ?
          data[i].name.substr(0, 3) +
          `<br /><span class="xzh-label-dd">` +
          (data[i].pinCount == -3 ? "计算中" : data[i].pinCount) +
          `</span>` :
          i + 1) +
        `</td>`;
      rowspan = 1;
    }

    sHtml +=
      `<td>` +
      data[i].id +
      `</td>
              <td>` +
      data[i].name +
      `</td>
              <td class="pincount">` +
      (data[i].pinCount == -3 ? "计算中" : data[i].pinCount) +
      `</td>
              <td><input style="color:red;width:88px;padding:0 2px;text-align:center" class="ant-input maxPinCount" value="` +
      data[i].maxPinCount +
      `" /></td>
              <td>` +
      data[i].status +
      `</td>
              <td>` +
      datetime +
      `</td>
            <td><a>取消</a></td></tr>`;

    $("table.data").append(sHtml);

    console.log(data[i]);

    update_data[data[i].id] = {
      id: data[i].id,
      name: data[i].name,
      activeMode: data[i].activeMode,
      activeStopTime: data[i].activeStopTime,
      execRule: data[i].execRule,
      taskType: data[i].taskType,
      userDataDetail: data[i].userDataDetail,
      channel: data[i].channel,
      userDataType: data[i].userDataType,
      userDataSource: data[i].userDataSource,
      pinCount: data[i].pinCount > 0 ? data[i].pinCount : null,
      abType: data[i].abType,
      maxPinCount: data[i].maxPinCount,
      crowdName: data[i].crowdName,
      isCopyTask: false,
    };
  }

  $(".box").fadeIn();

  $("#xzh-data-task-time").val(datetime);
  $("#xzh-data-retask-time").val(datetime);

  $("table.data td a").bind("click", function () {
    var tr = $(this).parent().parent();
    var td = tr.children("td[rowspan]");
    var pincount = parseInt(tr.children("td.pincount").text());

    if (td.length > 0) {
      var next_tr = tr.next();
      // 删除第一行，存在其他子项
      if (next_tr.children("td[rowspan]").length == 0) {
        var total_pincount = parseInt(td.children("span").text());
        td.children("span").remove();
        next_tr.prepend(
          '<td rowspan="' +
          (td.attr("rowspan") - 1) +
          '">' +
          td.text() +
          '<br /><span class="xzh-label-dd">' +
          (total_pincount - pincount) +
          "</span></td>"
        );
      }
    } else {
      var td_group = tr
        .prevAll("tr:has(td[rowspan])")
        .first()
        .children("td[rowspan]");
      td_group.attr("rowspan", td_group.attr("rowspan") - 1);
      td_group
        .children("span")
        .text(parseInt(td_group.children("span").text()) - pincount);
    }

    delete update_data[tr.data("id")];
    tr.remove();
  });
  return update_data;
}

/**
 *  一维数组转换为二维数组
 * @param {*} arr 数组
 * @param {*} num 每组多少条数据
 * @returns
 */
function arrToTwoDim(arr, num) {
  const newArr = []; // 声明数组
  arr.forEach((item, index) => {
    const page = Math.floor(index / num); // 计算该元素为第几个素组内
    if (!newArr[page]) {
      // 判断是否存在
      newArr[page] = [];
    }
    newArr[page].push(item);
  });
  return newArr;
}