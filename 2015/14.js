function day14(input, part2) {
	let reindeer = input.split("\n").map((line) => [0, 0, ...line.posints()])

	for (let i = 0; i < 2503; i++) {
		let point = reindeer.max((deer) => {
			if (i % (deer[3] + deer[4]) < deer[3]) {
				deer[0] += deer[2]
			}

			return deer[0]
		})

		point[1]++
	}

	return reindeer.maxVal((deer) => deer[part2 ? 1 : 0])
}

if (typeof window == "undefined") {
	module.exports = day14
}
