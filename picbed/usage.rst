.. _picbed-usgae:

============
使用说明
============

.. note::

    使用就很简单了，Web应用，点点看看。

--------

.. _picbed-cli:

0. 命令行
----------

即flask子命令，其中 ``flask sa create`` 是用来创建用户（管理员），请注意约束：
这个入口应该是唯一一个创建管理员用户的方法。

创建管理员用户可以在启动程序前后。

.. code:: bash

    $ flask sa --help
    Usage: flask sa [OPTIONS] COMMAND [ARGS]...

        Administrator commands

    Options:
        --help  Show this message and exit.

    Commands:
        clean   清理系统
        create  创建账号

    $ flask sa create --help
    Usage: flask sa create [OPTIONS]

        创建账号

    Options:
        -u, --username TEXT       用户名
        -p, --password TEXT       用户密码
        --isAdmin / --no-isAdmin  是否为管理员  [default: False]
        -a, --avatar TEXT         头像地址
        -n, --nickname TEXT       昵称
        --help                    Show this message and exit.

1. 个人中心
-------------

个人中心包含个人资料、修改密码、用户设置、我的图片等。

个人资料中值得一提的是Token字段，它是目前唯一一种能在API请求中认证用户的
方法，实际上，这是由内置的钩子实现的（默认启用，管理员可关闭），当然，
可以自己开发认证的钩子。

Token每个用户唯一，可以随意重置、销毁再生成。注意：修改密码后token会失效。

Token的使用也很简单，有两种方法。一是Header，使用"Authorization:Token 你的token值"；
二是post body中附带token字段，例如:

.. code:: bash

    curl -XPOST -H "Authorization:Token xxx" http://picbed.example.ltd/api/upload

    curl -XPOST -d token=xxx -d other=xxx http://picbed.example.ltd/api/upload

我的图片顾名思义，登录用户能看到自己上传的所有图片，点击图片显示详情弹窗，
在弹窗里可以继续复制URL、HTML、rST、Markdown格式的图片链接，当然允许
删除，不仅是逻辑删除，只要后端存储钩子支持亦会删除实际图片文件，目前的钩子
均支持完全删除。

图片详情中相册名是可以修改的，点击后面的√即可提交更新。

用户设置是您在站点中的个性化设置，仅在个人登录后有效，不会影响到其他人！
也就是说，登陆后，此处的一些设置可以覆盖管理员针对全站的设置，比如背景图。
此外，还有一些针对个人的单独设置，比如图片数量、放大度。

2. 控制台
---------------

管理员功能，进行诸如站点设置、钩子扩展等管理（下图非最新内容）。

|image1|

如图示，添加一个第三方钩子：up2upyun，这个钩子可以将上传的图片保存到又拍云。

|image2|

不过在web中添加这个钩子需要首先在部署的服务器上安装up2upyun模块::

    正式版本

        $ pip install -U up2upyun

    开发版本

        $ pip install -U git+https://github.com/staugur/picbed-up2upyun.git@master

添加钩子成功有提示，有些会附带模板，所以需要刷新下页面，比如上面这个会在
站点设置的钩子配置区域追加模板：

|image3|

还有其他钩子，更多了解参考下一节。

3. 上传
---------

默认情况下，只有登录用户才允许上传图片，使用命令行创建用户后，
就能登录（当然，管理员可以开启开放注册功能）。

管理员也可以在站点设置中开启匿名上传，这样未登录用户就可以上传图片了。

Web中只有首页可以上传，同时最多选择10张，默认支持jpg、jpeg、gif、bmp、png
和webp（管理员可修改），每张最大10M，上传成功后可以复制多个文本格式的
图片文本链接。

当然也可以使用API接口上传，当然首页上传也是依托接口，您还可以通过HTTP
客户端或其他图床桌面程序上传，使用Token做用户认证。

4. 钩子
--------

请转到 :doc:`/picbed/hook`

5. API
--------

请转到 :doc:`/picbed/api`

.. |image1| image:: /_static/images/picbed_setting.png
.. |image2| image:: /_static/images/picbed_hook.png
.. |image3| image:: /_static/images/picbed_hooksetting.png
