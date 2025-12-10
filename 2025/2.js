function day2(input, part2) {
	let sum = 0
	let seen = new Set()

	for (let range of input.split(",")) {
		let [a, b] = range.split("-")

		let maxUnits = part2 ? b.length : 2

		for (let units = 2; units <= maxUnits; units++) {
			if (a.length % units != 0 && b.length % units != 0) {
				continue
			}

			// a and b don't ever differ by more than 1 so this is fine
			let digits = b.length / units | 0

			let left = +a.slice(0, digits)
			let right = +b.slice(0, digits)

			for (let n = left; n <= right; n++) {
				let rep = +n.toString().repeat(units)

				if (+a <= rep && rep <= +b) {
					if (seen.has(rep)) {
						continue
					}
					seen.add(rep)

					sum += rep
				}
			}
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day2
}
