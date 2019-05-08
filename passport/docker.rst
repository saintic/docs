.. _passport-docker-deploy:

=================
使用Docker部署
=================

.. note::

    Docker部署有两种方法，一是使用作者打包的镜像(就称之为官方镜像)，二是自己打包。

--------------

.. _passport-official-image:

一、官方镜像
~~~~~~~~~~~~

-  镜像地址：registry.cn-beijing.aliyuncs.com/staugur/passport

-  版本号(标签): v1.0.3

-  启动运行:

    docker run -tdi --name passport --net=host --restart=always [请跳转至 :ref:`passport-docker-appendix` 查看此处] registry.cn-beijing.aliyuncs.com/staugur/passport:v1.0.3

.. _passport-self-build:

二、自行打包
~~~~~~~~~~~~

-  v1.0.3稳定版代码中已更新Dockerfile文件可以使用

-  打包步骤如下::

    git clone https://github.com/staugur/passport && cd passport
    docker build -t passport .

-  启动运行:

    docker run -tdi --name passport --net=host --restart=always [请跳转至 :ref:`passport-docker-appendix` 查看此处] passport

.. _passport-docker-appendix:

附录-环境变量
~~~~~~~~~~~~~

-  配置文件各项均可以使用系统环境变量设置，Docker使用就很方便了，只需要启动时设置多个\ ``-e key=value``
-  配置中具体项目参考 :ref:`Passport文档-配置解析 <passport-config-parse>`
-  示例::

    docker run -tdi --name passport --net=host --restart=always \
        -e passport_host=0.0.0.0 -e passport_port=10030 \
        -e passport_mysql_url=mysql://host:port:user:password:database \
        -e passport_redis_url=redis://@host:port/db \
        -e passport_vaptcha_vid=xxx -e passport_vaptcha_key=xxx \
        -e passport_upyun_bucket=test -e passport_upyun_username=test -e passport_upyun_password=test \
        -e passport_email_useraddr=xxx -e passport_email_userpass=xxx -e passport_email_smtpserver=xxx -e passport_email_smtpport=465 -e passport_email_smtpssl=true \
        -e key=value...... \
        registry.cn-beijing.aliyuncs.com/staugur/passport:v1.0.3 [或自行打包时设置的镜像名]
