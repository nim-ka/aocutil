function day3(input, part2) {
	return input.split("\n").sum((line) => {
		let num = 0

		for (let i = part2 ? 12 : 2; i > 0; i--) {
			let max = 0
			let idx = 0

			for (let j = 0; j <= line.length - i; j++) {
				if (max < +line[j]) {
					max = +line[j]
					idx = j
				}
			}

			num = num * 10 + max
			line = line.slice(idx + 1)
		}

		return num
	})
}

if (typeof window == "undefined") {
	module.exports = day3
}
