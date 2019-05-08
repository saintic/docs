.. _incetops-install:

=========
部署安装
=========

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。

--------------

.. _incetops-ready:

一、开始准备
~~~~~~~~~~~~

1. 安装软件
^^^^^^^^^^^

    1.1 CentOS
    ``yum install -y gcc gcc-c++ python-devel libffi-devel openssl-devel mysql-devel``

    1.2 Ubuntu
    ``apt-get install build-essential libmysqld-dev libssl-dev python-dev libffi-dev``

2.下载代码
^^^^^^^^^^

    2.1 开发版本
    ``git clone https://github.com/staugur/IncetOps && cd IncetOps``

    2.2 稳定版本 ``暂无``

3. Python模块
^^^^^^^^^^^^^

    3.1 开发所用python版本为2.7.x，其他版本未测试！

    3.2 使用pip安装模块，执行\ ``pip install -r requirements.txt``\ 即可。

.. _incetops-require:

二、安装依赖
~~~~~~~~~~~~

1.MySQL
^^^^^^^

    1.1 使用版本5.5、5.6+均可。

    1.2 CentOS系列可以使用这个脚本，社区5.6版，执行命令\ ``curl -fsSL https://static.saintic.com/download/scripts/yum_install_mysql56.sh | sh -``\ 直接安装！

    1.3 启动mysql服务，导入sql

2.Redis
^^^^^^^

    2.1 使用版本目前看没要求。

    2.2 CentOS系列执行命令\ ``yum install -y redis``\ 应可安装。

    2.3 启动redis服务

.. _incetops-config-run:

三、配置运行
~~~~~~~~~~~~

.. _incetops-config-parse:

1.配置文件解析
^^^^^^^^^^^^^^

1.1 GLOBAL段，主要是程序监听的IP和端口。

1.2
MYSQL段，必填，没有默认值，格式是\ ``mysql://host:port:user:password:database[?charset=utf8&timezone=+8:00]``\ ，[]可省略保持默认

1.3
REDIS段，必填，没有默认值，格式是\ ``redis://[:password]@host:port/db``

1.4
SSO段，passport客户端配置，必填，请转至 :ref:`Passport文档-配置解析 <passport-config-parse>`

::

    如果只是临时测试，可以设置g.signin=True，方法：
        程序里src/main.py，大概61行，将以下代码：
            g.signin = verify_sessionId(request.cookies.get("sessionId"))
        替换为
            g.signin = True

1.5
SYSTEM段，HMAC\_SHA256\_KEY(变量名incetops\_hmac\_sha256\_key)、AES\_CBC\_KEY(变量名incetops\_aes\_cbc\_key)、JWT\_SECRET\_KEY(变量名incetops\_jwt\_secret\_key)必须与passport中保持一致！

.. _incetops-config-demo:

2. 配置文件示例
^^^^^^^^^^^^^^^

以设置系统环境变量为例，我是Linux环境，修改家目录的\ ``.bash_profile``\ ，增加以下内容(记得source下)：

::

    # GLOABL
    export REDIS_PRE="redis://@127.0.0.1:6379"
    export MYSQL_PRE="mysql://localhost:3306:root:123456"
    export PASSPORT_URL="http://passport.demo.com"
    export HMAC_SHA256_KEY="xxxxxxxxxxxxxxxxxxxxxxx"
    export AES_CBC_KEY="要求16个字符"
    export JWT_SECRET_KEY="xxxxxxx"
    export SIGN_ACCESSKEYID="xxxxxxx"
    export SIGN_ACCESSKEYSECRET="xxxxxxx"

    #IncetOps
    export incetops_mysql_url="${MYSQL_PRE}:IncetOps"
    export incetops_redis_url="${REDIS_PRE}/0"
    export incetops_sso_app_id="app_id"
    export incetops_sso_app_secret="app_secret"
    export incetops_sso_server=$PASSPORT_URL
    ## SYSTEM段-SSO主要配置(要与Passport保持一致)
    export incetops_hmac_sha256_key="${HMAC_SHA256_KEY}"
    export incetops_aes_cbc_key="${AES_CBC_KEY}"
    export incetops_jwt_secret_key="${JWT_SECRET_KEY}"

.. _incetops-run:

3. 运行
^^^^^^^

3.1 开发环境执行命令\ ``python main.py``\ ，输出下面内容基本是没问题了：

::

     * Running on http://0.0.0.0:16000/ (Press CTRL+C to quit)
     * Restarting with stat
     * Debugger is active!
     * Debugger PIN: 193-386-021

3.2 正式环境

::

    sh online_gunicorn.sh start    #启动
    sh online_gunicorn.sh status  #查看启动状态

3.3 启动队列

::

    注意：3.1、3.2仅仅运行了web进程，执行任务还需要启动rq进程，方法是：
    sh online_rq.sh start      #启动
    sh online_rq.sh status    #查看启动状态

PS. 当然报错的话，那就再研究研究，Google、Baidu，QQ群讨论都行。

.. _incetops-config-access:

4. 访问
^^^^^^^

配置文件中GLOBAL段Host、Port分别指定了监听地址和端口，默认监听0.0.0.0:16000，即全网访问，你可以通过修改配置文件或环境变量(incetops\_host、incetops\_port)更改默认参数。
