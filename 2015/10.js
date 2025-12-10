function round(s) {
	let t = [1, s[0]]

	for (let i = 1; i < s.length; i++) {
		if (s[i] == s[i - 1]) {
			t[t.length - 2]++
		} else {
			t.push(1, s[i])
		}
	}

	return t
}

function day10(input, part2) {
	return round.repeated(part2 ? 50 : 40)(input.split("").map(Number)).length
}

if (typeof window == "undefined") {
	module.exports = day10
}
