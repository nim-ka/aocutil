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
	let capture = part2 ? "[1-9]|one|two|three|four|five|six|seven|eight|nine" : "[1-9]"
	let regex = new RegExp(`(?=(${capture})).*(${capture})`)

	return input.split("\n").sum((line) => {
		let matches = line.match(regex)
		return lookup[matches[1]] * 10 + lookup[matches[2]]
	})
}

if (typeof window == "undefined") {
	module.exports = day1
}
