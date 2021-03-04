.. _rtfd-faq:

=========
其他问题
=========

.. _rtfd-faq-build-progress:

构建流程
==========

- ``rtfd --init`` 初始化服务

    生成程序配置文件

- ``rtfd project create --url xxx {ProjectName}`` 新增文档项目

    在本地数据库保存文档项目数据、初始化文档的nginx配置文件

- ``rtfd build {ProjectName}`` 或api或webhook触发文档构建

    通过 .rtfd-builder.sh 脚本构建生成实际的HTML页面，它接收构建名称、分支和程序配置文件，
    通过sphinx生成文档。

- 访问文档

    文档域名是： ``文档项目名.托管域名后缀`` ，如果不是单一版本，首页会重定向到
    /default_language/latest，另外，页面会请求rtfd.js生成导航按钮。

    如果有自定义域名，也可以访问，不过默认域名目前不会自动跳转到自定义域名。

.. _rtfd-faq-custom-domain:

自定义域名
============

如果是新建项目可以直接使用 `--domain` 选项；如果是已有项目追加自定义域名，请
更新 `domain` 字段，例如：

.. code-block:: bash

    rtfd p update -t domain:my-domain {ProjectName}

如果想支持HTTPS，请准备好域名的证书文件。如果是新建项目，使用选项
`--sslcrt 证书公钥 --sslkey 私钥`；如果是已有项目，请更新项目信息，例如：

.. code-block:: bash

    rtfd p update -t domain:my-domain,sslcrt:证书公钥,sslkey:私钥文件 {ProjectName}

.. tip::

    每个文档都有默认域名，默认域名及是否支持https也取决于程序配置文件。
    另，如果有HTTPS配置，那么HTTP会跳转到HTTPS，不过默认域名不会跳转到自定义域名。

已有自定义域名，但想要删除的话，也是可以的，需要更新项目，将 domain 设为 false 即可。

如果自定义域名要取消https，更新项目，将 ssl 设为 false 即可。

如果自定义域名支持https，那么证书是有到期时间的，请自行更新项目。

.. _rtfd-faq-docker:

是否支持docker
================

不集成dockerfile，不过是可以，但是很复杂，需要将nginx、python环境打包进去，启动时将数据
目录和配置文件映射进去。

.. _rtfd-faq-online-api-daemon:

正式环境启动API服务脚本
=========================

源码仓库 `scripts <https://github.com/staugur/rtfd/tree/master/scripts>`_ 目录下
有几个脚本用来后台启动api服务。

可以通过nohup（start.sh）、supervisor、systemd（rtfd.service）等方式。
