function day24(input, part2) {
	let boxes = input.split("\n").num()
	let groups = part2 ? 4 : 3

	let weight = boxes.sum() / groups

	let subsets = (weight, i) => {
		if (weight == 0) {
			return { sets: [[0, 1]], minScore: 1 }
		}

		let sets = []
		let minLen = Infinity
		let minScore = Infinity

		for (; i >= 0; i--) {
			if (weight < boxes[i]) {
				continue
			}

			for (let prev of subsets(weight - boxes[i], i - 1).sets) {
				let cur = [prev[0] + 1, prev[1] * boxes[i]]
				if (cur[0] > minLen) {
					continue
				}

				sets.push(cur)

				if (minLen > cur[0]) {
					minLen = cur[0]
					minScore = Infinity
				}

				minScore = Math.min(minScore, cur[1])
			}
		}

		return { sets, minScore }
	}

	return subsets(weight, boxes.length - 1).minScore
}

if (typeof window == "undefined") {
	module.exports = day24
}
