(function () {
    'use strict';

    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function (search, this_len) {
            if (this_len === undefined || this_len > this.length) {
                this_len = this.length;
            }
            return this.substring(this_len - search.length, this_len) === search;
        };
    }

    //设置sphinx_rtd_theme右侧内容占据全部宽度 [已通过css更改样式]
    //$('div.wy-nav-content').css('max-width','100%');

    //百度统计
    if (window.location.host === "docs.saintic.com") {
        var _hmt = _hmt || [];
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?02b77b16662ed42705572c6e53fad80d";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }

    //关闭readthedocs.org的广告
    $('.ethical-rtd.ethical-dark-theme').css('display', 'none');

    //插入名句
    $.ajax({
        url: "https://open.saintic.com/api/sentence/all.svg?has-url=true&inline-style=true&font-size=16",
        type: "GET",
        success: function (res) {
            if (res) {
                $("#footer-extra-sentence").html(res);
            }
        }
    });

    //强制http跳转到https
    if (window.location.protocol != "https:" && window.location.host === "docs.saintic.com") {
        window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    }

    //返回顶部
    window.onscroll = function () {
        var goTop = document.getElementsByClassName("back2top");
        if (goTop.length > 0) {
            goTop[0].style.display = document.documentElement.scrollTop >= 200 || document.body.scrollTop >= 200 ? 'block' : 'none';
            goTop[0].onclick = function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
    }

    //添加Isso评论
    var isDirIndex = location.pathname.endsWith("/index.html");
    var hr = document.getElementsByTagName("footer")[0].getElementsByTagName("hr")[0];
    hr.insertAdjacentHTML('beforebegin', '<section id="isso-thread"' + (isDirIndex ? (' data-isso-id="' + location.pathname.split("index.html")[0] + '"') : '') + '></section>');
    var hs = document.createElement("script");
    hs.type = "text/javascript";
    hs.src = 'https://pac.saintic.com/isso/docs/js/embed.min.js';
    hs.dataset.isso = 'https://pac.saintic.com/isso/docs';
    hs.dataset.issoAvatar = 'false';
    hs.dataset.issoGravatar = 'true';
    hs.dataset.issoReplyNotifications = 'true';
    hs.dataset.issoRequireAuthor = 'true';
    if (isDirIndex === true) {
        hs.dataset.issoId = location.pathname.split("index.html")[0];
    }
    document.getElementsByTagName('head')[0].appendChild(hs);
})();