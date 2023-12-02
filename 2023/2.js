function day2(input, part2) {
	let count = 0

	for (let line of input.split("\n")) {
		let id = +line.match(/\d+/)[0]
		let counts = line.match(/\d+ (red|green|blue)/g)

		let colors = counts.reduce((dict, count) => {
			let [num, color] = count.split(" ")
			dict[color] = Math.max(dict[color], +num)
			return dict
		}, {
			red: 0,
			green: 0,
			blue: 0
		})

		if (part2) {
			count += colors.red * colors.green * colors.blue
		} else {
			count += colors.red <= 12 && colors.green <= 13 && colors.blue <= 14 ? id : 0
		}
	}

	return count
}

if (typeof window == "undefined") {
	module.exports = day2
}
