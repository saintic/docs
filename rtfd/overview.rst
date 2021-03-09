.. _rtfd-overview:

======
概述
======

rtfd是一个基于sphinx来构建文档的命令工具，用来生成文档。

类似于 ``readthedocs.org`` 提供的服务，当然功能是比不上的，只是作为备用工具使用。

开发这个工具的起因是我在readthdocs构建文档时发生了致命的错误，所以弄了个简版。

值得注意的是，大多数情况下，这个命令工具你是用不到的，此文档仅以记录使用方法。

Badge: |Document Status|

.. |Document Status| image:: https://open.saintic.com/rtfd/saintic-docs/badge

Go doc: |Go Reference|

.. |Go Reference| image:: https://pkg.go.dev/badge/tcw.im/rtfd.svg
    :target: https://tcw.im/rtfd

GitHub: https://github.com/staugur/rtfd

.. note::

    在 github 中可以看到，之前是用 Python 编写，但后来用 Golang 重构，
    发布正式版本 v1.0.0 ！

    如果您要查看旧版文档，请转到 :ref:`rtfd-py <rtfd-py-overview>`

.. _rtfd-features:

功能
======

- 使用简单，依靠命令行、API

- 配置简单，rtfd配置依靠ini文件，构建文档时也支持直接写ini文件配置文档所需环境

- 支持https（HTTP2、TLS1.3），支持自定义域名（包含HTTPS的支持）

- 文档项目直接支持多语言(翻译)和多标签(版本)，在页面右下角有按钮可以显示

- 支持webhook触发、文档构建状态的徽章、文档单一版本等

- 允许github、gitee公开仓库和私有仓库

- 支持构建前后的钩子命令

目前相对于readthedocs不足的特性是：

- 不支持生成PDF、EPUB

- 不支持添加翻译版本(目前翻译版本要求直接包含在文档中才行)

- 不支持设置子项目、构建时环境变量等

.. _rtfd-install:

安装
======

rtfd仅支持Linux操作系统，测试过CentOS/RHEL、Ubuntu系列，不可用于macOS、Windows系统。

- 得益于 golang 编译优势，源码最终打包成单个可执行二进制程序，下载即可使用。
  
  .. code-block:: bash

    version=1.1.1
    wget -c https://github.com/staugur/rtfd/releases/download/v${version}/rtfd.${version}-linux-amd64.tar.gz
    tar zxf rtfd.${version}-linux-amd64.tar.gz
    mv rtfd ~/bin/
    rtfd -v

- 如果您本地有golang（v1.16+），可以使用以下命令安装：

  .. code-block:: bash

    go get -u tcw.im/rtfd      # 可使用 @tag 安装正式版本
    mv ~/go/bih/rtfd ~/bin/
    rtfd -v

- 从源码编译（要求golang v1.16+）：

  .. code-block:: bash

    git clone https://github.com/staugur/rtfd.git && cd rtfd
    make build

需要注意的是，rtfd二进制文件需要放到PATH环境变量下，因为内部会调用此命令，避免找不到。

您已安装完毕，接下来看看使用命令行和API前的依赖环境准备。
