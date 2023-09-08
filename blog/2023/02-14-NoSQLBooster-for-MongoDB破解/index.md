---
authors: alamiao
slug: crack-nosqlbooster-for-mongodb
tags: [软件]
title: NoSQLBooster for MongoDB 破解
---

import Image from '@theme/IdealImage';

> macos、windows、linux 通用
<!-- truncate -->
## 工作原理

NoSQLBooster for MongoDB 使用 electron 编写，修改 app.asar 包里的代码就可以修改运行逻辑。

asar 是一个打压缩包的工具

## 破解

1. 安装 node.js，下载地址：https://nodejs.org/zh-cn/download/
2. 执行命令

```bash
# 安装 asar 
$ npm install asar -g
# 找到 NoSQLBooster for MongoDB 安装目录，进入 resources 文件夹，macos 的话在 app 里面
$ cd C:\Users\Administrator\AppData\Local\Programs\nosqlbooster4mongo\resources
# app.asar 解压到 app 文件夹
$ asar extract app.asar app
# 文本编辑器打开 almCore.js，如果你是 GitBash 或 macos 或 linux 直接执行 sed 并跳过第三步
$ code app\shared\lmCore.js
# $ sed -i 's/MAX_TRIAL_DAYS=150,TRIAL_DAYS=30;/MAX_TRIAL_DAYS=9999,TRIAL_DAYS=9999;/' app/shared/lmCore.js
```

1. 修改文件内容，用编辑器直接替换就行

`MAX_TRIAL_DAYS=150,TRIAL_DAYS=30;` 改为 `MAX_TRIAL_DAYS=9999,TRIAL_DAYS=9999;`

1. 执行命令

```bash
# app 压缩到 app.asar
$ asar pack app app.asar
```

1. 重启 NoSQLBooster for MongoDB

<Image img={require("./image.png")} />

## 关闭自动更新

只要自动更新地址访问不通它就不会自动更新。

resources 文件夹下有个  app-update.yml 里面的内容应该是这样的

```yaml
provider: generic
url: http://s3.mongobooster.com/download/releasesv8/
updaterCacheDirName: nosqlbooster4mongo-updater
publisherName:
  - 卿海
```

把 url 值换成 `http://s3.mongobooster.com/download/releasesv8/404` 就行