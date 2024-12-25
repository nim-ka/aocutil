function day25(input) {
	let { "#": locks, ".": keys } = input.split("\n\n").dict((obj, str) => {
		let grid = Grid.fromStr(str)
		let key = grid.get(Point.ZERO)

		obj[key] ??= []
		obj[key].push(grid.getColumns().map((c) => c.lastIndexOf(key)))
	})

	return locks.cartProductGen(keys).count(([lock, key]) => lock.every((n, i) => n <= key[i]))
}

if (typeof window == "undefined") {
	module.exports = day25
}
