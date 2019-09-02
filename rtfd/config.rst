.. _rtfd-config:

==========
配置文件
==========

rtfd有两处配置，配置格式采用ini，很简单的一种格式，一处是rtfd本身的程序配置文件，一处
是文档附加的环境配置文件。

.. _rtfd-config-rtfd-service:

rtfd程序配置文件
================

这个配置文件决定了rtfd的所有行为，读取与存储数据、文档构建与阅读等。

这个配置文件默认是$HOME/.rtfd.cfg，所以切换到不同用户后，默认情况下rtfd是不可用的，
可以认为rtfd是用户级工具。

我不建议改变默认配置文件，不过命令行子命令、API都支持设置非默认配置文件，参考
FAQ的 :ref:`rtfd-faq-multi-rtfd`

配置文件所支持的所有配置项都可以参考 `rtfd.cfg`_ ，注释应该都清楚。

.. note::

    这里配置文件采用ini格式（了解ini文件参考 `wiki`_ ），解析采用configparser模块，
    配置文件中不支持 ``%()s`` 这个语法，用 ``${}`` 代替。

    示例1. 访问同一个section的配置，解析url结果是： ``http://127.0.0.1:5000``

    .. code-block:: ini

        [api]
        host = 127.0.0.1
        port = 5000
        url = http://${host}:${port}

    示例2. 访问不同section的配置，解析cmd结果是： ``/rtfd/nginx/sbin/nginx``

    .. code-block:: ini

        [g]
        base_dir = /rtfd
        [nginx]
        cmd = ${g:base_dir}/nginx/sbin/nginx

    即访问不同section的配置，格式是： ``${section:item}``

.. _rtfd-config-docs-project:

文档环境配置文件
================

类似于readthedocs的 `.readthedocs.yml` ，不过格式也是ini，配置文件为 `.rtfd.ini`，
其位于文档的项目根目录下，所有支持的配置项参考 `rtfd.ini`_ ，不需要的配置可以注释。

注意：文档项目目前只能通过命令行新建，在新建时已经包含了很多选项（与配置文件对应着），
会在rtfd本地存储，文档配置信息可以通过 ``rtfd project your-docs-name`` 查询。

rtfd在构建时会优先读取 `.rtfd.ini` 的配置，某配置项没有值时会再读取已存储的配置，所以
最终的构建参数是两项共同作用下的结果。

另外，通过 ``rtfd project -a update -ur '{更新配置的JSON串}'`` 这一命令可以更新
文档配置，但是latest参数只能通过 `.rtfd.ini` 去更新。

注意：文档项目的配置更新通过 `.rtfd.ini` 也可以实现，且是唯一支持更新latest的方法。
这个配置文件在构建成功时，rtfd会比较本地已存储的信息和 `.rtfd.ini` 的配置内容，如果
不一致，那么会根据 `.rtfd.ini` 的配置内容更新本地数据。

比如，我新建一个文档项目，其中languages=en,zh_CN、default-language=en，这时我在文档
仓库中添加了 `.rtfd.ini` ，设置了languages=zh_CN，这个项目在构建时，只会构建zh_CN
的页面，而且构建成功后，更新文档配置时，会更新为languages=zh_CN、default_language=
zh_CN，同时重载nginx。

.. note::

    default_language与languages是有关联的，前者是后者的具体某项，默认是后者第一语言。

.. _rtfd.cfg: https://github.com/staugur/rtfd/blob/master/tpl/rtfd.cfg
.. _rtfd.ini: https://github.com/staugur/rtfd/blob/master/tpl/rtfd.ini
.. _wiki: https://en.wikipedia.org/wiki/INI_file
