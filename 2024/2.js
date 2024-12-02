function safe(dir, nums, a, b, skip) {
	if (nums.length - b < 1) {
		return true
	}

	if (skip && safe(dir, nums, a, b + 1, false)) {
		return true
	}

	if (a > -1) {
		let diff = dir ? +nums[b] - +nums[a] : +nums[a] - +nums[b]
		if (diff < 1 || diff > 3) {
			return false
		}
	}

	return safe(dir, nums, b, b + 1, skip)
}

function day2(input, part2) {
	return input.split("\n").count((line) => {
		let nums = line.split(" ")
		return safe(true, nums, -1, 0, part2) || safe(false, nums, -1, 0, part2)
	})
}

if (typeof window == "undefined") {
	module.exports = day2
}
