(function() {
    'use strict';

    //设置sphinx_rtd_theme右侧内容占据全部宽度 [已通过css更改样式]
    //$('div.wy-nav-content').css('max-width','100%');

    //百度统计
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?02b77b16662ed42705572c6e53fad80d";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);

    //关闭readthedocs.org的广告
    $('.ethical-rtd.ethical-dark-theme').css('display','none');
})();