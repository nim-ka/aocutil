let digitChars = "0123456789"

function day3(input, part2) {
	let grid = Grid.fromStr(input)

	let building = false
	let numStart
	let numEnd
	let cur = ""

	let oneGears = new NumericPointMap()
	let twoGears = new NumericPointMap()
	let badGears = new NumericPointSet()
	let sum = 0

	grid.forEach((e, pt) => {
		if (!building) {
			if (digitChars.includes(e)) {
				building = true
				numStart = pt
				cur = ""
			} else {
				return
			}
		}

		if (pt.y == numStart.y && digitChars.includes(e)) {
			cur += e
			numEnd = pt
			return
		}

		building = false

		for (let y = numStart.y - 1; y <= numStart.y + 1; y++) {
			for (let x = numStart.x - 1; x <= numEnd.x + 1; x++) {
				if (y == numStart.y && x >= numStart.x && x <= numEnd.x) {
					continue
				}

				let pt = new Point(x, y)
				let val = grid.getDef(pt, ".")

				if (!part2 && val != "." && !digitChars.includes(e)) {
					sum += +cur
					return
				}

				if (part2 && val == "*" && !badGears.has(pt)) {
					if (twoGears.has(pt)) {
						sum -= twoGears.get(pt)
						twoGears.delete(pt)
						badGears.add(pt)
					} else if (oneGears.has(pt)) {
						let val = oneGears.get(pt) * +cur
						sum += val
						oneGears.delete(pt)
						twoGears.set(pt, val)
					} else {
						oneGears.set(pt, +cur)
					}
				}
			}
		}
	})

	return sum
}

if (typeof window == "undefined") {
	module.exports = day3
}
