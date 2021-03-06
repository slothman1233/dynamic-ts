/**
 * @file m3u8/parser.js
 */
import Stream from './stream';
import LineStream from './line-stream';
import ParseStream from './parse-stream';

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
  lineStream:any
  parseStream:any
  manifest:any
  constructor() {
    super();
    this.lineStream = new LineStream();
    this.parseStream = new ParseStream();
    this.lineStream.pipe(this.parseStream);

    /* eslint-disable consistent-this */
    const self:any = this;
    /* eslint-enable consistent-this */
    const uris:any[] = [];
    let currentUri:any = {};
    // if specified, the active EXT-X-MAP definition
    let currentMap:any;
    // if specified, the active decryption key
    let key:any;
    const noop:any = function() {};
    const defaultMediaGroups:any = {
      'AUDIO': {},
      'VIDEO': {},
      'CLOSED-CAPTIONS': {},
      'SUBTITLES': {}
    };
    // group segments into numbered timelines delineated by discontinuities
    let currentTimeline = 0;

    // the manifest is empty until the parse stream begins delivering data
    this.manifest = {
      allowCache: true,
      discontinuityStarts: [],
      segments: []
    };

    // update the manifest with the m3u8 entry from the parse stream
    this.parseStream.on('data', function(entry:any) {
      let mediaGroup;
      let rendition;
      class newObj {
        manifest:any
        trigger:any
        tag():void {
          class tagObj {
            manifest:any
            trigger:any
            'allow-cache'() {
              this.manifest.allowCache = entry.allowed;
              if (!('allowed' in entry)) {
                this.trigger('info', {
                  message: 'defaulting allowCache to YES'
                });
                this.manifest.allowCache = true;
              }
            }
            byterange() {
              const byterange = {};

              if ('length' in entry) {
                (<any>currentUri).byterange = byterange;
                (<any>byterange).length = entry.length;

                if (!('offset' in entry)) {
                  this.trigger('info', {
                    message: 'defaulting offset to zero'
                  });
                  entry.offset = 0;
                }
              }
              if ('offset' in entry) {
                (<any>currentUri).byterange = byterange;
                (<any>byterange).offset = entry.offset;
              }
            }
            endlist() {
              this.manifest.endList = true;
            }
            inf() {
              if (!('mediaSequence' in this.manifest)) {
                this.manifest.mediaSequence = 0;
                this.trigger('info', {
                  message: 'defaulting media sequence to zero'
                });
              }
              if (!('discontinuitySequence' in this.manifest)) {
                this.manifest.discontinuitySequence = 0;
                this.trigger('info', {
                  message: 'defaulting discontinuity sequence to zero'
                });
              }
              if (entry.duration > 0) {
                (<any>currentUri).duration = entry.duration;
              }

              if (entry.duration === 0) {
                (<any>currentUri).duration = 0.01;
                this.trigger('info', {
                  message: 'updating zero segment duration to a small value'
                });
              }

              this.manifest.segments = uris;
            }
            key() {
              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without attribute list'
                });
                return;
              }
              // clear the active encryption key
              if (entry.attributes.METHOD === 'NONE') {
                key = null;
                return;
              }
              if (!entry.attributes.URI) {
                this.trigger('warn', {
                  message: 'ignoring key declaration without URI'
                });
                return;
              }
              if (!entry.attributes.METHOD) {
                this.trigger('warn', {
                  message: 'defaulting key method to AES-128'
                });
              }

              // setup an encryption key for upcoming segments
              key = {
                method: entry.attributes.METHOD || 'AES-128',
                uri: entry.attributes.URI
              };

              if (typeof entry.attributes.IV !== 'undefined') {
                key.iv = entry.attributes.IV;
              }
            }
            'media-sequence'() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid media sequence: ' + entry.number
                });
                return;
              }
              this.manifest.mediaSequence = entry.number;
            }
            'discontinuity-sequence'() {
              if (!isFinite(entry.number)) {
                this.trigger('warn', {
                  message: 'ignoring invalid discontinuity sequence: ' + entry.number
                });
                return;
              }
              this.manifest.discontinuitySequence = entry.number;
              currentTimeline = entry.number;
            }
            'playlist-type'() {
              if (!(/VOD|EVENT/).test(entry.playlistType)) {
                this.trigger('warn', {
                  message: 'ignoring unknown playlist type: ' + entry.playlist
                });
                return;
              }
              this.manifest.playlistType = entry.playlistType;
            }
            map() {
              currentMap = {};
              if (entry.uri) {
                currentMap.uri = entry.uri;
              }
              if (entry.byterange) {
                currentMap.byterange = entry.byterange;
              }
            }
            'stream-inf'() {
              this.manifest.playlists = uris;
              this.manifest.mediaGroups =
                this.manifest.mediaGroups || defaultMediaGroups;

              if (!entry.attributes) {
                this.trigger('warn', {
                  message: 'ignoring empty stream-inf attributes'
                });
                return;
              }

              if (!(<any>currentUri).attributes) {
                (<any>currentUri).attributes = {};
              }
              Object.assign((<any>currentUri).attributes, entry.attributes);
            }
            media() {
              this.manifest.mediaGroups =
                this.manifest.mediaGroups || defaultMediaGroups;

              if (!(entry.attributes &&
                    entry.attributes.TYPE &&
                    entry.attributes['GROUP-ID'] &&
                    entry.attributes.NAME)) {
                this.trigger('warn', {
                  message: 'ignoring incomplete or missing media group'
                });
                return;
              }

              // find the media group, creating defaults as necessary
              const mediaGroupType = this.manifest.mediaGroups[entry.attributes.TYPE];

              mediaGroupType[entry.attributes['GROUP-ID']] =
                mediaGroupType[entry.attributes['GROUP-ID']] || {};
              mediaGroup = mediaGroupType[entry.attributes['GROUP-ID']];

              // collect the rendition metadata
              rendition = {
                default: (/yes/i).test(entry.attributes.DEFAULT)
              };
              if (rendition.default) {
                (<any>rendition).autoselect = true;
              } else {
                (<any>rendition).autoselect = (/yes/i).test(entry.attributes.AUTOSELECT);
              }
              if (entry.attributes.LANGUAGE) {
                (<any>rendition).language = entry.attributes.LANGUAGE;
              }
              if (entry.attributes.URI) {
                (<any>rendition).uri = entry.attributes.URI;
              }
              if (entry.attributes['INSTREAM-ID']) {
                (<any>rendition).instreamId = entry.attributes['INSTREAM-ID'];
              }
              if (entry.attributes.CHARACTERISTICS) {
                (<any>rendition).characteristics = entry.attributes.CHARACTERISTICS;
              }
              if (entry.attributes.FORCED) {
                (<any>rendition).forced = (/yes/i).test(entry.attributes.FORCED);
              }

              // insert the new rendition
              mediaGroup[entry.attributes.NAME] = rendition;
            }
            discontinuity() {
              currentTimeline += 1;
              (<any>currentUri).discontinuity = true;
              this.manifest.discontinuityStarts.push(uris.length);
            }
            'program-date-time'() {
              if (typeof this.manifest.dateTimeString === 'undefined') {
                // PROGRAM-DATE-TIME is a media-segment tag, but for backwards
                // compatibility, we add the first occurence of the PROGRAM-DATE-TIME tag
                // to the manifest object
                // TODO: Consider removing this in future major version
                this.manifest.dateTimeString = entry.dateTimeString;
                this.manifest.dateTimeObject = entry.dateTimeObject;
              }

              (<any>currentUri).dateTimeString = entry.dateTimeString;
              (<any>currentUri).dateTimeObject = entry.dateTimeObject;
            }
            targetduration() {
              if (!isFinite(entry.duration) || entry.duration < 0) {
                this.trigger('warn', {
                  message: 'ignoring invalid target duration: ' + entry.duration
                });
                return;
              }
              this.manifest.targetDuration = entry.duration;
            }
            totalduration() {
              if (!isFinite(entry.duration) || entry.duration < 0) {
                this.trigger('warn', {
                  message: 'ignoring invalid total duration: ' + entry.duration
                });
                return;
              }
              this.manifest.totalDuration = entry.duration;
            }
            start() {
              if (!entry.attributes || isNaN(entry.attributes['TIME-OFFSET'])) {
                this.trigger('warn', {
                  message: 'ignoring start declaration without appropriate attribute list'
                });
                return;
              }
              this.manifest.start = {
                timeOffset: entry.attributes['TIME-OFFSET'],
                precise: entry.attributes.PRECISE
              };
            }
            'cue-out'() {
              (<any>currentUri).cueOut = entry.data;
            }
            'cue-out-cont'() {
              (<any>currentUri).cueOutCont = entry.data;
            }
            'cue-in'() {
              (<any>currentUri).cueIn = entry.data;
            }
          }
          let tagData:any = new tagObj;
          // switch based on the tag type
          ((tagData)[entry.tagType] || noop).call(self);
        }
        uri():void {
          (<any>currentUri).uri = entry.uri;
          uris.push(currentUri);

          // if no explicit duration was declared, use the target duration
          if (this.manifest.targetDuration && !('duration' in currentUri)) {
            this.trigger('warn', {
              message: 'defaulting segment duration to the target duration'
            });
            (<any>currentUri).duration = this.manifest.targetDuration;
          }
          // annotate with encryption information, if necessary
          if (key) {
            (<any>currentUri).key = key;
          }
          (<any>currentUri).timeline = currentTimeline;
          // annotate with initialization segment information, if necessary
          if (currentMap) {
            (<any>currentUri).map = currentMap;
          }

          // prepare for the next URI
          currentUri = {};
        }
        comment():void{
          // comments are not important for playback
        }
        custom():void{
          // if this is segment-level data attach the output to the segment
          if (entry.segment) {
            (<any>currentUri).custom = (<any>currentUri).custom || {};
            (<any>currentUri).custom[entry.customType] = entry.data;
          // if this is manifest-level data attach to the top level manifest object
          } else {
            this.manifest.custom = this.manifest.custom || {};
            this.manifest.custom[entry.customType] = entry.data;
          }
        }
      }
      let obj:any = new newObj();
      (obj)[entry.type].call(self);
    });
  }

  /**
   * Parse the input string and update the manifest object.
   *
   * @param {string} chunk a potentially incomplete portion of the manifest
   */
  push(chunk:any) {
    this.lineStream.push(chunk);
  }

  /**
   * Flush any remaining input. This can be handy if the last line of an M3U8
   * manifest did not contain a trailing newline but the file has been
   * completely received.
   */
  end() {
    // flush any buffered input
    this.lineStream.push('\n');
  }
  /**
   * Add an additional parser for non-standard tags
   *
   * @param {Object}   options              a map of options for the added parser
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {string}   options.type         the type to register to the output
   * @param {Function} [options.dataParser] function to parse the line into an object
   * @param {boolean}  [options.segment]    should tag data be attached to the segment object
   */
  addParser(options:any) {
    this.parseStream.addParser(options);
  }
  /**
   * Add a custom header mapper
   *
   * @param {Object}   options
   * @param {RegExp}   options.expression   a regular expression to match the custom header
   * @param {Function} options.map          function to translate tag into a different tag
   */
  addTagMapper(options:any) {
    this.parseStream.addTagMapper(options);
  }
}
