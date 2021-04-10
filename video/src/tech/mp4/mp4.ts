import Component from "../../component";
class mp4 extends Component {
    mediaSoure: MediaSource;
    mediaSourceObjectURL: any;
    sourceBuffer: any
    arr: Array<any> = [];
    buffer: any;
    index = 0;
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        // this.mediaSoureInit().then(() => {
        //     if (Component.videoForegin.hooks.initMediaSoureComplete) {
        //         Component.videoForegin.hooks.initMediaSoureComplete(this.mediaSoure);
        //     }
        // });   
        Component.videoForegin.operation.changeSource = this.changeSource.bind(this);
        Component.options_.play.src = Component.options_.streamLink.mp4
    }

    changeSource(url: any, type: any) {
        Component.options_.streamLink[type] = url;
        Component.options_.play.src = Component.options_.streamLink.mp4
        Component.ischangeSource = true;
        if (Component.videoForegin.hooks.changeSourceComplet) {
            Component.videoForegin.hooks.changeSourceComplet();
        }
    }

    /***
     * 初始化mediaSoure
     */
    mediaSoureInit() {
        // return new Promise((resolve: any, reject: any) => {
        //     this.mediaSoure = new MediaSource();
        //     this.mediaSoure.addEventListener('sourceopen', this.sourceopenInit.bind(this), { once: true })
        //     this.mediaSoure.addEventListener('sourceended', this.sourceended.bind(this), { once: true });
        //     this.mediaSoure.addEventListener('sourceclose', function () { console.log("sourceclose") }, { once: true });
        //     this.mediaSourceObjectURL = URL.createObjectURL(this.mediaSoure);
        //     resolve('Is,Ok')
        //     Component.options_.play.src = this.mediaSourceObjectURL;
        // }).catch((error) => {
        //     Component.sendError(error);
        // })
    }


    /**
     * 监听sourceended
     */
    sourceended() {
        console.log('sourceended');
    }

    /**
     * 监听sourceopenInit
     * @param e 
     */
    sourceopenInit(e: any) {
        // const mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        const mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        this.sourceBuffer = this.mediaSoure.addSourceBuffer(mimeType);
        URL.revokeObjectURL(Component.options_.play.src);
        if (Component.videoForegin.hooks.initSourceBuffers) {
            Component.videoForegin.hooks.initSourceBuffers(mimeType, this.sourceBuffer);
        }
        this.getMediaResources()
    }

    /**
     * 获取数据
     */
    getMediaResources() {
        let mp4Url: any = Component.options_.streamLink.mp4;
        if (Component.videoForegin.hooks.sendRequestStart) {
            Component.videoForegin.hooks.sendRequestStart();
        }
        fetch(mp4Url)
            .then(function (response: any) {
                return response.arrayBuffer();
            })
            .then((arrayBuffer: any) => {
                if (Component.videoForegin.hooks.getStreamComplete) {
                    Component.videoForegin.hooks.getStreamComplete();
                }
                this.buffer = arrayBuffer;
                this.sourceBufferUpdateend();
                this.appendBuffer()
            })
    }

    /**
     * 监听sourceBufferUpdateend
     */
    sourceBufferUpdateend() {
        let that = this;
        this.sourceBuffer.addEventListener('updateend', function (e: any) {
            if (Component.videoForegin.hooks.sourceBufferUpdateend) {
                Component.videoForegin.hooks.sourceBufferUpdateend();
            }
            if (!that.sourceBuffer.updating && that.mediaSoure.readyState === 'open') {
                that.mediaSoure.endOfStream();
            }
        });
        this.sourceBuffer.addEventListener('error', function (e: any) {
            Component.sendError(e)
        });

    }

    /**
     * 填充数据
     */
    appendBuffer() {
        this.sourceBuffer.appendBuffer(this.buffer);
    }
}
Component.setComponents('mp4', mp4);

export default mp4;