require.config({
    shim: {
        bootstrap:              {
            'deps': ['jquery']
        },
        'bootstrapValidator':   {
            'deps': ['bootstrap']
        },
        'bootstrapValidatorNL': {
            'deps': ['bootstrapValidator']
        },
        'jquery-ui': {
            'deps': ['jquery']
        }
    },

    paths: {
        'jquery':               '../bower_components/jquery/dist/jquery.min',
        'bootstrap':            '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap',
        'moment':               '../bower_components/moment/min/moment-with-locales.min',
        'underscore':           '../bower_components/underscore/underscore-min',
        'text':                 '../bower_components/requirejs-text/text',
        'store':                '../bower_components/store/dist/store2.min',
        'bootstrapValidator':   '../bower_components/bootstrapvalidator/dist/js/bootstrapValidator',
        'bootstrapValidatorNL': '../bower_components/bootstrapvalidator/dist/js/language/nl_NL',
        'mousetrap':            '../bower_components/mousetrap/mousetrap.min',
        "jquery-ui":            '../bower_components/jqueryui/jquery-ui.min'
    },

    config: {
        moment: {
            noGlobal: true
        }
    }
});

require(['app/app'], function (app) {
    'use strict';

    app.init();
});
