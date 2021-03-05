.. _rtfd-api:

=========
API使用
=========

.. _rtfd-api-run:

启动API服务
=============

通过 `rtfd api` 启动服务，一样可用 `-c/--config` 选项指定配置文件，运行后的程序名是rtfd，
API暴露了一个 rtfd.js 静态地址，所有文档构建时都会自动引用它，可以单独放到CDN中，访问文档
页面时会运行它，初始化一个导航按钮（页面右下角），点击可展开不同语言、分支/标签、Git地址等
信息。

.. tip::

    rtfd.js我上传到自己又拍云CDN了：https://static.saintic.com/rtfd/

    如果使用CDN，需修改配置文件 $HOME/.rtfd.cfg 中 api.server_static_url 的值。


使用 `-h / --help` 可以查看帮助，支持host、port选项，前两个选项默认值可以在 rtfd.cfg
配置文件中设置。

.. _rtfd-api-docs:

API接口文档
=============

除了badge返回svg外，其他接口均返回json格式，success字段表示成功与否，message表示错误消息。

1. GET /rtfd/desc/<ProjectName>
--------------------------------

或 /rtfd/<ProjectName>/desc

这个路由用来查询文档数据，返回示例：

.. code-block:: json

    {
      "success": true,
      "message": "",
      "data": {
        "dn": false,
        "gsp": "Gitee",
        "hideGit": false,
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVQ4T92S0Q0CMQxDnydBtwEbABvcRjAKK7DBscGNwCZGRbSKDigB/uhv4lc7svjxqeptj8AeWL9hTpJ2dScCLsAqY0hS00WA7+ITcJA0p2AhQgUMwBHYdAAtxoODYs92hb1k1BhdQMy6hKYAvRukANHB8lYpwB84+DTCVMrzdQ/ib7ZvsI6Ds6RtmbciZXr/bOcKjCNuESAd+XoAAAAASUVORK5CYII=",
        "lang": [
          "zh_CN"
        ],
        "latest": "master",
        "public": true,
        "showNav": true,
        "single": false,
        "sourceDir": "docs",
        "url": "https://gitee.com/staugur/picbed",
        "versions": {
          "zh_CN": [
            "latest",
            "master",
            "test"
          ]
        }
      }
    }

2. GET /rtfd/badge/<ProjectName>
---------------------------------

或 /rtfd/<ProjectName>/badge

这个显示文档的构建状态的徽章，支持传入branch（通过query）查询参数获取不同分支的构建状态徽章。

3. POST /rtfd/build/<ProjectName>
---------------------------------

或 /rtfd/<ProjectName>/build

通过API构建文档，支持branch参数（通过query、form）设置构建的分支/标签

这个接口需要验证，如果创建项目时的 **secret** 参数不为空则验证，留空即不验证。

如果验证，需要传递HTTP头 **X-Rtfd-Sign** ，值为 ``md5(secret)`` 的结果。

3. POST /rtfd/webhook/<ProjectName>
------------------------------------

或 /rtfd/<ProjectName>/webhook

基于webhook触发自动构建，适配了GitHub和码云(Gitee)，支持push、release事件。

要使用这一功能，需要手动在GitHub项目的Webhooks中添加一条记录，GitHub需要的参数如下：

- Payload URL

    就是Webhook的url，比如http://{rtfd-api-base-url}/rtfd/webhook/your-docs-name

- Content type

    要选择为application/json

- Secret

    创建项目时的 **secret** 参数，可以留空即不验证。

- Trigger events

    触发事件可以选择默认的push，或者自定义为Pushes、Releases。

对于码云(Gitee)来说，它的webhook选项只有URL、密码、事件：

- URL，同GitHub的Payload URL，rtfd适配gitee的请求

- 密码，同GitHub的Secret，选择 Webhook 密码（而不是签名密钥）

- 事件，请勾选上Push和Tag Push两个事件

.. note::

    在选择上述两个git服务商的webhook事件中，Releases或Tag Push事件是仅在发布新标签时
    触发。

