.. _hub-api:

==========================
开放服务API接口文档
==========================

地址前缀：https://hub.saintic.com/openservice

说明：对外开放的公开接口集合，无需登录即可调用（个别接口除外）。

.. note::

    2025/4/1 开启策略：空 User-Agent 访问此前缀下接口直接返回 403 http status_code；
    命中爬虫 UA 特征同样返回 403。

.. _hub-api-sentence:

古诗词文名句
==============

随机返回一句古诗词文中的名句，支持按作者、主题、分类组合查询，返回 json、txt、svg 三种格式。

.. http:get:: /openservice/sentence/(string:rule)

   随机返回古诗词名句

   :query string rule: 规则串，格式 ``author.theme.catalog.suffix``，各段留空或 ``all`` 表示随机
   :query boolean has-url: svg 格式下是否显示名句原文链接，可选 true、on、1
   :query number letter-spacing: svg 字体间隔（px），默认 1.5，合法范围 [0-30]
   :query string text-decoration: svg 文本修饰，可选 none、underline、overline 等
   :query string fill: svg 文本颜色，比如 red、#f00
   :query number fill-opacity: svg 外观透明度，合法范围 [0-1]
   :query string font-family: svg 字体系列，建议使用字体英文名称，比如 Kaiti
   :query string font-weight: svg 字体粗细，可选 normal、bold、数值等
   :query number font-size: svg 字体大小（px），默认 20，合法范围 [8,50]
   :query boolean inline-style: svg 是否内联样式，开启后仅返回 svg 纯文本内容
   :resjson boolean success: 表示请求是否成功
   :resjson object data: 名句数据（suffix 为 json 时）
   :resjson string message: 异常消息（success 不为 true 时）
   :statuscode 200: 请求成功
   :statuscode 403: 空 User-Agent 或爬虫 UA

   规则中 ``suffix`` 支持 json、txt、svg，默认 json。

   示例：

   .. code-block:: text

       https://hub.saintic.com/openservice/sentence/all.json
       https://hub.saintic.com/openservice/sentence/aiqing.svg
       https://hub.saintic.com/openservice/sentence/shuqing.aiqing.json
       https://hub.saintic.com/openservice/sentence/sushi.shuqing.aiqing.json
       https://hub.saintic.com/openservice/sentence/guji.lunyu.json

完整的 RULE 规则与公开主题、子分类清单，请参阅 :ref:`hub-sentence` 。

.. _hub-api-ip:

IP查询
========

根据 IP 查询归属地等信息，或获取客户端真实出口 IP。

.. http:get:: /openservice/ip/(string:module)

   IP 查询接口

   :param string module: 子模块，可选 ``myip`` （客户端真实IP）、``addr`` （归属地纯文本）、``rest`` （完整信息 JSON）
   :query string ip: 要查询的 IP 地址，仅 ``addr``、``rest`` 需要，留空则取请求来源 IP
   :statuscode 200: 请求成功
   :statuscode 400: 子模块非法或 IP 地址未取到

   ``myip`` 返回纯文本 IP；``addr`` 返回纯文本归属地，格式如下：

   ::

       IP：1.2.3.4
       国家/地区：中国
       省份：北京
       城市：北京
       运营商：联通

   ``rest`` 返回 JSON，示例：

   .. code-block:: json

       {
           "success": true,
           "data": {
               "country": "中国",
               "province": "北京",
               "city": "北京",
               "isp": "联通"
           }
       }

   示例：

   .. code-block:: text

       https://hub.saintic.com/openservice/ip/myip
       https://hub.saintic.com/openservice/ip/addr?ip=1.2.3.4
       https://hub.saintic.com/openservice/ip/rest

.. _hub-api-bingpic:

Bing每日壁纸
==============

获取 Bing 官方每日背景图片，结果采用「Redis + 数据库」双层缓存。

.. http:get:: /openservice/bingpic

   Bing 每日壁纸接口

   :query string d: 日期，格式 YYYYMMDD，留空取当日；传 ``random`` 随机取一个历史日期
   :query string p: 图片尺寸，默认 ``1080p``
   :query boolean mobile: 带此参数表示取移动端尺寸，无值参数
   :query boolean json: 带此参数返回 JSON，无值参数；也可通过请求头 ``Accept: application/json`` 触发
   :statuscode 200: 返回 JSON（开启 json 时）
   :statuscode 302: 默认行为，重定向到图片地址

   默认返回 302 跳转到图片地址，开启 ``json`` 时返回：

   .. code-block:: json

       {
           "success": true,
           "data": "https://cn.bing.com/th?id=OHR.xxx_1920x1080.jpg"
       }

   示例：

   .. code-block:: text

       https://hub.saintic.com/openservice/bingpic
       https://hub.saintic.com/openservice/bingpic?d=random
       https://hub.saintic.com/openservice/bingpic?json
       https://hub.saintic.com/openservice/bingpic?mobile&p=720p

.. _hub-api-konachanpic:

K站随机动漫壁纸
==================

请求 konachan 官方 API 获取随机动漫图片，优先返回桌面尺寸（宽 >= 1920 且高 >= 1080）的图片。

.. http:get:: /openservice/konachanpic

   K站随机动漫壁纸接口

   :query boolean r18: 带此参数切换到 R18 站点域名（默认非 R18），无值参数
   :query boolean random: 带此参数从历史数据库记录中随机读取，无值参数
   :query boolean json: 带此参数返回 JSON，无值参数；也可通过请求头 ``Accept: application/json`` 触发
   :statuscode 200: 返回 JSON（开启 json 时）
   :statuscode 302: 默认行为，重定向到图片地址

   若站点配置了 sapic 图床，图片会转存后返回国内可直接访问的地址，否则降级返回 konachan 原图直链。

   示例：

   .. code-block:: text

       https://hub.saintic.com/openservice/konachanpic
       https://hub.saintic.com/openservice/konachanpic?random
       https://hub.saintic.com/openservice/konachanpic?json

.. _hub-api-crontab:

Crontab运行时间计算
======================

计算给定定时任务表达式的下几次或上几次运行时间。

.. http:get:: /openservice/crontab

   Crontab 表达式运行时间计算接口

   :query string expression: 定时任务时间表达式，必填，需为合法 cron 表达式
   :query int query_times: 查询几条结果，默认 1，合法范围 [1, 32]
   :query string query_type: 查询方向，``next``（之后）或 ``prev``（之前），默认 ``next``
   :query string format_time: 时间格式化串，默认 ``%Y-%m-%d %H:%M:%S``
   :statuscode 200: 请求成功
   :statuscode 400: 表达式非法或参数超出范围

   示例：

   .. code-block:: text

       https://hub.saintic.com/openservice/crontab?expression=*/5 * * * *
       https://hub.saintic.com/openservice/crontab?expression=0 0 * * *&query_times=5&query_type=next

.. _hub-api-iptv:

IPTV直播源
============

返回已过滤的国内 IPTV 直播源 m3u8 播放列表（源数据来自上游公开仓库，已剔除无效与响应超时的频道）。

.. http:get:: /openservice/iptv.m3u8

   IPTV 直播源接口

   :statuscode 200: 返回 m3u8 播放列表文本
   :statuscode 500: 上游源拉取失败

   响应头 ``Content-Type: text/plain; charset=utf-8``，可直接作为播放器的订阅地址使用。


