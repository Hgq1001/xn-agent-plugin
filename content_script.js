const scriptLoader = ({ src, innerHTML }) => {
  if (src) {
    return new Promise((resolve, reject) => {
      const theScript = document.createElement("script");
      theScript.src = src;
      theScript.onload = () => {
        resolve(theScript);
      };
      theScript.onerror = () => {
        reject(`load ${src} failed`);
      };
      document.querySelector("*").appendChild(theScript);
    });
  }
  const theScript = document.createElement("script");
  theScript.innerHTML = innerHTML;
  document.body.appendChild(theScript);
  return theScript;
};

const storageGet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(items, resolve);
  });
};

const storageSet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, resolve);
  });
};

const sleep = (sec) => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec);
  });
};

const scriptReader = (content) => {
  chrome.runtime.sendMessage(content);
};

// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || "libs/inject.js";
  var temp = document.createElement("script");
  temp.setAttribute("type", "text/javascript");
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(message, function (result) {
    window.postMessage({ render: true, result });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse(request.content + " DONE.");
  scriptLoader({
    innerHTML: request.code,
  });
});

window.addEventListener(
  "message",
  function (e) {
    if (e.data && e.data.type) {
      sendMessageToBackground(e.data);
    }
  },
  false
);

window.onload = function () {
  co(function* () {
    scriptReader("libs/jquery");
    yield sleep(1000);
    scriptReader("libs/jquery.cookie");
    yield sleep(1000);
    scriptReader("libs/moment");
    yield sleep(1000);
    scriptReader("libs/FileSaver");
    yield sleep(1000);
    scriptReader("libs/dom-to-image.min");
    yield sleep(1000);
    scriptReader("libs/Autolinker");
    yield sleep(1000);
    // 公共函数
    scriptReader("common");

    if (
      window.location.hostname == "xiaozhi.jd.com" ||
      window.location.hostname == "gray.xiaozhi.jd.com" ||
      window.location.hostname == "uat.xiaozhi.jd.com"
    ) {
      injectCustomJs();
      scriptReader("xiaozhi");
      if (document.referrer == "https://passport.jd.com/") {
        chrome.runtime.sendMessage("push");
      }
    }

    if (
      window.location.hostname == "item.jd.com" ||
      window.location.hostname == "npcitem.jd.hk"
    ) {
      scriptReader("item");
    }

    if (window.location.hostname == "union.jd.com") {
      scriptReader("union");
    }

    // 店铺全部SKU
    if (window.location.href.indexOf("jd.com/view_search") > 0) {
      scriptReader("shop");
    }

    if (
      window.location.hostname == "search.jd.com" ||
      window.location.hostname == "list.jd.com"
    ) {
      scriptReader("search");
    }
    if (window.location.hostname == "t.jd.com") {
      scriptReader("shopFollow");
    }
    if (window.location.href.indexOf("tungee.com") !== -1) {
      scriptReader("tungee");
    }

    if (window.location.href.indexOf("jiandaoyun.com") !== -1) {
      scriptReader("jiandaoyun");
    }
  });
};
