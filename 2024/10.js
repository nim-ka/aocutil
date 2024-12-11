// could dp this but too lazy
function trails(grid, pt, part2, found) {
	if (!part2) {
		if (found.has(pt)) {
			return 0
		}

		found.add(pt)
	}

	let cur = grid.get(pt)
	if (cur == 9) {
		return 1
	}

	return grid.getAdjNeighbors(pt).sum((pt2) => {
		return grid.get(pt2) == cur + 1 ? trails(grid, pt2, part2, found) : 0
	})
}

function day10(input, part2) {
	let grid = Grid.fromStr(input).numMut()
	return grid.findIndices(0).sum((pt) => trails(grid, pt, part2, new NumericPointSet()))
}

if (typeof window == "undefined") {
	module.exports = day10
}
