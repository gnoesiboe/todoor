define([
    'mousetrap',
    'app/service/eventDispatcher'
], function (mousetrap, eventDispatcher) {

    /**
     * @private
     */
    var _initEventListeners = function () {
        mousetrap.bind(['left', 'j'], _onKeyToPrevious);
        mousetrap.bind(['right', 'k'], _onKeyToNext);
        mousetrap.bind(['up'], _onKeyToAbove);
        mousetrap.bind(['down'], _onKeyToBelow);
        mousetrap.bind('escape', _onKeyEscape);
        mousetrap.bind(['n', 'c'], _onKeyAddTodoItem);
    };

    /**
     * @private
     */
    var _onKeyAddTodoItem = function () {
        eventDispatcher.trigger('keyboard.add_todo_item', {});
    };

    /**
     * @private
     */
    var _onKeyEscape = function () {
        eventDispatcher.trigger('keyboard.escape', {});
    };

    /**
     * @private
     */
    var _onKeyToBelow = function () {
        eventDispatcher.trigger('keyboard.to_below', {});
    };

    /**
     * @private
     */
    var _onKeyToAbove = function () {
        eventDispatcher.trigger('keyboard.to_above', {});
    };

    /**
     * @private
     */
    var _onKeyToPrevious = function () {
        eventDispatcher.trigger('keyboard.to_previous', {});
    };

    /**
     * @private
     */
    var _onKeyToNext = function () {
        eventDispatcher.trigger('keyboard.to_next', {});
    };

    // return public interface
    return {

        /**
         * Initiates this servie
         */
        init: function () {
            _initEventListeners();
        }
    };
});
