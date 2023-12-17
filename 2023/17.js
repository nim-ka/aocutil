function day17(input, part2) {
	Node.SUPPRESS_PRINTING = true

	let grid = Grid.fromStr(input).num()

	let minWalk = part2 ? 4 : 1
	let maxWalk = part2 ? 10 : 3

	let start1 = new Node(grid.topleft().encode() << 1 | 0)
	let start2 = new Node(grid.topleft().encode() << 1 | 1)
	let end = new Node(grid.bottomright().encode() << 1)

	let nodes = {
		[start1.val]: start1,
		[start2.val]: start2,
		[end.val | 0]: end,
		[end.val | 1]: end
	}

	return new Node().addCxn(start1, 0).addCxn(start2, 0).dijkstraTo(
		end,
		(node) => {
			let hor = node.val & 1
			let pt = Point.decode(node.val >> 1)

			for (let dir of [-1, 1]) {
				for (let i = dir, dist = 0; -maxWalk <= i && i <= maxWalk; i += dir) {
					let newPt = hor ?
						new Point(pt.x, pt.y + i) :
						new Point(pt.x + i, pt.y)

					if (!grid.contains(newPt)) {
						break
					}

					dist += grid.get(newPt)

					if (i >= minWalk || i <= -minWalk) {
						let state = newPt.encode() << 1 | !hor
						node.addCxn(nodes[state] ??= new Node(state), dist)
					}
				}
			}
		}).searchData.dist
}

if (typeof window == "undefined") {
	module.exports = day17
}

