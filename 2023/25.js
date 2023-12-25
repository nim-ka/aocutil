function day25(input) {
	let graph = Graph.fromStr(input, ": ", " ", true)

	for (let node of graph.values()) {
		let removedEdges = []

		for (let i = 0; i < 3; i++) {
			for (let edge of node.furthestBfs().unwrap().windowsGen(2)) {
				edge[0].removeCxn(edge[1])
				edge[1].removeCxn(edge[0])
				removedEdges.push(edge)
			}
		}

		let groupSize = node.exploreBfs().size
		if (groupSize != graph.size) {
			return groupSize * (graph.size - groupSize)
		}

		for (let edge of removedEdges) {
			edge[0].addCxn(edge[1])
			edge[1].addCxn(edge[0])
		}
	}
}

if (typeof window == "undefined") {
	module.exports = day25
}
