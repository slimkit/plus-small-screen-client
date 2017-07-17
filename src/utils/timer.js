export default function(utc, timezone, isTimestamp) {
	let timeZone = (new Date()).getTimezoneOffset();
	return !isTimestamp ?
		parseInt(parseInt(new Date(utc.replace(/-/g, "/")).getTime()) - 3600 * (timeZone / 60) * 1000) :
		(utc + 3600000 * timezone);
};