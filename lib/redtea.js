var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var Render = require('./render');

var RedTea = module.exports = function() {
	var self = this;

	function _handler(req, res) {
		var pathname = url.parse(req.url).pathname;

		/* Middleware */
		self.render.override(req, res);

		/* Return client-side APIs */
		if (pathname == '/apis') {
		}

		/* Find path */
		if (self.routes.hasOwnProperty(pathname)) {
			res.writeHead(200, {'Content-Type': 'text/html'});

			self.routes[pathname](self, req, res);
		}
	};

	this.httpServer = http.createServer(_handler);
	this.routeDirs = [];
	this.routes = {};
	this.render = null;
	this.uiDirs = [];
};

RedTea.prototype.listen = function(port) {
	this.httpServer.listen(port);

	return this;
};

RedTea.prototype.initRoute = function() {

	if (this.routeDirs.length == 0)
		throw Error('No routes');

	/* Scan directories */
	for (var i in this.routeDirs) {
		var files = fs.readdirSync(this.routeDirs[i]);

		/* Load route files */
		for (var index in files) {
			var routeTable = require(path.join(this.routeDirs[i], files[index]));

			/* Append route path */
			for (var routePath in routeTable) {
				/* TODO: Need to check whether does this path exists or not. */
				this.routes[routePath] = routeTable[routePath];
			}
		}
	}

	return this;
};

RedTea.prototype.initRender = function() {

	this.render = new Render;
	this.render.ui.uiDirs = this.uiDirs;
	this.render.init();

	return this;
};
