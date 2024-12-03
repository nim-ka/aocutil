function day3(input, part2) {
	if (part2) {
		input = input.replace(/don't\(\).+?(do\(\)|$)/gs, "")
	}

	return [...input.matchAll(/mul\((\d+),(\d+)\)/g)].sum(([_, a, b]) => a * b)
}

if (typeof window == "undefined") {
	module.exports = day3
}
