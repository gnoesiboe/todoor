define([
    'app/service/inheritanceService',
    'jquery'
], function (inheritanceService) {

    /**
     * @constructor
     */
    var View = function () {};

    /**
     * @param {jQuery} $el
     * @returns {View}
     */
    View.prototype.setEl = function ($el) {
        this._validateEl($el);
        this._$el = $el;

        return this;
    };

    /**
     * @returns {jQuery}
     */
    View.prototype.getEl = function () {
        return this._$el;
    };

    /**
     * @param {jQuery} $el
     *
     * @throws {Error}
     *
     * @private
     */
    View.prototype._validateEl = function ($el) {
        if (($el instanceof jQuery) === false) {
            throw new Error('$el should be an instance of jQuery');
        }
    };

    return View;
});
