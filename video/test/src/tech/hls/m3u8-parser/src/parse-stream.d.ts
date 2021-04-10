/**
 * @file m3u8/parse-stream.js
 */
import Stream from './stream';
/**
 * A line-level M3U8 parser event stream. It expects to receive input one
 * line at a time and performs a context-free parse of its contents. A stream
 * interpretation of a manifest can be useful if the manifest is expected to
 * be too large to fit comfortably into memory or the entirety of the input
 * is not immediately available. Otherwise, it's probably much easier to work
 * with a regular `Parser` object.
 *
 * Produces `data` events with an object that captures the parser's
 * interpretation of the input. That object has a property `tag` that is one
 * of `uri`, `comment`, or `tag`. URIs only have a single additional
 * property, `line`, which captures the entirety of the input without
 * interpretation. Comments similarly have a single additional property
 * `text` which is the input without the leading `#`.
 *
 * Tags always have a property `tagType` which is the lower-cased version of
 * the M3U8 directive without the `#EXT` or `#EXT-X-` prefix. For instance,
 * `#EXT-X-MEDIA-SEQUENCE` becomes `media-sequence` when parsed. Unrecognized
 * tags are given the tag type `unknown` and a single additional property
 * `data` with the remainder of the input.
 *
 * @class ParseStream
 * @extends Stream
 */
export default class ParseStream extends Stream {
    customParsers: any;
    tagMappers: any;
    constructor();
    /**
     * Parses an additional line of input.
     *
     * @param {string} line a single line of an M3U8 file to parse
     */
    push(line: any): void;
    /**
     * Add a parser for custom headers
     *
     * @param {Object}   options              a map of options for the added parser
     * @param {RegExp}   options.expression   a regular expression to match the custom header
     * @param {string}   options.customType   the custom type to register to the output
     * @param {Function} [options.dataParser] function to parse the line into an object
     * @param {boolean}  [options.segment]    should tag data be attached to the segment object
     */
    addParser({ expression, customType, dataParser, segment }: any): void;
    /**
     * Add a custom header mapper
     *
     * @param {Object}   options
     * @param {RegExp}   options.expression   a regular expression to match the custom header
     * @param {Function} options.map          function to translate tag into a different tag
     */
    addTagMapper({ expression, map }: any): void;
}
