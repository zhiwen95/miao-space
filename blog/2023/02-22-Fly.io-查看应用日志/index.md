---
authors: alamiao
slug: tail-flyio-logs
tags: [服务器]
title: Fly.io 查看应用日志
---

官方文档：https://fly.io/blog/shipping-logs/

flyio 本身不存储应用日志，所以 dashboard 无法直接查看，要借助第三方工具，占用 **Hobby Plan** 一个 App 额度。
<!-- truncate -->
1. 注册 https://logtail.com/
2. Logtail Sources 页面点击 **Connect source，**内容照着我的填完点 **Create source**。
![image](./image.png)
1. 根据 Logtail 提示操作，我解释一下每一步的操作  
第一步 - 启动 fly-log-shipper 应用，先不要 deploy，这是个日志采集器，项目地址：https://github.com/superfly/fly-log-shipper  
第二步 - 修改 fly.toml 配置，internal_port 从 8080 改为 8686  
第三步 - 设置 ACCESS_TOKEN  
第四步 - 设置 LOGTAIL_TOKEN  
第五步 - flyctl deploy，Logtail 文档中没写这步  
![image2](./image2.png)
1. 左边菜单打开 Live tail 页面，部署成功的话就会有日志出现了