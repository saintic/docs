.. _rtfd-usgae:

===========
命令行使用
===========

.. _rtfd-usgae-require:

依赖
=====

rtfd本身仅仅是一个命令行程序，其需要一份配置文件来指导说明它如何工作，而它依赖操作系统内的
环境是nginx、python、redis。

Nginx
-----

Sphinx生成HTML文档，Nginx用来接收web请求，要求版本不小于1.15.0，且有一个托管域名，
另外用户需要有权限执行 `nginx` 相关命令，可能需要 sudo 权限。

关于托管域名需要说明下，需要的是一个域名后缀，文档项目创建时会依据文档项目名和托管域名
生成文档对应的域名，所以这个域名要求有一个默认解析。

比如托管域名是 ``rtfd.vip`` ，需要添加一条 ``*.rtfd.vip`` 的A记录或CNAME记录指向rtfd
运行的这台服务器。

如果要开启https，还需要证书，要求支持通配符。

Python
------

Python要求python2和python3两个版本，且都安装了virtualenv模块，否则无法使用。

安装virtualenv模块可以使用命令： `python -m pip install virtualenv`

Redis
------

rtfd需要redis数据库，本来是要用一个内嵌型的DB，可是写完了测试发现严重问题，还是决定用redis
存储数据了，版本的话，2.x、3.x、4.x都可以，更高版本应该也没问题。

redis要开启AOF，避免数据丢失！

.. _rtfd-usgae-workflow:

工作流程
==========

rtfd所有操作均为命令行执行，通过全局选项 `-c/--config` 读取配置文件（数据、存储等）。

使用时先初始化配置文件（仅首次使用时），
然后创建文档项目（生成一系列项目配置，最重要的是默认域名），
之后构建文档生成HTML页面（参考 FAQ :ref:`构建流程 <rtfd-faq-build-progress>` 说明），
此时可以通过默认域名访问文档了。

启动API服务，否则访问页面时无法加载 rtfd.js 初始化导航按钮（位于右下角，
展开包含语言、版本、Git等）。

.. _rtfd-usgae-quickstart:

快速开始
=========

rtfd安装完成后，可直接使用 `rtfd` 命令，它的帮助信息可以使用 `-h/--help`
查看，它的版本可以使用 `-v/--version` 获得，详细信息可以使用 `-i/--info` 获得。

.. code-block:: bash

    $ rtfd -v
    1.0.0

    $ rtfd -i
    v1.0.0 commit/41accab built/2021-03-04T03:24:02Z

    $ rtfd -h
    Build, read your exclusive and fuck docs.

    Usage:
      rtfd [flags]
      rtfd [command]

    Available Commands:
      api         运行API服务
      build       构建文档
      cfg         查询配置文件的配置内容
      project     文档项目管理（可用别名p代替project）
      help        Help about any command

    Flags:
      -v, --version         显示版本
      -i, --info            显示版本与构建信息
          --init            初始化rtfd配置文件
      -c, --config string   rtfd配置文件 (default "/root/.rtfd.cfg")
      -h, --help            help for rtfd

    Use "rtfd [command] --help" for more information about a command.

以上是帮助信息，支持的子命令也可以使用 `-h/--help` 显示帮助。

安装完rtfd，准备好依赖环境（nginx+python），就可以开始使用了。

.. _rtfd-usgae-quickstart-no1:

一、初始化配置文件
--------------------

如上所述，rtfd任何操作都需要一个配置文件来指导它，默认读取 **$HOME/.rtfd.cfg** ，
是用户级的，所以切换不同用户，rtfd的数据都会不一样！

配置文件使用全局选项 `-c/--config` 指定，使用 `rtfd --init` 可以生成初始配置文件，
，生成文件路径也是 `-c` 指定，不会覆盖，如果已有则会直接退出。

请自行修改生成的配置文件（默认 $HOME/.rtfd.cfg），ini格式，大部分选项可保持默认，根据
注释修改即可。

可以在线查看 `rtfd.cfg <https://github.com/staugur/rtfd/blob/master/assets/rtfd.cfg>`_ 模板。

配置文件中，无默认值的需要填写的是 redis和nginx.dn 值，这是存储数据所用 redis
和文档默认域名后缀，详细解释都有注释，另外，后面文档也会介绍。

.. note::

    配置文件需要redis信息，产生的数据存储到redis中，注意要开启redis的AOF让数据落盘，
    避免丢失！

.. _rtfd-usgae-quickstart-no2:

二、项目管理
---------------

类似于readthedocs，文档项目需要先创建，再构建，构建成功才能访问。

project子命令用来管理项目，其别名是p，又包含新建、查询、更新等子命令，这个是常用的，
因为目前项目管理操作只能使用命令行。

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
      update      更新文档项目配置

    Flags:
      -h, --help   help for project

    Global Flags:
      -c, --config string   rtfd配置文件 (default "/root/.rtfd.cfg")

    Use "rtfd project [command] --help" for more information about a command.

.. _rtfd-usgae-quickstart-project-create:

新建项目
^^^^^^^^^^^^^

通过project子命令create： `rtfd project create --{Flags} {ProjectName}`

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
      -v, --version uint8        构建文档所用的Python版本，2或3 (default 3)
      -r, --requirement string   需要安装的依赖包需求文件（文件路径是项目的相对位置），支持多个，以英文逗号分隔
          --install              是否需要安装项目
      -i, --index string         指定pip安装时的pypi源
      -b, --builder string       Sphinx构建器，可选html、dirhtml、singlehtml (default "html")
          --secret string        Webhook密钥
          --domain string        自定义域名
          --sslcrt string        自定义域名的SSL证书公钥
          --sslkey string        自定义域名的SSL证书私钥
          --before string        构建前的钩子命令
          --after string         执行构建成功后的钩子命令
      -h, --help                 help for create

    Global Flags:
      -c, --config string   rtfd配置文件 (default "/root/.rtfd.cfg")

create新建项目时， `url` 选项是必须有的，是文档源文件git仓库地址，其他根据构建需要设置，
需要说明的是，一个文档项目通过create可以设置大部分字段，但还有一小部分只能用过update子命令更新。

例如，新建一个名叫test的项目，文档在仓库的docs目录下：

.. code-block:: bash

    $ rtfd p create -u https://github.com/user/repo test

.. note::

    新建项目时url支持GitHub和Gitee，可以是公开仓库或私有仓库，私有仓库的url格式
    是：https://username:password@git-service-provider.com/username/repo

    username和password如果有特殊符号需要先进行url编码！

特别说明下部分选项：

选项 `-l/--lang` 指定文档采用的国际语言，可以有多个（翻译版本，逗号分隔），第一个语言即默认语言。

选项 `--domain` 用来自定义域名，不包含协议，比如 test.example.com，
如果自定义域名想要支持HTTPS，请自行申请证书并保存到服务器本地，
通过选项 `--sslcrt 证书公钥文件 --sslkey 私钥文件` 开启HTTPS。

你的自定义域名需要在在DNS服务商处添加CNAME解析到项目默认域名，比如新建test项目，默认域名假如
是test.example.com，自定义域名是docs.hello.com，则需要添加DNS解析：

docs.hello.com -> CNAME -> test.example.com

选项 `--before` 仅用文档构建前，在安装完文档项目的依赖后，sphinx-build命令执行前；
选项 `--after` 仅在sphinx-build命令构建完成后，两者均要求为单条系统命令，不能包含
管道、与、或等，若要用多条命令组合，请了解下eval（温馨提示：命令在子进程运行，
请注意对系统安全性）！

选项 `--secret` 用于 api webhook 加密，在后文 api 一节中说明。

.. _rtfd-usgae-quickstart-project-get:

查询项目
^^^^^^^^^^^^^

位于project后的两条子命令，如果没有错误，返回的是 JSON 格式字符串，可以用jq命令排版。

1. `rtfd p list` 列出所有文档项目名，可用 `-v/--verbose` 选项查看详细信息。

2. `rtfd p get {ProjectName}` 查看单个文档项目详细信息，可用 `-b/--build` 显示构建结果。

  get子命令有隐藏的查询功能，通过 `rtfd p get {ProjectName}:{Filed}` 格式（无 -b 选项），
  可以查看配置中单个字段（Field）的值，字段名 Field 从get返回的详细信息查看，区分大小写！

.. _rtfd-usgae-quickstart-project-update:

更新项目
^^^^^^^^^^^^^

通过project子命令update： `rtfd project update --{Flags} {ProjectName}` 即可更新
项目配置信息。

`rtfd p update -h` 提示信息很丰富，

.. code-block:: bash

    更新文档项目配置

    第一种方式，通过 text 选项：

    仅可更新部分字段，参考如下列表（即Field，解释说明处小括号为字段类型，无则默认为string）：

    url：        文档项目的git仓库地址
    latest：     latest所指向的分支
    version：    构建文档所用的Python版本，2或3（int）
    single：     是否单一版本（bool）
    source：     文档源文件所在目录
    lang：       文档语言
    requirement：依赖包需求文件，支持多个，以逗号分隔
    install：    是否安装项目（bool）
    index：      pypi源
    builder：    sphinx构建器
    shownav：    是否显示导航（bool）
    hidegit：    导航中是否隐藏git信息（bool）
    secret：     webhook密钥
    domain：     自定义域名
    sslcrt：     自定义域名开启HTTPS时的证书公钥
    sslpri：     自定义域名开启HTTPS时的证书私钥
    before：     构建前的钩子命令
    after：      执行构建成功后的钩子命令

    可一次更新一个或多个字段，格式是 -> Field:Value,Field:Value,...,Field:Value
    分隔符可用 sep 选项设置，更新成功或失败的字段均会打印。
    请按照字段类型（如int、bool）填写值，否则可能导致异常。
    请注意：
        # bool类型仅当值为1、true、on时表示true，其他表示false
        # domain字段值为0、false、off时表示取消自定义域名（不更改SSL相关配置）
        # 额外字段ssl（不在列表中）值为0、false、off时表示取消自定义域名SSL
        # 部分更新失败的字段亦可能已造成破坏性更改（如lang、latest、domain）
        # 部分字段仅在下一次构建时生效

    第二种方式，通过 file 选项：

    通常用于构建时更新，编写 rtfd.ini 规则文件放到源码仓库中，在构建时 rtfd 会读取此文件，
    结合系统存储配置（优先级低于规则文件）进行参数化文档构建。

    不过相对于第一种方式，此方式可更新字段较少，仅为构建时参数。

    Usage:
      rtfd project update [flags]

    Flags:
      -f, --file string   更新规则文件
      -h, --help          help for update
      -s, --sep string    设定 Field、Value 之间的分隔符 (default ":")
      -t, --text string   更新规则文本，格式是 Field:Value,Field:Value

    Global Flags:
      -c, --config string   rtfd配置文件 (default "/root/.rtfd.cfg")

更新确实复杂，所以提示很多，两种更新方式，一是 `-t text` 按照格式更新，示例：

.. code-block:: bash

    $ rtfd p update -t url=https://github.com/USER/REPO,hidegit=true -s = test

    $ rtfd p update -t before:"make build-css" test

注意，目前大部分选项不能取消/置空。

第二种方式按 `-f file` 更新，这个一般用在文档构建时，参考 :ref:`rtfd-config-docs-project`

.. _rtfd-usgae-quickstart-project-remove:

删除项目
^^^^^^^^^^^^^

通过project子命令remove： `rtfd project remove {ProjectName}` 即可删除。

.. warning::

    注意：这个操作会删除已生成的文档页面、Nginx配置等，属于危险操作！

.. _rtfd-usgae-quickstart-no3:

三、构建文档
---------------

通过 `rtfd build` 子命令，使用命令行构建文档，支持一个 `-b/--branch` 选项设置构建的
分支或标签，默认是latest

构建文档还可以通过API触发，也可以webhook触发，参考 :ref:`rtfd-api-docs`


四、启动API服务
---------------

`rtfd api`

请看下一篇。
