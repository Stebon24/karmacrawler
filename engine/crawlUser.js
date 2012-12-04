/*

	Require modules

*/

var http = require('http')
,	url = require('url')
,	querystring = require('querystring');


//TODO: test to see if a user has privacy settings enabled. Activate
//appropriate urlTypes to match what is available to crawl.

var setUrlTypes = function(username, cb) {

	var urlTypes = [];

	urlTypes[0] = '/user/' + username + '/.json';
	urlTypes[1] = '/user/' + username + '/comments/.json';
	urlTypes[2] = '/user/' + username + '/submitted/.json';
	// urlTypes[3] = '/user/' + username + '/liked.json';
	// urlTypes[4] = '/user/' + username + '/disliked.json';
	// urlTypes[5] = '/user/' + username + '/hidden.json';
	// urlTypes[6] = '/user/' + username + '/saved.json';
	cb(urlTypes);

};

function RequestOptions(host, path){

	this.host = host;
	this.path = path;

}

/*

	Once the collector becomes activated by the startCollection function,
	it will call itself recursivly until all the reddit data has been collected for the
	specified username.

*/

var collector = function(path, currentCount, lastPost) {

		var options = new RequestOptions('www.reddit.com', path)
		,	userData = ''
		,	iteration = (currentCount) ? currentCount : 0;

		http.get(options, function(res) {
			
			res.setEncoding('utf8');
			
			res.on('error', function(e) {
				console.log(e);
			});
			
			res.on('data', function(data) {
				userData += data;
			});

			res.on('end', function() {
				userData = JSON.parse(userData);
				iteration += 25;

				if(userData.data.after) {
					var post = userData.data.after
					,	currentUrlObj = querystring.parse(options.path)
					,	currentPath = url.parse(options.path).pathname
					,	nextUrl = currentPath + '?count=' + iteration + '&after=' + post;
					
					console.log(nextUrl);
					
					//This halts the collector when it recieves a duplicate response
					if (currentUrlObj.after !== post) {
						collector(nextUrl, iteration, post);
						crawlTime = console.timeEnd('total crawl time');
						return;
					}
				}
			});
		});
	};

/*
	The startCollection function is launched when the proper urlTypes have been initialized by
	the setUrlTypes method.
*/

var startCollection = function(urlTypes) {

	urlTypes.forEach(function(element) {
		collector(element);
	});

};

/*
	This is the function that exposes the collector  to the rest of the app.
*/

module.exports = function(username) {

	console.time('total crawl time');
	setUrlTypes(username, startCollection);

};