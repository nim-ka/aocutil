function encode_beam_state(state) {
	return state.pos.toString() + ";" + state.dir.toString()
}

function decode_beam_state(str) {
	let [posStr, dirStr] = str.split(";")
	return {
		pos: Point.fromString(posStr),
		dir: Point.fromString(dirStr)
	}
}

function day16(input, part2) {
	let grid = Grid.fromStr(input)
	let reached = new Grid(grid.width, grid.height, () => new Set())
	let beams = new Map()
	let maxId = 0

	for (let i = 0; i < grid.width; i++) {
		beams.set(encode_beam_state({ pos: new Point(0, i), dir: Point.RIGHT }), new Set([maxId++]))

		if (!part2) {
			break
		}

		beams.set(encode_beam_state({ pos: new Point(i, 0), dir: Point.DOWN }), new Set([maxId++]))
		beams.set(encode_beam_state({ pos: new Point(grid.width - 1, i), dir: Point.LEFT }), new Set([maxId++]))
		beams.set(encode_beam_state({ pos: new Point(i, grid.height - 1), dir: Point.UP }), new Set([maxId++]))
	}

	let changed = true
	let i = 0

	while (changed) {
		changed = false

		for (let [enc, ids] of beams) {
			let state = decode_beam_state(enc)
			let tile = grid.get(state.pos)
			let dirs

			let oldIds = reached.get(state.pos)
			if (!ids.isSubsetOf(oldIds)) {
				oldIds.unionMut(ids)
				changed = true
			}

			if (tile == "|" && state.dir.x) {
				dirs = [Point.UP, Point.DOWN]
			} else if (tile == "-" && state.dir.y) {
				dirs = [Point.LEFT, Point.RIGHT]
			} else if (tile == "\\") {
				dirs = [new Point(state.dir.y, state.dir.x)]
			} else if (tile == "/") {
				dirs = [new Point(-state.dir.y, -state.dir.x)]
			} else {
				dirs = [state.dir]
			}

			for (let dir of dirs) {
				let newPos = state.pos.add(dir)

				if (grid.contains(newPos)) {
					let newState = encode_beam_state({ pos: newPos, dir: dir })
					let newIds = beams.get(newState) ?? new Set()
					beams.set(newState, newIds.unionMut(ids))
				}
			}

			beams.delete(state)
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
