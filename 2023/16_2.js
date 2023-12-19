function encode_beam_state(pos, dir) {
	return pos.x << 16 | pos.y << 8 | dir
}

function decode_beam_state(enc) {
	let px = enc >> 16
	let py = enc >> 8 & 0xff
	let dir = enc & 0xff

	return {
		pos: new Point(px, py),
		dir: dir
	}
}

function day16(input, part2) {
	let grid = Grid.fromStr(input)
	let reached = new Grid(grid.width, grid.height, () => new Set())
	let beams = new Map()
	let maxId = 0

	for (let i = 0; i < grid.width; i++) {
		beams.set(encode_beam_state(new Point(0, i), 3), new Set([maxId++]))

		if (!part2) {
			break
		}

		beams.set(encode_beam_state(new Point(i, 0), 2), new Set([maxId++]))
		beams.set(encode_beam_state(new Point(grid.width - 1, i), 1), new Set([maxId++]))
		beams.set(encode_beam_state(new Point(i, grid.height - 1), 0), new Set([maxId++]))
	}

	let changed = true
	let i = 0

	while (changed) {
		changed = false

		for (let [enc, ids] of beams) {
			let { pos, dir } = decode_beam_state(enc)
			let tile = grid.get(pos)
			let dir1 = null
			let dir2 = null

			let oldIds = reached.get(pos)
			if (!ids.isSubsetOf(oldIds)) {
				oldIds.unionMut(ids)
				changed = true
			}

			if (tile == "|" && (dir == 1 || dir == 3)) {
				dir1 = 0
				dir2 = 2
			} else if (tile == "-" && (dir == 0 || dir == 2)) {
				dir1 = 1
				dir2 = 3
			} else if (tile == "\\") {
				dir1 = [1, 0, 3, 2][dir]
			} else if (tile == "/") {
				dir1 = [3, 2, 1, 0][dir]
			} else {
				dir1 = dir
			}

			let newPos = pos.add(Point.DIRS[dir1])

			if (grid.contains(newPos)) {
				let newState = encode_beam_state(newPos, dir1)
				let newIds = beams.get(newState) ?? new Set()
				beams.set(newState, newIds.unionMut(ids))
			}

			if (dir2 != null) {
				newPos = pos.add(Point.DIRS[dir2])

				if (grid.contains(newPos)) {
					let newState = encode_beam_state(newPos, dir2)
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
