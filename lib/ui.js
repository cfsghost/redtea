
var jade = require('jade');

var UI = module.exports = function() {
	this.uiDirs = [];
};

UI.prototype.init = function() {
};

UI.prototype.override = function(req, res) {
	res.render = function(uiName, variables) {
		
	};
};
