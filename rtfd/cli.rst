.. _rtfd-usgae:

===========
命令行使用
===========

.. _rtfd-usgae-require:

依赖
=====

rtfd依赖的外部环境是nginx、python。

Nginx
-----

Sphinx生成HTML文档，Nginx用来接收web请求，要求版本不小于1.15.0，且有一个托管域名，
另外用户需要有权限执行 `nginx` 相关命令，比如 ``sudo nginx`` 。

关于托管域名需要说明下，需要的是一个域名后缀，文档项目创建时会依据文档项目名和托管域名
生成文档对应的域名，所以这个域名要求有一个默认解析。
比如托管域名是 ``rtfd.vip`` ，需要添加一条 ``*.rtfd.vip`` 的A记录或CNAME记录指向
Nginx服务器。

如果要开启https，还需要证书，要求支持通配符。

Python
------

Python要求python2和python3两个版本，且都安装了virtualenv模块，否则无法使用。

安装virtualenv模块可以使用命令： `python -m pip install virtualenv`

.. _rtfd-usgae-quickstart:

快速开始
=========

rtfd模块安装完成后，会在系统中生成一个 `rtfd` 命令，它的帮助信息可以使用 `-h/--help`
查看，它的版本可以使用 `-v/--version` 获得。

.. code-block:: bash

    $ rtfd -v
    0.4.2

在最初编写此文档时，rtfd版本0.2.0！

.. versionchanged:: 0.3.0

.. versionchanged:: 0.4.0

    - 构建钩子
    - 多选构建器
    - 前端导航和脚本、API消息接口等

.. versionchanged:: 0.4.2

    - api内部变更
    - 支持构建任意分支
    - 其他参见changlog

.. code-block:: bash

    $ rtfd -h
    Usage: rtfd [OPTIONS] COMMAND [ARGS]...

    Options:
        -v, --version
        -h, --help     Show this message and exit.

    Commands:
        api      以开发模式运行API
        build    构建文档
        cfg      查询配置文件的配置内容
        init     初始化rtfd
        project  文档项目管理

以上是帮助信息，支持5个子命令，子命令也可以使用 `-h/--help` 显示帮助。

安装完rtfd，准备好依赖环境，就可以开始使用了。

.. _rtfd-usgae-quickstart-no1:

一、初始化配置文件
--------------------

init子命令，这一步基本只用一次，在没有rtfd的配置文件时生成配置，如果已有则会直接退出。

使用 ``rtfd init -h`` 查看提示，大部分选项设置了默认值，请根据提示和配置模板填写。最
需要设置的是 ``-b/--basedir`` 选项，设置rtfd数据的基础目录，所有数据都会存放在此目录
下；配置文件的选项 ``-c/--config`` 强烈建议保持默认值，即 ``${HOME}/.rtfd.cfg`` ！
配置文件决定了数据目录，也就是说不同配置文件可以有不同数据目录，一个系统中可以存在多个
rtfd的服务。

另一个需要注意的选项是 ``--nginx-dn`` ，这是前面准备的托管域名，比如 ``rtfd.vip`` ！

注意到有两个选项 ``--nginx-ssl-crt和key`` ，其默认值有点特别，是个变量，其中
的 `g.base_dir` 即 `--basedir` ， `dn` 即 `--nginx-dn`

.. code-block:: bash

    $ rtfd init --help
    Usage: rtfd init [OPTIONS]

        初始化rtfd

    Options:
        --yes                           Confirm the action without prompting.
        -b, --basedir PATH              rtfd根目录
        -l, --loglevel [DEBUG|INFO|WARNING|ERROR]
                                        日志级别  [default: INFO]
        -su, --server-url TEXT          rtfd服务地址，默认是api段的http://host:port
        -ssu, --server-static_url TEXT  rtfd静态资源地址，默认在server-url下
        -fu, --favicon-url TEXT         文档HTML页面的默认图标地址  [default:
                                        https://static.saintic.com/rtfd/favicon.png]
        -un, --unallowed-name TEXT      不允许的文档项目名称，以英文逗号分隔  [default: ]
        --nginx-dn TEXT                 文档生成后用以Nginx访问的顶级域名  [default:
                                        localhost.localdomain]
        --nginx-exec PATH               Nginx管理命令路径  [default: /usr/sbin/nginx]
        --nginx-ssl / --no-nginx-ssl    Nginx开启SSL  [default: False]
        --nginx-ssl-crt PATH            SSL证书  [default:
                                        ${g:base_dir}/certs/${dn}.crt]
        --nginx-ssl-key PATH            SSL证书私钥  [default:
                                        ${g:base_dir}/certs/${dn}.key]
        --nginx-ssl-hsts-maxage INTEGER
                                        设置在浏览器收到这个请求后的maxage秒的时间内凡是访问这个域名下的请求都使用HTTPS请求。  [default: 31536000]
        --py2 PATH                      Python2路径  [default: /usr/bin/python2]
        --py3 PATH                      Python3路径  [default: /usr/bin/python3]
        -i, --index TEXT                pip安装时的默认源  [default:
                                        https://pypi.org/simple]
        --host TEXT                     Api监听地址  [default: 127.0.0.1]
        --port INTEGER                  Api监听端口  [default: 5000]
        -c, --config PATH               rtfd的配置文件（不会覆盖）  [default:
                                        /home/xxxx/.rtfd.cfg]
        -h, --help                      Show this message and exit.

当然，配置文件可以不用命令生成，这里有一个模板，而且包含了大量注释，强烈建议使用的：
`rtfd.cfg`_

.. _rtfd-usgae-quickstart-no2:

二、项目管理
---------------

类似于readthedocs，文档项目需要先创建，再构建，构建成功才能访问。

project子命令用来管理项目，新建、查询、更新等操作，这个是常用的，因为目前项目管理操作
只能使用命令行，API暂时还没写。

.. _rtfd-usgae-quickstart-project-create:

新建项目
^^^^^^^^^^^^^

命令 `rtfd project --help` 大部分选项都是新建项目时用到的，新建项目时action选项设为
create，--update-rule选项用不到，其他根据提示信息设置，最重要的选项是--url，必需。

例如，新建一个名叫repo的项目，文档在仓库的docs目录下：

.. code-block:: bash

    $ rtfd project -a create --url https://github.com/user/repo repo

.. note::

    新建项目时url支持GitHub和Gitee，可以是公开仓库或私有仓库，私有仓库的url格式
    是：https://username:password@git-service-provider.com/username/repo

选项 `-cd / --custom-domain` 用来自定义域名，不包含协议，如果自定义域名想要支持
HTTPS，请设置选项 `--ssl --ssl-crt 证书文件 --ssl-key 密钥文件` 。

已创建的项目可以更新项目，上述共四个选项还有设置语言等选项在更新时会重新渲染nginx配置，
生成自定义域名的配置文件，用户需要给自定义域名添加CNAME记录，指向程序配置文件中dn的
域名或者生成的默认域名。

比如托管域名是 ``rtfd.vip`` ，新建项目test，那么默认域名是test.rtfd.vip；如果自定义
了其他域名，那么请CNAME到test.rtfd.vip（这是最靠谱的，因为其他域名可能不在同机器）。

.. versionadded:: 0.3.0

    - 已有项目如果要删除自定义域名，也是可以的，参考 :ref:`rtfd-faq-custom-domain`


.. _rtfd-usgae-quickstart-project-get:

查询项目
^^^^^^^^^^^^^

选项action默认是get，即查询动作，所以带上参数项目名即可，比如：

.. code-block:: bash

    $ rtfd project repo

这会输出JSON数据，可以美化下输出结果，

.. code-block:: bash

    $ rtfd project repo | python -m json.tool
    # 或者
    $ rtfd project repo | jq

.. _rtfd-usgae-quickstart-project-update:

更新项目
^^^^^^^^^^^^^

即更新项目配置信息，设置action为update即更新动作，所有更新内容用 `-ur/--update-rule`
选项来设置，这个内容要求是JSON格式，其中配置字段名即新建时的选项名，但注意是小写，而且
短横线要改为下划线，不包含前缀的短横线，不支持短格式的选项。

比如--install对应的更新键名是install=true/false，--version对应的是version=2/3

另外，更新项目的配置还可以通过 `.rtfd.ini` 文件，且其优先级高，
参考 :ref:`rtfd-config-docs-project` ，对比命令行，其支持latest参数及rtfd.ini样例
中的其他参数，样例中未提及的参数则不支持更改。

.. warning::

    更新languages、default_language、single参数会重载nginx配置。

.. versionchanged:: 0.4.0

    - show_nav_git: 导航中是否显示git view/edit部分

    - before_hook: 构建前钩子，要求为系统命令（安装完文档项目的依赖后，sphinx-build命令执行前）

    - after_hook: 构建成功后钩子，要求为系统命令

    以上三个选项未在rtfd project选项中，算是小tip，其中两个钩子为单条命令（不能包含
    管道、与、或等），若要用多条命令组合，请了解下eval（温馨提示：命令在子进程运行，
    请注意对系统安全性）！

.. _rtfd-usgae-quickstart-project-remove:

删除项目
^^^^^^^^^^^^^

选项action设置为remove，加上项目名即可删除项目，比如：

.. code-block:: bash

    $ rtfd project --action remove repo

.. warning::

    注意：这个操作会删除已生成的文档页面、Nginx配置等，属于危险操作！

.. _rtfd-usgae-quickstart-project-list:

列出项目
^^^^^^^^^^^^^

选项action设置为list，项目名随意（不想新开子命令了，但是这里名字还要求存在，没办法），
列出本地存储中的项目，其中项目名如果设置为only，会只输出所有项目的项目名。

输出JSON数据，同样可以美化输出结果。

.. _rtfd-usgae-quickstart-no3:

三、构建文档
---------------

build子命令，用来通过命令行构建文档，支持一个branch选项设置分支，默认是master，允许
设置为标签，v0.4.2及之后版本已经支持克隆任意远程分支。

构建文档还可以通过API触发，也可以webhook触发，参考 :ref:`rtfd-api-docs`

.. _rtfd.cfg: https://github.com/staugur/rtfd/blob/master/tpl/rtfd.cfg
