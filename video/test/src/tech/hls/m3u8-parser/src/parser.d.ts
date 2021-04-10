/**
 * @file m3u8/parser.js
 */
import Stream from './stream';
/**
 * A parser for M3U8 files. The current interpretation of the input is
 * exposed as a property `manifest` on parser objects. It's just two lines to
 * create and parse a manifest once you have the contents available as a string:
 *
 * ```js
 * var parser = new m3u8.Parser();
 * parser.push(xhr.responseText);
 * ```
 *
 * New input can later be applied to update the manifest object by calling
 * `push` again.
 *
 * The parser attempts to create a usable manifest object even if the
 * underlying input is somewhat nonsensical. It emits `info` and `warning`
 * events during the parse if it encounters input that seems invalid or
 * requires some property of the manifest object to be defaulted.
 *
 * @class Parser
 * @extends Stream
 */
export default class Parser extends Stream {
    lineStream: any;
    parseStream: any;
    manifest: any;
    constructor();
    /**
     * Parse the input string and update the manifest object.
     *
     * @param {string} chunk a potentially incomplete portion of the manifest
     */
    push(chunk: any): void;
    /**
     * Flush any remaining input. This can be handy if the last line of an M3U8
     * manifest did not contain a trailing newline but the file has been
     * completely received.
     */
    end(): void;
    /**
     * Add an additional parser for non-standard tags
     *
     * @param {Object}   options              a map of options for the added parser
     * @param {RegExp}   options.expression   a regular expression to match the custom header
     * @param {string}   options.type         the type to register to the output
     * @param {Function} [options.dataParser] function to parse the line into an object
     * @param {boolean}  [options.segment]    should tag data be attached to the segment object
     */
    addParser(options: any): void;
    /**
     * Add a custom header mapper
     *
     * @param {Object}   options
     * @param {RegExp}   options.expression   a regular expression to match the custom header
     * @param {Function} options.map          function to translate tag into a different tag
     */
    addTagMapper(options: any): void;
}
