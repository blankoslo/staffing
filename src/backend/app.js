var express = require('express');

var app = express();

app.use(require('common').herokuHttpsRedirect);

app.use('/api', require('./api.js'));
app.use('/static', express.static('../frontend/dist'));

var server = app.listen(process.env.PORT || 3004, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
