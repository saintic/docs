.. _rtfd-py-faq:

=========
其他问题
=========

.. _rtfd-py-faq-build-progress:

构建流程
==========

- ``rtfd init`` 初始化服务

    生成程序级配置文件

- ``rtfd project -a create --url xxx your-docs-name`` 新增文档项目

    在本地保存文档项目数据、初始化文档的nginx配置文件

- ``rtfd build your-docs-name`` 或api或webhook触发文档构建

    通过builder.sh脚本生成实际的HTML页面，这个脚本位于rtfd的scripts目录下，它接收
    构建名称、分支和程序配置文件，通过sphinx生成文档。

- 访问文档

    文档域名是： ``文档项目名.托管域名后缀`` ，如果不是单一版本，首页会重定向到
    /default_language/latest，另外，页面会请求rtfd.js生成导航按钮。

.. _rtfd-py-faq-static:

静态资源
==========

位于rtfd的static目录，目前来说，一般不会改动了，已经上传到CDN，保持为最新版本，地址
是： ``https://static.saintic.com/rtfd/``

三个静态文件rtfd.js、tipped.css、tipper.js，第一个是在文档页面中初始化导航的，它是
builder.sh脚本在构建时附加给sphinx配置文件的js脚本，其本身包含了一些额外参数，访问
文档页面时，它会调用后两个文件，根据api访问数据以生成导航按钮，包括不同语言、版本等。

.. _rtfd-py-faq-multi-rtfd:

多个rtfd服务
==============

rtfd子命令都支持一个 `-c / --config` 选项指定程序配置文件，默认是$HOME/.rtfd.cfg，
指定不同配置文件会有不同效果，API可以通过设置一个名叫 ``RTFD_CFG`` 的配置项来指定
配置文件。

.. _rtfd-py-faq-custom-domain:

自定义域名
==============

v0.3.0支持自定义域名（版本有bug，请更新到v0.3.1+）。

如果是新建项目可以直接使用 `--custom-domain` 选项；如果是已有项目追加自定义域名，请
更新 `custom_domain` ，例如：

.. code-block:: bash

    rtfd project -a update -ur '{"custom_domain":"domain-name"}' docs-project

如果想支持HTTPS，请准备好域名的证书文件。如果是新建项目，使用选项
`--ssl --ssl-crt 证书公钥 --ssl-key 私钥`；如果是已有项目，请更新项目信息，例如：

.. code-block:: bash

    rtfd project -a update -ur '{"custom_domain":"domain-name","ssl":true,"ssl_crt":"证书公钥文件","ssl_key":"私钥文件"}' docs-project

.. note::

    每个文档都有默认域名，默认域名及是否支持https也取决于程序配置文件。
    另，如果有HTTPS配置，那么HTTP会跳转到HTTPS，不过默认域名不会跳转到自定义域名。

已有自定义域名，但想要删除的话，也是可以的，需要更新项目，将custom_domain设为false。

如果自定义域名支持https，那么证书是有到期时间的，请自行更新项目。
