function day9(input, part2) {
	let points = input.split("\n").map(Point.fromString)
	let pairs = points.unorderedPairGen()

	if (part2) {
		let edges = points.windows(2, true)

		pairs = pairs.filter(([a, b]) => {
			let ul = new Point(Math.min(a.x, b.x), Math.min(a.y, b.y))
			let dr = new Point(Math.max(a.x, b.x), Math.max(a.y, b.y))

			if (dr.x - ul.x < 2 || dr.y - ul.y < 2) {
				return false
			}

			ul.x++
			ul.y++
			dr.x--
			dr.y--

			return !edges.some(([c, d]) => utils.rectIntersects(ul, dr, c, d))
		})
	}

	return pairs.reduce((s, [a, b]) => Math.max(s, (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1)), 0)
}

if (typeof window == "undefined") {
	module.exports = day9
}
