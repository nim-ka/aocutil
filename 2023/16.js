function encode_beam_state(pos, dir) {
	return pos.x << 16 | pos.y << 8 | dir
}

function get_path(grid, cache, total, pos, dir) {
	let key = encode_beam_state(pos, dir)
	let set = new Set()

	if (!grid.contains(pos)) {
		return set
	}

	if (cache.has(key)) {
		return cache.get(key)
	}

	cache.set(key, set)

	let tile = grid.get(pos)

	set.add(encode_beam_state(pos, 0))

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
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[0]), 0))
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[2]), 2))
	} else if (tile == "-") {
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[1]), 1))
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[3]), 3))
	} else if (tile == "/") {
		let newDir = [3, 2, 1, 0][dir]
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[newDir]), newDir))
	} else if (tile == "\\") {
		let newDir = [1, 0, 3, 2][dir]
		set.unionMut(get_path(grid, cache, total, pos.add(Point.DIRS[newDir]), newDir))
	}

	total.unionMut(set)

	for (let [key, value] of total) {
		total.unionMut(cache.get(key))
	}

	return set
}

function day16(input, part2) {
	let grid = Grid.fromStr(input)
	let cache = new Map()
	let max = 0

	for (let i = 0; i < grid.width; i++) {
		let total = new Set()
		get_path(grid, cache, total, new Point(0, i), 3)
		max = Math.max(max, L(total.size))

		if (!part2) {
			return max
		}

		total = new Set()
		get_path(grid, cache, total, new Point(i, 0), 2)
		max = Math.max(max, L(total.size))
		total = new Set()
		get_path(grid, cache, total, new Point(grid.weight - 1, i), 1)
		max = Math.max(max, L(total.size))
		total = new Set()
		get_path(grid, cache, total, new Point(i, grid.height - 1), 0)
		max = Math.max(max, L(total.size))
		console.log("-----", i, grid.width)
	}

	return max
}

if (typeof window == "undefined") {
	module.exports = day16
}
