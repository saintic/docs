.. _hub-ipam:

==============================
IPAM 地址池（IPv4 规划）
==============================

页面地址：https://hub.saintic.com/ipam

说明：IPAM（IP Address Management）是本站在线的 **IPv4 地址规划工具** —— 以一个
CIDR 作为「地址池」，按掩码划分并登记「子网」，持续跟踪利用率与地址占用情况。
它保存分配结果并保证不重叠，而不是一次性的子网计算器。

颜色约定：**红色为已用网段，绿色为可用网段，黄色为利用率告警**。

.. _hub-ipam-entry:

入口与登录
==========

页面 ``/ipam`` 分三段，按是否需要登录区分：

.. list-table::
   :header-rows: 1
   :widths: 30 15 55

   * - 功能
     - 登录
     - 说明
   * - 网段信息 / 临时划分
     - 否
     - 无状态计算，不写库、不收费，可直接使用
   * - 我的地址池（保存）
     - 是
     - 地址池与子网按账号隔离，互不可见
   * - 地址观测
     - 是
     - 记录扫描或人工上报的存活 IP，与子网登记做对照

需要登录的部分：页面跳转统一登录（OIDC），接口使用 **API 密钥**，支持
``Authorization: Bearer <API-Key>`` 或 ``Authorization: Token <API-Key>``，
也可用登录态会话访问，方式详见 :ref:`hub-auth` 。

.. _hub-ipam-limit:

额度与限制
==========

.. list-table::
   :header-rows: 1
   :widths: 34 66

   * - 项目
     - 取值 / 说明
   * - 地址池掩码范围
     - ``/8`` - ``/30``\ （不接受 ``/31``、``/32`` 作为地址池）
   * - 单个地址池子网上限
     - 1024 个
   * - 单次批量生成
     - 最多 256 个（先预览再落库）
   * - 临时划分返回候选
     - 最多 256 个，页面每页展示 10 条
   * - 每用户免费地址池
     - 5 个
   * - 超出免费额度
     - 按量计费 ￥1/个，扣 IPAM 余额（详见 :ref:`hub-ipam-billing`）
   * - 利用率告警
     - 达到 80% 黄色告警、95% 红色紧张
   * - 占用图渲染上限
     - 600 块，超出改为按空闲块列表展示
   * - 观测地址有效期
     - 7 天未再次上报标记为失效（stale）
   * - 单次上报 IP 上限
     - 1024 个

接口 **不加限速**；数据按 ``uid`` 隔离，越权访问一律按「不存在」返回 404。

.. _hub-ipam-info:

网段信息
========

输入单个 CIDR 计算掩码、地址范围与容量等，**允许带主机位**，掩码支持前缀长度
（``/24``）与点分十进制（``/255.255.255.0``），范围 ``/0`` - ``/32``。

.. http:get:: /api/ipam/info

   :query string cidr: 必填，CIDR 或「IP + 掩码」，如 ``192.168.1.10/24``
   :resjson boolean success: 请求是否成功
   :resjson object data: 网段信息，字段见下方说明
   :statuscode 200: 请求成功
   :statuscode 400: 缺少掩码、格式错误或非 IPv4

主要返回字段：

.. list-table::
   :header-rows: 1
   :widths: 28 72

   * - 字段
     - 说明
   * - ``cidr`` / ``prefix``
     - 规范化后的网段与前缀长度
   * - ``input`` / ``ip`` / ``host_bits``
     - 原始输入、输入中的地址、是否带主机位
   * - ``netmask`` / ``netmask_binary`` / ``wildcard``
     - 点分掩码、二进制掩码、通配符掩码
   * - ``network_address`` / ``broadcast_address``
     - 网络地址与广播地址
   * - ``first_ip`` / ``last_ip``
     - 可用地址范围（``/31``、``/32`` 无保留位，全部可用）
   * - ``capacity`` / ``hosts``
     - 地址容量与可用主机数
   * - ``scope`` / ``ip_class``
     - 地址类型（私网 / 公网 / 回环 / 链路本地等）与 IP 类别
   * - ``reverse_dns``
     - ``in-addr.arpa`` 反向解析域（掩码为 8 的整数倍时给出）

示例：

.. code-block:: text

   GET /api/ipam/info?cidr=192.168.1.10/24

   {
       "success": true,
       "data": {
           "input": "192.168.1.10/24", "ip": "192.168.1.10", "host_bits": true,
           "cidr": "192.168.1.0/24", "prefix": 24,
           "netmask": "255.255.255.0", "wildcard": "0.0.0.255",
           "network_address": "192.168.1.0", "broadcast_address": "192.168.1.255",
           "first_ip": "192.168.1.1", "last_ip": "192.168.1.254",
           "capacity": 256, "hosts": 254,
           "scope": "私网地址", "ip_class": "C 类",
           "reverse_dns": "1.168.192.in-addr.arpa"
       }
   }

.. _hub-ipam-calc:

临时划分
========

不保存结果的快速试算：给出地址池、已用网段与目标掩码，返回统计、占用图与候选子网。

.. http:get:: /api/ipam/calc

   :query string cidr: 必填，地址池 CIDR（掩码 ``/8`` - ``/30``）
   :query int mask: 可选，目标子网掩码；不传只返回空闲块与占用统计
   :query string used: 可选，已用网段，逗号 / 空格 / 换行分隔
   :query int limit: 可选，返回候选与空闲块数量上限，默认 256
   :resjson object data: ``network``、``used``、``used_size``、``free_size``、
                         ``utilization``、``level``、``available``、
                         ``theoretical``、``subnets``、``free_blocks``、``map``
   :statuscode 200: 请求成功
   :statuscode 400: CIDR 非法、已用网段与地址池不重叠等

要点：

- ``available`` 为按掩码计算的可用子网数，``theoretical`` 为不考虑已用时的
  理论值；``truncated`` 表示候选被截断。
- ``map`` 是占用图块（``used`` / ``free`` 状态），块数超过上限时只返回统计。
- 示例：

  .. code-block:: text

     GET /api/ipam/calc?cidr=10.0.0.0/16&mask=24&used=10.0.0.0/24&limit=128

.. _hub-ipam-validate:

CIDR 校验
=========

.. http:get:: /api/ipam/validate

   :query string cidr: 必填，待校验的 CIDR
   :resjson string data.network: 规范化后的网段
   :statuscode 200: 校验通过
   :statuscode 400: 格式错误、含主机位或非 IPv4

   供第三方对接前自检输入：地址池要求 ``strict`` 解析（如 ``10.0.0.1/24``
   会被拒绝并回显规范写法 ``10.0.0.0/24``）。

.. _hub-ipam-network:

地址池管理（需登录）
====================

.. http:get:: /api/ipam/networks

   列出当前用户的地址池及容量、已用、利用率、子网数。

   :resjson array data.networks: 地址池列表
   :resjson int data.max: 免费额度（5）
   :statuscode 200: 请求成功
   :statuscode 403: 未登录或密钥无效

.. http:post:: /api/ipam/networks

   创建地址池；超出免费额度时按量扣 ￥1，余额不足或创建失败会回滚。

   :reqjson string cidr: 必填，地址池 CIDR，掩码 ``/8`` - ``/30``
   :reqjson string name: 可选，名称（留空展示 CIDR）
   :reqjson string remark: 可选，备注
   :statuscode 201: 创建成功，返回 ``data.network``
   :statuscode 400: CIDR 非法、与既有地址池重叠、
                    免费额度已满且余额不足
   :statuscode 403: 未登录或密钥无效

.. http:get:: /api/ipam/networks/(int:nid)

   地址池详情：统计、占用图、空闲块与子网分页。

   :query int page: 子网页码，默认 1
   :query int per_page: 每页条数，默认 100，最大 200
   :query int prefix: 可选，附带该掩码的候选子网
   :statuscode 200: 请求成功
   :statuscode 404: 地址池不存在或不属于当前用户

.. http:patch:: /api/ipam/networks/(int:nid)

   修改地址池名称或备注，未提供的字段不修改。

   :reqjson string name: 可选
   :reqjson string remark: 可选
   :statuscode 200: 修改成功
   :statuscode 404: 地址池不存在或越权

.. http:delete:: /api/ipam/networks/(int:nid)

   删除地址池；**需先释放其下全部子网**。删除不退还已扣费用。

   :statuscode 200: 删除成功
   :statuscode 400: 仍有子网未释放
   :statuscode 404: 地址池不存在或越权

.. _hub-ipam-subnet:

子网分配
========

.. http:get:: /api/ipam/networks/(int:nid)/free

   查询空闲块与指定掩码的可分配子网。

   :query int prefix: 可选，目标掩码；给出时返回该掩码的候选子网
   :query int limit: 可选，候选上限，默认 256
   :resjson array data.free_blocks: 空闲块列表（最多 100 条）
   :resjson int data.free_block_count: 空闲块总数
   :statuscode 200: 请求成功

.. http:post:: /api/ipam/networks/(int:nid)/subnets

   分配一个子网；``cidr`` 与 ``prefix`` 二选一（都传时以 ``cidr`` 为准）。

   :reqjson int prefix: 目标掩码，如 ``24``
   :reqjson string cidr: 指定子网，如 ``10.0.5.0/24``
   :reqjson string name: 可选，子网名称
   :reqjson string remark: 可选，备注
   :reqjson string strategy: 可选，选块策略：``lowest``\ （最低地址优先，默认）
                             或 ``best-fit``\ （选择能容纳目标掩码的最小空闲块）
   :statuscode 201: 分配成功，返回 ``data.subnet``
   :statuscode 400: 掩码非法、子网不在地址池内、与既有子网重叠或无可用空间
   :statuscode 404: 地址池不存在或越权

   说明：子网掩码可与地址池掩码相同（整个地址池作为唯一子网）；只写网络地址
   又不给 ``prefix`` 会返回 400，不会被当成 ``/32``。

.. http:post:: /api/ipam/networks/(int:nid)/subnets/batch

   按掩码批量生成子网；``dry_run`` 缺省为 ``true``\ （只预览不落库）。

   :reqjson int mask: 必填，子网掩码
   :reqjson int count: 可选，生成数量，上限 256
   :reqjson string name_prefix: 可选，名称前缀
   :reqjson boolean dry_run: 可选，默认 ``true``；确认后传 ``false`` 落库
   :statuscode 200: 预览或生成结果（含数量与候选）
   :statuscode 400: 数量超限、空间不足等

.. http:delete:: /api/ipam/subnets/(int:sid)

   释放子网：删除记录，地址立即回到空闲池。

   :statuscode 200: 释放成功
   :statuscode 404: 子网不存在或越权

.. _hub-ipam-conflicts:

冲突检测
========

.. http:get:: /api/ipam/conflicts

   检测当前用户地址池之间的网段重叠，返回存在重叠的地址池对。

   :resjson array data.conflicts: 每项含 ``left`` / ``right`` 两个地址池
   :statuscode 200: 请求成功

.. _hub-ipam-address:

地址观测
========

观测数据独立于子网：只记录外部上报的存活 IP，**不写回子网、不参与利用率计算**，
仅用于「实际地址」与「登记子网」的对照。

.. http:get:: /api/ipam/networks/(int:nid)/addresses

   :query int page: 页码，默认 1
   :query int per_page: 每页条数，默认 50，最大 200
   :query string state: 过滤条件：``all``\ （默认）/ ``alive`` / ``stale`` /
                        ``shadow``
   :statuscode 200: 请求成功，含影子 IP 与幽灵登记统计

   对照口径：

   - **stale**：超过 7 天未再次上报；
   - **影子 IP**：存活但不在任何已登记子网内；
   - **幽灵登记**：已登记子网内没有存活观测，且该池最近一次观测仍在有效期内。

.. http:post:: /api/ipam/networks/(int:nid)/addresses

   上报存活 IP；单次最多 1024 个，时间戳由服务端生成。

   :reqjson string ips: IP 文本，逗号 / 空格 / 换行分隔
   :reqjson array items: 结构化条目 ``[{"ip": "...", "mac": "..."}]``，
                         优先级高于 ``ips``
   :reqjson string source: 可选，来源标记（不超过 16 字符，如 ``ipamcli``）
   :statuscode 201: 上报成功，返回新建 / 更新数量
   :statuscode 400: 未提供地址、超出上限、地址不在地址池内或带掩码

.. http:patch:: /api/ipam/networks/(int:nid)/addresses/(int:aid)

   人工设置主机名；传空值清除人工值并恢复自动上报覆盖。人工值不会被
   ``arp`` / ``dhcp`` / ``api`` 上报覆盖，观测过期也不会丢失。

   :reqjson string hostname: 主机名
   :statuscode 200: 修改成功

.. http:delete:: /api/ipam/networks/(int:nid)/addresses

   清空该地址池的观测记录；body 传 ``{"ids": [1, 2]}`` 时只删指定记录。

   :statuscode 200: 返回 ``data.removed``\ （删除条数）

边缘扫描建议使用配套 agent（Go 程序 ``ipamcli``）：支持 ``neigh`` / ``arp`` /
``icmp`` / ``tcp`` / ``dhcp`` 探测、分片扫描与失败补报，启动时拉取地址池、
按批上报观测，详见项目 ``sdk/ipamcli`` 文档。

.. _hub-ipam-billing:

计费说明
========

- 每个账号 **免费 5 个地址池**，额度内创建不收费；
- 超出后每创建 1 个扣 **￥1**\ （按量付费，扣 IPAM 模块余额），余额不足时无法创建；
- **只对创建动作计费**：删除地址池不退还已扣费用，再创建会重新计费；
- 临时划分、网段信息、子网分配与释放、地址观测与查询均 **不收费**；
- 充值方式见 :ref:`hub-fee` ，余额与流水可在「我的费用」（``/fee``）查看。

.. _hub-ipam-error:

错误码
======

.. list-table::
   :header-rows: 1
   :widths: 14 86

   * - 状态码
     - 含义
   * - 200 / 201
     - 请求成功（201 为创建类操作）
   * - 400
     - 参数或业务校验失败，``message`` 给出原因
   * - 403
     - 未登录、API 密钥无效
   * - 404
     - 资源不存在或不属于当前账号（不区分两者，避免泄露）

错误响应统一为 ``{"success": false, "message": "..."}``。
