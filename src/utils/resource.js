const {
	url
} = window.TS_WEB;
const baseUrl = url + '/zhiyi/h5/';

export function resolveImage(image) {
	if (image.slice(0, 5).toLowerCase() == 'data:') {
		return image;
	}
	return baseUrl + 'images/' + image;
}