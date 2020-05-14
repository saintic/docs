.. _securehttp:

==============
SecureHTTP.js
==============

这是一个js库，封装了相关加密代码：包含AES加密解密、RSA加密解密、浏览器端加密通信封装(RSA+AES+MD5)，专门用来与Python-SecureHTTP一起形成B/S的加密通信。

**代码仓库：** https://github.com/staugur/SecureHTTP.js

**当前版本（version）：** ``0.2.0``

**兼容Python-SecureHTTP的版本：** ``0.2.0+``

CDN
---

在浏览器中使用：

已经把打包好的版本放到又拍云的CDN上，包括开发版、正式版（version请替换），脚本已经包含了依赖的crypto-js、jsencrypt，所以只引入正式版一个即可。

- 开发版(未压缩) ``https://static.saintic.com/securehttp.js/{ version }/securehttp.js``

- 正式版(已压缩) ``https://static.saintic.com/securehttp.js/{ version }/securehttp.min.js``

Node.js
-------

在node中使用：

- 安装：

    可以使用npm或yarn安装，推荐使用yarn。

    ``npm install securehttp`` or ``yarn add securehttp``

- 使用：

    securehttp.js源码就是使用node开发，您可以直接导入：

    .. code-block::

        # 一次性导入
        var securehttp = require('securehttp');
        # 或者解构导入某一具体功能
        var { AESEncrypt, RSAEncrypt } = require('securehttp');

- 开发：

    如果需要二次开发或重新打包之类的，请使用git克隆仓库，``yarn`` 安装依赖。

    - 打包未压缩的开发版本： ``yarn run build``

    - 打包压缩的正式版本： ``yarn run dist``

    - 测试： ``yarn run test``

.. note::

    温馨提示：不支持使用ES6规范导入securehttp.js

API
---

浏览器端，引入securehttp.js后，会有一个全局变量 ``securehttp`` ，等同于nodejs一次性导入全部，包含了可用函数和类。

> 函数: AESEncrypt、AESDecrypt、RSAEncrypt、RSADecrypt
    函数功能和用法与Python版对应

> 类: EncryptedCommunicationBrowser -> (browserEncrypt, browserDecrypt)
    亦对应Python版中EncryptedCommunicationClient，browserEncrypt和browserDecrypt方法也分别对应clientEncrypt和clientDecrypt。
    差异在于：browserEncrypt必须传入有效的signIndex字段，暂不支持false和全部提交数据的加签。

对应Python-SecureHTTP的文档链接： `api-documention <https://python-securehttp.rtfd.vip/#api-documentation>`_

Demo
----

.. code-block:: html

    <!DOCTYPE html>
    <html>
    <head>
        <title>SecureHTTP.js</title>
    </head>
    <body>
        <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://static.saintic.com/securehttp.js/0.2.0/securehttp.min.js"></script>
        <script type="text/javascript">
            var eb = new securehttp.EncryptedCommunicationBrowser(pubkey);
            var post = {a:1, b:2, c:3};
            $.ajax({
                url: "SecureHTTP API URL",
                type: 'post',
                data: eb.browserEncrypt(post, "a,b,c"),
                dataType: 'json',
                success: function(res) {
                    var resp = eb.browserDecrypt(res);
                    console.info(resp);
                },
                error: function(xhr) {
                    alert('出错了');
                }
            });
        </script>
    </body>
    </html>

.. note::
    v0.1.0版本，这个js脚本放在python-securehttp的仓库中，且仅支持浏览器端（还需要先使用script引入依赖），自v0.2.0已经废弃。

    v0.1.0依赖：(github) `brix/crypto-js <https://github.com/brix/crypto-js>`_、`travist/jsencrypt <https://github.com/travist/jsencrypt>`_，前者是AES相关、后者是RSA相关。

    而且只是用在浏览器环境，不适用于node.js开发中，且必须使用script提前引入依赖的脚本：

    .. code-block:: guess

        <!--
        ### 引入AES加密库！
        关于crypto-js库，官方地址是：https://code.google.com/archive/p/crypto-js/，可是在墙外，上面给出的是github地址，两处下载的包有差异。
        -->

        <!--若从googlecode下载则可用以下两种方式引入：-->
        <!--NO.1 引入组件源码
        <script src="CryptoJS-v3.1.2/components/core-min.js"></script>
        <script src="CryptoJS-v3.1.2/components/enc-base64-min.js"></script>
        <script src="CryptoJS-v3.1.2/components/cipher-core-min.js"></script>
        <script src="CryptoJS-v3.1.2/components/aes-min.js"></script>
        <script src="CryptoJS-v3.1.2/components/md5-min.js"></script>
        -->
        <!--NO.2 引入独立汇总（汇总文件是在组件一个或多个文件夹拼接后压缩的，引入汇总文件无需担心它的依赖）
        <script src="CryptoJS-v3.1.2/rollups/aes.js"></script>
        <script src="CryptoJS-v3.1.2/rollups/md5.js"></script>
        -->

        <!--若从github下载则引入以下文件即可代替上述所有（此为建议，可从bootcdn引入此文件）-->
        <script src="crypto-js-3.1.9-1/crypto-js.js"></script>
        或引用cdn的：
        <script src="https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.js"></script>

        <!--
        ### 引入RSA加密库！
        关于jsencrypt.js库，可以自行下载或引入cdn，示例为bootcdn链接。
        -->
        <script src="https://cdn.bootcss.com/jsencrypt/3.0.0-rc.1/jsencrypt.min.js"></script>
