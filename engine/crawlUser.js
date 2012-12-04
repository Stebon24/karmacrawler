var urlTypes = [];
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var crawlTime = '';

function RequestOptions(host, path){
	this.host = host;
	this.path = path;
}

function setUrlTypes(username, cb) {

	urlTypes[0] = '/user/' + username + '/.json';
	urlTypes[1] = '/user/' + username + '/comments/.json';
	urlTypes[2] = '/user/' + username + '/submitted/.json';
	// urlTypes[3] = '/user/' + username + '/liked.json';
	// urlTypes[4] = '/user/' + username + '/disliked.json';
	// urlTypes[5] = '/user/' + username + '/hidden.json';
	// urlTypes[6] = '/user/' + username + '/saved.json';
	cb();

}

var collector = function(path, currentCount, lastPost) {

		var options = new RequestOptions('www.reddit.com', path);
		var userData = '';
		var iteration = 0;

		if(currentCount) {
			iteration = currentCount;
		}


		http.get(options, function(res) {
			// console.log('request sent to ' + options.path + '\n');
			res.setEncoding('utf8');
			res.on('data', function(data) {
				userData += data;
				// console.log(data);
			});

			res.on('end', function() {
				// console.log('response ended');
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

function startCollection() {
	urlTypes.forEach(function(element, index) {
		// console.log(element);
		collector(element);
	});
}

module.exports = function(username) {

	console.time('total crawl time');
	setUrlTypes(username, startCollection);

};