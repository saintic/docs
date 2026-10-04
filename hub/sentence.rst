.. _hub-sentence:

====================
古诗词文名句接口文档
====================

地址：https://hub.saintic.com/

说明：这个API是一个可以随机返回一句古诗词文中名句的接口。

.. note::

    2025/4/1 开启策略：空 User-Agent 访问此接口直接返回 403 http status_code。

.. _hub-sentence-data-source:

**关于数据来源**
^^^^^^^^^^^^^^^^

-  接口数据来源于古诗文网和诗词公开数据库（大约12k条数据），包括诗、词、歌、赋、古籍等。
-  源于公开数据库的部分（大约4k条）未查到主题、分类及来源URL。

.. _hub-sentence-api-response:

**关于接口返回**
^^^^^^^^^^^^^^^^

-  请参阅RULE规则，共三个点，每个点表示含义不同，最后一个点后是后缀，即\ **.suffix**
-  suffix支持json、txt、svg格式，其中svg参考了古诗词·一言API，暂不支持png，默认是json！
-  json返回字段success为true表示请求成功，data是名句数据，q是RULE解析后的数据；若success不为true，message为异常消息。

.. _hub-sentence-rule-query:

**关于规则与查询参数**
^^^^^^^^^^^^^^^^^^^^^^

-  接口地址：\ *https://hub.saintic.com/openservice/sentence/* **RULE**

.. _hub-sentence-rule:

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

.. _hub-sentence-query:

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

.. _hub-sentence-rule-demo:

-  **RULE示例:**

    -  您可以参考下方公开的主题及子分类部分，可以点击接口后的地址，将随机返回古诗词名句，格式json！
    -  `随机返回古诗词名句，格式svg <https://hub.saintic.com/openservice/sentence/all.svg>`__
    -  `随机返回古诗词名句，格式txt <https://hub.saintic.com/openservice/sentence/all.txt>`__
    -  `随机返回爱情(子分类)的名句，格式svg <https://hub.saintic.com/openservice/sentence/aiqing.svg>`__
    -  `随机返回节日(主题)的名句，格式svg <https://hub.saintic.com/openservice/sentence/jieri..svg>`__
    -  `随机返回苏轼的名句，格式svg <https://hub.saintic.com/openservice/sentence/sushi...svg>`__
    -  `随机返回古籍-论语的名句，格式json <https://hub.saintic.com/openservice/sentence/guji.lunyu.json>`__

.. _hub-sentence-topics:

**公开主题及子分类**
^^^^^^^^^^^^^^^^^^^^

以下列出所有公开的主题及子分类，点击链接可查看对应接口返回示例（JSON 格式，也可替换后缀为 ``.svg`` 或 ``.txt``）。

.. note::

   接口中使用的拼音均不含音调，名称映射可参阅接口返回字段 ``q.theme`` 与 ``q.catalog``。

抒情
----

- `爱情 <https://hub.saintic.com/openservice/sentence/shuqing.aiqing.json>`__
- `友情 <https://hub.saintic.com/openservice/sentence/shuqing.youqing.json>`__
- `离别 <https://hub.saintic.com/openservice/sentence/shuqing.libie.json>`__
- `思念 <https://hub.saintic.com/openservice/sentence/shuqing.sinian.json>`__
- `思乡 <https://hub.saintic.com/openservice/sentence/shuqing.sixiang.json>`__
- `伤感 <https://hub.saintic.com/openservice/sentence/shuqing.shanggan.json>`__
- `孤独 <https://hub.saintic.com/openservice/sentence/shuqing.gudu.json>`__
- `闺怨 <https://hub.saintic.com/openservice/sentence/shuqing.guiyuan.json>`__
- `悼亡 <https://hub.saintic.com/openservice/sentence/shuqing.daowang.json>`__
- `怀古 <https://hub.saintic.com/openservice/sentence/shuqing.huaigu.json>`__
- `爱国 <https://hub.saintic.com/openservice/sentence/shuqing.aiguo.json>`__
- `感恩 <https://hub.saintic.com/openservice/sentence/shuqing.ganen.json>`__

四季
----

- `春天 <https://hub.saintic.com/openservice/sentence/siji.chuntian.json>`__
- `夏天 <https://hub.saintic.com/openservice/sentence/siji.xiatian.json>`__
- `秋天 <https://hub.saintic.com/openservice/sentence/siji.qiutian.json>`__
- `冬天 <https://hub.saintic.com/openservice/sentence/siji.dongtian.json>`__

山水
----

- `庐山 <https://hub.saintic.com/openservice/sentence/shanshui.lushan.json>`__
- `泰山 <https://hub.saintic.com/openservice/sentence/shanshui.taishan.json>`__
- `江河 <https://hub.saintic.com/openservice/sentence/shanshui.jianghe.json>`__
- `长江 <https://hub.saintic.com/openservice/sentence/shanshui.changjiang.json>`__
- `黄河 <https://hub.saintic.com/openservice/sentence/shanshui.huanghe.json>`__
- `西湖 <https://hub.saintic.com/openservice/sentence/shanshui.xihu.json>`__
- `瀑布 <https://hub.saintic.com/openservice/sentence/shanshui.pubu.json>`__

天气
----

- `写风 <https://hub.saintic.com/openservice/sentence/tianqi.xiefeng.json>`__
- `写云 <https://hub.saintic.com/openservice/sentence/tianqi.xieyun.json>`__
- `写雨 <https://hub.saintic.com/openservice/sentence/tianqi.xieyu.json>`__
- `写雪 <https://hub.saintic.com/openservice/sentence/tianqi.xiexue.json>`__
- `彩虹 <https://hub.saintic.com/openservice/sentence/tianqi.caihong.json>`__
- `太阳 <https://hub.saintic.com/openservice/sentence/tianqi.taiyang.json>`__
- `月亮 <https://hub.saintic.com/openservice/sentence/tianqi.yueliang.json>`__
- `星星 <https://hub.saintic.com/openservice/sentence/tianqi.xingxing.json>`__

人物
----

- `女子 <https://hub.saintic.com/openservice/sentence/renwu.nvzi.json>`__
- `父亲 <https://hub.saintic.com/openservice/sentence/renwu.fuqin.json>`__
- `母亲 <https://hub.saintic.com/openservice/sentence/renwu.muqin.json>`__
- `老师 <https://hub.saintic.com/openservice/sentence/renwu.laoshi.json>`__
- `儿童 <https://hub.saintic.com/openservice/sentence/renwu.ertong.json>`__

人生
----

- `励志 <https://hub.saintic.com/openservice/sentence/rensheng.lizhi.json>`__
- `哲理 <https://hub.saintic.com/openservice/sentence/rensheng.zheli.json>`__
- `青春 <https://hub.saintic.com/openservice/sentence/rensheng.qingchun.json>`__
- `时光 <https://hub.saintic.com/openservice/sentence/rensheng.shiguang.json>`__
- `梦想 <https://hub.saintic.com/openservice/sentence/rensheng.mengxiang.json>`__
- `读书 <https://hub.saintic.com/openservice/sentence/rensheng.dushu.json>`__
- `战争 <https://hub.saintic.com/openservice/sentence/rensheng.zhanzheng.json>`__

生活
----

- `乡村 <https://hub.saintic.com/openservice/sentence/shenghuo.xiangcun.json>`__
- `田园 <https://hub.saintic.com/openservice/sentence/shenghuo.tianyuan.json>`__
- `边塞 <https://hub.saintic.com/openservice/sentence/shenghuo.biansai.json>`__
- `写桥 <https://hub.saintic.com/openservice/sentence/shenghuo.xieqiao.json>`__

节日
----

- `春节 <https://hub.saintic.com/openservice/sentence/jieri.chunjie.json>`__
- `元宵节 <https://hub.saintic.com/openservice/sentence/jieri.yuanxiaojie.json>`__
- `寒食节 <https://hub.saintic.com/openservice/sentence/jieri.hanshijie.json>`__
- `清明节 <https://hub.saintic.com/openservice/sentence/jieri.qingmingjie.json>`__
- `端午节 <https://hub.saintic.com/openservice/sentence/jieri.duanwujie.json>`__
- `七夕节 <https://hub.saintic.com/openservice/sentence/jieri.qixijie.json>`__
- `中秋节 <https://hub.saintic.com/openservice/sentence/jieri.zhongqiujie.json>`__
- `重阳节 <https://hub.saintic.com/openservice/sentence/jieri.chongyangjie.json>`__

动物
----

- `写鸟 <https://hub.saintic.com/openservice/sentence/dongwu.xieniao.json>`__
- `写马 <https://hub.saintic.com/openservice/sentence/dongwu.xiema.json>`__
- `写猫 <https://hub.saintic.com/openservice/sentence/dongwu.xiemao.json>`__

植物
----

- `梅花 <https://hub.saintic.com/openservice/sentence/zhiwu.meihua.json>`__
- `梨花 <https://hub.saintic.com/openservice/sentence/zhiwu.lihua.json>`__
- `桃花 <https://hub.saintic.com/openservice/sentence/zhiwu.taohua.json>`__
- `荷花 <https://hub.saintic.com/openservice/sentence/zhiwu.hehua.json>`__
- `菊花 <https://hub.saintic.com/openservice/sentence/zhiwu.juhua.json>`__
- `柳树 <https://hub.saintic.com/openservice/sentence/zhiwu.liushu.json>`__
- `叶子 <https://hub.saintic.com/openservice/sentence/zhiwu.yezi.json>`__
- `竹子 <https://hub.saintic.com/openservice/sentence/zhiwu.zhuzi.json>`__

食物
----

- `写酒 <https://hub.saintic.com/openservice/sentence/shiwu.xiejiu.json>`__
- `写茶 <https://hub.saintic.com/openservice/sentence/shiwu.xiecha.json>`__
- `荔枝 <https://hub.saintic.com/openservice/sentence/shiwu.lizhi.json>`__

古籍
----

- `论语 <https://hub.saintic.com/openservice/sentence/guji.lunyu.json>`__
- `史记 <https://hub.saintic.com/openservice/sentence/guji.shiji.json>`__
- `老子 <https://hub.saintic.com/openservice/sentence/guji.laozi.json>`__
- `庄子 <https://hub.saintic.com/openservice/sentence/guji.zhuangzi.json>`__
- `孟子 <https://hub.saintic.com/openservice/sentence/guji.mengzi.json>`__
- `中庸 <https://hub.saintic.com/openservice/sentence/guji.zhongyong.json>`__
- `左传 <https://hub.saintic.com/openservice/sentence/guji.zuozhuan.json>`__
- `六韬 <https://hub.saintic.com/openservice/sentence/guji.liutao.json>`__
- `素书 <https://hub.saintic.com/openservice/sentence/guji.sushu.json>`__
- `礼记 <https://hub.saintic.com/openservice/sentence/guji.liji.json>`__
- `易传 <https://hub.saintic.com/openservice/sentence/guji.yizhuan.json>`__
- `反经 <https://hub.saintic.com/openservice/sentence/guji.fanjing.json>`__
- `墨子 <https://hub.saintic.com/openservice/sentence/guji.mozi.json>`__
- `荀子 <https://hub.saintic.com/openservice/sentence/guji.xunzi.json>`__
- `尚书 <https://hub.saintic.com/openservice/sentence/guji.shangshu.json>`__
- `汉书 <https://hub.saintic.com/openservice/sentence/guji.hanshu.json>`__
- `管子 <https://hub.saintic.com/openservice/sentence/guji.guanzi.json>`__
- `孝经 <https://hub.saintic.com/openservice/sentence/guji.xiaojing.json>`__
- `列子 <https://hub.saintic.com/openservice/sentence/guji.liezi.json>`__
- `吴子 <https://hub.saintic.com/openservice/sentence/guji.wuzi.json>`__
- `将苑 <https://hub.saintic.com/openservice/sentence/guji.jiangyuan.json>`__
- `论衡 <https://hub.saintic.com/openservice/sentence/guji.lunheng.json>`__
- `明史 <https://hub.saintic.com/openservice/sentence/guji.mingshi.json>`__
- `三略 <https://hub.saintic.com/openservice/sentence/guji.sanlve.json>`__
- `宋史 <https://hub.saintic.com/openservice/sentence/guji.songshi.json>`__
- `晋书 <https://hub.saintic.com/openservice/sentence/guji.jinshu.json>`__
- `尔雅 <https://hub.saintic.com/openservice/sentence/guji.erya.json>`__
- `茶经 <https://hub.saintic.com/openservice/sentence/guji.chajing.json>`__
- `国语 <https://hub.saintic.com/openservice/sentence/guji.guoyu.json>`__
- `说苑 <https://hub.saintic.com/openservice/sentence/guji.shuoyuan.json>`__
- `元史 <https://hub.saintic.com/openservice/sentence/guji.yuanshi.json>`__
- `隋书 <https://hub.saintic.com/openservice/sentence/guji.suishu.json>`__
- `宋书 <https://hub.saintic.com/openservice/sentence/guji.songshu.json>`__
- `文子 <https://hub.saintic.com/openservice/sentence/guji.wenzi.json>`__
- `周书 <https://hub.saintic.com/openservice/sentence/guji.zhoushu.json>`__
- `魏书 <https://hub.saintic.com/openservice/sentence/guji.weishu.json>`__
- `梁书 <https://hub.saintic.com/openservice/sentence/guji.liangshu.json>`__
- `陈书 <https://hub.saintic.com/openservice/sentence/guji.chenshu.json>`__
- `金史 <https://hub.saintic.com/openservice/sentence/guji.jinshi.json>`__
- `北史 <https://hub.saintic.com/openservice/sentence/guji.beishi.json>`__
- `辽史 <https://hub.saintic.com/openservice/sentence/guji.liaoshi.json>`__
- `南史 <https://hub.saintic.com/openservice/sentence/guji.nanshi.json>`__
- `知言 <https://hub.saintic.com/openservice/sentence/guji.zhiyan.json>`__
- `中说 <https://hub.saintic.com/openservice/sentence/guji.zhongshuo.json>`__
- `何典 <https://hub.saintic.com/openservice/sentence/guji.hedian.json>`__
- `中论 <https://hub.saintic.com/openservice/sentence/guji.zhonglun.json>`__
- `鬼谷子 <https://hub.saintic.com/openservice/sentence/guji.guiguzi.json>`__
- `菜根谭 <https://hub.saintic.com/openservice/sentence/guji.caigentan.json>`__
- `三国志 <https://hub.saintic.com/openservice/sentence/guji.sanguozhi.json>`__
- `三字经 <https://hub.saintic.com/openservice/sentence/guji.sanzijing.json>`__
- `韩非子 <https://hub.saintic.com/openservice/sentence/guji.hanfeizi.json>`__
- `千字文 <https://hub.saintic.com/openservice/sentence/guji.qianziwen.json>`__
- `战国策 <https://hub.saintic.com/openservice/sentence/guji.zhanguoce.json>`__
- `弟子规 <https://hub.saintic.com/openservice/sentence/guji.dizigui.json>`__
- `金刚经 <https://hub.saintic.com/openservice/sentence/guji.jingangjing.json>`__
- `伤寒论 <https://hub.saintic.com/openservice/sentence/guji.shanghanlun.json>`__
- `红楼梦 <https://hub.saintic.com/openservice/sentence/guji.hongloumeng.json>`__
- `淮南子 <https://hub.saintic.com/openservice/sentence/guji.huainanzi.json>`__
- `商君书 <https://hub.saintic.com/openservice/sentence/guji.shangjunshu.json>`__
- `后汉书 <https://hub.saintic.com/openservice/sentence/guji.houhanshu.json>`__
- `罗织经 <https://hub.saintic.com/openservice/sentence/guji.luozhijing.json>`__
- `传习录 <https://hub.saintic.com/openservice/sentence/guji.chuanxilu.json>`__
- `西游记 <https://hub.saintic.com/openservice/sentence/guji.xiyouji.json>`__
- `司马法 <https://hub.saintic.com/openservice/sentence/guji.simafa.json>`__
- `尉缭子 <https://hub.saintic.com/openservice/sentence/guji.weiliaozi.json>`__
- `水浒传 <https://hub.saintic.com/openservice/sentence/guji.shuihuzhuan.json>`__
- `逸周书 <https://hub.saintic.com/openservice/sentence/guji.yizhoushu.json>`__
- `新唐书 <https://hub.saintic.com/openservice/sentence/guji.xintangshu.json>`__
- `旧唐书 <https://hub.saintic.com/openservice/sentence/guji.jiutangshu.json>`__
- `镜花缘 <https://hub.saintic.com/openservice/sentence/guji.jinghuayuan.json>`__
- `南齐书 <https://hub.saintic.com/openservice/sentence/guji.nanqishu.json>`__
- `人物志 <https://hub.saintic.com/openservice/sentence/guji.renwuzhi.json>`__
- `列女传 <https://hub.saintic.com/openservice/sentence/guji.lienvzhuan.json>`__
- `三十六计 <https://hub.saintic.com/openservice/sentence/guji.sanshiliuji.json>`__
- `黄帝内经 <https://hub.saintic.com/openservice/sentence/guji.huangdineijing.json>`__
- `资治通鉴 <https://hub.saintic.com/openservice/sentence/guji.zizhitongjian.json>`__
- `世说新语 <https://hub.saintic.com/openservice/sentence/guji.shishuoxinyu.json>`__
- `吕氏春秋 <https://hub.saintic.com/openservice/sentence/guji.lvshichunqiu.json>`__
- `增广贤文 <https://hub.saintic.com/openservice/sentence/guji.zengguangxianwen.json>`__
- `了凡四训 <https://hub.saintic.com/openservice/sentence/guji.liaofansixun.json>`__
- `文心雕龙 <https://hub.saintic.com/openservice/sentence/guji.wenxindiaolong.json>`__
- `百战奇略 <https://hub.saintic.com/openservice/sentence/guji.baizhanqilve.json>`__
- `孙膑兵法 <https://hub.saintic.com/openservice/sentence/guji.sunbinbingfa.json>`__
- `声律启蒙 <https://hub.saintic.com/openservice/sentence/guji.shenglvqimeng.json>`__
- `幼学琼林 <https://hub.saintic.com/openservice/sentence/guji.youxueqionglin.json>`__
- `三国演义 <https://hub.saintic.com/openservice/sentence/guji.sanguoyanyi.json>`__
- `颜氏家训 <https://hub.saintic.com/openservice/sentence/guji.yanshijiaxun.json>`__
- `围炉夜话 <https://hub.saintic.com/openservice/sentence/guji.weiluyehua.json>`__
- `贞观政要 <https://hub.saintic.com/openservice/sentence/guji.zhenguanzhengyao.json>`__
- `孔子家语 <https://hub.saintic.com/openservice/sentence/guji.kongzijiayu.json>`__
- `黄帝四经 <https://hub.saintic.com/openservice/sentence/guji.huangdisijing.json>`__
- `聊斋志异 <https://hub.saintic.com/openservice/sentence/guji.liaozhaizhiyi.json>`__
- `小窗幽记 <https://hub.saintic.com/openservice/sentence/guji.xiaochuangyouji.json>`__
- `公孙龙子 <https://hub.saintic.com/openservice/sentence/guji.gongsunlongzi.json>`__
- `浮生六记 <https://hub.saintic.com/openservice/sentence/guji.fushengliuji.json>`__
- `朱子家训 <https://hub.saintic.com/openservice/sentence/guji.zhuzijiaxun.json>`__
- `随园诗话 <https://hub.saintic.com/openservice/sentence/guji.suiyuanshihua.json>`__
- `警世通言 <https://hub.saintic.com/openservice/sentence/guji.jingshitongyan.json>`__
- `醒世恒言 <https://hub.saintic.com/openservice/sentence/guji.xingshihengyan.json>`__
- `太平御览 <https://hub.saintic.com/openservice/sentence/guji.taipingyulan.json>`__
- `新五代史 <https://hub.saintic.com/openservice/sentence/guji.xinwudaishi.json>`__
- `喻世明言 <https://hub.saintic.com/openservice/sentence/guji.yushimingyan.json>`__
- `旧五代史 <https://hub.saintic.com/openservice/sentence/guji.jiuwudaishi.json>`__
- `金匮要略 <https://hub.saintic.com/openservice/sentence/guji.jinkuiyaolve.json>`__
- `明儒学案 <https://hub.saintic.com/openservice/sentence/guji.mingruxuean.json>`__

.. _hub-sentence-usage:

-  **使用方法:**

    -  对于txt、json等格式，可以通过ajax调用。

    -  对于svg，可以使用\ ``<img src="">``\ 引用，img中可以写行内样式。

    -  对于svg，可以使用inline-style参数，返回svg文本，通过ajax调用html方法写入页面中，例如：

.. code-block:: html

    <div id="svg"></div>
    <script>
        $.ajax({
            url: "https://hub.saintic.com/openservice/sentence/all.svg?has-url=true&inline-style=true&font-size=16",
            type: "GET",
            success: function (res) {
                $("#svg").html(res);
            }
        });
    </script>

