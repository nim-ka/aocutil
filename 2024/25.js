function day25(input) {
	let { "#": locks, ".": keys } = input.split("\n\n").dict((obj, str) => {
		let grid = Grid.fromStr(str)
		let key = grid.get(Point.ZERO)

		obj[key] ??= []
		obj[key].push(grid.getColumns().map((c) => c.lastIndexOf(key)))
	})

	let count = 0

	for (let lock of locks) {
		for (let key of keys) {
			count += lock.every((n, i) => n <= key[i])
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day25
}
