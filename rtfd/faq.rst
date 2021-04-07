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

给一个基础的dockerfile示例：

.. code-block:: dockerfile

    # -- build dependencies with alpine & go1.16+ --
    FROM golang:1.16.0-alpine3.13 AS builder

    ENV GO111MODULE=on \
        CGO_ENABLED=0 \
        GOOS=linux \
        GOARCH=amd64

    WORKDIR /build

    COPY . .

    RUN go env -w GOPROXY=https://goproxy.cn,direct && \
        go build -ldflags "-s -w -X tcw.im/rtfd/cmd.built=$(date -u '+%Y-%m-%dT%H:%M:%SZ')" && chmod +x rtfd

    # run application with a small image
    FROM scratch

    COPY --from=builder /build/rtfd /bin/

    WORKDIR /rtfd

    # volume bind /rtfd.cfg
    ENTRYPOINT ["rtfd", "api", "-c", "/rtfd.cfg"]

.. _rtfd-faq-online-api-daemon:

正式环境启动API服务脚本
=========================

源码仓库 `scripts <https://github.com/staugur/rtfd/tree/master/scripts>`_ 目录下
有几个脚本用来后台启动api服务。

可以通过nohup（start.sh）、supervisor、systemd（rtfd.service）等方式。

.. _rtfd-faq-ghapp:

支持 github apps
=================

.. versionadded:: 1.2.0

A GitHub App can act on its own behalf, taking actions via the API directly instead of impersonating a user.

上述是GitHub官方对 GitHub Apps 的一个描述，简单说就是 Github Apps 可以通过 Github
提供的认证信息去调用 Github API，注意区别于 OAuth Apps，两者区别很大。

rtfd适配了 GitHub Apps(以下简称ghapp)。

流程
^^^^^^

rtfd在创建项目时指定 git url 可以解析出用户名（仅支持github），此用户如果安装了ghapp，且
对应仓库已授权，便能调用 github api 自动添加 webhook，并在删除项目时同步删除 webhook。

如果已有项目，第一次安装ghapp时会遍历此用户在rtfd中的项目并添加webhook，以后删除项目也会
同步删除 webhook。

不过需要注意，ghapp授权的仓库取消授权后，rtfd删除对应仓库的项目时已无权限调用 github api，
即无法删除 webhook ！

使用
^^^^^^^

1. github apps 注册新应用

每个 GitHub 用户都可以 `创建 GitHub Apps <https://github.com/settings/apps/new>`_ ，
而rtfd创建它时要求如下（主要填写红色星号部分）：

- GitHub App name、描述、Homepage URL，随意

- Callback URL、Post installation不需要

- Webhook部分（Active保持勾选）

  Webhook URL是rtfd ghapp api公开接口地址，比如 https://xxx.com/rtfd/github/app

  Webhook secret暂不用设置，还没适配它（应该是 v1.2.1 适配）。

- 仓库权限部分

  Webhooks( Manage the post-receive hooks for a repository.) 只需要这一个读写权限！

最后是最底部，设置此 ghapp 属于谁，only this account还是开放，这看个人需要。

点击创建即可，参考截图：

.. image:: /_static/images/rtfd-ghapp-demo.png

2. 生成私钥

上述第一步创建后，跳转到应用配置页面，关注About部分 `App ID` （参考下图），
在底部 Private keys 处生成私钥。

.. image:: /_static/images/rtfd-ghapp-config.png

3. rtfd 配置文件

请安装 v1.2.0+ 版本的rtfd程序，配置文件新增一段（如果未初始化的话）：

.. code-block:: ini

    # GitHub Apps 配置
    [ghapp]

    ; 是否启动 GitHub Apps 功能，开启需设置为 on
    enable = off

    ; GitHub App Name 对应的 App ID, 也是apps全局唯一标识
    app_id =

    ; GitHub App 私钥文件路径，如，放到数据目录下： %(base_dir)s/ghapp.pem
    private_key =


其上是默认配置，开启ghapp需要修改： enable设为on, app_id和private_key第二步获取，
这个key是文件路径，不要写内容，文件上传到rtfd所在服务器上。
