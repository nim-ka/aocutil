function day13(input, part2) {
	let graph = new Graph()

	for (let line of input.split("\n")) {
		let [p1, would, gain, n, happiness, units, by, sitting, next, to, p2] = line.split(/[ \.]/)
		n = gain == "gain" ? +n : -n

		let v1 = graph.getDef(p1)
		let v2 = graph.getDef(p2)

		if (!v1.hasCxn(v2)) {
			v1.addCxn(v2, 0)
			v2.addCxn(v1, 0)
		}

		v1.getCxn(v2).weight += -n
		v2.getCxn(v1).weight += -n
	}

	return -(part2 ? graph.tspPath() : graph.tsp()).searchData.dist
}

if (typeof window == "undefined") {
	module.exports = day13
}
