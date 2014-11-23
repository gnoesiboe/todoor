define([
    'app/model/todoListItem',
    'store',
    'app/service/eventDispatcher',
    'moment',
    'underscore',
    'app/collection',
    'app/service/logger'
], function (TodoListItem, store, eventDispatcher, moment, _, Collection, logger) {

    /**
     * @type {string}
     */
    var NAMESPACE = 'todo_list_items';

    /**
     * @private
     */
    var _createNamespace = function () {
        store.set(NAMESPACE, []);
    };

    return {

        /**
         * @returns {Object}
         */
        getAll: function () {
            if (store.has(NAMESPACE) === false) {
                _createNamespace();
            }

            return this._toCollection(store.get(NAMESPACE));
        },

        /**
         * @param {String} uuid
         *
         * @return {Object|Null}
         */
        getOneByUUID: function (uuid) {
            var all = this.getAll();

            var results = all.filter(function (todoListItem) {
                return todoListItem.hasUUID(uuid);
            });

            if (results.length() > 0) {
                return results.first();
            }

            return null;
        },

        /**
         * @param {Object} data
         *
         * @returns {Object}
         */
        _toModel: function (data) {
            var model = new TodoListItem(data.uuid, data.title, moment(data.date), data.rank);
            model.setChecked(data.checked);

            return model;
        },

        /**
         * @param {Array} rawItems
         *
         * @returns {Object}
         * @private
         */
        _toCollection: function (rawItems) {
            var collectionData = [];

            for (var i = 0, l = rawItems.length; i < l; i++) {
                collectionData.push(this._toModel(rawItems[i]));
            }

            return new Collection(collectionData);
        },

        /**
         * @param {Object} date
         * @returns {Array}
         */
        getAllForDate: function (date) {
            var allItems = this.getAll();

            return allItems.filter(function (todoListItem) {
                return todoListItem.hasDate(date) === true;
            });
        },

        /**
         * @param {Object} supposedModel
         * @private
         */
        _validateIsModel: function (supposedModel) {
            if ((supposedModel instanceof TodoListItem) === false) {
                throw new Error('Model should be an instance of TodoListItem model');
            }
        },

        /**
         * @param {Object} todoListItem
         *
         * @returns {boolean}
         */
        remove: function (todoListItem) {
            var uuid = todoListItem.getUUID(),
                currentData = this.getAll().extractData();

            var foundAtIndex = this._getIndexForUUID(uuid);

            if (foundAtIndex === null) {
                return false;
            }

            currentData.splice(foundAtIndex, 1);

            store.set(NAMESPACE, currentData);

            eventDispatcher.trigger('repository.todo_list_item.removed', {
                uuid: uuid,
                date: todoListItem.getDate().format('YYYY-MM-DD')
            });

            return true;
        },

        /**
         * @param {String} uuid
         *
         * @returns {Number|Null}
         *
         * @private
         */
        _getIndexForUUID: function (uuid) {
            var currentData = this.getAll().extractData(),
                foundAtIndex = null;

            for (var i = 0, l = currentData.length; i < l; i++) {
                if (currentData[i].uuid === uuid) {
                    foundAtIndex = i;
                    break;
                }
            }

            return foundAtIndex;
        },

        /**
         * @param {Object} todoListItem
         * @param {Boolean} triggerEvent
         *
         * @returns {Object}
         */
        update: function (todoListItem, triggerEvent) {
            var uuid = todoListItem.getUUID();

            triggerEvent = _.isBoolean(triggerEvent) ? triggerEvent : true;

            var currentData = this.getAll().extractData(),
                foundAtIndex = this._getIndexForUUID(uuid);

            if (foundAtIndex === null) {
                return this.create(todoListItem);
            }

            currentData[foundAtIndex] = todoListItem.extractData();

            store.set(NAMESPACE, currentData);

            if (triggerEvent === true) {
                eventDispatcher.trigger('repository.todo_list_item.persisted', {
                    uuid: uuid,
                    date: todoListItem.getDate().format('YYYY-MM-DD')
                });
            }

            return this;
        },

        /**
         * @param {Object} todoListItem
         *
         * @returns {Object}
         */
        create: function (todoListItem) {
            this._validateIsModel(todoListItem);

            var uuid = todoListItem.getUUID();

            var items = this.getAll();
            items.add(todoListItem);

            store.set(NAMESPACE, items.extractData());

            eventDispatcher.trigger('repository.todo_list_item.persisted', {
                uuid: uuid,
                date: todoListItem.getDate().format('YYYY-MM-DD')
            });

            return this;
        }
    }
});
