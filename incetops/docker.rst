.. _incetops-docker-deploy:

=================
使用Docker部署
=================

.. note::

    Docker部署有两种方法，一是使用作者打包的镜像(就称之为官方镜像)，二是自己打包。

--------------

.. _incetops-official-image:

一、官方镜像
~~~~~~~~~~~~

-  镜像地址：registry.cn-beijing.aliyuncs.com/staugur/incetops

-  版本号(标签): latest

-  启动运行：
    docker run -tdi --name incetops --net=host --restart=always [请跳转至 :ref:`incetops-docker-appendix` 查看此处] registry.cn-beijing.aliyuncs.com/staugur/incetops

.. _incetops-self-build:

二、自行打包
~~~~~~~~~~~~

-  暂无稳定版
-  打包步骤如下::

    git clone https://github.com/staugur/IncetOps && cd IncetOps
    docker build -t incetops .

-  启动运行：
    docker run -tdi --name incetops --net=host --restart=always [请跳转至 :ref:`incetops-docker-appendix` 查看此处] incetops

.. _incetops-docker-appendix:

附录-环境变量
~~~~~~~~~~~~~

-  配置文件各项均可以使用系统环境变量设置，Docker使用就很方便了，只需要启动时设置多个\ ``-e key=value``
-  配置中具体项目参考 :ref:`IncetOps文档-配置解析 <incetops-config-parse>`
-  示例::

    docker run -tdi --name incetops --net=host --restart=always \
        -e incetops_host=0.0.0.0 -e incetops_port=16000 \
        -e incetops_mysql_url=mysql://host:port:user:password:database \
        -e incetops_redis_url=redis://@host:port/db \
        -e incetops_sso_app_id=xxx -e incetops_sso_app_secret=xxx -e incetops_sso_server=xxx \
        -e key=value...... \
        registry.cn-beijing.aliyuncs.com/staugur/incetops [或自行打包时设置的镜像名]

