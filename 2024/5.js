function day5(input, part2) {
	let [ordering, lists] = input.split("\n").splitOn("")

	ordering = ordering.dict((o, e) => {
		let [left, right] = e.split("|")
		o[left] ??= new Set()
		o[left].add(right)
	})

	let sum = 0

	for (let list of lists) {
		list = list.split(",")

		let changed = false

		for (let i = 0; i < list.length - 1; i++) {
			let root = i

			for (let j = root + 1; j < list.length; j++) {
				if (ordering[list[j]]?.has(list[root])) {
					root = j
				}
			}

			if (root != i) {
				[list[i], list[root]] = [list[root], list[i]]
				changed = true
			}
		}

		if (changed == part2) {
			sum += +list[list.length >> 1]
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day5
}
