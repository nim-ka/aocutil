function day21(input, part2) {
	let locs1 = {}
	let locs2 = {}

	Grid.fromArr(["789", "456", "123", " 0A"]).forEach((e, pt) => locs1[e] = pt)
	Grid.fromArr([" ^A", "<v>"]).forEach((e, pt) => locs2[e] = pt)

	return input.split("\n").sum((str) => {
		let segments = str.split(/(?<=A)/g).freqsMap()

		for (let i = 0; i < (part2 ? 26 : 3); i++) {
			let newSegments = new Map()

			let locs = i == 0 ? locs1 : locs2
			let start = locs["A"]
			let block = locs[" "]

			for (let [segment, count] of segments) {
				let src = start

				for (let chr of segment) {
					let dest = locs[chr]

					let xDir = Math.sign(dest.x - src.x)
					let yDir = Math.sign(dest.y - src.y)

					let xDist = Math.abs(dest.x - src.x)
					let yDist = Math.abs(dest.y - src.y)

					let xPath = (xDir == -1 ? "<" : xDir == 1 ? ">" : "").repeat(xDist)
					let yPath = (yDir == -1 ? "^" : yDir == 1 ? "v" : "").repeat(yDist)

					let xBlocked = block.y == src.y && Math.sign(block.x - src.x) == xDir && Math.abs(block.x - src.x) <= xDist
					let yBlocked = block.x == src.x && Math.sign(block.y - src.y) == yDir && Math.abs(block.y - src.y) <= yDist

					let newSegment =
						xBlocked ? yPath + xPath + "A" :
						yBlocked ? xPath + yPath + "A" :
						xPath[0] == "<" ? xPath + yPath + "A" : yPath + xPath + "A"

					newSegments.set(newSegment, (newSegments.get(newSegment) ?? 0) + count)

					src = dest
				}
			}

			segments = newSegments
		}

		return parseInt(str) * segments.entries().sum(([a, b]) => a.length * b)
	})
}

if (typeof window == "undefined") {
	module.exports = day21
}
