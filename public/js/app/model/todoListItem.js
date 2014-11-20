define([
    'underscore'
], function (_) {

    /**
     * @param {String} uuid
     * @param {String} title
     * @param {String} date
     * @param {Number} rank
     *
     * @constructor
     */
    var TodoListItem = function (uuid, title, date, rank) {

        /**
         * @type {Object}
         *
         * @private
         */
        this._data = {
            uuid:    null,
            title:   null,
            date:    null,
            checked: false,
            rank:    0
        };

        TodoListItem.prototype._init.apply(this, arguments);
    };

    /**
     * @param {String} uuid
     * @param {String} title
     * @param {String} date
     * @param {Number} rank
     *
     * @private
     */
    TodoListItem.prototype._init = function (uuid, title, date, rank) {
        this._setUUID(uuid);
        this.setTitle(title);
        this.setDate(date);
        this.setRank(rank || 0);
    };

    /**
     * @param {Number} rank
     *
     * @returns {TodoListItem}
     */
    TodoListItem.prototype.setRank = function (rank) {
        if (_.isNumber(rank) === false) {
            throw new Error('Rank should be a number');
        }

        this._data.rank = rank;

        return this;
    };

    /**
     * @returns {Number}
     */
    TodoListItem.prototype.getRank = function () {
        return this._data.rank;
    };

    /**
     * @param {String} uuid
     * @private
     */
    TodoListItem.prototype._setUUID = function (uuid) {
        if (_.isString(uuid) === false) {
            throw new Error('UUID should be a string');
        }

        this._data.uuid = uuid;
    };

    /**
     * @returns {String}
     */
    TodoListItem.prototype.getUUID = function () {
        return this._data.uuid;
    };

    /**
     * @param {String} uuid
     * @return {Boolean}
     */
    TodoListItem.prototype.hasUUID = function (uuid) {
        return this.getUUID() === uuid;
    };

    /**
     * @param {Object} date
     *
     * @returns {TodoListItem}
     */
    TodoListItem.prototype.setDate = function (date) {
        this._validateDate(date);
        this._data.date = date;

        return this;
    };

    /**
     * @param {Object} date
     *
     * @returns {boolean}
     */
    TodoListItem.prototype.hasDate = function (date) {
        this._validateDate(date);

        if (_.isObject(this._data.date) === false) {
            return false;
        }

        return this._data.date.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    };

    /**
     * @param {Date} date
     *
     * @private
     */
    TodoListItem.prototype._validateDate = function (date) {
        if (_.isObject(date) === false) {
            throw new Error('Date should be a moment object');
        }
    };

    /**
     * @returns {Object|Null}
     */
    TodoListItem.prototype.getDate = function () {
        return this._data.date;
    };

    /**
     * @param {String} title
     *
     * @returns {TodoListItem}
     */
    TodoListItem.prototype.setTitle = function (title) {
        if (_.isString(title) === false) {
            throw new Error('Title should be a string');
        }

        this._data.title = title;

        return this;
    };

    /**
     * @returns {String}
     */
    TodoListItem.prototype.getTitle = function () {
        return this._data.title;
    };

    /**
     * @returns {boolean}
     */
    TodoListItem.prototype.isChecked = function () {
        return this._data.checked;
    };

    /**
     * @param {Boolean} checked
     *
     * @returns {TodoListItem}
     */
    TodoListItem.prototype.setChecked = function (checked) {
        if (_.isBoolean(checked) === false) {
            throw new Error('Checked should be a boolean');
        }

        this._data.checked = checked;

        return this;
    };

    /**
     * @returns {Object}
     */
    TodoListItem.prototype.extractData = function () {
        var out = _.extend({}, this._data);

        out.date = out.date.format('YYYY-MM-DD');

        return out;
    };

    return TodoListItem;
});
