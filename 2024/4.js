function day4(input, part2) {
	let grid = Grid.fromStr(input)

	let dirs = part2 ? Point.ORIGIN.getUnfilteredDiagNeighbors() : Point.ORIGIN.getUnfilteredAllNeighbors()
	let offset = part2 ? 2 : 0

	let str = "XMAS"
	let center = str[offset]

	let count = 0

	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
			let pt = new Point(x, y)
			if (grid.get(pt) != center) {
				continue
			}

			let sat = 0
			dirs_loop: for (let dir of dirs) {
				for (let i = 1; i <= 3; i++) {
					let mult = i - offset
					if (mult) {
						let head = pt.add(dir.mult(mult))
						if (!grid.contains(head) || grid.get(head) != str[i]) {
							continue dirs_loop
						}
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
