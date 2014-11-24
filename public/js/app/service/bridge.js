define([
    'socket-io',
    'app/service/logger',
    'app/repository/todoListItemRepository'
], function (socketIO, logger, todoListItemRepository) {

    /**
     * @type {Object}
     * @private
     */
    var _client = null;

    /**
     * @private
     */
    var _initClient = function () {
        _client = socketIO('localhost:3000');
    };

    return {

        /**
         * Initiates this frontend to backend bridge
         */
        init: function () {
            logger.log('Init socket.io', ['bridge']);

            _initClient();
        },

        /**
         * Synchronises the frontend todolist items with the backend
         */
        synchroniseTodoListItems: function () {
            logger.log('Synchronise todos with backend', ['bridge']);

            var todoListItems = todoListItemRepository.getAll().extractData();

            _client.emit('todo_list_items_synchronise', todoListItems);
        }
    };
});
