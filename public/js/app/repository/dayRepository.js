define([
    'store',
    'app/model/day',
    'app/repository/todoListItemRepository',
    'moment',
    'app/service/eventDispatcher'
], function (store, Day, todoListItemRepository, moment, eventDispatcher) {

    /**
     * @param {Object} date
     *
     * @returns {String}
     */
    var generateDateKey = function (date) {
        return date.format('YYYY-MM-DD');
    };

    return {

        /**
         * @param {Object} date
         *
         * @returns {Object}
         */
        getOneByDate: function (date) {
            var key = generateDateKey(date);

            if (store.has(key) === true) {
                return this._toModel(store.get(key));
            }

            return null;
        },

        /**
         * @param {Object} data
         *
         * @returns {Object}
         */
        _toModel: function (data) {
            return new Day(data.uuid, moment(data.date));
        },

        /**
         * @param {Object} day
         *
         * @returns {Object}
         */
        create: function (day) {
            var key = generateDateKey(day.getDate());

            store.set(key, day.extractData());

            eventDispatcher.trigger('repository.day.persisted', {
                day: day
            });

            return this;
        }
    }
});
