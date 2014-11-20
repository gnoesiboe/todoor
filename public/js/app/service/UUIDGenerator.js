define([], function () {

    /**
     * @returns {string}
     */
    var generateS4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };

    return {

        /**
         * @returns {string}
         */
        generateUUID: function () {
            return generateS4() + generateS4() + '-' + generateS4() + '-' + generateS4() + '-' +
            generateS4() + '-' + generateS4() + generateS4() + generateS4();
        }
    }
});
