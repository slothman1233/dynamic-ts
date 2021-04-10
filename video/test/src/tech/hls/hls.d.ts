import Component from '../../component';
import "../../utils/mux/mux";
declare class hls extends Component {
    mediaSoure: MediaSource;
    static resolveUrl: any;
    playManifest: any;
    streamfest: any;
    streamType: number;
    sourceBuffer: any;
    longTime: number;
    cacheTime: number;
    allTime: number;
    broferTime: number;
    timoutNumber: number;
    lastTsSrc: any;
    transmuxer: any;
    remuxedSegs: any;
    remuxedBytesLength: any;
    remuxedInitSegment: any;
    createInitSegment: any;
    offset: number;
    index: number;
    setTimeoutFetchHls: any;
    changeSourceUrl: any;
    constructor(play: any, option: any, ready: any);
    render(isFist: any): void;
    addMux(callback: () => void): void;
    reLoad(): void;
    changeSource(url: any, type: any): void;
    listenerReload(): void;
    unLoad(): void;
    detachMediaElement(): void;
    removevideoListen(): void;
    init(): void;
    getarticulation(): void;
    fetchHls(): void;
    streamRepeat(parser: any): void;
    getduration(): void;
    definition(): void;
    mediaSoureInit(): void;
    sourceinit(): void;
    sourceBufferInit(): void;
    updatestart(): void;
    update(): void;
    error(e: any): void;
    abort(): void;
    updateend(): void;
    fetchNextSegment(): void;
    transmuxerInit(): void;
    transmuxerbind(): void;
    appendBuffer(): void;
    buffer(): void;
    /**
       eventTester("loadstart");   //客户端开始请求数据
       eventTester("progress");    //客户端正在请求数据
       eventTester("suspend");     //延迟下载
       eventTester("abort");       //客户端主动终止下载（不是因为错误引起），
       eventTester("error");       //请求数据时遇到错误
       eventTester("stalled");     //网速失速
       eventTester("play");        //play()和autoplay开始播放时触发
       eventTester("pause");       //pause()触发
       eventTester("loadedmetadata");  //成功获取资源长度
       eventTester("loadeddata");  //
       eventTester("waiting");     //等待数据，并非错误
       eventTester("playing");     //开始回放
       eventTester("canplay");     //可以播放，但中途可能因为加载而暂停
       eventTester("canplaythrough"); //可以播放，歌曲全部加载完毕
       eventTester("seeking");     //寻找中
       eventTester("seeked");      //寻找完毕
       eventTester("timeupdate");  //播放时间改变
       eventTester("ended");       //播放结束
       eventTester("ratechange");  //播放速率改变
       eventTester("durationchange");  //资源长度改变
       eventTester("volumechange");    //音量改变
    
     */
    requesttimeout(): void;
}
export default hls;
