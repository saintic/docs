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

安装
======

rtfd本身依赖Flask-PluginKit>=3.3.0、Click>=7.0、configparser模块，
目前只支持Python2.7，您可以在virtualenv、或在全局环境中安装。

- 正式版本

    `$ pip install -U rtfd`

- 开发版本

    `$ pip install -U git+https://github.com/staugur/rtfd.git@master`

.. note::

    Flask-PluginKit在v3.0时重构，不兼容旧版本，若有使用此模块请注意！
