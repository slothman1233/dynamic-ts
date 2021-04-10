/* eslint-disable */
import flvparse from './flv/flvParse';
import tagdemux from './flv/tagdemux';
import mp4remux from './mp4/mp4remux';
import mp4moof from './mp4/mp4moof';
class flv2fmp4 {
    _config:any
    onInitSegment:any
    onMediaSegment:any = null
    onMediaInfo:any = null
    seekCallBack:any = null

    // 内部使用
    loadmetadata:any = false
    ftyp_moov:any = null
    metaSuccRun:any = false
    metas:any = []
    parseChunk:any = null
    hasVideo:any = false
    hasAudio:any = false
    _mp3UseMpegAudio:any
    _videoMeta:any
    // 临时记录seek时间
    _pendingResolveSeekPoint:any = -1

    // 临时记录flv数据起始时间
    _tempBaseTime:any = 0

    // 处理flv数据入口
    setflvBase:any
    tagDemux:any
    m4mof:any
    _audioMeta:any
    error:any
    /**
     * Creates an instance of flv2fmp4.
     * config 里面有_isLive属性,是否是直播
     * @param {any} config
     *
     * @memberof flv2fmp4
     */
    constructor(config:any) {
        this._config = {
            _isLive: false
        };
        this._config = Object.assign(this._config, config);

        // 外部方法赋值
        this.onInitSegment = null;
        this.onMediaSegment = null;
        this.onMediaInfo = null;
        this.seekCallBack = null;

        // 内部使用
        this.loadmetadata = false;
        this.ftyp_moov = null;
        this.metaSuccRun = false;
        this.metas = [];
        this.parseChunk = null;
        this.hasVideo = false;
        this.hasAudio = false;
        // 临时记录seek时间
        this._pendingResolveSeekPoint = -1;

        // 临时记录flv数据起始时间
        this._tempBaseTime = 0;

        // 处理flv数据入口
        this.setflvBase = this.setflvBasefrist;
        this.tagDemux = new tagdemux()
        this.tagDemux._onTrackMetadata = this.Metadata.bind(this);
        this.tagDemux._onMediaInfo = this.metaSucc.bind(this);
        this.tagDemux._onDataAvailable = this.onDataAvailable.bind(this);
        this.m4mof = new mp4moof(this._config);
        this.m4mof.onMediaSegment = this.onMdiaSegment.bind(this);
    }
    seek(baseTime:any) {
        this.setflvBase = this.setflvBasefrist;
        if (baseTime == undefined || baseTime == 0) {
            baseTime = 0;
            this._pendingResolveSeekPoint = -1;
        }
        if (this._tempBaseTime != baseTime) {
            this._tempBaseTime = baseTime;
            this.tagDemux._timestampBase = baseTime;
            this.m4mof.seek(baseTime);

            this._pendingResolveSeekPoint = baseTime;
        }
    }

    insertDiscontinuity() {
        this.m4mof.insertDiscontinuity();
    }

    /**
     * 不要主动调用这个接口!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * 第一次接受数据,和seek时候接受数据入口,
     *
     * @param {any} arraybuff
     * @param {any} baseTime
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflvBasefrist(arraybuff:any, byteStart:any) {

        let offset = flvparse.setFlv(new Uint8Array(arraybuff));
        if (flvparse.arrTag[0].type != 18) {
            if (this.error) this.error(new Error('without metadata tag'));
        }
        if (flvparse.arrTag.length > 0) {
            this.tagDemux.hasAudio = this.hasAudio = flvparse._hasAudio;
            this.tagDemux.hasVideo = this.hasVideo = flvparse._hasVideo;

            if (this._tempBaseTime != 0 && this._tempBaseTime == flvparse.arrTag[0].getTime()) {
                this.tagDemux._timestampBase = 0;
            }
            offset = this.tagDemux.moofTag(arraybuff, byteStart);
            this.setflvBase = this.setflvBaseUsually;
        }

        return offset;
    }

    /**
     * 不要主动调用这个接口!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * 后续接受数据接口
     * @param {any} arraybuff
     * @param {any} byteStart
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflvBaseUsually(arraybuff:any, byteStart:any) {
        let offset = flvparse.setFlv(new Uint8Array(arraybuff));

        if (flvparse.arrTag.length > 0) {
            offset = this.tagDemux.moofTag(arraybuff, byteStart);
        }

        return offset;
    }

    /**
     * 不要主动调用这个接口!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     * moof回调
     *
     * @param {any} track
     * @param {any} value
     *
     * @memberof flv2fmp4
     */
    onMdiaSegment(track:any, value:any) {

        if (this.onMediaSegment) {
            value.data = new Uint8Array(value.data).buffer;
            this.onMediaSegment(value, value);
        }
        if (this._pendingResolveSeekPoint != -1 && track == 'video') {
            let seekpoint = this._pendingResolveSeekPoint;
            this._pendingResolveSeekPoint = -1;
            if (this.seekCallBack) {
                this.seekCallBack(seekpoint);
            }
        }
    }

    /**
     *
     * 音频和视频的初始化tag
     *
     * @param {any} type
     * @param {any} meta
     *
     * @memberof flv2fmp4
     */
    Metadata(type:any, meta:any) {
        switch (type) {
            case 'video':
                this.metas.push(meta);
                this.m4mof._videoMeta = meta;
                if (this.hasVideo) {
                    this.metaSucc(type, meta);
                    return;
                }
                break;
            case 'audio':
                this.metas.push(meta);
                this.m4mof._audioMeta = meta;
                if (this.hasAudio) {
                    this.metaSucc(type, meta);
                    return;
                }
                break;
        }
        if (this.hasVideo && this.hasAudio && this.metas.length >= 1) {
            this.metaSucc(type, meta);
        }
    }

    /**
     * metadata解读成功后触发及第一个视频tag和第一个音频tag
     *
     * @param {any} mi
     * @returns
     *
     * @memberof flv2fmp4
     */
    metaSucc(type:any, meta:any) {
        if (type === undefined || meta === undefined) {
            return;
        }
        let metabox = null;
        let container = 'mp4';
        let codec = meta.codec;

        if (type === 'audio') {
            this._audioMeta = meta;
            if (meta.codec === 'mp3' && this._mp3UseMpegAudio) {
                // 'audio/mpeg' for MP3 audio track
                container = 'mpeg';
                codec = '';
                metabox = new Uint8Array();
            } else {
                // 'audio/mp4, codecs="codec"'
                metabox = mp4remux.generateInitSegment(meta);
            }
        } else if (type === 'video') {
            this._videoMeta = meta;
            metabox = mp4remux.generateInitSegment(meta);
        } else {
            return;
        }

        // dispatch metabox (Initialization Segment)
        if (!this.onInitSegment) {
            console.log('MP4Remuxer: onInitSegment callback must be specified!');
        }

        if (this.onInitSegment) {
            this.onInitSegment(type, {
                type: type,
                data: metabox.buffer,
                codec: codec,
                container: `${type}/${container}`,
                mediaDuration: meta.duration // in timescale 1000 (milliseconds)
            });
            this.loadmetadata = true;
        }
    }

    onDataAvailable(audiotrack:any, videotrack:any) {
        this.m4mof.remux(audiotrack, videotrack);
    }

    /**
     * 传入flv的二进制数据
     * 统一入口
     * @param {any} arraybuff
     * @param {any} byteStart
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflv(arraybuff:any, byteStart:any) {
        return this.setflvBase(arraybuff, byteStart);
    }

    /**
     *
     * 本地调试代码,不用理会
     * @param {any} arraybuff
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflvloc(arraybuff:any) {
        const offset = flvparse.setFlv(new Uint8Array(arraybuff));

        if (flvparse.arrTag.length > 0) {
            return flvparse.arrTag;
        }
    }
}

/**
 * 封装的对外类,有些方法不想对外暴露,所以封装这么一个类
 *
 * @class foreign
 */
class foreign {
    f2m:any
    _onInitSegment:any
    _onMediaSegment:any
    _onMediaInfo:any
    _seekCallBack:any
    constructor(config?:any) {

        this.f2m = new flv2fmp4(config);
        // 外部方法赋值
        this._onInitSegment = null;
        this._onMediaSegment = null;
        this._onMediaInfo = null;
        this._seekCallBack = null;
    }

    /**
     *
     * 跳转
     * @param {any} basetime  跳转时间
     *
     * @memberof foreign
     */
    seek(basetime:any) {
        this.f2m.seek(basetime);
    }

    /**
     * 传入flv的二进制数据
     * 统一入口
     * @param {any} arraybuff
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflv(arraybuff:any, byteStart:any) {
        return this.f2m.setflv(arraybuff, byteStart);
    }

    insertDiscontinuity() {
        this.f2m.insertDiscontinuity();
    }

    /**
     *
     * 本地调试代码,不用理会
     * @param {any} arraybuff
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflvloc(arraybuff:any) {
        return this.f2m.setflvloc(arraybuff);
    }

    close() {
        this.f2m.m4mof.destroy();
        this.f2m.tagDemux.destroy();
    }

    /**
     * 赋值初始化seg接受方法
     *
     *
     * @memberof foreign
     */
    set onInitSegment(fun:any) {
        this._onInitSegment = fun;
        this.f2m.onInitSegment = fun;
    }

    /**
     * 赋值moof接受方法
     *
     *
     * @memberof foreign
     */
    set onMediaSegment(fun:any) {
        this._onMediaSegment = fun;
        this.f2m.onMediaSegment = fun;
    }

    /**
     * 赋值metadata接受方法
     *
     *
     * @memberof foreign
     */
    set onMediaInfo(fun:any) {
        this._onMediaInfo = fun;
        this.f2m.onMediaInfo = fun;
    }

    /**
     * 赋值是否跳转回调接受方法
     *
     *
     * @memberof foreign
     */
    set seekCallBack(fun:any) {
        this._seekCallBack = fun;
        this.f2m.seekCallBack = fun;
    }
}

export default foreign;