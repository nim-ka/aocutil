function encode_beam_state([pos, dir]) {
	return pos.toString() + ";" + dir.toString()
}

function decode_beam_state(str) {
	return str.split(";").map(Point.fromString)
}

function day16(input, part2) {
	let grid = Grid.fromStr(input)
	let reached = new Grid(grid.width, grid.height, () => new Set())
	let beams = new Map()
	let maxId = 0

	for (let i = 0; i < grid.width; i++) {
		beams.set(encode_beam_state([new Point(0, i), Point.RIGHT]), new Set([maxId++]))

		if (!part2) {
			break
		}

		beams.set(encode_beam_state([new Point(i, 0), Point.DOWN]), new Set([maxId++]))
		beams.set(encode_beam_state([new Point(grid.width - 1, i), Point.LEFT]), new Set([maxId++]))
		beams.set(encode_beam_state([new Point(i, grid.height - 1), Point.UP]), new Set([maxId++]))
	}

	let changed = true
	let i = 0

	while (changed) {
		changed = false

		for (let [enc, ids] of beams) {
			let [pos, dir] = decode_beam_state(enc)
			let tile = grid.get(pos)
			let dirs

			let oldIds = reached.get(pos)
			if (!ids.isSubsetOf(oldIds)) {
				oldIds.unionMut(ids)
				changed = true
			}

			if (tile == "|" && dir.x) {
				dirs = [Point.UP, Point.DOWN]
			} else if (tile == "-" && dir.y) {
				dirs = [Point.LEFT, Point.RIGHT]
			} else if (tile == "\\") {
				dirs = [new Point(dir.y, dir.x)]
			} else if (tile == "/") {
				dirs = [new Point(-dir.y, -dir.x)]
			} else {
				dirs = [dir]
			}

			for (let dir of dirs) {
				let newPos = pos.add(dir)

				if (grid.contains(newPos)) {
					let newState = encode_beam_state([newPos, dir])
					let newIds = beams.get(newState) ?? new Set()
					beams.set(newState, newIds.unionMut(ids))
				}
			}
		}
	}

	let counts = Array(maxId).fill(0)
	let max = 0

	reached.forEach((ids) => {
		for (let id of ids) {
			max = Math.max(max, ++counts[id])
		}
	})

	return max
}

if (typeof window == "undefined") {
	module.exports = day16
}
