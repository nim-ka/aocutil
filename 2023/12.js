let lookup = new Map()

function combinations(cells, lengths, cellIdx, lenIdx, nextFree, lastIdx, heur) {
	let key = (cellIdx << 8) | lenIdx

	if (lookup.has(key)) {
		return lookup.get(key)
	}

	if (heur == 0) {
		let res = +(lastIdx < cellIdx)
		lookup.set(key, res)
		return res
	}

	if (cells.length - cellIdx < heur) {
		lookup.set(key, 0)
		return 0
	}

	let len = lengths[lenIdx]
	let end

	for (end = cellIdx; end < cells.length - len + 1; end++) {
		if (end > cellIdx && cells[end - 1] == "#") {
			break
		}
	}

	if (end <= cellIdx) {
		lookup.set(key, 0)
		return 0
	}

	let res = 0

	out: for (let i = cellIdx; i < end; i++) {
		for (let j = i; j < i + len; j++) {
			if (cells[j] == ".") {
				continue out
			}
		}

		if (i + len <= lastIdx && cells[i + len] == "#") {
			continue
		}

		res += combinations(cells, lengths, nextFree[i + len + 1], lenIdx + 1, nextFree, lastIdx, heur - len - (lenIdx < lengths.length - 1))
	}

	lookup.set(key, res)
	return res
}

function day12(input, part2) {
	return input.split("\n").sum((line) => {
		lookup.clear()

		let [cells, lengths] = line.split(" ")
		cells = cells.split("")
		lengths = lengths.split(",").num()

		if (part2) {
			cells.push("?")
			cells = cells.repeat(5)
			cells.pop()
			lengths = lengths.repeat(5)
		}

		let nextFree = cells.map((_, i) => {
			while (cells[i] == ".") {
				i++
			}

			return i
		})
		nextFree.push(nextFree.length)
		nextFree.push(nextFree.length)

		return combinations(cells, lengths, 0, 0, nextFree, cells.lastIndexOf("#"), lengths.sum() + lengths.length - 1)
	})
}

if (typeof window == "undefined") {
	module.exports = day12
}

