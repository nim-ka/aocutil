function day5(input, part2) {
	let parts = input.split("\n\n")

	let seeds = parts.shift().ints()
	let ranges = new RangeSet()
	let maps = []

	for (let i = 0; i < seeds.length; i += part2 ? 2 : 1) {
		ranges.addRangeMut(new Range(seeds[i], part2 ? seeds[i] + seeds[i + 1] : seeds[i] + 1))
	}

	for (let part of parts) {
		let newRanges = new RangeSet()
		let ints = part.ints()
		let map = []

		for (let i = 0; i < ints.length; i += 3) {
			let src = new Range(ints[i + 1], ints[i + 1] + ints[i + 2])
			let dest = new Range(ints[i], ints[i] + ints[i + 2])
			map.push({ src: src, dest: dest })
		}

		for (let range of ranges.ranges) {
			let outside = range.set()

			for (let { src, dest } of map) {
				let offset = dest.x - src.x
				let inside = src.intersection(range)

				if (inside) {
					newRanges.addRangeMut(new Range(inside.x + offset, inside.y + offset))
					outside.subRangeMut(inside)
				}
			}

			for (let newRange of outside.ranges) {
				newRanges.addRangeMut(newRange)
			}
		}

		ranges = newRanges.reduceMut()
	}

	return ranges.x
}

if (typeof window == "undefined") {
	module.exports = day5
}
