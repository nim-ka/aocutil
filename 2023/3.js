let digits = "0123456789"

function isSymbol(char) {
	return char != "." && !digits.includes(char)
}

function day3(input, part2) {
	let grid = Grid.fromStr(input)

	let building = false
	let numStart
	let numEnd
	let cur = ""

	let numbers = new Map()

	grid.forEach((e, pt) => {
		if (!building && digits.includes(e)) {
			building = true
			numStart = pt
		}

		if (building) {
			if (pt.y != numStart.y || !digits.includes(e)) {
				let symbols = []

				for (let y = numStart.y - 1; y <= numStart.y + 1; y++) {
					for (let x = numStart.x - 1; x <= numEnd.x + 1; x++) {
						if (y == numStart.y && x >= numStart.x && x <= numEnd.x) {
							continue
						}

						let pt = new Point(x, y)

						if (isSymbol(grid.getDef(pt, "."))) {
							symbols.push(pt)
						}
					}
				}

				if (symbols.length) {
					numbers.set(symbols, +cur)
				}

				building = false
				cur = ""
			} else {
				cur += e
				numEnd = pt
			}
		}
	})

	if (!part2) {
		let sum = 0

		for (let num of numbers.values()) {
			sum += num
		}

		return sum
	}

	let gears = new Map()

	for (let [symbols, num] of numbers) {
		for (let symbol of symbols) {
			if (grid.get(symbol) != "*") {
				continue
			}

			let key = symbol.toString()

			if (!gears.has(key)) {
				gears.set(key, [])
			}

			gears.get(key).push(num)
		}
	}

	let sum = 0

	for (let nums of gears.values()) {
		if (nums.length == 2) {
			sum += nums[0] * nums[1]
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day3
}
