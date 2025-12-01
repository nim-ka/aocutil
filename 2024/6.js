// this code is really terrible but it runs in under a second, and it's 12:30am and i have a job interview tomorrow so this is what you're getting

function day6(input, part2) {
	let grid = Grid.fromStr(input)
	let start = grid.indexOf("^")

	let blocks = new NumericPointSet(grid.findIndices("#"))

	let path = new NumericPointMap()

	let head = start.copy()
	let dir = Point.UP

	while (grid.contains(head)) {
		if (!path.has(head)) {
			path.set(head, dir)
		}

		while (blocks.has(head.add(dir))) {
			dir = dir.cwConst
		}

		head.addMut(dir)
	}

	if (!part2) {
		return path.size
	}

	path.delete(start)

	let loops = new NumericPointMap()

	for (let block of blocks) {
		for (let dir of Point.DIRS) {
			let head = block.add(dir)
			dir = dir.ccwConst

			while (grid.contains(head) && loops.get(head) != dir) {
				loops.set(head, dir)

				while (blocks.has(head.add(dir))) {
					dir = dir.cwConst
				}

				head.addMut(dir)
			}
		}
	}

	for (let [newBlock, dir] of path) {
		
	}

	return loops.size
}

if (typeof window == "undefined") {
	module.exports = day6
}
