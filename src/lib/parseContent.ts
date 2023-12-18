export function parseContent(content: string): string {
	let result = content;
	result = unescapeDoubleQuotes(result);
	result = removeBackslashNewline(result);
	result = getOnlyBodyTag(result);

	return result;
}

// function removeImageSrc(content: string): string {
// 	const imageSrc = /(<img.*?src=")(.*?)(")/g;
// 	return content.replace(imageSrc, "$1#$3 alt='image'");
// }

function getOnlyBodyTag(content: string): string {
	const bodyTag = /<body>(.*)<\/body>/s;
	const match = content.match(bodyTag);
	if (match) {
		return match[1];
	} else {
		return content;
	}
}

function unescapeDoubleQuotes(content: string): string {
	return content.replace(/\\"/g, '"');
}

function removeBackslashNewline(content: string): string {
	return content.replace(/\\n/g, "");
}
