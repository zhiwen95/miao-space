---
authors: alamiao
slug: postgresql
tags: [数据库]
title: PostgreSQL 笔记
---
<!-- truncate -->
## 资料

[Azure Database for PostgreSQL 文档](https://docs.microsoft.com/zh-cn/azure/postgresql/)

[3年部署3000套PG实例的架构设计与踩坑经验 - PGSQL - dbaplus社群：围绕Data、Blockchain、AiOps的企业级专业社群。技术大咖、原创干货，每天精品原创文章推送，每周线上技术分享，每月线下技术沙龙。](https://dbaplus.cn/news-19-3523-1.html)

## 配置

### 时区设置

设置 database 的时区

```
ALTER DATABASE postgres SET timezone TO 'Asia/Shanghai';

```

临时修改当前连接的时区

```
SET TIME ZONE "Asia/Shanghai";

```

默认时区需要修改配置文件 postgresql.conf 修改后需重启 PostgreSQL 服务

```
timezone = 'Asia/Shanghai'
log_timezone = 'Asia/Shanghai'

```