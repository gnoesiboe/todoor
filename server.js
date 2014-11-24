var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connection = require('express-myconnection');
var mysql = require('mysql');

/*
 * App settings
 */

app.set('port', 3000);

/*
 * App listeners
 */

io.on('connection', function (socket) {
    console.log('>> a client connected');

    var dbConnectionPool = mysql.createPool({
        host:     'localhost',
        user:     'root',
        password: 'nopassword'
    });

    socket.on('todo_list_items_synchronise', function (data) {
        dbConnectionPool.getConnection(function (err, connection) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }

            console.log('connected to mysql database with id: ' + connection.threadId);

            var onResponseReceived = function (err) {
                if (err) {
                    console.error('error executing query: ' + err.stack);
                }
            };

            connection.query('USE todoor;');
            connection.query('TRUNCATE todo_list_item;');

            for (var i = 0, l = data.length; i < l; i++) {
                var insertData = {
                    uuid:    data[i].uuid,
                    title:   data[i].title,
                    date:    data[i].date,
                    checked: data[i].checked === true ? 1 : 0
                };

                connection.query('INSERT INTO todo_list_item SET ?', insertData, onResponseReceived);
            }

            console.log('todo list items synchronised');

            connection.release();
        });
    });

    socket.on('disconnect', function () {
        console.log('<< a client disconnected');
    });
});

http.listen(app.get('port'), function () {
    console.log('listening on *:3000');
});
