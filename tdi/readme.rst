.. _tdi-readme:

======
概述
======

.. note::

    这是一个专项程序，用以接入 *花瓣网下载* 和 *堆糖网下载* 两个油猴脚本的远程下载服务。

GitHub：https://github.com/staugur/tdi

语言：Python

框架：Flask

.. _tdi-features:

功能：
------

1. 异步任务下载花瓣网、堆糖网图片
2. 仍然支持发送邮箱和短信以及微信查询进度。
3. 定时检测资源以免影响远端服务器，后续会资源报警。
4. 自主设置远端服务是否可用；随意关停服务。
5. 支持PyPy，Python2.7、3+
6. 下载前、下载中检测磁盘使用率，大于80则停止后续下载。
7. 支持私有（即个人专属服务）！

.. _tdi-process:

流程：
------

1. 成员端启动程序，到中心端页面\ ``https://open.sainitc.com/CrawlHuaban/Register``\ 注册成员端URL。
2. 中心端校验成员端规则，没问题则注册到中心端。
3. 中心端定时检测成员端，查询其可用性、磁盘、负载、内存，并更新状态。
4. 用户请求时，中心端根据成员端状态和资源计算是否可用，然后从可用列表中随机分配。

5. 程序收到下载请求后，放入异步任务队列，下载完成后回调给中心端，实现提醒、记录等。

.. _tdi-deploy:

一句话部署：
------------

1. 要求： Python2.7（3+）和Redis
2. 下载： ``git clone https://github.com/staugur/tdi && cd tdi/src``
3. 依赖： ``pip install -r requirements.txt``
4. 配置： 即\ ``config.py``\ 文件，可以从环境变量中读取配置信息。
5. 启动： sh online\_rq.sh start && sh online\_gunicorn.sh start

详细部署请看下一篇！
--------------------
