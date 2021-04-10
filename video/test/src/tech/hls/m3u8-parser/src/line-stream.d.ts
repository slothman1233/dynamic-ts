/**
 * @file m3u8/line-stream.js
 */
import Stream from './stream';
/**
 * A stream that buffers string input and generates a `data` event for each
 * line.
 *
 * @class LineStream
 * @extends Stream
 */
export default class LineStream extends Stream {
    buffer: any;
    constructor();
    /**
     * Add new data to be parsed.
     *
     * @param {string} data the text to process
     */
    push(data: any): void;
}
