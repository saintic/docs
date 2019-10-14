.. _tdi-node-install:

=========
部署安装
=========

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。
    Windows下就不要考虑了，以下文档基于Linux的CentOS7、Ubuntu18

--------------

源码地址： https://github.com/staugur/tdi-node

发布版本： https://github.com/staugur/tdi-node/releases

作者博客： https://blog.saintic.com/

内容说明： 以下部署文档适用于有一点linux基础的同学，大概涉及到yum、git、node等相关命令，以及redis、nginx等服务。

.. _tdi-node-install-no1:

**NO.1 启动Redis**
-------------------

部署redis很简单，CentOS用户可以\ ``yum install redis``\ ，Ubuntu用户可以\ ``apt-get install redis-server``\ ，都可以编译安装，给一个教程链接：\ http://www.runoob.com/redis/redis-install.html

也可以docker启动，用官方镜像启动一个docker redis，镜像：\ https://hub.docker.com/_/redis\ 。

.. _tdi-node-install-no2:

**NO.2 部署tdi-node程序**
--------------------------

这是一个基于Node.js写的web应用，使用bee-queue作为任务队列，测试过10、12版本，理论上支持v8+

另外，此部署是直接部署到服务器上，比如物理机、云主机、VPS等，由于依赖的程序原因，理论上可以支持unix系列，但是，除了CentOS和Ubuntu外，其他机器咱也没试过，咱也不知道~~

2.1 下载源码
^^^^^^^^^^^^^^

    ! 建议，如果你有git，可以： ``git clone https://github.com/staugur/tdi-node && cd tdi-node``

    ! 也可以下载压缩包： ``wget -O tdi-node.zip https://codeload.github.com/staugur/tdi-node/zip/master && unzip tdi-node.zip && mv tdi-node-master tdi-node && cd tdi-node``

2.2 安装依赖
^^^^^^^^^^^^^^

    - 很详细的安装Node.js的步骤不是这里的重点，您可以使用包管理器安装、直接下载二进制或源码编译，版本推荐v10+

    - 目前有一处使用了系统命令zip，所以你需要安装它（一般系统中应该都安装了）：

        - CentOS/Fedora/RHEL: ``yum install zip``

        - Ubuntu: ``apt-get install zip``

    - 项目中依赖的第三方模块已经写好了，如果不是二次开发，仅安装生产依赖即可（开发依赖就一个，安装也不嫌多~~）

        - 开发环境： ``yarn`` or ``npm install``

        - 正式环境： ``yarn --production`` or ``npm install --production``

    - 关于config.json配置文件

        请复制config.sample.json生成配置，这是JSON文件也不好注释，
        其中必填项是 ``redis`` 和 ``token`` ，具体内容参考下方2.3小节中的配置表格。

.. _tdi-node-config:

2.3 修改配置
^^^^^^^^^^^^^^

配置文件是 ``config.json`` ，给出了样例文件 ``config.sample.json`` 。

您需要使用 ``mv config.sample.json config.json`` 重命名文件，或者使用 ``cp config.sample.json config.json`` 复制一份。

可设置列表如下：

============    ===============   ================================================================
    配置段           默认值                                       说明
============    ===============   ================================================================
host              127.0.0.1          Web应用监听地址
port                3000             Web应用监听端口
status              ready            自主设定服务状态，ready可用、tardy不可用
**redis**            无              redis连接串，格式是：redis://[:password]@host:port/db
**token**            无              签名令牌，切勿泄露、遗失，支持修改。
alarmemail           无              报警邮箱，当检测到队列有failed时发送邮件，可选。
loglevel             INFO            日志级别，DEBUG、INFO、WARN、ERROR
============    ===============   ================================================================

!!!以上参数 **redis** 和 **token** 必须设置；

配置文件中alarmemail参数是关于报警的配置，可以参考 :ref:`tdi-alert`

.. note::

    Tdi-node读取配置有个顺序，假设配置名为key，首先从package.json中读取key值。

    未果，从config.json中读取；

    未果，从环境变量中读取，但是读取的是以 `crawlhuabantdi_` 开头的key值，这里，Tdi for Python也是通过环境变量设置的，所以可以共用。（但是redis有点区别，python版读取的是crawlhuabantdi_redis_url，node版读取的是crawlhuaban_redis）；

    未果，返回自定义默认值，若无，则返回空字符串。

2.4 启动程序
^^^^^^^^^^^^^^

需要启动bee-queue进程处理队列任务和node处理web请求，两者必须开启才能正常接收请求并处理下载任务。

- 开发环境：

    - 启动Web服务： ``yarn start`` or ``npm start``

    - 启动队列处理进程： ``yarn start:worker`` or ``npm start:worker``

- 正式环境：

    - 启动所有： ``yarn run prod:start`` or ``npm run prod:start``

**NO.3 Nginx配置**
-------------------

Tdi-node启动一个web应用，使用的框架是express，默认监听127.0.0.1:3000，可以参考tdi，
简单的反向代理即可。

首选Nginx，不解释；Apache HTTP Server，很遗憾，我现在也忘了怎么配置，得写.htaccess规则。

这里假设程序目录是/tdi-node，那么程序下载目录就是/tdi-node/src/downloads；

Nginx配置示例如下，您也可以配置使其支持HTTPS::

    server {
        listen 80;
        server_name 域名;
        charset utf-8;
        #防止在IE9、Chrome和Safari中的MIME类型混淆攻击
        add_header X-Content-Type-Options nosniff;
        client_max_body_size 10M;
        client_body_buffer_size 128k;
        #可以设置不允许搜索引擎抓取信息
        #此路径是为了下载实际图片压缩包，直接走nginx，这段可以说是最重要的配置
        location /downloads {
            #程序下载目录(源码下的src/downloads或者容器的主机挂载点)
            alias /tdi-node/src/downloads/;
            default_type application/octet-stream;
            if ($request_filename ~* ^.*?\.(zip|tgz)$){
                add_header Content-Disposition 'attachment;';
            }
        }
        location / {
            #3000是默认端口
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

程序部署好+Nginx配置完成，启动后，这个域名就能对外服务了（温馨提示：您可以使用HTTPS提供服务，并且也建议用HTTPS，证书可以到此免费申请： https://freessl.cn ），即可进入下一篇查看如何注册、使用。

另外，若您没有[已备案]域名，可以与我留言申请一个 *tdi.saintic.com* 的子域。

**PS：补充说明**

您也可以使用已有域名配置，将Tdi-node设置为子目录，合并到配置文件中（server里），核心配置段：

::

    server{
        listen 80;
        server_name 此处为已有域名;
        ......
        #在已有配置文件中增加以下两段，具体下载目录和端口自行修改：
        client_max_body_size 10M;
        client_body_buffer_size 128k;
        #此路径是为了下载实际图片压缩包，直接走nginx，这段可以说是最重要的配置
        location ^~ /downloads/ {
            #下载程序目录
            alias /tdi-node/src/downloads;
            default_type application/octet-stream;
            if ($request_filename ~* ^.*?\.(zip|tgz)$){
                add_header Content-Disposition 'attachment;';
            }
        }
        #此路径是tdi-node程序中的路由，需要代理过去
        location ~ ^/(ping|download|rqdashboard) {
            proxy_pass http://127.0.0.1:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        ......
    }

**NO.4 程序升级**
------------------

目前git下载可以使用git pull拉取最新代码，重启进程（ ``yarn prod:restart`` ）即完成升级。


**NO.5 使用篇**
----------------

关于定时检测、资源报警、过期清理等功能的使用，:ref:`请点击跳转查看Tdi使用说明文档 <tdi-usgae>`

