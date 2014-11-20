define([
    'underscore',
    'moment',
    'app/repository/todoListItemRepository'
], function (_, moment, todoListItemRepository) {

    /**
     * @param {String} uuid
     * @param {String} date
     *
     * @constructor
     */
    var Day = function (uuid, date) {

        /**
         * @type {Object}
         * @private
         */
        this._data = {
            uuid: null,
            date: null
        };

        Day.prototype._init.apply(this, arguments);
    };

    _.extend(Day.prototype, {

        /**
         * @param {String} uuid
         * @param {String} date
         *
         * @private
         */
        _init: function (uuid, date) {
            this._setUUID(uuid);
            this.setDate(date);
        },

        /**
         * @returns {Object}
         */
        getTodoListItems: function () {
            return todoListItemRepository.getAllForDate(this._data.date);
        },

        /**
         * @param {String} uuid
         * @returns {boolean}
         */
        hasItem: function (uuid) {
            var items = this.getTodoListItems();

            for (var i = 0, l = items.length; i < l; i++) {
                if (items[i].hasUUID(uuid) === true) {
                    return true;
                }
            }

            return false;
        },

        /**
         * @param {String} uuid
         *
         * @private
         */
        _setUUID: function (uuid) {
            if (_.isString(uuid) === false) {
                throw new Error('UUID should be of type string');
            }

            this._data.uuid = uuid;
        },

        /**
         * @param {Object} date
         *
         * @returns {Day}
         */
        setDate: function (date) {
            if (_.isObject(date) === false) {
                throw new Error('Date should be of a moment object');
            }

            this._data.date = date;

            return this;
        },

        /**
         * @returns {Object}
         */
        getDate: function () {
            return this._data.date;
        },

        /**
         * @returns {String}
         */
        getUUID: function () {
            return this._data.uuid;
        },

        /**
         * @returns {Object}
         */
        extractData: function () {
            var out = _.extend({}, this._data);

            out.date = out.date.format('YYYY-MM-DD');

            return out;
        }
    });

    return Day;
});
