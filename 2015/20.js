function day20(input, part2) {
	let n = 1

	while (true) {
		let elves = utils.factors(n)

		if (part2) {
			elves = elves.filter((f) => f * 50 >= n)
		}

		if (elves.sum() * (part2 ? 11 : 10) > +input) {
			return n
		}

		n++
	}
}

if (typeof window == "undefined") {
	module.exports = day20
}
