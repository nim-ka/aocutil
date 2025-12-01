function day24(input, part2) {
	let [init, gates] = input.split("\n").splitOn("")

	let wires = {}
	let numBits = 0

	for (let line of init) {
		let [wire, bit] = line.split(": ")
		wires[wire] = +bit
		numBits = +wire.slice(1) + 1
	}

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

	let z = []
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

		let out = res.out
		wires[out] =
			op == "AND" ? wires[in0] & wires[in1] :
			op == "XOR" ? wires[in0] ^ wires[in1] : wires[in0] | wires[in1]

		if (out[0] == "z") {
			z.unshift(wires[out])
		}

		return { in0, in1, out }
	}

	let carry

	for (let bit = 0; bit < numBits; bit++) {
		let x = "x" + bit.toString().padStart(2, "0")
		let y = "y" + bit.toString().padStart(2, "0")

		let low = expect(x, "XOR", y).out
		let newCarry = expect(x, "AND", y).out

		if (bit > 0) {
			({ in0: carry, in1: low } = expect(carry, "XOR", low))

			let cont = expect(carry, "AND", low).out
			carry = expect(newCarry, "OR", cont).out
		} else {
			carry = newCarry
		}
	}

	return part2 ? [...swaps].sort().join(",") : z.reduce((a, b) => a * 2 + b)
}

if (typeof window == "undefined") {
	module.exports = day24
}
