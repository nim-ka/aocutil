// this code is really terrible but it runs in under a second, and it's 12:30am and i have a job interview tomorrow so this is what you're getting

function day6(input, part2) {
	let grid = Grid.fromStr(input)
	let start = grid.indexOf("^")

	let rowBlocks = Array(grid.height).fill().map(() => [])
	let columnBlocks = Array(grid.width).fill().map(() => [])

	for (let block of grid.findIndices("#")) {
		rowBlocks[block.y].push(block.x)
		columnBlocks[block.x].push(block.y)
	}

	let path = new NumericPointMap()

	let head = start.copy()
	let dir = Point.UP

	while (grid.contains(head)) {
		if (!path.has(head)) {
			path.set(head, dir)
		}

		while (grid.getDef(head.add(dir)) == "#") {
			dir = dir.cwConst
		}

		head.addMut(dir)
	}

	if (!part2) {
		return path.size
	}

	path.delete(start)

	let count = 0

	for (let [newBlock, dir] of path) {
		let head = start.copy()
		let dir = Point.UP

		let loop
		let lines = new Map([
			[Point.UP, Array(grid.width).fill().map(() => new RangeSet())],
			[Point.DOWN, Array(grid.width).fill().map(() => new RangeSet())],
			[Point.LEFT, Array(grid.height).fill().map(() => new RangeSet())],
			[Point.RIGHT, Array(grid.height).fill().map(() => new RangeSet())]
		])

		while (true) {
			let cur = dir.y == 0 ? head.x : head.y
			let other = dir.y == 0 ? head.y : head.x
			let newCoord = dir.y == 0 ? newBlock.x : newBlock.y
			let en = dir.y == 0 ? (newBlock.y == head.y) : (newBlock.x == head.x)
			let blockSet = dir.y == 0 ? rowBlocks[head.y] : columnBlocks[head.x]
			let block

			if ((dir.x || dir.y) > 0) {
				for (let i = 0; i < blockSet.length; i++) {
					if (en && newCoord < blockSet[i]) {
						if (cur < newCoord) {
							block = newCoord
							break
						}
					}

					if (cur < blockSet[i]) {
						block = blockSet[i]
						break
					}
				}

				if (en && block == undefined && cur < newCoord) {
					block = newCoord
				}
			} else {
				for (let i = blockSet.length - 1; i >= 0; i--) {
					if (en && newCoord > blockSet[i]) {
						if (cur > newCoord) {
							block = newCoord
							break
						}
					}

					if (cur > blockSet[i]) {
						block = blockSet[i]
						break
					}
				}

				if (en && block == undefined && cur > newCoord) {
					block = newCoord
				}
			}

			if (block == undefined) {
				loop = false
				break
			}

			let lineSet = lines.get(dir)[other]
			let range = new Range(Math.min(cur, block), Math.max(cur, block))
			if (lineSet.intersects(new RangeSet([range]))) {
				loop = true
				break
			}
			lineSet.addRangeMut(range).reduceMut()

			head.addMut(dir.mult(range.l - 1))
			dir = dir.cwConst
		}

		count += loop
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day6
}
