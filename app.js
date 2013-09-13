var http = require('http');
var sys  = require('sys');

http.createServer(function(req, res){

	sys.puts(sys.inspect(req.url));

	var reqArr = req.url.split('/');

	var action = {
		cmd: reqArr[1],
		collection: reqArr[2],
		args: reqArr[3]
	}

	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('cmd: ' + action.cmd + ' col: ' + action.collection + ' args: ' + action.args);
}).listen(1337, '127.0.0.1');

console.log('server running at http://127.0.0.1:1337');