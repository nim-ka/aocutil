function day9(input, part2) {
	let usedBlocks = []
	let freeBlocks = []
	let pos = 0

	for (let i = 0; i < input.length; i += 2) {
		let id = i >> 1
		let len = +input[i]
		usedBlocks.push({ pos, len, id })
		pos += len

		if (i + 1 < input.length) {
			len = +input[i + 1]
			freeBlocks.unshift({ pos, len })
			pos += len
		}
	}

	for (let i = usedBlocks.length - 1; i >= 0; i--) {
		let used = usedBlocks[i]
		let free

		let next = []

		for (let j = freeBlocks.length - 1; j >= 0; j--) {
			let free = freeBlocks[j]

			if (free.len > used.pos - free.pos) {
				free.len = used.pos - free.pos
			}

			if (free.len <= 0) {
				freeBlocks.pop()
				continue
			}

			if (free.len >= used.len) {
				used.pos = free.pos

				freeBlocks.pop()
				if (free.len > used.len) {
					freeBlocks.push({ pos: free.pos + used.len, len: free.len - used.len })
				}

				break
			} else {
				if (part2) {
	//				next.unshift(free)
				} else {
					usedBlocks.push({ pos: free.pos, len: free.len, id: used.id })
					used.len -= free.len
					freeBlocks.pop()
				}
			}
		}

		for (let free of next) {
			freeBlocks.push(free)
		}
	}

	return usedBlocks.sum(({ pos, len, id }) => id * (2*pos + len - 1) * len/2)
}

if (typeof window == "undefined") {
	module.exports = day9
}
