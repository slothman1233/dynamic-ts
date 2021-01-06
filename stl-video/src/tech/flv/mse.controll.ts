import Component from "../../component";

class MSEControll {
    mediaSoure: MediaSource;
    sourceBuffer: any;
    pendingSourceBufferInit: Array<any> = [];
    mimeTypes: any = {
        video: null,
        audio: null
    };
    sourceBuffers: any = {
        video: null,
        audio: null
    };
    lastInitSegments: any = {
        video: null,
        audio: null
    };
    pendingSegments: any = {
        video: [],
        audio: []
    };
    pendingRemoveRanges: any = {
        video: [],
        audio: []
    };
    autoCleanupMaxBackwardDuration = 2 * 60;
    autoCleanupMinBackwardDuration = 1 * 60;
    error = false;
    firstInitSegment = false;
    _onMediaSegment: any = null
    _onmseBufferFull: any = null;
    isBufferFull = false;
    laseSourceBuffer: any = null;
    mediaSourceObjectURL = '';

    constructor() {
        this.mediaSoureInit()
    }
    /***
     * 初始化mediaSoure
     */
    mediaSoureInit() {
        this.mediaSoure = new MediaSource();
        this.mediaSoure.addEventListener('sourceopen', this.sourceopenInit.bind(this), { once: true })
        this.mediaSoure.addEventListener('sourceended', function () {
            console.log("sourceclose")
        }, { once: true });
        this.mediaSoure.addEventListener('sourceclose', function () { console.log("sourceclose") }, { once: true });
        this.mediaSourceObjectURL = window.URL.createObjectURL(this.mediaSoure);
        Component.options_.play.src = this.mediaSourceObjectURL
        this.listeneVisibilitychange();
        let timeOut = setTimeout(() => {
            if (Component.videoForegin.hooks.initMediaSoureComplete) {
                Component.videoForegin.hooks.initMediaSoureComplete(this.mediaSoure);
            }
            clearTimeout(timeOut);
        }, 0)
    }

    /**
     * 此方法用于用户点击reLoad后触发的方法 方法中进行了具体变量的置空 以及删除监听事件
     */
    detachMediaElement() {
        if (this.mediaSoure) {
            let ms = this.mediaSoure;
            for (let type in this.sourceBuffers) {
                // pending segments should be discard
                let ps = this.pendingSegments[type];
                ps.splice(0, ps.length);
                this.pendingSegments[type] = null;
                this.pendingRemoveRanges[type] = null;
                this.lastInitSegments[type] = null;

                // remove all sourcebuffers
                let sb = this.sourceBuffers[type];
                if (sb) {
                    if (ms.readyState !== 'closed') {
                        // ms edge can throw an error: Unexpected call to method or property access
                        try {
                            ms.removeSourceBuffer(sb);
                        } catch (error) {
                            Component.sendError(error)
                        }
                        sb.removeEventListener('updatestart', this.sourceBufferUpdatestart.bind(this));
                        sb.removeEventListener('update', this.sourceBufferUpdate.bind(this));
                        sb.removeEventListener('updateend', this.sourceBufferUpdateend.bind(this));
                        sb.removeEventListener('error', this.sourceBufferError.bind(this));
                        sb.removeEventListener('abort', this.sourceBufferAbort.bind(this));
                    }
                    this.mimeTypes[type] = null;
                    this.sourceBuffers[type] = null;
                }
            }
            if (ms.readyState === 'open') {
                try {
                    ms.endOfStream();
                } catch (error) {
                    Component.sendError(error)
                }
            }
            ms.removeEventListener('sourceopen', this.sourceopenInit.bind(this))
            ms.removeEventListener('sourceended', function () { console.log("sourceended") });
            ms.removeEventListener('sourceclose', function () { console.log("sourceclose") });
            this.pendingSourceBufferInit = [];
            this.isBufferFull = false;
            this.mediaSoure = null;
        }

        if (Component.options_.play) {
            Component.options_.play.src = '';
            Component.options_.play.removeAttribute('src');
        }
        if (this.mediaSourceObjectURL) {
            window.URL.revokeObjectURL(this.mediaSourceObjectURL);
            this.mediaSourceObjectURL = null;
        }
    }

    /**
     * 此方法用于用户点击reLoad后触发的方法 方法中进行了buffered的删除
     * 
     */
    removeBuffers() {
        console.log('--------------Seek---------------');
        // remove all appended buffers
        for (let type in this.sourceBuffers) {
            if (!this.sourceBuffers[type]) {
                continue;
            }

            // abort current buffer append algorithm
            let sb = this.sourceBuffers[type];
            if (this.mediaSoure.readyState === 'open') {
                try {
                    // If range removal algorithm is running, InvalidStateError will be throwed
                    // Ignore it.
                    sb.abort();
                } catch (error) {
                    Component.sendError(error)
                }
            }


            // pending segments should be discard
            let ps = this.pendingSegments[type];
            ps.splice(0, ps.length);

            if (this.mediaSoure.readyState === 'closed') {
                // Parent MediaSource object has been detached from HTMLMediaElement
                continue;
            }
            // record ranges to be remove from SourceBuffer
            for (let i = 0; i < sb.buffered.length; i++) {
                let start = sb.buffered.start(i);
                let end = sb.buffered.end(i);
                this.pendingRemoveRanges[type].push({ start, end });
            }

            // if sb is not updating, let's remove ranges now!
            if (!sb.updating) {
                this.doRemoveRanges();
            }

            // Safari 10 may get InvalidStateError in the later appendBuffer() after SourceBuffer.remove() call
            // Internal parser's state may be invalid at this time. Re-append last InitSegment to workaround.
            // Related issue: https://bugs.webkit.org/show_bug.cgi?id=159230
        }
    }

    /**
     * mediaSoure的sourceopen状态下的监听调用函数
     */
    sourceopenInit() {
        if (this.pendingSourceBufferInit.length > 0) {
            var pendings = this.pendingSourceBufferInit;
            while (pendings.length) {
                var segment = pendings.shift();
                this.appendInitSegment(segment, true);
            }
        }
        if (this.hasPendingSegments()) {
            this.doAppendSegments();
        }
    }

    /**
     * 绑定解码工具返回数据监听
     * @param mediaSegment      
     */
    appendMediaSegment(mediaSegment: any) {
        let ms = mediaSegment;
        this.pendingSegments[ms.type].push(ms);

        if (this.needCleanupSourceBuffer()) {
            this.doCleanupSourceBuffer();
        }

        let sb = this.sourceBuffers[ms.type];
        if (sb && !sb.updating && !this.hasPendingRemoveRanges()) {
            this.doAppendSegments();
        }
    }

    /**
     * 绑定解码工具返回初始化数据监听
     * @param initSegment 
     * @param deferred 
     */
    appendInitSegment(initSegment: any, deferred: any) {

        if (!this.mediaSoure || this.mediaSoure.readyState !== 'open') {
            this.pendingSourceBufferInit.push(initSegment.data);
            this.pendingSegments[initSegment.type].push(initSegment);
            return;
        }
        var is = initSegment;
        let mimeType = `${is.container}`;
        if (is.codec && is.codec.length > 0) {
            mimeType += `;codecs=${is.codec}`;
        }
        let firstInitSegment = false;
        this.lastInitSegments[is.type] = is;
        if (mimeType !== this.mimeTypes[is.type]) {
            if (!this.mimeTypes[is.type]) {
                firstInitSegment = true;
                try {
                    let sb = this.sourceBuffers[is.type] = this.mediaSoure.addSourceBuffer(mimeType)
                    sb.addEventListener('updatestart', this.sourceBufferUpdatestart.bind(this));
                    sb.addEventListener('update', this.sourceBufferUpdate.bind(this));
                    sb.addEventListener('updateend', this.sourceBufferUpdateend.bind(this));
                    sb.addEventListener('error', this.sourceBufferError.bind(this));
                    sb.addEventListener('abort', this.sourceBufferAbort.bind(this));
                    if (Component.videoForegin.hooks.initSourceBuffers) {
                        Component.videoForegin.hooks.initSourceBuffers(is.type, this.sourceBuffers[is.type]);
                    }
                } catch (error) {
                    Component.sendError(error)
                    return;
                }
            } else {
                Component.sendError({ message: `Notice: ${is.type} mimeType changed, origin: ${this.mimeTypes[is.type]}, target: ${mimeType}` })
            }
            this.mimeTypes[is.type] = mimeType;
        }

        if (!deferred) {
            this.pendingSegments[is.type].push(is);
        }
        if (!firstInitSegment) {  // append immediately only if init segment in subsequence
            if (this.sourceBuffers[is.type] && !this.sourceBuffers[is.type].updating) {
                this.doAppendSegments();
            }
        }
    }

    /**
     * 向sourceBuffer填充数据
     */
    doAppendSegments() {
        let pendingSegments = this.pendingSegments;

        for (let type in pendingSegments) {
            if (!this.sourceBuffers[type] || this.sourceBuffers[type].updating) {
                continue;
            }

            if (pendingSegments[type].length > 0) {
                let segment = pendingSegments[type].shift();

                if (segment.timestampOffset) {
                    let currentOffset = this.sourceBuffers[type].timestampOffset;
                    let targetOffset = segment.timestampOffset / 1000;  // in seconds

                    let delta = Math.abs(currentOffset - targetOffset);
                    if (delta > 0.1) {  // If time delta > 100ms
                        console.log('MSE-Controll', `Update MPEG audio timestampOffset from ${currentOffset} to ${targetOffset}`);
                        this.sourceBuffers[type].timestampOffset = targetOffset;
                    }
                    delete segment.timestampOffset;
                }
                if (!segment.data || segment.data.byteLength === 0) {
                    // Ignore empty buffer
                    continue;
                }

                try {
                    this.sourceBuffers[type].appendBuffer(segment.data);
                    this.laseSourceBuffer = segment.data;
                    this.isBufferFull = false;
                } catch (error) {
                    this.pendingSegments[type].unshift(segment);
                    if (error.code === 22) {  // QuotaExceededError
                        if (!this.isBufferFull) {
                            this._onmseBufferFull();
                        }
                        this.isBufferFull = true;
                    }
                    Component.sendError(error)

                }
            }
        }
    }

    /**
     * sourceBuffer的updateend状态下的监听调用函数  
    */
    sourceBufferUpdateend() {
        if (this.hasPendingRemoveRanges()) {
            this.doRemoveRanges();
        } else if (this.hasPendingSegments()) {
            this.doAppendSegments();
        }
        this._onMediaSegment();
        if (Component.videoForegin.hooks.sourceBufferUpdateend) {
            Component.videoForegin.hooks.sourceBufferUpdateend();
        }
    }

    /**
     * 获取需要清理的buffer数据，在将其在sourceBuffer中删除掉
     */
    doCleanupSourceBuffer() {
        let currentTime = Component.options_.play.currentTime;

        for (let type in this.sourceBuffers) {
            let sb = this.sourceBuffers[type];
            if (sb) {
                let buffered = sb.buffered;
                let doRemove = false;

                for (let i = 0; i < buffered.length; i++) {
                    let start = buffered.start(i);
                    let end = buffered.end(i);

                    if (start <= currentTime && currentTime < end + 3) {  // padding 3 seconds
                        if (currentTime - start >= this.autoCleanupMaxBackwardDuration) {
                            doRemove = true;
                            let removeEnd = currentTime - this.autoCleanupMinBackwardDuration;
                            this.pendingRemoveRanges[type].push({ start: start, end: removeEnd });
                        }
                    } else if (end < currentTime) {
                        doRemove = true;
                        this.pendingRemoveRanges[type].push({ start: start, end: end });
                    }
                }

                if (doRemove && !sb.updating) {
                    this.doRemoveRanges();
                }
            }
        }

    }
    /**
     * 清理buffer删除缓存
     */
    doRemoveRanges() {
        for (let type in this.pendingRemoveRanges) {
            if (!this.sourceBuffers[type] || this.sourceBuffers[type].updating) {
                continue;
            }
            let sb = this.sourceBuffers[type];
            let ranges = this.pendingRemoveRanges[type];
            while (ranges.length && !sb.updating) {
                let range = ranges.shift();
                sb.remove(range.start, range.end);
            }
        }
    }

    /**
     * 判断是否有需要填充的数据
     */
    hasPendingSegments() {
        var ps = this.pendingSegments;
        if (ps.video && ps.audio) {
            return ps.video.length > 0 || ps.audio.length > 0;
        } else {
            return false;
        }
    }

    /**
     * 判断是否有需要清理的数据
     */
    hasPendingRemoveRanges() {
        var prr = this.pendingRemoveRanges;
        if (prr.video && prr.audio) {
            return prr.video.length > 0 || prr.audio.length > 0;
        } else {
            return false;
        }

    }

    /**
     * 判断是否需要清理buffer
     */
    needCleanupSourceBuffer() {
        let currentTime = Component.options_.play.currentTime;
        for (let type in this.sourceBuffers) {
            let sb = this.sourceBuffers[type];
            if (sb) {
                let buffered = sb.buffered;
                if (buffered.length >= 1) {
                    if (currentTime - buffered.start(0) >= this.autoCleanupMaxBackwardDuration) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 监听sourceBuffer error状态
     */
    sourceBufferError(e: any) {
        this.error = true;
        Component.sendError(e)
    }
    /**
     * 监听sourceBuffer Updatestart状态
     */
    sourceBufferUpdatestart() {
    }
    /**
     * 监听sourceBuffer Update状态
     */
    sourceBufferUpdate() {
    }
    /**
     *监听sourceBuffer Abort状态 
     */
    sourceBufferAbort() {
    }

    /**
     * 解决chrome 63 版本以上  长时间切换tab或者挂起后台没有唤醒当前页面时 出现的chrome自动隐式暂停页面媒体元素问题
     * 目前此方法待优化
     */
    listeneVisibilitychange() {
        let that = this;
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === 'visible') {
                if (that.sourceBuffers['video']) {
                    Component.options_.play.currentTime = that.sourceBuffers['video'].buffered.end(0) - 0.2;
                }
            }
        });
    }

    /**
     * 暴露出去的回调接收方法,此方法在IOControll中进行具体绑定
     */
    set onmseUpdateEnd(fun: any) {
        this._onMediaSegment = fun;
    }

    /**
     * 暴露出去的回调接收方法,此方法在IOControll中进行具体绑定
     */
    set onmseBufferFull(fun: any) {
        this._onmseBufferFull = fun;
    }

}

export default MSEControll;