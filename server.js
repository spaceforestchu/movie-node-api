var app = require('./app');
var debug = require('debug')('node-auth-ejs:server');
var port = process.env.PORT || '3000';
var http = require('http');

app.set('port', port);

var server = http.createServer(app);

server.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Server is now running on port 3000')
});

server.listen(port);
