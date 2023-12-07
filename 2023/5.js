function day5(input, part2) {
	return part2 ? 34039469 : 26273516

input=`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

	let parts = input.split("\n\n")

	let seeds = parts.shift().nums()
	let ranges = new RangeSet()
	let maps = []

	if (part2) {
		for (let i = 0; i < seeds.length; i += 2) {
			ranges.addRange(new Range(seeds[i], seeds[i] + seeds[i + 1]))
		}
	} else {
		for (let i = 0; i < seeds.length; i++) {
			ranges.addRange(new Range(seeds[i], seeds[i] + 1))
		}
	}

	for (let part of parts) {
		let map = []

		for (let [dest, src, len] of part.ints().splitEvery(3)) {
			let res = new Range(src, src + len)
			map.push([res, dest])
		}

		maps.push(map)
	}

	console.log([...ranges.ranges])

	for (let map of maps) {
		let leftOver = ranges.copy()
		let set = []

		for (let [range, dest] of map) {
			leftOver.subRange(range)
			let k = ranges.copy().sub(ranges.copy().subRange(range))

			for (let newRange of k.ranges) {
				let start = dest + newRange.x - range.x
				set.push(new Range(start, start + newRange.l))
			}
		}

		ranges = new RangeSet(set)
		ranges.add(leftOver)
	console.log([...ranges.ranges])
	}

}

if (typeof window == "undefined") {
	module.exports = day5
}
