import {
    get
} from '../../utils/fetch'
import f2m from './js/flv2fmp4'
import MSEControll from './mse.controll';
import Component from '../../component';

class IoControll {
    dataSource: any;
    onError: any;
    range: any = {
        from: 0,
        to: -1
    };
    receivedLength = 0;
    firstCheckpoint = 0;
    lastCheckpoint = 0;
    intervalBytes = 0;
    totalBytes = 0;
    lastSecondBytes = 0;
    now: any;
    speedNormalizeList = [64, 128, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096];
    speedNormalized = 0;
    bufferSize = 1024 * 1024 * 3;
    stashSize = 1024 * 384;
    stashUsed = 0;
    stashBuffer = new ArrayBuffer(this.bufferSize);
    stashByteStart = 0;
    updateTimeOnResume = false;
    initSegment = false;
    resumeFrom = 0;
    currentRange = {
        from: 0,
        to: -1
    };
    paused = false;
    stashInitialSize = 1024 * 384;
    lazyLoad = true;
    lazyLoadMaxDuration = 3 * 60;
    progressChecker: any = null;
    lazyLoadRecoverDuration = 30;
    live = true;
    kernel = new f2m({ _isLive: true })
    mseControll = new MSEControll();
    isFistSend: any;
    fetchReader: any;
    constructor(dataSource: any) {
        if (performance && performance.now) {
            this.now = performance.now.bind(performance);
        } else {
            this.now = Date.now;
        }
        //绑定mse中暴露出来的方法
        //onmseUpdateEnd 更新完mse后的触发事件
        //onmseBufferFull 填充sourceBuffer发生错误后的触发事件
        this.mseControll.onmseUpdateEnd = this.onmseUpdateEnd.bind(this);
        this.mseControll.onmseBufferFull = this.onmseBufferFull.bind(this);
        this.isFistSend = dataSource.isFistSend
        this.send(dataSource);
    }

    /**
     * 此方法用于 用户点击reload按钮后对于mse进行销毁的重置的方法 
     */
    msectlDestroy() {
        this.mseControll.detachMediaElement();
        this.mseControll = null;
    }

    /**
     * 此方法用于 用户点击reload按钮后将video进行暂停操作且调用MSEControll中的seek方法
     */
    unload() {
        if (Component.options_.play) {
            Component.options_.play.pause();
        }
        if (this.mseControll) {
            this.mseControll.removeBuffers();
        }

    }

    /**
     * 此方法用于 用户点击reload按钮后清除已有定时器 关闭解码工具，关闭之前已发起的请求
     */
    destroy() {
        if (this.progressChecker != null) {
            window.clearInterval(this.progressChecker);
            this.progressChecker = null;
        }
        if (this.kernel) {
            this.kernel.close();
            this.kernel = null;
            this.unload();
        }
        if (this.fetchReader) {
            this.fetchReader.cancel();
        }
    }

    /**
     * 绑定flv基类转换转换方法
     * @param a 
     */
    onMediaSegment(mediaSegment: any) {
        if (!this.initSegment) return;
        if (Component.options_.play.paused) {
            this.updateTimeOnResume = true;
        }
        this.mseControll.appendMediaSegment(mediaSegment);
    }

    /**
     * 绑定flv基类转换转换方法
     * @param a      
     */
    onInitSegment(type: any, initSegment: any) {
        this.mseControll.appendInitSegment(initSegment, false);
        if (!this.initSegment) this.initSegment = true;
    }

    /**
     * 发送直播请求,获取直播流数据
     * @param dataSource 
     */
    send(dataSource: any) {
        this.dataSource = dataSource;
        let sourceURL = dataSource.url;
        let that = this;
        let headers = new Headers();
        let params: any = {
            method: 'GET',
            headers: headers,
            mode: 'cors',
            cache: 'default',
            referrerPolicy: 'no-referrer-when-downgrade'
        };
        let pp = {

        }
        fetch(sourceURL, params).then((response) => {
            var reader = response.body.getReader();
            //初始化绑定flv转换方法            
            this.kernel.onMediaSegment = this.onMediaSegment.bind(this);
            this.kernel.onInitSegment = this.onInitSegment.bind(this)
            if (Component.videoForegin.hooks.sendRequestStart) {
                Component.videoForegin.hooks.sendRequestStart();
            }
            return this.pump.call(that, reader);
        }).catch((err) => {
            Component.sendError({ message: err.message })
        })
    }

    /**
    *请求发送后的接收函数 
    * @param reader 
    */
    pump(reader: any): void {
        this.fetchReader = reader;
        if (!this.isFistSend) {
            this.isFistSend = true;
            return this.pump(reader);;
        }
        return reader.read().then((result: any) => {
            if (this.onError) {
                return reader.cancel();
            }
            if (result.done) {
                return reader.cancel();
            }
            if (Component.videoForegin.hooks.getStreamComplete) {
                Component.videoForegin.hooks.getStreamComplete();
            }
            let chunk = result.value.buffer;
            let byteStart = this.range.from + this.receivedLength;
            this.receivedLength += chunk.byteLength;
            this.onDataArrival(chunk, byteStart);
            return this.pump(reader);
        })
    }

    /**
     * 拿到从请求中获取的数据进行简单处理后 在传给解码工具
     * @param chunk 
     * @param byteStart 
     */
    onDataArrival(chunk: any, byteStart: any) {
        if (!this.isFistSend) {
            this.isFistSend = true;
            return;
        }
        if (this.kernel == null) {
            return;
        }
        if (Component.videoForegin.hooks.dataArrival) {
            Component.videoForegin.hooks.dataArrival();
        }
        this.addBytes(chunk.byteLength);
        let KBps = this.lastSecondKBps();
        let stashArray;
        if (this.paused) {
            return;
        }
        if (KBps !== 0) {
            let normalized = this.normalizeSpeed(KBps);
            if (this.speedNormalized !== normalized) {
                this.speedNormalized = normalized;
                this.adjustStashSize(normalized);
            }
        }
        if (this.stashUsed === 0 && this.stashByteStart === 0) {
            this.stashByteStart += byteStart;
        }
        if (this.stashUsed + chunk.byteLength <= this.stashSize) {
            stashArray = new Uint8Array(this.stashBuffer, 0, this.stashSize);
            stashArray.set(new Uint8Array(chunk), this.stashUsed);
            this.stashUsed += chunk.byteLength;
        } else {
            stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
            if (this.stashUsed > 0) {
                let buffer = this.stashBuffer.slice(0, this.stashUsed);
                this.currentRange.to = byteStart + buffer.byteLength - 1;
                let consumed: any = this.kernel.setflv(buffer, this.stashByteStart);
                if (consumed < buffer.byteLength) {
                    if (consumed > 0) {
                        let remainArray = new Uint8Array(buffer, consumed);
                        stashArray.set(remainArray, 0);
                        this.stashUsed = remainArray.byteLength;
                        this.stashByteStart += consumed;
                    }
                } else {
                    this.stashUsed = 0;
                    this.stashByteStart += consumed;
                }
                if (this.stashUsed + chunk.byteLength > this.bufferSize) {
                    this.expandBuffer(this.stashUsed + chunk.byteLength);
                    stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
                }
                stashArray.set(new Uint8Array(chunk), this.stashUsed);
                this.stashUsed += chunk.byteLength;
            } else {
                this.currentRange.to = byteStart + chunk.byteLength - 1;
                let consumed: any = this.kernel.setflv(chunk, byteStart)
                if (consumed < chunk.byteLength) {
                    let remain = chunk.byteLength - consumed;
                    if (remain > this.bufferSize) {
                        this.expandBuffer(remain);
                        stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
                    }
                    stashArray.set(new Uint8Array(chunk, consumed), 0);
                    this.stashUsed += remain;
                    this.stashByteStart = byteStart + consumed;
                }
            }
        }
    }

    /**
     * 获取最后的字节
     */
    lastSecondKBps() {
        this.addBytes(0);
        if (this.lastSecondBytes !== 0) {
            return this.lastSecondBytes / 1024;
        } else {
            if (this.now() - this.lastCheckpoint >= 500) {
                return this.currentKBps();
            } else {
                return 0;
            }
        }
    }

    /**
     * 获取当前字节
     */
    currentKBps() {
        this.addBytes(0);
        let durationSeconds = (this.now() - this.lastCheckpoint) / 1000;
        if (durationSeconds == 0) durationSeconds = 1;
        return (this.intervalBytes / durationSeconds) / 1024;
    }

    /**
     * 新增字节
     * @param bytes 
     */
    addBytes(bytes: any) {
        if (this.firstCheckpoint === 0) {
            this.firstCheckpoint = this.now();
            this.lastCheckpoint = this.firstCheckpoint;
            this.intervalBytes += bytes;
            this.totalBytes += bytes;
        } else if (this.now() - this.lastCheckpoint < 1000) {
            this.intervalBytes += bytes;
            this.totalBytes += bytes;
        } else { // duration >= 1000
            this.lastSecondBytes = this.intervalBytes;
            this.intervalBytes = bytes;
            this.totalBytes += bytes;
            this.lastCheckpoint = this.now();
        }
    }

    /**
     * 
     * @param input 
     */
    normalizeSpeed(input: any) {
        let list = this.speedNormalizeList;
        let last = list.length - 1;
        let mid = 0;
        let lbound = 0;
        let ubound = last;

        if (input < list[0]) {
            return list[0];
        }

        // binary search
        while (lbound <= ubound) {
            mid = lbound + Math.floor((ubound - lbound) / 2);
            if (mid === last || (input >= list[mid] && input < list[mid + 1])) {
                return list[mid];
            } else if (list[mid] < input) {
                lbound = mid + 1;
            } else {
                ubound = mid - 1;
            }
        }
    }

    /**
     * 调整下载字节尺寸
     * @param normalized 
     */
    adjustStashSize(normalized: any) {
        let stashSizeKB = 0;
        stashSizeKB = normalized;
        if (stashSizeKB > 8192) {
            stashSizeKB = 8192;
        }
        let bufferSize = stashSizeKB * 1024 + 1024 * 1024 * 1; // stashSize + 1MB
        if (this.bufferSize < bufferSize) {
            this.expandBuffer(bufferSize);
        }
        this.stashSize = stashSizeKB * 1024;
    }

    /**
     *扩展Buffer
     * @param expectedBytes 
     */
    expandBuffer(expectedBytes: any) {
        let bufferNewSize = this.stashSize;
        while (bufferNewSize + 1024 * 1024 * 1 < expectedBytes) {
            bufferNewSize *= 2;
        }

        bufferNewSize += 1024 * 1024 * 1; // bufferSize = stashSize + 1MB
        if (bufferNewSize === this.bufferSize) {
            return;
        }

        let newBuffer = new ArrayBuffer(bufferNewSize);

        if (this.stashUsed > 0) { // copy existing data into new buffer
            let stashOldArray = new Uint8Array(this.stashBuffer, 0, this.stashUsed);
            let stashNewArray = new Uint8Array(newBuffer, 0, bufferNewSize);
            stashNewArray.set(stashOldArray, 0);
        }

        this.stashBuffer = newBuffer;
        this.bufferSize = bufferNewSize;
    }

    /**
    * mse-doAppendSegments-error
    */
    onmseBufferFull() {
        Component.sendError({ message: 'MSE SourceBuffer is full, suspend transmuxing task' });
        console.log();
        this.pause();
        if (this.progressChecker == null) {
            this.progressChecker = window.setInterval(this.checkProgressAndResume.bind(this), 1000);
        }
    }

    /**
     * mse-sourceBufferUpdateend
     */
    onmseUpdateEnd() {
        if (!this.lazyLoad || this.live) {
            return;
        }
        let buffered = Component.options_.play.buffered;
        let currentTime = Component.options_.play.currentTime;
        let currentRangeStart = 0;
        let currentRangeEnd = 0;

        for (let i = 0; i < buffered.length; i++) {
            let start = buffered.start(i);
            let end = buffered.end(i);
            if (start <= currentTime && currentTime < end) {
                currentRangeStart = start;
                currentRangeEnd = end;
                break;
            }
        }

        if (currentRangeEnd >= currentTime + this.lazyLoadMaxDuration && this.progressChecker == null) {
            this.pause();
            if (this.progressChecker == null) {
                this.progressChecker = window.setInterval(this.checkProgressAndResume.bind(this), 1000);
            }

        }
    }

    /**
     * onmseUpdateEnd/onmseBufferFull
     */
    checkProgressAndResume() {
        let currentTime = Component.options_.play.currentTime;
        let buffered = Component.options_.play.buffered;

        let needResume = false;

        for (let i = 0; i < buffered.length; i++) {
            let from = buffered.start(i);
            let to = buffered.end(i);
            if (currentTime >= from && currentTime < to) {
                if (currentTime >= to - this.lazyLoadRecoverDuration) {
                    needResume = true;
                }
                break;
            }
        }

        if (needResume) {
            window.clearInterval(this.progressChecker);
            this.progressChecker = null;
            if (needResume) {
                this.resume();
            }
        }
    }

    /**
     * onmseUpdateEnd/onmseBufferFull
     */
    pause() {
        if (this.stashUsed !== 0) {
            this.resumeFrom = this.stashByteStart;
            this.currentRange.to = this.stashByteStart - 1;
        } else {
            this.resumeFrom = this.currentRange.to + 1;
        }
        this.stashUsed = 0;
        this.stashByteStart = 0;
        this.paused = true;
    }

    /**
     * checkProgressAndResume
     */
    resume() {
        if (this.paused) {
            this.paused = false;
            let bytes = this.resumeFrom;
            this.resumeFrom = 0;
            this.internalSeek(bytes, true);
        }
    }

    /**
     * resume
     * @param bytes 
     * @param dropUnconsumed 
     */
    internalSeek(bytes: any, dropUnconsumed: any) {
        this.flushStashBuffer(dropUnconsumed);
        let requestRange = {
            from: bytes,
            to: -1
        };
        this.currentRange = {
            from: requestRange.from,
            to: -1
        };

        this.reset();
        this.stashSize = this.stashInitialSize;
        this.kernel.insertDiscontinuity();
    }

    /**
     * internalSeek
     */
    reset() {
        this.firstCheckpoint = this.lastCheckpoint = 0;
        this.totalBytes = this.intervalBytes = 0;
        this.lastSecondBytes = 0;
    }

    /**
     * internalSeek
     * @param dropUnconsumed 
     */
    flushStashBuffer(dropUnconsumed: any) {
        if (this.stashUsed > 0) {
            let buffer = this.stashBuffer.slice(0, this.stashUsed);
            let consumed = this.kernel.setflv(buffer, this.stashByteStart);
            let remain = buffer.byteLength - consumed;

            if (consumed < buffer.byteLength) {
                if (dropUnconsumed) {
                    Component.sendError({ message: '错误-flushStashBuffer' });
                } else {
                    if (consumed > 0) {
                        let stashArray = new Uint8Array(this.stashBuffer, 0, this.bufferSize);
                        let remainArray = new Uint8Array(buffer, consumed);
                        stashArray.set(remainArray, 0);
                        this.stashUsed = remainArray.byteLength;
                        this.stashByteStart += consumed;
                    }
                    return 0;
                }
            }
            this.stashUsed = 0;
            this.stashByteStart = 0;
            return remain;
        }
        return 0;
    }


}

export default IoControll;