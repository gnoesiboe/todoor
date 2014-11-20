define([
    'underscore'
], function (_) {

    /**
     * @param {String} type
     * @param {String} message
     * @param {Array} tags
     */
    var log = function (type, message, tags) {
        if (typeof console === 'undefined') {
            return;
        }

        validateType(type);

        if (typeof console[type] === 'undefined') {
            return;
        }

        validateMessage(message);
        validateTags(tags);

        console[type](generateMessageWithTags(message, tags));
    };

    /**
     * @param {String} type
     *
     * @throws {Error}
     */
    var validateType = function (type) {
        if (_.isString(type) === false) {
            throw new Error('Type should be of type string');
        }
    };

    /**
     * @param {String} message
     *
     * @throws {Error}
     */
    var validateMessage = function (message) {
        if (_.isString(message) === false) {
            throw new Error('Message should be of type string');
        }
    };

    /**
     * @param {Array} tags
     *
     * @throws {Error}
     */
    var validateTags = function (tags) {
        if (_.isArray(tags) === false) {
            throw new Error('Tags should be an array');
        }
    };

    /**
     * @param {String} message
     * @param {Array} tags
     *
     * @returns {string}
     */
    var generateMessageWithTags = function (message, tags) {
        var prefix = '';

        for (var i = 0, l = tags.length; i < l; i++) {
            prefix += '[' + tags[i] + '] ';
        }

        return prefix + ':: ' + message;
    };

    return {

        /**
         * @param {String} message
         * @param {Array} tags
         *
         * @return {Object}
         */
        log: function (message, tags) {
            log('log', message, tags);

            return this;
        },

        /**
         * @param {String} message
         * @param {Array} tags
         *
         * @return {Object}
         */
        info: function (message, tags) {
            log('info', message, tags);

            return this;
        },

        /**
         * @param {String} message
         * @param {Array} tags
         *
         * @return {Object}
         */
        error: function (message, tags) {
            log('error', message, tags);

            return this;
        },

        /**
         * @param {String} message
         * @param {Array} tags
         *
         * @return {Object}
         */
        debug: function (message, tags) {
            log('debug', message, tags);

            return this;
        }
    }
});
