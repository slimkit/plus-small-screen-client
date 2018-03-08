const {
	url
} = window.TS_WEB;
const baseUrl = url

export function resolveImage(image) {
	if (image.slice(0, 5).toLowerCase() === 'data:') {
		return image;
	}
	return baseUrl + image;
}