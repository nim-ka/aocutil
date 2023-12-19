function parse_flow(flows, name, ranges) {
	if (name == "A") {
		return [ranges]
	}

	let flow = flows[name]
	let successes = []
	let cur = {
		x: ranges.x.copy(),
		m: ranges.m.copy(),
		a: ranges.a.copy(),
		s: ranges.s.copy()
	}

	for (let [chr, rangeYes, rangeNo, dest] of flow) {
		if (dest != "R") {
			let overlap = {
				x: cur.x.copy(),
				m: cur.m.copy(),
				a: cur.a.copy(),
				s: cur.s.copy()
			}

			if (overlap[chr] = overlap[chr].intersection(rangeYes)) {
				successes.push(...parse_flow(flows, dest, overlap))
			}
		}

		if (!(cur[chr] = cur[chr].intersection(rangeNo))) {
			break
		}
	}

	return successes
}

function day19(input, part2) {
	let [flowsStr, inputsStr] = input.split("\n\n")
	let flows = {}

	for (let line of flowsStr.split("\n")) {
		let [name, rulesStr] = line.split(/[{}]/)
		let rules = []

		for (let rule of rulesStr.split(",")) {
			let parts = rule.split(":")
			let dest = parts.pop()
			let chr = "x"
			let rangeYes = new Range(1, 4001)
			let rangeNo = new Range(0, 1)

			if (parts[0]) {
				let dir = parts[0][1]
				let num = +parts[0].slice(2)

				chr = parts[0][0]
				rangeYes = dir == "<" ? new Range(1, num) : new Range(num + 1, 4001)
				rangeNo = dir == "<" ? new Range(num, 4001) : new Range(1, num + 1)
			}

			rules.push([chr, rangeYes, rangeNo, dest])
		}

		flows[name] = rules
	}

	let inputs = []

	if (part2) {
		inputs.push({
			x: new Range(1, 4001),
			m: new Range(1, 4001),
			a: new Range(1, 4001),
			s: new Range(1, 4001)
		})
	} else {
		for (let line of inputsStr.split("\n")) {
			let params = line.ints()

			inputs.push({
				x: new Range(params[0], params[0] + 1),
				m: new Range(params[1], params[1] + 1),
				a: new Range(params[2], params[2] + 1),
				s: new Range(params[3], params[3] + 1)
			})
		}
	}

	return inputs.sum((input) =>
		parse_flow(flows, "in", input).sum((e) =>
			part2 ?
				e.x.l * e.m.l * e.a.l * e.s.l :
				e.x.x + e.m.x + e.a.x + e.s.x))
}

if (typeof window == "undefined") {
	module.exports = day19
}
