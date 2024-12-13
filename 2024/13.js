function day13(input, part2) {
	return input.split("\n\n").sum((lines) => {
		let [ax, ay, bx, by, px, py] = lines.posints()

		if (part2) {
			px += 10000000000000
			py += 10000000000000
		}

		let det = ax*by - bx*ay

		let na = (by*px - bx*py) / det
		if (na != Math.floor(na)) {
			return 0
		}

		let nb = (ax*py - ay*px) / det
		if (nb != Math.floor(nb)) {
			return 0
		}

		return 3*na + nb
	})
}

if (typeof window == "undefined") {
	module.exports = day13
}
