.. _picbed-usgae:

============
使用说明
============

.. note::

    使用就很简单了，Web应用，点点看看。

--------

.. _passport-cli-detail:

1. 命令行
^^^^^^^^^^

即 ``cli.py`` ，目前仅支持一条子命令sa，用来创建用户（管理员），请注意约束：
这个入口应该是唯一一个创建管理员用户的方法。

创建管理员用户可以在启动程序前后。

|image0|

2. 控制台
^^^^^^^^^^^

默认情况下，只有登录用户才允许上传图片，使用命令行创建用户后，就能登录。

普通用户的控制台目前只能看到"我的图片"下拉导航，管理员用户有"站点管理"，
目前可以进行站点设置和钩子扩展管理。

|image1|

如图示，添加一个第三方钩子：up2upyun，这个钩子可以将上传的图片保存到又拍云。

|image2|

不过在web中添加这个钩子需要首先在部署的服务器上安装up2upyun模块::

    正式版本

        $ pip install -U up2upyun

    开发版本

        $ pip install -U git+https://github.com/staugur/picbed-up2upyun.git@master

添加钩子成功有提示，有些会附带模板，所以需要刷新下页面，比如上面这个会在站点设置
的钩子配置区域追加模板：

|image3|

3. 上传
^^^^^^^^^

管理员可以在站点设置中开启匿名上传，这样未登录用户就可以上传图片了。

Web中只有首页可以上传，同时最多选择10张，默认支持jpg、jpeg、gif、bmp、png、webp，
每张最大10M，上传成功后可以复制多个文本格式的图片链接。

当然也可以使用API接口上传。

4. 图床
^^^^^^^^^

在控制台-我的图片中可以查看本人已上传的图片，点击图片显示详情弹窗，在弹窗
里可以继续复制URL、HTML、rST、Markdown格式的图片链接，当然允许删除（只是逻辑删除，并非删除图片文件）。

5. 钩子
^^^^^^^^

下回分解

6. API
^^^^^^^^

下回分解

.. |image0| image:: /_static/images/picbed_cli.png
.. |image1| image:: /_static/images/picbed_setting.png
.. |image2| image:: /_static/images/picbed_hook.png
.. |image3| image:: /_static/images/picbed_hooksetting.png
