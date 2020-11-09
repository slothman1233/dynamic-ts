declare class VideoEmit {
    _loadeddata: any;
    _stalled: any;
    _progress: any;
    _timeupdate: any;
    _changeVideoPlayMode: any;
    _videoStageDescription: any;
    constructor();
    /**
     * video 状态为 loadeddata时候的回调函数
     */
    get loadeddata(): any;
    set loadeddata(callBack: any);
    /**
     * video 状态为 stalled时候的回调函数
     */
    get stalled(): any;
    set stalled(callBack: any);
    /**
     * video 状态为 progress时候的回调函数
     */
    get progress(): any;
    set progress(callBack: any);
    /**
     * video 状态为 timeupdate时候的回调函数
     */
    get timeupdate(): any;
    set timeupdate(callBack: any);
}
export default VideoEmit;
