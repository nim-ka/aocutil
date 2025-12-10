function day5(input, part2) {
	let [rangesStr, numsStr] = input.split("\n\n")
	let ranges = RangeSet.fromStr(rangesStr).reduceMut()

	if (part2) {
		return ranges.count()
	} else {
		return numsStr.split("\n").count((num) => ranges.has(+num))
	}
}

if (typeof window == "undefined") {
	module.exports = day5
}
