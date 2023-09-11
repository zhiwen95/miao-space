---
authors: alamiao
slug: deploy-clickhouse-cluster
tags: [数据库]
title: Clickhouse 集群部署
---

<!-- truncate -->

## 集群方案

我的场景分为：

1. 初期少量数据：1 分片 2 副本，2 台机器提供服务
2. 进阶大量数据：n 分片 2 副本，2n 台机器提供服务

## 集群部署

clickhouse: 22.4.3.3

系统: CentOS

#### 准备工作

- zookeeper 服务
  192.168.1.101
  192.168.1.102
  192.168.1.103
  - 111
    abc
  - 222
    bcd
- 服务器
  集群部署需要 2n 台服务器，最少两台。
  192.168.1.123
  192.168.1.124
  192.168.1.125
  192.168.1.126
- 安装包
  我的系统是 CentOS，所以选择 rpm 方式安装
  下载地址：https://github.com/ClickHouse/ClickHouse/releases
  ```bash
  clickhouse-client-22.4.3.3.noarch.rpm
  clickhouse-common-static-22.4.3.3.x86_64.rpm
  clickhouse-server-22.4.3.3.noarch.rpm
  ```

#### 安装

注意：安装 clickhouse-server-22.4.3.3.noarch.rpm 包时会让你输入密码，建议输入回车键跳过

```bash
rpm -ivh clickhouse-common-static-22.4.3.3.x86_64.rpm
rpm -ivh clickhouse-server-22.4.3.3.noarch.rpm
rpm -ivh clickhouse-client-22.4.3.3.noarch.rpm
systemctl reload-daemon
```

#### 配置

- /etc/clickhouse-server/config.xml
  服务配置文件
  注意：默认有配置 remote_servers 删除即可
  ```xml
  <!-- 监听的IP，默认是 127.0.0.1 -->
  <listen_host>0.0.0.0</listen_host>
  <!-- 复制表引擎使用的 host，默认从系统获取主机名很可能不通，所以最好手动设置 -->
  <!-- 每台服务器替换此配置 -->
  <interserver_http_host>192.168.1.123</interserver_http_host>
  <!-- 引入外部配置 -->
  <remote_servers incl="clickhouse_remote_servers"/>
  <!-- 引入外部配置 -->
  <zookeeper incl="zookeeper-servers" optional="true" />
  <!-- 引入外部配置 -->
  <macros incl="macros" optional="true" />
  ```
- /etc/metrika.xml
  集群配置文件
  ```xml
  <yandex>
  <clickhouse_remote_servers>
      <mycluster>
          <shard>
  						<!-- 使用 ReplicatedMergeTree 表引擎时设置为 true -->
              <internal_replication>true</internal_replication>
              <replica>
                  <host>192.168.1.123</host>
                  <port>9000</port>
              </replica>
              <replica>
                  <host>192.168.1.124</host>
                  <port>9000</port>
              </replica>
          </shard>
          <shard>
              <internal_replication>true</internal_replication>
              <replica>
                  <host>192.168.1.125</host>
                  <port>9000</port>
              </replica>
              <replica>
                  <host>192.168.1.126</host>
                  <port>9000</port>
              </replica>
          </shard>
      </mycluster>
  </clickhouse_remote_servers>

  <!-- zookeeper相关配置 -->
  <!-- 该标签与config.xml的<zookeeper incl="zookeeper-servers" optional="true" /> 保持一致 -->
  <zookeeper-servers>
    <node index="1">
      <host>192.168.1.101</host>
      <port>2181</port>
    </node>
    <node index="2">
      <host>192.168.1.102</host>
      <port>2181</port>
    </node>
    <node index="3">
      <host>192.168.1.103</host>
      <port>2181</port>
    </node>
  </zookeeper-servers>

  <!-- 分片和副本标识，shard标签配置分片编号，<replica>配置分片副本主机名，需要修改对应主机上的配置 -->
  <macros>
      <!-- 组副本的两台机器 shard 要一致，123和124写1，125和126写2 -->
  		<!-- 每台服务器替换此配置 -->
      <shard>1</shard>
      <!-- 每台服务器替换此配置 -->
      <replica>10.12.24.124</replica>
  </macros>
  <networks>
     <ip>::/0</ip>
  </networks>

  <clickhouse_compression>
  	<case>
  	  <min_part_size>10000000000</min_part_size>
  	  <min_part_size_ratio>0.01</min_part_size_ratio>
  	  <method>lz4</method>
  	</case>
  </clickhouse_compression>

  </yandex>
  ```

#### 运行

```bash
systemctl start clickhouse-server.service
# 看一下日志，没 error 日志的话就是启动成功了
tail -f /var/log/clickhouse-server/clickhouse-server.err.log
# curl 调用接口输出 22.4.3.3
echo 'SELECT version()' | curl 'http://localhost:8123/' --data-binary @-
```

#### SQL

```sql
CREATE DATABASE IF NOT EXISTS test ON CLUSTER mycluster;

CREATE TABLE IF NOT EXISTS t_log ON CLUSTER mycluster
(
`id` String,
`application` String,
`timestamp` DateTime,
`event` String
)
ENGINE = ReplicatedMergeTree('/clickhouse/tables/{shard}/t_log', '{replica}')
PARTITION BY toYYYYMMDD(timestamp)
ORDER BY timestamp;

CREATE TABLE IF NOT EXISTS dt_log ON CLUSTER mycluster
(
`id` String,
`application` String,
`timestamp` DateTime,
`event` String
)
ENGINE = Distributed('mycluster', 'test', 't_log');

insert into dt_log(`id`, `application`, `timestamp`, `event`) values('1', 'myapp', NOW(), 'xxx');
select * from dt_log;
```

## 常见问题

### ReplicatedMergeTree 数据不同步

服务器没问题并且 server 成功启动日志看到连接拒绝，config.xml 设置 interserver_http_host
