function _RedTea() {
	var self = this;

	this.commanderID = null;
	this.commandBuffer = [];

	this.API = new function() {
		this.interfacePath = '';
	};
	this.taskNum = 0;

	this.main = function(entryFunc) {
		/* Wait for tasks */
		if (self.taskNum) {
			setTimeout(function() {
				self.main(entryFunc)
			}, 0);

			return;
		}

		entryFunc();
	};
}

/* Commander */
_RedTea.prototype.execute = function(interfacePath) {
	var self = this;

	if (this.commanderID != null) {
		clearTimeout(this.commanderID);
		this.commanderID = null;
	}

	/* Add command to buffer */
	this.commandBuffer.push({
		interfacePath: interfacePath
	});
	this.commanderID = setTimeout(function() {

		/* Prepare and combine commands to send to server once */
		for (var index in self) {
		}
	}, 100);
};

/* Internal methods */
_RedTea._internal = {};
_RedTea._internal.makeRequest = function(method, url, params, callback) {
	var http_request = false;

	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request = new XMLHttpRequest();

	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		return false;
	}

	http_request.onreadystatechange = function() { 
		if (http_request.readyState == 4) {
			if (http_request.status == 200) {
				callback(null, http_request.responseText);
			} else {
				console.log('There was a problem with the request.');
			}
		}
	};

	var bodyStr = null;
	if (method == 'POST' || params != null) {
		/* Prepare body */
		var body = [];
		for (var key in params) {
			if (body.length > 0)
				body.push('&');

			body.push(encodeURIComponent(key));
			body.push('=');
			body.push(encodeURIComponent(params[key]));
		}
		bodyStr = body.join('');
	}

	http_request.open(method, url, true);
	if (method == 'POST' || params != null) {
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//http_request.setRequestHeader("Content-length", bodyStr.length);
		//http_request.setRequestHeader("Connection", "close");
	}

	http_request.send(bodyStr);
};


_RedTea._internal.get = function(url, callback) {

	return _RedTea._internal.makeRequest('GET', url, null, callback);
};

_RedTea._internal.post = function(url, params, callback) {

	return _RedTea._internal.makeRequest('POST', url, params, callback);
};

/* Public methods */
_RedTea.prototype._compileNode = function(rootObj, objName, obj) {
	var interfacePath = rootObj.interfacePath + '/' + objName;

	switch(obj.t) {
	case 'f':
		/* Function */
		var object = function _object() {

			/* Call this function directly rather than create a instance */
			if (!_object.prototype.isPrototypeOf(this)) {
				var lastParam = arguments[arguments.length - 1];
				var callback = (lastParam instanceof Function) ? lastParam : null;

				/* Prepare input data */
				var inp = Array.prototype.slice.call(arguments);
				if (callback)
					inp.length--;

				/* TODO: Connect to server */
				_RedTea._internal.post('/apis' + interfacePath, { 'in': JSON.stringify(inp) }, function(err, data) {
					if (callback) {
						var dataObj;

						try {
							dataObj = JSON.parse(data);
						} catch(err) {
							dataObj = data;
						}

						callback(err, dataObj);
					}
				});

				return this;
			}
		};

		object.interfacePath = interfacePath;

		/* Compile members */
		for (var methodName in obj.s) {
			this._compileNode(object, methodName, obj.s[methodName]);
		}

		if (rootObj === this.API) {
			rootObj[objName] = object;
		} else {
			rootObj.prototype[objName] = object;
		}

		break;
	case 'a':
		/* Array */
		rootObj.prototype.__defineGetter__(objName, function() {
			var completed = false;

			_RedTea._internal.post('/apis' + interfacePath, null, function(data) {
				completed = true;
			});

			/* TODO: Connect to server */
			while(!completed) {
			}

			return [];
		});

		rootObj.prototype.__defineSetter__(objName, function(val) {
			this.interfacePath = interfacePath;

			/* TODO: Connect to server */
		});

		break;
	case 'o':
		/* Object */
		rootObj.prototype.__defineGetter__(objName, function() {
			this.interfacePath = interfacePath;

			/* TODO: Connect to server */
			return {};
		});

		rootObj.prototype.__defineSetter__(objName, function(val) {
			this.interfacePath = interfacePath;

			/* TODO: Connect to server */
		});

		break;
	default:
		/* Variable */
		rootObj.prototype.__defineGetter__(objName, function() {
			this.interfacePath = interfacePath;

			/* TODO: Connect to server */
			return 123;
		});

		rootObj.prototype.__defineSetter__(objName, function(val) {
			this.interfacePath = interfacePath;

			/* TODO: Connect to server */
		});
	}
};

_RedTea.prototype.compile = function(apiSource) {
	/* Compile APIs */
	for (var propName in apiSource) {
		var obj = apiSource[propName];

		this._compileNode(this.API, propName, obj);
	}
};

_RedTea.prototype.import = function(pathname) {
	var self = this;

	self.taskNum++;

	/* TODO: Get individual API */
	var ret = _RedTea._internal.get('/apis?introspect', function(err, data) {
		var apiSource = (function() {
			return eval('(' + data + ')');
		})();

		/* Compile and append to RedTea object */
		self.compile(apiSource);

		self.taskNum--;
	});

	if (!ret)
		return null;
};
