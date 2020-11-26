import Component from "../../component";
declare class videoToolBar extends Component {
    ishide: boolean;
    currentVolume: number;
    pointLeft: any;
    frontWidth: any;
    playEl: any;
    pauseEl: any;
    reLoadEl: any;
    fullScreenEl: any;
    volumeEl: any;
    volumeSilentEl: any;
    pointEl: any;
    backEl: any;
    frontEl: any;
    showTimeOut: any;
    mp4ShowTimeOut: any;
    allTime: any;
    currentTime: any;
    isRangeThumbDrop: any;
    controlTimeDurationEl: any;
    controlTimeCurrentEl: any;
    volumebarEl: any;
    volumeBoxEl: any;
    livePlayerEl: any;
    playerProgress: any;
    progressPlayed: any;
    rangeThumb: any;
    exitFullScreenEl: any;
    moveTime: any;
    isClickFlag: boolean;
    fullScreenChangeKey: boolean;
    fullScreenKey: boolean;
    iconfontList: any;
    clickTimeId: any;
    isInVideoContainer: boolean;
    isPc: boolean;
    liveEl: any;
    showVolumebarTimeout: any;
    constructor(play: any, option: any, ready: any);
    /**
     * 创建视频控件的自定义控制条
     */
    renderDom(): void;
    /**
     * 判断是否需要添加房间号的函数
     */
    renderRoom(): "" | "<div class = 'room-number-content'> \n                        '<span>房间号：</span>'\n                        <span class='room-number-val'></span>\n                    </div>\n                    <div class = 'visitors-number-content'>                                                        \n                        <span class='visitors-number-val'></span>\n                    </div>";
    /**
     * 初始化 直播情况下 的房间号和观看人数
     */
    renderRoomNumberAndVisitorsNum(): void;
    ransformationNum(num: any): any;
    /**
     * 初始化进度条
     * @param videoPlayMode
     */
    renderPlayerProgress(): void;
    /**
     * 向末尾添加元素
     * @param insertEl
     * @param targetContainer
     */
    insertBeforeEl(insertEl: HTMLElement, targetContainer: Element): void;
    /**
     * 获取控制条元素,将获取到的控制条元素添加上Component的集合中方便每个地方操控
     */
    getVideiBarEls(): void;
    /**
     * 添加控制条中每个元素的点击事件
     */
    addtVideiBarListener(): void;
    /**
     * 音量事件操作的回调函数
     * @param ev
     * @param backCha
     * @param mouseX
     */
    poinMousedownCallBack(ev: any, backCha: any, mouseX: any): boolean;
    /**
     * 根据状态切换视频播放还是暂停
     */
    changeVideoPlayOrPause(): void;
    /**
     * 根据传进来的音量值反推理设置 关联的数据
     * @param volumeSize 音量值
     */
    initVolumePosiontion(): void;
    /**
     * 更新音量以及音量控制条的位置
     * @param vcbPosition 音量控制条的位置 Volume control bar position
     * @param volumeSize 音量大小
     * @param isMuted  是否为静音
     */
    updateVolumePosiontion(vcbPosition: any, volumeSize: any, isMuted?: any): void;
    /**
     * 更新音量
     * @param currentVolume
     */
    updatevolume(currentVolume: any): void;
    /**
     * 全屏
     * @param el
     */
    fullScreen(el: any): void;
    /**
     * 推出全屏
     */
    exitFullscreen(): void;
    changeFullScreenOrExit(): void;
    getFullscreenElement(): any;
    exitorFullscreen(el: any): void;
    fullScreenChange(): void;
    /**
     * 判断鼠标位置是否在范围内 如果是的 就显示控制条 如果不是则隐藏   默认为显示三秒,三秒后隐藏如果鼠标移动到可操作范围内就自动取消三秒后隐藏事件
     */
    judgeMousePositionInRange(): void;
    /**
     * 判断鼠标位置是否是在video的位置范围内  此方法使用于mp4模式下
     */
    judgeIsInVideoContainer(): void;
    toolBarControl(toolbar: any): void;
    /**
     * 初始化一些快捷操作的方法
     * 单击视频播放/暂停
     * 双击视频全屏/推出全屏
     * 敲击键盘空格 暂停/播放 左右方向键 快进挥着后退
     */
    initShortcutOperation(): void;
    getUserAgentInfo(): void;
    /**
    * 获取视频总时间
    */
    loadeddata(): void;
    /**
     * 添加进度条点击事件
     */
    addtProgressListener(): void;
    /**
     * 添加进度条拖拽事件
     */
    addRangeThumbListener(): void;
    /**
     * 动态获取视频当前时间
     */
    timeupdate(): void;
    /**
     * 格式化时间
     * @param value  秒数
     */
    timeStamp(value: any): string;
    /**
     * 切换数字格式
     * @param theTime
     */
    formatNum(theTime: any): string;
    /**
     * 视频阶段描述点转换函数
     * @param data
     */
    videoStageDescription(): void;
    /**
     * 通过时间获取位置
     * @param time  时间参数
     */
    getPosition(time: any): number;
    /**
     * 添加暴露出去的一些方法初始化绑定
     */
    addForeignFn(): void;
    isNumber(val: any): boolean;
}
export default videoToolBar;
