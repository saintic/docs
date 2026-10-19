.. _hub-webdav:

===========
WebDAV 网盘
===========

openhub 通过 **WebDAV 网关** 为每位登录用户提供一块独立的网盘空间，后端转发至
内网部署的 openlist（原 AList fork），由 openhub 代为鉴权、转发与主机名改写。
你的数据存放在专属子目录（ ``/user_<uid>`` ）中，与其他用户 **完全隔离**。

支持 rclone、Windows 资源管理器、macOS 访达、Cyberduck、移动端文件管理器等
主流客户端挂载，像本地磁盘一样上传、下载与管理文件。

.. _hub-webdav-endpoint:

接入端点
========

* 网关端点： ``https://hub.saintic.com/webdav`` （WebDAV 全方法：PROPFIND / GET / PUT / DELETE / COPY / MOVE / LOCK …）
* 用户页面： ``/webdav_control`` （登录后，含接入信息与初始化按钮）
* 初始化接口： ``POST /openservice/webdav/init`` （需登录）
* 状态查询： ``GET /openservice/webdav/info`` （需登录）

.. _hub-webdav-auth:

认证方式
========

WebDAV 端点支持三种 **等价** 的鉴权方式：

#. **OIDC 登录态** ：浏览器已登录 openhub，直接可用（适合网页端操作）。
#. **API Key（Bearer）** ： ``Authorization: Bearer <API Key>`` ，由请求解析出 ``uid``。
#. **Basic Auth（WebDAV 客户端常用）** ：**密码即你的 API Key** ，用户名建议填你的
   openhub ``uid`` （不强制校验——各客户端用户名不一致时仍以密钥归属放行）。

.. note::

   **只读 API Key** 仅允许只读类方法（ ``GET`` / ``HEAD`` / ``OPTIONS`` / ``PROPFIND`` /
   ``REPORT`` / ``SEARCH`` ），其余写方法（ ``PUT`` / ``DELETE`` / ``MKCOL`` / ``COPY`` /
   ``MOVE`` / ``PROPPATCH`` / ``LOCK`` / ``UNLOCK`` ）返回 ``403`` 。浏览依赖 ``PROPFIND`` ，
   故只读 Key 也能正常连接与浏览，但无法写入。

   WebDAV 协议端点的错误以 **DAV 风格** 返回（空响应体 + 状态码，401 带
   ``WWW-Authenticate``），不返回 JSON；插件自身的 JSON 接口（ ``/openservice/webdav/*`` ）
   仍返回 JSON。

.. _hub-webdav-init:

初始化
======

首次使用前需初始化你的专属账号：openhub 会在内网 openlist **自动建号** 并分配
``/user_<uid>`` 目录（凭据由站点密钥派生，不落库明文，你无需也不接触该密码）。

* 方式一：登录后访问 ``/webdav_control`` ，点击「初始化」按钮；
* 方式二：已持有 API Key，直接 ``POST /openservice/webdav/init`` ，返回
  ``{"success": true, "data": {"endpoint": "...", "base_path": "/user_<uid>"}}`` ；
  已初始化会幂等返回「WebDAV 已初始化」，不会重复建号。

.. _hub-webdav-clients:

客户端配置
==========

通用参数：

* 主机 / 地址： ``https://hub.saintic.com/webdav``
* 用户名：你的 openhub ``uid`` （Basic Auth 下）
* 密码：**你的 openhub API Key**

各客户端：

* **rclone** ：remote 类型选 ``webdav`` ，vendor 选 ``other`` ，url 填上述端点，
  user / pass 填 ``uid`` 与 API Key。
* **Windows 资源管理器** ：映射网络驱动器 / 添加网络位置，文件夹填
  ``https://hub.saintic.com/webdav`` ，凭据用 ``uid`` / API Key。
* **macOS 访达** ：菜单「前往 → 连接服务器」，输入 ``https://hub.saintic.com/webdav`` ，
  以注册用户身份连接。
* **Cyberduck / 移动端文件管理器** ：新建 WebDAV 连接，服务器填 ``hub.saintic.com`` ，
  路径 ``/webdav`` ，用户填 ``uid`` ，密码填 API Key。

.. _hub-webdav-faq:

常见问题
========

* **我的数据存在哪里、是否与他人隔离？**
  位于内网 openlist 共享存储下的 ``/user_<uid>`` 子目录，由 openlist 服务端按账号
  ``base_path`` 强制隔离，仅你自己可见，与其他用户互不可见。

* **支持多大的文件？**
  上传下载均流式转发（上传用请求流、下载用响应流），不缓冲进内存，无强制大小上限
  （受后端存储与网络条件限制）。

* **未初始化就访问会怎样？**
  未初始化访问 ``/webdav`` 会返回未认证 / 未配置错误；请先按「初始化」一节完成建号。

* **配置缺失时网关可用吗？**
  管理员未配置 openlist 地址或令牌时，首次访问会返回 503，页面提示「WebDAV 网关未配置」。
