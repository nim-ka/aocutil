function day6(input, part2) {
	let rects = input.split("\n").map((line) => {
		let [instr, a, b, c, d] = line.match(/on|toggle|off|\d+/g)
		return [{ "off": 0, "on": 1, "toggle": 2 }[instr], +a, +b, +c, +d]
	})

	let sum = 0

	for (let x = 0; x < 1000; x++) {
		for (let y = 0; y < 1000; y++) {
			let brightness = 0

			for (let i = 0; i < rects.length; i++) {
				let rect = rects[i]
				if (x < rect[1] || y < rect[2] || x > rect[3] || y > rect[4]) {
					continue
				}

				if (part2) {
					brightness += [-1, 1, 2][rect[0]]
					brightness = Math.max(brightness, 0)
				} else {
					brightness = [0, 1, 1 - brightness][rect[0]]
				}
			}

			sum += brightness
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day6
}
