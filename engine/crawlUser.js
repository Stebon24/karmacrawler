var http = require('http');
var l = console.log;
var options = {
	host: 'www.reddit.com',
	path: ''
};

module.exports = function (username) {
		l(username);
		options.path = '/user/' + username + '.json';
		http.get(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(data){
				var userData = JSON.parse(data);
				console.log(userData);
			});
		}).end();
	};