function day8(input, part2) {
	let [steps, ...paths] = input.match(/[A-Z]+/g)
	let cxns = {}
	let nodes = []

	for (let i = 0; i < paths.length; i += 3) {
		if (part2 ? paths[i][2] == "A" : paths[i] == "AAA") {
			nodes.push(paths[i])
		}

		cxns[paths[i]] = [paths[i + 1], paths[i + 2]]
	}

	let count = 1

	for (let node of nodes) {
		let i = 0

		while (part2 ? node[2] != "Z" : node != "ZZZ") {
			node = cxns[node][+(steps[i++ % steps.length] == "R")]
		}

		count = count.lcm(i)
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day8
}
