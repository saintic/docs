.. _picbed-hook:

=======
钩子
=======

或者称为扩展、插件吧，本质就是增强某个功能点的代码段，当然是用Python实现。

--------

.. _picbed-local:

内置钩子
-----------

所属本地，不允许删除，只能禁用、启用，目前有两个内置，up2local和token，
分别是将上传的图片保存到本地、API可以使用Token认证。

.. _picbed-thirds:

第三方钩子
------------

非内置的钩子所属均为第三方，我发布的第三方可以在
`GitHub搜索 <https://github.com/search?q=user%3Astaugur+picbed>`_

如何编写钩子？
----------------

目前已有的钩子及简介：
======================

before_request
^^^^^^^^^^^^^^^^^

即在flask的before_request钩子函数内运行的方法，无传参。

after_request
^^^^^^^^^^^^^^^^^

即在flask的after_request钩子函数内运行的方法，传递response参数。

upimg_save
^^^^^^^^^^^^^^

api上传在保存图片时使用的钩子，传递可变参数filename、stream、upload_path，分别是：文件名、二进制数据、上传路径。

另外，钩子中还应该有个upimg_delete方法用以删除图片[可选]，传递可变参数sha、upload_path、filename、basedir、save_result，分别是：图片唯一id、上传路径、文件名、基础路径、upimg_save返回结果。

其他登录系、用户资料系稍微复杂
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

下次分解
