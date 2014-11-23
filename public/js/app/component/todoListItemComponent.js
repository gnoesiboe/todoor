define([
    'underscore',
    'text!app/template/todo-list-item.html',
    'jquery',
    'app/view',
    'app/repository/todoListItemRepository',
    'bootbox'
], function (_, todoListItemTemplate, $, BaseView, todoListItemRepository, bootbox) {

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
            var self = this;

            this._$el.find('.js-todo-list-item-remove').click(function (e) {
                bootbox.confirm('Are you sure?', function (result) {
                    if (result === true) {
                        todoListItemRepository.remove(self._todoListItem);
                    }
                });
            });

            this._$el.find('.js-todo-list-item-checkbox').on('change', $.proxy(this._onCheckboxChange, this));
        },

        _onCheckboxChange: function (e) {
            this._todoListItem.setChecked(this._todoListItem.isChecked() !== true);

            todoListItemRepository.update(this._todoListItem);
        }
    });

    return TodoListItemComponent;
});
