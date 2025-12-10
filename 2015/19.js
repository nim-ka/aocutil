function day19(input, part2) {
	input = input.replace(/(\w)(?=[A-Z])/g, "$1 ")

	let [rules, str] = input.split("\n\n")
	rules = rules.split("\n").map((line) => line.split(" => "))

	if (!part2) {
		str = str.split(" ")

		let nexts = new Set()

		for (let [prev, next] of rules) {
			next = next.split(" ")

			for (let i = 0; i < str.length; i++) {
				if (str[i] == prev) {
					nexts.add(str.toSpliced(i, 1, ...next).join(" "))
				}
			}
		}

		return nexts.size
	}

	let steps = 0

	while (str != "e") {
		for (let [prev, next] of rules) {
			let oldstr = str

			str = str.replace(next, prev)

			if (str != oldstr) {
				steps++
			}
		}
	}

	return steps
}

if (typeof window == "undefined") {
	module.exports = day19
}
