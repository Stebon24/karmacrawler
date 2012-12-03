module.exports = function(app){

	app.get('/user/:username', function(req, res){
			var crawlUser = require('../engine/crawlUser');
			var username = req.params.username;
			crawlUser(username);
			res.end();
	});

};