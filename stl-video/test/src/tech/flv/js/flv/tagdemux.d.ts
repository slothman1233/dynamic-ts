declare class tagDemux {
    TAG: any;
    _onMetaDataArrived: any;
    _config: any;
    _onError: any;
    _onMediaInfo: any;
    _onTrackMetadata: any;
    _onDataAvailable: any;
    _onScriptDataArrived: any;
    _dataOffset: any;
    _firstParse: any;
    _dispatch: any;
    _hasAudio: any;
    _hasVideo: any;
    _audioInitialMetadataDispatched: any;
    _videoInitialMetadataDispatched: any;
    _mediaInfo: any;
    _metadata: any;
    _audioMetadata: any;
    _videoMetadata: any;
    _naluLengthSize: any;
    _timestampBase: any;
    _timescale: any;
    _duration: any;
    _durationOverrided: any;
    _flvSoundRateTable: any;
    _referenceFrameRate: any;
    _videoTrack: any;
    _audioTrack: any;
    _littleEndian: any;
    _hasAudioFlagOverrided: any;
    _hasVideoFlagOverrided: any;
    _parseMP3AudioData: any;
    constructor();
    set hasAudio(s: any);
    set hasVideo(s: any);
    onMediaInfo(callback: any): void;
    parseMetadata(arr: any): void;
    _parseScriptData(arrayBuffer: any, dataOffset?: any, dataSize?: any): void;
    _parseKeyframesIndex(keyframes: any): {
        times: any[];
        filepositions: any[];
    };
    /**
     * 传入tags输出moof和mdat
     *
     * @param {any} tags
     *
     * @memberof tagDemux
     */
    moofTag(chunk: any, byteStart: any): number;
    parseChunks(chunk: any, byteStart: any): number;
    _parseVideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any): void;
    _parseAVCVideoPacket(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any): void;
    /**
     * AVC 初始化
     */
    _parseAVCDecoderConfigurationRecord(arrayBuffer: any, dataOffset: any, dataSize: any): void;
    timestampBase(i: any): void;
    /**
     * 普通的AVC 片段
     */
    _parseAVCVideoData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any, tagPosition: any, frameType: any, cts: any): void;
    _parseAudioData(arrayBuffer: any, dataOffset: any, dataSize: any, tagTimestamp: any): void;
    _parseAACAudioData(arrayBuffer: any, dataOffset: any, dataSize: any): {};
    _parseAACAudioSpecificConfig(arrayBuffer: any, dataOffset: any, dataSize: any): {
        config: any[];
        samplingRate: number;
        channelCount: number;
        codec: string;
        originalCodec: string;
    };
    _isInitialMetadataDispatched(): any;
    destroy(): void;
}
export default tagDemux;
