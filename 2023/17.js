function day17(input, part2) {
	Node.SUPPRESS_PRINTING = true

	let grid = Grid.fromStr(input).num()

	let minWalk = part2 ? 4 : 1
	let maxWalk = part2 ? 10 : 3

	let start1 = new Node(0 << 16 | 0 << 8 | 0)
	let start2 = new Node(0 << 16 | 0 << 8 | 1)
	let end = new Node((grid.width - 1) << 16 | (grid.height - 1) << 8)

	let nodes = {
		[start1.val]: start1,
		[start2.val]: start2,
		[end.val | 0]: end,
		[end.val | 1]: end
	}

	return new Node().addCxn(start1, 0).addCxn(start2, 0).dijkstraTo(
		end,
		(node) => {
			let x = node.val >> 16
			let y = node.val >> 8 & 0xFF
			let hor = node.val & 1

			for (let dir of [-1, 1]) {
				for (let i = dir, dist = 0; -maxWalk <= i && i <= maxWalk; i += dir) {
					let newX = hor ? x : x + i
					let newY = hor ? y + i : y

					if (newX < 0 || newX >= grid.width || newY < 0 || newY >= grid.height) {
						break
					}

					dist += grid.data[newY][newX]

					if (i >= minWalk || i <= -minWalk) {
						let state = newX << 16 | newY << 8 | !hor
						node.addCxn(nodes[state] ??= new Node(state), dist)
					}
				}
			}
		}).searchData.dist
}

if (typeof window == "undefined") {
	module.exports = day17
}

