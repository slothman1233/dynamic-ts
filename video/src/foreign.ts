declare var window: {
    [key: string]: any;
    prototype: Window;
    new(): Window;
}
let BlVideo: any = {};
/**
 * 对外暴露的钩子函数
 */
class Hooks {

    _videoPlay: any;
    _waiting: any;
    _pause: any;
    _canplay: any;
    _seeking: any;
    _seeked: any;
    _loadstart: any;
    _loadeddata: any;
    _loadedmetadata: any;
    _canplaythrough: any;
    _progress: any;
    _timeupdate: any;
    _stalled: any;
    _abort: any;
    _initMediaSoureComplete: any;
    _initSourceBuffers: any;
    _sourceBufferUpdateend: any;
    _getStreamComplete: any;
    _sendRequestStart: any;
    _dataArrival: any;
    _error: any;
    _completecreateVideo: any;
    _reLoadComplet: any;
    _changeSourceComplet: any;
    _changeFullScreen:any;
    constructor() {

    }
    /**
     * video 播放的钩子函数
     */
    get videoPlay() {
        return this._videoPlay;
    }
    set videoPlay(callback) {
        this._videoPlay = callback;
    }

    /**
     * 重新加载的钩子函数
     */
    get reLoadComplet() {
        return this._reLoadComplet;
    }
    set reLoadComplet(callback) {
        this._reLoadComplet = callback;
    }

    /**
     * 修改源后的钩子函数
     */
    get changeSourceComplet() {
        return this._changeSourceComplet;
    }
    set changeSourceComplet(callback) {
        this._changeSourceComplet = callback;
    }

    /**
     * 创建播放器完成的钩子函数
     */
    get completecreateVideo() {
        return this._completecreateVideo;
    }
    set completecreateVideo(callback) {
        this._completecreateVideo = callback;
    }

    /**
     * video 等待的钩子函数
     */
    get videoWaiting() {
        return this._waiting;
    }
    set videoWaiting(callback) {
        this._waiting = callback;
    }

    /**
     * video 暂停的钩子函数
     */
    get videoPause() {
        return this._pause;
    }
    set videoPause(callback) {
        this._pause = callback;
    }

    /**
     * video canplay的钩子函数
     */
    get videoCanplay() {
        return this._canplay;

    }
    set videoCanplay(callback) {
        this._canplay = callback;
    }

    /**
     * video seeking的钩子函数
     */
    get videoSeeking() {

        return this._seeking;

    }
    set videoSeeking(callback) {
        this._seeking = callback;
    }

    /**
     * video seeked的钩子函数
     */
    get videoSeeked() {

        return this._seeked;

    }
    set videoSeeked(callback) {
        this._seeked = callback;
    }

    /**
     * video 客户端开始请求数据的钩子函数
     */
    get videoLoadstart() {

        return this._loadstart;

    }
    set videoLoadstart(callback) {
        this._loadstart = callback;
    }

    /**
     * video loadeddata的钩子函数
     */
    get videoLoadeddata() {

        return this._loadeddata;

    }
    set videoLoadeddata(callback) {
        this._loadeddata = callback;
    }

    /**
     * video 成功获取资源长度的钩子函数
     */
    get videoLoadedmetadata() {
        return this._loadedmetadata;
    }
    set videoLoadedmetadata(callback) {
        this._loadedmetadata = callback;
    }

    /**
     * video 可以播放歌曲全部加载完毕的钩子函数
     */
    get videoCanplaythrough() {
        return this._canplaythrough;

    }
    set videoCanplaythrough(callback) {
        this._canplaythrough = callback;
    }

    /**
     * video 客户端正在请求数据的钩子函数
     */
    get videoProgress() {

        return this._progress;

    }
    set videoProgress(callback) {
        this._progress = callback;
    }

    /**
     * video 播放时间改变的钩子函数
     */
    get videoTimeupdate() {

        return this._timeupdate;

    }
    set videoTimeupdate(callback) {
        this._timeupdate = callback;
    }

    /**
     * video 网速失速的钩子函数
     */
    get videoStalled() {
        return this._stalled;
    }
    set videoStalled(callback) {
        this._stalled = callback;
    }

    /**
     * video 客户端主动终止下载,不是因为错误引起的钩子函数
     */
    get videoAbort() {
        return this._abort;
    }
    set videoAbort(callback) {
        this._abort = callback;
    }


    /**
     *  完成初始化MediaSoure钩子函数 
     *  会返回一个MediaSoure的实列
     */
    get initMediaSoureComplete() {
        return this._initMediaSoureComplete;
    }
    set initMediaSoureComplete(callback) {
        this._initMediaSoureComplete = callback;
    }

    /**
     * 初始化SourceBuffers钩子函数
     * 会返回mimeType 和 SourceBuffer 的实列
     */
    get initSourceBuffers() {
        return this._initSourceBuffers;
    }
    set initSourceBuffers(callback) {
        this._initSourceBuffers = callback;
    }

    /**
     * sourceBuffer更新完成钩子函数
     */
    get sourceBufferUpdateend() {
        return this._sourceBufferUpdateend;
    }
    set sourceBufferUpdateend(callback) {
        this._sourceBufferUpdateend = callback;
    }

    /**
     * 开始发送请求的钩子函数
     */
    get sendRequestStart() {
        return this._sendRequestStart;
    }
    set sendRequestStart(callback) {
        this._sendRequestStart = callback
    }

    /**
     * 成功获取到流的钩子函数
     */
    get getStreamComplete() {
        return this._getStreamComplete;
    }
    set getStreamComplete(callback) {
        this._getStreamComplete = callback;
    }

    /**
     * 获取流后进行数据简单处理的钩子函数
     */
    get dataArrival() {
        return this._dataArrival;
    }
    set dataArrival(callback) {
        this._dataArrival = callback;
    }
    /**
     * 全屏切换的钩子函数
     * 此钩子函数会返回全屏状态
     */
    get changeFullScreen() {
        return this._changeFullScreen;
    }
    set changeFullScreen(callback) {
        this._changeFullScreen = callback;
    }
    /**
     * 错误捕获的钩子函数
     * 此钩子函数会返回错误信息 error
    */
    get error() {
        return this._error;
    }
    set error(callback) {
        this._error = callback;
    }

}

/**
 * 对外暴露的可操作性的函数
 */
class Operation {
    _playVideo: any;
    _pauseVideo: any;
    _reLoadVideo: any;
    _fullScreenVideo: any;
    _muteVideo: any;
    _restoreVoice: any;
    _seekTo: any;
    _load: any;
    _changeSource: any;
    _showCenterControl: any;
    _hideCenterControl: any;
    _updateVisitorsNum: any;
    constructor() {

    }

    /** 
     * 播放视频的操作方法
     */
    get playVideo() {
        return this._playVideo;
    }
    set playVideo(callback) {
        this._playVideo = callback;
    }

    /**
     * 隐藏视频中间的元素
     */
    get hideCenterControl() {
        return this._hideCenterControl;
    }
    set hideCenterControl(callback) {
        this._hideCenterControl = callback;
    }
    /**
     * 显示视频中间的元素
     */
    get showCenterControl() {
        return this._showCenterControl;
    }
    set showCenterControl(callback) {
        this._showCenterControl = callback;
    }

    /**
     * 修改在线观看人数
     */
    get updateVisitorsNum() {
        return this._updateVisitorsNum
    }
    set updateVisitorsNum(callback) {
        this._updateVisitorsNum = callback;
    }

    /**
     * 暂停视频的操作方法
     */
    get pauseVideo() {
        return this._pauseVideo;
    }
    set pauseVideo(callback) {
        this._pauseVideo = callback;
    }

    /**
     * 重新加载视频操作方法
     */
    get reLoadVideo() {
        return this._reLoadVideo;
    }
    set reLoadVideo(callback) {
        this._reLoadVideo = callback;
    }

    /**
     * 全屏视频操作方法
     */
    get fullScreenVideo() {
        return this._fullScreenVideo;
    }
    set fullScreenVideo(callback) {
        this._fullScreenVideo = callback
    }

    /**
     *  静音视频
     */
    get muteVideo() {
        return this._muteVideo;
    }
    set muteVideo(callback) {
        this._muteVideo = callback
    }

    /**
     * 恢复声音
     */
    get restoreVoice() {
        return this._restoreVoice;
    }
    set restoreVoice(callback) {
        this._restoreVoice = callback
    }

    /**
     * 跳转视频播放时间
     * 此方法可传递一个跳转时间
     */
    get seekTo() {
        return this._seekTo;
    }

    set seekTo(callback) {
        this._seekTo = callback
    }

    /**
     * 插件初始化方法
     *
     */
    get load() {
        return this._load;
    }

    set load(callback) {
        this._load = callback
    }

    /**
     * 切换播放的源
     */
    get changeSource() {
        return this._changeSource;
    }

    set changeSource(callback) {
        this._changeSource = callback;
    }
}

class videoForeign {
    hooks: Hooks;
    operation: Operation;

    constructor() {
        this.hooks = new Hooks();
        this.operation = new Operation();
        window['BlVideo'] = BlVideo;
        BlVideo.hooks = this.hooks;
        BlVideo.operation = this.operation;
    }
}

export default videoForeign;

