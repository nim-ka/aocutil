function day24(input, part2) {
	let [init, gates] = input.split("\n").splitOn("")

	if (part2) {
		let gatesMap = new Map()

		for (let line of gates) {
			let [in0, op, in1, _, out] = line.split(" ")

			let gates0 = gatesMap.get(in0)
			if (!gates0) {
				gatesMap.set(in0, gates0 = new Map())
			}

			let gates1 = gatesMap.get(in1)
			if (!gates1) {
				gatesMap.set(in1, gates1 = new Map())
			}

			gates0.set(op, { other: in1, out })
			gates1.set(op, { other: in0, out })
		}

		let swaps = new Set()

		function expect(in0, op, in1) {
			let res = gatesMap.get(in0)?.get(op)

			if (!res) {
				res = gatesMap.get(in1).get(op)
				swaps.add(in0)
				swaps.add(res.other)
				in0 = res.other
			} else if (res.other != in1) {
				swaps.add(in1)
				swaps.add(res.other)
				in1 = res.other
			}

			return { in0, in1, out: res.out }
		}

		let carry

		for (let bit = 0; swaps.size < 8; bit++) {
			let x = "x" + bit.toString().padStart(2, "0")
			let y = "y" + bit.toString().padStart(2, "0")

			let newCarry = gatesMap.get(x).get("AND").out

			if (bit > 0) {
				let low = gatesMap.get(x).get("XOR").out;
				({ in0: carry, in1: low } = expect(carry, "XOR", low))

				let cont
				({ in0: carry, in1: low, out: cont } = expect(carry, "AND", low));
				({ in0: newCarry, in1: cont, out: newCarry } = expect(newCarry, "OR", cont))
			}

			carry = newCarry
		}

		return [...swaps].sort().join(",")
	} else {
		let wires = {}

		for (let line of init) {
			let [wire, bit] = line.split(": ")
			wires[wire] = () => +bit
		}

		for (let line of gates) {
			let [in0, op, in1, _, out] = line.split(" ")
			wires[out] = {
				"AND": () => wires[in0]() & wires[in1](),
				"OR": () => wires[in0]() | wires[in1](),
				"XOR": () => wires[in0]() ^ wires[in1]()
			}[op]
		}

		let z = ""
		let bit = 0

		for (let bit = 0; ; bit++) {
			let key = "z" + bit.toString().padStart(2, "0")
			if (!(key in wires)) {
				break
			}

			z = wires[key]().toString() + z
		}

		return parseInt(z, 2)
	}
}

if (typeof window == "undefined") {
	module.exports = day24
}
