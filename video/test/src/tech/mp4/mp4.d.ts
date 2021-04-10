import Component from "../../component";
declare class mp4 extends Component {
    mediaSoure: MediaSource;
    mediaSourceObjectURL: any;
    sourceBuffer: any;
    arr: Array<any>;
    buffer: any;
    index: number;
    constructor(play: any, option: any, ready: any);
    changeSource(url: any, type: any): void;
    /***
     * 初始化mediaSoure
     */
    mediaSoureInit(): void;
    /**
     * 监听sourceended
     */
    sourceended(): void;
    /**
     * 监听sourceopenInit
     * @param e
     */
    sourceopenInit(e: any): void;
    /**
     * 获取数据
     */
    getMediaResources(): void;
    /**
     * 监听sourceBufferUpdateend
     */
    sourceBufferUpdateend(): void;
    /**
     * 填充数据
     */
    appendBuffer(): void;
}
export default mp4;
