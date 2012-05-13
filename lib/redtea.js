var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

var Render = require('./render');
var APIWrapper = require('./apiwrapper');

var RedTea = module.exports = function() {
	var self = this;

	function _handler(req, res) {
		urlObj = url.parse(req.url);
		var pathname = urlObj.pathname;

		/* Query string */
		req.query = querystring.parse(urlObj.query);
		req.pathname = pathname;

		/* Middleware */
		self.render.override(req, res);

		/* Return client-side APIs */
		if (pathname.substr(0, 5) == '/apis') {
			self.apiWrapper.handler(self, req, res);
			return;
		}

		/* Find path */
		if (self.routes.hasOwnProperty(pathname)) {
			res.writeHead(200, {'Content-Type': 'text/html'});

			self.routes[pathname](self, req, res);
			return;
		}

		/* Not Found */
		res.writeHeader(404, {'Content-type': 'text/plain'});
		res.write('Error 404: Not Found');
		res.end();
	};

	this.httpServer = http.createServer(_handler);
	this.routeDirs = [];
	this.routes = {};
	this.render = null;
	this.uiDirs = [];
	this.runnerDirs = [];

	/* API Wrapper */
	this.apiWrapper = null;
	this.apiDirs = [];
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
	this.render.runner.runnerDirs = this.runnerDirs;
	this.render.init();

	return this;
};

RedTea.prototype.initAPI = function() {

	this.apiWrapper = new APIWrapper;
	this.apiWrapper.apiDirs = this.apiDirs;
	this.apiWrapper.init();

	return this;
};
