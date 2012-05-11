var RedTea = require('../');

var app = new RedTea;

app.routeDirs = [
	__dirname + '/routes'
];

app.uiDirs = [
	__dirname + '/ui'
];

app.initRoute().initUI().listen(9876);
//app.initRoute(__dirname + '/routes').listen(9876);
