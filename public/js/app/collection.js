define([
    'underscore'
], function (_) {

    /**
     * @param {Array} data
     *
     * @constructor
     */
    var Collection = function (data) {

        /**
         * @type {Array}
         * @private
         */
        this._data = [];

        Collection.prototype._init.apply(this, arguments);
    };

    _.extend(Collection.prototype, {

        /**
         * @param {Array} data
         * @private
         */
        _init: function (data) {
            this.setData(data || []);
        },

        /**
         * @param {Array} data
         *
         * @returns {Collection}
         */
        setData: function (data) {
            this._validateData(data);
            this._data = data;

            return this;
        },

        /**
         * @param {Array} data
         * @private
         */
        _validateData: function (data) {
            if (_.isArray(data) === false) {
                throw new Error('Data should be of type Array');
            }
        },

        /**
         * @param {Function} callback
         * @returns {*}
         */
        filter: function (callback) {
            return new Collection(_.filter(this._data, callback));
        },

        /**
         * @param {Function} callback
         * @returns {*}
         */
        each: function (callback) {
            _.each(this._data, callback);
        },

        /**
         * @returns {Array}
         */
        getData: function () {
            return _.clone(this._data);
        },

        /**
         * @returns {Array}
         */
        extractData: function () {
            var out = [];

            _.each(this._data, function (todoListItem) {
                out.push(todoListItem.extractData !== 'undefined' ? todoListItem.extractData() : todoListItem);
            });

            return out;
        },

        /**
         * @param {Function} callback
         *
         * @returns {Number}
         */
        find: function(callback) {
            for (var i = 0, l = this._data.length; i < l; i++) {
                var item = this._data[i];

                if (callback(item) === true) {
                    return i;
                }
            }

            return null;
        },

        /**
         * @param {Function} callback
         * @param {Object|Null} context
         *
         * @returns {Collection}
         */
        sort: function (callback, context) {
            return new Collection(_.sortBy(this._data, callback, context || this));
        },

        /**
         * @returns {Object}
         */
        first: function () {
            return this._data[0];
        },

        /**
         * @returns {Number}
         */
        length: function () {
            return this._data.length;
        },

        /**
         * @param {Object} item
         *
         * @returns {Collection}
         */
        add: function (item) {
            this._data.push(item);

            return this;
        }
    });

    return Collection;
});
