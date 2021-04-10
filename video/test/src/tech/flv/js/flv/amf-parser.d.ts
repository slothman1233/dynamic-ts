declare class AMF {
    static parseScriptData(arrayBuffer: any, dataOffset: any, dataSize: any): any;
    static parseObject(arrayBuffer: any, dataOffset: any, dataSize: any): any;
    static parseVariable(arrayBuffer: any, dataOffset: any, dataSize: any): any;
    static parseString(arrayBuffer: any, dataOffset: any, dataSize: any): {
        data: any;
        size: any;
    };
    static parseLongString(arrayBuffer: any, dataOffset: any, dataSize: any): any;
    static parseDate(arrayBuffer: any, dataOffset: any, dataSize: any): any;
    static parseValue(arrayBuffer: any, dataOffset: any, dataSize: any): any;
}
export default AMF;
