function day12(input, part2) {
	let grid = Grid.fromStr(input)
	let regions = new UnionFind()

	grid.forEach((e, pt) => {
		let key = pt.encode()
		regions.add(key)

		for (let pt2 of grid.getAdjNeighbors(pt)) {
			let key2 = pt2.encode()
			if (regions.has(key2) && grid.get(pt2) == e) {
				regions.connect(key, key2)
			}
		}
	})

	let sum = 0

	for (let region of regions) {
		region = region.map((n) => Point.decode(n))

		let key = grid.get(region[0])
		let neighbors = region.flatMap((pt) =>
			Point.DIRS.map((dir) => [dir, pt.add(dir)]).filter(([_, pt]) => grid.getDef(pt) != key))

		if (part2) {
			let sides = new UnionFind()

			for (let neighbor of neighbors) {
				sides.addAndConnectIf(neighbor, (a, b) => a[0] == b[0] && a[1].isAdjacent(b[1]) == 1)
			}

			sum += region.length * sides.numSets
		} else {
			sum += region.length * neighbors.length
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day12
}
