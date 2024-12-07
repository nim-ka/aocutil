function day7(input, part2) {
	let sum = 0

	for (let line of input.split("\n")) {
		let [target, start, ...nums] = line.ints()

		let cur = [target]

		for (let i = nums.length - 1; i >= 0; i--) {
			let next = []
			let num1 = nums[i]

			for (let num2 of cur) {
				let val = num2 / num1
				if (val == Math.floor(val)) {
					next.push(val)
				}

				val = num2 - num1
				if (val > 0) {
					next.push(val)
				}

				if (part2) {
					let power = 1

					while ((val /= 10) == Math.floor(val)) {
						power *= 10

						if (power > num1) {
							next.push(val)
							break
						}
					}
				}
			}

			cur = next
		}

		if (cur.includes(start)) {
			sum += target
		}
	}

	return sum
}

if (typeof window == "undefined") {
	module.exports = day7
}
