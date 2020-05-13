.. _picbed-api:

============
RESTful API
============

约定
Access-Control-Allow-Headers: Authorization
Access-Control-Allow-Origin: \*或具体来源

.. http:get:: /users/(int:user_id)/posts/(tag)

   The posts tagged with `tag` that the user (`user_id`) wrote.

   It accepts :http:method:`post` only.

   **Example request**:

   .. sourcecode:: http

      GET /users/123/posts/web HTTP/1.1
      Host: example.com
      Accept: application/json, text/javascript

   **Example response**:

   .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept
      Content-Type: text/javascript

      [
        {
          "post_id": 12345,
          "author_id": 123,
          "tags": ["server", "web"],
          "subject": "I tried Nginx"
        },
        {
          "post_id": 12346,
          "author_id": 123,
          "tags": ["html5", "standards", "web"],
          "subject": "We go to HTML 5"
        }
      ]

   :query sort: one of ``hit``, ``created-at``
   :query offset: offset number. default is 0
   :query limit: limit number. default is 30
   :reqheader Accept: the response content type depends on
                      :mailheader:`Accept` header
   :reqheader Authorization: optional OAuth token to authenticate
   :resheader Content-Type: this depends on :mailheader:`Accept`
                            header of request
   :statuscode 200: no error
   :statuscode 404: there's no user

1. api.index
-------------

.. http:any:: /api/, /api/index

  Api首页，仅用来表明登录态，允许 :http:method:`post` :http:method:`get` 方法

  :resjson: Hello picbed(未登录)/<username>(已登录)

2. api.login
-------------

.. http:post:: /api/login
  
  登录接口

  :form username: 用户名
  :form password: 登录密码
  :form set_state: boolean: 是否设置登录态
  :form remember: boolean: 是否记住我(7d)
  :resjson string sid: SessionId
  :resjson string expire: 过期时间戳

  **示例：**

  .. http:example:: curl python-requests

    POST /api/login HTTP/1.1
    Host: 127.0.0.1:9514
    Content-Type: application/x-www-form-urlencoded

    username=xxx&&password=your-password-here


    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "code": 0,
        "sid": "xxxxxxx",
        "expire": 123456789
    }


3. api.register
-----------------

.. http:post:: /api/register
  
  注册接口

  :form username: 用户名
  :form password: 密码
  :form avatar: 头像地址
  :form nickname: 昵称
  :statuscode 404: 管理员关闭注册时

  **示例：**

  .. http:example:: curl python-requests

    POST /api/register HTTP/1.1
    Host: 127.0.0.1:9514
    Content-Type: application/x-www-form-urlencoded

    username=xxx&&password=your-password-here


    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "code": 0
    }

4. api.waterfall
-----------------

.. http:get:: /api/waterfall
  
  图片列表接口，要求登录，也允许 :http:method:`post` 方法查询。

  :query string sort: 根据图片上传时间排序，asc正序，desc倒序
  :query number page: 页数，从1开始
  :query number limit: 一次性返回条数，默认10
  :query boolean is_mgr: 要求以管理员级别查询（当然用户也得是管理员才行）
  :query string album: 查询相册，可以用逗号分隔查询多个相册
  :form album: 等于query查询参数的album
  :resjson number count: 用户的图片总数
  :resjson number pageCount: 根据limit和count计算的总页数
  :resjsonarr albums: 用户的相册列表 
  :resjsonarr data: 用户的图片列表
  :statuscode 403: 未登录时

  **示例：**

  .. http:example:: curl python-requests

    GET /api/waterfall HTTP/1.1
    Host: 127.0.0.1:9514
    Authorization: LinkToken Your-LinkToken-Value

    :query limit: 1


    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "albums": [
            "misc",
            "gif",
            "test",
            "LinkPlugin"
        ],
        "code": 0,
        "count": 57,
        "data": [
            {
                "agent": "homepage/0.5.5",
                "album": "",
                "ctime": 1589266897,
                "filename": "1589266897617.gif",
                "sender": "up2local",
                "senders": [
                    {
                        "code": 0,
                        "sender": "up2local",
                        "src": "http://127.0.0.1:9514/static/upload/admin/1589266897617.gif"
                    }
                ],
                "sha": "sha1.1589266897.6169922.80b939eca2183d30281bfdc29ba41aac8f8a21ed",
                "src": "http://127.0.0.1:9514/static/upload/admin/1589266897617.gif",
                "status": "enabled",
                "upload_path": "admin/",
                "user": "admin"
            }
        ],
        "msg": null,
        "pageCount": 57
    }


5. api.shamgr
-----------------

.. http:get:: /api/shamgr/<string:sha>
  
  图片详情接口

  :param sha: 图片的唯一标识
  :type sha: string
  :resjsonarr data: 图片详情（上述接口的图片列表中包含的就是此详情数据）
  :statuscode 404: 没有对应图片时

  **示例：**

  .. http:example:: curl python-requests

    GET /api/shamgr/sha1.xxxxxxx HTTP/1.0
    Host: 127.0.0.1:9514


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "code": 0,
        "data": {
            "album": "",
            "src": "http://picbed.dev.vip/static/upload/admin/1589266897617.gif",
            "sender": "up2local",
            "tpl": {
                "rST": ".. image:: http://picbed.dev.vip/static/upload/admin/1589266897617.gif",
                "HTML": "<img src='http://picbed.dev.vip/static/upload/admin/1589266897617.gif' alt='1589266897617.gif'>",
                "Markdown": "![1589266897617.gif](http://picbed.dev.vip/static/upload/admin/1589266897617.gif)"
            },
            "agent": "homepage/0.5.5",
            "filename": "1589266897617.gif",
            "sha": "sha1.1589266897.6169922.80b939eca2183d30281bfdc29ba41aac8f8a21ed",
            "status": "enabled",
            "user": "admin",
            "upload_path": "admin/",
            "senders": null,
            "ctime": 1589266897
        }
    }

.. http:delete:: /api/shamgr/<string:sha>

  图片删除接口，要求登录，只有图片所属用户和管理员允许删除。

  :param sha: 图片的唯一标识
  :type sha: string
  :statuscode 404: 没有对应图片时
  :statuscode 403: 未登录或图片所属用户与请求用户不匹配

.. http:put:: /api/shamgr/<string:sha>

  图片数据更新接口，要求登录，只有图片所属用户和管理员允许修改。

  :param sha: 图片的唯一标识
  :type sha: string
  :query string Action: 更新指令，目前仅支持一个updateAlbum（更新相册名）
  :form album: 相册名
  :statuscode 404: 没有对应图片时
  :statuscode 403: 未登录或图片所属用户与请求用户不匹配

  **示例：**

  .. http:example:: curl python-requests

    PUT /api/shamgr/sha1.xxxxxxx HTTP/1.0
    Host: 127.0.0.1:9514

    :query Action: updateAlbum

    album=newName


6. api.album
-----------------

.. http:get:: /api/album
  
  用户相册列表接口，要求登录，也允许 :http:method:`post` 方法查询。

  :resjsonarr data: 相册列表
  :resjson object counter: 每个相册中的图片数

  **示例：**

  .. http:example:: curl python-requests

    GET /api/album HTTP/1.0
    Host: 127.0.0.1:9514


    HTTP/1.0 200 OK
    Content-Type: application/json

    {
        "msg": null,
        "code": 0,
        "data": [
            "misc",
            "gif",
            "test",
            "LinkPlugin"
        ],
        "counter": {
            "misc": 1,
            "gif": 1,
            "test": 7,
            "aaaaa": 1,
            "LinkPlugin": 2
        }
    }

7. api.upload
-----------------

.. http:post:: /api/upload
  
  图片上传接口，默认不允许匿名（可由管理员开启允许），有两种上传模式，
  文件域和base64。

  获取上传数据的字段默认是picbed，管理员可以在控制台修改，但是不建议改，
  如果要改，首页上传会自动跟随，但uploader.js中需要手动更新。

  :query string format: 指定图片地址的显示字段
  :form album: 图片所属相册（匿名时总是直接设置为anonymous）
  :form format: 等于query查询参数的format
  :resjson string filename: 最终保存到服务器的文件名
  :resjson string sender: 保存图片的钩子名
  :resjson string api: 图片详情接口的地址 
  :resjson string src: 图片地址
  :statuscode 403: 管理员不允许匿名上传且用户未登录时

  .. tip::

    图片地址src是可以自定义的，利用format参数，允许使用最多一个点号。

    举例，默认返回{code:0, src:xx}

    - format=imgUrl  （这种情况最少需要两个字符）

        {code:0, imgUrl:xx}

    - format=data.src

        {code:0, data:{src:xx}}

    大概是这两种情况，src字段改名或者改为子对象中的字段。

  .. http:example::

    POST /api/upload HTTP/1.1
    Host: 127.0.0.1:9514
    Authorization: LinkToken Your-LinkToken-Value


    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "src": "http://picbed.dev.vip/static/upload/admin/1589362171435.jpg",
        "code": 0,
        "sender": "up2local",
        "filename": "1589362171435.jpg",
        "api": "http://picbed.dev.vip/api/sha/sha1.1589362171.44.790d07c9a0fd7538ea9dc7c1ec208dbcd291ce35",
        "msg": null
    }

  **文件域上传示例：**

  .. code:: http

    - curl

        curl http://127.0.0.1:9514/api/upload -F "picbed=@上传的图片路径" -XPOST

    - python

        files = {
            'picbed': (filename, open("图片", "rb"))
        }
        headers = {"Authorization": "LinkToken xxxx"}
        requests.post(
            "http://127.0.0.1:9514/api/upload",
            files=files,
            headers=headers,
        ).json()


  **base64上传示例：**

  .. code:: http

    - curl

        curl http://127.0.0.1:9514/api/upload -d "picbed=图片base64编码" -XPOST

    - python

        headers = {"Authorization": "LinkToken xxxx"}
        requests.post(
            "http://127.0.0.1:9514/api/upload",
            data=dict(picbed="图片base64编码"),
            headers=headers,
        ).json()


