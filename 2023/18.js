function day18(input, part2) {
	let cur = Point.ORIGIN
	let points = [cur]

	for (let line of input.split("\n")) {
		let [dir, num, hex] = line.split(" ")

		if (part2) {
			dir = "RDLU"[+hex[7]]
			num = parseInt(hex.slice(2, 7), 16)
		}

		points.push(cur = cur[dir.toLowerCase()](+num))
	}

	points.push(Point.ORIGIN)

	let doubleArea = 0
	let perimeter = 0

	for (let i = 0; i < points.length - 1; i++) {
		let a = points[i]
		let b = points[i + 1]

		doubleArea += a.x * b.y - b.x * a.y
		perimeter += a.manhattanDist(b)
	}

	return (doubleArea + perimeter) / 2 + 1
}

if (typeof window == "undefined") {
	module.exports = day18
}
