function day14(input, part2) {
	let width = 101
	let height = 103

	let robots = input.ints().splitEvery(4)
	for (let robot of robots) {
		robot[2] = robot[2] < 0 ? robot[2] + width : robot[2]
		robot[3] = robot[3] < 0 ? robot[3] + height : robot[3]
	}

	let regions = Array(256)

	for (let time = 1; time < width * height; time++) {
		regions.fill(0)

		for (let robot of robots) {
			robot[0] += robot[2]
			if (robot[0] >= width) {
				robot[0] -= width
			}

			robot[1] += robot[3]
			if (robot[1] >= height) {
				robot[1] -= height
			}

			if (part2) {
				if (++regions[(robot[0] & ~0xF) | (robot[1] >> 4)] > 70) {
					return time
				}
			}
		}

		if (!part2 && time == 100) {
			let parts = [0, 0, 0, 0]
			let cx = width >> 1
			let cy = height >> 1

			for (let [x, y] of robots) {
				if (x != cx && y != cy) {
					parts[(x > cx) << 1 | (y > cy)]++
				}
			}

			return parts.prod()
		}
	}
}

if (typeof window == "undefined") {
	module.exports = day14
}
