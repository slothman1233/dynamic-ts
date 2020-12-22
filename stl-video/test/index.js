(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    // import  "../src/index"
    var option = {
        streamLink: {
            // hls:"http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8"
            //flv: "http://flv60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc.flv?netease=flv60ff766a.live.126.net",
            // hls: 'https://pullhls60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc/playlist.m3u8',
            //  mp4: "https://file.wbp5.com/upload/files/master/2020/03/10/161306043.mp4"
            mp4: "https://file.wbp5.com/upload/files/master/2020/03/17/211551574.mp4"
        },
        mode: 2,
        poster: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3893146502,314297687&fm=27&gp=0.jpg',
        // autoplay: 'autoplay',
        // preload: "none",
        loop: false,
        //iconfont:{play:"&#xE001;",pause:"&#xE002;",volume:"&#xE001;",volumeSilent:"&#xE001;",fullScreen:"&#xC001;",exitFullScreen:"&#xC003;"},
        fullScreenDom: document.getElementById("fullDom")
    };
    BlVideo.operation.load("videojs", option);
    BlVideo.hooks.videoTimeupdate = function () {
        console.log(this, document.getElementById('videojs_1').currentTime);
    };
    BlVideo.hooks.changeFullScreen = function (type) {
        console.log("切换全屏：" + type);
    };

})));
//# sourceMappingURL=index.js.map
