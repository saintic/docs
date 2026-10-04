.. _tdi-php-install:

=========
部署安装
=========

.. note::

    部署就是三步走，一步准备工作，一步安装依赖，一步配置运行。
    Windows下就不要考虑了，以下文档基于Linux的CentOS7、Ubuntu18

--------------

源码地址： https://github.com/staugur/tdi-php

正式版本： https://github.com/staugur/tdi-php/releases

作者博客： https://blog.saintic.com/

内容说明： 以下部署文档适用于有一点linux基础的同学，大概涉及到yum、git、php等相关命令，以及redis、nginx等服务。

.. _tdi-php-install-no1:

**NO.1 启动Redis**
-------------------

部署redis很简单，CentOS用户可以\ ``yum install redis``\ ，Ubuntu用户可以\ ``apt-get install redis-server``\ ，都可以编译安装，给一个教程链接：\ http://www.runoob.com/redis/redis-install.html

也可以docker启动，用官方镜像启动一个docker redis，镜像：\ https://hub.docker.com/_/redis\ 。

.. _tdi-php-install-no2:

**NO.2 部署Tdi-php程序**
--------------------------

这是一个基于PHP7写的web应用，使用resque作为任务队列，测试过7.0、7.2版本。

另外，此部署是直接部署到服务器上，比如物理机、云主机、VPS等，由于依赖的程序原因，理论上可以支持unix系列，但是，除了CentOS和Ubuntu外，其他机器咱也没试过，咱也不知道~~

2.1 下载源码
^^^^^^^^^^^^^^

    ! 建议，如果你有git，可以：\ ``git clone https://github.com/staugur/tdi-php``

    ! 也可以下载压缩包：\ ``wget -O tdi-php.zip https://codeload.github.com/staugur/tdi-php/zip/master && unzip tdi-php.zip && mv tdi-php-master tdi-php``

    ! 或者到release页面下载正式版本的包。

    ! 进入代码目录： `cd tdi-php`

2.2 安装依赖
^^^^^^^^^^^^^^

    - 很详细的安装php的步骤不是这里的重点，您可以使用yum、apt或源码编译，但是php版本要7.0+，PHP官方支持的版本是7.2和7.3，建议使用7.2(基于此版本开发)。

    - 依赖的php扩展是curl、zip、pcntl、redis，一般前三个应该默认安装了。

        - redis：必需扩展，可以使用命令安装 ``pecl install redis`` ，其官方仓库是：https://github.com/phpredis/phpredis

        - proctitle：可选扩展，可以为下面php-resque的队列处理进程设置个性的进程名称

    - 项目中依赖的第三方模块已经写好了 `composer.json` ，不过为了方便，我已经将依赖的代码一起上传到git了，所以此处可以跳过。

        - php-resque：异步队列，官方仓库是：https://github.com/resque/php-resque/

    - 关于php.ini配置文件

        - disable_functions：请不要禁用 ``pcntl_*`` 的相关函数
        - post_max_size：可以适当调高点，比如10M

.. _tdi-php-config:

2.3 修改配置
^^^^^^^^^^^^^^

配置文件是\ ``config.php``\ ，给出了样例文件 ``config.sample.php`` （v0.1.0此样例包含VERSION定义，现已废弃）。

您需要使用 ``mv config.sample.php config.php`` 重命名文件，或者使用 ``cp config.sample.php config.php`` 复制一份。

可设置列表如下：

============    ===============   ================================================================
    配置段           默认值                                       说明
============    ===============   ================================================================
STATUS              ready            自主设定服务状态，ready可用、tardy不可用
**REDIS**            无              redis连接串，格式是：redis://[:password]@host:port/db
**TOKEN**            无              签名令牌，切勿泄露、遗失，支持修改。
ALARMEMAIL           无              报警邮箱，当检测到队列有failed时发送邮件，可选。
============    ===============   ================================================================

!!!以上参数 **REDIS** 和 **TOKEN** 必须设置；

配置文件中VERSION参数一般请勿修改。

配置文件中ALARMEMAIL参数是关于报警的配置，可以参考：:ref:`tdi-alert`

2.4 启动程序
^^^^^^^^^^^^^^

需要启动php-resque进程处理队列任务和php-fpm处理web请求，两者必须开启才能正常接收请求并处理下载任务。

::

    $ sh online_rq.sh start   #可以用run参数前台启动，status查看状态，stop停止，restart重启
    $ systemctl start php-fpm #此为示例，根据实际情况使用命令启动php-fpm

.. warning::

    如果您不使用默认的php，或者说php不在系统PATH变量内，您需要创建 ``online_preboot.sh`` 脚本，online_rq.sh会尝试source这个脚本，其内容大概可以是这样：

    export PHP_CLI=具体PHP命令路径

**NO.3 Nginx配置**
-------------------

在php-fpm和php-resque进程启动后，对于php来说还需要一个WEB服务器搭配使用，比如nginx、apache。

首选Nginx，不解释；Apache HTTP Server，很遗憾，我现在也忘了怎么配置，得写.htaccess规则。

这里假设程序目录是/tdi-php，那么程序下载目录就是/tdi-php/src/downloads；


Nginx配置示例如下，您也可以配置使其支持HTTPS::

    server {
        listen 80;
        server_name 域名;
        root /tdi-php/src/;
        index index.html index.htm index.php;
        client_max_body_size 10M;
        client_body_buffer_size 128k;
        #可以设置不允许搜索引擎抓取信息
        location / {
            try_files $uri $uri/ /$uri.php?$query_string;
        }
        location ~ \.php$ {
            set $denyAccess 1;
            if ($uri ~* /(ping|download)) {
                set $denyAccess 0;
            }
            if ($denyAccess) {
                return 404;
            }
            try_files $uri = 404;
            # 如果没有fastcgi.conf可以用下面两行替换
            # include fastcgi_params;
            # fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi.conf;
            # PHP-FPM监听端口或socket
            fastcgi_pass 127.0.0.1:9000;
            #fastcgi_pass unix:/dev/shm/php-fpm.sock;
        }
    }


程序部署好+Nginx配置完成，启动后，这个域名就能对外服务了（温馨提示：您可以使用HTTPS提供服务，并且也建议用HTTPS），即可进入下一篇查看如何注册、使用。

另外，若您没有[已备案]域名，可以与我留言申请一个 *tdi.saintic.com* 的子域。

**NO.4 程序升级**
------------------

目前git下载可以使用git pull拉取最新代码，重启php-resque进程即完成升级；


**NO.5 使用篇**
----------------

关于定时检测、资源报警、过期清理等功能的使用，:ref:`请点击跳转查看Tdi使用说明文档 <tdi-usgae>`


**NO.6 resque-web**
--------------------

Tdi for Python内置了rqdashboard路由可以直接使用Web页面查看队列情况，但是Tdi for PHP没有，不过如果需要，可以安装ruby语言编写的resque-web，命令是：``gem install resque-web``

.. tip::

    如果没有gem命令，那么你可能需要安装ruby环境，以CentOS为例，``yum install ruby``

使用方法：
    resque-web --port 3000 --redis redis://[:password]@host:port/db

以上命令执行后会放入后台，其中redis参数要与tdi-php中配置的一致，否则读取不到队列数据，更多用法使用--help查看。

此时使用浏览器打开ip:3000，会看到类似界面：

|resque_web_image|

.. |resque_web_image| image:: /_static/images/resque-web.png
