.. _passport-usgae:

============
使用说明
============

.. note::

    使用就很简单了，Web应用，点点看看。

--------------

.. _passport-appoint:

0. 约定下
^^^^^^^^^

-  本地账号：使用邮箱、手机注册的用户（可与第三方账号互相绑定）
-  第三方账号：使用QQ、微博、GitHub、码云、Coding等注册的账号（可与本地账号互相绑定）
-  应用：即SSO客户端（passport算是SSO服务端）

.. _passport-cli-detail:

1. 命令行
^^^^^^^^^

-  **代码中sql文件并不包含数据，所以首先需要创建一个具有管理员权限的账号，目前仅有一种方法，即使用cli命令！**

    运行\ ``python cli.py --createSuperuser``\ ，根据提示输入邮箱、密码即可创建，若失败，请查看输出或日志，如图：

    |image0|

-  刷入登录日志，由于日志记录到redis，需要从redis写入mysql，建议定时任务，每分钟执行（定时任务且配置采用环境变量时记得任务要先source下环境变量文件）。

    1. 直接运行\ ``python cli.py --refresh_loginlog``
    2. 定时任务\ ``*/1 * * * * source your_env_file && cd your_code_dir && python cli.py --refresh_loginlog``

-  刷入访问日志，同登录

    1. 直接运行\ ``python cli.py --refresh_clicklog``
    2. 定时任务\ ``*/1 * * * * source your_env_file && cd your_code_dir &&  python cli.py --refresh_clicklog``

.. _passport-login:

2. 登录
^^^^^^^

-  输入刚才创建的管理员邮箱和密码，完成人机验证即可点击登录（请注意，包含人机验证的页面，均是需要完成验证方能进行表单提交操作，如登录、注册），如图：

    |image1|

-  验证通过即跳转到用户设置页。

.. _passport-setting:

3. 设置
^^^^^^^

-  设置用户资料、绑定账号等如图： 

    |image2|

-  个性域名针对的是EauDouce博客程序，前缀通过passport配置文件中SYSTEM段PersonalizedDomainNamePrefix值控制。

-  头像默认保存在本地，你可以修改配置文件UPYUN段，启用后可以保存到又拍云。

-  密码修改要求已经绑定了本地账号。

-  绑定的账号类型至少存在一个；本地化账号只能绑定和修改，第三方可以解绑。

-  偏好设置暂时无效

.. _passport-security:

4. 账号安全
^^^^^^^^^^^

-  会话列表：包含当前会话和其他会话

    1. 当前会话即当前浏览器登录的passport
    2. 其他会话即当前用户登录的其他客户端(功能待修改）

-  登录历史：记得刷入登录日志

.. _passport-message:

5. 我的消息
^^^^^^^^^^^

就是消息

.. _passport-apps:

6. 应用管理-管理员功能
^^^^^^^^^^^^^^^^^^^^^^

-  新建sso客户端信息和列表管理，管理员权限方可访问此页面，如图

    |image3|

-  新建应用所需参数解释如下：

    1. 名称：对应了客户端程序config.py中GLOBAL段ProcessName值(此为默认)，也可以自定义(需修改客户端config.py中SSO段app\_name)；

    2. 描述：无实际意义，只是描述此应用作业；

    3. 回调域名：对应了客户端程序运行的地址，需要完全合格域名，比如http://eaudouce.demo.com，也可以是IP:PORT形式的，请注意域名需要连通的(DNS有解析或hosts有绑定)！

    .. figure:: /_static/images/passport_newapp.png
        :alt: 

-  提交后应用列表可查看条目，注意上述信息都是客户端的，客户端SSO配置段主要需要以下项：

    1. 应用名：客户端程序config.py中SSO段的app\_name，SSO中注册的应用名称；

    2. app\_id：客户端程序config.py中SSO段的app\_id；

    3. app\_secret：客户端程序config.py中SSO段的app\_secret；

    4. 此外客户端config.py中SSO段中还有一个sso\_server，即passport的完全合格域名，也就是当前passport的域名

    .. figure:: /_static/images/passport_appdetail.png
        :alt: 

.. |image0| image:: /_static/images/passport_createadmin.png
.. |image1| image:: /_static/images/passport_login.png
.. |image2| image:: /_static/images/passport_set.png
.. |image3| image:: /_static/images/passport_ssoapp.png

