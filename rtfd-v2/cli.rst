.. _rtfd-v2-usgae:

===========
命令行使用
===========

.. _rtfd-v2-usgae-require:

依赖
=====

rtfd v2 是一个命令行程序，需要一份 ini 配置文件指导其工作，运行期依赖操作系统内的环境是
**bash、git、python3（含 pip、virtualenv，支持多版本，已移除 Python 2）、Caddy**\ 。

元数据存储使用关系型数据库（sqlite / mysql / pgsql，默认 sqlite，纯 Go 驱动，无需外部服务）；
如需 GitHub App 功能则需能访问 GitHub API。

Caddy
-----

Sphinx 生成的 HTML 文档由 Caddy 静态托管。rtfd 会按全部项目汇总渲染一份 Caddyfile，
并热加载（``caddy reload``\ ）使其生效，无需重启。

关于托管域名后缀：需要配置一个域名后缀（如 ``rtfd.vip``\ ），文档项目创建时会依据项目名与
该后缀生成默认域名（``{name}.{dn}``\ ），因此这个后缀域名需要有默认解析（如 ``*.rtfd.vip``
的 A / CNAME 记录指向 rtfd 运行的服务器）。HTTPS 证书由 Caddy 自动申请（含通配符），无需手动配置。

Python
------

需要 python3.10+，且对应版本已安装 ``pip`` 与 ``virtualenv`` 模块；可在配置文件 ``[py]``
分区定义多个可用版本（如 ``3``\ 、``3.10``\ 、``3.12``\ ），构建时按项目设置的版本号创建虚拟环境。

数据库
------

rtfd 使用关系型数据库存储项目元数据，默认 sqlite（无需外部服务）；也可配置 mysql / pgsql。
sqlite 文件建议放在 ``base_dir`` 内（``dsn = %(base_dir)s/rtfd.db``\ ）并纳入备份。

.. _rtfd-v2-usgae-workflow:

工作流程
==========

rtfd 所有操作均为命令行执行，通过全局选项 ``-c/--config`` 读取配置文件（数据、存储等）。

典型流程：

1. 先初始化配置文件（仅首次）：``rtfd --init`` 生成初始配置
2. 创建文档项目：``rtfd project create --url xxx {ProjectName}``\ （生成项目配置与默认域名）
3. 构建文档：``rtfd build {ProjectName}``\ （或经 API / webhook 触发），生成 HTML 页面
4. 启动 API 服务：``rtfd api``\ ，否则访问页面时无法加载 ``rtfd.js`` 导航挂件
5. 通过默认域名（或自定义域名）访问文档

.. _rtfd-v2-usgae-quickstart:

快速开始
=========

安装完成后，可直接使用 ``rtfd`` 命令。帮助信息可用 ``-h/--help`` 查看，版本用 ``-v/--version``\ ，
构建信息用 ``-i/--info``\ 。

.. code-block:: bash

    $ rtfd -v
    2.0.0

    $ rtfd -h
    Build, read your exclusive and fuck docs.

    Usage:
      rtfd [flags]
      rtfd [command]

    Available Commands:
      api         运行API服务
      build       构建文档
      cfg         查询配置文件内容
      project     文档项目管理（可用别名p代替project）
      help        Help about any command

    Flags:
      -v, --version         显示版本
      -i, --info            显示版本与构建信息
          --init            初始化rtfd配置文件
      -c, --config string   rtfd配置文件 (default "$HOME/.rtfd.cfg")
      -h, --help            help for rtfd

    Use "rtfd [command] --help" for more information about a command.

以上子命令也可使用 ``-h/--help`` 查看各自的帮助。

准备好依赖环境（bash + git + python3 + Caddy + 数据库）后，即可开始使用。

.. _rtfd-v2-usgae-quickstart-no1:

一、初始化配置文件
--------------------

rtfd 任何操作都需要配置文件，默认读取 **$HOME/.rtfd.cfg**\ ，也可通过 ``-c/--config`` 指定；
还可用环境变量 ``RTFD_CFG`` 指定配置文件路径。

使用 ``rtfd --init`` 生成初始配置文件（不会覆盖已有文件）。生成后会读取以下环境变量预填
两个必填项，未提供则留空并在输出中提示手动设置：

- ``RTFD_API_SERVER_URL`` → ``[api] server_url``\ （对外可达地址，供 webhook 回跳与挂件注入）
- ``RTFD_CADDY_DN`` → ``[caddy] dn``\ （文档默认域名后缀）

请自行修改生成的配置文件（ini 格式，大部分选项可保持默认，按注释修改即可）。
可在线查看 `rtfd.cfg <https://github.com/staugur/rtfd/blob/master/assets/rtfd.cfg>`_ 模板。

配置中无默认值、需填写的是 ``[database]`` 与 ``[caddy] dn``\ ：数据库的存储类型与连接串、
文档默认域名后缀；详细说明见 :ref:`rtfd-v2-config`。

.. _rtfd-v2-usgae-quickstart-cfg:

查看程序配置信息
^^^^^^^^^^^^^^^^^

初始化后，可通过 ``rtfd cfg`` 查询配置文件内容。

.. code-block:: bash

    $ rtfd cfg -h
    查询配置文件内容

    Usage:
      rtfd cfg [flags]

    Flags:
      -h, --help   help for cfg
      -j, --json   使用JSON格式显示结果

    Global Flags:
      -c, --config string   rtfd配置文件 (default "$HOME/.rtfd.cfg")

``cfg`` 读取配置文件，返回映射（go map）格式；``-j/--json`` 可格式化为 JSON（便于 jq 排版）。
可携带两个位置参数：第一个为 section（段名），第二个为该 section 下的字段。

.. code-block:: bash

    $ rtfd cfg default -j
    {
      "base_dir": "/rtfd",
      "default_branch": "master",
      "unallowed_name": ""
    }

    $ rtfd cfg caddy -j
    {
      "dn": "rtfd.vip",
      "auto_https": "on",
      "static_expires": "3600",
      "html_nocache": "on"
    }

.. _rtfd-v2-usgae-quickstart-no2:

二、项目管理
---------------

文档项目需要先创建、再构建，构建成功才能访问。``project`` 子命令（别名 ``p``\ ）用来管理项目，
包含新建、查询、更新、删除、转储等子命令。

.. code-block:: bash

    $ rtfd p -h
    文档项目管理

    Usage:
      rtfd project [flags]
      rtfd project [command]

    Aliases:
      project, p

    Available Commands:
      create      创建文档项目
      get         显示文档项目信息
      list        列出所有文档项目信息
      remove      删除文档项目
      transfer    转储（导入、导出）文档项目
      update      更新文档项目配置

    Flags:
      -h, --help   help for project

    Global Flags:
      -c, --config string   rtfd配置文件 (default "$HOME/.rtfd.cfg")

.. _rtfd-v2-usgae-quickstart-project-create:

新建项目
^^^^^^^^^^^^^

通过 project 子命令 create：``rtfd project create --{Flags} {ProjectName}``

.. code-block:: bash

    $ rtfd p create -h
    创建文档项目

    Usage:
      rtfd project create [flags]

    Flags:
      -u, --url string           文档项目的git仓库地址，如果是私有仓库，请在url协议后携带编码后的 username:password
          --latest string        latest所指向的分支 (default "master")
          --single               是否为单一版本
      -s, --sourcedir string     实际文档文件所在目录，目录路径是项目的相对位置 (default "docs")
      -l, --lang string          文档语言，支持多种，以英文逗号分隔 (default "en")
      -v, --version string       构建文档所用的Python版本，须在 [py] 分区已定义（如 3、3.10、3.12）
      -r, --requirement string   需要安装的依赖包需求文件（文件路径是项目的相对位置），支持多个，以英文逗号分隔
          --install              是否需要安装项目（pip install .）
      -i, --index string         指定pip安装时的pypi源
      -b, --builder string       Sphinx构建器，可选html、dirhtml、singlehtml (default "html")
          --secret string        Api/Webhook密钥
          --domain string        自定义域名（HTTPS由Caddy自动申请）

    Global Flags:
      -c, --config string   rtfd配置文件 (default "$HOME/.rtfd.cfg")

``url`` 是必填项（文档源文件 git 仓库地址）。新建项目时即可设置大部分字段，另有少量字段只能
通过 ``update`` 更新。

例如，新建一个名为 ``test`` 的项目，文档在仓库的 ``docs`` 目录下：

.. code-block:: bash

    $ rtfd p create -u https://github.com/user/repo test

.. note::

    新建项目的 ``url`` 支持 GitHub 和 Gitee，可为公开或私有仓库。私有仓库的 url 格式为：
    ``https://username:password@git-service-provider.com/username/repo``\ ，其中
    ``username`` 和 ``password`` 如有特殊符号需先进行 URL 编码！

部分选项说明：

- ``-l/--lang`` 指定文档采用的国际语言，可有多个（翻译版本，逗号分隔），第一个为默认语言。
- ``--domain`` 用来自定义域名（不含协议，如 ``docs.hello.com``\ ），HTTPS 证书由 Caddy 自动
  申请 / 续期，无需手动提供证书文件。自定义域名需在 DNS 处添加 CNAME 指向项目默认域名。
- ``--secret`` 用于 API / webhook 加密，详见 :ref:`rtfd-v2-api-docs`。

.. _rtfd-v2-usgae-quickstart-project-get:

查询项目
^^^^^^^^^^^^^

``list`` 与 ``get`` 若无错误，返回 JSON 字符串（可用 jq 排版）。

1. ``rtfd p list`` 列出所有文档项目名，可用 ``-v/--verbose`` 查看详细信息。

2. ``rtfd p get {ProjectName}`` 查看单个项目详情，可用 ``-b/--build`` 显示构建结果。

   ``get`` 支持隐藏查询：``rtfd p get {ProjectName}:{Field}`` 查看单个字段值（Field 区分大小写，
   也可不区分）；``rtfd p get {ProjectName}:Meta@{Key}`` 查询 Meta 中的具体字段。

.. code-block:: bash

    $ rtfd p get {ProjectName}:Meta@excluded_branch

.. _rtfd-v2-usgae-quickstart-project-update:

更新项目
^^^^^^^^^^^^^

通过 project 子命令 update：``rtfd project update --{Flags} {ProjectName}``

.. code-block:: bash

    $ rtfd p update -h
    更新文档项目配置

    第一种方式，通过 text 选项（-t）：

    可更新字段（Field）：url、latest、version、single、source（文档源目录）、lang、
    requirement（依赖文件）、install、index（pypi源）、builder、shownav（是否显示导航）、
    hidegit（导航中是否隐藏git信息）、secret、domain（自定义域名）、meta（额外KV，格式 key=value）。

    格式：Field:Value,Field:Value,...，分隔符可用 -s/--sep 设置（默认 ":"）。
    示例：

        $ rtfd p update -t url=https://github.com/USER/REPO,hidegit=true -s = test
        $ rtfd p update -t meta:excluded_branch=test|dev test

    第二种方式，通过 file 选项（-f）：

    编写 .rtfd.ini 规则文件放到源码仓库中，构建时 rtfd 读取此文件覆盖系统存储配置进行参数化构建。
    可更新字段较少，仅为构建期参数，参考 :ref:`rtfd-v2-config-docs-project`。

    Usage:
      rtfd project update [flags]

    Flags:
      -f, --file string   更新规则文件
      -h, --help          help for update
      -s, --sep string    设定 Field、Value 之间的分隔符 (default ":")
      -t, --text string   更新规则文本，格式是 Field:Value,Field:Value

    Global Flags:
      -c, --config string   rtfd配置文件 (default "$HOME/.rtfd.cfg")

.. note::

    - bool 类型仅当值为 ``1``\ 、``true``\ 、``on`` 时表示 true，其他为 false；
    - ``domain`` 字段值为 ``0``\ 、``false``\ 、``off`` 时表示取消自定义域名；
    - 部分字段（如 lang、latest、domain）更新后需重新渲染 Caddy 配置，会在下次访问 / 构建生效；
    - Meta 保留字段（以 ``_`` 开头）由系统使用，用户常用 ``excluded_branch``\ （排除构建的分支，
      分隔符取 Meta ``excluded_sep``\ ，缺省回退 ``_sep``\ ，再缺省 ``|``\ ）。

.. _rtfd-v2-usgae-quickstart-project-remove:

删除项目
^^^^^^^^^^^^^

通过 project 子命令 remove：``rtfd project remove {ProjectName}``

.. warning::

    注意：此操作会删除已生成的文档页面、Caddy 站点配置及数据库记录，属于危险操作！

.. _rtfd-v2-usgae-quickstart-project-transfer:

转储项目
^^^^^^^^^^^^^

通过 project 子命令 transfer（别名 ``t``\ ）：``rtfd project transfer --{Flags} {ProjectName}``

可将项目配置导出为 base64 编码字符串，在另一台服务器导入，或在本地导入（相当于复制项目，需设别名）。

.. code-block:: bash

    $ rtfd p t -h
    转储（导入、导出）文档项目

    导出：
        $ rtfd p t -e <NAME>
        // Output: base64-encoded

    导入：
        $ rtfd p t -i <base64-encoded>
        // 名称已存在时会失败，可设置别名覆盖原名称
        $ rtfd p t -i <base64-encoded> <New-Name>

本地复制项目示例：

.. code-block:: bash

    $ rtfd p t -i $(rtfd p t -e <OldName>) <NewName>

.. _rtfd-v2-usgae-quickstart-no3:

三、构建文档
---------------

通过 ``rtfd build`` 子命令在命令行构建文档，支持 ``-b/--branch`` 设置构建的分支或标签（默认 latest），
``--debug``\ （``bash -x``\ ）与 ``--log``\ （行日志）选项。

构建也可经 API 或 webhook 触发，详见 :ref:`rtfd-v2-api-docs`。

构建流程与生成的目录布局见 :ref:`rtfd-v2-faq-build-progress`。

四、启动API服务
---------------

``rtfd api [--host] [--port]``

rtfd.js 挂件由程序内嵌（``go:embed``\ ）并通过 API 的 ``/rtfd/assets/rtfd.js`` 提供服务，
构建时自动注入到文档页，无需额外 CDN。详见下一篇 :ref:`rtfd-v2-api`。
