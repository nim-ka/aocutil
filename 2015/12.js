function value(obj, part2) {
	let sum = 0

	for (let val of Object.values(obj)) {
		if (part2 && val == "red" && !Array.isArray(obj)) {
			return 0
		}

		if (typeof val == "number") {
			sum += val
		}

		if (typeof val == "object") {
			sum += value(val, part2)
		}
	}

	return sum
}

function day12(input, part2) {
	return value(JSON.parse(input), part2)
}

if (typeof window == "undefined") {
	module.exports = day12
}
