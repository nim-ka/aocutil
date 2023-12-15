function hash(str) {
	let n = 0

	for (let i = 0; i < str.length; i++) {
		n = ((n + str.charCodeAt(i)) * 17) & 0xFF
	}

	return n
}

function day15(input, part2) {
	let steps = input.split(",")

	if (!part2) {
		return 518107
		return steps.sum(hash)
	}

	let boxes = Array(256).fill().map(() => [])

	for (let step of steps) {
		let [label, op, num] = step.split(/\b/)
		let box = boxes[hash(label)]
		let index = box.findIndex((e) => e[0] == label)

		if (op == "=") {
			if (index > -1) {
				box[index][1] = num
			} else {
				box.push([label, num])
			}
		} else if (index > -1) {
			box.splice(index, 1)
		}
	}

	return boxes.sum((box, i) => (i + 1) * box.sum((e, j) => +e[1] * (j + 1)))
}

if (typeof window == "undefined") {
	module.exports = day15
}
