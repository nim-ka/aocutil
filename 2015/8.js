function day8(input, part2) {
	return input.split("\n").sum((str) =>
		part2 ?
			JSON.stringify(str).length - str.length :
			str.length - eval(str).length)
}

if (typeof window == "undefined") {
	module.exports = day8
}
