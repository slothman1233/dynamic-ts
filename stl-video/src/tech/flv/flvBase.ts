import Component from '../../component';
import f2m from './js/flv2fmp4'
import IoControll from './io.controll';
class FlvBase {
    _pendingSeekTime: any = null;
    _receivedCanPlay = false;
    _requestSetTime: boolean;
    constructor() {
    }

    /**
     *  监听video Stalled状态(网速失速)
     * @param e 
     */
    onvStalled(e: any) {
        this.checkAndResumeStuckPlayback(true);
    }

    /**
     * 监听 video Progress状态(客户端正在请求数据)
     * @param e 
     */
    onvProgress(e: any) {
        this.checkAndResumeStuckPlayback();
    }

    /**
     * 检查并恢复卡住或之后
     * @param stalled 
     */
    checkAndResumeStuckPlayback(stalled?: any) {
        let media = Component.options_.play;
        if (stalled || !this._receivedCanPlay || media.readyState < 2) { // HAVE_CURRENT_DATA
            let buffered = media.buffered;
            if (buffered.length > 0 && media.currentTime < buffered.start(0)) {
                console.log('FLVBase', `Playback seems stuck at ${media.currentTime}, seek to ${buffered.start(0)}`);
                this._requestSetTime = true;
                Component.options_.play.currentTime = buffered.end(0) - 0.5;
            }
        }
    }


    videoListen() {
        let that = this;
        Component.videoEmit.stalled = that.onvStalled.bind(that);
        Component.videoEmit.progress = that.onvProgress.bind(that);
    }

    removevideoListen() {
        let that = this;
        Component.options_.play.removeEventListener("play", function (e: any) {
        });
        Component.options_.play.removeEventListener("waiting", function (e: any) {
        });
        Component.options_.play.removeEventListener("pause", function (e: any) {
        });
        Component.options_.play.removeEventListener("canplay", function (e: any) {
        });
        Component.options_.play.removeEventListener("seeked", function (e: any) {
        });
        Component.options_.play.removeEventListener("seeking", function (e: any) {
        });
        Component.options_.play.removeEventListener("loadstart", function (e: any) {
        });
        Component.options_.play.removeEventListener("timeupdate", function (e: any) {
            console.log('timeupdate');
        });
        Component.options_.play.removeEventListener("canplaythrough", function (e: any) {
        });
        Component.options_.play.removeEventListener("loadeddata", function (e: any) {
        });
        Component.options_.play.removeEventListener("loadedmetadata", function (e: any) {
        });
        Component.options_.play.removeEventListener("progress", that.onvProgress.bind(that));
        Component.options_.play.removeEventListener('stalled', that.onvStalled.bind(that));
    }
}

export default FlvBase;