import Component from './component';
import './initialization.ts';
declare class Play extends Component {
    /**
     *  缓存播放器列表
     */
    static players: object;
    videoToolBarDom: any;
    static liveStreamOption: object;
    constructor(player: any, option?: any, ready?: any);
    /**
    * 监听video
    */
    videoListen(): void;
    /**
     * 创建播放器
     */
    create(): Element;
    /**
     * 直播流处理
     */
    liveStream(): void;
}
export default Play;
