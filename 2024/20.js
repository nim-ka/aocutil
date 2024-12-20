function day20(input, part2) {
	let grid = Grid.fromStr(input)

	let cur = grid.indexOf("S")
	let end = grid.indexOf("E")

	let path = [cur]
	while (!cur.equals(end)) {
		grid.set(cur, "#")
		path.push(cur = grid.getAdjNeighbors(cur).find((pt) => grid.get(pt) != "#"))
	}

	let count = 0
	let limit = part2 ? 20 : 2

	for (let i = 0; i < path.length; i++) {
		for (let j = i + 100; j < path.length; j++) {
			let cheatLength = path[i].manhattanDist(path[j])

			if (cheatLength > limit) {
				j += cheatLength - limit - 1
			} else if (j - i - cheatLength >= 100) {
				count++
			}
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day20
}
