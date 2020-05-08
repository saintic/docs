.. _picbed-install:

===========
部署安装
===========

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。
    以下文档基于Linux的CentOS7，Ubuntu18

--------------

源码地址： https://github.com/staugur/picbed

正式版本： https://github.com/staugur/picbed/releases

作者博客： https://blog.saintic.com/

内容说明： 以下部署文档适用于有一点linux基础的同学，大概涉及到yum、git、docker等命令，以及redis、nginx等服务。

.. _picbed-install-no1:

**NO.1 启动Redis**
-------------------

部署redis很简单，CentOS用户可以\ ``yum install redis``\ ，Ubuntu用户可以\ ``apt-get install redis-server``\ ，都可以编译安装，给一个教程链接：\ http://www.runoob.com/redis/redis-install.html

也可以docker启动，用官方镜像启动一个docker redis，镜像：\ https://hub.docker.com/_/redis\ 。

记得修改redis配置文件，开启AOF持久化，否则数据丢失那就。。。

.. _picbed-install-no2:

**NO.2 部署程序**
---------------------

这是一个基于Python Flask框架写的web应用，依赖redis，部署要求python2.7、3.5+

.. note::

    目前测试了CentOS、Ubuntu的py2.7、3.5、3.6、pypy、pypy3版本。

2.1. 下载源码
^^^^^^^^^^^^^^^

    ! 建议，如果你有git，可以：\ ``git clone https://github.com/staugur/picbed``

    ! 也可以下载压缩包：\ ``wget -O picbed.zip https://codeload.github.com/staugur/picbed/zip/master && unzip picbed.zip && mv picbed-master picbed``

    ! 或者到release页面下载正式版本的包。

.. note::

    目前只有master分支处于所谓beta状态，我已经在测试部署，服务地址是：
    http://picbed.demo.saintic.com

2.2 安装依赖
^^^^^^^^^^^^^^

.. code:: bash

    $ git clone https://github.com/staugur/picbed
    $ cd picbed/src
    $ pip install -r requirements.txt

.. _picbed-config:

2.3 修改配置
^^^^^^^^^^^^^^


配置文件是源码src目录下的config.py，它会加载中 **.cfg** 文件读取配置信息，
无法找到时加载环境变量，最后使用默认值，必需的配置项是picbed_redis_url。

所以可以把配置项写到 `.bash_profile` 或 `.bashrc` 此类文件中在登录时加载，
也可以写入到 `.cfg` 文件里，这是推荐的方式，它不会被提交到仓库，格式是k=v，
每行一条。

比如: `picbed_redis_url=redis://@localhost`

可设置列表如下：

================  ==========================  ===============   ====================================================================
    配置              [环境]变量名                默认值                                       说明
================  ==========================  ===============   ====================================================================
HOST              picbed_host                 127.0.0.1         监听地址
PORT              picbed_port                  9514             监听端口
LOGLEVEL          picbed_loglevel              DEBUG            日志级别，可选DEBUG, INFO, WARNING, ERROR, CRITICAL
SecretKey         picbed_secretkey             无               App应用秘钥(默认自动生成)
**REDIS**         picbed_redis_url             无               核心数据存储（redis连接串，格式是：redis://[:password]@host:port/db）
================  ==========================  ===============   ====================================================================

更多参数请参考config.py配置文件中的注释。

!!!以上参数 **REDIS** 无默认值，必须手动设置，示例如下（可以写入.bash\_profile中）：

.. code:: bash

    $ export picbed_redis_url="redis://@127.0.0.1:6379/1"

2.4 启动程序
^^^^^^^^^^^^^^

开发环境::

    $ make dev

正式环境::

    $ sh online_gunicorn.sh start  #可以用run参数前台启动，status查看状态，stop停止，restart重启

    或者使用make start等同于上述命令，其他诸如: make stop, make restart, make status

**NO.3 Nginx配置**
-------------------

在程序启动后，默认情况下，监听地址是127.0.0.1:9514

Nginx配置示例如下，您也可以配置使其支持HTTPS::

    server {
        listen 80;
        server_name 域名;
        charset utf-8;
        #防止在IE9、Chrome和Safari中的MIME类型混淆攻击
        add_header X-Content-Type-Options nosniff;
        #上传大小限制12M（实际程序上限是10M）
        client_max_body_size 12M;
        #可以设置不允许搜索引擎抓取信息
        #处理静态资源:
        location ~ ^\/static\/.*$ {
            root /path/to/picbed/src/;
        }
        location / {
            #9514是默认端口
            proxy_pass http://127.0.0.1:9514;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

程序部署好+Nginx配置完成，启动后，这个域名就能对外服务了（温馨提示：您可以使用HTTPS提供服务，并且也建议用HTTPS），即可进入下一篇查看如何注册、使用。

**NO.4 程序升级**
------------------

目前git下载可以使用git pull拉取最新代码，重启主程序(sh online_gunicorn.sh restart)即完成升级；

**NO.5 使用篇**
----------------

关于功能的使用，请看下一篇！

