function day8(input, part2) {
	let points = input.split("\n").map(Point.fromString)
	let sets = new UnionFind(points)

	let pairs = points.unorderedPair().sortNumAsc(([a, b]) => a.squaredDist(b))
	let lastProd;

	for (let i = 0; i < (part2 ? pairs.length : 1000); i++) {
		let [a, b] = pairs[i]
		let numSets = sets.numSets

		sets.connect(a, b)

		if (sets.numSets != numSets) {
			lastProd = a.x * b.x
		}
	}

	return part2 ? lastProd : [...sets].map((set) => set.length).sortNumDesc().slice(0, 3).prod()
}

if (typeof window == "undefined") {
	module.exports = day8
}
