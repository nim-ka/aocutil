if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")

	function test(name, answer, func, ...args) {
		console.time(name)
		let res = func(...args)
		console.timeEnd(name)

		console.log(`${name}: Got ${res}, expected ${answer}`)

		if (res == answer) {
			console.log(`${name}: SUCCESS`)
		} else {
			console.error(`${name}: FAIL`)
			process.exit(1)
		}
	}

	const year = "2023"

	for (let i = +process.argv[3] || 1; i <= 2; i++) {
		const func = require(`./${year}/${i}.js`)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8")
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").split("\n-----\n")

		if (i != 25) {
			test(`${year} day ${i} part 1`, answers[0], func, input, false)
			test(`${year} day ${i} part 2`, answers[1], func, input, true)
		} else {
			test(`${year} day ${i}`, answers[0], func, input)
		}
	}
}
