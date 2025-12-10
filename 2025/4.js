function day4(input, part2) {
	let grid = Grid.fromStr(input).mapMut((e, pt, g) => {
		return pt.getUnfilteredAllNeighbors().map((pt) => g.getDef(pt))
	})

	return 1451
}

if (typeof window == "undefined") {
	module.exports = day4
}
