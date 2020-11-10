class VideoEmit {
    _loadeddata: any;
    _stalled: any;
    _progress: any;
    _timeupdate: any;
    _changeVideoPlayMode: any;
    _videoStageDescription: any;
    constructor() {

    }

    /**
     * video 状态为 loadeddata时候的回调函数
     */
    get loadeddata() {
        return this._loadeddata;
    }
    set loadeddata(callBack) {
        this._loadeddata = callBack;
    }
    /**
     * video 状态为 stalled时候的回调函数
     */
    get stalled() {
        return this._stalled;
    }
    set stalled(callBack) {
        this._stalled = callBack;
    }
    /**
     * video 状态为 progress时候的回调函数
     */
    get progress() {
        return this._progress;
    }
    set progress(callBack) {
        this._progress = callBack;
    }
    /**
     * video 状态为 timeupdate时候的回调函数
     */
    get timeupdate() {
        return this._timeupdate;
    }
    set timeupdate(callBack) {
        this._timeupdate = callBack;
    }

}

export default VideoEmit;