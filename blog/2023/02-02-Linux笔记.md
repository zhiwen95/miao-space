---
authors: alamiao
slug: linux
tags: [服务器]
title: Linux 笔记
---
<!-- truncate -->
## 配置

### sudo免密

```bash
$ sudo vi /etc/sudoers

# 在最后一行添加，username 换成自己的
username ALL=(ALL:ALL) NOPASSWD: ALL
```