function day11(input, part2) {
	let expand = part2 ? 1000000 : 2
	let grid = Grid.fromStr(input)

	let px = []
	let py = []

	let sx = new Set()
	let sy = new Set()

	grid.forEach((e, pt) => {
		if (e == "#") {
			px.insertSortedAsc(pt.x)
			py.insertSortedAsc(pt.y)

			sx.add(pt.x)
			sy.add(pt.y)
		}
	})

	let xs = [0]
	let ys = [0]

	for (let i = 1; i < grid.width; i++) {
		xs.push(xs[xs.length - 1] + (sx.has(i) ? 1 : expand))
		ys.push(ys[ys.length - 1] + (sy.has(i) ? 1 : expand))
	}

	let xdists = px.sum((x) => xs[x] - xs[px[0]])
	let ydists = py.sum((y) => ys[y] - ys[py[0]])
	let sum = xdists + ydists

	for (let i = 1; i < px.length; i++) {
		xdists -= (px.length - i) * (xs[px[i]] - xs[px[i - 1]])
		ydists -= (px.length - i) * (ys[py[i]] - ys[py[i - 1]])
		sum += xdists + ydists
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day11
}
