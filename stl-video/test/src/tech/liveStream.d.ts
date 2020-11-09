import Component from '../component';
import './html5';
import './flash';
/**
 * option
    * streamLink:{flv: "http://flv60ff766a.live.126.net/live/9d505d21ad7a4…285f5d15547a.flv?netease=flv60ff766a.live.126.net",
                  hls: "http://pullhls60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a/playlist.m3u8",
                  rtmp: "rtmp://v60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a"}
    * teachOrder:["html5", "flash"]
 */
declare class livStream extends Component {
    static switchplaymode: any;
    static playteach: any;
    static playhtml5: any;
    static playflash: any;
    constructor(play?: any, option?: any, ready?: any);
    /**
     * 切换播放方式
     * @param type 播放类型
     */
    switchplaymode(type: String): void;
    /**
     * 初始化播放
     */
    initplaymode(play: any, ready: any): void;
}
export default livStream;
