import f2m from './js/flv2fmp4';
import MSEControll from './mse.controll';
declare class IoControll {
    dataSource: any;
    onError: any;
    range: any;
    receivedLength: number;
    firstCheckpoint: number;
    lastCheckpoint: number;
    intervalBytes: number;
    totalBytes: number;
    lastSecondBytes: number;
    now: any;
    speedNormalizeList: number[];
    speedNormalized: number;
    bufferSize: number;
    stashSize: number;
    stashUsed: number;
    stashBuffer: ArrayBuffer;
    stashByteStart: number;
    updateTimeOnResume: boolean;
    initSegment: boolean;
    resumeFrom: number;
    currentRange: {
        from: number;
        to: number;
    };
    paused: boolean;
    stashInitialSize: number;
    lazyLoad: boolean;
    lazyLoadMaxDuration: number;
    progressChecker: any;
    lazyLoadRecoverDuration: number;
    live: boolean;
    kernel: f2m;
    mseControll: MSEControll;
    isFistSend: any;
    fetchReader: any;
    constructor(dataSource: any);
    /**
     * 此方法用于 用户点击reload按钮后对于mse进行销毁的重置的方法
     */
    msectlDestroy(): void;
    /**
     * 此方法用于 用户点击reload按钮后将video进行暂停操作且调用MSEControll中的seek方法
     */
    unload(): void;
    /**
     * 此方法用于 用户点击reload按钮后清除已有定时器 关闭解码工具，关闭之前已发起的请求
     */
    destroy(): void;
    /**
     * 绑定flv基类转换转换方法
     * @param a
     */
    onMediaSegment(mediaSegment: any): void;
    /**
     * 绑定flv基类转换转换方法
     * @param a
     */
    onInitSegment(type: any, initSegment: any): void;
    /**
     * 发送直播请求,获取直播流数据
     * @param dataSource
     */
    send(dataSource: any): void;
    /**
    *请求发送后的接收函数
    * @param reader
    */
    pump(reader: any): void;
    /**
     * 拿到从请求中获取的数据进行简单处理后 在传给解码工具
     * @param chunk
     * @param byteStart
     */
    onDataArrival(chunk: any, byteStart: any): void;
    /**
     * 获取最后的字节
     */
    lastSecondKBps(): number;
    /**
     * 获取当前字节
     */
    currentKBps(): number;
    /**
     * 新增字节
     * @param bytes
     */
    addBytes(bytes: any): void;
    /**
     *
     * @param input
     */
    normalizeSpeed(input: any): number;
    /**
     * 调整下载字节尺寸
     * @param normalized
     */
    adjustStashSize(normalized: any): void;
    /**
     *扩展Buffer
     * @param expectedBytes
     */
    expandBuffer(expectedBytes: any): void;
    /**
    * mse-doAppendSegments-error
    */
    onmseBufferFull(): void;
    /**
     * mse-sourceBufferUpdateend
     */
    onmseUpdateEnd(): void;
    /**
     * onmseUpdateEnd/onmseBufferFull
     */
    checkProgressAndResume(): void;
    /**
     * onmseUpdateEnd/onmseBufferFull
     */
    pause(): void;
    /**
     * checkProgressAndResume
     */
    resume(): void;
    /**
     * resume
     * @param bytes
     * @param dropUnconsumed
     */
    internalSeek(bytes: any, dropUnconsumed: any): void;
    /**
     * internalSeek
     */
    reset(): void;
    /**
     * internalSeek
     * @param dropUnconsumed
     */
    flushStashBuffer(dropUnconsumed: any): number;
}
export default IoControll;
