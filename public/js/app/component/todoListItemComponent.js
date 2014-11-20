define([
    'underscore',
    'text!app/template/todo-list-item.html',
    'jquery',
    'app/view',
    'app/service/eventDispatcher'
], function (_, todoListItemTemplate, $, BaseView, eventDispatcher) {

    /**
     * @param {Object} todoListItem
     *
     * @constructor
     */
    var TodoListItemComponent = function (todoListItem) {

        /**
         * @type {jQuery}
         * @private
         */
        this._$el = null;

        /**
         * @type {Object}
         *
         * @private
         */
        this._todoListItem = null;

        TodoListItemComponent.prototype._init.apply(this, arguments);
    };

    _.extend(TodoListItemComponent.prototype, BaseView.prototype, {

        /**
         * @private
         */
        _init: function (todoListItem) {
            this._todoListItem = todoListItem;
        },

        /**
         * @returns {jQuery}
         */
        render: function () {
            var template = _.template(todoListItemTemplate);

            this._$el = $('<li class="todo-list-item" data-uuid="' + this._todoListItem.getUUID() + '">');
            this._$el.html(template({
                todoListItem: this._todoListItem
            }));

            this._initComponentEventListeners();

            return this._$el;
        },

        /**
         * @private
         */
        _initComponentEventListeners: function () {
            this._$el.find('.js-todo-list-item-remove').on('click', $.proxy(this._onRemoveClick, this));
        },

        /**
         * @param {Object} event
         * @private
         */
        _onRemoveClick: function (event) {
            event.preventDefault();

            eventDispatcher.trigger('todo_list_item.remove_click', {
                uuid: this._todoListItem.getUUID()
            });
        },
    });

    return TodoListItemComponent;
});
