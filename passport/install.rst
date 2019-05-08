.. _passport-install:

=========
部署安装
=========

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。

--------------

.. _passport-ready:

一、开始准备
~~~~~~~~~~~~

.. _passport-ready-install:

1. 安装软件
^^^^^^^^^^^

    1.1 CentOS

    ``yum install -y gcc gcc-c++ python-devel libffi-devel openssl-devel mysql-devel``

    1.2 Ubuntu

    ``apt-get install build-essential libmysqld-dev libssl-dev python-dev libffi-dev``

.. _passport-ready-download:

2.下载代码
^^^^^^^^^^

    2.1 开发版本::

        $ git clone https://github.com/staugur/passport && cd passport

    2.2 稳定版本::

        $ wget -c -O passport-1.0.3.tar.gz https://codeload.github.com/staugur/passport/tar.gz/v1.0.3
        $ tar zxf passport-1.0.3.tar.gz
        $ cd passport-1.0.3/ 

.. _passport-ready-files:

3. 文件结构
^^^^^^^^^^^

::

    passport/
    ├── demo                              #这是客户端演示程序目录，注意配置文件config.py
    │   ├── config.py
    │   ├── libs
    │   ├── main.py
    │   ├── online_gunicorn.sh
    │   ├── plugins
    │   ├── utils
    │   ├── version.py
    │   └── views
    ├── LICENSE                           #LICENSE文件
    ├── misc                              #其他杂项目录，包含sql文件、流程图
    │   ├── passport.sql
    │   └── sso.png
    ├── README.md                         #概述文件
    ├── requirements.txt                  #python所需模块文件
    └── src                               #源代码目录
        ├── cli.py                        #命令行文件
        ├── config.py                     #配置文件
        ├── hlm
        ├── libs
        ├── main.py                       #程序入口文件
        ├── online_gunicorn.sh
        ├── plugins
        ├── static
        ├── templates
        ├── test
        ├── utils
        ├── version.py
        └── views

.. _passport-ready-modules:

4. 依赖版本和模块
^^^^^^^^^^^^^^^^^^^^

    4.1 开发所用python版本为2.7.x，其他版本未测试！

    4.2 使用pip安装模块，执行\ ``pip install -r requirements.txt``\ 即可。

.. _passport-require:

二、安装依赖
~~~~~~~~~~~~

.. _passport-require-mysql:

1.MySQL
^^^^^^^

    1.1 使用版本5.5、5.6+均可。

    1.2 CentOS系列可以使用这个脚本，社区5.6版，执行命令\ ``curl -fsSL https://static.saintic.com/download/scripts/yum_install_mysql56.sh | sh -``\ 直接安装！

    1.3 启动mysql服务，导入sql

.. _passport-require-redis:

2.Redis
^^^^^^^

    2.1 使用版本目前看没要求。

    2.2 CentOS系列执行命令\ ``yum install -y redis``\ 应可安装。

    2.3 启动redis服务

.. _passport-config-run:

三、配置运行
~~~~~~~~~~~~

.. _passport-config-parse:

1.配置文件解析
^^^^^^^^^^^^^^

1.1 GLOBAL段，主要是程序监听的IP和端口。

1.2
MYSQL段，必填，没有默认值，格式是\ ``mysql://host:port:user:password:database[?charset=utf8&timezone=+8:00]``\ ，[]可省略保持默认

1.3
REDIS段，必填，没有默认值，格式是\ ``redis://[:password]@host:port/db``

1.4 VAPTCHA段，手势验证码，必填

1.5
UPYUN段，又拍云存储头像，可选，其中enable值设定是否启用，不启用则保存到本地

1.6
EMAIL段，发送邮箱验证码，根据实际可选(EMAIL、PHONE建议至少一个，否则无法使用注册、忘记密码等功能)

1.7 PHONE段，发送手机验证码，根据实际可选

1.8
SYSTEM和PLUGINS段配置，前者是程序本身相关，有一些需要调整；后者是插件方面配置。

1.9 请看表格（表格内未提及的可以直接参考config.py中的注释）：


+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|  配置段(\*必填)       |                                   键名(即环境变量)及默认值                                                     |                    示例                         |                      备注                                        |
+=======================+================================================================================================================+=================================================+==================================================================+
|   \*MYSQL             |    passport_mysql_url                                                                                          |     mysql://127.0.0.1:3306:root:123546:test     |  mysql连接串，格式：mysql://host:port:user:password:database     |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|   \*REDIS             |    passport_redis_url                                                                                          |     - redis://@127.0.0.1:6379/8                 |  redis连接串，格式：redis://[:password]@host:port/db             |
|                       |                                                                                                                |     - redis://:passwd@127.0.0.1:6379/1          |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|   \*VAPTCHA           | - passport_vaptcha_enable 启用手势验证功能(v1.0.3它就是个摆设)                                                 |     mysql://127.0.0.1:3306:root:123546:test     |  官网：https://www.vaptcha.com，自行注册创建验证单元。           |
|                       | - passport_vaptcha_vid    验证单元id                                                                           |                                                 |                                                                  |
|                       | - passport_vaptcha_key    验证单元key                                                                          |                                                 |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|    UPYUN              | - passport_upyun_enable 启用又拍云存储，默认false即使用本地！                                                  |                                                 |  - 又拍云默认上传到dn+basedir下                                  |
|                       | - passport_upyun_bucket 又拍云云存储服务名称                                                                   |                                                 |  - 官网：https://www.upyun.com/products/file-storage             |
|                       | - passport_upyun_username 云存储服务的操作员账号                                                               |                                                 |                                                                  |
|                       | - passport_upyun_password 接上，操作员密码                                                                     |                                                 |                                                                  |
|                       | - passport_upyun_dn 云存储服务的CNAME或绑定的完全合格域名，默认https://img.saintic.com                         |                                                 |                                                                  |
|                       | - passport_upyun_basedir 存储的目录，默认/test                                                                 |                                                 |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|    EMAIL              | - passport_email_useraddr 发件人邮箱                                                                           | - passport_email_useraddr="xxx@saintic.com"     |  - 示例是腾讯企业邮箱。                                          |
|                       | - passport_email_userpass 发件人邮箱密码                                                                       | - passport_email_userpass="xxx"                 |  - 此配置用以发送验证码、邮件通知等                              |
|                       | - passport_email_smtpserver 邮箱服务器地址                                                                     | - passport_email_smtpserver="smtp.exmail.qq.com"|                                                                  |
|                       | - passport_email_smtpport 邮箱服务器端口，默认25                                                               | - passport_email_smtpport=465                   |                                                                  |
|                       | - passport_email_smtpssl 是否启用加密，True启用，默认False不启用                                               | - passport_email_smtpssl=true                   |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|    PHONE              | - passport_phone_keyid 阿里云账号AccessKey ID                                                                  |                                                 |  - 此配置用以发送验证码                                          |
|                       | - passport_phone_keysecret 阿里云账号Access Key Secret                                                         |                                                 |  - 官网：阿里云，https://www.aliyun.com/product/sms              |
|                       | - passport_phone_sign_name 阿里云短信服务签名名称                                                              |                                                 |                                                                  |
|                       | - passport_phone_template_code 阿里云短信服务模版CODE                                                          |                                                 |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|    SYSTEM             | - passport_hmac_sha256_key hmac签名key                                                                         |                                                 |  Sign部分不一定用得着，这个是定义API路由接口时自己参考是否使用   |
|                       | - passport_aes_cbc_key     AES加密key，16bytes                                                                 |                                                 |                                                                  |
|                       | - passport_jwt_secret_key  jwt签名key                                                                          |                                                 |                                                                  |
|                       | - 系统配置段有很多程序内部的配置，参考配置文件config.py，以上三个是与客户端认证相关，比较重要，不建议用默认值  |                                                 |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+
|    PLUGINS            | 主要是第三方登录的配置：weibo,qq,github,coding,gitee:                                                          | 重定向回调地址格式是:                           |  更多参考配置文件更改                                            |
|                       |     - ENABLE 是否启用                                                                                          |     http[s]://域名/oauth2/第三方名称/authorized |                                                                  |
|                       |     - APP_ID 第三方登录应用id                                                                                  |         - 域名：passport部署的监听域名          |                                                                  |
|                       |     - APP_KEY 第三方登录应用key                                                                                |         - 第三方名称： (weibo,qq,github等)      |                                                                  |
|                       |     - REDIRECT_URI 重定向地址(passport的回调url)                                                               |                                                 |                                                                  |
+-----------------------+----------------------------------------------------------------------------------------------------------------+-------------------------------------------------+------------------------------------------------------------------+

.. _passport-config-demo:

2. 配置文件示例
^^^^^^^^^^^^^^^

以设置系统环境变量为例，我是Linux环境，修改家目录的\ ``.bash_profile``\ 或者在程序src目录下增加\ ``online_pre.sh``\ 文件（此文件，使用online\_gunicorn.sh启动程序时会预先加载），增加以下内容(记得source下让环境变量生效)：

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

    # Passport
    export passport_mysql_url="${MYSQL_PRE}:passport"
    export passport_redis_url="${REDIS_PRE}/8"
    ## 手机验证码
    export passport_phone_keyid="key"
    export passport_phone_keysecret="secret"
    export passport_phone_sign_name="name"
    export passport_phone_template_code="SMS_code"
    ## 邮箱验证码
    export passport_email_useraddr="demo@saintic.com"
    export passport_email_userpass="123456"
    export passport_email_smtpssl="true"
    export passport_email_smtpserver="smtp.exmail.qq.com"
    export passport_email_smtpport="465"
    ## 手势验证码
    export passport_vaptcha_vid="vid"
    export passport_vaptcha_key="key"
    ## 微博登录
    export passport_weibo_appid="appid"
    export passport_weibo_appkey="appkey"
    export passport_weibo_redirecturi="${PASSPORT_URL}/oauth2/weibo/authorized"
    ## QQ登录
    export passport_qq_appid="appid"
    export passport_qq_appkey="appkey"
    export passport_qq_redirecturi="${PASSPORT_URL}/oauth2/qq/authorized"
    ## Github登录
    export passport_github_appid="appid"
    export passport_github_appkey="appkey"
    export passport_github_redirecturi="${PASSPORT_URL}/oauth2/github/authorized"
    ## Coding登录
    export passport_coding_appid="appid"
    export passport_coding_appkey="appkey"
    export passport_coding_redirecturi="${PASSPORT_URL}/oauth2/coding/authorized"
    ## 码云登录
    export passport_gitee_appid="appid"
    export passport_gitee_appkey="appkey"
    export passport_gitee_redirecturi="${PASSPORT_URL}/oauth2/gitee/authorized"
    ## 又拍云
    export passport_upyun_bucket="test"
    export passport_upyun_username="test"
    export passport_upyun_password="123456"
    ## SYSTEM段-SSO主要配置(其他客户端要保持一致)
    export passport_hmac_sha256_key="${HMAC_SHA256_KEY}"
    export passport_aes_cbc_key="${AES_CBC_KEY}"
    export passport_jwt_secret_key="${JWT_SECRET_KEY}"
    ## SYSTEM段-API签名配置(目前没用)
    export passport_sign_accesskeyid="${SIGN_ACCESSKEYID}"
    export passport_sign_accesskeysecret="${SIGN_ACCESSKEYSECRET}"
    ## SYSTEM段-其他配置
    export passport_personalizeddomainnameprefix="https://www.saintic.com/user/"
    export passport_system_email="staugur@saintic.com"
    export passport_status_url="https://status.satic.io"

3. 运行
^^^^^^^

3.1 执行命令\ ``python main.py``\ ，输出下面内容基本是没问题了：

::

     * Running on http://0.0.0.0:10030/ (Press CTRL+C to quit)
     * Restarting with stat
     * Debugger is active!
     * Debugger PIN: 193-386-021

3.2 当然报错的话，那就再研究研究，Google、Baidu，QQ群讨论都行。

4. 访问
^^^^^^^

配置文件中GLOBAL段Host、Port分别指定了监听地址和端口，默认监听0.0.0.0:10030，你可以通过修改配置文件或环境变量(passport\_host、passport\_port)更改默认参数。
