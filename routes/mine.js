var http = require('http'),
	jsdom = require('jsdom'),
	url = require('url'),
	fs = require('fs');

var l = console.log;
var options = {
	host: 'www.reddit.com',
	path: ''
};

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var setNextPage = function(pageUrl) {
	options.path = url.parse(pageUrl).path;
	ee.emit('pathSet');
	};

var compiler = function(userData) {
	 l(userData);
};

var mineUser = function() {
		http.get(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(data){
				parsers(data, compiler);
			});
		});
	};

exports.miner = function(req, res){
		var username = req.params.username;
		options.path = '/user/' + username;
		mineUser();
		res.end();
};

var userData = {
	subreddits : {}
};

parsers = function(rawHtml, cb){
	
	jsdom.env(
		rawHtml
		,["http://code.jquery.com/jquery.js"]
		,function(errors, window) {
			if(errors){return;}
			var $ = window.$;
			
			var	nextPageUrl = $('a[rel="nofollow next"]').attr("href");
				if (nextPageUrl) {
					setNextPage(nextPageUrl);
				}

			var subreddits = $('.subreddit')
				.each(function() {
					var subreddit = $(this).text();
					if (!userData.subreddits.hasOwnProperty(subreddit)) {
						userData.subreddits[subreddit] = 1;
						// l('hello');
						return;
					}
					if (userData.subreddits.hasOwnProperty(subreddit)){
						userData.subreddits[subreddit]++;
						// l('bat');
						console.log(userData);
						return;
					}
					// cb(subreddit);
				});
			
			var author = $('.author')
				.each(function(i) {
					var user = $(this).text();
					if(user) {
					return;
					}
				console.log(user);
				});
		});
};


ee.on('pathSet', mineUser);