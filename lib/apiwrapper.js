var fs = require('fs');
var path = require('path');

var APIWrapper = module.exports = function() {
	this.apiDirs = [];
	this.apiTable = {};
	this.apiCaller = fs.readFileSync(__dirname + '/client/browser.js', 'utf8');
};

APIWrapper.prototype.init = function() {

	if (this.apiDirs.length == 0) {
		return;
	}

	/* Scan directories */
	for (var i in this.apiDirs) {
		var files = fs.readdirSync(this.apiDirs[i]);

		/* Load APIWrapper files */
		for (var index in files) {
			var apiPath = path.join(this.apiDirs[i], files[index]);

			this.loadFile(apiPath);
		}
	}

};

APIWrapper.prototype.handler = function(app, req, res) {

	/* Export APIs */
	if (req.query.hasOwnProperty('introspect')) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(this.apiTable));
		return;
	}

	res.writeHead(200, {'Content-Type': 'application/x-javascript'});
	res.end(this.apiCaller);
};

APIWrapper.prototype.loadFile = function(filename) {
	var apis = require(filename);

	for (var apiName in apis) {
		this.loadAPI(apiName, apis[apiName]);
	}
};

APIWrapper.prototype.loadAPI = function(apiName, apiDefine) {

	this.apiTable[apiName] = {
		source: apiDefine,
		introspection: this.introspect(apiDefine)
	};
};

APIWrapper.prototype.introspect = function(serverSource) {
	var structure = {};

	/* Prototype member */
	if (serverSource.hasOwnProperty('prototype')) {
		for (var propName in serverSource.prototype) {
			var obj = serverSource[propName];

			structure[propName] = APIWrapper._introspect(this, obj);
		}
	}

	/* Normal members */
	for (var propName in serverSource) {
		var obj = serverSource[propName];

		structure[propName] = APIWrapper._introspect(this, obj);
	}

	return structure;
};

APIWrapper._introspect = function(self, obj) {
	var structure;

	if (obj instanceof Function) {
		/* Method */
		structure = {
			t: 'f',
			s: self.introspect(obj)
		};
	} else if (obj instanceof Array) {
		/* Array */
		structure = {
			t: 'a',
			s: self.introspect(obj)
		};
	} else if (obj instanceof Object) {
		/* Object */
		structure = {
			t: 'o',
			s: self.introspect(obj)
		};
	} else {
		/* Variable */
		structure = {
			t: 'v'
		};
	}

	return structure;
};
