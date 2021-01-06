declare class FlvParse {
    arrTag: any;
    index: any;
    tempArr: any;
    stop: any;
    offset: any;
    frist: any;
    _hasAudio: any;
    _hasVideo: any;
    tempUint8: any;
    constructor();
    /**
     * 接受 外部的flv二进制数据
     */
    setFlv(uint8: any): any;
    probe(buffer: any): {
        match: boolean;
    } | {
        match: boolean;
        consumed: number;
        dataOffset: number;
        hasAudioTrack: boolean;
        hasVideoTrack: boolean;
    };
    /**
     * 开始解析
     */
    parse(): any;
    read(length: any): any;
    /**
     * 计算tag包体大小
     */
    getBodySum(arr: any): number;
    ReadBig32(array: any, index: any): number;
}
declare const _default: FlvParse;
export default _default;
