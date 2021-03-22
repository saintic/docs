.. _tdi-go-readme:

======
概述
======

.. note::

    这是一个基于Go的专项程序，用以接入 *花瓣网下载* 和 *堆糖网下载* 两个油猴脚本的远程下载服务。

    基于Python的，文档是：:ref:`Tdi for Python <tdi-readme>`

    基于PHP的，文档是：:ref:`Tdi for PHP <tdi-php-readme>`

    基于Node.js的，文档是：:ref:`Tdi for Node <tdi-node-readme>`

GitHub：https://github.com/staugur/tdi-go

语言：Golang

版本：1.15+

.. _tdi-go-features:

功能：
------

1. 异步任务下载花瓣网、堆糖网图片
2. 仍然支持发送邮箱和短信以及微信查询进度。
3. 定时检测资源以免影响远端服务器。
4. 自主设置远端服务是否可用；随意关停服务。
5. 下载前、下载中检测磁盘使用率，大于限定值(默认80)则停止后续下载。
6. 支持私有（即个人专属服务）！

.. _tdi-go-process:

流程：
------

1. 成员端启动程序，到中心端页面\ ``https://open.sainitc.com/CrawlHuaban/Register``\ 注册成员端URL。
2. 中心端校验成员端规则，没问题则注册到中心端。
3. 中心端定时检测成员端，查询其可用性、磁盘、负载、内存，并更新状态。
4. 用户请求时，中心端根据成员端状态和资源计算是否可用，然后从可用列表中分配。
5. 此程序收到下载请求后，开启协程下载，下载完成后回调给中心端，实现提醒、记录等。

.. _tdi-go-deploy:

详细部署请看下一篇！
--------------------
