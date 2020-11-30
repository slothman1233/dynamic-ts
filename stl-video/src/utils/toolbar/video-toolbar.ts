import Component from "../../component";
import { VideoPlayMode } from '../../utils/enum';
class videoToolBar extends Component {
    ishide = true;
    currentVolume = 30;
    pointLeft: any;
    frontWidth: any;
    playEl: any;
    pauseEl: any;
    playBtn:any;
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
    isRangeThumbDrop: any = false;
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
    isClickFlag = false;
    fullScreenChangeKey:boolean = false;
    fullScreenKey:boolean = false;
    iconfontList: any = { play: "&#xC002;", pause: "&#xC006;", volume: "&#xC004;", volumeSilent: "&#xC005;", fullScreen: "&#xC001;", exitFullScreen: "&#xC003;" }
    // isFullScreen = false;
    clickTimeId: any;
    isInVideoContainer = false;
    isPc: boolean;
    liveEl: any;
    showVolumebarTimeout: any = null;
    constructor(play: any, option: any, ready: any) {
        super(play, option, ready)
        this.getUserAgentInfo();
        this.renderDom();
        this.initVolumePosiontion();
    }

    /**
     * 创建视频控件的自定义控制条
     */
    renderDom() {
        let palyIconfont: string = Component.options_.iconfont.play || this.iconfontList.play,
            pauseIconfont: string = Component.options_.iconfont.pause || this.iconfontList.pause,
            volumeIconfont: string = Component.options_.iconfont.volume || this.iconfontList.volume,
            volumeSilentIconfont: string = Component.options_.iconfont.volumeSilent || this.iconfontList.volumeSilent,
            fullScreenIconfont: string = Component.options_.iconfont.fullScreen || this.iconfontList.fullScreen,
            exitFullScreenIconfont: string = Component.options_.iconfont.exitFullScreen || this.iconfontList.exitFullScreen;
        const dom = this.createEl('div', {
            className: "video_toolbar_content",
            innerHTML: `
                <div class = 'toolbar-container'>
                    <div class = 'left'>
                        <div class = 'play iconfont_video' title='播放'>${palyIconfont}</div>
                        <div class = 'pause iconfont_video' title='暂停'>${pauseIconfont}</div>
                        <div class = 'reload' title='重新加载'></div>
                        ${this.renderRoom()}                   
                    </div>
                    <div class = 'right'>
                        <div class="toolbar_empty_label"></div>
                        <div class='volume-box'>
                            <div class = 'volume iconfont_video' title='设置静音'>${volumeIconfont}</div>
                            <div class = 'volume-silent iconfont_video'  title='取消静音'>${volumeSilentIconfont}</div>
                        </div> 
                        <div class="volume-bar">
                            <div class="volume-bar-container">
                                <div class="back vcenter"></div>
                                <div class="front vcenter" style="height: 60px;"></div>
                                <div class="point vcenter" style="bottom: 56px;"></div>
                            </div>
                        </div>
                        <div class='fullScreen iconfont_video'>${fullScreenIconfont}</div>
                        <div class='exit-fullScreen iconfont_video'>${exitFullScreenIconfont}</div>
                    </div>
                </div>
            `
        })
        const dmDom = this.createEl('div', {
            className: "video_danmu_box",
            id: "video_danmu_box",
            innerHTML: ""
        })
        const endDom = this.createEl('div', {
            className: "video_end_box",
            id: "video_end_box",
            innerHTML: ""
        })
        let playStr = Component.options_.playBtnSrc?`<img src="${Component.options_.playBtnSrc}" />`:`<i class="iconfont_video">${palyIconfont}</i>`;
        this.playBtn = this.createEl('div',{
            className:"video_play_btn",
            id:"video_play_btn",
            innerHTML:playStr,
        })
        this.livePlayerEl = document.getElementsByClassName('live-player')[0];
        this.insertBeforeEl(dom, this.livePlayerEl)
        this.insertBeforeEl(dmDom, this.livePlayerEl)
        this.insertBeforeEl(endDom, this.livePlayerEl)
        this.insertBeforeEl(this.playBtn, this.livePlayerEl)
        this.getVideiBarEls();
        this.addtVideiBarListener();
        this.renderPlayerProgress()
        this.addForeignFn();
        this.renderRoomNumberAndVisitorsNum();
        // 在video容器范围内不允许右键菜单
        this.livePlayerEl.oncontextmenu = function () {
            event.returnValue = false;
        }
    }

    /**
     * 判断是否需要添加房间号的函数
     */
    renderRoom() {
        if (Component.options_.mode !== VideoPlayMode.mp4) {
            return `<div class = 'room-number-content'> 
                        '<span>房间号：</span>'
                        <span class='room-number-val'></span>
                    </div>
                    <div class = 'visitors-number-content'>                                                        
                        <span class='visitors-number-val'></span>
                    </div>`
        } else {
            return ''
        }
    }
    /**
     * 初始化 直播情况下 的房间号和观看人数
     */
    renderRoomNumberAndVisitorsNum() {
        if (Component.options_.mode !== VideoPlayMode.mp4) {
            const roomEl = document.getElementsByClassName('room-number-val')[0]
            const visitorEl = document.getElementsByClassName('visitors-number-val')[0]
            if (Component.options_.roomIdentifier) {
                roomEl.innerHTML = Component.options_.roomIdentifier
            }
            if (Component.options_.visitorsNumber) {
                visitorEl.innerHTML = `${this.ransformationNum(Component.options_.visitorsNumber)}人正在观看`;
            }
            Component.videoForegin.operation.updateVisitorsNum = ((visitorNum: number) => {
                if (visitorNum) {
                    visitorEl.innerHTML = `${this.ransformationNum(Component.options_.visitorsNumber)}人正在观看`;
                }
            })
        }
    }

    ransformationNum(num: any) {
        const number = parseInt(num);
        if (number >= 10000) {
            return `${(number / 10000)}万`
        } else {
            return num
        }
    }


    /**
     * 初始化进度条
     * @param videoPlayMode 
     */
    renderPlayerProgress() {
        if (Component.options_.mode == VideoPlayMode.mp4) {
            const playerProgressDom = this.createEl('div', {
                className: "player_progress",
                innerHTML: `
                    <div class='move-time'></div>
                    <div class='range-container'></div>
                    <div class='progress-played'></div>
                    <div class='range-thumb'></div>
                `
            })
            const parentEl = document.getElementsByClassName('video_toolbar_content ')[0];
            const fistEl = parentEl.firstChild
            parentEl.insertBefore(playerProgressDom, fistEl);
            const controlTimeDom = this.createEl('div', {
                className: 'control-time ',
                innerHTML: `
                    <span class="control-time-current">00:00</span>
                    <span class="control-time-split">/</span>
                    <span class="control-time-duration"></span>
                `
            })
            const toolbarContainerLeft = document.getElementsByClassName('left')[0]
            Component.videoEmit.loadeddata = this.loadeddata.bind(this);
            Component.videoEmit.timeupdate = this.timeupdate.bind(this);
            this.insertBeforeEl(controlTimeDom, toolbarContainerLeft);
            this.addtProgressListener();
            this.addRangeThumbListener();
        } else {
            this.judgeMousePositionInRange();
            this.show(this.reLoadEl);
        }
        if (this.isPc) {
            this.initShortcutOperation();
        }
        this.judgeIsInVideoContainer();
    };

    /**
     * 向末尾添加元素
     * @param insertEl 
     * @param targetContainer 
     */
    insertBeforeEl(insertEl: HTMLElement, targetContainer: Element) {
        targetContainer.insertBefore(insertEl, targetContainer.lastChild);
    }

    /**
     * 获取控制条元素,将获取到的控制条元素添加上Component的集合中方便每个地方操控
     */
    getVideiBarEls() {
        let dom = document.getElementsByClassName('toolbar-container')[0]
        this.playEl = dom.getElementsByClassName('play')[0];
        this.pauseEl = dom.getElementsByClassName('pause')[0];
        this.reLoadEl = dom.getElementsByClassName('reload')[0];
        this.fullScreenEl = dom.getElementsByClassName('fullScreen')[0]
        this.exitFullScreenEl = dom.getElementsByClassName('exit-fullScreen')[0]
        this.volumeEl = dom.getElementsByClassName('volume')[0];
        this.volumeSilentEl = dom.getElementsByClassName('volume-silent')[0]
        this.pointEl = document.getElementsByClassName('point')[0];
        this.backEl = document.getElementsByClassName('back')[0];
        this.frontEl = document.getElementsByClassName('front')[0];
        this.volumebarEl = dom.getElementsByClassName("volume-bar")[0];
        this.volumeBoxEl = dom.getElementsByClassName("volume-box")[0];
        //this.liveEl = document.getElementById("live-palyer");
        if (Component.options_.autoplay) {
            let timeOut = setInterval(() => {
                this.volumeEl.click();
                if (!Component.options_.play.paused) {
                    this.show(this.pauseEl);
                    this.hide(this.playEl);
                    this.hide(this.playBtn)
                    clearTimeout(timeOut);
                }
            }, 1000);
        }
    }

    /**
     * 添加控制条中每个元素的点击事件
     */
    addtVideiBarListener() {
        let dom = document.getElementsByClassName('video_toolbar_content')[0];
        // let backCha = this.backEl.offsetWidth - this.pointEl.offsetWidth
        let backCha = this.backEl.offsetHeight - this.pointEl.offsetHeight
        let that = this;
        dom.addEventListener('click', (e: any) => {
            const className = e.target.className.split(" ")[0];
            const video = Component.options_.play;
            switch (className) {
                case 'play':
                    this.changeVideoPlayOrPause();
                    break;
                case 'pause':
                    this.changeVideoPlayOrPause();
                    break;
                case 'fullScreen':
                    this.fullScreenKey = true;
                    this.fullScreen(this.livePlayerEl);
                    
                    break;
                case 'exit-fullScreen':
                this.fullScreenKey = true;
                    this.exitFullscreen();
                    break;
                case 'volume':
                    video.muted = true;
                    this.hide(e.target);
                    this.show(this.volumeSilentEl);
                    this.updateVolumePosiontion(0, 0, true);
                    break;
                case 'volume-silent':
                    video.muted = false;
                    this.hide(e.target);
                    this.show(this.volumeEl);
                    if (this.pointLeft === 0 && this.currentVolume == 0) {
                        this.initVolumePosiontion();
                    } else {
                        this.updateVolumePosiontion(this.pointLeft, this.currentVolume);
                    }
                    break;
                case 'front vcenter':
                    let frontLeft,
                        frontOffsetY = e.target.offsetHeight - e.offsetY;
                    // e.offsetX > backCha ? frontLeft = backCha : frontLeft = e.offsetX
                    frontOffsetY > backCha ? frontLeft = backCha : frontLeft = frontOffsetY
                    let frontBili = Math.ceil(frontLeft / backCha * 100)
                    this.updateVolumePosiontion(frontLeft, frontBili)
                    break;

                case 'back vcenter':
                    let backLeft,
                        offsetY = 64 - e.offsetY;
                    //e.offsetX > backCha ? backLeft = backCha : backLeft = e.offsetX
                    offsetY > backCha ? backLeft = backCha : backLeft = offsetY
                    let backBili = Math.ceil(backLeft / backCha * 100)
                    this.updateVolumePosiontion(backLeft, backBili);
                    break;
            }
        })
        document.getElementById("video_play_btn").addEventListener("click",(e:any) => {
            this.changeVideoPlayOrPause();
        })
        if (this.isPc) {
            this.pointEl.onmousedown = ((ev: any) => {
                // this.poinMousedownCallBack.call(that, ev, backCha, ev.clientX);
                this.poinMousedownCallBack.call(that, ev, backCha, ev.clientY);
            })
            this.volumeBoxEl.onmouseenter = (() => {
                that.showVolumebarTimeout && clearTimeout(that.showVolumebarTimeout), that.showVolumebarTimeout = null;
                that.volumebarEl.style.visibility = "visible";
            })
            this.volumeBoxEl.onmouseleave = ((e: any) => {
                that.showVolumebarTimeout = setTimeout(() => {
                    that.volumebarEl.style.visibility = "hidden";
                }, 350)
            })
            this.volumebarEl.onmouseenter = ((e: any) => {
                that.showVolumebarTimeout && clearTimeout(that.showVolumebarTimeout), that.showVolumebarTimeout = null;
            })
            this.volumebarEl.onmouseleave = ((e: any) => {
                that.volumebarEl.style.visibility = "hidden";
            })
        } else {
            this.pointEl.ontouchstart = ((ev: any) => {
                // let pointL = that.pointEl.offsetLeft;
                let pointL = 64 - that.pointEl.offsetTop;
                let e = ev || window.event;
                // let mouseX = e.changedTouches[0].clientX //鼠标按下的位置
                let mouseX = e.changedTouches[0].clientY;
                window.ontouchmove = function (ev: any) {
                    let e = ev || window.event
                    // let thisX = e.changedTouches[0].clientX
                    let thisX = e.changedTouches[0].clientY
                    // let moveL = thisX - mouseX //鼠标移动的距离
                    let moveL = mouseX - thisX;
                    let newL = pointL + moveL //left值                
                    // 判断最大值和最小值
                    if (newL < 0) {
                        newL = 0
                    }
                    if (newL >= backCha) {
                        newL = backCha
                    }
                    // 计算比例
                    let bili = Math.ceil(newL / backCha * 100);
                    if (bili > 0) {
                        Component.options_.play.muted = false;
                    }
                    that.updateVolumePosiontion(newL, bili)
                }
                window.ontouchend = (() => {
                    window.ontouchmove = null //解绑移动事件    
                    window.ontouchend = null
                    that.judgeIsInVideoContainer();
                    // return false
                })
                // return false
            })
        }
    }


    /**
     * 音量事件操作的回调函数
     * @param ev 
     * @param backCha 
     * @param mouseX 
     */
    poinMousedownCallBack(ev: any, backCha: any, mouseX: any) {
        // let pointL = this.pointEl.offsetLeft;
        let pointL = 64 - this.pointEl.offsetTop;
        let e = ev || window.event;
        let currentMouseX = mouseX //鼠标按下的位置
        let that = this;
        window.onmousemove = function (ev: any) {
            let e = ev || window.event
            // let moveL = e.clientX - currentMouseX //鼠标移动的距离
            let moveL = currentMouseX - e.clientY
            let newL = pointL + moveL //left值
            // 判断最大值和最小值
            if (newL < 0) {
                newL = 0
            }
            if (newL >= backCha) {
                newL = backCha
            }
            // 计算比例
            let bili = Math.ceil(newL / backCha * 100);
            if (bili > 0) {
                Component.options_.play.muted = false;
            }
            that.updateVolumePosiontion(newL, bili)
            return false //取消默认事件
        }
        window.onmouseup = function (e:any) {
            window.onmousemove = null //解绑移动事件                
            window.onmouseup = null;
            that.judgeIsInVideoContainer();
            return false
        }
        return false
    }

    /**
     * 根据状态切换视频播放还是暂停
     */
    changeVideoPlayOrPause() {
        if (Component.options_.play.paused == true) {
            Component.options_.play.play();
            this.show(this.pauseEl);
            this.hide(this.playEl);
            this.hide(this.playBtn);
        } else {
            Component.options_.play.pause();
            this.show(this.playEl);
            this.hide(this.pauseEl);
            this.show(this.playBtn);
        }
    }

    /**
     * 根据传进来的音量值反推理设置 关联的数据
     * @param volumeSize 音量值
     */
    initVolumePosiontion() {
        let val;
        if (this.currentVolume <= 0) {
            // this.currentVolume = 50;
            this.currentVolume = 30;
        }
        // val = (this.currentVolume - this.pointEl.offsetWidth) / (this.backEl.offsetWidth - this.pointEl.offsetWidth)
        val = (this.currentVolume - this.pointEl.offsetHeight) / (this.backEl.offsetHeight - this.pointEl.offsetHeight)

        var vcbPosition = val * 100
        // if (vcbPosition > 50) {
        if (vcbPosition > 30) {
            // vcbPosition = vcbPosition - this.pointEl.offsetWidth
            vcbPosition = vcbPosition - this.pointEl.offsetHeight
        }

        this.updateVolumePosiontion(vcbPosition, this.currentVolume);
    }

    /**
     * 更新音量以及音量控制条的位置
     * @param vcbPosition 音量控制条的位置 Volume control bar position
     * @param volumeSize 音量大小
     * @param isMuted  是否为静音
     */
    updateVolumePosiontion(vcbPosition: any, volumeSize: any, isMuted?: any) {
        if (vcbPosition === this.pointLeft && this.currentVolume === volumeSize && isMuted === true) return;
        // this.pointEl.style.left = vcbPosition + 'px'
        // this.frontEl.style.width = vcbPosition + this.pointEl.offsetWidth + 'px';
        this.pointEl.style.bottom = vcbPosition + 'px'
        this.frontEl.style.height = vcbPosition + this.pointEl.offsetHeight + 'px';
        if (isMuted) return;
        this.pointLeft = vcbPosition;
        // this.frontWidth = vcbPosition + this.pointEl.offsetWidth;
        this.frontWidth = vcbPosition + this.pointEl.offsetHeight;
        this.updatevolume(volumeSize);
    }

    /**
     * 更新音量
     * @param currentVolume 
     */
    updatevolume(currentVolume: any) {
        if (currentVolume === 0) {
            this.show(this.volumeSilentEl)
            this.hide(this.volumeEl)
        } else {
            this.show(this.volumeEl)
            this.hide(this.volumeSilentEl)
        }
        this.currentVolume = currentVolume;
        Component.options_.play.volume = this.currentVolume / 100
    }

    /**
     * 全屏
     * @param el 
     */
    fullScreen(el: any) {
        let that =this;
        var rfs = el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen || el.requestFullScreen;
        if (typeof rfs != "undefined" && rfs) {
            // if (!this.isPc) {

            // }


            try {
                rfs.call(el)
            } catch (e) {
            }

          setTimeout(() => {
            that.changeFullScreenOrExit.call(that);
            this.fullScreenChange();
            this.fullScreenKey = false;
          }, 200);

            // var isFull = rfs.call(el)
            // if (isFull) {
            //     isFull.then(() => {
            //         this.changeFullScreenOrExit();

            //     }).catch((e: any) => {
            //         console.log(e);
            //         this.changeFullScreenOrExit();
            //     })
            // } else {
            //     console.log(192929, isFull, this.getFullscreenElement())
            // }
        }

    }

    /**
     * 推出全屏
     */
    exitFullscreen() {
        const that = this;
        const documenEl: any = document;
        // if (!this.isPc) {

        // }
    
        if (documenEl.exitFullscreen) {
            documenEl.exitFullscreen();
        } else if (documenEl.webkitExitFullscreen) {
            documenEl.webkitExitFullscreen();
        } else if (documenEl.msExitFullscreen) {
            documenEl.msExitFullscreen();
        } else if (documenEl.mozCancelFullScreen) {
            documenEl.mozCancelFullScreen();
        }

        setTimeout(() => {
            that.changeFullScreenOrExit.call(that);
            this.fullScreenKey = false;
          }, 200);

    }

    changeFullScreenOrExit() {
        let key: any = this.getFullscreenElement();
        if (!key) {
            //  this.isFullScreen = false;
            if (this.livePlayerEl.offsetWidth == document.body.offsetWidth) {
                this.show(this.exitFullScreenEl);
                this.hide(this.fullScreenEl);
            } else {
                this.show(this.fullScreenEl);
                this.hide(this.exitFullScreenEl);
            }
        } else {
            // this.isFullScreen = true;
            this.show(this.exitFullScreenEl);
            this.hide(this.fullScreenEl);
        }
    }
    getFullscreenElement() {
        return (
            document.fullscreenElement ||
            (<any>document).mozFullScreenElement ||
            (<any>document).msFullScreenElement ||
            (<any>document).webkitFullscreenElement || null
        );
    }

    exitorFullscreen(el: any) {
        if (this.getFullscreenElement()) {
            this.exitFullscreen()
        } else {
            this.fullScreen(el)

        }
    }
    fullScreenChange(){
        // if ((<any>document).exitFullscreen) {
        //     this.livePlayerEl.addEventListener("fullscreenchange", ()=>{console.log("fullscreenchange")});
        // } else 
        if(this.fullScreenChangeKey)return;
        if ((<any>document).webkitExitFullscreen) {
            this.livePlayerEl.addEventListener("webkitfullscreenchange", (e:any)=>{
                console.log("webkitfullscreenchange:"+this.fullScreenKey)
                if(!this.fullScreenKey)
                    this.exitorFullscreen(this.livePlayerEl);
            });
        } else if ((<any>document).msExitFullscreen) {
            this.livePlayerEl.addEventListener("msfullscreenchange", ()=>{
                this.exitFullscreen()
            });
        } else if ((<any>document).mozCancelFullScreen) {
            this.livePlayerEl.addEventListener("mozfullscreenchange", ()=>{
                
                this.exitFullscreen()});
        }else if((<any>document).exitFullscreen) {
            this.livePlayerEl.addEventListener("fullscreenchange", ()=>{
                this.exitFullscreen()
            });
        }
        this.fullScreenChangeKey = true;
    }
    /**
     * 判断鼠标位置是否在范围内 如果是的 就显示控制条 如果不是则隐藏   默认为显示三秒,三秒后隐藏如果鼠标移动到可操作范围内就自动取消三秒后隐藏事件
     */
    judgeMousePositionInRange() {
        let dom = document.getElementsByClassName('video_toolbar_content')[0];
        this.showTimeOut = setTimeout(() => {
            dom.className = `${dom.className} video_toolbar_content_hide`
            clearTimeout(this.showTimeOut);
        }, 3000);
        document.onmousemove = ((e) => {
            //计算出上下左右的位置
            const offsetBottom = this.livePlayerEl.offsetHeight + this.livePlayerEl.offsetTop;
            const offsetRight = this.livePlayerEl.offsetWidth + this.livePlayerEl.getBoundingClientRect().left;
            // x轴上面的的最大范围
            let xRangeAreaTop = ((this.livePlayerEl.offsetHeight / 2) + this.livePlayerEl.offsetTop);
            var el = document.getElementsByClassName('video_toolbar_content')[0];
            if (e.clientX < offsetRight && e.clientX >= this.livePlayerEl.getBoundingClientRect().left && e.clientY > xRangeAreaTop && e.clientY < offsetBottom) {
                clearTimeout(this.showTimeOut);
                this.showTimeOut = null;
                if (el.className.indexOf('video_toolbar_content_hide') > -1) {
                    el.className = `${el.className.replace(' video_toolbar_content_hide', '')}`
                }
            } else {
                if (el.className.indexOf('video_toolbar_content_hide') <= -1) {
                    el.className = `${el.className} video_toolbar_content_hide`
                }

            }
        })
    }
    /**
     * 判断鼠标位置是否是在video的位置范围内  此方法使用于mp4模式下
     */
    judgeIsInVideoContainer() {
        const toolbar: any = document.getElementsByClassName('video_toolbar_content')[0];
        window.onmousemove = ((event: any) => {
            let offsetBottom = this.livePlayerEl.offsetHeight + this.livePlayerEl.offsetTop - toolbar.offsetHeight;
            let offsetRight = this.livePlayerEl.offsetWidth + this.livePlayerEl.getBoundingClientRect().left;
            if (event.clientX < offsetRight && event.clientX > this.livePlayerEl.getBoundingClientRect().left && event.clientY > this.livePlayerEl.offsetTop && event.clientY < offsetBottom) {
                this.isInVideoContainer = true;
            } else {
                this.isInVideoContainer = false;
            }
            //return false;
        })
        let liveBar: any = document.getElementById("live-player");
        // toolbar.onmouseenter = (()=>{
        //     if(this.mp4ShowTimeOut)clearTimeout(this.mp4ShowTimeOut),this.mp4ShowTimeOut = null;
        //     toolbar.className = `${toolbar.className.replace(' video_toolbar_content_hide', '')}`;
        //     //this.toolBarControl(toolbar);
        // })
        toolbar.onmousemove = (() => {
            if (this.mp4ShowTimeOut) clearTimeout(this.mp4ShowTimeOut), this.mp4ShowTimeOut = null;
            toolbar.className = `${toolbar.className.replace(' video_toolbar_content_hide', '')}`;
            return false;
        })
        toolbar.onmouseleave = (() => {
            this.toolBarControl(toolbar);
        })
        liveBar.onmousemove = ((e: any) => {
            let ev: any = e || (<any>window).event;
            if (ev.target.tagName !== "VIDEO") return;
            this.toolBarControl(toolbar);
        })
        liveBar.onmouseleave = (() => {
            if (this.mp4ShowTimeOut) clearTimeout(this.mp4ShowTimeOut), this.mp4ShowTimeOut = null;
            if (toolbar.className.indexOf("video_toolbar_content_hide") < 0) toolbar.className = `${toolbar.className} video_toolbar_content_hide`;
        })
    }
    toolBarControl(toolbar: any) {
        toolbar.className = `${toolbar.className.replace(' video_toolbar_content_hide', '')}`;
        if (this.mp4ShowTimeOut) clearTimeout(this.mp4ShowTimeOut), this.mp4ShowTimeOut = null;
        this.mp4ShowTimeOut = setTimeout(function () {
            if (toolbar.className.indexOf("video_toolbar_content_hide") < 0) toolbar.className = `${toolbar.className} video_toolbar_content_hide`;
            this.mp4ShowTimeOut = null;
        }, 2000)
    }
    /**
     * 初始化一些快捷操作的方法
     * 单击视频播放/暂停
     * 双击视频全屏/推出全屏
     * 敲击键盘空格 暂停/播放 左右方向键 快进挥着后退
     */
    initShortcutOperation() {
        let video = Component.options_.play;

        if (Component.options_.mode === VideoPlayMode.mp4) {
            //单击视频
            video.onclick = ((e: any) => {
                clearTimeout(this.clickTimeId);
                this.clickTimeId = setTimeout(() => {
                    this.changeVideoPlayOrPause();
                }, 250);
            });
            //双击视频
            video.ondblclick = ((e: any) => {
                clearTimeout(this.clickTimeId);
                // this.isFullScreen == true ? this.exitFullscreen() : this.fullScreen(this.livePlayerEl);
                this.exitorFullscreen(this.livePlayerEl)
            });
        } else {
            //双击视频
            video.ondblclick = ((e: any) => {
                //this.isFullScreen == true ? this.exitFullscreen() : this.fullScreen(this.livePlayerEl);
                this.exitorFullscreen(this.livePlayerEl)
            });
        }
        window.onresize = (() => {
            // if (this.isPc) {

            // }
            this.changeFullScreenOrExit();
        })

        // 鼠标在video的范围内敲击空格暂停/播放D
        window.onkeydown = ((event: any) => {
            console.log(event.keyCode)
            if(event.keyCode == 27){
                console.log("退出全屏")
            }
            if(event)
            if (this.isInVideoContainer) {
                if (Component.options_.mode === VideoPlayMode.mp4) {
                    //按下了右方向快进十秒
                    if (event.keyCode == 39) {
                        if (Component.options_.mode !== VideoPlayMode.mp4) return
                        Component.options_.play.currentTime = Component.options_.play.currentTime + 10
                    }
                    // 按下了左方向快退十秒
                    if (event.keyCode == 37) {
                        if (Component.options_.mode !== VideoPlayMode.mp4) return
                        Component.options_.play.currentTime = Component.options_.play.currentTime - 10
                    }
                }
                //按下了空格 暂停播放
                if (event.keyCode == 32) {
                    if (this.isInVideoContainer) {
                        this.changeVideoPlayOrPause();
                        return false;
                    }
                }
                //按下上方向键 音量增加10%
                if (event.keyCode == 38) {
                    if (this.currentVolume >= 100 && this.pointLeft >= 87) return;
                    let pointLeft = this.pointLeft;
                    if (this.pointLeft + 8.7 >= 87) {
                        pointLeft = 87
                    } else {
                        pointLeft += 8.7
                    }
                    let currentVolume = this.currentVolume
                    if (this.currentVolume + 10 >= 100) {
                        currentVolume = 100
                    } else {
                        currentVolume += 10
                    }
                    this.updateVolumePosiontion(pointLeft, currentVolume);
                }
                //按下,下方向键 音量减少10%
                if (event.keyCode == 40) {
                    if (this.currentVolume <= 0 && this.pointLeft <= 0) return;
                    let pointLeft = this.pointLeft;
                    if (this.pointLeft - 8.7 <= 0) {
                        pointLeft = 0;
                    } else {
                        pointLeft -= 8.7;
                    }
                    let currentVolume = this.currentVolume;
                    if (this.currentVolume - 10 <= 0) {
                        currentVolume = 0;
                    } else {
                        currentVolume -= 10;
                    }
                    this.updateVolumePosiontion(pointLeft, currentVolume);
                }
            }
        })

    }

    getUserAgentInfo() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        this.isPc = flag;
    }

    /**
    * 获取视频总时间
    */
    loadeddata() {
        this.allTime = this.timeStamp(Component.options_.play.duration);
        this.controlTimeDurationEl = document.getElementsByClassName('control-time-duration')[0];
        this.controlTimeDurationEl.innerHTML = this.allTime;
        const controlTimeSplitEl: any = document.getElementsByClassName('control-time-split')[0]
        this.show(this.controlTimeDurationEl);
        this.show(controlTimeSplitEl);
        this.videoStageDescription();
    }

    /**
     * 添加进度条点击事件
     */
    addtProgressListener() {
        this.playerProgress = document.getElementsByClassName('player_progress')[0];
        this.progressPlayed = document.getElementsByClassName('progress-played')[0];
        this.rangeThumb = document.getElementsByClassName('range-thumb')[0];
        this.moveTime = document.getElementsByClassName("move-time")[0];
        this.playerProgress.addEventListener('click', (event: any) => {
            // var length = event.pageX - this.playerProgress.offsetLeft - this.livePlayerEl.offsetLeft;
            var length = event.pageX - this.playerProgress.offsetLeft - this.livePlayerEl.getBoundingClientRect().left;
            var percent = length / this.playerProgress.offsetWidth;
            this.progressPlayed.style.width = percent * (this.playerProgress.offsetWidth) - 2 + "px";
            try { this.rangeThumb.style.left = percent * (this.playerProgress.offsetWidth) - 2 + "px" } catch (e) { }
            Component.options_.play.currentTime = percent * Component.options_.play.duration;
            return false //取消默认事件
        })
        this.playerProgress.onmousemove = (event: any) => {
            let length = event.pageX - this.playerProgress.offsetLeft - this.livePlayerEl.getBoundingClientRect().left;
            let percent = length / this.playerProgress.offsetWidth;
            let time = Component.options_.play.duration * percent;
            this.moveTime.innerText = this.timeStamp(time);
            let left = length < 15 ? 15 : length > (this.playerProgress.offsetWidth - 15) ? this.playerProgress.offsetWidth - 15 : length;
            this.moveTime.style.left = left + "px";
            this.moveTime.style.display = "block";
        }
        this.playerProgress.onmouseleave = () => {
            this.moveTime.style.display = "none";
        }
    }

    /**
     * 添加进度条拖拽事件
     */
    addRangeThumbListener() {
        let percent: any;
        let that = this;
        this.rangeThumb.onmousedown = ((ev: any) => {
            let pointL = this.rangeThumb.offsetLeft;
            let e = ev || window.event;
            let mouseX = e.clientX //鼠标按下的位置
            var max = this.playerProgress.offsetWidth - this.rangeThumb.offsetWidth;
            this.isRangeThumbDrop = true;
            Component.options_.play.pause();
            window.onmousemove = function (ev: any) {
                if (that.playerProgress.className.indexOf("player_progress_hover") < 0) that.playerProgress.className = "player_progress player_progress_hover"
                var thisX = (ev || window.event).clientX;
                var to = Math.min(max, Math.max(-2, pointL + (thisX - mouseX)));
                that.rangeThumb.style.left = to + 'px';
                that.progressPlayed.style.width = Math.max(0, to) + 'px';
                let length = ev.pageX - that.playerProgress.offsetLeft - that.livePlayerEl.getBoundingClientRect().left;
                percent = to / max;
                let time = Component.options_.play.duration * percent;
                that.moveTime.innerText = that.timeStamp(time);
                let left = length < 15 ? 15 : length > (that.playerProgress.offsetWidth - 15) ? that.playerProgress.offsetWidth - 15 : length;
                that.moveTime.style.left = left + "px";
                that.moveTime.style.display = "block";
                return false //取消默认事件
            }
            window.onmouseup = (() => {
                window.onmousemove = null //解绑当前移动事件   
                window.onmouseup = null;
                this.judgeIsInVideoContainer();
                this.isRangeThumbDrop = false;
                if(percent)Component.options_.play.currentTime = percent * Component.options_.play.duration;
                this.changeVideoPlayOrPause()
                percent = 0;
                that.moveTime.style.display = "none";
                that.playerProgress.className = "player_progress"
                return false
            })
            return false
        })
        this.rangeThumb.ontouchstart = ((ev: any) => {
            let pointL = this.rangeThumb.offsetLeft;
            let e = ev || window.event;
            let mouseX = e.changedTouches[0].clientX //鼠标按下的位置
            var max = this.playerProgress.offsetWidth - this.rangeThumb.offsetWidth;
            this.isRangeThumbDrop = true;
            Component.options_.play.pause();
            window.ontouchmove = function (ev: any) {
                var thisX = (ev || window.event).changedTouches[0].clientX;
                var to = Math.min(max, Math.max(-2, pointL + (thisX - mouseX)));
                that.rangeThumb.style.left = to + 'px';
                that.progressPlayed.style.width = Math.max(0, to) + 'px';
                percent = to / max;
                // return false //取消默认事件
            }
            window.ontouchend = (() => {
                window.ontouchmove = null //解绑移动事件   
                window.ontouchend = null;
                this.isRangeThumbDrop = false;
                Component.options_.play.currentTime = percent * Component.options_.play.duration;
                Component.options_.play.play();
                this.show(this.pauseEl);
                this.hide(this.playEl);
                this.hide(this.playBtn);
                percent = 0;
                // return false
            })
            // return false
        })
    }

    /**
     * 动态获取视频当前时间
     */
    timeupdate() {
        this.currentTime = this.timeStamp(Component.options_.play.currentTime);
        this.controlTimeCurrentEl = document.getElementsByClassName("control-time-current")[0];
        this.controlTimeCurrentEl.innerHTML = this.currentTime;
        if (this.allTime === this.currentTime) {
            this.hide(this.pauseEl);
            this.show(this.playEl);
            this.show(this.playBtn);
        }
        const percent = 100 * (Component.options_.play.currentTime / Component.options_.play.duration);
        //缓冲的时间
        // Component.options_.play.buffered.end(0)        
        if (!this.isRangeThumbDrop) {
            this.progressPlayed.style.width = `${percent}%`
            this.rangeThumb.style.left = `${percent}%`
        }
    }
    /**
     * 格式化时间
     * @param value  秒数
     */
    timeStamp(value: any) {
        var theTime = parseInt(value);// 秒
        var middle = 0;// 分
        var hour = 0;// 小时
        if (theTime >= 60) {
            middle = parseInt((theTime / 60).toString());
            theTime = parseInt((theTime % 60).toString())
            if (middle >= 60) {
                hour = parseInt((middle / 60).toString());
                middle = parseInt((middle % 60).toString());
            }
        }
        var result;
        result = `0:${this.formatNum(theTime)}`
        if (middle > 0) {
            result = `${middle}:${this.formatNum(theTime)}`;
        }
        if (hour > 0) {
            result = `${hour}:${this.formatNum(middle)}:${this.formatNum(theTime)}`;
        }
        return result;

    }
    /**
     * 切换数字格式
     * @param theTime 
     */
    formatNum(theTime: any) {
        var result;
        if (theTime < 10) {
            result = `0${theTime}`;
        } else {
            result = `${theTime}`;
        }
        return result;
    }

    /**
     * 视频阶段描述点转换函数
     * @param data 
     */
    videoStageDescription() {
        if (Component.options_.mode !== VideoPlayMode.mp4) return;
        let dom = ''
        const data = Component.options_.stageDescriptionDatas;
        if (Array.isArray(data)) {
            data.forEach((x) => {
                dom += `<span class ='progress-hightlights' style ='left:${this.getPosition(x.time)}%'>
                            <span class='progress-hightlights-tips'>${x.title}</span>
                        </span>`
            })
        }
        let newDom = this.createEl('div', {
            innerHTML: dom
        });
        this.insertBeforeEl(newDom, this.playerProgress);
    }

    /**
     * 通过时间获取位置
     * @param time  时间参数
     */
    getPosition(time: any) {
        const percent = 100 * (time / Component.options_.play.duration);
        return percent;
    }

    /**
     * 添加暴露出去的一些方法初始化绑定
     */
    addForeignFn() {
        let that = this
        Component.videoForegin.operation.playVideo = function () {
            Component.options_.play.play();
            that.hide(that.playEl);
            that.show(that.pauseEl);
            that.hide(that.playBtn);
        }
        Component.videoForegin.operation.pauseVideo = function () {
            Component.options_.play.pause();
            that.hide(that.pauseEl);
            that.show(that.playEl);
            that.show(that.playBtn);
        }
        Component.videoForegin.operation.fullScreenVideo = function () {
            that.fullScreenKey = true;
            that.fullScreen(that.livePlayerEl)
        }
        Component.videoForegin.operation.exitFullScreenVideo = function(){
            that.fullScreenKey = true;
            that.exitFullscreen();
        }  
        Component.videoForegin.operation.muteVideo = function () {
            Component.options_.play.muted = true;
            that.hide(that.volumeEl);
            that.show(that.volumeSilentEl);
            that.updateVolumePosiontion(0, 0, true);
        }
        Component.videoForegin.operation.restoreVoice = function () {
            Component.options_.play.muted = false;
            that.hide(that.volumeSilentEl);
            that.show(that.volumeEl);
            if (that.pointLeft === 0 && that.currentVolume == 0) {
                that.initVolumePosiontion();
            } else {
                that.updateVolumePosiontion(that.pointLeft, that.currentVolume);
            }
        }
        Component.videoForegin.operation.seekTo = function (seekpoint: any) {
            if (Component.options_.mode !== VideoPlayMode.mp4) {
                Component.sendError({ message: '此播放模式不允许跳转时间' })
                return;
            }
            if (!that.isNumber(seekpoint)) {
                Component.sendError({ message: '非数值' })
                return;
            }
            if (seekpoint === null || seekpoint === undefined || seekpoint === '') {
                Component.sendError({ message: '需要跳转的数值格式不正确' })
                return
            }
            if (seekpoint > Component.options_.play.duration) {
                Component.sendError({ message: '跳转时间大于视频总时长' })
                return;
            }
            Component.options_.play.currentTime = seekpoint;
        }
        Component.videoForegin.operation.reLoadVideo = function () {
            if (Component.options_.mode == VideoPlayMode.mp4) {
                Component.options_.play.currentTime = 0;
                Component.options_.play.play();
                that.hide(that.playEl);
                that.show(that.pauseEl);
                that.hide(that.playBtn);
            }
        }
    }

    isNumber(val: any) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }

    }
}

Component.setComponents('videoToolBar', videoToolBar);
export default videoToolBar; 