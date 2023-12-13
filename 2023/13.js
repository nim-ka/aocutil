function day13(input, part2) {
	return input.split("\n\n").sum((str) => {
		let grid = Grid.fromStr(str)
		let r
		let c

		out: for (c = grid.width - 1; c > 0; c--) {
			let count = 0

			for (let x = c - 1, nx = c; x >= 0 && nx < grid.width; x--, nx++) {
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

		out: for (r = grid.height - 1; r > 0; r--) {
			let count = 0

			for (let y = r - 1, ny = r; y >= 0 && ny < grid.height; y--, ny++) {
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

		return r * 100 + c
	})
}

if (typeof window == "undefined") {
	module.exports = day13
}
