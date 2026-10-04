.. _hub:

======================
诏预开放服务Hub文档
======================

地址：https://hub.saintic.com

说明：Open Service Hub（开放服务聚合平台），把自用的若干小服务收拢到同一个站点与域名下，
统一提供 **对外 API**、个人控制台与配套服务。

原 `开放平台 <https://open.saintic.com>`_ 的接口已全量迁移至此，本目录为新平台的使用文档。

.. toctree::
    :maxdepth: 2

    api
    sentence
    sec
    danmu
    feishubak
    crawlhuaban
    tdi/index
    tdi-php/index
    tdi-node/index
    tdi-go/index

.. _hub-modules:

功能模块
==========

.. list-table::
   :header-rows: 1
   :widths: 32 68

   * - 模块
     - 说明
   * - 开放服务 ``/openservice/*``
     - 随机名句、Bing 壁纸、K站随机图、IP 定位、Cron 计算器、IPTV 直播源
   * - 搜索引擎收录查询 ``/api/sec/*``
     - 检测 URL 是否被百度、Bing 收录，支持按量、包月付费
   * - 画板下载 ``/CrawlHuaban/*``
     - 花瓣、堆糖画板打包下载，由第三方 Tdi 承担打包任务
   * - 飞书群备份 ``/feishu``
     - 用户配置自己的飞书自建应用与备份群，多群消息备份（买断制付费）
   * - 弹幕服务 ``/api/danmu/*``
     - 弹幕库搜索、导入与任务查询（Token 由控制台管理）
   * - 短网址 ``/api/shorturl/*``
     - 创建与还原短链
   * - RTFD 文档构建 ``/openservice/rtfd/*``
     - Sphinx 文档构建服务代理
   * - 个人控制台 ``/control``
     - API 密钥、弹幕 Token、短网址、画板下载、我的付费状态

.. _hub-auth:

接口认证
==========

需要登录用户身份的接口，统一使用 **API 密钥** 认证，支持三种传递方式：

1. **Header Token** （推荐，适用于 GET/POST）

   格式：``Authorization: Token 密钥原文`` 或 ``Authorization: Bearer 密钥原文``

2. **POST Form** （适用于 POST 请求）

   格式：请求体中的 ``token`` 字段，值为密钥原文

3. **URL Query** （适用于 GET/POST，方便但不安全）

   格式：查询参数 ``token``，值为 **密钥原文进行 URL 安全的 base64 编码** 后的串

API 密钥在 `控制台 <https://hub.saintic.com/control/>`__ 的「我的API密钥」中创建，
支持只读、读写两种权限，每用户最多创建 5 个。

.. _hub-terms:

服务条款
==========

- 由于个人维护，不保证 7*24 服务在线，但故障会及时处理。
- 拒绝为黄赌毒及涉嫌违规违法网站使用，一经发现会立即禁用服务，且不予退款！
- 请求速率限制后，大量或短时间内大量请求会被认为 DDOS，从而短暂或永久封禁来源 IP。
- 如不同意本条款请停止使用，如继续使用则视为同意；本条款适时修改，即时生效。

.. note::

    开放服务（``/openservice/*``）统一拒绝 **空 User-Agent** 与 **爬虫 User-Agent** 的请求，
    直接返回 403 http status_code，调用时请务必设置自己的 UA。
