var RedTea = require('../');

var app = new RedTea;

app.routeDirs = [
	__dirname + '/routes'
];

app.uiDirs = [
	__dirname + '/ui'
];

app.runnerDirs = [
	__dirname + '/runner'
];

app.apiDirs = [
	__dirname + '/apis'
];

var publicData = {
	users: [],
	conversation: []
};

app
	.initRoute()
	.initRender()
	.initAPI(publicData)
	.listen(9876);
