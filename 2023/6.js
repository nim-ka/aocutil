function day6(input, part2) {
	if (part2) {
		input = input.replaceAll(" ", "")
	}

	return input.split("\n").map((line) => line.ints()).transpose().map(([time, dist]) => ((Math.sqrt(time * time / 4 - (dist + 0.5)) + (time & 1) / 2) << 1) | (~time & 1)).prod()
}

if (typeof window == "undefined") {
	module.exports = day6
}
