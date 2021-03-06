/**
 * @file stream.js
 */
/**
 * A lightweight readable stream implementation that handles event dispatching.
 *
 * @class Stream
 */
export default class Stream {
  listeners:any
  constructor() {
    this.listeners = {};
  }

  /**
   * Add a listener for a specified event type.
   *
   * @param {string} type the event name
   * @param {Function} listener the callback to be invoked when an event of
   * the specified type occurs
   */
  on(type:any, listener:any) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  /**
   * Remove a listener for a specified event type.
   *
   * @param {string} type the event name
   * @param {Function} listener  a function previously registered for this
   * type of event through `on`
   * @return {boolean} if we could turn it off or not
   */
  off(type:any, listener:any) {
    if (!this.listeners[type]) {
      return false;
    }

    const index = this.listeners[type].indexOf(listener);

    this.listeners[type].splice(index, 1);
    return index > -1;
  }

  /**
   * Trigger an event of the specified type on this stream. Any additional
   * arguments to this function are passed as parameters to event listeners.
   *
   * @param {string} type the event name
   */
  trigger(type:any,val:any) {
    const callbacks = this.listeners[type];
    let i;
    let length;
    let args;

    if (!callbacks) {
      return;
    }
    // Slicing the arguments on every invocation of this method
    // can add a significant amount of overhead. Avoid the
    // intermediate object creation for the common case of a
    // single callback argument
    if (arguments.length === 2) {
      length = callbacks.length;
      for (i = 0; i < length; ++i) {
        callbacks[i].call(this, arguments[1]);
      }
    } else {
      args = Array.prototype.slice.call(arguments, 1);
      length = callbacks.length;
      for (i = 0; i < length; ++i) {
        callbacks[i].apply(this, args);
      }
    }
  }

  /**
   * Destroys the stream and cleans up.
   */
  dispose() {
    this.listeners = {};
  }
  /**
   * Forwards all `data` events on this stream to the destination stream. The
   * destination stream should provide a method `push` to receive the data
   * events as they arrive.
   *
   * @param {Stream} destination the stream that will receive all `data` events
   * @see http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
   */
  pipe(destination:any) {
    this.on('data', function(data:any) {
      destination.push(data);
    });
  }
}
