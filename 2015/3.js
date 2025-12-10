function day3(input, part2) {
	let count = part2 ? 2 : 1

	let instrs = input.splitEvery(count)
	let pts = Array(count).fill().map(() => new Point(0, 0))

	let visited = new NumericPointSet(pts)

	for (let instr of instrs) {
		for (let i = 0; i < count; i++) {
			visited.add(pts[i].addMut(Point.ARROWS[instr[i]]))
		}
	}

	return visited.size
}

if (typeof window == "undefined") {
	module.exports = day3
}
