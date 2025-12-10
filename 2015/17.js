function day17(input, part2) {
	let containers = input.split("\n").num()
	let target = 150

	let sets = []

	for (let i = 0; i < (1 << containers.length); i++) {
		let set = []
		let volume = 0

		for (let j = 0; j < containers.length; j++) {
			if (!(i & (1 << j))) {
				continue
			}

			set.push(j)
			volume += containers[j]

			if (volume > target) {
				break
			}
		}

		if (volume == target) {
			sets.push(set)
		}
	}

	if (part2) {
		let min = sets.minVal((set) => set.length)
		sets = sets.filter((set) => set.length == min)
	}

	return sets.length
}

if (typeof window == "undefined") {
	module.exports = day17
}
