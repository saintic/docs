.. _hub-danmu:

======================
弹幕服务
======================

此模块提供弹幕库（Danmu）的搜索、导入与任务查询能力，底层对接独立的弹幕服务
（misaka_danmu_server）。所有接口需 **登录后** 调用，统一使用 **API 密钥** 认证
（方式见 :ref:`hub-auth`）。

API 地址前缀：https://hub.saintic.com/api/danmu

页面地址：https://hub.saintic.com/danmu

.. note::

   弹幕服务的每日调用额度由弹幕服务侧执行，Hub 仅做鉴权与转发，不做计量与限额。
   弹幕 Token 在个人控制台（``/control`` 弹幕区）创建，创建后获得的公开调用地址
   形如 ``{弹幕服务域名}/api/v1/{token}``，客户端用它访问弹幕服务。

.. _hub-danmu-billing:

付费规则
==========

弹幕库为 **买断制（lifetime）** 模块：

* 登录未买断：免费 **100 次/日**
* 买断（lifetime）：**￥9.9**，额度 **1000 次/日**

买断后在控制台创建/刷新的 Token 自动拥有买断额度；额度在弹幕服务侧执行，Hub 在
三处把付费状态同步至弹幕服务（创建 Token、每日定时同步、付费回调），付费状态
无法确认时降级为免费额度。

.. _hub-danmu-library:

弹幕库列表 / 搜索
===================

.. http:get:: /api/danmu/library

   获取已导入的弹幕库列表，或按关键字搜索弹幕库。

   :query string keyword: 搜索关键字，留空则返回全部弹幕库
   :statuscode 200: 请求成功
   :statuscode 502: 弹幕服务不可用

.. _hub-danmu-search:

媒体搜索
==========

.. http:get:: /api/danmu/search

   从外部数据源搜索影视媒体，用于后续导入弹幕库。

   :query string keyword: 搜索关键词，必填
   :query int season: 季数，可选
   :query string episode: 集数，可选
   :statuscode 200: 请求成功
   :statuscode 400: 缺少关键词
   :statuscode 502: 搜索失败

.. _hub-danmu-import:

导入弹幕库
============

.. http:post:: /api/danmu/import

   将媒体搜索结果直接导入为弹幕库，导入为异步任务。

   :reqjson string searchId: 搜索结果 ID，必填
   :reqjson int result_index: 结果序号，必填
   :reqjson int tmdbId: TMDB ID，可选
   :reqjson int tvdbId: TVDB ID，可选
   :statuscode 200: 已创建导入任务
   :statuscode 400: 缺少必填参数

.. _hub-danmu-tasks:

导入任务列表
==============

.. http:get:: /api/danmu/tasks

   获取当前用户的导入任务列表（含 running / pending / done / failed 等状态）。

   :statuscode 200: 请求成功

.. _hub-danmu-tasks-refresh:

刷新任务状态
==============

.. http:post:: /api/danmu/tasks/refresh

   从弹幕服务拉取最新任务状态，更新本地缓存。

   :statuscode 200: 请求成功

.. _hub-danmu-token:

弹幕 Token 管理
================

弹幕 Token 在控制台（``/control`` 弹幕区）创建与管理，相关接口：

* ``POST /api/control/danmu-token`` ：创建 Token（名称仅限英文字母与数字，且不以数字开头，每用户有数量上限）
* ``POST /api/control/danmu-token/delete`` ：删除指定 Token（表单字段 ``id``）
* ``POST /api/control/danmu-token/refresh`` ：刷新 Token 缓存（从弹幕服务拉取最新状态）

创建成功后返回 ``token_url``（形如 ``{弹幕服务域名}/api/v1/{token}``），
``daily_call_limit`` 体现当前每日额度；公开调用请使用该 ``token_url``。
