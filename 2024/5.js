function day5(input, part2) {
	let [ordering, lists] = input.split("\n").splitOn("")

	ordering = ordering.dict((o, e) => {
		let [left, right] = e.split("|")
		o[left] ??= new Set()
		o[left].add(right)
	})

	let sum = 0

	for (let line of lists) {
		let unsorted = line.split(",")
		let sorted = unsorted.slice().sort((a, b) => ordering[a].has(b) ? -1 : 1)

		if (sorted.equals(unsorted) != part2) {
			sum += +sorted[sorted.length >> 1]
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day5
}
