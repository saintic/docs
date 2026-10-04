.. _rtfd-v2-overview:

======
概述
======

rtfd v2 是一个自托管的 **Sphinx 文档构建与托管服务**\ ，以单个 Go 二进制程序形式提供。
你给出一个 Git 仓库（GitHub / Gitee）地址，rtfd 拉取源码、按语言 / 分支（版本）用
Sphinx 构建 HTML 文档，写入关系型数据库元数据并交由 Caddy 静态托管，同时提供
CLI、HTTP API、Git Webhook、GitHub App 自动注册 webhook 与文档状态徽章等能力。

类似于 ``readthedocs.org`` 提供的服务，但定位为轻量自用 / 备用的文档构建工具。

Badge: |Document Status|

.. |Document Status| image:: https://hub.saintic.com/rtfd/saintic-docs/badge
    :target: https://docs.saintic.com/rtfd/

Go doc: |Go Reference|

.. |Go Reference| image:: https://pkg.go.dev/badge/pkg.tcw.im/rtfd/v2.svg
    :target: https://pkg.go.dev/pkg.tcw.im/rtfd/v2

GitHub: https://github.com/staugur/rtfd

.. note::

    rtfd 早期用 Python 编写（文档见 :ref:`rtfd-py-overview`），后用 Golang 重构为 v1
    （Redis 存储 + Nginx 托管，历史文档见 :doc:`/rtfd/index`）。

    当前 **rtfd v2** 在 v1 基础上做了存储与托管的整体重构：

    - 元数据由 **Redis** 改为 **关系型数据库**\ （sqlite / mysql / pgsql，默认 sqlite，纯 Go 驱动，无需外部服务）；
    - 文档托管由 **Nginx** 改为 **Caddy**\ （自动 HTTPS、通配符证书、自定义域名免手动配证书）；
    - HTTP API 鉴权升级为动态 **HMAC-SHA256** 签名（原 v1 为 ``md5(secret)`` 静态头）；
    - GitHub App 由较早的 HMAC 校验改为 **RS256 JWT** 身份（App ID + 私钥签 JWT 换 installation token）。

.. _rtfd-v2-features:

功能
======

- 单二进制分发，配置依靠 ini 文件，构建时也支持仓库内 ``.rtfd.ini`` 覆盖构建参数
- 元数据用关系型数据库（sqlite 默认，mysql / pgsql 可选），sqlite 场景下无需任何外部服务
- 文档托管用 Caddy，默认自动 HTTPS（含通配符证书），支持自定义域名（证书由 Caddy 自动申请 / 续期）
- 文档项目原生支持多语言（翻译）与多版本（分支 / 标签），页面右下角 ``rtfd.js`` 挂件可切换
- 支持 webhook 触发、文档构建状态徽章、单版本（single）站点
- 允许 GitHub、Gitee 公开仓库与私有仓库（私有仓在 URL 内嵌 ``username:password``\ ）
- GitHub App 可在创建 / 删除项目时自动注册、清理仓库 webhook

目前相对于 readthedocs 不足的特性是：

- 不支持生成 PDF、EPUB
- 不支持添加翻译版本（翻译版本要求直接包含在文档中）
- 不支持设置子项目、构建时环境变量等

.. _rtfd-v2-install:

安装
======

rtfd v2 仅支持 **Linux** 操作系统（测试过 CentOS/RHEL、Ubuntu 系列），不可用于 macOS、Windows。

除了二进制本身，运行环境还需要：

- **bash**\ ：构建脚本运行环境
- **git**\ ：克隆文档仓库
- **python3.10+**\ ：含 ``pip``\ 、``virtualenv`` 模块（支持配置多版本，已移除 Python 2）
- **Caddy**\ ：静态托管并自动申请证书

元数据存储使用关系型数据库（sqlite / mysql / pgsql，默认 sqlite），sqlite 场景下无需额外服务；
如需使用 GitHub App 功能，则需能访问 GitHub API。

- 使用编译好的可执行程序（推荐）：

  .. code-block:: bash

    version=2.0.0
    wget -c https://github.com/staugur/rtfd/releases/download/v${version}/rtfd.${version}-linux-amd64.tar.gz
    tar zxf rtfd.${version}-linux-amd64.tar.gz
    mv rtfd ~/bin/
    rtfd -v

- 使用源码编译（要求 Golang 1.26+）：

  .. code-block:: bash

    git clone https://github.com/staugur/rtfd && cd rtfd
    make build
    mv bin/rtfd ~/bin/
    rtfd -v

  或使用 ``go get`` 安装指定正式版本：

  .. code-block:: bash

    go get -u pkg.tcw.im/rtfd/v2      # 可使用 @tag 安装某个正式版本，如 @v2.0.0
    mv ~/go/bin/rtfd ~/bin/
    rtfd -v

需要注意，rtfd 二进制文件需要放到 ``PATH`` 环境变量下，因为内部会调用此命令。

安装完成后，请继续阅读 :ref:`rtfd-v2-usgae` 准备配置文件与依赖环境。
