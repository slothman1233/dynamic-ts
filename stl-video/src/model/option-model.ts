class optionModel {
  static teachModel: any;
  //是否自动播放
  autoplay: boolean = null
  /*
    'auto'预加载视频（需要浏览器允许）;
    'metadata'仅预加载视频meta信息;
    'none'不预加载;
  */
  //预加载
  preload: string = "auto"
  //视频播放前的封面图
  poster: string;
  //是否循环播放
  loop: boolean = false;
  //视频的宽度
  width: number | string = "100%";
  //视频的高度
  height: number | string = "100%";
  //优先使用的播放模式
  teachOrder: Array<string> = ["html5", "flash"]
  //拉流超时时间，默认30s
  streamTimeoutTime: number = 30 * 1000;
  //播放器元素
  play: any;
  //播放按钮图片
  playBtnSrc:string;
  //流的链接地址
  streamLink: any = { hls: null, flv: null, trmp: null, mp4: null }
  //语言类型
  languages: string = "cn"
  //错误提示元素
  errorDom: any;
  //等待提示元素  
  loadWaitingDom: any;
  //视频中间的元素 比如说进入直播间或者其他的一些展示型 元素
  centerControlDom: any;
  // 直播时候的房间编号
  roomIdentifier: string;
  // 直播观看的人数
  visitorsNumber: string;
  /**
   * 播放的模式 
    flv 直播模式 0
    hls 直播模式 1
    mp4 视频播放模式 2
   */
  mode: any;
  //视频播放的描述点数据,只有在视频播放模式下才会有的数据
  stageDescriptionDatas: Array<any>;
  iconfont:any = {play:"&#xC002;",pause:"&#xC006;",volume:"&#xC004;",volumeSilent:"&#xC005;",fullScreen:"&#xC001;",exitFullScreen:"&#xC003;"};
  //全屏元素
  // fullScreenDom:any = null;
}
optionModel.teachModel = ["html5"];

export default optionModel




