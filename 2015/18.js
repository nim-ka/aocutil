function day18(input, part2) {
	let grid = Grid.fromStr(input)
	let corners = [grid.tl(), grid.tr(), grid.bl(), grid.br()]

	for (let i = 0; i < 100; i++) {
		grid.evolve((e, pt, g) => {
			if (part2 && corners.some((corner) => pt.equals(corner))) {
				return "#"
			}

			let count = pt.getUnfilteredAllNeighbors().count((pt) => g.getDef(pt) == "#")
			return count == 3 || (count == 2 && e == "#") ? "#" : "."
		})
	}

	return grid.count("#")
}

if (typeof window == "undefined") {
	module.exports = day18
}
