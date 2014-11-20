define([
    'underscore',
    'text!app/template/add-todo-list-item.html',
    'app/view',
    'app/service/logger',
    'app/service/eventDispatcher',
    'app/repository/dayRepository',
    'moment',
    'app/model/todoListItem',
    'app/service/arrayHelper',
    'app/service/UUIDGenerator',
    'app/repository/todoListItemRepository',
    'bootstrapValidatorNL'
], function (_, addTodoListItemTemplate, BaseView, logger, eventDispatcher, dayRepository, moment, TodoListItem, arrayHelper, UUIDGenerator, todoListItemRepository) {

    /**
     * @param {Object} date
     *
     * @constructor
     */
    var AddTodoListItemComponent = function (date) {

        /**
         * @type {Object}
         * @private
         */
        this._day = null;

        /**
         * @type {jQuery}
         * @private
         */
        this._$el = null;

        AddTodoListItemComponent.prototype._init.apply(this, arguments);
    };

    _.extend(AddTodoListItemComponent.prototype, BaseView.prototype, {

        /**
         * @param {jQuery} $el
         *
         * @private
         */
        _init: function ($el) {
            this.setEl($el);
            this._initComponentEventListeners();
        },

        /**
         * Initiates the component event listeners
         *
         * @private
         */
        _initComponentEventListeners: function () {
            eventDispatcher.register('day.add_todo_list_item_click', this._onAddTodoListItemClick, this);
        },

        /**
         * @param {Object} data
         * @private
         */
        _onAddTodoListItemClick: function (data) {
            logger.log('Recieved add todo list item click event..', ['addTodoListItem']);

            this._day = data.day;

            this.render();
            this._$el.find('#js-add-todo-list-item-modal')
                .modal()
                .on('shown.bs.modal', jQuery.proxy(this._onModalShown, this));
        },

        /**
         * @private
         */
        _onModalShown: function () {
            this._setFocusToSummaryInput();
        },

        /**
         * @private
         */
        _setFocusToSummaryInput: function () {
            jQuery('.js-input-title').focus();
        },

        /**
         * @returns {jQuery}
         */
        render: function () {
            var template = _.template(addTodoListItemTemplate);

            var today = moment();

            this._$el.html(template({
                title: 'Add new item',
                date:  _.isObject(this._day) ? this._day.getDate().format('YYYY-MM-DD') : today.format('YYYY-MM-DD')
            }));

            this._initForm();

            return this._$el;
        },

        /**
         * @private
         */
        _initForm: function () {
            this._$el.find('.js-add-todo-list-item-form')
                .bootstrapValidator()
                .on('success.form.bv', jQuery.proxy(this._onFormSubmit, this));
        },

        /**
         * @param {Object} event
         * @private
         */
        _onFormSubmit: function (event) {
            event.preventDefault();

            var values = arrayHelper.toKeyValueObject(this._$el.find('.js-add-todo-list-item-form').serializeArray(), 'name', 'value');

            this._createTodoListItem(values);
            this._resetFormWidgets();
        },

        /**
         * @private
         */
        _resetFormWidgets: function () {
            this._$el.find('input[type=text]').val('');
        },

        /**
         * @param {Object} values
         * @private
         */
        _createTodoListItem: function (values) {
            var normalizedValues = arrayHelper.normalize(values, {
                title: null
            });

            var todoListItem = new TodoListItem(
                UUIDGenerator.generateUUID(),
                normalizedValues.title,
                this._day.getDate(),
                todoListItemRepository.getAllForDate(this._day.getDate()).length()
            );

            todoListItemRepository.create(todoListItem);
        }
    });

    return AddTodoListItemComponent;
});
