define([
    'underscore',
    'text!app/template/day.html',
    'moment',
    'app/component/todoListItemComponent',
    'app/model/todoListItem',
    'app/service/UUIDGenerator',
    'app/repository/dayRepository',
    'app/service/logger',
    'jquery',
    'app/view',
    'app/service/eventDispatcher',
    'app/model/day',
    'app/repository/todoListItemRepository',
    'jquery-ui'
], function (_, dayTemplate, moment, todoListItemComponent, TodoListItem, UUIDGenerator, dayRepository, logger, $, BaseView, eventDispatcher, Day, todoListItemRepository) {

    /**
     * @param {String} $el
     * @param {Object} day
     *
     * @constructor
     */
    var DayComponent = function ($el, day) {

        /**
         * @type {jQuery}
         * @private
         */
        this._$el = null;

        /**
         * @type {Object}
         * @private
         */
        this._day = null;

        /**
         * @type {Array}
         * @private
         */
        this._todoListItemComponents;

        DayComponent.prototype._init.apply(this, arguments);
    };

    _.extend(DayComponent.prototype, BaseView.prototype, {

        /**
         * @param {jQuery} $el
         * @param {Object} day
         *
         * @private
         */
        _init: function ($el, day) {
            this.setEl($el);
            this._day = day;

            logger.log('Init day component for date: ' + this._day.getDate().format('L'), ['day']);

            eventDispatcher.register('repository.todo_list_item.persisted', this._onTodoListItemPersisted, this);
            eventDispatcher.register('todo_list_item.remove_click', this._onTodoListItemRemoveClick, this);
        },

        /**
         * @param {Object} data
         *
         * @private
         */
        _onTodoListItemRemoveClick: function (data) {
            if (typeof data.uuid === 'undefined') {
                logger.error('no uuid found. We need it to be able to see what to delete');

                return;
            }

            var uuid = data.uuid;

            if (this._day.hasItem(uuid) === false) {
                return;
            }

            todoListItemRepository.remove(uuid);

            this.render();
        },

        /**
         * @param {Object} data
         * @private
         */
        _onTodoListItemPersisted: function (data) {
            if (typeof data.uuid === 'undefined') {
                logger.error('no uuid key found to get todo list item with');

                return;
            }

            if (typeof data.date === 'undefined') {
                logger.error('no date key found to define date with');

                return;
            }

            if (data.date !== this._day.getDate().format('YYYY-MM-DD')) {
                return;
            }

            var todoListItem = todoListItemRepository.getOneByUUID(data.uuid);

            this._todoListItemComponents.push(new todoListItemComponent(todoListItem));
            this.render();
        },

        /**
         * @private
         */
        _initComponentEventListeners: function () {
            this._$el.find('.js-add-todoo-item')
                .on('click', $.proxy(this._onAddTodoItemClick, this));
        },

        /**
         * @param {Object} e
         * @private
         */
        _onAddTodoItemClick: function (e) {
            e.preventDefault();

            this.triggerAddTodoListItemEvent();
        },

        /**
         * Triggers the add todolist item event
         */
        triggerAddTodoListItemEvent: function () {
            eventDispatcher.trigger('day.add_todo_list_item_click', {
                day: this._day
            });
        },

        /**
         * @returns {string}
         * @private
         */
        _generateViewId: function () {
            return 'js-day-' + this._day.getDate().format('l');
        },

        /**
         * @private
         */
        _initTodoListItemComponents: function () {
            this._todoListItemComponents = [];
            var self = this;

            var todoListItems = this._day.getTodoListItems().sort(function (todoListItem) {
                return todoListItem.getRank(); // sort by rank ascending
            });

            todoListItems.each(function (todoListItem) {
                self._todoListItemComponents.push(new todoListItemComponent(todoListItem));
            });

            for (var i = 0, l = todoListItems.length; i < l; i++) {
                this._todoListItemComponents.push(new todoListItemComponent(todoListItems[i]));
            }
        },

        /**
         * @returns {jQuery}
         */
        render: function () {
            logger.log('Render ' + this._day.getDate().format('L'), ['dayComponent']);

            this._initTodoListItemComponents();

            var template = _.template(dayTemplate);

            this._$el.html(template({
                day:       this._day,
                isCurrent: this.isCurrent(),
                id:        this._generateViewId()
            }));

            this._renderTodoListItemComponents();

            this._initComponentEventListeners();

            return this._$el;
        },

        /**
         * @returns {string}
         *
         * @private
         */
        _renderTodoListItemComponents: function () {
            var $todoListEl = this._$el.find('.js-todo-list');

            if ($todoListEl.length === 0) {
                logger.info('No list to put rendered todo list items in', ['day'])
            }

            for (var key in this._todoListItemComponents) {
                if (this._todoListItemComponents.hasOwnProperty(key)) {
                    var $todoListItemEl = this._todoListItemComponents[key].render();

                    $todoListEl.append($todoListItemEl);
                }
            }

            this._applySortableBehaviour();
        },

        /**
         * @private
         */
        _applySortableBehaviour: function () {
            this._$el.find('.js-todo-list')
                .sortable({
                    handle:      '.js-todo-list-item-drag-handle',
                    connectWith: '.js-todo-list-connected-1',
                    placeholder: 'todo-list-item-placeholder',
                    revert:      true,
                    update:      $.proxy(this._onSortingDone, this)
                })
                .disableSelection();
        },

        /**
         * @private
         */
        _onSortingDone: function () {
            logger.log('Sorting done. Need to update: ' + this._day.getDate().format('L'), ['dayComponent']);

            this._persistOrderOfTodoListItems();
        },

        /**
         * @private
         */
        _persistOrderOfTodoListItems: function () {
            var $todoListItemInRightOrder = this._$el.find('.todo-list-item'),
                self = this;

            $todoListItemInRightOrder.each(function (index, el) {
                var $el = $(el);
                var uuid = $el.data('uuid');

                if (_.isString(uuid) === false) {
                    console.error('invalid uuid found on re-ordered todo list item');

                    return;
                }

                var todoListItem = todoListItemRepository.getOneByUUID(uuid);
                if ((todoListItem instanceof TodoListItem) === false) {
                    console.error('no todo list item found with uuid: ' + uuid);

                    return;
                }

                todoListItem.setRank(index);
                todoListItem.setDate(self._day.getDate());

                // make sure the 'repository.todo_list_item.persisted' event is not triggered
                // as that would render components to many times and results in double items..
                todoListItemRepository.update(todoListItem, false);
            });
        },

        /**
         * @returns {DayComponent}
         */
        setActive: function () {
            this._$el.addClass('is-active');

            return this;
        },

        /**
         * @returns {DayComponent}
         */
        setUnactive: function () {
            this._$el.removeClass('is-active');

            return this;
        },

        /**
         * @returns {DayComponent}
         */
        setSelected: function () {
            this._$el.addClass('is-selected');

            return this;
        },

        /**
         * @returns {DayComponent}
         */
        deselect: function () {
            this._$el.removeClass('is-selected');

            return this;
        },

        /**
         * @returns {Boolean}
         */
        isSelected: function () {
            return this._$el.hasClass('is-selected');
        },

        /**
         * @returns {*}
         */
        isActive: function () {
            return this._$el.hasClass('is-active');
        },

        /**
         * @returns {boolean}
         */
        isCurrent: function () {
            var today = moment();

            return today.format('L') === this._day.getDate().format('L');
        }
    });

    return DayComponent;
});
