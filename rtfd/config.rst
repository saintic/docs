.. _rtfd-config:

==========
配置文件
==========

rtfd有两处配置（ini格式），一处是rtfd本身的程序配置文件，一处是文档附加的环境配置文件。

.. _rtfd-config-rtfd-service:

程序配置文件
=============

这个配置文件决定了rtfd的所有行为，读取与存储数据、文档构建与阅读等。

配置文件默认是 $HOME/.rtfd.cfg，所以切换到不同用户后，默认情况下rtfd是不可用的，
可以认为rtfd是用户级工具。

不建议改变默认配置文件，不过命令行子命令、API都支持设置非默认配置文件，
指定不同配置文件会有不同效果，藉此可以实现rtfd多服务。

.. _rtfd-config-docs-project:

文档环境配置文件
================

类似于readthedocs的 `.readthedocs.yml` ，不过格式也是ini，配置文件为 `.rtfd.ini`，
其位于文档的项目根目录下，所有支持的配置项参考 `rtfd.ini`_ ，不需要的配置可以注释。

注意：文档项目目前只能通过命令行新建，在新建时已经包含了很多选项，会在rtfd本地数据库中存储，
文档配置信息可以通过 ``rtfd project get {ProjectName}`` 查询。

rtfd在构建时会优先读取 `.rtfd.ini` 的配置，某配置项没有值时会再读取已存储的配置，所以
最终的构建参数是两项共同作用下的结果。

.. warning::

    文档项目的配置更新通过 `.rtfd.ini` 也可以实现，这个配置文件在构建成功时，
    rtfd会读取它的内容并更新本地数据库。

比如，我新建一个文档项目，其中 ``lang=en,zh_CN`` ，这时我在文档仓库中添加了 `.rtfd.ini` ，
设置了 ``lang=zh_CN``， 那这个项目在构建时，只会构建zh_CN页面，而且构建成功后，
更新文档配置时，会刷新数据库 lang 字段值为 zh_CN 同时重载nginx。

.. _rtfd.ini: https://github.com/staugur/rtfd/blob/master/assets/rtfd.ini
