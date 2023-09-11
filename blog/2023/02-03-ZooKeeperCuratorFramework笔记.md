---
authors: alamiao
slug: zookeeper-curator-framework
tags: [技术]
title: ZooKeeper Curator Framework
---

<!-- truncate -->

[Apache Curator -](https://curator.apache.org/getting-started.html)

## 事件监听

注意：第一种注册方式只会监听一次，第二种注册方式会保持监听。

Watcher 是一次性触发器，只会触发一次，如果希望再次触发需要再次注册 Watcher，在重新设置 Watcher 期间发生的事件不可见，所以请处理好这个时间窗口内可能会发生的事（可以不处理，但是你要意识到这一点）。

[zookeeper 3.6.0](https://zookeeper.apache.org/doc/r3.6.2/zookeeperOver.html#Conditional+updates+and+watches) 版本添加了新方法 addPersistentWatches 支持永久 Watcher，需要 Curator 版本大于等于 5.0.0

### 第一种：usingWatcher

```java
// Watch 只能触发一次
curatorFramework.getChildren().usingWatcher(...).forPath(...);
```

### 第二种：Cache

Watch 可以触发多次

- CuratorCache - 监听一个节点的事件，旧版对应类是 NodeCache
- PathCache - 监听一级子节点的事件，旧版对应类是 PathChildrenCache
- TreeCache - 监听节点和子节点（多级子）的事件

官方示例代码：

[curator/curator-examples/src/main/java/cache at master · apache/curator](https://github.com/apache/curator/tree/master/curator-examples/src/main/java/cache)
