declare class MediaInfo {
    mimeType: any;
    duration: any;
    hasAudio: any;
    hasVideo: any;
    audioCodec: any;
    videoCodec: any;
    audioDataRate: any;
    videoDataRate: any;
    audioSampleRate: any;
    audioChannelCount: any;
    width: any;
    height: any;
    fps: any;
    profile: any;
    level: any;
    chromaFormat: any;
    sarNum: any;
    sarDen: any;
    metadata: any;
    segments: any;
    segmentCount: any;
    hasKeyframesIndex: any;
    keyframesIndex: any;
    constructor();
    isComplete(): boolean;
    isSeekable(): boolean;
}
export default MediaInfo;
