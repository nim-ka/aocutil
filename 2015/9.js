function day9(input, part2) {
	let graph = Graph.fromStr(input, " to ", ", ", " = ", true)

	if (part2) {
		for (let cxn of graph.cxns()) {
			cxn.weight = -cxn.weight
		}
	}

	return Math.abs(graph.tspPath().searchData.dist)
}

if (typeof window == "undefined") {
	module.exports = day9
}
