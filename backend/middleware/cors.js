const domains = ["http://localhost:5000"];

const cors = (req, res, next) => {
	const origin = req.headers.origin;

	if (domains.includes(origin)) {
		res.header("Access-Control-Allow-Origin", origin);
		res.header("Access-Control-Allow-Credentials", true);
	} else {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Credentials", false);
	}
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	next();
};

module.exports = cors;
