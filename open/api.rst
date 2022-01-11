.. _openapi:

=======
OpenAPI
=======

`诏预开放平台 <https://open.saintic.com>`_ 对外开放的接口，以下接口基于域名
**https://open.saintic.com** 提供服务（节选部分需要提供详细说明的接口）。

Pay
===

部分开放的接口匿名、登录用户均有一定的免费额度，对个人一般场景也足够使用，
不过针对高频用户可能需要提升额度，故也提供付费升级。

鉴于实际情况，个人暂时无法提供企业级在线收付款接口，故此如有需求请通过微信、支付宝等方式
转账或发送红包。

.. _openapi-pay-contact:

联系方式：
-----------

- 邮箱：**me@tcw.im**
- 微信/QQ：**1663116375**
- “ 请添加 *saintic*、*开放平台*、*付费* 等备注字样之一 ”

.. _openapi-pay-method:

支付方式：
-----------

- 支付宝口令红包
- 支付宝转账：**me@tcw.im**
- 微信/QQ转账：**1663116375**

.. _openapi-pay-note:

支付说明：
-----------

根据不同模块、不同规格需要付费金额亦不相同，按模块计费，内部接口共享额度，
具体规则参考模块内付费规则。

支付后请联系并提供自己的 **UID**
（登录：`开放平台-控制台 <https://open.saintic.com/control/>`_ 查看我的信息），
如有特别说明请一并留言。

.. _openapi-terms:

服务条款：
-----------

1. 由于个人维护，不保证 `7*24` 服务在线，但故障会及时处理。
2. 拒绝为黄赌毒及涉嫌违规违法网站使用，一经发现会立即禁用服务，且不予退款！
3. 如不同意本条款请停止使用，如继续使用则视为同意；本条款适时修改，即时生效。

SEC
===

此模块名为 Search Engine Collector，即搜索引擎收录查询器，简写为 **SEC** ，
目前包括百度、必应（Bing）收录查询，后续计划增加搜狗收录查询。

接口匿名、登录状态有速率限制，登录态请使用 `Authorization`
请求头传递API密钥（请登录平台后在控制台生成，SEC相关接口只读权限即可）。

由于目前发现的百度查询触发验证，接口也相应限制，一般个人使用量应该满足，
而对较大需求量推出付费方式，也尝试弥补服务器费用。

SEC相关接口请求成功时都会返回 *deduct* 字段表示计次：
包月方式计次消耗的是每天最大上限；按次方式消耗的是总额度。

.. _sec-rule:

规则：
------

付费方式：按次、包月

计费规则：按次是一次一分钱，包月则分级给量

规则详情：

1. 包月方式分级（月按 30 天计算，年按 365 天计算）：

  - 初级档位：**￥15/月**，最大限制每天 100 次
  - 中级档位：**￥30/月**，最大限制每天 1000 次
  - 高级档位：**￥50/月**，最大限制每天 10000 次
  - “ 支持连续包月，比如金额￥30，联系并留言需要2个月，即提服60天 ”

2. 按次方式：请求限制 *每分钟 120 次*，按金额（分）等量换算为次数，最大使用时长一年，过期作废。

3. 命中缓存不计次：查询URL时如果收录会写入缓存，后续查询则直接返回已收录。

sec.baidu
-------------

.. http:get:: /api/BaiduIncludedQuery

  百度收录查询接口

  :query string url: 要查询的URL地址，要以http或https开头
  :query string method: 查询的方法，可选值json、html，默认先后使用json和html共同查询
  :query boolean force: 是否强制刷新缓存后再查询收录状态，此必会计次
  :resjson boolean Included: 表示是否收录
  :resjson boolean success: 表示请求是否成功、有无异常，与 **Included** 无直接关系！
  :resjson boolean deduct: 表示是否计次
  :resjson string url: 返回解析后的查询URL地址
  :resjson string msg: 未收录时
  :statuscode 429: 请求速率达到限制

  **示例：**

  .. http:example:: curl python-requests

    GET /api/BaiduIncludedQuery HTTP/1.0
    Host: open.saintic.com
    Authorization: Token <API-Key>

    :query url: https://www.saintic.com


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "Included": true,
        "success": true,
        "deduct": true,
        "msg": null,
        "url": "https://www.saintic.com/"
    }

sec.bing
-----------

.. http:get:: /api/BingIncludedQuery

  必应（Bing）收录查询接口

  :query string url: 要查询的URL地址，要以http或https开头
  :query string method: 查询的方法，可选值rss、html，默认先后使用rss和html共同查询
  :query boolean force: 是否强制刷新缓存后再查询收录状态，此必会计次
  :resjson boolean Included: 表示是否收录
  :resjson boolean success: 表示请求是否成功、有无异常，与 **Included** 无直接关系！
  :resjson boolean deduct: 表示是否计次
  :resjson string url: 返回解析后的查询URL地址
  :resjson string msg: 未收录时
  :statuscode 429: 请求速率达到限制

  **示例：**

  .. http:example:: curl python-requests

    GET /api/BingIncludedQuery HTTP/1.0
    Host: open.saintic.com
    Authorization: Token <API-Key>

    :query url: https://www.saintic.com


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "Included": true,
        "success": true,
        "deduct": true,
        "msg": null,
        "url": "https://www.saintic.com/"
    }
