let pipes = {
	"|": [Point.NORTH, Point.SOUTH],
	"-": [Point.WEST, Point.EAST],
	"L": [Point.NORTH, Point.EAST],
	"F": [Point.EAST, Point.SOUTH],
	"7": [Point.SOUTH, Point.WEST],
	"J": [Point.WEST, Point.NORTH],
	".": []
}

function day10(input, part2) {
	let grid = Grid.fromStr(input)

	let start = grid.findIndex("S")
	let cur = start.copy()
	let dir

	for (let pipe in pipes) {
		if (pipe != "." && pipes[pipe].every((dir) => dir.neg().isIn(pipes[grid.getDef(start.add(dir), ".")]))) {
			grid.set(start, pipe)
			dir = pipes[pipe][0]
			break
		}
	}

	let i = 0

	do {
		cur.addMut(dir)
		i++

		let dirs = pipes[grid.get(cur)]
		grid.set(cur, dirs)
		dir = dirs.find((e) => !e.equals(dir.neg()))
	} while (!start.equals(cur))

	if (!part2) {
		return i / 2
	}

	return grid.count((e, pt) => {
		let inside = 0

		if (e instanceof Array) {
			return inside
		}

		let cur = pt

		while (true) {
			cur = cur.up()

			if (!grid.contains(cur)) {
				break
			}

			let e = grid.get(cur)

			if (typeof e == "number") {
				inside ^= e
				break
			}

			if (e instanceof Array && ((!Point.UP.isIn(e) && !Point.DOWN.isIn(e)) || Point.LEFT.isIn(e))) {
				inside ^= 1
			}
		}

		grid.set(pt, inside)
		return inside
	})
}

if (typeof window == "undefined") {
	module.exports = day10
}

