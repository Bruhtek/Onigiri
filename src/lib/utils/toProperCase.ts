export default function toProperCase(str) {
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
	});
}
