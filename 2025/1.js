function day1(input, part2) {
	let pos = 50
	let count = 0

	for (let line of input.split("\n")) {
		let n = (line[0] == "L" ? -1 : 1) * +line.slice(1)
		let newpos = (pos + n) % 100

		if (part2) {
			if (pos < 0 && pos + n >= 0 || pos > 0 && pos + n <= 0) {
				count++
			}

			count += Math.abs(pos + n) / 100 | 0
		} else {
			count += newpos == 0
		}

		pos = newpos
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day1
}
