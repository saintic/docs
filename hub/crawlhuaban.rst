.. _hub-crawlhuaban:

.. _tdi-usgae:

==============================
花瓣、堆糖画板下载
==============================

对于 hub.saintic.com 而言，这是一个插件（crawlhuaban）提供的功能，主要是两方面：

- 1. 丰富了「花瓣网下载」、「堆糖网下载」两个油猴脚本的下载方法——远程下载。

  - 应用场景主要是在不方便使用文本方式（迅雷）下载时；
  - 图片太多不适合使用本地方式直接保存时；
  - 需要下载很多时，此时比较麻烦，则直接选择远程，后续可以发出邮件提醒、控制台历史记录等。

- 2. 针对远程下载，提供了第三方接入的页面。

  - 地址是：https://hub.saintic.com/CrawlHuaban
  - 此页面专门用来接入 Tdi 程序，分担第一个功能：远程下载。

Tdi：即为花瓣网下载和堆糖网下载两个油猴脚本提供远程下载服务的专项程序，通过 hub.saintic.com 调度请求。

.. important::

   Hub 自身 **不再提供本地打包下载** ，所有下载任务一律 **移交第三方 Tdi** 完成；
   无可用 Tdi 或移交失败时，接口直接返回错误。

.. _hub-crawlhuaban-limit:

限制与约定
==============

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - 项
     - 说明
   * - 单个画板最大图片数
     - 20000 张
   * - 同画板重复下载间隔
     - 同一 IP + 站点 + 画板，5 分钟内不可重复提交
   * - 压缩包保留时长
     - 12 小时（Tdi 侧过期清理）
   * - 打包格式
     - 由 Tdi 的语言与版本决定：Python >=0.3.0、Node/PHP >=0.2.0 支持 zip，其余为 tar
   * - 移交任务超时
     - 7200 秒

.. _hub-crawlhuaban-register:

Tdi注册接入
==============

当您部署完成 Tdi 并正常提供服务后，用户下载请求并不会发送到您的程序中，
您需要接入到 Hub，步骤如下。

这里假设您提供服务的域名是 ``http://tdi.demo.com`` ，令牌是 ``secret`` 。

1. 打开接入页面：https://hub.saintic.com/CrawlHuaban （需登录）

2. 填写接入申请表单：

   - ``tdi_url`` 域名，即假设的 ``http://tdi.demo.com``

     虽然可以用 IP:PORT 形式，但是这种情况除非您特意设置了 nginx，否则可能无法下载。

   - ``tdi_token`` 令牌，即假设的 ``secret``

     以英文字母开头，由英文字母、数字、下划线组成。

   - ``tdi_private`` 私有属性，0 为公共（默认）、1 为专属

     开启后此 Tdi 只为您自己的账号提供服务，需要创建 API 密钥并在油猴脚本功能设置中填写。

   - ``memLimit`` / ``loadLimit`` / ``diskLimit`` 资源限制

     用户级限制，0-100 之间的整数，默认 0 表示不限制；
     系统级默认上限为内存使用率 80%、五分钟负载 5、磁盘使用率 80%。

   - ``weight`` 权重

     1-9 之间的数字，默认 1，权重越大分发到的请求越多；
     专属与公共均使用权重，若机器配置高、较空闲可适量增加。

填写无误并提交后，系统会向您的域名发送一次 GET 请求（``/ping``），令牌验证通过后接入成功。

.. _hub-crawlhuaban-check:

定时检测
==========

.. note::

    此功能是 Hub 中心端定时检测接入的 URL，更新其状态、资源等，不是 Tdi 程序本身所有的。

- Hub 每 10 分钟探测一次已注册 Tdi 的在线状态，据此重建可用集合。
- 若想暂时停止服务，可将 Tdi 状态设置为 ``tardy``，定时检测后将不再分发请求；恢复则设为 ``ready``。
- 您的服务可以随意停止，中心端转发失败时会自动改派其他 Tdi；全部不可用时接口直接报错。

各语言版本将状态置为 ``tardy`` 的方式：

.. list-table::
   :header-rows: 1
   :widths: 22 78

   * - 版本
     - 设置方式
   * - Tdi for Python
     - 设置环境变量 ``export crawlhuabantdi_status=tardy``，重启 Web 进程
   * - Tdi for PHP
     - 修改 config.php，将 ``STATUS`` 设为 tardy；不生效或有缓存扩展时重载 php-fpm
   * - Tdi for Node
     - 修改 config.json 的 ``status``，或设置环境变量 ``crawlhuabantdi_status=tardy``，
       再执行 ``yarn prod:reload`` 重载进程
   * - Tdi for Golang
     - 启动时指定 ``tdi --status tardy``

.. _hub-crawlhuaban-clean:

过期清理
==============

不论是普通部署还是 Docker 部署，接入服务后下载请求就来了：压缩包会在 Tdi 本地存储，
依照规则目前保留压缩文件 12 小时，过期后应当删除，避免占用磁盘空间。

**清理流程：**

1. 遍历 downloads 目录，根据文件名查询创建时间，结合过期时长（12 小时）决定是否删除。
2. 判定过期后删除压缩文件，可选地删除 Redis 中的 key，并回调 Hub 的过期通知接口（``Action=SECOND_STATUS``）。

.. note::

    在 Tdi for Python 的 v0.2.2 之后，清理时增加了一重判断：
    需同时满足 **压缩文件创建之后超过了过期时长（12h）** 才予以删除。
    Tdi-php、Tdi-node、Tdi-go 的初始版本已包含此判断。

**清理命令：**

- 普通部署

  - **Tdi for Python**：进入程序目录 src 下执行 ``./cleanDownload.py``，``-h`` 查看帮助，
    支持 ``--hours`` 手动设置过期时长，默认 12，单位小时。
  - **Tdi for PHP**：进入程序目录 src 下执行 ``./cleanDownload.php``，
    支持一个位置参数设置过期时长，默认 12，单位小时。
  - **Tdi for Node**：进入程序根目录执行 ``yarn run clean`` 或 ``npm run clean``，
    其内部进入 src 目录用 node 执行 cleanDownload.js，也可直接调用。
  - **Tdi for Golang**：不可手动执行，启动进程后自动执行。

- Docker 部署

  - **Tdi for Python**：假设容器名为 tdi，在宿主机执行 ``docker exec tdi cleanDownload.py``
    或 ``docker exec tdi ./cleanDownload.py``，参数同上。

- 专属 Tdi

  若为专属 Tdi，可以不执行该定时任务，这样下载的图片压缩包将不会过期。

.. tip::

    可将上述清理命令加入定时任务，每分钟执行一次。

    Tdi-node 的正式环境使用 pm2，已包含该配置，每 60 秒自动执行清理，无需再加入定时任务；
    Tdi-go 同样是自动清理。

.. _hub-crawlhuaban-private:

专属 Tdi（私有属性）
======================

.. note::

    此功能是 Hub 中心端提供的，不是 Tdi 程序本身的属性！
    已接入的 Tdi 可随时在控制台调整权重、在公共与专属之间切换或更换签名令牌，
    也可以直接删除。

1. 接入专属：在注册表单中将 ``tdi_private`` 设为 1，此 Tdi 即为您账号专属，
   只有您账号下的密钥能使用它远程下载。

2. 创建密钥：登录 `控制台 <https://hub.saintic.com/control/>`__ ，在「我的API密钥」中点击创建，
   选择状态与权限后提交（每个用户最多创建 5 个）。

   |hub-tdi-key|

3. 脚本设置：前两步完成后，系统并不知道哪次请求隶属于您的账号，因此需要在
   「花瓣网下载」「堆糖网下载」两个油猴脚本的功能设置中填写密钥，
   此设置要求油猴脚本版本 ``v1.0.0+``。

   在脚本生效页面（花瓣网画板页或个人主页、堆糖网专辑页），下载按钮旁有脚本设置按钮，
   点击「设置」并在弹窗中选择「设置提醒」，填写并保存密钥即可（下图以堆糖网为例）：

   |hub-tdi-script|

.. _tdi-alert:

下载异常报警
==============

Tdi for Python 的 v0.2.2+（Tdi-php、Tdi-node 开发时已存在此参数）添加了异常队列
（即 failed 队列，下载任务异常时进入此队列）上报参数，同时增加了报警邮箱配置 ``ALARMEMAIL``，
当中心端检测到 Tdi 存在异常队列时，按报警邮箱发送报警邮件。

报警邮箱配置可留空，留空视为放弃报警。

Tdi for Golang 此项无效或无此项：它不依靠队列下载而是使用协程，
仅能通过日志或是否出现压缩文件手动判断是否下载完成。

.. _hub-crawlhuaban-weight:

加权轮询分发
==============

.. note::

    此功能不是 Tdi 程序本身所有的！

轮询算法即提供同质服务的节点逐个对外提供服务；加权轮询算法就是在轮询算法的基础上，
考虑到机器的差异性，分配给机器不同的权重，能者多劳。

- 接入时可手动设置权重，也可忽略，默认为 1。
- 已接入的可以通过 ``TdiUpdate`` 随时调整，取值 1-9。
- 权重是针对 Tdi 整个程序的，专属与公共效果一致。

.. |hub-tdi-key| image:: /_static/images/20190307133835.png
.. |hub-tdi-script| image:: /_static/images/20190307134421.png
