.. _changelog:

===========
更新日志
===========

v0.4.0
------

- feat: sphinx构建器由默认不可选的html改为可选，支持html, dirhtml. singlehtml等
- feat: 前端导航隐藏/显示git部分
- feat: cli project子命令添加对应选项
- feat: app模块，可以直接用gunicorn启动（rtfd.app:app）
- feat: api消息增加按项目分类
- feat: 构建文档前增加的js附加数据改为url query形式
- feat: 构建前后的钩子命令
- fix: build name for shelve
- fix: auto-update key type for shelve
- fix builder.sh when installing sphinx
- chore: update package info, add test

v0.3.3
------

Released in 2019-09-11

- fix: 删除项目时，没有删除自定义域名的nginx配置文件
- fix: 新建项目时，自定义域名与默认域名一致时错误
- fix: init子命令，默认server_url的值语法错误
- feat: 适配了py3
- chore: 添加测试

v0.3.2
------

Released in 2019-09-10

- 修复BUG
- 添加gitee的支持（包括webhook）
- 添加git远程仓库的属性标识（私有、公开）
- 添加自定义域名的唯一性检测

v0.3.1
------

Released in 2019-09-05

- 修复BUG
