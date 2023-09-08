---
authors: alamiao
slug: jenkins
tags:
  - 服务器
title: Jenkins 笔记
---

<!-- truncate -->
## 修改插件下载源

1. 配置清华源

在 `Manage Jenkins > Plugin Manager > Advanced` 里找到 `Update Site` 将 `URL` 改为 `https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json`，然后打开插件管理的 `Available` 页面点击下方的 `Check now` 按钮

1. 修改文件中的下载地址

清华源只是加速了文件下载但是没有修改 JSON 文件里的下载地址，所以需要自己修改，这里提供两种方式，都是修改 /root/.jenkins/updates/default.json。

方式一：手动修改文件

  把 https://updates.jenkins.io/download 改为 http://mirrors.tuna.tsinghua.edu.cn/jenkins

方式二：使用构建修改文件

  新建一个 Freestyle project 构建，在构建里添加一个 Execute shell 内容如下

```bash
sed -i 's/https:\\/\\/updates.jenkins.io\\/download/http:\\/\\/mirrors.tuna.tsinghua.edu.cn\\/jenkins/g' /root/.jenkins/updates/default.json
```

1. 重启 jenkins

### QA

#### 下次更新插件时怎么做

1. 插件`Check now`
2. 替换 updates/default.json 里的下载地址
3. 重启 jenkins

#### 为什么不用 Jenkins 中文社区的加速方案

社区的维护跟不上 jenkins 的版本更新

#### 快速重启 Jenkins 小技巧

插件管理的 Available 页面下边有个 Download now and install after restart 按钮，点进去后勾选 Restart Jenkins when installation is complete and no jobs are running，过几秒它就重启了

```bash
sed -i 's/https:\\/\\/updates.jenkins.io\\/download/http:\\/\\/mirrors.tuna.tsinghua.edu.cn\\/jenkins/g' /root/.jenkins/updates/default.json
```
