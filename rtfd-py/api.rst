.. _rtfd-py-api:

=========
API使用
=========

.. _rtfd-py-api-run:

启动API服务
=============

API部分使用的是Flask框架，目前提供了三个Api视图(v0.4.2更改为蓝图)，位于api.py模块中。

需要说明的是，rtfd在开发时依赖了Flask-PluginKit模块，这是一个基于Flask的插件化开发
工具，其详细情况可以参考 `GitHub`_ 。所以，api.py模块实际上就是扩展点，已经通过
register函数返回了扩展点的配置。

所以运行API服务，可以参考以下三种情况：

1. 直接启动

    启动脚本： https://github.com/staugur/rtfd/blob/master/tpl/online.sh

    脚本可以启动、关闭、重载Web应用，注意脚本头部注释，使用时需要安装
    gunicorn模块，如果要自定义进程名，还需要安装setproctitle模块。

    .. versionchanged:: 0.4.0

        在这个版本中新加了独立的app.py模块，省的再去git上找模板，只需要安装
        gunicorn后即可用上述脚本，也可以采用uwsgi自行启动，但不能用上面脚本了，
        模块名是： `rtfd.app:app`

2. 集成到已有的Flask应用中

    这里Flask应用是指无Flask-PluginKit的情况，参考代码：

    .. code-block:: python

        from flask import Flask
        from rtfd.api import bp as rtfd_bp
        app = Flask(__name__)
        app.register_blueprint(rtfd_bp, url_prefix="/rtfd")

    .. note::

        上述代码是针对v0.4.2+，如果是旧版本，参考代码：

        .. code-block:: python

            from flask import Flask
            from rtfd import register
            app = Flask(__name__)
            for vep in register()["vep"]:
                app.add_url_rule(
                    rule=vep["rule"],
                    view_func=vep["view_func"],
                    methods=vep.get("methods", ["GET"])
                )

3. 集成到Flask-PluginKit的应用中

    那就简单了，rtfd本身已经适配了Flask-PluginKit，作为其第三方插件，
    在初始化PluginManager时，传入plugin_packages参数中添加rtfd这个插件名即可。
    具体可以参考 `app.py <https://github.com/staugur/rtfd/blob/master/rtfd/app.py>`_ 。

.. warning::

    rtfd源码中包含静态文件，如果不是集成在Flask-PluginKit应用中，静态文件需要单独拿出
    来供外部访问，当然，我也上传到CDN了：https://static.saintic.com/rtfd/

    主目录是master分支的静态文件，其子目录有0.3.2、0.3.3、0.4.0、0.4.2，
    是各版本的静态文件。

    使用外部静态资源需要配置server_static_url，参考注释：`rtfd.cfg`_

    静态资源有三个文件，最重要的是rtfd.js，所有文档构建时都会在sphinx的配置文件
    conf.py中追加配置以使用这个文件，访问文档时会请求这个rtfd.js，而这个js会初始化
    文档右下角的导航按钮。

上面的三种情况基本上是正式环境下运行api，如果是开发环境，可以使用api子命令直接启动web应用。

.. code-block:: bash

    $ rtfd api

使用 `-h / --help` 可以查看帮助，支持host、port、debug选项，前两个选项默认值可以在
rtfd.cfg配置文件中设置。

.. _rtfd-py-api-docs:

API接口文档
=============

假设是在开发环境运行，监听在127.0.0.1:5000，以下接口文档忽略监听地址。

1. /rtfd/api
-------------

这个路由目前主要用来查询文档数据、构建文档、获取文档输出，通过查询参数Action控制。

- GET, Action=describeProject 查询文档数据

    必需，name查询参数

- GET, Action=queryBuildmsg 获取消息输出

    非必需，raw=true/false，默认值true，返回数据的内容格式

    .. versionchanged:: 0.4.0

        必需，name查询参数

- POST, Action=buildProject 构建文档

    必需，name查询参数或表单数据；

    非必需，branch查询参数或表单数据，默认值是master

2. /rtfd/badge/<your-docs-name>
-------------------------------

这个显示文档的构建状态的徽章，支持传入branch查询参数获取不同分支的构建状态徽章。

3. /rtfd/webhook/<your-docs-name>
---------------------------------

基于webhook触发自动构建，适配了GitHub和码云(Gitee)，支持push、release事件。

要使用这一功能，需要手动在GitHub项目的Webhooks中添加一条记录，GitHub需要的参数如下：

- Payload URL

    就是Webhook的url，比如http://127.0.0.1:5000/rtfd/webhook/your-docs-name

- Content type

    要选择为application/json

- Secret

    创建项目时的webhook-secret参数，可以留空即不验证；更新此参数可以使用webhook_secret。

- Trigger events

    触发事件可以选择默认的push，或者自定义为Pushes、Releases。

对于码云(Gitee)来说，它的webhook选项只有URL、密码、事件：

- URL，同GitHub的Payload URL，rtfd适配gitee的请求

- 密码，同GitHub的Secret

- 事件，请勾选上Push和Tag Push两个事件

.. note::

    在选择上述两个git服务商的webhook事件中，Releases或Tag Push事件是仅在发布新标签时
    触发。

.. _GitHub: https://github.com/staugur/Flask-PluginKit
.. _rtfd.cfg: https://github.com/staugur/rtfd/blob/master/tpl/rtfd.cfg#L13
