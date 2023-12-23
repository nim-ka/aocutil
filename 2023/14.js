function roll(grid, walls, xy, sign, counts) {
	let score = 0

	for (let m = 0; m < walls.length; m++) {
		for (let i = 0; i < walls[m].length - 1; i++) {
			let cur = walls[m][i]
			let next = walls[m][i + 1]
			let count = 0

			for (let n = cur + 1; n < next; n++) {
				let x = xy ? m : n
				let y = xy ? n : m
				if (grid.data[y][x] == "O") {
					grid.data[y][x] = "."
					count++
				}
			}

			if (counts) {
				counts[m] += count
			}

			let start = sign ? next - count : cur + 1;
			let end = sign ? next - 1 : cur + count;

			for (let n = start; n <= end; n++) {
				let x = xy ? m : n
				let y = xy ? n : m
				grid.data[y][x] = "O"
				score += grid.height - y
			}
		}
	}

	return score
}

function day14(input, part2) {
	let grid = Grid.fromStr(input)
	let wallsX = Array(grid.height).fill().map(() => [-1])
	let wallsY = Array(grid.width).fill().map(() => [-1])
	let countsX = Array(grid.height)
	let countsY = Array(grid.width)

	for (let y = 0; y < grid.height; y++) {
		for (let x = 0; x < grid.width; x++) {
			if (grid.get(new Point(x, y)) == "#") {
				wallsX[y].push(x)
				wallsY[x].push(y)
			}
		}
	}

	wallsX.forEach((arr) => arr.push(grid.width))
	wallsY.forEach((arr) => arr.push(grid.height))

	let hashMap = new Map()
	let scores = new Map()

	for (let i = 0; ; i++) {
		let score = roll(grid, wallsY, true, false)

		if (!part2) {
			return score
		}

		countsX.fill(0)
		countsY.fill(0)

		roll(grid, wallsX, false, false)
		roll(grid, wallsY, true, true, countsY)
		score = roll(grid, wallsX, false, true, countsX)

		let hash = countsX.join(",") + "," + countsY.join(",")

		if (hashMap.has(hash)) {
			let start = hashMap.get(hash)
			return scores.get(start + (1000000000 - start - 1) % (i - start))
		}

		hashMap.set(hash, i)
		scores.set(i, score)
	}
}

if (typeof window == "undefined") {
	module.exports = day14
}
