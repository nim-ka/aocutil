function day7(input, part2) {
	let sum = 0

	for (let line of input.split("\n")) {
		let [target, start, ...nums] = line.posints()

		let cur = [target]

		for (let i = nums.length - 1; i >= 0; i--) {
			let next = []
			let num1 = nums[i]

			for (let num2 of cur) {
				let val = num2 / num1
				if (val == Math.floor(val)) {
					next.push(val)
				}

				num2 -= num1
				next.push(num2)

				if (part2) {
					let power = 1

					while ((num2 /= 10) == Math.floor(num2)) {
						power *= 10

						if (power > num1) {
							next.push(num2)
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
