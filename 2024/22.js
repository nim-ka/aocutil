function evolve(n) {
	n = (n ^ (n << 6)) & 0xffffff
	n = (n ^ (n >> 5)) & 0xffffff
	n = (n ^ (n << 11)) & 0xffffff
	return n
}

function day22(input, part2) {
	let nums = input.split("\n").num()

	let scores = {}
	let maxScore = 0

	for (let i = 0; i < nums.length; i++) {
		let delta = 0
		let done = new Set()

		for (let j = 0; j < 2000; j++) {
			let old = nums[i]
			nums[i] = evolve(old)

			if (!part2) {
				continue
			}

			delta <<= 8
			delta &= 0xffffffff
			delta |= (nums[i] % 10 - old % 10) + 10

			if (j < 4) {
				continue
			}

			if (done.has(delta)) {
				continue
			}
			done.add(delta)

			scores[delta] ??= 0
			scores[delta] += nums[i] % 10
			maxScore = Math.max(maxScore, scores[delta])
		}
	}

	return part2 ? maxScore : nums.sum()
}

if (typeof window == "undefined") {
	module.exports = day22
}
