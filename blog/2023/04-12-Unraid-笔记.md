---
authors: alamiao
slug: unraid
tags: [服务器]
title: Unraid 笔记
---
## 系统设置

### 推荐改动
<!-- truncate -->
#### CPU 绑定

将 UNRAID、Docker、VM 使用的CPU分开，高负载的情况下互不影响。

#### Mover

安装 Mover Tuning，配置 Script to run before mover 与 Script to run after mover ，运行 Mover 前自动关闭占用文件的程序。

 

## 问题汇总

### 运行Mover时某些文件被占用无法移动

qBittorrent 占用了文件，安装 Mover Tuning，配置 Script to run before mover 与 Script to run after mover ，运行 Mover 前关闭 qBittorrent 

例如：

```bash
#!/bin/bash
# on_mover_before.sh
export PATH=/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin

cd "$(dirname "$0")"
docker stop sonarr
docker stop radarr
docker stop flexget
docker stop qbittorrent
```

```bash
#!/bin/bash
# on_mover_after.sh
export PATH=/usr/local/sbin:/usr/sbin:/sbin:/usr/local/bin:/usr/bin:/bin

cd "$(dirname "$0")"
docker start qbittorrent
docker start flexget
docker start sonarr
docker start radarr
```

### NFS 访问目录为空

旧设备（比如OPPO蓝光机）使用NFS协议访问时会看不见文件，是因为不兼容硬连接造成的，设置 `全局共享设置：可调式 (支持硬链接)：否`，设置后 /mnt/user 和文件共享不支持 link() 操作