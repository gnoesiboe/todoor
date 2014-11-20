define([
    'underscore'
], function (_) {
    return {

        /**
         *
         * @param {Array} arrayWithObjects
         * @param {String} keyField
         * @param {String} valueField
         *
         * @returns {Object}
         */
        toKeyValueObject: function (arrayWithObjects, keyField, valueField) {
            return _.object(
                arrayWithObjects.map(function(item) {
                    return [item[keyField], item[valueField]];
                })
            );
        },

        /**
         * @param {Object} values
         * @param {Object} defaults
         *
         * @return {Object}
         */
        normalize: function (values, defaults) {
            var out = {};

            for (var key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    out[key] = typeof values[key] !== 'undefined' ? values[key] : defaults[key];
                }
            }

            return out;
        }
    };
});
