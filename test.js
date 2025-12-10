if (typeof window == "undefined" && process.argv[2] == "test") {
	const fs = require("fs")
	const debug = process.argv.includes("debug")

	const test = function(name, answer, func, ...args) {
		let res = func(...args)
		console.log(`${name}: Got ${res}, expected ${answer}`)

		if (res != answer) {
			console.log(`${name}: FAIL`)
			return false
		}

		if (debug) {
			return true
		}

		let killTime = performance.now() + 10 * 1000
		let avgTime = 0
		let i

		for (i = -1; i < 100; i++) {
			let startTime = performance.now()
			let newRes = func(...args)
			let endTime = performance.now()

			if (newRes != res) {
				console.log(`${name}: FAIL`)
				return false
			}

			if (i >= 0) {
				avgTime = ((avgTime * i) + (endTime - startTime)) / (i + 1)
			}

			if (endTime > killTime) {
				i++
				break
			}
		}

		let colorCode = avgTime < 5 ? "32" : avgTime < 1000 ? "33" : "31"
		console.log(`${name}: \x1b[${colorCode}m${avgTime.toFixed(3)}ms\x1b[0m (avg over ${i} runs)`)

		return true
	}

	const year = 2015
	const last = year < 2025 ? 25 : 12

	for (let i = +process.argv[3] || 1; i <= last; i++) {
		let jsPath = `./${year}/${i}.js`

		if (!fs.existsSync(jsPath)) {
			break
		}

		const func = require(jsPath)
		const input = fs.readFileSync(`./${year}/inputs/${i}`, "utf8").trim()
		const answers = fs.readFileSync(`./${year}/answers/${i}`, "utf8").trim().split("\n-----\n")

		if (i != last) {
			if (!test(`${year} day ${i} part 1`, answers[0], func, input, false)) {
				break
			}

			if (!test(`${year} day ${i} part 2`, answers[1], func, input, true)) {
				break
			}
		} else {
			test(`${year} day ${i}`, answers[0], func, input)
		}
	}
}
