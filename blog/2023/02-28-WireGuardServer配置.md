---
authors: alamiao
slug: wireguard-server
tags: [软件]
title: Unraid 笔记
---

## 安装 WireGuard

```
# 先试一下你有没有安装，高版本 Linux 内核内置了 WireGuard
$ sudo wg
# 安装
$ sudo apt install wireguard
```

<!-- truncate -->

## 配置文件示例

```
# /etc/wireguard/wg0.conf
# This file was generated using wireguard-ui (https://github.com/ngoduykhanh/wireguard-ui)
# Please don't modify it manually, otherwise your change might get replaced.

# Address updated at:     2023-02-28 10:53:59.742250606 +0000 UTC
# Private Key updated at: 2023-02-28 09:46:43.583439615 +0000 UTC
[Interface]
Address = 192.168.6.0/24
ListenPort = 5182
PrivateKey = xxxx

PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o enp1s0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o enp1s0 -j MASQUERADE

# ID:           cfusvrhj7ars71ogcdrg
# Name:         iPhone
# Email:        wei.zhiwen@outlook.com
# Created at:   2023-02-28 09:57:02.198483671 +0000 UTC
# Update at:    2023-02-28 10:55:16.058637256 +0000 UTC
[Peer]
PublicKey = xxxx
PresharedKey = xxxxxx
AllowedIPs = 192.168.6.1/32

# ID:           cfutm71j7ars71ef19rg
# Name:         PWRD-20200716RM
# Email:        wei.zhiwen@outlook.com
# Created at:   2023-02-28 10:44:44.194647849 +0000 UTC
# Update at:    2023-02-28 10:55:27.552484034 +0000 UTC
[Peer]
PublicKey = xxxxxxxxxxxx
PresharedKey = xxxxxxxxxxxxxxxx
AllowedIPs = 192.168.6.2/32
```

## 配置生成

这个项目可以通过网页配置 https://github.com/ngoduykhanh/wireguard-ui

:::info

不需要复杂配置的话推荐 [WireGuard Easy](https://github.com/wg-easy/wg-easy)

:::

1. 根据系统版本下载 `wireguard-ui` 二进制文件，例如 https://github.com/ngoduykhanh/wireguard-ui/releases/download/v0.4.0/wireguard-ui-v0.4.0-linux-amd64.tar.gz
2. 启动

```
./wireguard-ui
```

1. 打开 http://127.0.0.1:5000/ 默认账号 admin/admin

改完配置要点右上角 Apply Config 才会将修改写到 /etc/wireguard/wg0.conf ，然后 `sudo systemctl restart wg-quick@wg0` 手动重启一下进程使配置生效。

1. 在 Wireguard Server 一栏设置路由规则，如果你的网卡不是 eth0 的话需要替换一下

```
# Post Up Script
iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# Post Down Script
iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

## 路由规则

1. 启动规则

   ```
   iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
   ```

2. 关闭规则

   ```
   iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
   ```

## 进程管理

1. 重载守护进程：`sudo systemctl daemon-reload`
2. 设置为自动启动 wg0：`sudo systemctl enable wg-quick@wg0`
3. 禁用服务：`sudo systemctl disable wg-quick@wg0`
4. 启动服务：`sudo systemctl start wg-quick@wg0`
5. 重启服务：`sudo systemctl restart wg-quick@wg0`
6. 查看服务状态：`sudo systemctl status wg-quick@wg0`

## 可能需要的配置

### 开启系统的 IP 转发

```
$ sysctl -w net.ipv4.ip_forward=1
$ sysctl -w net.ipv6.conf.all.forwarding=1
```

为保证重启后仍然生效记得将上述配置保存到 /etc/sysctl.conf 。
