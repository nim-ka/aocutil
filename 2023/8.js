function day8(input, part2) {
	let [steps, ...paths] = input.match(/[A-Z]+/g)
	let cxns = {}
	let nodes = []

	for (let i = 0; i < paths.length; i += 3) {
		if (part2 ? paths[i].endsWith("A") : paths[i] == "AAA") {
			nodes.push(paths[i])
		}

		let left = paths[i + 1]
		let right = paths[i + 2]

		if (part2 && left.endsWith("Z")) {
			left = "ZZZ"
		}

		if (part2 && right.endsWith("Z")) {
			right = "ZZZ"
		}

		cxns[paths[i]] = [left, right]
	}

	let count = 1

	for (let node of nodes) {
		let i = 0

		while (node != "ZZZ") {
			node = cxns[node][+(steps[i++ % steps.length] == "R")]
		}

		count = count.lcm(i)
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day8
}
