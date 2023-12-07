const lookup = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9,
	"1": 1,
	"2": 2,
	"3": 3,
	"4": 4,
	"5": 5,
	"6": 6,
	"7": 7,
	"8": 8,
	"9": 9
}

function day1(input, part2) {
	return input.split("\n").sum((line) => {
		let matches = [...line.matchAll(new RegExp(`(?=(${part2 ? Object.keys(lookup).join("|") : "[1-9]"}))`, "g"))]
		return lookup[matches[0][1]] * 10 + lookup[matches.at(-1)[1]]
	})
}

if (typeof window == "undefined") {
	module.exports = day1
}
