import Component from '../component';
import { IE_VERSION } from '../utils/browser';
import optionModel from '../model/option-model';
import './html5'
import './flash'

/**
 * option
    * streamLink:{flv: "http://flv60ff766a.live.126.net/live/9d505d21ad7a4…285f5d15547a.flv?netease=flv60ff766a.live.126.net", 
                  hls: "http://pullhls60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a/playlist.m3u8", 
                  rtmp: "rtmp://v60ff766a.live.126.net/live/9d505d21ad7a47babdb8285f5d15547a"}
    * teachOrder:["html5", "flash"]
 */
class livStream extends Component {
    static switchplaymode: any;
    static playteach: any;
    static playhtml5: any;
    static playflash: any;
    constructor(play?: any, option?: any, ready?: any) {

        super(play, option, ready);

        //(<any>this.options_) = Public.mergeOptions(Component.options_,this.options_);

        // this.el_ = Component.options_.play;

        this.initplaymode(play, ready);
    }


    /**
     * 切换播放方式
     * @param type 播放类型
     */
    switchplaymode(type: String) {

    }


    /**
     * 初始化播放
     */
    initplaymode(play: any, ready: any) {
        let mode;

        if (IE_VERSION === -1||IE_VERSION === 11) {

            // 播放模式存在 且 第一个是存在的
            if (this.options_.teachOrder.length > 0 && this.options_.teachOrder[0].indexOf(optionModel.teachModel)) {
                mode = getStream.call(this, this.options_.teachOrder[0]);
            } else {
                mode = getStream.call(this, "html5");
            }
        } else {
            mode = getStream.call(this, "flash");
        }

        livStream.playteach = new mode(play, this.options_, ready);

        //判断可以播放的格式
        function getStream(type: string) {
            switch (type) {
                case "html5":
                    return livStream.playhtml5(this.options_);
                case "flash":
                    return livStream.playflash(this.options_);
                default:
                    throw new Error("直播流不存在");
            }
        }
    }
}

/**
 * 播放html5格式的流
 * @param {Object} option {streamLink:{hls:直播流,flv:直播流,rtmp:直播流},teachOrder:["html5", "flash"]}
 */
livStream.playhtml5 = (option: any) => {
    if (option.streamLink.flv || option.streamLink.hls || option.streamLink.mp4) {
        return Component.getComponents("html5");
    } else if (option.streamLink.trmp) {
        return Component.getComponents("flash");
    } else {
        throw new Error(`${Component.languages.errorMessage.noStream}`);
    }
}

/**
 * 播放flash格式的流
 */
livStream.playflash = () => {
    return Component.getComponents("flash");
}


Component.setComponents("livStream", livStream);
export default livStream


