function day1(input, part2) {
	let pos = 0

	for (let i = 0; i < input.length; i++) {
		pos += input[i] == "(" ? 1 : -1

		if (part2 && pos < 0) {
			return i + 1
		}
	}

	return pos
}

if (typeof window == "undefined") {
	module.exports = day1
}
