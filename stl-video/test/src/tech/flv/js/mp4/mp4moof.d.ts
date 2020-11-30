declare class MP4Remuxer {
    TAG: any;
    _config: any;
    _isLive: any;
    _dtsBase: any;
    _dtsBaseInited: any;
    _audioDtsBase: any;
    _videoDtsBase: any;
    _audioNextDts: any;
    _videoNextDts: any;
    _audioMeta: any;
    _videoMeta: any;
    _audioSegmentInfoList: any;
    _videoSegmentInfoList: any;
    _onInitSegment: any;
    _onMediaSegment: any;
    _forceFirstIDR: any;
    _fillSilentAfterSeek: any;
    constructor(config: any);
    destroy(): void;
    bindDataSource(producer: any): this;
    get onInitSegment(): any;
    set onInitSegment(callback: any);
    get onMediaSegment(): any;
    set onMediaSegment(callback: any);
    insertDiscontinuity(): void;
    seek(originalDts: any): void;
    remux(audioTrack: any, videoTrack: any): void;
    _onTrackMetadataReceived(type: any, metadata: any): void;
    _calculateDtsBase(audioTrack: any, videoTrack: any): void;
    _remuxAudio(audioTrack: any): void;
    _generateSilentAudio(dts: any, frameDuration: any): {
        unit: Uint8Array;
        mp4Sample: {
            dts: any;
            pts: any;
            cts: number;
            size: number;
            duration: any;
            originalDts: any;
            flags: {
                isLeading: number;
                dependsOn: number;
                isDependedOn: number;
                hasRedundancy: number;
            };
        };
    };
    _remuxVideo(videoTrack: any): void;
    _mergeBoxes(moof: any, mdat: any): Uint8Array;
}
export default MP4Remuxer;
