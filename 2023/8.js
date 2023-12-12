function day8(input, part2) {
	let [steps, ...paths] = input.match(/[A-Z]+/g)
	let cxns = {}
	let nodes = []

	steps = steps.split("").map((e) => +(e == "R"))

	for (let i = 0; i < paths.length; i += 3) {
		if (part2 ? paths[i][2] == "A" : paths[i] == "AAA") {
			nodes.push(paths[i])
		}

		cxns[paths[i]] = [paths[i + 1], paths[i + 2]]
	}

	let count = steps.length

	for (let node of nodes) {
		let cycles = 0

		while (node[2] != "Z") {
			for (let step of steps) {
				node = cxns[node][step]
			}

			cycles++
		}

		count = count.lcm(cycles)
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day8
}
