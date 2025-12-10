function day11(input, part2) {
	let pass = input

	let next = Object.fromEntries(alpha.split("").map((e, i) => [e, alpha[(i + 1) % alpha.length]]))

	let r = new RegExp(alpha.split("").windows(3).map((e) => e.join("")).join("|"))
	while (/[iol]/.test(pass) || !/(.)\1.*(?!\1)(.)\2/.test(pass) || !r.test(pass) || part2--) {
		pass = pass.split("")

		for (let i = pass.length - 1; i >= 0; i--) {
			pass[i] = next[pass[i]]

			if (pass[i] != "a") {
				break
			}
		}

		pass = pass.join("")
	}

	return pass
}

if (typeof window == "undefined") {
	module.exports = day11
}
