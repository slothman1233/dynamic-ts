
/*
  分享出去的默认图片
<meta property="og:image" content="http://pic5.qiyipic.com/image/20170722/a4/64/v_112799399_m_601_m2.jpg">

    分享使用方法
    data-bshare = {type:"weibo",url:"",title:"",desc:"",summary:"",imgsrc:""}
    type     类型
    url      分享地址
    desc     分享默认文本框显示内容
    title    分享标题
    summary  分享简介
    images      图片地址
////////////////////////////////////////////////////////
qq空间分享: https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http%3A%2F%2Fgit.fx110.com&title=234234324234234234234&desc=11&summary=22&site=&pics=
url  地址
title 标题
summary  简介
desc  文本框默认内容
pics  分享的图片
site:'',分享来源 如：腾讯网(可选)
////////////////////////////////////////////////
微博分享：http://service.weibo.com/share/share.php?url=https%3A%2F%2Fwww.fx110.com%2&title=1212&appkey=1343713053&searchPic=true
appkey=1343713053
url     地址
title   文本框默认内容
*/


(function () {
    var Bshare = ["weibo", "qzone", "weixin","QQ"],
        qzone = "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
        weibo = "http://service.weibo.com/share/share.php",
        qq = "https://connect.qq.com/widget/shareqq/iframe_index.html";
        bashre = $('a[data-bshare]'),
        locationHref = document.location.href;


    $(document).on('click', '[data-bshare]', function (e) {
        requireUrl($(this).data('bshare'));
    })


    function requireUrl(data) {
        var d = isData(data);
        switch (d.type) {
            case "weibo":
                BashreFn.weiboFn(d)
                break
            case "qzone":
                BashreFn.qzoneFn(d)
                break
            case "weixin":
                BashreFn.weixinFn()
                break
            case "QQ":
                BashreFn.qqFn();   
            default:
                break
        }
    }

    function GetRequest(url) {
        var u;
        if (url.charAt(url.length - 1) != "?") {
            u = url + "?";
        }
        return u;
    }

    //json 数据处理
    function isData(data) {
        var d;

        try {
            d = eval("(" + data + ")");
        }
        catch (e) {
            d = data;
        }

        if (d.url == undefined || d.url.length <= 0) {
            d.url = locationHref;
        }

        return d
    }

    function isUndefined(v) {
        if (v == undefined || !v) {
            return "";
        }
        return v;
    }

    function bashreHref(href) {
        window.open(href, '_blank', 'width=800,height=800,left=10,top=10,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    }

    var qrcode = {
        qrcHtml: $("#qrcHtml"),
        qrc: $('#QRcode'),
        init: function () {
            if ($('#QRcode').length > 0) {
                $('#QRcode').show();
            }
            else {
                this.QRChtmlFn();
                this.qrcode();
            }
        },
        qrcode: function () {

            $("#qrcHtml").empty();
            var str = toUtf8(locationHref);
            $("#qrcHtml").qrcode({ render: "canvas", width: 200, height: 200, text: str });
            $('#QRcode').show();
        },
        QRChtmlFn: function () {
            var html = "<div id='QRcode' style='position: fixed;left: 50%;top:50%;margin:-224px 0 0 -150px;padding: 40px;width: 220px !important;height: 228px !important;background: #fff;border: solid 1px #d8d8d8;z-index: 11001; font-size: 12px;'>"
            + "<div id='qrcHtml' style='width:200px;height:200px;margin:auto;'></div>"
            + "<div style='text-align: center;margin-top:5px;'>使用微信扫一扫</div>"
            + "<a href='javascript:;' id='qrcClose' style='width: 16px; height: 16px;position: absolute; right: 0;top: 0;color: #999;text-decoration: none;font-size: 16px;'>×</a>"
            + "</div>";
            $('body').append(html);
            $('#qrcClose').click(function () { $('#QRcode').hide(); });
        }

    }


    var BashreFn = {
        weiboFn: function (d) {

            var href = GetRequest(weibo) + "url=" + isUndefined(d.url) + "&pic=" + isUndefined(d.images) + "&type=button&language=zh_cn&style=simple&searchPic=true&title=" + isUndefined(d.summary) + "&appkey=";
            bashreHref(href);

        },
        qzoneFn: function (d) {
            var href = GetRequest(qzone) + "url=" + isUndefined(d.url) + "&title=" + replacechat(isUndefined(d.title)) + "&summary=" + replacechat(isUndefined(d.summary)) + "&desc=" + replacechat(isUndefined(d.desc)) + "&pics=" + replacechat(isUndefined(d.images));
            bashreHref(href);
        },
        weixinFn: function () {
            qrcode.init();
        },
        qqFn:function() {
            var href = GetRequest(qq) + "url=" + isUndefined(d.url) + "&title=" + replacechat(isUndefined(d.title)) + "&summary=" + replacechat(isUndefined(d.summary)) + "&desc=" + replacechat(isUndefined(d.desc)) + "&pics=" + replacechat(isUndefined(d.images));
            bashreHref(href);
        }
    }


    function replacechat(data) {
        return data.replace(/%/ig, "");
    }


  

   

})()