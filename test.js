if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")

	const year = "2021"

	for (let i = 1; i <= 18; i++) {
		const func = require(`./${year}/${i}.js`)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8")
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").split("\n-----\n")

		let res = func(input, false)

		console.log(`${year} day ${i} part 1: Got ${res}, expected ${answers[0]}`)

		if (res == answers[0]) {
			console.log(`${year} day ${i} part 1: SUCCESS`)
		} else {
			console.error(`${year} day ${i} part 1: FAIL`)
			process.exit(1)
		}

		if (i != 25) {
			res = func(input, true)

			console.log(`${year} day ${i} part 2: Got ${res}, expected ${answers[1]}`)

			if (res == answers[1]) {
				console.log(`${year} day ${i} part 2: SUCCESS`)
			} else {
				console.error(`${year} day ${i} part 2: FAIL`)
				process.exit(1)
			}
		}
	}
}
