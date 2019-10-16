.. _open-sentence:

====================
古诗词文名句接口文档
====================

地址：https://open.saintic.com/sentence.html

说明：这个API是一个可以随机返回一句古诗词文中名句的接口。

.. _open-sentence-data-source:

**关于数据来源**
^^^^^^^^^^^^^^^^

-  接口数据来源于古诗文网和诗词公开数据库（大约12k条数据），包括诗、词、歌、赋、古籍等。
-  源于公开数据库的部分（大约4k条）未查到主题、分类及来源URL。

.. _open-sentence-api-response:

**关于接口返回**
^^^^^^^^^^^^^^^^

-  请参阅RULE规则，共三个点，每个点表示含义不同，最后一个点后是后缀，即\ **.suffix**
-  suffix支持json、txt、svg格式，其中svg参考了古诗词·一言API，暂不支持png，默认是json！
-  json返回字段code为0表示请求成功，data是名句数据，q是RULE解析后的数据；若code不为0，msg为异常消息。

.. _open-sentence-rule-query:

**关于规则与查询参数**
^^^^^^^^^^^^^^^^^^^^^^

-  接口地址：\ *https://open.saintic.com/api/sentence/* **RULE**

.. _open-sentence-rule:

-  **RULE规则:**

    1. 注意：**all** 或 **.** 表示随机；suffix后缀；catalog分类；theme主题；author作者；pinyin即要求汉字拼音！
    2. 为空时: 格式默认，随机返回名句
    3. 不为空但没有点: catalog\_pinyin: 随机返回分类中名句，格式默认
    4. 一个点: catalog\_pinyin.suffix:

        -  点后为后缀，支持svg,json,txt；
        -  点前为catalog之分类，默认all，随机返回名句
        -  示例：爱情分类（主题是抒情）

        .. code-block:: html

            aiqing.json

    5. 两个点: theme\_pinyin.catalog\_pinyin.suffix:

        -  第一个点前是主题，留空或all即随机
        -  第二个点前是分类，留空或all即随机
        -  第二个点后是后缀
        -  点前为catalog之分类，默认all，随机返回名句
        -  示例：抒情主题，爱情分类

        .. code-block:: html

            shuqing.aiqing.json

    6. 三个点: author\_pinyin.theme\_pinyin.catalog\_pinyin.suffix:

        -  第一个点前是作者，留空或all即随机
        -  第二个点前是主题，留空或all即随机
        -  第三个点前是分类，留空或all即随机
        -  第三个点后是后缀
        -  示例：作者苏轼，抒情主题，爱情分类

        .. code-block:: html

            sushi.shuqing.aiqing.json

.. _open-sentence-query:

-  **个性化查询参数（针对.svg后缀）:**

   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | 参数              | 说明               | 默认   | 备注                                                        |
   +===================+====================+========+=============================================================+
   | has-url           | 是否显示名句原文   | 无     | 可选true、on、1等开启此选项，但仍需要存在原文链接才能点击   |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | letter-spacing    | 字体间隔（px）     | 1.5    | 合法范围[0-30]                                              |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | text-decoration   | 文本修饰           | 无     | 可选none、underline、overline等                             |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | fill              | 文本颜色           | 无     | 比如red、#f00                                               |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | fill-opacity      | 外观透明度         | 无     | 合法范围[0-1]                                               |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | font-family       | 字体系列           | 无     | 建议使用字体英文名称，比如Kaiti                             |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | font-weight       | 字体粗细           | 无     | 可选normal、bold、数值等                                    |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | font-size         | 字体大小（px）     | 20     | 合法范围[8,50]                                              |
   +-------------------+--------------------+--------+-------------------------------------------------------------+
   | inline-style      | 是否内联样式       | 无     | 可选true、on、1等开启此选项，表示仅返回svg纯文本内容！      |
   +-------------------+--------------------+--------+-------------------------------------------------------------+

.. _open-sentence-rule-demo:

-  **RULE示例:**

    -  您可以参考下方公开的主题及子分类部分，可以点击接口后的地址，将随机返回古诗词名句，格式json！
    -  `随机返回古诗词名句，格式svg <https://open.saintic.com/api/sentence/all.svg>`__
    -  `随机返回古诗词名句，格式txt <https://open.saintic.com/api/sentence/all.txt>`__
    -  `随机返回爱情(子分类)的名句，格式svg <https://open.saintic.com/api/sentence/aiqing.svg>`__
    -  `随机返回节日(主题)的名句，格式svg <https://open.saintic.com/api/sentence/jieri..svg>`__
    -  `随机返回苏轼的名句，格式svg <https://open.saintic.com/api/sentence/sushi...svg>`__
    -  `随机返回古籍-论语的名句，格式json <https://open.saintic.com/api/sentence/guji.lunyu.json>`__

.. _open-sentence-usage:

-  **使用方法:**

    -  对于txt、json等格式，可以通过ajax调用。

    -  对于svg，可以使用\ ``<img src="">``\ 引用，img中可以写行内样式。

    -  对于svg，可以使用inline-style参数，返回svg文本，通过ajax调用html方法写入页面中，例如：

.. code-block:: html

    <div id="svg"></div>
    <script>
        $.ajax({
            url: "https://open.saintic.com/api/sentence/all.svg?has-url=true&inline-style=true&font-size=16",
            type: "GET",
            success: function (res) {
                $("#svg").html(res);
            }
        });
    </script>

