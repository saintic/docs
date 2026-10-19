.. _hub-cert:

============
SSL 证书服务
============

开放服务 Hub 内置 **SSL 证书服务** （插件 ``plugins/cert``），基于内嵌的
**ACME + dns-lexicon** 实现，不再依赖任何外部证书后端。它让你可以为自有域名免费申请
Let's Encrypt 证书，并配套 DNS 授权、通知渠道与到期提醒。

核心约束（设计红线）：**私钥由你的浏览器（WebCrypto）本地生成，hub 仅接收 CSR**，
借助 ACME 对 CSR 中的公钥签发后返回证书（fullchain）；**hub 不存储你的私钥与证书**，
仅落非敏感元数据（域名、状态、到期时间、序列号）。

地址：https://hub.saintic.com/cert

.. _hub-cert-flow:

签发流程
========

整体三步：

#. **填写域名**：在「申请证书」页输入域名（支持通配符 ``*.example.com``）。
#. **本地生成密钥与 CSR**：在浏览器内用 WebCrypto 生成私钥并据此生成 CSR，
   私钥只存在于当前页面内存（不上传、不落盘）。
#. **下载证书与私钥**：签发成功后，在结果弹窗中下载 fullchain 与私钥并自行保存。

.. note::

   签发期间的 DNS 校验通常需要 1–2 分钟，请勿关闭页面。提交后会显示「正在签发中，请稍候…」
   并禁用表单，重复提交（含回车）会被忽略。

   刷新或前进/后退时浏览器可能回填域名与 CSR，但私钥只存在于内存、无法恢复。若检测到回填的
   CSR 而内存中无私钥，页面会给出警告，请重新生成密钥与 CSR，否则会出现
   「证书已签发但没有对应私钥」的情况。

.. _hub-cert-console:

管理台
======

登录后访问 ``/cert`` ，管理台分为三个标签页（支持锚点直达，刷新/收藏/分享链接可直接打开对应页）：

* ``/cert#cert`` —— **我的证书**：已签发证书列表（域名、状态、生效/到期时间、序列号），可删除记录。
* ``/cert#obtain`` —— **申请证书**：填域名 + 本地生成密钥/CSR + 选挑战方式与授权凭证，提交签发。
* ``/cert#cred`` —— **授权凭证**：维护 DNS 提供商与通知渠道。

.. _hub-cert-challenge:

校验方式
========

两种 ACME 挑战，按域名类型选择：

* **DNS-01** （推荐，支持通配符）：由 dns-lexicon 自动操作域名的 ``_acme-challenge`` TXT
  记录完成校验；需在「授权凭证」中配置对应 DNS 提供商的凭据。
* **HTTP-01** （不支持通配符）：hub 在根路径 ``https://hub.saintic.com/.well-known/acme-challenge/<token>``
  按 token 返回暂存的校验内容。需把该路径反向代理到 hub（或让域名直接指向 hub）即可。

.. _hub-cert-cred:

授权凭证
========

均按所选「提供商 / 渠道类型」动态渲染各自的凭据输入框（敏感项用密码框），**凭据经 Fernet
加密后落库，明文不入库**。

* **DNS 提供商**：内置 lexicon 实现的厂商，例如 Cloudflare、阿里云 DNS、DNSPod、腾讯云 DNS 等
  （按所选厂商填 AccessKey / API Token 等）；支持通配符与多域名签发。
* **通知渠道**：Webhook、飞书群机器人、企业微信群机器人、钉钉群机器人。证书签发成功/失败、
  临近到期的续期提醒均经你勾选的通知渠道下发。

.. _hub-cert-api:

接口
====

管理台接口挂在站点根路径下（与 ``/openservice`` 下的对外 API 区分），均需登录（API Key）：

* ``GET    /cert/dns``             —— 列出我的 DNS 提供商
* ``POST   /cert/dns``             —— 新建 DNS 提供商（``name`` / ``provider`` / ``creds``）
* ``DELETE /cert/dns/<id>``        —— 删除 DNS 提供商
* ``GET    /cert/notify``          —— 列出我的通知渠道
* ``POST   /cert/notify``          —— 新建通知渠道（``name`` / ``type`` / ``config``）
* ``DELETE /cert/notify/<id>``     —— 删除通知渠道
* ``GET    /cert/certificates``    —— 列出我的证书
* ``POST   /cert/certificates``    —— 申请证书（``name`` / ``csr`` / ``challenge_type`` /
  ``dns_provider_id`` / ``domains`` / ``notify_ids``），返回 ``{"cert": "<fullchain>"}``
* ``DELETE /cert/certificates/<id>`` —— 删除证书记录（元数据）

HTTP-01 校验端点 ``/.well-known/acme-challenge/<token>`` 不走鉴权，由 CA 直接访问。

.. _hub-cert-notes:

到期提醒与限制
==============

* **到期提醒**：每日 08:00 定时任务扫描临近到期的已签发证书，在到期前 **30 / 15 / 7** 天各经
  你的通知渠道推送一次续期提醒（北京时间可读格式）。续期需重新提交 CSR（hub 不保存证书）。
* **多用户隔离**：证书、DNS 凭据、通知配置均按 ``uid`` 归属隔离，互不可见。
* **自动化部署（TODO）**：``deploy`` 当前为占位 no-op，尚未自动下发到 Nginx / CDN 等；
  本阶段请下载证书后自行部署。
* **证书吊销（TODO）**：删除仅移除本地记录，证书在 Let's Encrypt 侧到期前仍有效；正式吊销
  需 hub 保留 ACME 账户与序列号并调用 revoke 接口，将在后续阶段支持。
