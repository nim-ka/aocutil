function day7(input, part2) {
	let grid = input.split("\n")
	let beams = new Map([[grid[0].indexOf("S"), 1]])
	let splits = 0

	for (let i = 1; i < grid.length; i++) {
		let newBeams = new Map()

		for (let [pos, count] of beams) {
			if (grid[i][pos] == "^") {
				newBeams.set(pos - 1, (newBeams.get(pos - 1) ?? 0) + count)
				newBeams.set(pos + 1, (newBeams.get(pos + 1) ?? 0) + count)
				splits++
			} else {
				newBeams.set(pos, (newBeams.get(pos) ?? 0) + count)
			}
		}

		beams = newBeams
	}

	return part2 ? beams.values().reduce((a, b) => a + b) : splits
}

if (typeof window == "undefined") {
	module.exports = day7
}
