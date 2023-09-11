---
authors: alamiao
slug: nginx
tags: [服务器]
title: Nginx 笔记
---

<!-- truncate -->

## 配置

```
server {
  listen       80;
  server_name  xx.com;
  location / {
    proxy_pass                           http://127.0.0.1:8080;
    proxy_set_header Host                $host;
	  proxy_set_header X-Real-IP           $remote_addr;
    proxy_set_header X-Forwarded-For     $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto   $scheme;
    proxy_set_header X-Forwarded-Port    $server_port;
		proxy_connect_timeout   10s;
    proxy_send_timeout      60s;
    proxy_read_timeout      60s;
  }
}

```
