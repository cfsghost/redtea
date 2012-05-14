var fs = require('fs');
var path = require('path');

var APIWrapper = module.exports = function() {
	this.apiDirs = [];
	this.apiTable = {};
	this.apiInstance = {};
	this.apiIntrospection = {};
	this.apiCaller = null;
	this.userdata = null;

	/* Prepare client-side toolkit */
	var clientToolkitDir = __dirname + '/client';
	var clientToolkits = [];

	/* Scan directories */
	var files = fs.readdirSync(clientToolkitDir);

	/* Load files */
	for (var index in files) {
		var filePath = path.join(clientToolkitDir, files[index]);

		clientToolkits.push(fs.readFileSync(filePath, 'utf8'));
	}

	this.apiCaller = clientToolkits.join('');
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

	var lastMember = null;
	var member = null;

	if (this.apiInstance.hasOwnProperty(ifPath[0])) {
		var memberName = ifPath[0];
		member = this.apiInstance[memberName];

		for (var index in ifPath) {
			if (!index)
				continue;

			lastMember = member;
			memberName = ifPath[index];
			if (memberName in member) {
				member = member[memberName];
			}
		}
	}

	return {
		base: lastMember,
		member: member
	};
};

APIWrapper.prototype.handler = function(app, req, res) {

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

	var ifPath = req.pathname.substr(6).split('/');
	var memberObj = this.getMember(ifPath);

	/* It is method */
	if (memberObj.member instanceof Function) {
		var base = (memberObj.base) ? memberObj.base : global;

		/* Input data */
		var inp = JSON.parse(req.body['in']);

		/* prepare call back function */
		inp.push(function(err, data) {
			if (err) {
				res.writeHead(404, {'Content-Type': 'text/plain'});
				res.end('False');
				return;
			}

			if (data instanceof Object) {
				res.writeHead(200, {'Content-Type': 'application/x-javascript'});
				res.end(JSON.stringify(data));
			} else {
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(data);
			}
		});

		/* Call method */
		memberObj.member.apply(base, inp);
	}

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
		//var instance = new apiDefine(this.userdata);
//		console.log(this.userdata);
		var instance = new apiDefine(this.userdata);

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
