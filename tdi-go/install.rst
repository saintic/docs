.. _tdi-go-install:

=========
部署安装
=========

.. note::

    得益于go的特性，部署就很简单了，安装好二进制程序，带上参数启动即可。
    Windows/macOS就不要考虑了，以下文档基于Linux的CentOS7、Ubuntu18

--------------

源码地址： https://github.com/staugur/tdi-go

正式版本： https://github.com/staugur/tdi-go/releases

作者博客： https://blog.saintic.com/

依赖环境： Redis 2.x 3.x 4.x

.. _tdi-go-install-no1:

**NO.1 启动Redis**
-------------------

部署redis很简单，CentOS用户可以\ ``yum install redis``\ ，Ubuntu用户可以\ ``apt-get install redis-server``\ ，都可以编译安装，给一个教程链接：\ http://www.runoob.com/redis/redis-install.html

也可以docker启动，用官方镜像启动一个docker redis，镜像：\ https://hub.docker.com/_/redis\ 。

.. _tdi-go-install-no2:

**NO.2 获取 tdi 可执行程序**
-----------------------------

这是一个基于golang v1.15写的web应用，仅支持linux系统，编译后可得到一个二进制可执行文件，
使用nohup、systemd、supervisor调起web进程即可。

所以关键在于获取二进制文件，有如下方式：

2.1 从源码编译
^^^^^^^^^^^^^^^^

! 如果你有git，可以： ``git clone https://github.com/staugur/tdi-go``

! 也可以下载压缩包： ``wget -O tdi-go.zip https://codeload.github.com/staugur/tdi-go/zip/master && unzip tdi-go.zip && mv tdi-go-master tdi-go``

! 或者到release页面下载正式版本的包。

准备好golang环境，版本1.15+（其实v1.13也行），开启 **GO111MODULE**

执行命令： ``cd tdi-go && make build``

生成的二进制文件在 bin 子目录下

2.2 从发行版中获取
^^^^^^^^^^^^^^^^^^^

正式版本都会上传一个打包好的附件，直接下载解压即可得到二进制可执行文件，比如 v0.1.0 版本：

.. code-block:: bash

    Version=0.1.0
    wget -c https://github.com/staugur/tdi-go/releases/download/v${Version}/tdi.${Version}-linux-amd64.tar.gz
    tar -zxf tdi.${Version}-linux-amd64.tar.gz
    ./tdi -i

    
**NO.3 启动 tdi 进程**
------------------------

获取到二进制文件后，可移动到 PATH 目录下，选项 `-h/--help` 查看帮助：

.. code-block:: bash

    $ tdi -h
    Usage: tdi [flags]

    Doc to https://docs.saintic.com/tdi-go/
    Git to https://github.com/staugur/tdi-go/

    Flags:
      -h, --help            show this help message and exit
      -v, --version         show cli version and exit
      -i, --info            show version and system info
          --noclean         do not automatically clean up download files (env)
          --hour            if clean, expiration time (default 12)
          --host            http listen host (default "0.0.0.0", env)
          --port            http listen port (default 13145, env)
      -d, --dir             download base directory (required, env)
      -r, --redis           redis url, DSN-Style (required, env)
                            format: redis://[:<password>@]host[:port/db]
      -t, --token           password to verify identity (required, env)
      -s, --status          set this service status: ready or tardy, (default ready)

不同于其他Python、Node版本，golang版全部是cli处理，通过它开启web进程，
并内置了过期自动清理文件。

配置也集成到cli选项中，参考上方帮助提示中的小括号，required表示必须项，default后面是默认值，
env表示可以从环境变量中读取，以 `tdi_` 为前缀，加上选项名，比如 `--redis` ，
可从环境变量 `tdi_redis` 中读取值。

着重说下部分选项：

- noclean

  当值为true时表示不清理下载过期文件，默认是开启协程每分钟清理的。

- hour

  当清理过期文件时，指定清理的最大过期时间，单位h，默认12，即默认清理12h以前下载的。

- **dir**

  由于tdi-go只是二进制文件，所以需要此选项指定下载目录，而nginx需要一段location提供访问以
  供用户下载文件。

  v0.1.1已经内置了路由可以直接下载，可省去nginx作为反向代理。

- **redis**

  redis连接串，格式是：redis://[:password]@host:port/db

  .. tip::

      想了想，其实也可以不用redis，毕竟不像其他语言的tdi那样需要队列，考虑可能在 v0.2.0 移除

- **token**

  签名令牌，切勿泄露、遗失，支持修改。

- status

  设定应用状态，tardy表示不可用、不想被用，其他任何值都会改为ready表示可用

3.1 启动程序
^^^^^^^^^^^^^^

如果上述选项已经了解，可以启动服务了，可以先把所有配置通过环境变量设置，然后直接 tdi 即可启动；
也可以全通过选项启动（三个必选项填好就行）：

`tdi -d downloads -r redis://localhost -t xxx`


3.2 使用Docker启动
^^^^^^^^^^^^^^^^^^^

已经在代码中添加了Dockerfile且上传到了Docker Hub镜像仓库，大小大概6M左右，当然也可以从
源码自行构建镜像。

需要注意的就一个容器内部挂载点 /tdi 是下载目录，要挂载到宿主机上供nginx访问，
或者v0.1.1自带路由不通过nginx可不挂载。

.. code-block:: bash

    docker pull staugur/tdi-go   # 亦可使用具体版本

    docker run -d --name tdi --restart=always --net=host \
      -e tdi_redis=redis://localhost \
      -e tdi_token=xxx \
      -v /data/tdi-go/downloads:/tdi/ staugur/tdi-go

**NO.4 Nginx配置**
-------------------

tdi-go启动一个web应用，默认监听 0.0.0.0:13145，可以参考tdi，简单的反向代理即可。

这里假设下载目录是 /tdi-go/downloads，Nginx配置示例如下

.. code-block:: nginx

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
            alias /tdi-go/downloads/;
            default_type application/octet-stream;
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
    }

程序部署好+Nginx配置完成，启动后，这个域名就能对外服务了（温馨提示：您可以使用HTTPS提供服务，并且也建议用HTTPS），即可进入下一篇查看如何注册、使用。

另外，若您没有[已备案]域名，可以与我留言申请一个 *tdi.saintic.com* 的子域。

**NO.5 程序升级**
------------------

获取升级的二进制可执行文件覆盖旧的，杀掉进程再启动。

Docker升级请docker pull拉取latest或最新稳定版，重新启动一个新容器完成升级。

**NO.6 使用篇**
----------------

关于定时检测、资源报警、过期清理等功能的使用，:ref:`请点击跳转查看Tdi使用说明文档 <tdi-usgae>`

