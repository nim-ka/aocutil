function day5(input, part2) {
	return input.split("\n").count((line) =>
		part2 ?
			/(..).*\1/.test(line) && /(.).\1/.test(line) :
			line.match(/([aeiou])/g)?.length >= 3 && /(.)\1/.test(line) && !/ab|cd|pq|xy/.test(line))
}

if (typeof window == "undefined") {
	module.exports = day5
}
