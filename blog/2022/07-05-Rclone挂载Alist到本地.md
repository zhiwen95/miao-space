---
authors: alamiao
slug: rclone-mount-alist
tags: [服务器]
title: Linux Rclone 挂载 AList 到本地
---

- [AList](https://github.com/alist-org/alist/blob/main/README_cn.md) - 一个支持多存储的文件列表程序，支持各种协议
- Rclone - 支持 WebDAV 协议挂载本地空间
- Docker - 在容器中运行 Rclone，我的物理机不能安装 Rclone

注意：限速严重的网盘基本没法用，比如某度免费账号

<!-- truncate -->

## 部署

1.  创建两个配置文件，执行`docker-compose up -d`启动容器，alist 访问地址为 IP:5244 进去配一下基本信息。

- `.env`
  - APPDATA - 容器数据保存目录
  - MOUNT_POINT - 网盘挂载点，需要提前 `mkdir`

```
APPDATA=/opt/yunpan-mount
MOUNT_POINT=/mnt/disks/alist/
```

- `docker-compose.yml`

```

version: '2'
services:
  alist:
    image: xhofe/alist
    container_name: alist
    environment:
      - TZ=Asia/Shanghai
    ports:
      - 5244:5244
    volumes:
      - ${APPDATA}/alist/data:/opt/alist/data
  rclone-alist:
    image: mumiehub/rclone-mount
    container_name: rclone-alist
    environment:
      - TZ=Asia/Shanghai
      - "RemotePath=alist:"
      - MountPoint=/mnt/alist
    depends_on:
      - alist
    volumes:
      - ${APPDATA}/rclone-alist/config:/config
      - ${MOUNT_POINT}:/mnt/alist:shared
    cap_add:
      - SYS_ADMIN
    devices:
      - /dev/fuse
    security_opt:
      - apparmor:unconfine
```

1. 生成 rclone 配置文件，输入下面的命令运行一个 rclone 容器

```bash
$ docker run -it --rm --name rclone-g rclone/rclone config
```

[WebDAV](https://rclone.org/webdav/)

步骤：

我的控制台日志

- No remotes found, make a new one?
  > n
- Type of storage to configure.
  > webdav
- url（IP 换成 alist 的）
  > http://IP:5244/dav/
- Name of the Webdav site/service/software you are using.
  > other
- 用户名和密码（输入 alist 管理员信息）
- bearer_token
  回车
- Edit advanced config?
  回车
- y) Yes this is OK (default)
  到这步就不要操作了，配置文件已经生成了，要去把配置复制出来，再开一个 ssh 执行

```bash
docker exec rclone-g cat /config/rclone/rclone.conf > /opt/yunpan-mount/rclone-alist/config/.rclone.conf
```

## QA

### 本地挂载目录为空

docker-compose restart rclone-alist 单独重启 rclone-alist 容器，虽然加了 depends_on 但是 alist 依旧启动较晚就会导致 rclone 失效

```
root@Tower:~# docker run -it --rm --name rclone-g rclone/rclone config
2022/07/05 08:24:58 NOTICE: Config file "/config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
name> alist
Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
1 / 1Fichier
\\ (fichier)
2 / Akamai NetStorage
\\ (netstorage)
3 / Alias for an existing remote
\\ (alias)
...
Storage> webdav
Option url.
URL of http host to connect to.
E.g. <https://example.com>.
Enter a value.
url> <http://192.168.1.67:5244/dav/>
Option vendor.
Name of the Webdav site/service/software you are using.
Choose a number from below, or type in your own value.
Press Enter to leave empty.
1 / Nextcloud
\\ (nextcloud)
2 / Owncloud
\\ (owncloud)
3 / Sharepoint Online, authenticated by Microsoft account
\\ (sharepoint)
4 / Sharepoint with NTLM authentication, usually self-hosted or on-premises
\\ (sharepoint-ntlm)
5 / Other site/service or software
\\ (other)
vendor> other
Option user.
User name.
In case NTLM authentication is used, the username should be in the format 'Domain\\User'.
Enter a value. Press Enter to leave empty.
user> admin
Option pass.
Password.
Choose an alternative below. Press Enter for the default (n).
y) Yes, type in my own password
g) Generate random password
n) No, leave this optional password blank (default)
y/g/n> y
Enter the password:
password:
Confirm the password:
password:
Option bearer_token.
Bearer token instead of user/pass (e.g. a Macaroon).
Enter a value. Press Enter to leave empty.
bearer_token>
Edit advanced config?
y) Yes
n) No (default)
y/n>
--------------------
[alist]
type = webdav
url = <http://192.168.1.67:5244/dav/>
vendor = other
user = admin
pass = *** ENCRYPTED ***
--------------------
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d>

```
