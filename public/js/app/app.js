define([
    'jquery',
    'app/component/daysComponent',
    'app/service/logger',
    'app/service/keyboardListener',
    'app/component/listsComponent',
    'bootstrap'
], function ($, DaysComponent, logger, keyboardListener, ListsComponent) {

    /**
     * @type {Object}
     * @private
     */
    var _daysComponent = null;

    /**
     * @type {Object}
     * @private
     */
    var _listsComponent = null;

    /**
     * @type {jQuery}
     * @private
     */
    var _$containerEl = null;

    /**
     * @private
     */
    var _initContainerEl = function () {
        var $el = $('#js-app-container');

        if ($el.length === 0) {
            throw new Error('No app container found');
        }

        _$containerEl = $el;
    };

    /**
     * @private
     */
    var _initDaysComponent = function () {
        var $el = $('<div class="row days" id="js-days-component"></div>');

        _daysComponent = new DaysComponent($el);

        _$containerEl.append(_daysComponent.render());
    };

    var _initListsComponent = function () {
        var $el = $('<div class="row lists" id="js-lists-component"></div>')

        _listsComponent = new ListsComponent($el);

        _$containerEl.append(_listsComponent.render());
    };

    return {

        /**
         * Initiates this app
         */
        init: function () {
            logger.log('App initiated', [ 'app' ]);

            _initContainerEl();
            _initDaysComponent();
            _initListsComponent();

            keyboardListener.init();
        }
    }
});
