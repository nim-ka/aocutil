let lookup = new Map()

function combinations(cells, lengths) {
	let key = cells + lengths.join(",")

	if (lookup.has(key)) {
		return lookup.get(key)
	}

	if (lengths.length == 0) {
		return +!cells.includes("#")
	}

	let [len, ...rest] = lengths
	let end

	for (end = 0; end < cells.length - len + 1; end++) {
		if (end > 0 && cells[end - 1] == "#") {
			break
		}
	}

	let res = 0

	out: for (let i = 0; i < end; i++) {
		for (let j = 0; j < len; j++) {
			if (cells[i + j] == ".") {
				continue out
			}
		}

		if (i + len < cells.length && cells[i + len] == "#") {
			continue
		}

		res += combinations(cells.slice(i + len + 1), rest)
	}

	lookup.set(key, res)
	return res
}

function day12(input, part2) {
	return input.split("\n").sum((line) => {
		let [cells, lengths] = line.split(" ")
		lengths = lengths.split(",").num()

		if (part2) {
			cells = [cells].repeat(5).join("?")
			lengths = lengths.repeat(5)
		}

		return combinations(cells, lengths)
	})
}

if (typeof window == "undefined") {
	module.exports = day12
}
