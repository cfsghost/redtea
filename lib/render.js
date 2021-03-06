var fs = require('fs');
var path = require('path');
var jade = require('jade');

var UI = require('./ui');
var Runner = require('./runner');

var Render = module.exports = function() {

	this.ui = new UI;
	this.runner = new Runner;
};

Render.prototype.render = function(req, res, uiName, runnerName, variables) {

	this.ui.render(req, res, uiName, variables);
	this.runner.render(req, res, runnerName || uiName, variables);

	res.end();
};

Render.prototype.init = function() {

	this.ui.init();
	this.runner.init();

};

Render.prototype.override = function(req, res) {
	var self = this;

	//res.render = render = function(uiName, variables) {
	res.render = function() {
		if (arguments[1] instanceof Object) {
			return self.render(req, res, arguments[0], null, arguments[1]);
		} else if (arguments.length == 3) {
			return self.render(req, res, arguments[0], arguments[1], arguments[2]);
		} else {
			return self.render(req, res, arguments[0], arguments[1], null);
		}

	};
};
