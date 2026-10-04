.. _rtfd-v2-config:

==========
配置文件
==========

rtfd v2 有两处配置（ini 格式）：一处是 rtfd 本身的程序配置文件，一处是文档附加的环境配置文件。

.. _rtfd-v2-config-rtfd-service:

程序配置文件
=============

默认读取 **$HOME/.rtfd.cfg**\ （或 ``-c/--config`` 指定，或环境变量 ``RTFD_CFG``\ ）。
它决定了 rtfd 的所有行为：存储、托管、构建与 API 等。切换到不同用户 / 配置文件即为不同实例。

``rtfd --init`` 会生成初始配置并预填环境变量（见 :ref:`rtfd-v2-usgae-quickstart-no1`）。
主要分区与关键项：

- **（default）**\ ：``base_dir``\*（数据根目录，初始化后勿改，否则丢数据）、``default_branch``\ 、``unallowed_name``\ 、``log_level``
- **[database]**\ ：``type``\*（sqlite/mysql/pgsql，默认 sqlite）、``dsn``\*（连接串；sqlite 为文件路径，支持 ``%(base_dir)s`` 插值；是否打印 SQL 由顶层 ``log_level=debug`` 控制）
- **[caddy]**\ ：``dn``\*（托管域名后缀，必填）、``exec``\ 、``sudo``\ 、``email``\ 、``auto_https``\ （默认 on）、``conf_dir``\ （默认 ``%(base_dir)s/caddy``\ ）；缓存项 ``static_expires``\ （默认 3600）、``html_nocache``\ （默认 on）
- **[py]**\ ：``<版本号>``\*（键为版本号如 ``3``/``3.10``/``3.12``\ ，值为带 pip+virtualenv 的 python 程序路径）、``default``\ （默认版本）、``index``\ （pip 源）
- **[api]**\ ：``host``\ 、``port``\ 、``server_url``\*（必填，对外可达地址）、``secret``\ （管理接口密钥）
- **[ghapp]**\ ：``app_id``\ 、``private_key``\ （两者同时有效即启用，无独立开关）

\* 为必需项。配置默认值同步维护于 `rtfd.cfg <https://github.com/staugur/rtfd/blob/master/assets/rtfd.cfg>`_
（``rtfd --init`` 写入），变更需同步 ``main_test.go`` 断言。

.. _rtfd-v2-config-docs-project:

文档环境配置文件
================

类似于 readthedocs 的 ``.readthedocs.yml``\ ，格式也是 ini，配置文件为 ``.rtfd.ini``\ ，位于
文档仓库根目录，参考 `rtfd.ini <https://github.com/staugur/rtfd/blob/master/assets/rtfd.ini>`_ 样例。

文档项目仅能通过命令行 ``create`` 新建，新建时即包含众多选项并存入数据库；这些配置也可通过
``rtfd project get {ProjectName}`` 查询。

rtfd 在构建时会**优先读取** ``.rtfd.ini`` 的配置，某配置项无值时再读取已存储的配置，最终构建
参数是两者共同作用的结果（优先级：仓库 ``.rtfd.ini`` > 项目数据库配置 > 系统 rtfd.cfg 默认值）。

.. warning::

    文档项目的部分配置可通过 ``.rtfd.ini`` 实现，且构建成功时 rtfd 会读取其内容**回写数据库**
    （白名单：``[project] latest``\ ；``[sphinx] sourcedir/lang/builder``\ ；
    ``[python] version/requirement/install/index``\ ，其中 ``version`` 取值须在 ``[py]`` 分区已定义）。
