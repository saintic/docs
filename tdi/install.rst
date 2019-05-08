.. _tdi-install:

=====================
部署安装(包含Docker)
=====================

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。

--------------

源码地址： https://github.com/saintic/tdi

历史版本： 0.1.0，0.2.1(master)

作者博客： https://blog.saintic.com/

内容说明： 以下部署文档适用于有一点linux基础的同学，大概涉及到yum、git、docker等命令，以及redis、nginx等服务。

.. _tdi-install-no1:

**NO.1 启动Redis**
-------------------

部署redis很简单，CentOS用户可以\ ``yum install redis``\ ，Ubuntu用户可以\ ``apt-get install redis-server``\ ，都可以编译安装，给一个教程链接：\ http://www.runoob.com/redis/redis-install.html

也可以docker启动，用官方镜像启动一个docker redis，镜像：\ https://hub.docker.com/_/redis\ 。

.. _tdi-install-no2:

**NO.2 部署Tdi程序**
---------------------

这是一个基于Python Flask框架写的web应用，使用rq作为任务队列，部署要求python2.7、3.5+，可以普通部署和Docker部署。

.. note::

    目前测试了CentOS、Ubuntu的py2.7、py3.6、py3.7版本，由于模块依赖，理论上可使用3.5及以上版本和2.7版本。

    建议使用2.7版本，另外，Docker内置的py版本是2.7。

*2.1 普通部署*
>>>>>>>>>>>>>>>>>>>>>

即直接部署到服务器上，比如物理机、云主机、VPS等，目前可用CentOS、Ubuntu的操作系统、Python2.7(支持pypy)和Redis。

这里演示了一个简单的部署流程图： 

|image0|

2.1.1 下载源码
^^^^^^^^^^^^^^

    ! 建议，如果你有git，可以：\ ``git clone https://github.com/saintic/tdi``

    ! 也可以下载压缩包：\ ``wget -O tdi.zip https://codeload.github.com/saintic/tdi/zip/master && unzip tdi.zip && mv tdi-master tdi``

2.1.2 安装依赖
^^^^^^^^^^^^^^

.. code:: bash

    # CentOS
    $ yum install -y gcc python-devel libffi-devel
    # Ubuntu
    $ apt-get install gcc python-dev libffi-dev

    $ cd tdi/src/
    $ pip install -r requirements.txt

.. _tdi-config:

2.1.3 修改配置
^^^^^^^^^^^^^^

配置文件是\ ``config.py``\ ，此配置首先从环境变量读取信息，读取不到时使用默认值，可设置列表如下：

============  ==========================  ===============   ================================================================
    配置段            环境变量名               默认值                                       说明
============  ==========================  ===============   ================================================================
HOST             crawlhuabantdi_host         127.0.0.1        监听地址
PORT             crawlhuabantdi_port         13145            监听端口
LOGLEVEL       crawlhuabantdi_loglevel       INFO             日志级别，可选DEBUG, INFO, WARNING, ERROR, CRITICAL
STATUS         crawlhuabantdi_status         ready            自主设定服务状态，ready可用、tardy不可用
\*REDIS        crawlhuabantdi_redis_url       无              redis连接串，格式是：redis://[:password]@host:port/db
\*TOKEN        crawlhuabantdi_token           无              签名令牌，切勿泄露、遗失，支持修改。
NORQDASH       crawlhuabantdi_norqdash        no              是否关闭rq-dashboard，yes、no，这是一个可以查看队列任务的页面
============  ==========================  ===============   ================================================================

!!!以上参数 **REDIS** 和 **TOKEN** 无默认值，必须手动设置，示例如下（可以写入.bash\_profile中）：

.. code:: bash

    $ export crawlhuabantdi_redis_url="redis://@127.0.0.1:6379/1"
    $ export crawlhuabantdi_token="test"

2.1.4 启动程序
^^^^^^^^^^^^^^

需要启动rq进程处理队列任务和主进程处理web请求，两者必须开启才能正常接收请求并处理下载任务。

开发环境::

    $ python main.py
    $ sh online_rq.sh start        #或者python rq_worker.py

正式环境::

    $ sh online_gunicorn.sh start  #可以用run参数前台启动，status查看状态，stop停止，restart重启
    $ sh online_rq.sh start        #启动参数同上

*2.2 Docker部署*
>>>>>>>>>>>>>>>>>>>>>

使用Docker可以无缝部署到支持的操作系统中，且可以直接使用打包好的镜像，不需要直接再像上面那样走很多步骤。

2.2.1 自主构建
^^^^^^^^^^^^^^

::

    $ git clone https://github.com/saintic/tdi
    $ cd tdi
    $ docker build -t tdi .

2.2.2 使用官方镜像
^^^^^^^^^^^^^^^^^^

::

    $ docker pull registry.cn-beijing.aliyuncs.com/staugur/tdi

2.2.3 启动容器
^^^^^^^^^^^^^^

启动命令：

::

    $ docker run -tdi --name 容器名 --restart=always --net=host \
        -e crawlhuabantdi_redis_url=REDIS连接串 \
        -e crawlhuabantdi_token=令牌 \
        -v 挂载点:/Tdi/downloads \
        镜像:标签

镜像及标签：

::

    镜像：自主构建的即tdi，官方镜像是：registry.cn-beijing.aliyuncs.com/staugur/tdi

    标签（这里表示版本，每个稳定版打一个标签）：
        latest：默认，最新版本，可能是最新的稳定版，但最可能是正在开发的版本，所以建议用稳定版
        v0.2.0：源码中忘记打tag了，所以具体修改也忘记了，大概是支持了py3吧
        v0.1.0：第一个稳定版

解释说明：

> 容器名：就是启动容器的名字；--net=host，即容器使用物理网络

> REDIS连接串：其格式请参考上方修改配置那段 

> 令牌：英文字母开头加数字、字母或下划线，2-32位字符串

> 挂载点：程序运行在容器内，下载的图片都在内部，路径是\ ``/Tdi/downloads``\ ，需要挂载出来，供nginx访问，比如挂载点是/data/TdiDownloads/

> 示例::

    docker run -tdi --name Tdi1 --restart=always --net=host \
        -e crawlhuabantdi_redis_url=redis://:passwd@127.0.0.1:6379/0 \
        -e crawlhuabantdi_token=test \
        -v /data/Downloads/Tdi1:/Tdi/downloads registry.cn-beijing.aliyuncs.com/staugur/tdi [或自行打包的镜像名]

**NO.3 Nginx配置**
-------------------

在程序启动后，默认情况下，监听地址是127.0.0.1:13145。

如果您是普通部署，假设程序目录是/tdi，那么程序下载目录就是/tdi/src/downloads；

如果您是Docker部署，需要将容器内部的downloads目录挂载到宿主机上，以供nginx访问。

Nginx配置示例如下，您也可以配置使其支持HTTPS::

    server {
        listen 80;
        server_name 域名;
        charset utf-8;
        #防止在IE9、Chrome和Safari中的MIME类型混淆攻击
        add_header X-Content-Type-Options nosniff;
        #此路径是为了下载实际图片压缩包，直接走nginx，这段可以说是最重要的配置
        location /downloads {
            #程序下载目录(源码下的src/downloads或者容器的主机挂载点)
            alias /tdi/src/downloads/;
            default_type application/octet-stream;
            #开启目录索引，建议关闭，开启后能看到downloads下所有文件
            #autoindex on;
            #autoindex_format html;
            #autoindex_exact_size on;
            #autoindex_localtime on;
            proxy_max_temp_file_size 0;
            if ($request_filename ~* ^.*?\.(zip|tgz)$){
                add_header Content-Disposition 'attachment;';
            }
        }
        location / {
            #13145是默认端口
            proxy_pass http://127.0.0.1:13145;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        #此路径是为了方便查看rq中的任务，可以注释，不过建议加个basic认证以免所有人都可看，相关文档：http://www.nginx.cn/doc/standard/httpauthbasic.html
        #location ~ /rqdashboard {
        #    auth_basic "Please Verify!";
        #    auth_basic_user_file /etc/nginx/passwd;
        #    proxy_pass http://127.0.0.1:13145;
        #    proxy_set_header Host $host;
        #    proxy_set_header X-Real-IP $remote_addr;
        #    proxy_set_header X-Forwarded-Proto $scheme;
        #    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #}
    }

程序部署好+Nginx配置完成，启动后，这个域名就能对外服务了（温馨提示：您可以使用HTTPS提供服务，并且也建议用HTTPS，证书可以到此免费申请： https://freessl.cn?utm_source=saintic ），即可进入下一篇查看如何注册、使用。

**PS：补充说明**
------------------

您也可以使用已有域名配置，将Tdi设置为子目录，合并到配置文件中（server里），核心配置段：

::

    server{
        listen 80;
        server_name 此处为已有域名;
        ......
        #在已有配置文件中增加以下两段，具体下载目录和端口自行修改：
        #此路径是为了下载实际图片压缩包，直接走nginx，这段可以说是最重要的配置
        location /downloads {
            #下载程序目录
            alias /tdi/src/downloads;
            default_type application/octet-stream;
            proxy_max_temp_file_size 0;
            if ($request_filename ~* ^.*?\.(zip|tgz)$){
                add_header Content-Disposition 'attachment;';
            }
        }
        #此路径是web程序中两条路由，需要代理过去
        location ~ ^/(ping|download)$ {
            proxy_pass http://127.0.0.1:13145;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        ......
    }

**NO.4 程序升级**
------------------

目前git下载可以使用git pull拉取最新代码，重启主程序和rq进程即完成升级；

Docker升级需要docker pull拉取latest或最新稳定版，需要重新启动一个新容器完成升级。

**NO.5 使用篇**
----------------

关于定时检测、资源报警、过期清理等功能的使用，请看下一篇！

.. |image0| image:: /_static/images/deploy.gif

