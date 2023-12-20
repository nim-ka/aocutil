function count_set_bits(n) {
	let i

	for (i = 0; n; i++) {
		n &= n - 1
	}

	return i
}

function day20(input, part2) {
	let nodes = {}
	let cycleStarts = []
	let cycleLens = []
	let ringSize

	for (let line of input.split("\n")) {
		let [id, dests] = line.split(" -> ")
		dests = dests.split(", ")

		if (id == "broadcaster") {
			cycleStarts = dests
		} else {
			let type = id[0]
			let name = id.slice(1)

			nodes[name] = { type, dests, name }
		}
	}

	for (let name of cycleStarts) {
		let node = nodes[name]
		let num = 0
		let next

		for (ringSize = 0; node; ringSize++) {
			let nexts = node.dests.map((e) => nodes[e])

			if (nexts.some((e) => e.type == "&")) {
				num |= 1 << ringSize
			}

			node = nexts.find((e) => e.type == "%")
		}

		cycleLens.push(num)
	}

	if (part2) {
		return cycleLens.lcm()
	}

	let presses = 1000
	let pulses = [presses * (cycleLens.length + 1), presses * cycleLens.length]

	for (let len of cycleLens) {
		let highs = ringSize - count_set_bits(len) + 3
		let bitCount = 0

		for (let i = 0; i < ringSize; i++) {
			let bit = (len >> i) & 1
			let n = ((presses >> i) + 1) >> 1

			bitCount += bit
			pulses[0] += n * (bitCount * 2 + !bit)
			pulses[1] += n * (bitCount * highs + bit)
		}

		pulses[0] -= count_set_bits(presses)
	}

	return pulses[0] * pulses[1]
}

if (typeof window == "undefined") {
	module.exports = day20
}
