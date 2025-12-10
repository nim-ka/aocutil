function day6(input, part2) {
	let lines = input.split("\n")
	let ops = lines.pop().split(/\s+/).truthy()

	if (part2) {
		lines = lines.map((line) => line.split("")).transpose().map((line) => line.join("")).splitOn(/^\s+$/)
	} else {
		lines = lines.map((line) => line.split(/\s+/).truthy()).transpose()
	}

	return lines.sum((eq, i) =>
		eq.reduce((a, b) =>
			ops[i] == "+" ? +a + +b : +a * +b))
}

if (typeof window == "undefined") {
	module.exports = day6
}
