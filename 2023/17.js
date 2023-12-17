function encode(state) {
	return state.pos.x << 16 | state.pos.y << 8 | (state.dir.x + 1) << 6 | (state.dir.y + 1) << 4 | state.counter
}

function add_cxn(node, nodes, grid, newDir, newCounter) {
	let state = node.val
	let newPos = state.pos.add(newDir)

	if (grid.contains(newPos)) {
		let newState = { pos: newPos, dir: newDir, counter: newCounter }
		node.addCxn(nodes[encode(newState)] ??= new Node(newState), grid.get(newPos))
	}
}

function day17(input, part2) {
	Node.SUPPRESS_PRINTING = true

	let grid = Grid.fromStr(input).num()
	let dest = grid.bottomright()

	let start = new Node({ pos: grid.topleft(), dir: Point.RIGHT, counter: 1 })
	let nodes = {}

	return start.dijkstraTo(
		(node) => node.val.pos.equals(dest),
		(node) => {
			if (node.val.counter < (part2 ? 10 : 3)) {
				add_cxn(node, nodes, grid, node.val.dir, node.val.counter + 1)
			}

			if (node.val.counter > (part2 ? 3 : 0)) {
				add_cxn(node, nodes, grid, node.val.dir.ccwConst, 1)
				add_cxn(node, nodes, grid, node.val.dir.cwConst, 1)
			}
		}).searchData.dist
}

if (typeof window == "undefined") {
	module.exports = day17
}
