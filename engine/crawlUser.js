var http = require('http');
var options = {
	host: 'www.reddit.com',
	path: ''
};

module.exports = function(username) {

	console.log(username);

	options.path = '/user/' + username + '.json';

	var userData = '';
	
	http.get(options, function(res) {

		res.setEncoding('utf8');

		res.on('data', function(data) {
			userData += data;
			console.log(userData);
		});

		res.on('end', function() {
			userData = JSON.parse(userData);
			console.log(userData);
		});
	});
};

