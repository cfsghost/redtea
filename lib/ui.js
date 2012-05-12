var fs = require('fs');
var path = require('path');
var jade = require('jade');

var UI = module.exports = function() {
	this.uiDirs = [];
	this.uiTable = {};
};

UI.prototype.render = function(req, res, uiName, variables) {
	if (this.uiTable.hasOwnProperty(uiName)) {
		/* Send UI page to client */
		res.write(this.uiTable[uiName](variables));
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
			var source = fs.readFileSync(uiPath, 'utf8');
			var func = jade.compile(source, { filename: uiPath, pretty: true });

			this.uiTable[path.basename(files[index], '.jade')] = func;
		}
	}

};
