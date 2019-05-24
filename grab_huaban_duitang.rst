.. _grab_huaban_duitang:

==================
花瓣、堆糖网下载
==================

批量下载花瓣网画板、堆糖网专辑

程序地址：`Python版 <https://github.com/staugur/grab_huaban_board/>`_，`JavaScript版 <https://github.com/staugur/userscript>`_

功能说明：py版只有一个批量下载花瓣网的脚本，js版有两个油猴脚本分别下载花瓣网和堆糖网，且脚本已经上传到greasyfork。

补充说明：博客中的帮助问题和彩蛋已经将功能差不多写完了，本文档仅作记录。


for Python
^^^^^^^^^^

-  使用

0. git clone https://github.com/staugur/grab_huaban_board && cd grab_huaban_board

1. pip install requests

2. python grab_huaban_board.py

.. code-block:: bash

    usage: grab_huaban_board.py [-h] [-a ACTION] [-u USER] [-p PASSWORD]
                                [-v] [--board_id BOARD_ID] [--user_id USER_ID]

    optional arguments:
        -h, --help              show this help message and exit
        -a ACTION, --action ACTION
                                脚本动作 -> 1. getBoard: 抓取单画板(默认); 2. getUser: 抓取单用户
        -u USER, --user USER    花瓣网账号-手机/邮箱
        -p PASSWORD, --password PASSWORD
                                花瓣网账号对应密码
        -v, --version         查看版本号
        --board_id BOARD_ID   花瓣网单个画板id, action=getBoard时使用
        --user_id USER_ID     花瓣网单个用户id, action=getUser时使用

3. 更多请参考博客: https://blog.saintic.com/blog/204.html

4. gui_batchdownload.py

    这是一个gui程序，用于两个油猴脚本文本方式的批量下载，用以一定程度上避免迅雷等下载工具， `这里 <https://satic.io/gui_batchdownload.exe>`_ 已经打包了一个exe软件，可以在Windows下使用。

-  TODO

    1. –board_ids 多画板
    2. –user_ids 多用户
    3. –igonre 指定忽略画板

for JavaScript(花瓣、堆糖)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

-  更多请参考博客: https://blog.saintic.com/blog/256.html

-  花瓣网下载脚本主页及安装地址： `花瓣网下载 <https://greasyfork.org/zh-CN/scripts/368427-%E8%8A%B1%E7%93%A3%E7%BD%91%E4%B8%8B%E8%BD%BD>`_

-  堆糖网下载脚本主页及安装地址： `堆糖网下载 <https://greasyfork.org/zh-CN/scripts/369842-%E5%A0%86%E7%B3%96%E7%BD%91%E4%B8%8B%E8%BD%BD>`_
