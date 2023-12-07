function type(card) {
	let freqs = card.freqs()
	return freqs.maxVal((e) => e[1]) * 6 - freqs.length
}

function day7(input, part2) {
	let ranks = {
		"A": 14,
		"K": 13,
		"Q": 12,
		"J": 11,
		"T": 10,
		"9": 9,
		"8": 8,
		"7": 7,
		"6": 6,
		"5": 5,
		"4": 4,
		"3": 3,
		"2": 2
	}

	if (part2) {
		ranks["J"] = 1
	}

	return input.split("\n").map((line) => line.split(" ")).sort(([a], [b]) => {
		let fa = a.freqsMap()
		let fb = b.freqsMap()

		if (part2) {
			if (fa.size > 1) {
				let ja = fa.get("J") ?? 0
				fa.delete("J")
				fa.forEach((v, k) => fa.set(k, v + ja))
			}

			if (fb.size > 1) {
				let jb = fb.get("J") ?? 0
				fb.delete("J")
				fb.forEach((v, k) => fb.set(k, v + jb))
			}
		}

		let ta = [...fa].maxVal((e) => e[1]) * 6 - fa.size
		let tb = [...fb].maxVal((e) => e[1]) * 6 - fb.size

		if (ta < tb) {
			return -1
		}

		if (ta > tb) {
			return 1
		}

		for (let i = 0; i < a.length; i++) {
			let ra = ranks[a[i]]
			let rb = ranks[b[i]]

			if (ra < rb) {
				return -1
			}

			if (rb < ra) {
				return 1
			}
		}

		return 0
	}).sum(([_, score], i) => score * (i + 1))
}

if (typeof window == "undefined") {
	module.exports = day7
}
