declare const muxjs: any;

import Component from '../../component';
import * as m3u8Parser from "./m3u8-parser/src/index" //解析 m3u8
import { get } from '../../utils/fetch'
import * as Public from "../../utils/public"
import "../../utils/mux/mux"
class hls extends Component {
    mediaSoure: MediaSource
    static resolveUrl: any
    playManifest: any   //流的对象对象
    streamfest: any     //多媒体的信息对象
    streamType: number = 0 //清晰度的选择
    sourceBuffer: any
    longTime = 1000 //轮询的时间长度
    cacheTime = 10 //存储的时间长度   当前超过了这个时间则删除 cacheTime - 1  的缓存时间
    allTime = 0 //总时间
    broferTime = 0; //当前时间的上一次的时间
    timoutNumber = 0; //超时次数
    lastTsSrc: any; //取到的最后一个ts的流文件
    transmuxer: any;
    remuxedSegs: any = [];
    remuxedBytesLength: any = 0;
    remuxedInitSegment: any = null;
    createInitSegment: any = true;
    offset = 0;
    index = 0;
    setTimeoutFetchHls: any;
    changeSourceUrl: any = null;

    //first = true //是否是首次执行
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        let that = this;
        that.render.call(that, true)
        Component.videoForegin.operation.reLoadVideo = this.reLoad.bind(this);
        Component.videoForegin.operation.changeSource = this.changeSource.bind(this);
        this.listenerReload();
    }

    render(isFist: any) {
        let that = this;
        that.transmuxer = new muxjs.mp4.Transmuxer();
        that.mediaSoureInit();
        if (!isFist) {
            Component.videoForegin.operation.playVideo();
        } else {
            Component.ischangeSource = false;
        }
    }

    addMux(callback: () => void) {
        let script = this.createEl('script', {
            className: "load-waiting",
        }, {
                src: "./utils/mux/mux.js"
            })

        document.body.appendChild(script).onload = function () {
            callback();
        }


    }

    reLoad() {
        this.unLoad();
        this.detachMediaElement();
        this.render(false);
        if (Component.videoForegin.hooks.reLoadComplet) {
            Component.videoForegin.hooks.reLoadComplet();
        }
    }

    changeSource(url: any, type: any) {
        this.unLoad();
        this.detachMediaElement();
        if (url) {
            this.changeSourceUrl = url
        }
        this.render(false);
        Component.options_.streamLink[type] = url;
        Component.ischangeSource = true;
        if (Component.videoForegin.hooks.changeSourceComplet) {
            Component.videoForegin.hooks.changeSourceComplet();
        }
    }

    listenerReload() {
        const that = this;
        const reloadEl = document.getElementsByClassName('reload')[0]
        reloadEl.addEventListener('click', ((e) => {
            that.reLoad();
            e.stopPropagation();
        }), false);
    }

    unLoad() {
        if (Component.options_.play) {
            Component.options_.play.pause();
        }
        if (this.setTimeoutFetchHls) {
            clearTimeout(this.setTimeoutFetchHls);
            this.setTimeoutFetchHls = null;
        }
        if (this.mediaSoure.readyState === 'open') {
            try {
                // If range removal algorithm is running, InvalidStateError will be throwed
                // Ignore it.
                this.sourceBuffer.abort();
            } catch (error) {
                Component.sendError(error)
            }
        }
    }

    detachMediaElement() {
        var _mediaElement = Component.options_.play;
        if (_mediaElement) {
            this.removevideoListen();
        }
        if (this.transmuxer) {
            this.transmuxer = null;
        }
        if (this.mediaSoure) {
            // remove all sourcebuffers
            let sb = this.sourceBuffer;
            if (sb) {
                if (this.mediaSoure.readyState !== 'closed') {
                    // ms edge can throw an error: Unexpected call to method or property access
                    try {
                        this.mediaSoure.removeSourceBuffer(sb);
                    } catch (error) {
                        Component.sendError(error)
                    }
                    sb.removeEventListener('updatestart', this.updatestart.bind(this));
                    sb.removeEventListener('update', this.update.bind(this));
                    sb.removeEventListener('updateend', this.updateend.bind(this));
                    sb.removeEventListener('error', this.error.bind(this));
                    sb.removeEventListener('abort', this.abort.bind(this));
                }
                this.sourceBuffer = null;
            }
            if (this.mediaSoure.readyState === 'open') {
                try {
                    this.mediaSoure.endOfStream();
                } catch (error) {
                    Component.sendError(error)
                }
            }
            this.mediaSoure.removeEventListener('sourceopen', this.init.bind(this))
            this.mediaSoure.removeEventListener('sourceended', function () { console.log("sourceended") });
            this.mediaSoure.removeEventListener('sourceclose', function () { console.log("sourceclose") });
            this.mediaSoure = null;
        }
        if (Component.options_.play.src) {
            window.URL.revokeObjectURL(Component.options_.play.src);
        }
        if (Component.options_.play) {
            Component.options_.play.src = '';
            Component.options_.play.removeAttribute('src');
        }

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
        Component.options_.play.removeEventListener("progress", function (e: any) {
        });
        Component.options_.play.removeEventListener('stalled', function (e: any) {
        });
    }

    init() {
        // if(this.first)
        this.sourceinit(), this.transmuxerbind();
        this.getarticulation();

    }

    getarticulation() {
        let parser = new m3u8Parser.Parser();
        let hlsSrc: any;
        this.changeSourceUrl !== null ? hlsSrc = this.changeSourceUrl : hlsSrc = this.options_.streamLink.hls
        get(hlsSrc).then((response) => {
            return response.text()
        })
            .then((data) => {
                this.changeSourceUrl = null;
                if (Component.videoForegin.hooks.sendRequestStart) {
                    Component.videoForegin.hooks.sendRequestStart();
                }
                parser.push(data);
                parser.end();
                if (!this.playManifest) { this.playManifest = {} }
                this.playManifest.streamSrc = this.options_.streamLink.hls; // 
                //是包含多媒体信息的media url  一些m3u8的文件信息
                if (data.indexOf("#EXT-X-STREAM-INF:") >= 0) {
                    this.streamfest = (<any>parser).manifest;
                    this.definition()
                    return
                }

                this.playManifest = Public.mergeOptions(this.playManifest, (<any>parser).manifest);
                this.playManifest.streamxhrSrc = hlsSrc //流地址
                this.fetchHls()
            })
            .catch((e) => {
                this.requesttimeout();
                Component.sendError(e)
            })
    }

    //解析m3u8
    fetchHls() {
        let parser = new m3u8Parser.Parser();
        fetch(this.playManifest.streamxhrSrc).then((response) => {
            return response.text()
        })
            .then((data) => {
                if (Component.videoForegin.hooks.getStreamComplete) {
                    Component.videoForegin.hooks.getStreamComplete();
                }
                parser.push(data);
                parser.end();
                this.streamRepeat(parser)
            })
            .catch((e) => {
                this.requesttimeout()
                Component.sendError(e)
            })
    }


    //去掉重复的ts流
    streamRepeat(parser: any) {
        if (Component.videoForegin.hooks.dataArrival) {
            Component.videoForegin.hooks.dataArrival();
        }
        //首次进来是没有值的
        if (!this.playManifest.segments) {
            this.playManifest = Public.mergeOptions(this.playManifest, parser.manifest);
        } else {
            var index = -1;
            for (var i = 0; i < parser.manifest.segments.length; i++) {
                if (parser.manifest.segments[i].uri === this.lastTsSrc) {
                    index = i;
                    break;
                }
            }

            //去掉重复的ts流数据
            if (index > -1) {
                parser.manifest.segments = parser.manifest.segments.slice(index + 1);
            }

            //没有最新的数据直接返回执行下一次轮询
            if (parser.manifest.segments.length <= 0) {
                (function (that) {
                    that.setTimeoutFetchHls = setTimeout(() => {
                        that.fetchHls.call(that);
                    }, that.longTime);
                })(this)
                return
            }


            this.playManifest = Public.mergeOptions(this.playManifest, parser.manifest);
        }

        //保存最后一条ts数据
        if (parser.manifest.segments.length > 0) {
            this.lastTsSrc = parser.manifest.segments[parser.manifest.segments.length - 1].uri;
        }

        this.getduration();

        this.transmuxerInit();
    }

    getduration() {
        if (this.allTime > 0) this.broferTime = this.allTime;
        for (var i = 0; i < this.playManifest.segments.length; i++) {
            this.allTime += this.playManifest.segments[i].duration;
        }
        console.log(this.allTime)
    }


    // 根据类型选取某个流地址
    definition() {
        let stream = this.streamfest.playlists[this.streamType]

        this.playManifest.streamxhrSrc = hls.resolveUrl(this.playManifest.streamSrc, stream.uri);
        this.fetchHls();
    }

    //video的初始化
    mediaSoureInit() {
        this.mediaSoure = new MediaSource();
        // 建立连接
        //URL.createObjectURL:
        //    会根据传入的参数创建一个指向该参数对象的URL. 这个URL的生命仅存在于它被创建的这个文档里. 新的对象URL指向执行的File对象或者是Blob对象.
        Component.options_.play.src = URL.createObjectURL(this.mediaSoure);
        /**
        sourceopen	readyState 从close到open 或 从ended到open
        sourceended	readyState 从open到ended
        sourceclose	readyState 从open到closed 或 从open到ended
        */
        this.mediaSoure.addEventListener('sourceopen', this.init.bind(this), { once: true })
        this.mediaSoure.addEventListener('sourceended', function () { console.log("sourceended") }, { once: true })
        this.mediaSoure.addEventListener('sourceclose', function () { console.log("sourceclose") }, { once: true })
        if (Component.videoForegin.hooks.initMediaSoureComplete) {
            Component.videoForegin.hooks.initMediaSoureComplete(this.mediaSoure);
        }
        // Component.options_.play.addEventListener("waiting",function(){
        //     debugger;
        // })

    }

    //媒体初始化
    sourceinit() {
        /**
         * URL.revokeObjectURL()
            方法会释放一个通过URL.createObjectURL()创建的对象URL. 当你要已经用过了这个对象URL,然后要让浏览器知道这个URL已经不再需要指向对应的文件的时候,就需要调用这个方法.
            具体的意思就是说,一个对象URL,使用这个url是可以访问到指定的文件的,但是我可能只需要访问一次,一旦已经访问到了,这个对象URL就不再需要了,就被释放掉,被释放掉以后,这个对象URL就不再指向指定的文件了.
            比如一张图片,我创建了一个对象URL,然后通过这个对象URL,我页面里加载了这张图.既然已经被加载,并且不需要再次加载这张图,那我就把这个对象URL释放,然后这个URL就不再指向这张图了.
         */
        //已经绑定成功后 链接就可以释放掉了
        URL.revokeObjectURL(Component.options_.play.src);

        this.sourceBufferInit()

        //this.first = false;
    }

    //sourceBuffer 的初始化
    sourceBufferInit() {
        // let mime = 'video/mp4; codecs="avc1.42c015, mp4a.40.5"';avc1.42001e"
        let mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
        // 设置 媒体的编码类型
        this.sourceBuffer = this.mediaSoure.addSourceBuffer(mime);
        this.sourceBuffer.addEventListener('updatestart', this.updatestart.bind(this));
        this.sourceBuffer.addEventListener('update', this.update.bind(this));
        this.sourceBuffer.addEventListener('updateend', this.updateend.bind(this));
        this.sourceBuffer.addEventListener('error', this.error.bind(this));
        this.sourceBuffer.addEventListener('abort', this.abort.bind(this));
        if (Component.videoForegin.hooks.initSourceBuffers) {
            Component.videoForegin.hooks.initSourceBuffers(mime, this.sourceBuffer);
        }
    }




    updatestart() {
        //console.log('updatestart: ' + this.mediaSoure.readyState);
    }
    update() {
        // console.log(`update:::::sourceBuffer:${this.sourceBuffer.updating},mediaSoure:${JSON.stringify(this.mediaSoure.readyState)}` )
    }

    error(e: any) {
        Component.sendError(e)
        //console.log('error: ' + this.mediaSoure.readyState);
    }
    abort() {
        // console.log('abort: ' + this.mediaSoure.readyState);
    }



    updateend() {
        //console.log(`updateend:::::sourceBuffer:${this.sourceBuffer.updating},mediaSoure:${JSON.stringify(this.mediaSoure.readyState)}` )
        /** mediaSoure
         * ReadyState
            状态值	描述
            closed	表示source还没有绑定到media元素上
            open	source被media元素打开并且有可用的SourceBuffer对象在sourceBuffers中
            ended	source还被绑定在media元素上，但是endOfStream() 执行过了
         */

        this.offset = 0;
        if (Component.videoForegin.hooks.sourceBufferUpdateend) {
            Component.videoForegin.hooks.sourceBufferUpdateend();
        }
        if (!this.sourceBuffer.updating && this.mediaSoure.readyState === 'open' && this.index == this.playManifest.segments.length - 1) {
            this.createInitSegment = true;
            if (this.playManifest.endList) {
                this.mediaSoure.endOfStream();
                return;
            }

            if (Component.options_.play.currentTime > this.cacheTime) {
                this.sourceBuffer.remove(0, this.cacheTime);
                this.cacheTime += this.cacheTime;
            } else {
                //Component.options_.play.play();
                this.index = 0;
                this.remuxedSegs = [];
                //  this.createInitSegment = true;
                //  this.remuxedInitSegment = null;
                (function (that) {
                    that.setTimeoutFetchHls = setTimeout(() => {
                        that.fetchHls.call(that);
                    }, that.longTime);
                })(this)

            }
            return;
        }
        //当用户开始播放视频时，获取下一段视频
        this.fetchNextSegment();

    }

    fetchNextSegment() {
        this.index += 1;
        let url = hls.resolveUrl(this.playManifest.streamxhrSrc, this.playManifest.segments[this.index]['uri']);
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {

                this.transmuxer.push(new Uint8Array(data));
                this.transmuxer.flush();

            }).catch((e) => {
                Component.sendError(e);
            })
    }



    transmuxerInit() {
        let videoUrl = hls.resolveUrl(this.playManifest.streamxhrSrc, this.playManifest.segments[this.index]['uri']);

        get(videoUrl)
            .then((response) => {
                return response.arrayBuffer()
            })
            .then((arrayBuffer) => {
                this.transmuxer.push(new Uint8Array(arrayBuffer))
                this.transmuxer.flush();
            })
            .catch((e) => {
                Component.sendError(e)
                this.requesttimeout()
            })

    }

    //mux数据的事件绑定
    transmuxerbind() {
        // 监听 transmuxer 数据添加
        this.transmuxer.on("data", (segment: any) => {

            //这个是 transmuxer 中队数据流的监听，我们其实就是需要将数据进行重新修改，让它能够在浏览器播放
            this.remuxedSegs.push(segment);

            //this.remuxedInitSegment = segment.initSegment
            // if(!this.remuxedInitSegment){
            //     this.remuxedInitSegment = segment.initSegment
            // }

            this.remuxedBytesLength = segment.data.byteLength;
            if (!this.remuxedInitSegment) {
                this.remuxedInitSegment = segment.initSegment;
            }

            this.appendBuffer.call(this);

        })
    }

    //将数据往 数据源列表填充
    appendBuffer() {
        let bytes, i = 0;
        if (this.createInitSegment) {
            //网络差的情况下  请求的视频段可能不是连贯的发  因此设置为无序播放  
            // mode segments 媒体段时间戳确定段播放的顺序  
            //   sequence 段附加到SourceBuffer的顺序决定了它们的播放顺序。为遵守此顺序的段自动生成段时间戳。
            if (this.sourceBuffer.mode === "segments" && Component.options_.play.currentTime > 0) {
                this.sourceBuffer.mode = "sequence";
            }
            //   this.sourceBuffer.timestampOffset = this.broferTime;
            bytes = new Uint8Array(this.remuxedInitSegment.byteLength + this.remuxedBytesLength);
            bytes.set(this.remuxedInitSegment, this.offset);
            this.offset += this.remuxedInitSegment.byteLength;
            this.createInitSegment = false;
        } else {
            bytes = new Uint8Array(this.remuxedBytesLength);
        }

        i = this.offset;

        bytes.set(this.remuxedSegs[this.index].data, i);



        //this.offset += this.remuxedSegs[this.index].byteLength;
        this.remuxedBytesLength = 0;
        this.sourceBuffer.appendBuffer(bytes);
    }


    //网速慢情况下缓冲
    buffer() {
        //可以播放的时间
        Component.options_.play.buffered.end(0)
    }


    //video的触发事件初始化
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

    //请求超时的情况
    requesttimeout() {
        this.timoutNumber += 1;
        this.getarticulation();
        // if(this.timoutNumber <5){
        //     this.timoutNumber +=1;
        //     this.getarticulation();
        // }
        // else{
        //     this.timoutNumber = 0;
        // }
    }


}


//绝对地址的拼接
hls.resolveUrl = (baseURL: any, relativeURL: any) => {
    if (/^[a-z]+:/i.test(relativeURL)) {
        return relativeURL;
    }

    if (/\/\//i.test(baseURL)) {
        if (baseURL.indexOf('?') >= 0) baseURL = baseURL.slice(0, baseURL.indexOf('?'));
        baseURL = baseURL.slice(0, baseURL.lastIndexOf('/') + 1) + "/";
        return baseURL + relativeURL
    }
}






Component.setComponents('hls', hls)
export default hls
