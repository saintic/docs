SaintIC：[开源]项目、服务文档!
===============================

:Author: staugur
:Contact: staugur\@saintic.com
:Website: https://www.saintic.com

.. meta::
    :description: SaintIC.com [开源]项目及服务文档
    :keywords: saintic
    :http-equiv=Content-Type: text/html; charset=UTF-8
    :google-site-verification: h2Kbua4YStdYubtL4-tQRiX0-Mx1ANHbMt8HF8hRj4o

.. toctree::
    :hidden:
    :caption: 集成文档

    open/index
    grab_huaban_duitang
    passport/index
    incetops/index
    tdi/index
    tdi-php/index
    tdi-node/index
    rtfd/index
    securehttp.js/index

.. toctree::
    :hidden:
    :caption: 独立文档

    Flask-PluginKit <https://flask-pluginkit.rtfd.vip>
    Python-SecureHTTP <https://python-securehttp.rtfd.vip>

.. _README:

===========
说在前面
===========

.. _About:

关于
~~~~~~~

-  此作者：菜鸟运维一名，期待运维开发，目前在北京，但杭州有工作推荐可以@我。

-  本文档：作者开源工具的使用文档，尽可能详细的文档，持续更新中；若有问题可提交issue或pr！

-  此域名： **saintic.com** 是2014年底注册的，已备案，托管于阿里云，目前主要用来运行博客、公共接口及服务、项目演示等，全站支持https，具体域名：

    - www.saintic.com: 早先是博客主域名，后来单独搞一个页面分离出来，目前就是一个导航作用；
    - blog.saintic.com: 技术博客，一些项目介绍、一些技术记录，主要是运维、Python方面；
    - open.saintic.com: 开放的接口、服务、工具等，会将有趣的东西放上去；
    - passport.saintic.com: 用来认证的应用，统一登录、注册；
    - 其他诸如swarmops、incetops等项目演示站及 **satic.io** 相关域名。

.. _Link:

链接
~~~~~~

-  大概是官网吧：https://www.saintic.com
-  GitHub：https://github.com/staugur
-  码云：https://gitee.com/staugur

.. _Feedback:

反馈
~~~~~~

-  加Q群：`577543189 <https://jq.qq.com/?_wv=1027&k=5aZyCMV>`_
-  收邮件： staugur\@saintic.com
-  热烈欢迎star、pr、issue或加入 `github组织 <https://github.com/saintic>`_
-  在线表单：`留言反馈 <https://passport.saintic.com/feedback.html>`_
-  在线评论：`评论吐槽 <https://open.saintic.com/comment>`_

.. _Definition:

约定
~~~~~~

-  相关Web类程序大多基于 `Flask-PluginKit <https://github.com/staugur/Flask-PluginKit>`_
-  相关认证服务(注册、统一登录与注销、用户设置与资料)均基于 `Passport <https://github.com/staugur/passport>`_
-  程序源代码目录均为 ``src`` ，入口文件均为 ``src/main.py`` ，配置文件均为 ``src/config.py``
-  配置文件中MYSQL段格式 ``mysql://host:port:user:password:database``，其他参数默认即可
-  配置文件中REDIS段格式 ``redis://[:password]@host:port/db`` ，若无密码请省略 ``[:password]``
-  配置文件中文档未提及的参数请参考文件内部注释。
-  配置方法均采用“先环境变量-后默认值”的方式，使用os.getenv函数，请自行了解此函数。
-  生产环境启动脚本 ``online_gunicorn.sh`` ，此脚本会先 ``source online_preboot.sh`` ，所以环境变量等可以在此脚本设置。
-  文件结构实例模板:

::

   项目/
   ├── requirements.txt          # 模块依赖包文件
   └── src                       # 源代码目录
       ├── config.py             # 配置文件
       ├── libs                  # 类目录
       │   ├── base.py           # 基类
       │   ├── __init__.py
       ├── main.py               # 入口文件
       ├── online_gunicorn.sh    # 正式环境启动脚本-gunicorn
       ├── online_uwsgi.sh       # 正式环境启动脚本-uwsgi
       ├── plugins               # 插件代码目录
       │   ├── demo              # 禁用的插件示例
       │   ├── __init__.py
       │   └── ssoclient         # sso客户端插件
       ├── test                  # 测试用例
       │   └── __init__.py
       ├── utils                 # 工具目录
       │   ├── aes_cbc.py        # 加密文件
       │   ├── __init__.py
       │   ├── jwt.py            # jwt签名认证文件
       │   ├── log.py            # 日志记录文件
       │   ├── Signature.py      # Api签名文件
       │   ├── tool.py           # 其他可用函数
       │   └── web.py            # web可用函数
       ├── version.py            # 版本文件
       └── views                 # 视图目录
           ├── FrontView.py
           └── __init__.py

.. _End:

说在后面
~~~~~~~~~~

-  博客小程序
    |image0|

-  微信捐赠也是可以的
    |image1|


.. |image0| image:: https://blog.saintic.com/static/img/applet.jpg
    :width: 150
.. |image1| image:: https://blog.saintic.com/static/img/weipayimg.jpg
    :width: 150
