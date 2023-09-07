import React from "react";
import { useEffect } from "react";

function init() {
  window["twikoo"].init({
    envId: "https://twikoo.weizhiwen.net", // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
    el: "#tcomment", // 容器元素
    // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
    // path: location.pathname, // 用于区分不同文章的自定义 js 路径，如果您的文章路径不是 location.pathname，需传此参数
    // lang: 'zh-CN', // 用于手动设定评论区语言，支持的语言列表 https://github.com/imaegoo/twikoo/blob/main/src/client/utils/i18n/index.js
  });
}

export default function Twikoo(): JSX.Element {
  useEffect(() => {
    if (document.getElementById("tcomment-script")) {
      init();
      return;
    }
    const scriptElement = document.createElement("script");
    scriptElement.src = "/js/twikoo.all.min.js";
    scriptElement.async = true;
    scriptElement.crossOrigin = "anonymous";
    scriptElement.id = "tcomment-script";
    document.body.appendChild(scriptElement);
    scriptElement.onload = init;
  });
  return (
    <>
      <div id="tcomment"></div>
    </>
  );
}
