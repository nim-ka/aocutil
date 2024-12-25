function day23(input, part2) {
	let graph = Graph.fromStr(input, "-", "\0", "\0", true)

	if (part2) {
		out: for (let node of graph.values()) {
			let party = new Set(node.cxns.keys())
			let size = party.size - 1

			for (let node2 of party) {
				if (party.intersection(node2.cxns).size < size - 1) {
					party.delete(node2)

					if (party.size < size) {
						continue out
					}
				}
			}

			return [...party, node].map((node) => node.name).sort().join(",")
		}
	} else {
		let count = 0

		for (let [name, node] of graph) {
			if (!name.startsWith("t")) {
				continue
			}

			let neighbors = node.cxns.keys().toArray()

			for (let i = 0; i < neighbors.length; i++) {
				for (let j = i + 1; j < neighbors.length; j++) {
					count += neighbors[i].cxns.has(neighbors[j])
				}

				neighbors[i].cxns.delete(node)
			}
		}

		return count
	}
}

if (typeof window == "undefined") {
	module.exports = day23
}
