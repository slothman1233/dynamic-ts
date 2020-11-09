export default class flvDemux {
    constructor();
    static parseObject(arrayBuffer: any, dataOffset: any, dataSize?: any): {
        data: {
            name: any;
            value: any;
        };
        size: any;
        objectEnd: any;
    };
    static parseVariable(arrayBuffer: any, dataOffset: any, dataSize?: any): {
        data: {
            name: any;
            value: any;
        };
        size: any;
        objectEnd: any;
    };
    static parseLongString(arrayBuffer: any, dataOffset: any, dataSize?: any): {
        data: any;
        size: number;
    };
    static parseDate(arrayBuffer: any, dataOffset: any, dataSize?: any): {
        data: Date;
        size: number;
    };
    static parseString(arrayBuffer: any, dataOffset: any, dataSize?: any): {
        data: any;
        size: number;
    };
    /**
     * 解析metadata
     */
    static parseMetadata(arr: any): any;
    static parseScript(arr: any, offset: any, dataSize?: any): any;
}
