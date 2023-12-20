export function capitalize(str: string) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function now() {
	return new Date().toLocaleTimeString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

/* export function logFilename() {
	return now().replace(/,/g, '').replace(/ /g, '_').replace(/:/g, '-');
} */
