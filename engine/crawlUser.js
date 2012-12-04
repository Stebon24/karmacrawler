var http = require('http')
,	url = require('url')
,	querystring = require('querystring');

var urlTypes = [];

var setUrlTypes = function(username, cb) {

	urlTypes[0] = '/user/' + username + '/.json';
	urlTypes[1] = '/user/' + username + '/comments/.json';
	urlTypes[2] = '/user/' + username + '/submitted/.json';
	// urlTypes[3] = '/user/' + username + '/liked.json';
	// urlTypes[4] = '/user/' + username + '/disliked.json';
	// urlTypes[5] = '/user/' + username + '/hidden.json';
	// urlTypes[6] = '/user/' + username + '/saved.json';
	cb();

};

function RequestOptions(host, path){

	this.host = host;
	this.path = path;

}

var collector = function(path, currentCount, lastPost) {

		var options = new RequestOptions('www.reddit.com', path);
		var userData = '';
		var iteration = (currentCount) ? currentCount : 0;

		http.get(options, function(res) {
			res.setEncoding('utf8');
			
			res.on('data', function(data) {
				userData += data;
			});

			res.on('end', function() {
				userData = JSON.parse(userData);
				iteration += 25;

				if(userData.data.after) {
					var post = userData.data.after;
					var currentUrlObj = querystring.parse(options.path);
					var currentPath = url.parse(options.path).pathname;
					var nextUrl = currentPath + '?count=' + iteration + '&after=' + post;
					console.log(nextUrl);
			
					if (currentUrlObj.after !== post) {
						collector(nextUrl, iteration, post);
						crawlTime = console.timeEnd('total crawl time');
						return;
					}
				}
			});

			res.on('error', function(e) {
				console.log(e);
			});
		});
	};

var startCollection = function() {

	urlTypes.forEach(function(element, index) {
		collector(element);
	});

};

module.exports = function(username) {

	console.time('total crawl time');
	setUrlTypes(username, startCollection);

};