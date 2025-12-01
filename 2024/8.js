function day8(input, part2) {
	let grid = Grid.fromStr(input)
	let antennae = Map.groupBy(grid.findIndices((e) => e != "."), (e) => grid.get(e))

	let antinodes = new NumericPointSet()

	for (let pts of antennae.values()) {
		for (let [p1, p2] of pts.unorderedPairGen()) {
			let delta = p2.sub(p1)

			let q1 = part2 ? p1.copy() : p1.sub(delta)
			let q2 = part2 ? p2.copy() : p2.add(delta)

			while (grid.contains(q1)) {
				antinodes.add(q1)

				if (part2) {
					q1.subMut(delta)
				} else {
					break
				}
			}

			while (grid.contains(q2)) {
				antinodes.add(q2)

				if (part2) {
					q2.addMut(delta)
				} else {
					break
				}
			}
		}
	}

	return antinodes.size
}

if (typeof window == "undefined") {
	module.exports = day8
}
