function day21(input, part2) {
	let locs = [
		Grid.fromArr(["789", "456", "123", " 0A"]),
		Grid.fromArr([" ^A", "<v>"])].map((grid) => new Map(grid.entries().map(([pt, e]) => [e, pt])))

	let caches = locs.map(() => new Map())

	return input.split("\n").sum((str) => {
		let segments = str.split(/(?<=A)/g).freqsMap()

		for (let i = 0; i < (part2 ? 26 : 3); i++) {
			let newSegments = new Map()

			let loc = locs[+(i > 0)]
			let cache = caches[+(i > 0)]

			let start = loc.get("A")
			let block = loc.get(" ")

			for (let [segment, count] of segments) {
				if (!cache.has(segment)) {
					let children = []
					let src = start

					for (let chr of segment) {
						let dest = loc.get(chr)

						let xDir = Math.sign(dest.x - src.x)
						let yDir = Math.sign(dest.y - src.y)

						let xDist = Math.abs(dest.x - src.x)
						let yDist = Math.abs(dest.y - src.y)

						let xPath = (xDir == -1 ? "<" : xDir == 1 ? ">" : "").repeat(xDist)
						let yPath = (yDir == -1 ? "^" : yDir == 1 ? "v" : "").repeat(yDist)

						let xBlocked = block.y == src.y && Math.sign(block.x - src.x) == xDir && Math.abs(block.x - src.x) <= xDist
						let yBlocked = block.x == src.x && Math.sign(block.y - src.y) == yDir && Math.abs(block.y - src.y) <= yDist

						children.push(
							xBlocked ? yPath + xPath + "A" :
							yBlocked ? xPath + yPath + "A" :
							xPath[0] == "<" ? xPath + yPath + "A" : yPath + xPath + "A")

						src = dest
					}

					cache.set(segment, children)
				}

				for (let newSegment of cache.get(segment)) {
					newSegments.set(newSegment, (newSegments.get(newSegment) ?? 0) + count)
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
