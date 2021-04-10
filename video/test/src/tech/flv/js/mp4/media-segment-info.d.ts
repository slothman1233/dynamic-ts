export declare class SampleInfo {
    dts: any;
    pts: any;
    duration: any;
    originalDts: any;
    isSyncPoint: any;
    fileposition: any;
    constructor(dts: any, pts: any, duration: any, originalDts: any, isSync: any);
}
export declare class MediaSegmentInfo {
    beginDts: any;
    endDts: any;
    beginPts: any;
    endPts: any;
    originalBeginDts: any;
    originalEndDts: any;
    syncPoints: any;
    firstSample: any;
    lastSample: any;
    constructor();
    appendSyncPoint(sampleInfo: any): void;
}
export declare class IDRSampleList {
    _list: any;
    constructor();
    clear(): void;
    appendArray(syncPoints: any): void;
    getLastSyncPointBeforeDts(dts: any): any;
}
export declare class MediaSegmentInfoList {
    _type: any;
    _list: any;
    _lastAppendLocation: any;
    constructor(type: any);
    get type(): any;
    get length(): any;
    isEmpty(): boolean;
    clear(): void;
    _searchNearestSegmentBefore(originalBeginDts: any): number;
    _searchNearestSegmentAfter(originalBeginDts: any): number;
    append(mediaSegmentInfo: any): void;
    getLastSegmentBefore(originalBeginDts: any): any;
    getLastSampleBefore(originalBeginDts: any): any;
    getLastSyncPointBefore(originalBeginDts: any): any;
}
