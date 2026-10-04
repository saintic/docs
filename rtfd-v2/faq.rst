.. _rtfd-v2-faq:

=========
其他问题
=========

.. _rtfd-v2-faq-build-progress:

构建流程
==========

1. ``rtfd --init`` 初始化服务，生成程序配置文件。

2. ``rtfd project create --url xxx {ProjectName}`` 新增文档项目，
   在数据库保存项目配置、生成默认域名并渲染 Caddy 站点配置。

3. ``rtfd build {ProjectName}``\ （或经 API / webhook 触发）构建文档。

   构建由 ``assets/builder.sh``\ （程序内嵌，落盘为 ``{base_dir}/.rtfd-builder.sh``\ ）执行：
   ``git clone`` → 按项目版本建虚拟环境 → ``pip install`` → 向 ``conf.py`` 注入 rtfd.js →
   对每种语言 ``sphinx-build``\ ，并 ``ln -nsf`` 使 ``{lang}/latest`` 指向 ``{lang}/{Latest}``\ 。

4. 访问文档。

   生成的文档目录布局（``{base_dir}/docs/{name}/``\ ）：

   .. code-block:: text

       docs/{name}/
       └── {lang}/
           ├── latest/          → 符号链接，指向当前 Latest 分支目录
           ├── master/          ← 每次构建按 branch 全量覆盖
           └── v1.0/ …          ← tag/release 构建的版本目录

   文档域名是 ``文档项目名.托管域名后缀``\ ；若非单版本，首页重定向到 ``/{lang}/latest``\ ，
   页面会加载 rtfd.js 生成导航按钮。自定义域名也可访问，但默认域名不会自动跳转过去。

.. _rtfd-v2-faq-custom-domain:

自定义域名
============

新建项目可直接用 ``--domain`` 选项；已有项目追加 / 修改自定义域名，请更新 ``domain`` 字段：

.. code-block:: bash

    rtfd p update -t domain:my-domain {ProjectName}

HTTPS 证书由 **Caddy 自动申请与续期**\ ，无需手动提供证书文件。将自定义域名在 DNS 处
CNAME 指向项目默认域名即可。

取消自定义域名：将 ``domain`` 设为 ``false``\ 。

.. tip::

    每个文档都有默认域名，是否支持 HTTPS 取决于 Caddy 的 ``auto_https`` 配置；
    若开启 HTTPS，HTTP 会跳转到 HTTPS（默认域名不会跳转到自定义域名）。

.. _rtfd-v2-faq-docker:

是否支持 docker
================

rtfd v2 提供官方 Dockerfile 与镜像。镜像基于 ``ubuntu:24.04``\ ，内置 Caddy + python3(3.12) +
supervisor（supervisord 拉起 ``rtfd api`` 与 caddy）；多版本 Python 通过 apt + deadsnakes
PPA 预装 ``3.10`` 与 ``3.12``\ ，版本列表写死在 ``assets/rtfd.cfg`` 的 ``[py]`` 分区。

镜像内路径：配置文件位于 **base_dir 内**\ （``RTFD_CFG=/rtfd/rtfd.cfg``\ ），与数据
（``docs/``\ 、``rtfd.db``\ 、``caddy/``\ ）同处 ``/rtfd``\ ，只需挂载一个数据卷。入口脚本
``scripts/docker-entrypoint.sh`` 在配置缺失时用内置模板 ``rtfd --init`` 补生成，再 ``exec supervisord``\ 。

.. code-block:: bash

    # 运行（挂载单个数据卷即可）
    docker run -d --name rtfd \
      -p 80:80 -p 443:443 \
      -v /path/to/data:/rtfd \
      staugur/rtfd:latest

镜像发布：master → ``latest``\ 、dev → ``dev``\ 、release published 时构建对应版本。

.. _rtfd-v2-faq-ghapp:

支持 github apps
=================

rtfd v2 适配了 GitHub Apps（以下简称 ghapp），在创建 / 删除项目时**自动注册、清理**\ 仓库 webhook，
无需手动配置。

流程
^^^^^^

rtfd 创建项目时由 git url 解析出用户名（仅 GitHub），该用户若安装了 ghapp 且对应仓库已授权，
便能调用 GitHub API 自动添加 webhook，删除项目时同步删除 webhook。

使用
^^^^^^

1. 注册 GitHub App（https://github.com/settings/apps/new），要求：

   - Webhook 部分（Active 勾选）：Webhook URL 为 rtfd ghapp 公开接口地址，
     如 ``https://xxx.com/rtfd/github/app``\ ；Webhook secret 暂未适配。
   - 仓库权限：``Webhooks``\ （管理仓库的 post-receive hooks）读写权限。

2. 在应用配置页底部 ``Private keys`` 生成私钥（App ID 见 About 部分）。

3. 在 rtfd 配置文件 ``[ghapp]`` 分区填写（``app_id`` 与 ``private_key`` **同时有效即启用**\ ，无独立开关）：

   .. code-block:: ini

       [ghapp]

       ; GitHub App 全局唯一标识
       app_id =

       ; GitHub App 私钥文件路径，如 %(base_dir)s/ghapp.pem
       private_key =

身份机制：私钥签 **RS256 JWT**\ （``iss=app_id``\ ，10 分钟有效），JWT 换 installation access token
（缓存 1 小时）。事件 ``installation`` / ``installation_repositories`` 触发时对比全部 GitHub
项目 URL，更新 meta ``_installation_id`` / ``_webhook_id`` 并增删仓库级 webhook。

.. _rtfd-v2-faq-migrate:

从旧版本（Redis 存储）迁移
===========================

rtfd v2 不再使用 Redis，元数据存 sqlite / mysql / pgsql。旧版本（2.0.0 之前）数据可通过
**项目转储（transfer）** 机制迁移（与存储实现无关，导出 / 导入的是 Options JSON）：

.. code-block:: bash

    # 1. 旧版本（Redis）：列出并逐个导出为 base64
    rtfd p l
    rtfd p t -e <NAME>

    # 2. 新版本：配置好 [database] 后逐个导入
    rtfd p t -i <BASE64> [新名称]

要点：

- 导入走 ``Create``\ ，会重新校验名称 / 域名 / Python 版本并渲染 Caddy 配置，因此需先确认新环境的
  ``[py]`` 版本、``[caddy] dn`` 等与旧环境一致；
- Meta 中的系统字段（``_webhook_id``\ 、``_installation_id``\ ）默认不导出（``--export-sys-meta`` 可含），
  GitHub App 项目导入后可重新触发 webhook 同步；
- 构建结果（旧版 Redis 中）不迁移，迁移后重新构建即可生成；
- sqlite 文件建议放在 ``base_dir`` 内（``dsn = %(base_dir)s/rtfd.db``\ ）并纳入备份。

.. _rtfd-v2-faq-online-api-daemon:

正式环境启动API服务
=====================

v2 官方镜像通过 supervisord 托管 ``rtfd api`` 与 caddy；源码仓库 `scripts <https://github.com/staugur/rtfd/tree/master/scripts>`_
目录下也提供了 supervisord / systemd（``rtfd.service``\ ）/ start.sh 等脚本用于后台启动。
