.. _rtfd-overview:

======
概述
======

rtfd是一个基于sphinx来构建文档的命令工具，用来生成私有文档。

类似于 ``readthedocs.org`` 提供的服务，当然功能是比不上的，只是作为备用工具使用。

开发这个工具的起因是我在readthdocs构建文档时发生了致命的错误，所以弄了个简版。

值得注意的是，大多数情况下，这个命令工具你是用不到的，此文档仅以记录使用方法。


Badge: |DocsStatus|

.. |DocsStatus| image:: https://open.saintic.com/rtfd/badge/saintic-docs

GitHub: https://github.com/staugur/rtfd

.. _rtfd-features:

功能
======

1. 使用简单，依靠命令行、API

2. 配置简单，rtfd配置依靠ini文件，构建文档时也支持直接写ini文件配置文档所需环境

3. 支持https(HTTP2、TLS1.3)

4. 文档项目直接支持多语言(翻译)和多标签(版本)，在页面右下角有按钮可以显示

5. 支持webhook触发、文档构建状态的徽章、文档单一版本等

目前相对于readthedocs不足的特性是：

1. 仅支持github

2. 不支持生成PDF、EPUB

3. 不支持自定义域名

4. 不支持添加翻译版本

5. 不支持设置子项目、构建时环境变量等

.. _rtfd-install:

======
安装
======

rtfd本身依赖Flask-PluginKit>=3.3.0、Click>=7.0、configparser模块，
目前只支持Python2.7，您可以在virtualenv、或在全局环境中安装。

- 正式版本

    `$ pip install -U rtfd`

- 开发版本

    `$ pip install -U git+https://github.com/staugur/rtfd.git@master`

.. note::

    Flask-PluginKit在v3.0.0时重构，不兼容旧版本，若有使用此模块请注意！

.. _rtfd-usgae:

======
使用
======

.. _rtfd-usgae-require:

依赖
=====

rtfd依赖的外部环境是nginx、python。

Nginx
-----

Sphinx生成HTML文档，Nginx用来接收web请求，要求版本不小于1.15.0，且有一个托管域名，
另外用户需要有权限执行 `nginx` 相关命令。

关于托管域名需要说明下，需要的是一个域名后缀，文档项目创建时会依据文档项目名和托管域名
生成文档对应的域名，所以这个域名要求有一个默认解析。
比如托管域名是 ``satic.cn`` ，需要添加一条 ``*.satic.cn`` 的A记录或CNAME记录指向
Nginx服务器。

如果要开启https，还需要证书，要求支持通配符。

Python
------

Python要求python2和python3两个版本，且都安装了virtualenv模块，否则无法使用。

安装virtualenv模块可以使用命令： `python -m pip install virtualenv`

.. _rtfd-usgae-quickstart:

开始使用
=========

rtfd模块安装完成后，会在系统中生成一个 `rtfd` 命令，它的帮助信息可以使用 `-h/--help`
查看，它的版本可以使用 `-v/--version` 获得。

.. code-block:: bash

    $ rtfd -v
    0.2.0

在编写此文档时，rtfd版本0.2.0！

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

NO.1 初始化配置文件
--------------------

init子命令，这一步基本只用一次，在没有rtfd的配置文件时生成配置，如果已有则会直接退出。

使用 ``rtfd init -h`` 查看提示，大部分选项设置了默认值，依据默认值即可。最需要设置的
是 ``-b/--basedir`` 选项，设置rtfd数据的基础目录，所有数据都会存放在此目录下；配置文
件的选项 ``-c/--config`` 强烈建议保持默认值，即 ``${HOME}/.rtfd.cfg`` ！
配置文件决定了数据目录，也就是说不同配置文件可以有不同数据目录，一个系统中可以存在多个
rtfd的服务。

另一个需要注意的选项是 ``--nginx-dn`` ，这是前面准备的托管域名，比如 ``satic.cn`` ！

注意到有两个选项 ``--nginx-ssl-crt和key`` ，其默认值有点特别，是个变量，其中
的 `g.base_dir` 即 `--basedir` ， `dn `即 `--nginx-dn`

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
`rtfd.cfg <https://github.com/staugur/rtfd/blob/master/tpl/rtfd.cfg>`_

NO.2 项目管理
---------------

类似于readthedocs，文档项目需要先创建，再构建，构建成功才能访问。

project子目录用来管理项目，新建、查询、更新等操作，这个是常用的，因为目前项目新建只能
使用命令行，API暂时还没写。

2.1 新建项目
^^^^^^^^^^^^^

命令 `rtfd project --help` 大部分选项都是新建项目时用到的，新建项目时action选项设为
create，--update-rule选项用不到，其他根据提示信息设置，最重要的选项是--url，必需。

例如，新建一个名叫repo的项目，文档在仓库的docs目录下：

.. code-block:: bash

    rtfd project -a create --url https://github.com/user/repo repo

2.2 查询项目
^^^^^^^^^^^^^

选项action默认是get，即查询动作，所以带上参数项目名即可，比如：

.. code-block:: bash

    rtfd project repo

这会输出JSON数据，所以可以用管道美化下输出结果，

.. code-block:: bash

    rtfd project repo | python -m json.tool
    # 或者
    rtfd project repo | jq

2.3 更新项目
^^^^^^^^^^^^^

即更新项目配置信息，设置action为update即更新动作，所有更新内容用 `-ur/--update-rule`
选项来设置，这个内容要求是JSON格式，其中配置字段名参考后续文档。

后续文档更新中ing......
