function day4(input, part2) {
	let grid = Grid.fromStr(input)
	let count = 0
	let dirs = part2 ? Point.ORIGIN.getUnfilteredDiagNeighbors() : Point.ORIGIN.getUnfilteredAllNeighbors()
	let str = "XMAS"
	let offset = part2 * 2

	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.width; y++) {
			let pt = new Point(x, y)
			if (grid.get(pt) != str[offset]) {
				continue
			}

			let sat = 0

			out: for (let dir of dirs) {
				for (let i = 1; i <= 3; i++) {
					let head = pt.add(dir.mult(i - offset))
					if (!grid.contains(head) || grid.get(head) != str[i]) {
						continue out
					}
				}

				sat++
			}

			count += part2 ? sat == 2 : sat
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day4
}
