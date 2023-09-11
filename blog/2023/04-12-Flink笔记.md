---
authors: alamiao
slug: flink
tags: [技术]
title: Flink 笔记
---

## QA

### 运行 7 天后 Checkpoint IO 出现 hadoop InvalidToken 导致 Failed to trigger checkpoint

- 相关日志
<!-- truncate -->

```
2023-04-10 15:16:05.056 [jobmanager-io-thread-10] WARN  org.apache.hadoop.ipc.Client  - Exception encountered while connecting to the server : org.apache.hadoop.ipc.RemoteException(org.apache.hadoop.security.token.SecretManager$InvalidToken): token (token for hdfs: HDFS_DELEGATION_TOKEN owner=hdfs/com66, renewer=yarn, realUser=, issueDate=1680504045174, maxDate=1681108845174, sequenceNumber=21818, masterKeyId=58) can't be found in cache
2023-04-10 15:16:05.059 [Checkpoint Timer] INFO  org.apache.flink.runtime.checkpoint.CheckpointCoordinator  - Failed to trigger checkpoint for job 045e5c5ec32df9b607bd01acc9e2ea37 because An Exception occurred while triggering the checkpoint. IO-problem detected.
```

- 解决方法

添加 flink 启动参数

```
-yD security.kerberos.login.use-ticket-cache=false
```

- 资料

[Hadoop Security Module](https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/security/security-kerberos/#hadoop-security-module)

[Kerberos Authentication Setup and Configuration](https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/security/security-kerberos/#kerberos-authentication-setup-and-configuration)

[Auth with External Systems](https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/config/#auth-with-external-systems)

### Task 中出现 Zookeeper AuthFailedException: KeeperErrorCode = AuthFailed for /rule

- 描述

我的场景是 hadoop 启用了 kerberos，zookeeper 未启用身份认证，Flink 启动参数添加了 `-yD security.kerberos.login.use-ticket-cache=false` 之后就会出现 AuthFailed

- 解决方法

添加 flink 启动参数，这个配置项默认没有设置

```
-yD security.kerberos.login.contexts=Client
```

- 资料

[Configuration](https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/config/#security-kerberos-login-contexts)

### 堆外内存溢出 Direct Memory

- 描述

Kafka 客户端在 poll 时会申请 Direct Memory，此时如果 kafka 消息比较大的话容易产生 Direct Memory 溢出

- 解决办法

添加 flink 启动参数，调整 task 的 off-heap，如果 Flink 不能提交则需要调大 taskmanager.memory.process.size

```
-Dtaskmanager.memory.task.off-heap.size=1g
```
