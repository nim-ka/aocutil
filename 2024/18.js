function day18(input, part2) {
	let size = 71
part2=true
	let start = new Point(0, 0)
	let end = new Point(size - 1, size - 1)

	let lines = input.split("\n")
	let blocks = new Map()

	for (let line of lines) {
		blocks.set(line, blocks.size + 1)

		if (!part2 && blocks.size >= 1024) {
			break
		}
	}

	let visit = new BinHeap((p, c) => p[1] < c[1])
	visit.insert([start, 0])

	let seen = new NumericPointSet()

let grid = new Grid(size, size).map((_, pt) => blocks.has(pt.toString()) ? "#" : ".")

	while (visit.data.length) {
		let [pt, score] = visit.extract()

		if (seen.has(pt)) {
			continue
		}
		seen.add(pt)

		if (pt.equals(end)) {
if (part2) {
grid.print("",[...seen],"O")
console.log(score >> 16, lines.slice((score >> 16) - 5, (score >> 16) + 5))
}
			return score
		}

		for (let next of pt.getUnfilteredAdjNeighbors()) {
			if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) {
				continue
			}

			let block = Math.min(10000 - (score >> 16), blocks.get(next.toString()) ?? 0)

			let nextScore = ((10000 - block) << 16) | ((score & 0xFFFF) + 1)
			visit.insert([next, nextScore])
		}
	}
}

if (typeof window == "undefined") {
	module.exports = day18
}
