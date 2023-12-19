function encode_beam_state(pos, dir) {
	return pos.x << 16 | pos.y << 8 | dir
}

function get_path(grid, cache, pos, dir) {
	let set = new Set()

	if (!grid.contains(pos)) {
		return set
	}

	let key = encode_beam_state(pos, dir)

	if (cache.has(key)) {
		return cache.get(key)
	}

	let tile = grid.get(pos)

	set.add(encode_beam_state(pos, 0))
	cache.set(key, set)

	while (
		tile == "." ||
		((dir == 0 || dir == 2) && tile == "|") ||
		((dir == 1 || dir == 3) && tile == "-")) {
		pos.addMut(Point.DIRS[dir])

		if (!grid.contains(pos)) {
			return set
		}

		set.add(encode_beam_state(pos, 0))
		tile = grid.get(pos)
	}

	if (tile == "|") {
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[0]), 0))
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[2]), 2))
	} else if (tile == "-") {
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[1]), 1))
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[3]), 3))
	} else if (tile == "/") {
		let newDir = [3, 2, 1, 0][dir]
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[newDir]), newDir))
	} else if (tile == "\\") {
		let newDir = [1, 0, 3, 2][dir]
		set.unionMut(get_path(grid, cache, pos.add(Point.DIRS[newDir]), newDir))
	}

	cache.set(key, set)
	return set
}

function day16(input, part2) {
	let grid = Grid.fromStr(input)
	let cache = new Map()
	let max = 0

	for (let i = 0; i < grid.width; i++) {
		max = Math.max(max, L(get_path(grid, cache, new Point(0, i), 3).size))

		if (!part2) {
			return max
		}

		max = Math.max(max, L(get_path(grid, cache, new Point(i, 0), 2).size))
		max = Math.max(max, L(get_path(grid, cache, new Point(grid.width - 1, i), 1).size))
		max = Math.max(max, L(get_path(grid, cache, new Point(i, grid.height - 1), 0).size))
		console.log("-----", i, grid.width)
	}

	return max
}

if (typeof window == "undefined") {
	module.exports = day16
}
