function day3(input, part2) {
	let grid = Grid.fromStr(input)
	let digits = "0123456789"

	let numbers = new Set()
	let sum = 0

	grid.forEach((e, pt) => {
		if (part2 && e != "*") {
			return
		}

		if (e == "." || digits.includes(e)) {
			return
		}

		let nearNumbers = new Map()

		for (let neighbor of grid.getAllNeighbors(pt)) {
			if (digits.includes(grid.get(neighbor))) {
				nearNumbers.delete(neighbor.left().toString())
				nearNumbers.set(neighbor.toString(), neighbor)
			}
		}

		if (part2 && nearNumbers.size != 2) {
			return
		}

		let toAdd = 0

		for (let [_, pt] of nearNumbers) {
			let cur

			while (digits.includes(cur = grid.getDef(pt = pt.left(), "."))) {}

			let number = ""

			while (digits.includes(cur = grid.getDef(pt = pt.right(), "."))) {
				number += cur
			}

			let key = pt.toString()

			if (!numbers.has(key)) {
				if (part2) {
					toAdd = (toAdd || 1) * +number
				} else {
					toAdd += +number
				}

				numbers.add(key)
			}
		}

		sum += toAdd
	})

	return sum
}

if (typeof window == "undefined") {
	module.exports = day3
}
