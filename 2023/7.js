const ranks = {
	"A": 14,
	"K": 13,
	"Q": 12,
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

const value = utils.memoize(function(hand) {
	let freqs = new Map()
	let max = 0

	for (let card of hand) {
		let count = (freqs.get(card) ?? 0) + 1
		freqs.set(card, count)

		if (max < count && card != "_") {
			max = count
		}
	}

	max += freqs.get("_") ?? 0
	freqs.delete("_")

	let value = (max << 3) - (freqs.size || 1)

	for (let card of hand) {
		value <<= 4
		value |= ranks[card]
	}

	return value
})

function day7(input, part2) {
	ranks["J"] = part2 ? 1 : 11

	let hands = input.split("\n").map((line) => line.split(" "))
	let sorted = []

	out: for (let [hand, score] of hands) {
		if (part2) {
			hand = hand.replaceAll("J", "_")
		}

		let newValue = value(hand, ranks)

		for (let i = 0; i < sorted.length; i++) {
			if (sorted[i][0] > newValue) {
				sorted.splice(i, 0, [newValue, +score])
				continue out
			}
		}

		sorted.push([newValue, +score])
	}

	return sorted.sum(([_, score], i) => score * (i + 1))
}

if (typeof window == "undefined") {
	module.exports = day7
}
