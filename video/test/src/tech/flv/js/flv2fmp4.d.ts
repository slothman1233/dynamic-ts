/**
 * 封装的对外类,有些方法不想对外暴露,所以封装这么一个类
 *
 * @class foreign
 */
declare class foreign {
    f2m: any;
    _onInitSegment: any;
    _onMediaSegment: any;
    _onMediaInfo: any;
    _seekCallBack: any;
    constructor(config?: any);
    /**
     *
     * 跳转
     * @param {any} basetime  跳转时间
     *
     * @memberof foreign
     */
    seek(basetime: any): void;
    /**
     * 传入flv的二进制数据
     * 统一入口
     * @param {any} arraybuff
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflv(arraybuff: any, byteStart: any): any;
    insertDiscontinuity(): void;
    /**
     *
     * 本地调试代码,不用理会
     * @param {any} arraybuff
     * @returns
     *
     * @memberof flv2fmp4
     */
    setflvloc(arraybuff: any): any;
    close(): void;
    /**
     * 赋值初始化seg接受方法
     *
     *
     * @memberof foreign
     */
    set onInitSegment(fun: any);
    /**
     * 赋值moof接受方法
     *
     *
     * @memberof foreign
     */
    set onMediaSegment(fun: any);
    /**
     * 赋值metadata接受方法
     *
     *
     * @memberof foreign
     */
    set onMediaInfo(fun: any);
    /**
     * 赋值是否跳转回调接受方法
     *
     *
     * @memberof foreign
     */
    set seekCallBack(fun: any);
}
export default foreign;
