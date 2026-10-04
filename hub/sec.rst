.. _hub-sec:

==============================
搜索引擎收录查询接口
==============================

此模块名为 Search Engine Collector，即搜索引擎收录查询器，简写为 **SEC**，
目前包括百度、必应（Bing）收录查询。

API 地址前缀：https://hub.saintic.com/api/sec

页面地址：https://hub.saintic.com/sec

搜索引擎有查询验证，故此接口也有速率限制，匿名、登录用户、付费用户额度不同：

.. list-table::
   :header-rows: 1
   :widths: 25 25 25 25

   * - 身份
     - 免费额度
     - 限速
     - 计费
   * - 匿名（未登录）
     - 5 次/天
     - ``5/day`` （按 IP）
     - 不计费
   * - 登录未付费
     - 20 次/天
     - ``20/day`` （按 UID）
     - 不计费
   * - 包年包月（prepaid）
     - 按档位每日上限
     - 按档位每日上限
     - 本地日计数
   * - 按量付费（postpaid）
     - 按余额，无每日上限
     - ``120/minute``
     - 每次 ￥0.01

.. note::

   命中缓存不计次：查询 URL 若已收录会写入缓存，后续查询直接返回“已收录”并且不计次；
   带 ``force`` 参数强制刷新缓存时必会计次。

.. _hub-sec-auth:

接口认证
==========

支持 **url query** 和 **header token** 两种认证方式，只读权限密钥即可。

匿名（不带任何认证）亦可调用，但仅享受匿名免费额度且不可付费。

认证方式详见 :ref:`hub-auth` 。

.. _hub-sec-rule:

付费规则
==========

SEC 相关接口请求成功时都会返回 ``deduct`` 字段表示本次是否计次。

付费方式：按次（postpaid）、包月（prepaid）

.. list-table::
   :header-rows: 1
   :widths: 20 20 30 30

   * - 付费方式
     - 档位
     - 价格
     - 额度
   * - 按次
     - —
     - ￥0.01/次
     - 按账户余额，无每日上限
   * - 包月
     - plus
     - ￥10
     - 100 次/天
   * - 包月
     - pro
     - ￥30
     - 500 次/天
   * - 包月
     - max
     - ￥50
     - 1000 次/天

规则详情：

- 包月方式按档位给量，超出当日上限返回 429；日计数按北京时间自然日，次日 0 点重置。
- 按次方式请求限制每分钟 120 次，按金额（分）等量换算为次数。
- 档位与价格以费用服务（pcs）登记为准，站点只按 **档位名次** 映射额度。
- 开通请联系管理员在费用后台录入，充值、续期同样由管理员受理；可在控制台「我的付费状态」查看。

.. _hub-sec-baidu:

百度收录查询
==============

.. http:get:: /api/sec/baidu

   百度收录查询接口

   :query string url: 要查询的 URL 地址，必填，要以 http 或 https 开头
   :query string method: 查询方法，可选 ``json``、``html``，默认先后使用两者共同查询
   :query boolean force: 是否强制刷新缓存后再查询收录状态，传 1、true、yes 等真值；此必会计次
   :resjson boolean Included: 表示是否收录
   :resjson boolean success: 表示请求是否成功、有无异常，与 **Included** 无直接关系
   :resjson boolean deduct: 表示本次是否计次
   :resjson string url: 返回解析后的查询 URL 地址
   :resjson string msg: 异常或未收录时的说明
   :statuscode 200: 请求成功
   :statuscode 400: url 为空、非法或 method 不在白名单
   :statuscode 403: 域名命中黑名单
   :statuscode 429: 请求速率达到限制或今日额度已用完
   :statuscode 502: 收录查询后端未配置或异常

   **示例1（Header认证）：**

   .. http:example:: curl python-requests

       GET /api/sec/baidu HTTP/1.0
       Host: hub.saintic.com
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

   **示例2（URL Query认证）：**

   .. http:example:: curl python-requests

       GET /api/sec/baidu HTTP/1.0
       Host: hub.saintic.com

       :query url: https://www.saintic.com
       :query token: urlsafe_base64_encode_API-KEY


       HTTP/1.0 200 OK
       Content-Type: application/json

       {
           "Included": true,
           "success": true,
           "deduct": false,
           "msg": null,
           "url": "https://www.saintic.com/"
       }

.. _hub-sec-bing:

必应（Bing）收录查询
======================

.. http:get:: /api/sec/bing

   必应（Bing）收录查询接口

   :query string url: 要查询的 URL 地址，必填，要以 http 或 https 开头
   :query string method: 查询方法，可选 ``rss``、``html``，默认先后使用两者共同查询
   :query boolean force: 是否强制刷新缓存后再查询收录状态，传 1、true、yes 等真值；此必会计次
   :resjson boolean Included: 表示是否收录
   :resjson boolean success: 表示请求是否成功、有无异常，与 **Included** 无直接关系
   :resjson boolean deduct: 表示本次是否计次
   :resjson string url: 返回解析后的查询 URL 地址
   :resjson string msg: 异常或未收录时的说明
   :statuscode 200: 请求成功
   :statuscode 400: url 为空、非法或 method 不在白名单
   :statuscode 403: 域名命中黑名单
   :statuscode 429: 请求速率达到限制或今日额度已用完
   :statuscode 502: 收录查询后端未配置或异常

   **示例1（Header认证）：**

   .. http:example:: curl python-requests

       GET /api/sec/bing HTTP/1.0
       Host: hub.saintic.com
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

   **示例2（URL Query认证）：**

   .. http:example:: curl python-requests

       GET /api/sec/bing HTTP/1.0
       Host: hub.saintic.com

       :query url: https://www.saintic.com
       :query token: urlsafe_base64_encode_API-KEY


       HTTP/1.0 200 OK
       Content-Type: application/json

       {
           "Included": true,
           "success": true,
           "deduct": true,
           "msg": null,
           "url": "https://www.saintic.com/"
       }

.. _hub-sec-note:

说明
======

- URL 会被规范化为 ``scheme://netloc/path``，即去掉查询串与锚点后再查询。
- 命中黑名单的域名返回 403，并累加该域名的命中次数。
- 收录查询由后端 se-collector 实际抓取判定，Hub 自身只做鉴权、限速与计费。
- 计费失败不会阻断已返回的结果，仅记录日志供对账；整体不可用时自动退回免费额度。
