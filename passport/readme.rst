.. _passport-readme:

======
概述
======

    程序地址： https://github.com/staugur/passport

    功能说明： 邮箱、手机，QQ、微博、GitHub、Coding、码云等第三方登录，支持多个账号类型绑定，统一登录注销，用户管理，SSO客户端管理等。

.. note::

    由于一些设计逻辑问题，目前准备重构此项目，请不要使用dev分支代码。

.. _passport-Source:

来源
-------

    https://blog.saintic.com/blog/134.html

.. _passport-LICENSE:

许可证
--------

    BSD 3-Clause License

.. _passport-Environment:

环境
-----------

    1. Python Version: 2.7
    2. Web Framework: Flask
    3. Required Modules for Python
    4. MySQL, Redis

.. _passport-Usage:

使用
------

::

    1. 依赖:
        1.0 yum install -y gcc gcc-c++ python-devel libffi-devel openssl-devel mysql-devel
        1.1 git clone https://github.com/staugur/passport && cd passport
        1.2 pip install -r requirements.txt
        1.3 MySQL需要导入misc/passport.sql数据库文件

    2. 修改src/config.py中配置项, getenv函数后是环境变量及其默认值(优先环境变量，其次默认值)。
        2.1 修改GLOBAL全局配置项(主要是端口、日志级别)
        2.2 修改MYSQL、REDIS、VAPTCHA【必须配置项】
        2.3 修改PLUGINS插件配置项(主要是第三方登录)【可选配置项】

    3. 运行:
        3.1 python main.py        #开发模式
        3.2 sh online_gunicorn.sh #生产模式

    4. 创建管理员:
        4.1 python cli.py --createSuperuser #根据提示输入管理员邮箱密码完成创建

.. _passport-Cli:

命令行
-------

::

    cd src
    python cli.py #下面是帮助信息
    usage: cli.py [-h] [--refresh_loginlog] [--refresh_clicklog]
                [--createSuperuser]

    optional arguments:
        -h, --help          show this help message and exit
        --refresh_loginlog  刷入登录日志
        --refresh_clicklog  刷入访问日志
        --createSuperuser   创建管理员用户

.. _passport-TODO:

待办事项
----------

    - redis sid存登录时设备信息

    - [STRIKEOUT:绑定邮箱手机、手机登录]

    - 签到

    - 用户行为记录

    - 系统管理

    - 安全

.. _passport-Design:

流程图
-------

.. figure:: https://raw.githubusercontent.com/staugur/passport/master/misc/sso.png
    :alt: 流程图
