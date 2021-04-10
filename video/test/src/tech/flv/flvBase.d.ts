declare class FlvBase {
    _pendingSeekTime: any;
    _receivedCanPlay: boolean;
    _requestSetTime: boolean;
    constructor();
    /**
     *  监听video Stalled状态(网速失速)
     * @param e
     */
    onvStalled(e: any): void;
    /**
     * 监听 video Progress状态(客户端正在请求数据)
     * @param e
     */
    onvProgress(e: any): void;
    /**
     * 检查并恢复卡住或之后
     * @param stalled
     */
    checkAndResumeStuckPlayback(stalled?: any): void;
    videoListen(): void;
    removevideoListen(): void;
}
export default FlvBase;
