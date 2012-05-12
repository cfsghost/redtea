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

app
	.initRoute()
	.initRender()
	.initAPI()
	.listen(9876);
//app.initRoute(__dirname + '/routes').listen(9876);
