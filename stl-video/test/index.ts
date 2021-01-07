// import  "../src/index"
let that = this;
declare let BlVideo:any
let option = {
    streamLink: {
         hls:"http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8"
        //flv: "http://flv60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc.flv?netease=flv60ff766a.live.126.net",
        // hls: 'https://pullhls60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc/playlist.m3u8',
        //  mp4: "https://file.wbp5.com/upload/files/master/2020/03/10/161306043.mp4"
         //mp4:"https://file.wbp5.com/upload/files/master/2020/03/17/211551574.mp4",
        //mp4:"https://file.wbp5.com/upload/files/video/master/2020/11/07/110224117.mp4",
    },
    mode: 0,
    poster: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3893146502,314297687&fm=27&gp=0.jpg',
    // autoplay: 'autoplay',
    // preload: "none",
    loop:false,
    //iconfont:{play:"&#xE001;",pause:"&#xE002;",volume:"&#xE001;",volumeSilent:"&#xE001;",fullScreen:"&#xC001;",exitFullScreen:"&#xC003;"},
    fullScreenDom:document.getElementById("fullDom"),
    //loadWaitingDom:`<div class='loader-content' style="width:90px;height:27px;"><img src="https://img.wbp5.com/upload/files/master/2020/11/11/135946429.gif" /></div>`
};
BlVideo.operation.load("videojs", option);
BlVideo.hooks.videoTimeupdate = function(){
    console.log(this,(document.getElementById('videojs_1') as HTMLMediaElement).currentTime);
}
BlVideo.hooks.changeFullScreen = function(type:any){
    console.log("切换全屏："+type)
}
// BlVideo.hooks.videoPlay = function(){
//     console.log("paly")
// }
// BlVideo.hooks.videoPause = function(){
//     console.log("pause")
// }
// BlVideo.hooks.videoEnded = function(){
//     setTimeout(play,5000)
// }

// BlVideo.hooks.videoTimeupdate = function () {
//     console.log('videoTimeupdate');
// }
// BlVideo.hooks.videoLoadedmetadata = function () {
//     console.log('videoLoadedmetadata');
// }
// BlVideo.hooks.videoLoadeddata = function () {
//     console.log('videoLoadeddata');
// }
// BlVideo.hooks.videoLoadstart = function () {
//     console.log('videoLoadstart');
// }
// BlVideo.hooks.completecreateVideo = function (el:any) {
//     console.log(el);
// }
// BlVideo.hooks.videoCanplaythrough = function () {
//     console.log('videoCanplaythrough');
// }
// BlVideo.hooks.videoProgress = function () {
//     console.log('videoProgress');
// }
// BlVideo.hooks.initMediaSoureComplete = function (mediaSoure:any) {
//     console.log('initMediaSoureComplete', mediaSoure);
// }
// BlVideo.hooks.initSourceBuffers = function (mimeType:any, sourceBuffer:any) {
//     console.log('initSourceBuffers', mimeType, sourceBuffer);
// }
// BlVideo.hooks.sourceBufferUpdateend = function () {
//     console.log('sourceBufferUpdateend');
//     //如若需要一开始播放就回到上次播放的位置那么就在这里调用
//     if (option.mode === 2) {
//         that.seek(10);
//     }
// }
// BlVideo.hooks.sendRequestStart = function () {
//     console.log('sendRequestStart');
// }
// BlVideo.hooks.getStreamComplete = function () {
//     console.log('getStreamComplete');
// }
// BlVideo.hooks.dataArrival = function () {
//     console.log('dataArrival');
// }
// BlVideo.hooks.error = function (error:any) {
//     console.log(error);
// }

function play() {
    BlVideo.operation.playVideo()
}

function pause() {
    BlVideo.operation.pauseVideo()
}

function fullScreen() {
    BlVideo.operation.fullScreenVideo()
}

function muteVideo() {
    BlVideo.operation.muteVideo()
}

function reLoad() {
    BlVideo.operation.reLoadVideo()
}

function restoreVoice() {
    BlVideo.operation.restoreVoice()
}

function seek(seekpoint:any) {
    // const seekPoint = document.getElementsByClassName('seek-point')[0];
    // seekpoint !== undefined ? BlVideo.operation.seekTo(seekpoint) : BlVideo.operation.seekTo(seekPoint.value);
}

function changeSource() {
    BlVideo.operation.changeSource(
        `https://file.wbp5.com/upload/files/video/master/2020/11/07/110224117.mp4`,
        'mp4'
    )
}