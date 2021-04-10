/* eslint-disable */
import decodeUTF8 from '../decodeUTF8';
import SPSParser from './sps-parser';
declare let v:any
const le = (function() {
    const buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true); // little-endian write
    return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
})();
export default class flvDemux {

    constructor() {

    }
    static parseObject(arrayBuffer:any, dataOffset:any, dataSize?:any) {

        const name = flvDemux.parseString(arrayBuffer, dataOffset, dataSize);
        const value = flvDemux.parseScript(arrayBuffer, dataOffset + name.size);
        const isObjectEnd = (<any>value).objectEnd;

        return {
            data: {
                name: name.data,
                value: value.data
            },
            size: value.size,
            objectEnd: isObjectEnd
        };
    }

    static parseVariable(arrayBuffer:any, dataOffset:any, dataSize?:any) {
        return flvDemux.parseObject(arrayBuffer, dataOffset, dataSize);
    }
    static parseLongString(arrayBuffer:any, dataOffset:any, dataSize?:any) {

        const v = new DataView(arrayBuffer, dataOffset);
        const length = v.getUint32(0, !le);

        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(arrayBuffer, dataOffset + 4, length));
        } else {
            str = '';
        }

        return {
            data: str,
            size: 4 + length
        };
    }
    static parseDate(arrayBuffer:any, dataOffset:any, dataSize?:any) {

        const v = new DataView(arrayBuffer, dataOffset);
        let timestamp = v.getFloat64(0, !le);
        const localTimeOffset = v.getInt16(8, !le);
        timestamp += localTimeOffset * 60 * 1000; // get UTC time

        return {
            data: new Date(timestamp),
            size: 8 + 2
        };
    }
    static parseString(arrayBuffer:any, dataOffset:any, dataSize?:any) {
        const v = new DataView(arrayBuffer, dataOffset);
        const length = v.getUint16(0, !le);
        let str;
        if (length > 0) {
            str = decodeUTF8(new Uint8Array(arrayBuffer, dataOffset + 2, length));
        } else {
            str = '';
        }
        return {
            data: str,
            size: 2 + length
        };
    }

    /**
     * 解析metadata
     */
    static parseMetadata(arr:any) {
        const name:any = flvDemux.parseScript(arr, 0);
        const value:any = flvDemux.parseScript(arr, name.size, arr.length - name.size);
        // return {}
        const data:any = {};
        data[name.data] = value.data;
        return data;
    }

    static parseScript(arr:any, offset:any, dataSize?:any):any {
        let dataOffset:any = offset;
        const object:any = {};
        const uint8:any = new Uint8Array(arr);
        const buffer:any = uint8.buffer;
        const dv:any = new DataView(buffer, 0, dataSize);
        let value:any = null;
        let objectEnd:any = false;
        const type:any = (dv.getUint8(dataOffset));
        dataOffset += 1;

        switch (type) {
            case 0: // Number(Double) type
                value = dv.getFloat64(dataOffset, !le);
                dataOffset += 8;
                break;
            case 1:
                { // Boolean type
                    const b = dv.getUint8(dataOffset);
                    value = !!b;
                    dataOffset += 1;
                    break;
                }
            case 2:
                { // String type
                    // dataOffset += 1;
                    const amfstr = flvDemux.parseString(buffer, dataOffset);
                    value = amfstr.data;
                    dataOffset += amfstr.size;
                    break;
                }
            case 3:

                { // Object(s) type
                    value = {};
                    let terminal = 0; // workaround for malformed Objects which has missing ScriptDataObjectEnd
                    if ((dv.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (dataOffset < dataSize - 4) { // 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                        const amfobj = flvDemux.parseObject(buffer, dataOffset, dataSize - offset - terminal);

                        if (amfobj.objectEnd) { break; }
                        value[amfobj.data.name] = amfobj.data.value;
                        // dataOffset += amfobj.size;
                        dataOffset = amfobj.size;
                    }
                    if (dataOffset <= dataSize - 3) {
                        const marker = v.getUint32(dataOffset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            dataOffset += 3;
                        }
                    }
                    break;
                }
            case 8:
                { // ECMA array type (Mixed array)
                    value = {};
                    // dataOffset += 1;
                    dataOffset += 4; // ECMAArrayLength(UI32)
                    let terminal = 0; // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
                    if ((dv.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                        terminal = 3;
                    }
                    while (dataOffset < dataSize - 8) { // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                        const amfvar = flvDemux.parseVariable(buffer, dataOffset);

                        if (amfvar.objectEnd) { break; }
                        value[amfvar.data.name] = amfvar.data.value;
                        dataOffset = amfvar.size;
                    }
                    if (dataOffset <= dataSize - 3) {
                        const marker = dv.getUint32(dataOffset - 1, !le) & 0x00FFFFFF;
                        if (marker === 9) {
                            dataOffset += 3;
                        }
                    }
                    break;
                }
            case 9: // ScriptDataObjectEnd
                value = undefined;
                dataOffset = 1;
                objectEnd = true;
                break;
            case 10:
                { // Strict array type
                    // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf
                    value = [];
                    const strictArrayLength = dv.getUint32(dataOffset, !le);
                    dataOffset += 4;
                    for (let i = 0; i < strictArrayLength; i++) {
                        const val = flvDemux.parseScript(buffer, dataOffset);
                        value.push(val.data);
                        dataOffset = val.size;
                    }
                    break;
                }
            case 11:
                { // Date type
                    const date = flvDemux.parseDate(buffer, dataOffset + 1, dataSize - 1);
                    value = date.data;
                    dataOffset += date.size;
                    break;
                }
            case 12:
                { // Long string type
                    const amfLongStr = flvDemux.parseString(buffer, dataOffset + 1, dataSize - 1);
                    value = amfLongStr.data;
                    dataOffset += amfLongStr.size;
                    break;
                }
            default:
                // ignore and skip
                dataOffset = dataSize;
                console.log('AMF', 'Unsupported AMF value type ' + type);
        }
        return {
            data: value,
            size: dataOffset,
        };
    }
}