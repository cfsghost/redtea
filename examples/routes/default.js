
module.exports = {
	'/': index
};

function index(app, req, res) {

	res.render('index', { title: 'RedTea' });
};
