.. _tdi-node-readme:

======
概述
======

.. note::

    这是一个基于Node.js的专项程序，用以接入 *花瓣网下载* 和 *堆糖网下载* 两个油猴脚本的远程下载服务。

    基于Python的，文档是：:ref:`Tdi for Python <tdi-readme>`

    基于PHP的，文档是：:ref:`Tdi for PHP <tdi-php-readme>`

GitHub：https://github.com/staugur/tdi-node

语言：Node.js

版本：8+

.. _tdi-node-features:

功能：
------

1. 异步任务下载花瓣网、堆糖网图片
2. 仍然支持发送邮箱和短信以及微信查询进度。
3. 定时检测资源以免影响远端服务器。
4. 自主设置远端服务是否可用；随意关停服务。
5. 下载前、下载中检测磁盘使用率，大于限定值(默认80)则停止后续下载。
6. 支持私有（即个人专属服务）！

.. _tdi-node-process:

流程：
------

1. 成员端启动程序，到中心端页面\ ``https://open.sainitc.com/CrawlHuaban/Register``\ 注册成员端URL。
2. 中心端校验成员端规则，没问题则注册到中心端。
3. 中心端定时检测成员端，查询其可用性、磁盘、负载、内存，并更新状态。
4. 用户请求时，中心端根据成员端状态和资源计算是否可用，然后从可用列表中分配。
5. 程序收到下载请求后，放入异步任务队列，下载完成后回调给中心端，实现提醒、记录等。

.. _tdi-node-deploy:

一句话部署：
------------

1. 要求： Node8+和Redis
2. 下载： ``git clone https://github.com/staugur/tdi-node && cd tdi-node``
3. 依赖： 安装zip命令和npm依赖包
4. 配置： 即config.json，参考config.sample.json(重命名或复制一份)，必填项是redis和token
5. 启动： ``yarn prod:start``

详细部署请看下一篇！
--------------------
