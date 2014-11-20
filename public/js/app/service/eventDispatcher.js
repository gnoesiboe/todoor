define([
    'underscore',
    'app/service/logger'
], function (_, logger) {

    /**
     * @type {Object}
     */
    var _listeners = {};

    /**
     * @param {String} event
     *
     * @throws {Error}
     */
    var _validateEvent = function (event) {
        if (_.isString(event) === false) {
            throw new Error('Event name should be of type string');
        }
    };

    /**
     * @param {Function} callback
     *
     * @throws {Error}
     */
    var _validateCallback = function (callback) {
        if (_.isFunction(callback) === false) {
            throw new Error('Callback should be a function');
        }
    };

    /**
     * @param {String} event
     *
     * @returns {Array}
     */
    var _getListenersForEvent = function (event) {
        if (typeof _listeners[event] === 'undefined') {
            return [];
        }

        return _listeners[event];
    };

    return {

        /**
         * @param {String} event
         * @param {Function} callback
         * @param {Object} context
         *
         * @return {Object}
         */
        register: function (event, callback, context) {
            _validateEvent(event);
            _validateCallback(callback);

            context = _.isObject(context) ? context : this;

            if (typeof _listeners[event] === 'undefined') {
                _listeners[event] = [];
            }

            _listeners[event].push({
                callback: callback,
                context:  context
            });

            return this;
        },

        /**
         * @param {String} event
         * @param {Object} data
         *
         * @return {Object}
         */
        trigger: function (event, data) {
            _validateEvent(event);
            data = _.isObject(data) ? data : {};

            logger.log('event \'' + event + '\' triggered with data: ' + JSON.stringify(data), ['eventDispatcher']);

            var listeners = _getListenersForEvent(event);

            for (var i = 0, l = listeners.length; i < l; i++) {
                var listener = listeners[i];

                listener.callback.call(listener.context, data);
            }

            return this;
        }
    };
});
