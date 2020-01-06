.. _picbed-readme:

======
概述
======

.. note::

    基于Flask的Web自建图床，默认存储在本地，支持扩展又拍云、七牛云、
    阿里云OSS、腾讯云COS等后端存储。

GitHub：https://github.com/staugur/picbed

语言：Python

框架：Flask

.. _picbed-features:

功能：
------

1. 私有或公开的图床程序（允许匿名）
2. 可插拔的功能点扩展钩子
3. API
4. 保存上传图片的后端高扩展（除本地可扩展又拍云、七牛云、阿里云、腾讯云等）
5. 上传图片快捷复制支持原生URL、HTML、reStructuredText、Markdown格式
6. 站点全局参数可后台配置
7. 支持PyPy、Python2.7、3.5+

.. _picbed-deploy:

一句话部署：
------------

1. 要求： Python2.7（3.5+）和Redis
2. 下载： ``git clone https://github.com/staugur/picbed && cd picbed/src``
3. 依赖： ``pip install -r requirements.txt``
4. 配置： ``config.py`` 即配置文件，可以从环境变量中读取配置信息。
5. 启动： sh online\_gunicorn.sh start

详细部署请看下一篇！
--------------------
