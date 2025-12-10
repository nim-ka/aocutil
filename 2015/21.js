function day21(input, part2) {
	let bossInit = input.posints()
	let playerInit = [100, 0, 0]

	let weapons = [
		[8, 4, 0],
		[10, 5, 0],
		[25, 6, 0],
		[40, 7, 0],
		[74, 8, 0]
	]

	let armor = [
		[0, 0, 0],
		[13, 0, 1],
		[31, 0, 2],
		[53, 0, 3],
		[75, 0, 4],
		[102, 0, 5]
	]

	let rings = [
		[0, 0, 0],
		[25, 1, 0],
		[50, 2, 0],
		[100, 3, 0],
		[20, 0, 1],
		[40, 0, 2],
		[80, 0, 3]
	].unorderedPair()

	let wins = []
	let losses = []

	for (let items of weapons.cartProduct(armor).cartProduct(rings)) {
		items = items.flat()

		let cost = items.sum((e) => e[0])

		let boss = bossInit.slice()
		let player = playerInit.slice()

		for (let item of items) {
			player[1] += item[1]
			player[2] += item[2]
		}

		while (true) {
			boss[0] -= Math.max(player[1] - boss[2], 1)
			if (boss[0] <= 0) {
				wins.push(cost)
				break
			}

			player[0] -= Math.max(boss[1] - player[2], 1)
			if (player[0] <= 0) {
				losses.push(cost)
				break
			}
		}
	}

	return part2 ? losses.max() : wins.min()
}

if (typeof window == "undefined") {
	module.exports = day21
}
