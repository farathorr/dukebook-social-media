const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	console.error(err.message);

	next(err);
};

module.exports = {
	unknownEndpoint,
	errorHandler,
};
