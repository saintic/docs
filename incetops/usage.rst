.. _incetops-usgae:

============
使用说明
============

.. warning::

    使用就很简单了，Web应用，点点看看。
    但请注意，执行任务请务必大量测试，且如果您不懂Python开发，不建议在重要环境使用此程序！


--------

1. 执行逻辑：IncetOps -> Inception -> MySQL

    程序调用inception执行sql，所以核心是inception，可以理解为MySQL的中间件，您需要部署inception程序，参考： https://blog.saintic.com/blog/259.html

2. 启动

    2.1 启动web进程处理请求：\ ``sh online_gunicorn.sh start``

    2.2 启动rq进程处理任务：\ ``sh online_rq.sh start``

3. 前端使用

    3.1 左侧导航-Inception，需要先添加这个中间件。

    3.2 左侧导航-数据库，添加数据库实例。

    .. warning:: 数据库连接信息需要user、password、host，强烈建议选择推荐的inception，其中password会加密保存。此处连接信息要以inception为客户端，确保inception所在机器能连接上MySQL！

    3.3 左侧导航-任务。

    - 都是必填项，牢记执行逻辑，选择MySQL实例和Inception服务要对应好，所以强烈建议添加MySQL实例时设置推荐的inception。

    - 关于SQL语句，由于inception已经闭源，官方文档404了，sql规则不能看，但基本上增删改之类的操作没问题，使用select、use等没有意义。

    - 开启备份：需要选择的inception开启备份功能 

    - 忽略警告：有时候inception会有一定的警告信息，但sql人工确定无误，就可以开启忽略

    - 立即执行：您可以定时执行，依赖于rq-scheduler模块，同样要启动队列任务，即\ ``sh online_rq.sh start``

    - 建议您先检查一遍，再添加任务。

    - 如图：

    |image0|

.. |image0| image:: /_static/images/incetops-task.png

