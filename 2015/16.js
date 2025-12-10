function day16(input, part2) {
	let sues = input.split("\n").map((line) =>
		line.replace(/Sue (\d+): /, "").split(", ").map((p) => p.split(": ")))

	let constraints = {
		children: (n) => n == 3,
		cats: (n) => part2 ? n > 7 : n == 7,
		samoyeds: (n) => n == 2,
		pomeranians: (n) => part2 ? n < 3 : n == 3,
		akitas: (n) => n == 0,
		vizslas: (n) => n == 0,
		goldfish: (n) => part2 ? n < 5 : n == 5,
		trees: (n) => part2 ? n > 3 : n == 3,
		cars: (n) => n == 2,
		perfumes: (n) => n == 1
	}

	return sues.findIndex((sue) => sue.every(([name, value]) => constraints[name](+value))) + 1
}

if (typeof window == "undefined") {
	module.exports = day16
}
