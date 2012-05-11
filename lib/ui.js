var fs = require('fs');
var path = require('path');
var jade = require('jade');

var UI = module.exports = function() {
	this.uiDirs = [];
	this.uiTable = {};
};

UI.render = function(ui, req, res, uiName, variables) {
	if (ui.uiTable.hasOwnProperty(uiName)) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(ui.uiTable[uiName](variables));
	}
};

UI.prototype.init = function() {

	if (this.uiDirs.length == 0)
		throw Error('No UI files');

	/* Scan directories */
	for (var i in this.uiDirs) {
		var files = fs.readdirSync(this.uiDirs[i]);

		/* Load UI files */
		for (var index in files) {
			var uiPath = path.join(this.uiDirs[i], files[index]);
			var source = fs.readFileSync(uiPath, 'utf8')
			var func = jade.compile(source, { filename: uiPath, pretty: true });

			this.uiTable[path.basename(files[index], '.jade')] = func;
		}
	}

};

UI.prototype.override = function(req, res) {
	var self = this;

	res.render = function(uiName, variables) {
		return UI.render(self, req, res, uiName, variables);
	};
};
