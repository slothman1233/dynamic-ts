/*
 * Copyright (C) 2016 Bilibili. All Rights Reserved.
 *
 * @author zheng qian <xqq@xqq.im>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import decodeUTF8 from '../decodeUTF8.js';

let le = (function () {
    let buf = new ArrayBuffer(2);
    (new DataView(buf)).setInt16(0, 256, true); // little-endian write
    return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
})();

class AMF {

    static parseScriptData(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        let data:any = {};

        try {
            let name = AMF.parseValue(arrayBuffer, dataOffset, dataSize);
            let value = AMF.parseValue(arrayBuffer, dataOffset + name.size, dataSize - name.size);

            data[name.data] = value.data;
        } catch (e) {
            console.log('AMF', e.toString());
        }

        return data;
    }

    static parseObject(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        if (dataSize < 3) {
            console.log('Data not enough when parse ScriptDataObject');
            return;
        }
        let name:any = AMF.parseString(arrayBuffer, dataOffset, dataSize);
        let value:any = AMF.parseValue(arrayBuffer, dataOffset + name.size, dataSize - name.size);
        let isObjectEnd:any = value.objectEnd;

        return {
            data: {
                name: name.data,
                value: value.data
            },
            size: name.size + value.size,
            objectEnd: isObjectEnd
        };
    }

    static parseVariable(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        return AMF.parseObject(arrayBuffer, dataOffset, dataSize);
    }

    static parseString(arrayBuffer:any, dataOffset:any, dataSize:any) {
        if (dataSize < 2) {
            console.log('Data not enough when parse String');
        }
        let v:any = new DataView(arrayBuffer, dataOffset, dataSize);
        let length:any = v.getUint16(0, !le);

        let str:any;
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

    static parseLongString(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        if (dataSize < 4) {
            console.log('Data not enough when parse LongString');
            return
        }
        let v :any= new DataView(arrayBuffer, dataOffset, dataSize);
        let length:any = v.getUint32(0, !le);

        let str:any;
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

    static parseDate(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        if (dataSize < 10) {
            console.log('Data size invalid when parse Date');
            return;
        }
        let v:any = new DataView(arrayBuffer, dataOffset, dataSize);
        let timestamp:any = v.getFloat64(0, !le);
        let localTimeOffset:any = v.getInt16(8, !le);
        timestamp += localTimeOffset * 60 * 1000; // get UTC time

        return {
            data: new Date(timestamp),
            size: 8 + 2
        };
    }

    static parseValue(arrayBuffer:any, dataOffset:any, dataSize:any):any {
        if (dataSize < 1) {
            console.log('Data not enough when parse Value');
            return;
        }

        let v:any = new DataView(arrayBuffer, dataOffset, dataSize);

        let offset:any = 1;
        let type:any = v.getUint8(0);
        let value:any;
        let objectEnd:any = false;

        try {
            switch (type) {
                case 0: // Number(Double) type
                    value = v.getFloat64(1, !le);
                    offset += 8;
                    break;
                case 1:
                    { // Boolean type
                        let b = v.getUint8(1);
                        value = b ? true : false;
                        offset += 1;
                        break;
                    }
                case 2:
                    { // String type
                        let amfstr = AMF.parseString(arrayBuffer, dataOffset + 1, dataSize - 1);
                        value = amfstr.data;
                        offset += amfstr.size;
                        break;
                    }
                case 3:
                    { // Object(s) type
                        value = {};
                        let terminal = 0; // workaround for malformed Objects which has missing ScriptDataObjectEnd
                        if ((v.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                            terminal = 3;
                        }
                        while (offset < dataSize - 4) { // 4 === type(UI8) + ScriptDataObjectEnd(UI24)
                            let amfobj = AMF.parseObject(arrayBuffer, dataOffset + offset, dataSize - offset - terminal);
                            if (amfobj.objectEnd)
                                break;
                            value[amfobj.data.name] = amfobj.data.value;
                            offset += amfobj.size;
                        }
                        if (offset <= dataSize - 3) {
                            let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                            if (marker === 9) {
                                offset += 3;
                            }
                        }
                        break;
                    }
                case 8:
                    { // ECMA array type (Mixed array)
                        value = {};
                        offset += 4; // ECMAArrayLength(UI32)
                        let terminal = 0; // workaround for malformed MixedArrays which has missing ScriptDataObjectEnd
                        if ((v.getUint32(dataSize - 4, !le) & 0x00FFFFFF) === 9) {
                            terminal = 3;
                        }
                        while (offset < dataSize - 8) { // 8 === type(UI8) + ECMAArrayLength(UI32) + ScriptDataVariableEnd(UI24)
                            let amfvar = AMF.parseVariable(arrayBuffer, dataOffset + offset, dataSize - offset - terminal);
                            if (amfvar.objectEnd)
                                break;
                            value[amfvar.data.name] = amfvar.data.value;
                            offset += amfvar.size;
                        }
                        if (offset <= dataSize - 3) {
                            let marker = v.getUint32(offset - 1, !le) & 0x00FFFFFF;
                            if (marker === 9) {
                                offset += 3;
                            }
                        }
                        break;
                    }
                case 9: // ScriptDataObjectEnd
                    value = undefined;
                    offset = 1;
                    objectEnd = true;
                    break;
                case 10:
                    { // Strict array type
                        // ScriptDataValue[n]. NOTE: according to video_file_format_spec_v10_1.pdf
                        value = [];
                        let strictArrayLength = v.getUint32(1, !le);
                        offset += 4;
                        for (let i = 0; i < strictArrayLength; i++) {
                            let val = AMF.parseValue(arrayBuffer, dataOffset + offset, dataSize - offset);
                            value.push(val.data);
                            offset += val.size;
                        }
                        break;
                    }
                case 11:
                    { // Date type
                        let date = AMF.parseDate(arrayBuffer, dataOffset + 1, dataSize - 1);
                        value = date.data;
                        offset += date.size;
                        break;
                    }
                case 12:
                    { // Long string type
                        let amfLongStr = AMF.parseString(arrayBuffer, dataOffset + 1, dataSize - 1);
                        value = amfLongStr.data;
                        offset += amfLongStr.size;
                        break;
                    }
                default:
                    // ignore and skip
                    offset = dataSize;
                    console.log('AMF', 'Unsupported AMF value type ' + type);
            }
        } catch (e) {
            console.log('AMF', e.toString());
        }

        return {
            data: value,
            size: offset,
            objectEnd: objectEnd
        };
    }

}

export default AMF;