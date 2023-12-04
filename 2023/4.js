function day4(input, part2) {
	let lines = input.split("\n")
	let counts = Array(lines.length).fill(1)
	let sum = 0

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].split(":")[1].split("|")
		let wins = line[1].ints()

		let numMatches = line[0].ints().count((num) => wins.includes(num))

		for (let j = i + 1; j < Math.min(lines.length, i + 1 + numMatches); j++) {
			counts[j] += counts[i]
		}

		if (part2) {
			sum += counts[i]
		} else {
			sum += numMatches ? 2 ** (numMatches - 1) : 0
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day4
}
