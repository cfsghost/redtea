var fs = require('fs');
var path = require('path');

var APIWrapper = module.exports = function() {
	this.apiDirs = [];
	this.apiTable = {};
	this.apiInstance = {};
	this.apiIntrospection = {};
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

APIWrapper.prototype.getMember = function(ifPath) {

	var member = null;

	if (this.apiInstance.hasOwnProperty(ifPath[0])) {

		for (var index in ifPath) {
			var memberName = ifPath[index];

			if (index == 0)
				member = this.apiInstance[memberName];
			else if (member.hasOwnProperty(memberName))
				member = member[memberName];
		}
	}

	return member;
};

APIWrapper.prototype.handler = function(app, req, res) {
	console.log(req.pathname);

	if (req.pathname == '/apis') {
		/* Export APIs */
		if (req.query.hasOwnProperty('introspect')) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify(this.apiIntrospection));
			return;
		}

		res.writeHead(200, {'Content-Type': 'application/x-javascript'});
		res.end(this.apiCaller);
		return;
	}

	/* Call Methods */
	var ifPath = req.pathname.substr(6).split('/');
	var member = this.getMember(ifPath);
	if (member instanceof Function)
		member();
};

APIWrapper.prototype.loadFile = function(filename) {
	var apis = require(filename);

	for (var apiName in apis) {
		this.loadAPI(apiName, apis[apiName]);
	}
};

APIWrapper.prototype.loadAPI = function(apiName, apiDefine) {
	this.apiTable[apiName] = apiDefine;

	if (apiDefine instanceof Function) {
		var instance = new apiDefine;

		this.apiInstance[apiName] = instance;
		this.apiIntrospection[apiName] = {
			t: 'f',
			s: this.introspect(instance)
		};
	} else if (apiDefine instanceof Array) {
		var instance = apiDefine;
		this.apiInstance[apiName] = instance;
		this.apiIntrospection[apiName] = {
			t: 'a',
			s: this.introspect(instance)
		};
	} else if (apiDefine instanceof Object) {
		var instance = apiDefine;
		this.apiInstance[apiName] = instance;
		this.apiIntrospection[apiName] = {
			t: 'o',
			s: this.introspect(instance)
		};
	} else {
		var instance = apiDefine;
		this.apiInstance[apiName] = instance;
		this.apiIntrospection[apiName] = {
			t: 'v'
		};
	}
};

APIWrapper.prototype.introspect = function(serverSource) {
	var structure = {};

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
