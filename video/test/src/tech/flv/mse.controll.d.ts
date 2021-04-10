declare class MSEControll {
    mediaSoure: MediaSource;
    sourceBuffer: any;
    pendingSourceBufferInit: Array<any>;
    mimeTypes: any;
    sourceBuffers: any;
    lastInitSegments: any;
    pendingSegments: any;
    pendingRemoveRanges: any;
    autoCleanupMaxBackwardDuration: number;
    autoCleanupMinBackwardDuration: number;
    error: boolean;
    firstInitSegment: boolean;
    _onMediaSegment: any;
    _onmseBufferFull: any;
    isBufferFull: boolean;
    laseSourceBuffer: any;
    mediaSourceObjectURL: string;
    constructor();
    /***
     * 初始化mediaSoure
     */
    mediaSoureInit(): void;
    /**
     * 此方法用于用户点击reLoad后触发的方法 方法中进行了具体变量的置空 以及删除监听事件
     */
    detachMediaElement(): void;
    /**
     * 此方法用于用户点击reLoad后触发的方法 方法中进行了buffered的删除
     *
     */
    removeBuffers(): void;
    /**
     * mediaSoure的sourceopen状态下的监听调用函数
     */
    sourceopenInit(): void;
    /**
     * 绑定解码工具返回数据监听
     * @param mediaSegment
     */
    appendMediaSegment(mediaSegment: any): void;
    /**
     * 绑定解码工具返回初始化数据监听
     * @param initSegment
     * @param deferred
     */
    appendInitSegment(initSegment: any, deferred: any): void;
    /**
     * 向sourceBuffer填充数据
     */
    doAppendSegments(): void;
    /**
     * sourceBuffer的updateend状态下的监听调用函数
    */
    sourceBufferUpdateend(): void;
    /**
     * 获取需要清理的buffer数据，在将其在sourceBuffer中删除掉
     */
    doCleanupSourceBuffer(): void;
    /**
     * 清理buffer删除缓存
     */
    doRemoveRanges(): void;
    /**
     * 判断是否有需要填充的数据
     */
    hasPendingSegments(): boolean;
    /**
     * 判断是否有需要清理的数据
     */
    hasPendingRemoveRanges(): boolean;
    /**
     * 判断是否需要清理buffer
     */
    needCleanupSourceBuffer(): boolean;
    /**
     * 监听sourceBuffer error状态
     */
    sourceBufferError(e: any): void;
    /**
     * 监听sourceBuffer Updatestart状态
     */
    sourceBufferUpdatestart(): void;
    /**
     * 监听sourceBuffer Update状态
     */
    sourceBufferUpdate(): void;
    /**
     *监听sourceBuffer Abort状态
     */
    sourceBufferAbort(): void;
    /**
     * 解决chrome 63 版本以上  长时间切换tab或者挂起后台没有唤醒当前页面时 出现的chrome自动隐式暂停页面媒体元素问题
     * 目前此方法待优化
     */
    listeneVisibilitychange(): void;
    /**
     * 暴露出去的回调接收方法,此方法在IOControll中进行具体绑定
     */
    set onmseUpdateEnd(fun: any);
    /**
     * 暴露出去的回调接收方法,此方法在IOControll中进行具体绑定
     */
    set onmseBufferFull(fun: any);
}
export default MSEControll;
