const crypto = require("crypto")

function day4(input, part2) {
	let prefix = "0".repeat(part2 ? 6 : 5)
	let n = 1

	while (!crypto.hash("md5", input + n).startsWith(prefix)) {
		n++
	}

	return n
}

if (typeof window == "undefined") {
	module.exports = day4
}
