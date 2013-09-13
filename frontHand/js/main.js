requirejs.config({

    baseUrl: 'js',

    paths: {
        jquery              : 'lib/jquery',
        jqueryui            : 'lib/jqueryui',
        socket            : 'lib/socket',
        loginModul          : 'moduls/login/loginModul',
        loginModulView      : 'moduls/login/loginModulView',
        joinModul           : 'moduls/join/joinModul',
        joinModulView       : 'moduls/join/joinModulView',
        stageModul          : 'moduls/stage/stageModul',
        stageModulView      : 'moduls/stage/stageModulView',
        stageUsersView      : 'moduls/stage/stageUsersView',
        msg                 : 'moduls/msg/msg',
        rooms               : 'moduls/rooms/rooms',
        watchRoom           : 'moduls/watchRoom/watchRoom',
        watchMyRoom         : 'moduls/watchRoom/watchMyRoom',
        dialog              : 'moduls/dialog/dialog',
        actionItemsCollection: 'moduls/actionItemsCollection/actionItemsCollection',
        initMenuModulView   : 'moduls/initMenu/initMenuModulView',
        router              : 'moduls/router',
        utils               : 'moduls/utils',
        setSocket           : 'moduls/setSocket',
        db                  : 'moduls/db',
        events              : 'moduls/events',
        cookie              : 'lib/cookie',
        backbone            : 'lib/backbone',
        underscore          : 'lib/underscore',
        mustache            : 'lib/mustache',
        text                : 'lib/text',
        bootstrap           : 'lib/bootstrap/js/bootstrap.min'
    },

    map: {
        '*': {
            'css': 'lib/css' // or whatever the path to require-css is
        }
    },

    shim : {

        'cookie' : {
            deps: ['jquery'],
            exports: 'cookie'
        },

        'backbone' : {
            deps: ['underscore'],
            exports: 'Backbone'
        },

        'underscore' : {
            exports: '_'
        },

        'mustache' : {
            exports: 'Mustache'
        }


    }
});

requirejs(['jquery', 'loginModul', 'setSocket', 'css!main.css', 'css!lib/bootstrap/css/bootstrap.min.css', 'router', 'bootstrap'], function   ($, loginModul) {




});
  

//   var socket = io.connect('http://localhost:1337');


//   socket.on('dbChanged', function (data) {
//     console.log('000000000000000000000000000000000000', data);
//     // socket.emit('my other event', { my: 'data' });
//   });

//   // socket.emit('my other event', { my: 'data' });

// });