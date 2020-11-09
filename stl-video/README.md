# 播放器组件

### 使用方法
```
npm install @stl/stl-video

css:
    //使用默认图标时需要引入此字体图标文件，如果需要自定义按钮图标则需要引入对应的字体图标文件
    <link rel="stylesheet" href="https://js.wbp5.com/iconfont/build/video/iconfont.css" />

html:
    
    <div>
        <video id="videojs" src=""></video>
    </div>

ts:
    import  "../src/index"
    declare let BlVideo:any
    let option = {
         mode: 2,
        poster: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3893146502,314297687&fm=27&gp=0.jpg',
        iconfont:{play:"&#xE001;",pause:"&#xE002;",volume:"&#xE001;",volumeSilent:"&#xE001;",fullScreen:"&#xE001;",exitFullScreen:"&#xE001;"}
        streamLink: {
            mp4: "https://file.wbp5.com/upload/files/master/2020/03/10/161306043.mp4"
        },
    };
    BlVideo.operation.load("videojs", option);

```

### 参数说明
```
 //是否自动播放
  autoplay: boolean = null
  /*
    'auto'预加载视频（需要浏览器允许）;
    'metadata'仅预加载视频meta信息;
    'none'不预加载;
  */
  //预加载
  preload: string = "auto"
  //视频播放前的封面图
  poster: string;
  //是否循环播放
  loop: boolean = false;
  //视频的宽度
  width: number | string = "100%";
  //视频的高度
  height: number | string = "100%";
  //优先使用的播放模式
  teachOrder: Array<string> = ["html5", "flash"]
  //拉流超时时间，默认30s
  streamTimeoutTime: number = 30 * 1000;
  //播放器元素
  play: any;
  //流的链接地址
  streamLink: any = { hls: null, flv: null, trmp: null, mp4: null }
  //语言类型
  languages: string = "cn"
  //错误提示元素
  errorDom: any;
  //等待提示元素  
  loadWaitingDom: any;
  //视频中间的元素 比如说进入直播间或者其他的一些展示型 元素
  centerControlDom: any;
  // 直播时候的房间编号
  roomIdentifier: string;
  // 直播观看的人数
  visitorsNumber: string;
  /**
   * 播放的模式 
    flv 直播模式 0
    hls 直播模式 1
    mp4 视频播放模式 2
   */
  mode: any;
  //视频播放的描述点数据,只有在视频播放模式下才会有的数据
  stageDescriptionDatas: Array<any>;
  功能按钮的字体图标，如果需要自定义则需要引入对应的字体图标文件
  iconfont:any = {play:"&#xC002;",pause:"&#xC006;",volume:"&#xC004;",volumeSilent:"&#xC005;",fullScreen:"&#xC001;",exitFullScreen:"&#xC003;"}
```


### 方法说明
```
        BlVideo.hooks.videoTimeupdate = function () {
            console.log('videoTimeupdate');
        }
        BlVideo.hooks.videoLoadedmetadata = function () {
            console.log('videoLoadedmetadata');
        }
        BlVideo.hooks.videoLoadeddata = function () {
            console.log('videoLoadeddata');
        }
        BlVideo.hooks.videoLoadstart = function () {
            console.log('videoLoadstart');
        }
        BlVideo.hooks.completecreateVideo = function (el) {
            console.log(el);
        }
        BlVideo.hooks.videoCanplaythrough = function () {
            console.log('videoCanplaythrough');
        }
        BlVideo.hooks.videoProgress = function () {
            console.log('videoProgress');
        }
        BlVideo.hooks.initMediaSoureComplete = function (mediaSoure) {
            console.log('initMediaSoureComplete', mediaSoure);
        }
        BlVideo.hooks.initSourceBuffers = function (mimeType, sourceBuffer) {
            console.log('initSourceBuffers', mimeType, sourceBuffer);
        }
        BlVideo.hooks.sourceBufferUpdateend = function () {
            console.log('sourceBufferUpdateend');
            //如若需要一开始播放就回到上次播放的位置那么就在这里调用
            if (option.mode === 2) {
                that.seek(10);
            }
        }
        BlVideo.hooks.sendRequestStart = function () {
            console.log('sendRequestStart');
        }
        BlVideo.hooks.getStreamComplete = function () {
            console.log('getStreamComplete');
        }
        BlVideo.hooks.dataArrival = function () {
            console.log('dataArrival');
        }
        BlVideo.hooks.error = function (error) {
            console.log(error);
        }

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

        function seek(seekpoint) {
            const seekPoint = document.getElementsByClassName('seek-point')[0];
            seekpoint !== undefined ? BlVideo.operation.seekTo(seekpoint) : BlVideo.operation.seekTo(seekPoint.value);
        }

        function changeSource() {
            BlVideo.operation.changeSource(
                `http://flv60ff766a.live.126.net/live/63666a6da1db4ba1b2e9e05c838f5cdc.flv?netease=flv60ff766a.live.126.net`,
                'flv'
            )
        }
```