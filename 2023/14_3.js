function score(grid) {
	return grid.findIndices("O").sum((pt) => grid.height - pt.y)
}

function roll(grid, dir, getHash) {
	let side = dir.cw90()
	let start = new Point(dir.x - side.x == 1 ? grid.width - 1 : 0, dir.y - side.y == 1 ? grid.height - 1 : 0)

	let pt = start.copy()
	let target = null

	let score = 0
	let hash = ""

	while (grid.contains(pt)) {
		let val = grid.get(pt)

		if (val == "#") {
			target = null
		} else if (val == ".") {
			target ??= pt.copy()
		} else {
			let cell = pt

			if (target) {
				cell = target.copy()
				grid.set(pt, ".")
				grid.set(target, "O")
				while (grid.get(target.subMut(dir)) != ".") {}
			}

			score += grid.height - cell.y
			if (getHash) {
				hash += cell.x + "," + cell.y + ","
			}
		}

		pt.subMut(dir)

		if (!grid.contains(pt)) {
			pt = start.addMut(side).copy()
			target = null
		}
	}

	return { score, hash }
}

function day14(input, part2) {
	let grid = Grid.fromStr(input)
	let hashes = new Map()
	let scores = []

	for (let i = 0; ; i++) {
		let p1 = roll(grid, Point.NORTH, false)

		if (!part2) {
			return p1.score
		}

		roll(grid, Point.WEST, false)
		roll(grid, Point.SOUTH, false)
		let { score, hash } = roll(grid, Point.EAST, true)

		if (hashes.has(hash)) {
			let start = hashes.get(hash)
			return scores[start - 1 + (1000000000 - start) % (i - start)]
		}

		hashes.set(hash, i)
		scores.push(score)
	}
}

if (typeof window == "undefined") {
	module.exports = day14
}
