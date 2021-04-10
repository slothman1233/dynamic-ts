/* eslint-disable */
export default class FlvTag {
    tagType:any = -1;
    dataSize:any = -1;
    Timestamp:any = -1;
    StreamID:any = -1;
    body:any = -1;
    time:any = -1;
    arr:any = [];
    size:any=-1;
    constructor() {}
    getTime() {
        // this.Timestamp.pop();
        this.arr = [];
        for (let i = 0; i < this.Timestamp.length; i++) {
            this.arr.push((this.Timestamp[i].toString(16).length == 1 ? '0' + this.Timestamp[i].toString(16) : this.Timestamp[i].toString(16)));
        }
        this.arr.pop();
        const time = this.arr.join('');
        this.time = parseInt(time, 16);
        return parseInt(time, 16);
    }
}