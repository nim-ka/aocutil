function day20(input, part2) {
	let grid = Grid.fromStr(input)

	let cur = grid.indexOf("S")

	let path = []
	let dir = Point.DIRS.find((dir) => grid.get(cur.add(dir)) == ".")

	while (dir) {
		let last = cur
		path.push(last)
		dir = [dir, dir.cwConst, dir.ccwConst].find((dir2) => grid.get(cur = last.add(dir2)) != "#")
	}

	let count = 0
	let limit = part2 ? 20 : 2

	for (let i = 0; i < path.length; i++) {
		for (let j = i + 100; j < path.length; j++) {
			let cheatLength = path[i].manhattanDist(path[j])

			if (cheatLength > limit) {
				j += cheatLength - limit - 1
			} else if (cheatLength <= j - i - 100) {
				count++
			}
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day20
}
