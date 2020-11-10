/**
 * 对外暴露的钩子函数
 */
declare class Hooks {
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
    constructor();
    /**
     * video 播放的钩子函数
     */
    get videoPlay(): any;
    set videoPlay(callback: any);
    /**
     * 重新加载的钩子函数
     */
    get reLoadComplet(): any;
    set reLoadComplet(callback: any);
    /**
     * 修改源后的钩子函数
     */
    get changeSourceComplet(): any;
    set changeSourceComplet(callback: any);
    /**
     * 创建播放器完成的钩子函数
     */
    get completecreateVideo(): any;
    set completecreateVideo(callback: any);
    /**
     * video 等待的钩子函数
     */
    get videoWaiting(): any;
    set videoWaiting(callback: any);
    /**
     * video 暂停的钩子函数
     */
    get videoPause(): any;
    set videoPause(callback: any);
    /**
     * video canplay的钩子函数
     */
    get videoCanplay(): any;
    set videoCanplay(callback: any);
    /**
     * video seeking的钩子函数
     */
    get videoSeeking(): any;
    set videoSeeking(callback: any);
    /**
     * video seeked的钩子函数
     */
    get videoSeeked(): any;
    set videoSeeked(callback: any);
    /**
     * video 客户端开始请求数据的钩子函数
     */
    get videoLoadstart(): any;
    set videoLoadstart(callback: any);
    /**
     * video loadeddata的钩子函数
     */
    get videoLoadeddata(): any;
    set videoLoadeddata(callback: any);
    /**
     * video 成功获取资源长度的钩子函数
     */
    get videoLoadedmetadata(): any;
    set videoLoadedmetadata(callback: any);
    /**
     * video 可以播放歌曲全部加载完毕的钩子函数
     */
    get videoCanplaythrough(): any;
    set videoCanplaythrough(callback: any);
    /**
     * video 客户端正在请求数据的钩子函数
     */
    get videoProgress(): any;
    set videoProgress(callback: any);
    /**
     * video 播放时间改变的钩子函数
     */
    get videoTimeupdate(): any;
    set videoTimeupdate(callback: any);
    /**
     * video 网速失速的钩子函数
     */
    get videoStalled(): any;
    set videoStalled(callback: any);
    /**
     * video 客户端主动终止下载,不是因为错误引起的钩子函数
     */
    get videoAbort(): any;
    set videoAbort(callback: any);
    /**
     *  完成初始化MediaSoure钩子函数
     *  会返回一个MediaSoure的实列
     */
    get initMediaSoureComplete(): any;
    set initMediaSoureComplete(callback: any);
    /**
     * 初始化SourceBuffers钩子函数
     * 会返回mimeType 和 SourceBuffer 的实列
     */
    get initSourceBuffers(): any;
    set initSourceBuffers(callback: any);
    /**
     * sourceBuffer更新完成钩子函数
     */
    get sourceBufferUpdateend(): any;
    set sourceBufferUpdateend(callback: any);
    /**
     * 开始发送请求的钩子函数
     */
    get sendRequestStart(): any;
    set sendRequestStart(callback: any);
    /**
     * 成功获取到流的钩子函数
     */
    get getStreamComplete(): any;
    set getStreamComplete(callback: any);
    /**
     * 获取流后进行数据简单处理的钩子函数
     */
    get dataArrival(): any;
    set dataArrival(callback: any);
    /**
     * 错误捕获的钩子函数
     * 此钩子函数会返回错误信息 error
    */
    get error(): any;
    set error(callback: any);
}
/**
 * 对外暴露的可操作性的函数
 */
declare class Operation {
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
    constructor();
    /**
     * 播放视频的操作方法
     */
    get playVideo(): any;
    set playVideo(callback: any);
    /**
     * 隐藏视频中间的元素
     */
    get hideCenterControl(): any;
    set hideCenterControl(callback: any);
    /**
     * 显示视频中间的元素
     */
    get showCenterControl(): any;
    set showCenterControl(callback: any);
    /**
     * 修改在线观看人数
     */
    get updateVisitorsNum(): any;
    set updateVisitorsNum(callback: any);
    /**
     * 暂停视频的操作方法
     */
    get pauseVideo(): any;
    set pauseVideo(callback: any);
    /**
     * 重新加载视频操作方法
     */
    get reLoadVideo(): any;
    set reLoadVideo(callback: any);
    /**
     * 全屏视频操作方法
     */
    get fullScreenVideo(): any;
    set fullScreenVideo(callback: any);
    /**
     *  静音视频
     */
    get muteVideo(): any;
    set muteVideo(callback: any);
    /**
     * 恢复声音
     */
    get restoreVoice(): any;
    set restoreVoice(callback: any);
    /**
     * 跳转视频播放时间
     * 此方法可传递一个跳转时间
     */
    get seekTo(): any;
    set seekTo(callback: any);
    /**
     * 插件初始化方法
     *
     */
    get load(): any;
    set load(callback: any);
    /**
     * 切换播放的源
     */
    get changeSource(): any;
    set changeSource(callback: any);
}
declare class videoForeign {
    hooks: Hooks;
    operation: Operation;
    constructor();
}
export default videoForeign;
