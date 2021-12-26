.. _openapi:

=======
OpenAPI
=======

`诏预开放平台 <https://open.saintic.com>`_ 对外开放的接口，以下接口基于域名
**https://open.saintic.com** 提供服务。

SEC
===

Search Engine Collector，简写SEC，即搜索引擎收录查询器。

包括百度、Bing收录查询，后续计划增加搜狗收录查询。

接口匿名、登录状态有速率限制，登录态请使用 `Authorization`
请求头传递API密钥（请登录平台后在控制台生成，SEC相关接口只需要读权限即可）。

由于目前发现的百度查询触发验证，接口也相应限制，一般个人使用量应该满足，
而对较大需求量推出付费方式，也尝试弥补服务器费用。

付费方式可包月和按次，具体规则请到平台的控制台查看。

SEC相关接口请求成功时都会返回 *deduct* 字段表示计次：
包月方式计次消耗的是每天最大上限；按次方式消耗的是总额度。

1. sec.baidu
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

1. sec.bing
-----------

.. http:get:: /api/BingIncludedQuery

  必应（bing）收录查询接口

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
