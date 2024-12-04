function day4(input, part2) {
	let grid = Grid.fromStr(input)
	let count = 0
	let dirs = part2 ? Point.ORIGIN.getUnfilteredDiagNeighbors() : Point.ORIGIN.getUnfilteredAllNeighbors()

	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.width; y++) {
			let pt = new Point(x, y)
			if (grid.get(pt) != (part2 ? "A" : "X")) {
				continue
			}

			if (part2) {
				let sat = 0

				for (let dir of dirs) {
					if (grid.getDef(pt.add(dir)) == "M" && grid.getDef(pt.sub(dir)) == "S") {
						sat++
						if (sat == 2) {
							break
						}
					}
				}

				count += sat == 2
			} else {
				out: for (let dir of dirs) {
					for (let i = 1; i < "XMAS".length; i++) {
						let head = pt.add(dir.mult(i))
						if (!grid.contains(head) || grid.get(head) != "XMAS"[i]) {
							continue out
						}
					}

					count++
				}
			}
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day4
}
