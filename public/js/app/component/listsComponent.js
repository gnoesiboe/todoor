define([
    'underscore',
    'app/view',
    'text!app/template/lists.html'
], function (_, BaseView, listsTemplate) {

    /**
     * @param {jQuery} $el
     *
     * @constructor
     */
    var ListsComponent = function ($el) {

        /**
         * @type {jQuery}
         * @private
         */
        this._$el= null;

        ListsComponent.prototype._init.apply(this, arguments);
    };

    _.extend(ListsComponent.prototype, BaseView.prototype, {

        /**
         * @param {jQuery} $el
         * @private
         */
        _init: function ($el) {
            this.setEl($el);
        },

        /**
         * @returns {jQuery}
         */
        render: function () {
            var template = _.template(listsTemplate);

            this._$el.append(template({

            }));

            return this._$el;
        }
    });

    return ListsComponent;
});
