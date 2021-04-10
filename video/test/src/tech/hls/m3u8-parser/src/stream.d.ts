/**
 * @file stream.js
 */
/**
 * A lightweight readable stream implementation that handles event dispatching.
 *
 * @class Stream
 */
export default class Stream {
    listeners: any;
    constructor();
    /**
     * Add a listener for a specified event type.
     *
     * @param {string} type the event name
     * @param {Function} listener the callback to be invoked when an event of
     * the specified type occurs
     */
    on(type: any, listener: any): void;
    /**
     * Remove a listener for a specified event type.
     *
     * @param {string} type the event name
     * @param {Function} listener  a function previously registered for this
     * type of event through `on`
     * @return {boolean} if we could turn it off or not
     */
    off(type: any, listener: any): boolean;
    /**
     * Trigger an event of the specified type on this stream. Any additional
     * arguments to this function are passed as parameters to event listeners.
     *
     * @param {string} type the event name
     */
    trigger(type: any, val: any): void;
    /**
     * Destroys the stream and cleans up.
     */
    dispose(): void;
    /**
     * Forwards all `data` events on this stream to the destination stream. The
     * destination stream should provide a method `push` to receive the data
     * events as they arrive.
     *
     * @param {Stream} destination the stream that will receive all `data` events
     * @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
     */
    pipe(destination: any): void;
}
