function score(grid) {
	return grid.findIndices("O").sum((pt) => grid.height - pt.y)
}

function roll(grid, rocks, dir) {
	let next

	rocks.sortNumDesc((pt) => pt.dot(dir))

	for (let rock of rocks) {
		while (grid.getDef(next = rock.add(dir), "#") == ".") {
			grid.set(rock, ".")
			grid.set(next, "O")
			rock.mutate(next)
		}
	}
}

function day14(input, part2) {
	let grid = Grid.fromStr(input)
	let rocks = []

	grid.forEach((e, pt) => {
		if (e == "O") {
			rocks.push(pt)
		}
	})

	let hashes = []
	let hashesMap = new Map()

	for (let i = 0; ; i++) {
		let hash = ""

		for (let rock of rocks) {
			hash += rock.toString()
			hash += ";"
		}

		if (hashesMap.has(hash)) {
			let start = hashesMap.get(hash)
			return hashes[start + (1000000000 - start) % (i - start)]
		}

		hashes.push(score(grid))
		hashesMap.set(hash, i)

		roll(grid, rocks, Point.NORTH)

		if (!part2) {
			return score(grid)
		}

		roll(grid, rocks, Point.WEST)
		roll(grid, rocks, Point.SOUTH)
		roll(grid, rocks, Point.EAST)
	}
}

if (typeof window == "undefined") {
	module.exports = day14
}
