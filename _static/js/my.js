document.addEventListener('DOMContentLoaded', function () {
    'use strict';

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

    //插入名句
    fetch("https://hub.saintic.com/openservice/sentence/all.svg?has-url=true&inline-style=true&font-size=16")
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP错误! 状态: ${response.status}`))
        .then(svgText => svgText && (document.getElementById("footer-extra-sentence").innerHTML = svgText))
        .catch(error => {
            console.error("获取名言时出错:", error);
        });

    //添加utterances评论（Furo 的正文容器为 #furo-main-content）
    let mainContent = document.getElementById('furo-main-content');
    if (mainContent) {
        let div = document.createElement("div");
        div.className = "section";
        div.id = "comment";
        mainContent.appendChild(div);
        (function () {
            // 匿名函数，防止污染全局变量
            let utterances = document.createElement('script');
            utterances.type = 'text/javascript';
            utterances.async = true;
            utterances.setAttribute('issue-term', 'title');
            utterances.setAttribute('theme', 'github-light');
            utterances.setAttribute('repo', 'saintic/docs');
            utterances.crossorigin = 'anonymous';
            utterances.src = 'https://utteranc.es/client.js';
            document.getElementById('comment').appendChild(utterances);
        })();
    }

});
