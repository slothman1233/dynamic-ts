declare class ExpGolomb {
    TAG: any;
    _buffer: any;
    _buffer_index: any;
    _total_bytes: any;
    _total_bits: any;
    _current_word: any;
    _current_word_bits_left: any;
    constructor(uint8array: any);
    destroy(): void;
    _fillCurrentWord(): any;
    readBits(bits: any): any;
    readBool(): any;
    readByte(): any;
    _skipLeadingZero(): any;
    readUEG(): any;
    readSEG(): any;
}
export default ExpGolomb;
