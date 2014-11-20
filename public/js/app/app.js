define([
    'jquery',
    'app/component/daysComponent',
    'app/service/logger',
    'app/service/keyboardListener',
    'bootstrap'
], function ($, DaysComponent, logger, keyboardListener) {

    /**
     * @type {jQuery}
     * @private
     */
    var _daysComponent = null;

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

        var content = _daysComponent
            .render();

        _$containerEl.html(content);
    };

    return {

        /**
         * Initiates this app
         */
        init: function () {
            logger.log('App initiated', [ 'app' ]);

            _initContainerEl();
            _initDaysComponent();

            keyboardListener.init();
        }
    }
});
