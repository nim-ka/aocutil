function day19(input, part2) {
	let [substrings, strings] = input.split("\n\n")
	substrings = substrings.split(", ")

	let score = utils.memoize((string) =>
		string ? substrings[part2 ? "sum" : "some"]((e) => string.startsWith(e) && score(string.slice(e.length))) : 1, (e) => e)

	return strings.split("\n").sum(score)
}

if (typeof window == "undefined") {
	module.exports = day19
}
