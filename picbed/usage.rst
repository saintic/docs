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

个人资料只是简单的用户名、昵称、头像等，但舍弃外，还有一个Token信息。

.. _Token:

Token
+++++++++++

个人资料中值得一提的是Token，它是目前唯一一种能在API请求中认证用户的方法，
实际上，这是由内置的钩子(hooks/token.py)实现的（默认启用，管理员可关闭）。

Token每个用户唯一，可以随意重置、销毁再生成，具备API所有权，一旦泄露风险极大！

Token的使用也很简单，有两种方法：

- 一是Header，使用 **"Authorization:Token 你的token值"** 

  .. code:: bash

    curl -XPOST -H "Authorization:Token xxx" http://picbed.example.ltd/api/upload

- 二是post body中附带token字段，例如:

  .. code:: bash

    curl -XPOST -d token=xxx -d other=xxx http://picbed.example.ltd/api/upload

我的图片
+++++++++++++

我的图片顾名思义，登录用户能看到自己上传的所有图片，点击图片显示详情弹窗，
在弹窗里可以继续复制URL、HTML、rST、Markdown格式的图片链接，当然允许
删除，不仅是逻辑删除，只要后端存储钩子支持亦会删除实际图片文件，目前的钩子
均支持完全删除。

图片详情中相册名是可以修改的，点击后面的√即可提交更新。

用户设置
+++++++++++++++

用户设置是您在站点中的个性化设置，仅在个人登录后有效，不会影响到其他人！
也就是说，登陆后，此处的一些设置可以覆盖管理员针对全站的设置，比如背景图。
此外，还有一些针对个人的单独设置，比如图片数量、放大度。

.. _LinkToken:

LinkToken
++++++++++++++

在用户设置中有一个 **Token分权引用表** ，也是由内置的token钩子带来的。

出现LinkToken的初衷是因为我想在外部网站放置一个按钮，经过简单配置能一键上传
图片到picbed，但是好像需要鉴权，而用Token呢，放到前端页面，基本等于裸奔，所
以才有了这个以Token为基础的LinkToken。

**LinkToken，或者叫Token分权引用，就是Token的一种映射，是将Token所拥有的权限拆分并加上限制条件进行访问控制，这样能尽可能地实现安全、方便地分发使用。**

其工作原理是：用户创建LinkToken并设置允许访问条件，这样在使用LinkToken进行
接口请求时，内置的token钩子会进行认证、鉴权操作，只有此次请求的方法、来源、
IP、接口等完全符合用户设置才会放行请求（实际上是各种条件通过后，
LinkToken会找到用户的token并自动相关设置），否则拒绝。

比如说，Token能访问所有API，现在新建一个LinkToken，设置它仅允许访问
**api.upload** 上传接口，且限制origin(`了解HTTP访问控制`_)来源，
这样生成的LinkToken便只能在浏览器中origin所在网站进行跨域调用picbed的upload上传接口，
即便有邪恶的冒充者假冒origin头，但也可以在新建LinkToken时设置安全ip进行限制，
就算泄露也无所谓，删掉或禁用然后再新建一个即可，权限小，专项使用，修改成本小。

如此，大概能明白LinkToken的作用，一个简易的访问控制。

用户可以创建LinkToken，定义调用此引用的安全来源origin、IP，并限定访问某个
路由(API接口)或某个HTTP方法，提交后会得到一个最小权限的LinkToken！然后就
可以在其他网站跨域调用，比如上传图片，实际上也是为了外部上传图片开发的。

LinkToken的使用类似Token，只不过只有一种方法，放到header中：

- 使用 **"Authorization:LinkToken 你的LinkToken值"**

  .. code:: bash

    curl -XPOST -H "Authorization:LinkToken xxx" http://picbed.example.ltd/api/upload

可以用在ajax中（跨域），或者直接客户端请求，比如curl。

综述，创建一个LinkToken，需要尽可能小地设置访问条件，且建议专项专用。

|image4|

如图，新建时有两块比较难理解，分权引用限定条件和允许访问规则，两者相结合
决定如何进行访问控制。

.. _LinkToken-secure-item:

分权引用限定条件
^^^^^^^^^^^^^^^^^^^^^^^

目前4个条件，origin、ip、ep、method，分别定义了允许访问的来源地址、来源IP和
允许访问哪些api接口(即ep，endpoint，中文叫端点，是picbed所用web框架Flask的
术语，嗯，可能不明白，下面给了一张表来说明)以及允许访问接口的什么方法。

这4个限定条件都可以用英文逗号分隔写多条，也可以留空使用默认值。

- origin

  来源地址，包含协议、主机、端口，(详细 `了解HTTP访问控制`_)，
  比如： *http://example.com*, *https://example.com*, 是两个来源，一般情况下，
  在跨域环境下才会有此字段。

  如果设置了origin字段，正常情况下，只会在跨域时有效，当然假冒也是有可能的，
  其实就是一个HTTP_ORIGIN头字段。
  
  如果没设置，则表示直接允许这条。

  .. note::

    管理员控制台有一项设置定义了CORS Origin，如果未定义，那么此处不可填；
    如果*，此处随意；如果设置了具体的，此处只能留空或选择已设置的。

- ip

  来源IP，限制用户访问picbed的真实ip地址，若无则表示直接允许。

- ep

  endpoint，即端点，这是程序所用web框架术语，就是API接口对应的名字，此项
  用来限制允许访问的目标接口。
  API接口均以 **/api** 为前缀，比如 /api/upload, api/index，用端点来说，就是
  api.upload, api.index，分别是上传接口，API首页没啥卵用的充门面接口。

  端点是必须有滴，默认是api.index,api.upload，以下是可能有用的端点说明：

  +-------------------+--------------------+------------+---------------------------------------------------------+
  | ep(端点)          |     接口路径       | 允许方法   | 说明                                                    |
  +===================+====================+============+=========================================================+
  | api.index         | /api/ or /api/index| GET POST   | 返回hello picbed(若登录则是用户名)                      |
  +-------------------+--------------------+------------+---------------------------------------------------------+
  | api.upload        | /api/upload        | POST       | 上传图片                                                |
  +-------------------+--------------------+------------+---------------------------------------------------------+
  | api.waterfall     | /api/waterfall     | POST       | 获取个人图片数据                                        |
  +-------------------+--------------------+------------+---------------------------------------------------------+

- method

  定义允许访问ep端点的HTTP方法：GET POST PUT DELETE等，注意，这是针对端点全体的，
  不单独对某一个端点设置，method也是必须有滴，默认是post（大小写不敏感）。

.. _LinkToken-secure-rule:

允许访问规则
^^^^^^^^^^^^^^^^^^^^

上面的4个条件定义了允许访问的来源和目标，而此处的访问规则定义如何组合这几个条件。

这里有两个规则：

- **某个条件内部的规则**

  定义某个条件返回True(即允许通过)的规则。

  格式是：**in: opt, not in: opt, ...** ，opt即origin、ip、ep、method，
  分别表示来源主机和ip、目标接口和方法，允许使用in/not in成员运算符，
  意思是请求在(in)或不在(not in)条件(opt)允许范围内时返回True(真)。

  需要注意的是，对于任一opt，如果用户没有定义其对应的限定条件，那么此
  opt计算时直接返回True允许放行。
  
  如果定义了opt对应的限定条件，但没有定义放行规则，那默认是in！

- **所有限定条件之间的(平行)规则**

  定义各个条件最终如何组合，程序根据请求来源和目标，与用户定义的允许来源
  和目标进行判断，组合结果返回True才允许请求，否则就丢弃。

  格式是：**opt and/or/not opt ... (opt and/or/not opt) ...** ，opt表示意义同上，
  允许使用and(且)、or(或)、not(非)逻辑运算符与()小括号组合。

  注意，此默认规则是： **origin and ip and ep and method**

  .. tip::

    实际上，如果你懂一些Python或其他开发语言，可以简单理解为组合True之间的
    条件，允许使用小括号提升运算优先级，opt的值可认为是True（真），利用
    逻辑运算符和()进行组合定义，最终返回True就是允许放行的条件。

**上面两个规则是要结合着判定的！**

比如说内部规则：in:origin,not in:ep，意思是当请求的来源在限定条件origin内允许访问、
请求的目标接口在限定条件ep外允许访问，这两个各自是独立的。

必须结合平行规则来判断，比如：origin and ep，意思是origin内部判断返回True且
ep内部判断也返回True才允许。

举几个例子（平行规则 | 内部规则）：

- origin and ip | in:origin,in:ip

  请求来源主机与来源ip在用户限定的origin、ip内允许放行。

- origin or ip | in:origin,in:ip

  请求来源主机在限定origin内或来源ip在限定ip内任一条件满足允许放行。

- ip and ep and method | in: ip, in: ep, in: method

  请求来源ip在限定ip内且请求目标接口在限定接口内且请求目标接口的方法在
  限定的方法内允许放行

- origin or (ip and (ep and not method)) | "不填，使用默认值"

  请求来源主机在限定origin内，或者，请求来源ip在限定ip内并且请求目标的方法不在限定方法内，
  或者两边的任一结果是True都允许放行。

诸如此类等等，单条语句在允许规则内组合。

.. warning::

  但是也要注意，如果上述说明看完仍不理解，请保持默认，否则在使用LinkToken时，
  程序计算结果可能会触发500异常。
  
  实际上，上述是需要一点对(开发语言的)运算符的了解的。

.. _LinkToken-upload-plugin:

外部上传图片插件
^^^^^^^^^^^^^^^^^^^^

关于LinkToken嘚吧嘚写了那么多，还是要用到真实场景的，其实也是为了实现这处的
功能才首先实现LinkToken的。

picbed是一个简单的图床程序，上传图片都是通过api.upload接口的，所以通过首页、
客户端、命令行等都是允许的，是也，就出现了一个应用场景：在个人/组织的其他
网站下直接上传图片到picbed。

但是上传到picbed这个独立图床，基本上都会出现跨域，而且管理员可能不允许匿名
上传，综合，就需要LinkToken了（也是在这个需求背景下产生的）。

如下图所示，实现的选择图片自动上传，成功后回调给页面。

|image5|

NO.1 实现这个场景，首先创建一个LinkToken，根据自己的需求填写相关规则，成功
后弹出类似下图提示框（点击表格右侧操作栏复制按钮亦可），可以快捷复制相关内容。

|image6|

弹框中复制手动引用和自动引用都是用JS和LinkToken的进一步封装，重要的是
LinkToken值和JS地址。LinkToken是一长串编码后的字符串；JS地址固定，就是picbed
静态目录下的文件：/static/sdk/uploader.js，这个js文件可以单独上传到CDN中以供加速。

注意：这个js请用在 **现代化** 浏览器环境中（啥？IE？对不起），它对外暴露了
一个 **up2picbed** 方法，所需参数不少，只有url是必需的。

NO.2 初始化

- 手动调用

  如下，在页面引入uploader.js，找一个按钮放到需要上传的地方，写js初始化即可。

  .. code:: html

    <button id="#up2picbed">上传</button>
    <script src="Your Picbed URL/static/sdk/uploader.js"></script>
    <script>
        up2picbed({
            url: "Your Picbed URL",
            token: "Your Picbed LinkToken",
            success: res => {
                alert(JSON.stringify(res));
            }
        });
    </script>

- 自动调用

  如下，引入uploader.js时将所需参数用dataset形式赋好值，js内会自动初始化。

  必须要设置 **data-auto="true"** ！

  需要注意的是，success、fail、progress三个要求是函数，用此自动方法，如要
  设置这三个，需要在js引入时全局就已有对应的函数，否则查找不到失效。

  .. code:: html

    <button id="#up2picbed">上传</button>
    <script>
        function onSuccess(res) {
            alert(JSON.stringify(res));
        }
    </script>
    <script src="Your Picbed URL/static/sdk/uploader.js"
        data-url="Your Picbed URL"
        data-token="Your Picbed LinkToken"
        data-success="onSuccess"
        data-auto="true">
    </script>

手动调用时未传入的参数会尝试从dataset中获取，最后无果才会使用默认值。

调用up2picbed函数，其接收一个object，有效的选项如下：

.. code:: text

    以下选项用于构造上传类，无值时读取dataset自身的初始化参数，支持如下：
    url: [必需]picbed上传接口地址
    elem: [默认#up2picbed]绑定上传的button元素
    auto: [注意]当值为true时脚本会自动初始化，否则需要在手动调用up2picbed函数初始化elem上传
    token: [建议]picbed上传所需的LinkToken值，当然允许匿名可以省略
    album: 定义上传图片所属相册，留空表示默认使用LinkToken设定值（仅当LinkToken认证成功此项才有效）
    style: 仅当值为false时有效，会取消自动设置elem的内联样式
    size: 允许上传的图片大小，单位Kb，最大10Mb
    exts: 允许上传的图片后缀
    success: 上传成功的回调（通过字符串映射函数，传递响应结果，在脚本执行之前全局要有此函数，否则不生效）
    fail: 上传失败或错误的回调（同success）
    progress: 上传进度回调，传递百分比

2. 控制台
---------------

管理员功能，进行诸如站点设置、钩子扩展等管理（下图可能非最新内容）。

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
.. |image4| image:: /_static/images/picbed_linktoken.png
.. |image5| image:: /_static/images/picbed_upload.gif
.. |image6| image:: /_static/images/picbed_linktoken_copy.png


.. _了解HTTP访问控制: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
