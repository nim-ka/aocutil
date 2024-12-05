function day5(input, part2) {
	let [ordering, lists] = input.split("\n").splitOn("")
	let rules = new Set(ordering.map((e) => (+e[0] * 10 + +e[1]) << 16 | (+e[3] * 10 + +e[4])))

	let sum = 0

	for (let line of lists) {
		let unsorted = line.split(",")
		let sorted = unsorted.slice().sort((a, b) => rules.has(+a << 16 | +b) ? -1 : 1)

		if (sorted.equals(unsorted) != part2) {
			sum += +sorted[sorted.length >> 1]
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day5
}
