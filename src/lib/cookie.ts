// GET COOKIE
export function getCookie(name: string) {
	const cookieName = name + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(cookieName) == 0) {
			return c.substring(cookieName.length, c.length);
		}
	}
	return "";
}

// SET COOKIE
export function setCookie(
	name: string,
	value: string,
	exdays: number,
	secure = false,
) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	const expires = "expires=" + d.toUTCString();
	if (secure) {
		document.cookie =
			name + "=" + value + ";" + expires + ";path=/; secure";
	} else {
		document.cookie = name + "=" + value + ";" + expires + ";path=/";
	}
}

// DELETE COOKIE
export function deleteCookie(name: string) {
	document.cookie = name + "=; Max-Age=-99999999;";
}
