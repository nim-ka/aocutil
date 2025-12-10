function day7(input, part2) {
	let gates = Object.fromEntries(input.split("\n").map((line) => line.split(" -> ").reverse()))

	let value = utils.memoize((wire) => {
		if (!Number.isNaN(+wire)) {
			return +wire
		}

		let gate = gates[wire].split(" ")

		if (gate.length == 1) {
			return value(gate[0])
		}

		if (gate[0] == "NOT") {
			return ~value(gate[1])
		}

		if (gate[1] == "AND") {
			return value(gate[0]) & value(gate[2])
		}

		if (gate[1] == "OR") {
			return value(gate[0]) | value(gate[2])
		}

		if (gate[1] == "LSHIFT") {
			return value(gate[0]) << value(gate[2])
		}

		if (gate[1] == "RSHIFT") {
			return value(gate[0]) >> value(gate[2])
		}
	})

	let a = value("a")
	return part2 ? day7(input.replace(/^.+ -> b$/m, `${a} -> b`), false) : a
}

if (typeof window == "undefined") {
	module.exports = day7
}
