let count = utils.memoize((num, ticks) => {
	if (ticks == 0) {
		return 1
	}

	if (num == 0) {
		return count(1, ticks - 1)
	}

	let str = num.toString()
	if (str.length % 2 == 0) {
		let left = +str.slice(0, str.length / 2)
		let right = +str.slice(str.length / 2)
		return count(left, ticks - 1) + count(right, ticks - 1)
	}

	return count(num * 2024, ticks - 1)
})

function day11(input, part2) {
	return input.posints().sum((num) => count(num, part2 ? 75 : 25))
}

if (typeof window == "undefined") {
	module.exports = day11
}
