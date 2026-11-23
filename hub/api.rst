.. _hub-api:

==================================
开放服务 API 文档（已迁至站内）
==================================

``/openservice``、``/openapi`` 的接口文档已统一迁至站点内的 **API 文档与
调试台**。在那里可以查看每个接口的参数、取值、返回结构与示例，并直接发起
调试请求：

- `API 文档与调试台 <https://hub.saintic.com/playground>`__

接口文档的唯一权威来源是 openhub 仓库的 ``src/libs/apidoc.py``；本文档站
不再重复维护接口参数、返回结构与示例，避免多处维护产生偏差。

.. _hub-api-terms:

调用约定
==========

- ``/openservice`` 拒绝空 User-Agent 与常见爬虫 UA（403）；
- ``/openapi`` 全部接口按 IP 限速 120 次/分钟，超限返回 429，并从响应头
  ``X-RateLimit-Limit`` / ``-Remaining`` / ``-Reset`` 读取配额；
- 需要 API 密钥的接口在请求头携带 ``Authorization: Bearer 密钥``\ （省略
  Bearer 前缀亦可），密钥在站点「控制台」的「API 密钥」中创建；
- 图片、SVG、m3u8 等非 JSON 响应可直接作为 img 标签的 src 或 a 标签的
  href 使用，浏览器与第三方客户端均可访问。

各模块的接入与操作指南已统一迁入站点本身，如 IPAM 见
`/docs/ipam <https://hub.saintic.com/docs/ipam>`__、飞书群备份见
`/docs/feishu <https://hub.saintic.com/docs/feishu>`__、WebDAV 见
`/webdav_control <https://hub.saintic.com/webdav_control>`__、SSL 证书见
`/cert <https://hub.saintic.com/cert>`__。
