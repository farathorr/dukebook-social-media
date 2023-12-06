export const formatDate = (utcTime) => {
	if (!utcTime) return utcTime;
	const dateObject = new Date(utcTime);

	const time = dateObject.toLocaleString("default", { hour: "numeric", minute: "numeric" });
	const shortFullDate = dateObject.toLocaleString("default", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
	const longDate = dateObject.toLocaleString("default", { year: "numeric", month: "long", day: "numeric" });
	const longFullDate = dateObject.toLocaleString("default", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	});

	return {
		time,
		shortFullDate,
		longFullDate,
		longDate,
	};
};
