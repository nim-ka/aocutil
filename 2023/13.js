function day13(input, part2) {
	return input.split("\n\n").sum((str) => {
		let grid = Grid.fromStr(str)
		let idx

		out: for (idx = grid.width - 1; idx > 0; idx--) {
			let count = 0

			for (let x = idx - 1, nx = idx; x >= 0 && nx < grid.width; x--, nx++) {
				for (let y = 0; y < grid.height; y++) {
					if (grid.get(new Point(x, y)) != grid.get(new Point(nx, y))) {
						if (++count > part2) {
							continue out
						}
					}
				}
			}

			if (count == part2) {
				break
			}
		}

		if (idx) {
			return idx
		}

		out: for (idx = grid.height - 1; idx > 0; idx--) {
			let count = 0

			for (let y = idx - 1, ny = idx; y >= 0 && ny < grid.height; y--, ny++) {
				for (let x = 0; x < grid.width; x++) {
					if (grid.get(new Point(x, y)) != grid.get(new Point(x, ny))) {
						if (++count > part2) {
							continue out
						}
					}
				}
			}

			if (count == part2) {
				break
			}
		}

		return idx * 100
	})
}

if (typeof window == "undefined") {
	module.exports = day13
}
