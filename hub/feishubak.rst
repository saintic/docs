.. _hub-feishubak:

==========================
飞书群备份（配置流程）
==========================

地址：https://hub.saintic.com/feishu

说明：飞书群消息备份服务，使用 **你自己的飞书自建应用** 备份群聊消息——文本消息入库，
图片、视频转存图床。每个用户独立配置自己的应用与待备份群，消息记录按用户隔离。

.. note::

    本服务仅面向 **登录用户** ，页面未登录会跳转到统一登录（OIDC），接口未登录返回 403。

.. _hub-feishubak-flow:

配置流程
==========

整个配置分为「飞书侧准备」与「Hub 侧配置」两个阶段，按顺序完成即可。

.. _hub-feishubak-step1:

第一步：创建飞书企业自建应用
------------------------------

1. 打开 `飞书开放平台 <https://open.feishu.cn/app>`__ ，登录后在 **开发者后台** 点击
   **创建企业自建应用** ，填写应用名称与描述后创建。

2. 进入应用的 **凭证与基础信息** 页面，取得 **App ID**（``cli_`` 开头）与 **App Secret**。

   .. tip::

       App Secret 只在创建时可见一次，请妥善保存。Hub 侧保存后 **不再回显** ，
       修改时留空表示不修改。

.. _hub-feishubak-step2:

第二步：开启机器人能力与权限
------------------------------

1. 在应用左侧导航进入 **添加应用能力** ，添加 **机器人** 能力。

2. 进入 **权限管理** ，申请以下权限：

   .. list-table::
      :header-rows: 1
      :widths: 35 15 50

      * - 权限
        - 必需
        - 说明
      * - ``im:message.group_msg``
        - 是
        - 读取群消息，备份的基础权限
      * - ``im:resource``
        - 是
        - 读取消息中的图片、视频等资源，用于转存图床
      * - ``contact:contact.base:readonly``
        - 否
        - 解析发送者姓名；未开通时仅保存 open_id

3. 在 **版本管理与发布** 中创建版本并 **申请发布** ，由企业管理员审批通过后权限才实际生效。

.. _hub-feishubak-step3:

第三步：把机器人拉进群并开启历史消息
----------------------------------------

1. 在飞书客户端打开需要备份的群，进入 **群设置 → 群成员 → 添加机器人** ，
   把刚创建的应用机器人加入群。

2. 在 **群设置** 中开启 **「新成员可查看历史消息」** 。

   .. important::

       不开此项时，机器人只能读取 **入群之后** 的消息，历史消息拉取会返回空，
       表现为「全量回填只有极少消息」。

3. 复制该群的 **群 ID** （``oc_`` 开头）。可在群设置的群信息中查看，
   或通过飞书开放平台的「获取用户所在的群列表」接口取得。

.. _hub-feishubak-step4:

第四步：在 Hub 保存应用凭证
------------------------------

1. 打开 https://hub.saintic.com/feishu （需登录）。

2. 在 **飞书应用配置** 区域填入 App ID 与 App Secret，点击保存。

   保存成功会提示「应用配置已保存」，状态标签变为「已配置」；
   此后输入框占位符变为「已配置，留空表示不修改」。

.. _hub-feishubak-step5:

第五步：添加备份群
------------------------------

在同一页面的 **备份群** 区域填写：

.. list-table::
   :header-rows: 1
   :widths: 25 15 60

   * - 字段
     - 必填
     - 说明
   * - 群 ID
     - 是
     - ``oc_`` 开头的群 ID，机器人必须已在该群内
   * - 备注名
     - 否
     - 便于识别的显示名，未填显示「未命名群」
   * - 备份开始时间
     - 否
     - ``YYYY-MM-DD``，首次备份从此日期 00:00（北京时间）起拉取；
       留空则用默认兜底时间 **2026-10-01**

.. tip::

    设置「备份开始时间」可以避免从更早的时间拉取——机器人只能读取入群之后的消息，
    更早的时间窗口只会白跑请求。添加后仍可用「修改」调整。

.. _hub-feishubak-step6:

第六步：执行备份
------------------------------

- **定时备份**（推荐）：系统每 **3 小时** 整点遍历所有启用中的群做增量备份，无需干预。
- **手动备份**：在群列表点击对应群的「备份」按钮，立即执行一次；
  首次执行为全量回填（可能较久），之后为增量。

备份完成后即可在页面下方的 **消息查看** 区域按群、消息类型、关键词检索已备份的消息。

.. _hub-feishubak-plan:

套餐与配额
==========

飞书群备份采用 **买断制（lifetime）** 计费：一次性付费、终身有效，不按次扣费；
功能 **仅面向登录用户** ：未登录无法使用（页面跳 OIDC 登录、接口返回 403），免费额度也只给登录用户。

额度即 **可备份群数** （不是消息条数）：配额内的每个群，其文本 / 图片 / 视频均不限条数备份。
档位与价格以费用服务（pcs）登记为准，按档位名次映射额度：

.. list-table::
   :header-rows: 1
   :widths: 22 18 15 15 30

   * - 用户状态
     - 付费类型
     - 档位
     - 价格
     - 可备份群数
   * - 登录未买断
     - 免费
     - —
     - 免费
     - 1 个群
   * - 已买断
     - 买断制
     - Pro
     - ￥9.9
     - 10 个群
   * - 已买断
     - 买断制
     - Max
     - ￥19.9
     - 20 个群

.. note::

    - 开通方式：**联系管理员** 在费用后台（pcs，``module=feishu-backup``）录入买断记录，
      ``pay_type=lifetime``、``level=pro|max``；开通后刷新页面即可添加更多群。
    - 档位无法识别时按最低档（10 个群）兜底；价格本体以 pcs 登记为准，未定价时页面显示「价格待定」。
    - 付费状态 **每次实时查询 pcs（无付费缓存）** ：买断后下次添加群即生效；
      pcs 回调对 feishu 无动作，天然无需兜底。
    - 定时任务 **不做付费校验** ：群在买断后才可添加，备份不依赖 pcs 可用性，
      费用服务故障不会中断已有群的备份。
    - pcs 不可用时免费 1 个群仍可用；买断校验按未买断处理，已有群的定时备份不受影响。

.. _hub-feishubak-api:

接口
==========

以下接口均需登录，请求未携带登录态返回 403；参数可用 query、表单或 JSON body 传递。
统一响应格式 ``{success, message, data}``。

.. http:get:: /openservice/feishu/app

   查询当前用户的飞书应用配置（App Secret 不回显，仅返回是否已配置）

   :resjson boolean success: 请求是否成功
   :resjson object data: 应用信息，含 app_id、secret_set
   :statuscode 200: 请求成功
   :statuscode 403: 未登录

.. http:post:: /openservice/feishu/app

   保存飞书应用凭证

   :form string app_id: App ID，``cli_`` 开头
   :form string app_secret: App Secret，留空表示不修改
   :resjson boolean success: 请求是否成功
   :resjson string message: 提示或异常消息
   :statuscode 200: 请求成功
   :statuscode 403: 未登录

.. http:get:: /openservice/feishu/groups

   备份群列表（含套餐配额与已备份消息数）

   :resjson object data: ``groups`` 群列表与 ``plan`` 配额信息
   :statuscode 200: 请求成功

.. http:post:: /openservice/feishu/groups

   新增备份群，受套餐群数上限约束

   :form string chat_id: 群 ID，``oc_`` 开头
   :form string name: 备注名，可选
   :form string start_time: 备份开始时间 ``YYYY-MM-DD``，可选
   :resjson string message: 超限时返回群数上限提示
   :statuscode 200: 请求成功

.. http:post:: /openservice/feishu/groups/update

   更新备份群的备注名或备份开始时间，未提供的参数不修改

   :form string chat_id: 群 ID，必填
   :form string name: 备注名，可选
   :form string start_time: 备份开始时间，可选
   :statuscode 200: 请求成功

.. http:post:: /openservice/feishu/groups/remove

   删除备份群配置（已备份的历史消息保留，重新添加后可继续查看）

   :form string chat_id: 群 ID，必填
   :statuscode 200: 请求成功

.. http:post:: /openservice/feishu/groups/sync

   手动备份指定群，首次全量回填，之后增量

   :form string chat_id: 群 ID，必填
   :form string start: 回填起点，``YYYY-MM-DD`` 或 10 位时间戳，可选
   :resjson string message: 格式错误时返回「起始时间格式错误，示例：2024-01-01 或 1704067200」
   :statuscode 200: 请求成功

.. http:get:: /openservice/feishu/messages

   分页查询某群已备份消息（仅限本人配置的群）

   :query string chat_id: 群 ID，必填
   :query int page: 页码，默认 1，最小 1
   :query int limit: 每页条数，默认 15，取值 [1, 100]
   :query string msg_type: 按消息类型过滤，可选
   :query string keyword: 按消息文本搜索，可选
   :statuscode 200: 请求成功

.. _hub-feishubak-faq:

常见问题
==========

.. list-table::
   :header-rows: 1
   :widths: 40 60

   * - 现象
     - 原因与处理
   * - 全量回填只有极少消息
     - 机器人不在群内，或群未开启「新成员可查看历史消息」；接口会静默返回空，
       请检查群设置与权限
   * - 消息只显示 open_id，没有姓名
     - 未开通通讯录权限 ``contact:contact.base:readonly``，服务降级只存 open_id
   * - 图片、视频没有内容
     - 媒体超过 10MB 或转存图床失败，仅保留 file_key 与文件名备查，不阻断备份
   * - 无法添加更多群
     - 已达当前套餐的群数上限，需联系管理员开通买断套餐
   * - 提示「请稍后重试」
     - 数据结构正在迁移，刷新或稍后重试即可

.. note::

    备份进度不单独存字段，而是按 ``(uid, chat_id)`` 查已备份消息的最大时间，
    再向前多拉 60 秒重叠去重，因此中断后重新备份不会出现重复记录。
