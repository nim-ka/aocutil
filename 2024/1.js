function day1(input, part2) {
	let columns = input.posints().splitEvery(2).transpose()

	if (part2) {
		return columns[1].int(columns[0]).sum()
	} else {
		return columns.map((c) => c.sortNumAsc()).transpose().sum(([a, b]) => Math.abs(a - b))
	}
}

if (typeof window == "undefined") {
	module.exports = day1
}
