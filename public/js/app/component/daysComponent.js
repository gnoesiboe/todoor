define([
    'moment',
    'underscore',
    'text!app/template/days.html',
    'app/component/dayComponent',
    'app/model/day',
    'app/service/UUIDGenerator',
    'app/repository/dayRepository',
    'app/service/logger',
    'app/view',
    'app/component/addTodoListItemComponent',
    'app/service/eventDispatcher'
], function (moment, underscore, daysTemplate, DayComponent, Day, UUIDGenerator, dayRepository, logger, BaseView, AddTodoListItemComponent, eventDispatcher) {

    /**
     * @param {jQuery} $el
     *
     * @constructor
     */
    var DaysComponent = function ($el) {

        /**
         * @type {jQuery}
         * @private
         */
        this._$el= null;

        /**
         * @type {Array}
         * @private
         */
        this._days = [];

        /**
         * @type {Object}
         * @private
         */
        this._addTodoListItemComponent = null;

        this._init.apply(this, arguments);
    };

    _.extend(DaysComponent.prototype, BaseView.prototype, {

        /**
         * @private
         */
        _init: function ($el) {
            this.setEl($el);

            logger.log('Init days component', ['days']);

            this._initDays();
            this._initAddTodolistItemComponent();

            eventDispatcher.register('keyboard.to_next', this._onKeyboardToNext, this);
            eventDispatcher.register('keyboard.to_previous', this._onKeyboardToPrevious, this);
            eventDispatcher.register('keyboard.add_todo_item', this._onKeyboardAddTodoListItem, this);
        },

        /**
         * @private
         */
        _onKeyboardAddTodoListItem: function () {
            this._eachDay(function (day) {
                if (day.isSelected() === true) {
                    day.triggerAddTodoListItemEvent();
                }
            });
        },

        /**
         * @param {Function} callback
         * @private
         */
        _eachDay: function (callback) {
            for (var i = 0, l = this._days.length; i < l; i++) {
                callback(this._days[i], i);
            }
        },

        /**
         * @private
         */
        _onKeyboardToNext: function () {
            for (var i = 0, l = this._days.length; i < l; i++) {
                if (this._days[i].isSelected() === true && typeof this._days[i + 1] !== 'undefined') {
                    this._days[i].deselect();
                    this._days[i + 1].setSelected();

                    break;
                }
            }
        },

        /**
         * @private
         */
        _onKeyboardToPrevious: function () {
            for (var i = (this._days.length - 1); i >= 0; i--) {
                if (this._days[i].isSelected() === true && typeof this._days[i - 1] !== 'undefined') {
                    this._days[i].deselect();
                    this._days[i - 1].setSelected();

                    break;
                }
            }
        },

        /**
         * @private
         */
        _initDays: function () {
            this._days = [];

            for (var i = -1, l = 4; i < l; i++) {
                this._days.push(this._initDay(i));
            }
        },

        /**
         * @param {Number} index
         *
         * @return {Object}
         *
         * @private
         */
        _initDay: function (index) {
            var date = this._offsetAfterToday(index);
            var day = dayRepository.getOneByDate(date);

            if (_.isObject(day) === false) {
                day = new Day(UUIDGenerator.generateUUID(), date, []);
                dayRepository.create(day);
            }

            //@todo move $el generation to DayComponent? Is this possible?
            var $el = $('<div class="col-md-6 days-day" id="js-day-' + day.getDate().format('l') + '"></div>');
            var component = new DayComponent($el, day);

            if (component.isCurrent() === true) {
                component
                    .setSelected()
                    .setActive();
            }

            return component;
        },

        /**
         * Initiates the modal that is used to add todo list items
         *
         * @private
         */
        _initAddTodolistItemComponent: function () {
            var $el = $('<div class="" id="js-add-todo-list-item-component"></div>');

            this._addTodoListItemComponent = new AddTodoListItemComponent($el);
        },

        /**
         * @param {Number} nrOfDaysAgo
         * @returns {Object}
         *
         * @private
         */
        _offsetAfterToday: function (nrOfDaysAgo) {
            return moment()
                .add(nrOfDaysAgo, 'days');
        },

        /**
         * @returns {jQuery}
         */
        render: function () {
            var template = _.template(daysTemplate);

            this._$el.append(template({

            }));

            for (var key in this._days) {
                if (this._days.hasOwnProperty(key)) {
                    this._$el.append(this._days[key].render());
                }
            }

            this._$el.append(this._addTodoListItemComponent.render());

            return this._$el;
        }
    });

    return DaysComponent;
});
