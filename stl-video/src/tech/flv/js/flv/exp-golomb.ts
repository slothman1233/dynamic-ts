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
/* eslint-disable */
// Exponential-Golomb buffer decoder
declare let InvalidArgumentException:any
declare let IllegalStateException:any
class ExpGolomb {
    TAG:any
    _buffer:any
    _buffer_index:any
    _total_bytes:any
    _total_bits:any
    _current_word:any
    _current_word_bits_left:any
    constructor(uint8array:any) {
        this.TAG = this.constructor.name;

        this._buffer = uint8array;
        this._buffer_index = 0;
        this._total_bytes = uint8array.byteLength;
        this._total_bits = uint8array.byteLength * 8;
        this._current_word = 0;
        this._current_word_bits_left = 0;
    }

    destroy() {
        this._buffer = null;
    }

    _fillCurrentWord():any {
        const buffer_bytes_left:any = this._total_bytes - this._buffer_index;
        if (buffer_bytes_left <= 0) { throw new IllegalStateException('ExpGolomb: _fillCurrentWord() but no bytes available'); }

        const bytes_read:any = Math.min(4, buffer_bytes_left);
        const word:any = new Uint8Array(4);
        word.set(this._buffer.subarray(this._buffer_index, this._buffer_index + bytes_read));
        this._current_word = new DataView(word.buffer).getUint32(0, false);

        this._buffer_index += bytes_read;
        this._current_word_bits_left = bytes_read * 8;
    }

    readBits(bits:any):any {
        if (bits > 32) { throw new InvalidArgumentException('ExpGolomb: readBits() bits exceeded max 32bits!'); }

        if (bits <= this._current_word_bits_left) {
            const result = this._current_word >>> (32 - bits);
            this._current_word <<= bits;
            this._current_word_bits_left -= bits;
            return result;
        }

        let result:any = this._current_word_bits_left ? this._current_word : 0;
        result = result >>> (32 - this._current_word_bits_left);
        const bits_need_left:any = bits - this._current_word_bits_left;

        this._fillCurrentWord();
        const bits_read_next:any = Math.min(bits_need_left, this._current_word_bits_left);

        const result2:any = this._current_word >>> (32 - bits_read_next);
        this._current_word <<= bits_read_next;
        this._current_word_bits_left -= bits_read_next;

        result = (result << bits_read_next) | result2;
        return result;
    }

    readBool():any {
        return this.readBits(1) === 1;
    }

    readByte():any {
        return this.readBits(8);
    }

    _skipLeadingZero():any {
        let zero_count:any;
        for (zero_count = 0; zero_count < this._current_word_bits_left; zero_count++) {
            if ((this._current_word & (0x80000000 >>> zero_count)) !== 0) {
                this._current_word <<= zero_count;
                this._current_word_bits_left -= zero_count;
                return zero_count;
            }
        }
        this._fillCurrentWord();
        return zero_count + this._skipLeadingZero();
    }

    readUEG():any { // unsigned exponential golomb
        const leading_zeros = this._skipLeadingZero();
        return this.readBits(leading_zeros + 1) - 1;
    }

    readSEG():any { // signed exponential golomb
        const value:any = this.readUEG();
        if (value & 0x01) {
            return (value + 1) >>> 1;
        } else {
            return -1 * (value >>> 1);
        }
    }

}

export default ExpGolomb;