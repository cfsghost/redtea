var RedTea = require('../');

var app = new RedTea;

app.routeDirs.push(__dirname + '/routes');
app.uiDirs.push(__dirname + '/ui');
app.runnerDirs.push(__dirname + '/runner');
app.apiDirs.push(__dirname + '/apis');

var publicData = {
	users: [],
	conversation: []
};

app
	.initRoute()
	.initRender()
	.initAPI(publicData)
	.listen(9876);
