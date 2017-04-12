export default function (utc, timezone, isTimestamp) {
  return !isTimestamp ? parseInt(parseInt(new Date(utc.replace(/-/g, "/")).getTime()) + 3600 * timezone * 1000) : (utc + 3600000 * timezone);
};