function day22(input, part2) {
	Node.DEBUG = false

	let [bossHp, bossDamage] = input.posints()

	let start = new Node({
		playerHp: 50,
		mana: 500,
		spentMana: 0,
		bossHp: bossHp,
		shieldTimer: 0,
		poisonTimer: 0,
		rechargeTimer: 0
	})

	return start.dijkstra((end) => end.val.bossHp <= 0, (node) => {
		let prev = node.val
		let nexts = []

		if (part2) {
			prev = prev.copy()

			prev.playerHp--
			if (prev.playerHp <= 0) {
				return
			}
		}

		let missile = prev.copy()
		missile.bossHp -= 4
		if (missile.bossHp > 0) {
			nexts.push([missile, 53])
		}

		let drain = prev.copy()
		drain.playerHp += 2
		drain.bossHp -= 2
		if (drain.bossHp > 0) {
			nexts.push([drain, 73])
		}

		if (prev.shieldTimer == 0) {
			let shield = prev.copy()
			shield.shieldTimer = 6
			nexts.push([shield, 113])
		}

		if (prev.poisonTimer == 0) {
			let poison = prev.copy()
			poison.poisonTimer = 6
			nexts.push([poison, 173])
		}

		if (prev.rechargeTimer == 0) {
			let recharge = prev.copy()
			recharge.rechargeTimer = 5
			nexts.push([recharge, 229])
		}

		for (let [next, cost] of nexts) {
			if (next.rechargeTimer > 0) {
				next.rechargeTimer--
				next.mana += 101
			}

			if (next.poisonTimer > 0) {
				next.poisonTimer--
				next.bossHp -= 3
			}

			if (next.shieldTimer > 0) {
				next.shieldTimer--
			}

			if (next.mana < cost) {
				continue
			}
			next.mana -= cost
			next.spentMana += cost

			if (next.rechargeTimer > 0) {
				next.rechargeTimer--
				next.mana += 101
			}

			if (next.poisonTimer > 0) {
				next.poisonTimer--
				next.bossHp -= 3
			}

			let armor = 0
			if (next.shieldTimer > 0) {
				next.shieldTimer--
				armor = 7
			}

			if (next.bossHp > 0) {
				next.playerHp -= Math.max(bossDamage - armor, 1)
			}

			if (next.playerHp > 0) {
				node.addCxn(new Node(next), cost)
			}
		}
	}).val.spentMana
}

if (typeof window == "undefined") {
	module.exports = day22
}
