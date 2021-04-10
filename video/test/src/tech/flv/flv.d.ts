import Component from '../../component';
import FlvBase from './flvBase';
import IoControll from './io.controll';
declare class flv extends Component {
    fistOpen: boolean;
    flvBase: FlvBase;
    ioControll: IoControll;
    renderOptions: any;
    constructor(play: any, option: any, ready: any);
    /**
     * 初始化且调用IoControll发送请求
     * @param isFistSend  是否为第一次发送此字段作用在于 reLoad的时候
     */
    render(isFistSend: any, url: any): void;
    /**
     * 连接视频地址 获取媒体流
     */
    getFlv(isFistSend: any, url: any): void;
    /**
     * 监听reload的点击事件
     */
    listenerReload(): void;
    reload(): void;
    changeSource(url: any, type: string): void;
    stop(): void;
    /**
     * 重置MediaElement
     */
    detachMediaElement(): void;
}
export default flv;
