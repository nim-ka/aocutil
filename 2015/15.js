function day15(input, part2) {
	let params = input.split("\n").map((line) => line.ints()).transpose()
	let calories = params.pop()
	let best = 0

	for (let i = 0; i <= 100; i++) {
		for (let j = 0; j <= 100 - i; j++) {
			for (let k = 0; k <= 100 - i - j; k++) {
				for (let l = 0; l <= 100 - i - j - k; l++) {
					let counts = [i, j, k, l]

					if (part2 && counts.dot(calories) != 500) {
						continue
					}

					let score = 1

					for (let param of params) {
						let val = counts.dot(param)

						if (val < 0) {
							score = 0
							break
						}

						score *= val
					}

					best = Math.max(best, score)
				}
			}
		}
	}

	return best
}

if (typeof window == "undefined") {
	module.exports = day15
}
