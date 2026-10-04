.. _rtfd-v2-api:

=========
API使用
=========

.. _rtfd-v2-api-run:

启动API服务
=============

通过 ``rtfd api`` 启动服务，可用 ``-c/--config`` 指定配置文件，支持 ``--host``\ 、``--port`` 选项
（默认值可在 rtfd.cfg 中设置）。

API 会提供 ``rtfd.js`` 静态地址（``/rtfd/assets/rtfd.js``\ ，由程序内嵌），所有文档构建时都会
自动注入它；访问文档页面时会运行它，初始化一个右下角导航挂件，点击可展开不同语言、分支 / 标签、
Git 地址等信息。因脚本内嵌，**无需再上传到 CDN**\ 。

接口文档（Swagger UI）由 API 服务提供：启动后访问 ``http://{host}:{port}/rtfd/docs`` 即可在线调试；
源码注解变更后需执行 ``make docs`` 重新生成 ``docs/{swagger.json,swagger.yaml,docs.go}`` 并一并提交。

.. _rtfd-v2-api-docs:

API接口文档
=============

除 badge 返回 SVG 外，其他接口均返回 JSON；统一响应结构为
``{"success": bool, "message": string, "data": any}``\ ，错误由统一错误处理输出
（默认 HTTP 200，echo.HTTPError 除外）。

公开接口（无需密钥）
--------------------

1. ``GET /rtfd/desc/<ProjectName>`` 或 ``/rtfd/<ProjectName>/desc``

   查询项目描述，返回 URL、langs、latest、versions、builder、showNav 等，供 rtfd.js 渲染；
   ``versions`` 已排除 ``excluded_branch``\ 。

2. ``GET /rtfd/badge/<ProjectName>`` 或 ``/rtfd/<ProjectName>/badge``

   文档状态徽章 SVG，支持 ``?branch=`` 查询参数（默认 Latest）；状态为 passing / failing / unknown。

3. ``POST /rtfd/build/<ProjectName>`` 或 ``/rtfd/<ProjectName>/build``

   触发构建。采用**动态签名**\ 鉴权：请求头 ``X-Rtfd-Ts``\ （Unix 秒）、``X-Rtfd-Nonce``\ （随机串）、
   ``X-Rtfd-Sign``\ （HMAC-SHA256，密钥为项目 secret）。``secret`` 为空时免鉴权。
   参数 ``branch``\ 、``debug``\ ；异步执行，返回 201。

4. ``POST /rtfd/webhook/<ProjectName>`` 或 ``/rtfd/<ProjectName>/webhook``

   基于 webhook 触发自动构建，适配 GitHub 与 Gitee（push、release 事件）。
   GitHub 校验 ``X-Hub-Signature``\ （sha1=HMAC）；Gitee 校验 ``X-Gitee-Token``\ ；识别 UA 分派；
   ``ping`` 仅回 ``pong``\ ；排除 ``excluded_branch``\ 。

   需在 GitHub / Gitee 项目 Webhooks 中添加：

   - Payload URL：``http://{rtfd-api-base-url}/rtfd/webhook/your-docs-name``
   - Content type：``application/json``
   - Secret：创建项目时的 ``secret``\ （可留空即不验证）
   - 事件：Push（GitHub Pushes/Releases；Gitee Push 与 Tag Push）

5. ``GET /rtfd/assets/rtfd.js``

   静态挂件脚本（内嵌 ``assets.RtfdJS``\ ）。

6. ``POST /rtfd/github/app``

   GitHub App 事件（``installation`` / ``installation_repositories``\ ），校验 App ID 后分派，
   详见 :ref:`rtfd-v2-faq-ghapp`。

管理接口（对应 CLI 的 project 子命令，便于实现 Web 管理端）
-----------------------------------------------------------

- ``GET /projects``\ ：项目列表（``verbose=1`` 返回完整 Options 数组）
- ``POST /projects``\ ：创建项目（``name``\ 、``url`` 必需，其余同 CLI create）
- ``GET /:name/info``\ 、``/info/:name``\ ：项目详情（``key=Field`` 返回单字段、``build=1`` 附带构建集）
- ``POST /:name/update``\ 、``/update/:name``\ ：更新配置（``text=Field:Value,…``\ 、``file=`` 或服务端规则文件、或直接字段传参）
- ``POST/DELETE /:name/remove``\ 、``/remove/:name``\ ：删除项目
- ``GET /:name/export``\ 、``/export/:name``\ ：导出 base64 配置（``sysmeta=1`` 保留内置 meta）
- ``POST /import``\ ：导入 base64 配置（``export`` 必需，``name`` 可选作别名）

管理接口鉴权：**动态签名**\ ，随请求携带 ``X-Rtfd-Ts`` / ``X-Rtfd-Nonce`` / ``X-Rtfd-Sign``
（HMAC-SHA256，密钥取自配置 ``[api] secret``\ ）；签名串 =
``ts + "\n" + nonce``\ （仅时间戳与随机串，不含 method / path / body）。
项目级接口同时接受项目自身密钥。``[api] secret`` 未配置时管理接口一律拒绝
（``api secret is not configured``\ ）；构建与 webhook 仍按项目密钥原逻辑运行。
可用 ``rtfd sign`` 生成签名，Swagger UI 首页填入密钥后自动签名。
