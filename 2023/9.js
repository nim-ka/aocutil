function day9(input, part2) {
	let sum = 0

	for (let lines of input.split("\n")) {
		let nums = lines.ints()

		if (part2) {
			nums.reverse()
		}

		for (let i = nums.length; i > 0; i--) {
			sum += nums[nums.length - 1]
			nums = nums.deltas()
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day9
}
