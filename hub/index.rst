.. _hub:

======================
诏预开放服务Hub文档
======================

地址：https://hub.saintic.com

说明：Open Service Hub（开放服务聚合平台），把自用的若干小服务收拢到同一个站点与域名下，
统一提供 **对外 API**、个人控制台与配套服务。

原 `开放平台 <https://open.saintic.com>`_ 的接口已全量迁移至此，本目录为新平台的使用文档。

.. note::

   对外开放接口的参数、返回结构与在线调试统一在站点的
   `API 文档与调试台 <https://hub.saintic.com/playground>`__ 维护（唯一权威来源，
   取自 openhub 仓库的 ``src/libs/apidoc.py``）；本目录只保留各模块的接入与操作
   指南、数据索引（如名句主题清单）与跨接口的调用约定。

.. toctree::
    :maxdepth: 2

    sentence
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
     - 随机名句、Bing 壁纸、K站随机图、Wallhaven 壁纸、IP 定位、Cron 计算器、IPTV 直播源
   * - 搜索引擎收录查询 ``/api/sec/*``
     - 检测 URL 是否被百度、Bing 收录，支持按量、包月付费（价格见
       `付费说明 <https://hub.saintic.com/docs/fee>`__ ）
   * - 画板下载 ``/CrawlHuaban/*``
     - 花瓣、堆糖画板打包下载，由第三方 Tdi 承担打包任务；使用说明（含 Tdi 接入）
       见 :ref:`hub-crawlhuaban`
   * - 飞书群备份 ``/feishu``
     - 用户配置自己的飞书自建应用与备份群，多群消息备份（买断制付费）；
       配置指南见 `站内使用文档 <https://hub.saintic.com/docs/feishu>`__
   * - 弹幕服务 ``/api/danmu/*``
     - 弹幕库搜索、导入与任务查询（Token 由控制台管理）
   * - WebDAV 网盘 ``/webdav``
     - 为每位登录用户提供独立、隔离的 WebDAV 目录，支持 rclone / 资源管理器 / 访达等多客户端挂载；
       接入说明与客户端配置见 `站点页面 <https://hub.saintic.com/webdav_control>`__
   * - SSL 证书服务 ``/cert``
     - 由内嵌 ACME + dns-lexicon 提供免费证书签发：**私钥在浏览器本地生成**，hub 仅接收 CSR 并借 DNS-01 / HTTP-01 挑战签发，全程不存储用户公私钥；多用户按账号隔离，支持到期前 30/15/7 天续期提醒；
       操作台见 `站点页面 <https://hub.saintic.com/cert>`__
   * - 短网址 ``/api/shorturl/*``
     - 创建与还原短链
   * - RTFD 文档构建 ``/openservice/rtfd/*``
     - Sphinx 文档构建服务代理
   * - IPAM 地址池 ``/ipam``
     - 以 CIDR 为地址池划分子网，提供占用图、空闲块、利用率与冲突检测、地址观测对照；
       **临时划分免登录**，保存地址池需登录（免费额度内不收费，超出按量计费）；
       使用说明见 `站内文档 <https://hub.saintic.com/docs/ipam>`__，操作台见
       `站点页面 <https://hub.saintic.com/ipam>`__
   * - 我的费用 ``/fee``
     - 各模块付费状态与 **自助下单**\ （生成付款标识码 → 线下转账并备注 → 上传转账截图 →
       审核入账），另有订单进度与 `费用流水 <https://hub.saintic.com/fee/logs>`__ ；
       付费规则、价格与流程见 `付费说明 <https://hub.saintic.com/fee/docs>`__
   * - 个人控制台 ``/control``
     - API 密钥、弹幕 Token、短网址、画板下载、我的付费状态

.. _hub-auth:

接口认证
==========

需要登录用户身份的接口，统一使用 **API 密钥** 认证，支持三种传递方式：

1. **Header Token**\ （推荐，适用于 GET/POST）

   格式：``Authorization: Token 密钥原文`` 或 ``Authorization: Bearer 密钥原文``

2. **POST Form**\ （适用于 POST 请求）

   格式：请求体中的 ``token`` 字段，值为密钥原文

3. **URL Query**\ （适用于 GET/POST，方便但不安全）

   格式：查询参数 ``token``，值为 **密钥原文进行 URL 安全的 base64 编码** 后的串

API 密钥在 `控制台 <https://hub.saintic.com/control/>`__ 的「我的API密钥」中创建，
支持只读、读写两种权限，每用户最多创建 5 个。

.. _hub-terms:

服务条款
==========

- 本站由个人维护，不承诺 7×24 小时可用性；出现故障会尽快处理。
- 不提供用于赌博、色情、毒品等违法违规用途的服务；一经发现立即停用，已支付费用不予退还。
- 超过速率限制，或在短时间内发起大量请求，将被视为异常流量（DDOS），
  可能临时或永久封禁来源 IP。
- 如不同意本条款请停止使用，继续使用即视为同意；本条款可能适时修订并在站点公告，
  修订后即时生效。

.. note::

    开放服务（``/openservice/*``）统一拒绝 **空 User-Agent** 与 **爬虫 User-Agent** 的请求，
    直接返回 403 http status_code，调用时请务必设置自己的 UA。
