function day2(input, part2) {
	return input.split("\n").sum((line) => {
		let [l, w, h] = line.posints()
		return part2 ?
			l * w * h + 2 * Math.min(l + w, w + h, l + h) :
			2 * (l * w + w * h + l * h) + Math.min(l * w, w * h, l * h)
	})
}

if (typeof window == "undefined") {
	module.exports = day2
}
