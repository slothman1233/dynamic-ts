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
  buffer:any
  constructor() {
    super();
    this.buffer = '';
  }

  /**
   * Add new data to be parsed.
   *
   * @param {string} data the text to process
   */
  push(data:any) {
    let nextNewline;

    this.buffer += data;
    nextNewline = this.buffer.indexOf('\n');

    for (; nextNewline > -1; nextNewline = this.buffer.indexOf('\n')) {
      this.trigger('data', this.buffer.substring(0, nextNewline));
      this.buffer = this.buffer.substring(nextNewline + 1);
    }
  }
}
