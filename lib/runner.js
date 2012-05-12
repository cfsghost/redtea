var fs = require('fs');
var path = require('path');

var Runner = module.exports = function() {
	this.runnerDirs = [];
	this.runnerTable = {};
};

Runner.prototype.render = function(req, res, runnerName, variables) {

	if (this.runnerTable.hasOwnProperty(runnerName)) {
		/* Send runner to client */
		res.write('<script type=\'text/javascript\' src=\'/apis\'></script>');
		res.write('<script>');
		res.write(this.runnerTable[runnerName]);
		res.write('</script>');
	}
};

Runner.prototype.init = function() {

	if (this.runnerDirs.length == 0) {
		return;
	}

	/* Scan directories */
	for (var i in this.runnerDirs) {
		var files = fs.readdirSync(this.runnerDirs[i]);

		/* Load Runner files */
		for (var index in files) {
			var runnerPath = path.join(this.runnerDirs[i], files[index]);
			var source = fs.readFileSync(runnerPath, 'utf8');

			this.runnerTable[path.basename(files[index], '.js')] = source;
		}
	}

};
