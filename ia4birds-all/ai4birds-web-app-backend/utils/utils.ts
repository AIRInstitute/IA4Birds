/**
 * Function to generate a random token for a user session
 * @param  {int} length   token length to generate
 */
const generateToken = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

/**
 * Function to parse bytes to MB, GB or TB
 * @param  {int} bytes   token length to generate
 */
const bytesToSize = (bytes: number) => {
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	if (bytes == 0) return "0 Byte";
	const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
	return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
};

const keysChecker = (obj: object, keys: string[]) => {
	return keys.every((key) => {
		return (
			Object.keys(obj).indexOf(key) !== -1 &&
			obj[key] !== null &&
			obj[key] !== undefined &&
			obj[key] !== ""
		);
	});
};

const auxiliaryFunctions = {
	generateToken: generateToken,
	bytesToSize: bytesToSize,
	keysChecker: keysChecker,
};

export default auxiliaryFunctions;
