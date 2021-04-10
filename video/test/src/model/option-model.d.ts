declare class optionModel {
    static teachModel: any;
    autoplay: boolean;
    preload: string;
    poster: string;
    loop: boolean;
    width: number | string;
    height: number | string;
    teachOrder: Array<string>;
    streamTimeoutTime: number;
    play: any;
    playBtnSrc: string;
    streamLink: any;
    languages: string;
    errorDom: any;
    loadWaitingDom: any;
    centerControlDom: any;
    roomIdentifier: string;
    visitorsNumber: string;
    /**
     * 播放的模式
      flv 直播模式 0
      hls 直播模式 1
      mp4 视频播放模式 2
     */
    mode: any;
    stageDescriptionDatas: Array<any>;
    iconfont: any;
}
export default optionModel;
