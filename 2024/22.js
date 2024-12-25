function evolve(n) {
	n = (n ^ (n << 6)) & 0xffffff
	n = (n ^ (n >> 5))
	n = (n ^ (n << 11)) & 0xffffff
	return n
}

function day22(input, part2) {
	let scores = {}
	let score = 0

	for (let num of input.split("\n").num()) {
		let digit = 0
		let delta = 0

		let done = new Set()

		for (let j = 0; j < 2000; j++) {
			num = evolve(num)

			if (!part2) {
				continue
			}

			let oldDigit = digit
			let newDigit = num % 10
			digit = newDigit

			delta <<= 8
			delta &= 0xffffffff
			delta |= (newDigit - oldDigit) + 10

			if (j < 4) {
				continue
			}

			if (done.has(delta)) {
				continue
			}
			done.add(delta)

			scores[delta] ??= 0
			scores[delta] += newDigit
			score = Math.max(score, scores[delta])
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
