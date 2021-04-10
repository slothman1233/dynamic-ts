import Component from '../../component';
import FlvBase from './flvBase';
import IoControll from './io.controll';
class flv extends Component {

    fistOpen = false;
    flvBase: FlvBase;
    ioControll: IoControll;
    renderOptions: any;
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready);
        this.renderOptions = { play: play, option: option, ready: ready };
        this.render(true, null);
        this.listenerReload();
        Component.videoForegin.operation.reLoadVideo = this.reload.bind(this);
        Component.videoForegin.operation.changeSource = this.changeSource.bind(this);
    }

    /**
     * 初始化且调用IoControll发送请求
     * @param isFistSend  是否为第一次发送此字段作用在于 reLoad的时候
     */
    render(isFistSend: any, url: any) {
        this.flvBase = new FlvBase();
        this.getFlv(isFistSend, url);
        if (!isFistSend) {
            Component.videoForegin.operation.playVideo();
        } else {
            Component.ischangeSource = false;
        }
    }

    /**
     * 连接视频地址 获取媒体流
     */
    getFlv(isFistSend: any, url: any) {
        let flvSrc;
        url !== null ? flvSrc = url : flvSrc = this.options_.streamLink.flv;
        this.ioControll = new IoControll({ url: flvSrc, isFistSend: isFistSend });
        this.fistOpen = true;
    }

    /**
     * 监听reload的点击事件
     */
    listenerReload() {
        const that = this;
        const reloadEl = document.getElementsByClassName('reload')[0]
        reloadEl.addEventListener('click', ((e) => {
            that.reload();
            e.stopPropagation();
        }), false);
    }

    reload() {
        this.stop();
        this.render(false, null);
        if (Component.videoForegin.hooks.reLoadComplet) {
            Component.videoForegin.hooks.reLoadComplet();
        }
    }

    changeSource(url: any, type: string) {
        this.stop();
        this.render(false, url);        
        Component.options_.streamLink[type] = url;
        Component.ischangeSource = true;
        if (Component.videoForegin.hooks.changeSourceComplet) {
            Component.videoForegin.hooks.changeSourceComplet();
        }
    }

    stop() {
        this.ioControll.unload();
        this.detachMediaElement();
        this.ioControll.destroy();
        this.ioControll = null;
    }

    /**
     * 重置MediaElement
     */
    detachMediaElement() {
        var _mediaElement = Component.options_.play;
        if (_mediaElement) {
            this.flvBase.removevideoListen();
            this.flvBase = null;
            this.ioControll.mseControll.detachMediaElement();

        }
        if (this.ioControll) {
            this.ioControll.msectlDestroy();
        }
    }

}
Component.setComponents('flv', flv);

export default flv;