function day25(input) {
	let [r, c] = input.posints()

	r += c - 1

	let index = r * (r - 1) / 2 + c
	let num = 20151125

	for (let i = 1; i < index; i++) {
		num = (num * 252533) % 33554393
	}

	return num
}

if (typeof window == "undefined") {
	module.exports = day25
}
