function day25(input) {
	let graph = Graph.fromStr(input, ": ", " ", true)
	let iter = graph.values()
	let start = iter.next().value

	for (let end of iter) {
		let removedEdges = []

		for (let i = 0; i < 3; i++) {
			let path = start.dijkstra(end)
			for (let edge of path.unwrap().windowsGen(2)) {
				edge[0].removeCxn(edge[1])
				edge[1].removeCxn(edge[0])
				removedEdges.push(edge)
			}
		}

		let visited = new Set()
		if (!start.dijkstra(end, undefined, visited)) {
			return visited.size * (graph.size - visited.size)
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
