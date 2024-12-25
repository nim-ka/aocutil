function day22(input, part2) {
	let scores = new Uint32Array(0x100000)
	let score = 0

	let i = 0

	for (let num of input.split("\n").map((e) => +e)) {
		i++

		let digit = 0
		let delta = 0

		for (let j = 0; j < 2000; j++) {
			num ^= num << 6
			num &= 0xFFFFFF
			num ^= num >> 5
			num ^= num << 11
			num &= 0xFFFFFF

			if (part2) {
				let oldDigit = digit
				digit = num % 10

				delta <<= 5
				delta &= 0xFFFFF
				delta |= (digit - oldDigit) + 10

				if (j < 4) {
					continue
				}

				let key = i << 16
				let low = scores[delta] & 0xFFFF

				if (scores[delta] == (key | low)) {
					continue
				}

				low += digit

				scores[delta] = key | low
				score = Math.max(score, low)
			}
		}

		if (!part2) {
			score += num
		}
	}

	return score
}

if (typeof window == "undefined") {
	module.exports = day22
}
