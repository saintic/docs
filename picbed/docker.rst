.. _picbed-docker-deploy:

=================
使用Docker部署
=================

Docker仅包含源码及其依赖的Python模块，不包含redis和nginx环境。

.. note::

    您仍需要准备好redis环境，可以参考 :ref:`picbed-install-no1`

    Docker部署有两种方法，一是使用开发者打包的镜像(就称之为官方镜像)，二是自己打包。

--------------

.. _picbed-official-image:

1. 官方镜像
~~~~~~~~~~~~~~~

-  镜像地址：`staugur/picbed <https://hub.docker.com/r/staugur/picbed>`_ 

  位于Docker官方仓库，可以点击查看公开信息。

-  master分支即latest，版本号即标签

  这是利用了travis-ci在提交代码后自动构建镜像并上传，所以latest总是构建
  master分支最新代码，而其他tag则是已发布版本的代码（1.4.0+）

  拉取最新镜像： `docker pull staugur/picbed`

  拉取1.4.0镜像： `docker pull staugur/picbed:1.4.0`

.. _picbed-self-build:

2. 自行打包
~~~~~~~~~~~~~~~~

v1.4.0增加了Dockerfile文件，它使用alpine3.11 + python3.6，构建完成大概290M，

打包步骤如下：

- 国内环境

  使用国内的软件源安装依赖（默认）

  .. code-block:: bash

    $ git clone https://github.com/staugur/picbed && cd picbed
    $ docker build -t staugur/picbed .

- 国外环境

  切换到国外官方软件源

  .. code-block:: bash

    $ git clone https://github.com/staugur/picbed && cd picbed
    $ docker build -t staugur/picbed . --build-arg ALPINEMIRROR=dl-cdn.alpinelinux.org --build-arg PIPMIRROR=https://pypi.org/simple

3. 启动运行
~~~~~~~~~~~~~~~

您可以单独启动picbed镜像，或者使用docker-compose启动包括redis、nginx在内的
所有依赖环境。

启动一个容器：

.. code-block:: bash

    $ docker run -tdi --name picbed --net=host --restart=always -e picbed_redis_url=redis://xxx staugur/picbed

这大概是最小的配置了，使用了宿主机网络，监听 `127.0.0.1:9514` ，picbed要求的
配置必需有picbed_redis_url，设置redis连接信息。
其他的可选配置请参考 :ref:`picbed-config` 自行设置环境变量。

.. tip::

    可以将容器中的/picbed/static/upload、/picbed/logs挂载到宿主机或数据卷，
    前者是本地方式上传图片的保存目录，后者是日志。

如果没有问题，docker ps查看其状态是Up，系统中能看到进程：

.. code-block:: bash

    $ docker ps
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
    c1426a060a76        7ed9fda0bf40        "sh online_gunicorn.…"   17 hours ago        Up 55 minutes                           picbed

    $ ps aux|grep picbed
    root     23546  0.0  1.1  25700 20740 pts/0    S+   10:11   0:00 gunicorn: master [picbed]
    root     23548  0.0  2.1  49216 39936 pts/0    Sl+  10:11   0:01 gunicorn: worker [picbed]

4. 后续
~~~~~~~~~~~~

nginx配置自然还是要有的，遗憾的是在容器内静态资源不方便走nginx。

接下来建议您看下一节使用说明，刚开始需要创建一个管理员账号的，而使用docker
第一次启动也需要，命令如下：

.. code-block:: bash

    $ docker exec -i picbed flask sa create -u 管理员账号 -p 密码 --isAdmin

其他额外选项，如昵称、头像就不说了。
