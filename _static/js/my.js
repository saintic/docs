$(document).ready(function () {
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

    //关闭readthedocs.org的广告
    //$('.ethical-rtd.ethical-dark-theme').css('display', 'none');

    //百度统计
    if (window.location.host === "docs.saintic.com") {
        let _hmt = _hmt || [];
        let hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?02b77b16662ed42705572c6e53fad80d";
        let s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }

    //插入名句
    $.ajax({
        url: "https://hub.saintic.com/openservice/sentence/all.svg?has-url=true&inline-style=true&font-size=16",
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
        let goTop = document.getElementsByClassName("back2top");
        if (goTop.length > 0) {
            goTop[0].style.display = document.documentElement.scrollTop >= 200 || document.body.scrollTop >= 200 ? 'block' : 'none';
            goTop[0].onclick = function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        }
    }

    //添加utterances评论
    /* sphix rtd theme
    var hr = document.getElementsByTagName("footer")[0].getElementsByTagName("hr")[0];
    hr.insertAdjacentHTML('beforebegin', '<section id="comment"></section>');
    */
    /* sphinx materialdesign theme
    var div = document.createElement("div");
    div.className = "section";
    div.id = "comment";
    document.querySelector("main .document .page-content").appendChild(div);
    */
    let div = document.createElement("div");
    div.className = "section";
    div.id = "comment";
    document.querySelector(".t-content .t-body").appendChild(div);
    (function() {
        // 匿名函数，防止污染全局变量
        let utterances = document.createElement('script');
        utterances.type = 'text/javascript';
        utterances.async = true;
        utterances.setAttribute('issue-term','title');
        utterances.setAttribute('theme','github-light');
        utterances.setAttribute('repo','saintic/docs');
        utterances.crossorigin = 'anonymous';
        utterances.src = 'https://utteranc.es/client.js';
        document.getElementById('comment').appendChild(utterances);
    })();
});
