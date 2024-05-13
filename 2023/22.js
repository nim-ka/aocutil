function day22(input, part2) {
/*
input=`1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`
*/
	let bricks = input.split("\n").map((line) => {
		let [a, b, c, d, e, f] = line.posints()
		return c < f ?
			[new Point(a, b, c), new Point(d, e, f)] :
			[new Point(d, e, f), new Point(a, b, c)]
	})

	bricks.push([new Point(-Infinity, -Infinity, 0), new Point(Infinity, Infinity, 0)])
	bricks.sortNumAsc((e) => e[0].z)

	let supported = bricks.map(() => [])
	let supporting = bricks.map(() => [])

	for (let i = 1; i < bricks.length; i++) {
		let stuck = false

		for (let j = i - 1; j >= 0; j--) {
			let target = bricks[j][0].z + 1

			if (stuck && bricks[i][0].z > target) {
				break
			}

			if (utils.rectIntersects(bricks[i][0], bricks[i][1], bricks[j][0], bricks[j][1])) {
				bricks[i][1].z -= bricks[i][0].z - target
				bricks[i][0].z = target
				stuck = true

				if (j > 0) {
					supported[i].push(j)
					supporting[j].push(i)
				}
			}
		}
	}

	let rely = supported.map((e) => e.length == 1 ? e : [])
	if (!part2) {
		let k = new Set()

		for (let i = 1; i < bricks.length; i++) {
			if (supported[i].length == 1) {
				k.add(supported[i][0])
			}
		}

		return bricks.length - k.size - 1
	}
return
	for (let i = bricks.length - 1; i >= 1; i--) {

	}

	console.log(supported)
	console.log(supporting)
	console.log(rely)
}

if (typeof window == "undefined") {
	module.exports = day22
}
