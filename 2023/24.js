function day24(input, part2) {
	let pts = []

	for (let line of input.split("\n")) {
		let [px, py, pz, vx, vy, vz] = line.ints()
		pts.push({ px, py, pz, vx, vy, vz })

		if (part2 && pts.length == 3) {
			break
		}
	}

	if (!part2) {
		let count = 0

		for (let i = 0; i < pts.length - 1; i++) {
			for (let j = i + 1; j < pts.length; j++) {
				let a = pts[i]
				let b = pts[j]

				let na = (b.py*b.vx - b.px*b.vy + a.px*b.vy - a.py*b.vx) / (a.vy*b.vx - a.vx*b.vy)
				if (na < 0) {
					continue
				}

				let tx = a.px + na*a.vx

				if (Math.sign(tx - b.px) != Math.sign(b.vx)) {
					continue
				}

				let ty = a.py + na*a.vy

				if (tx >= 200000000000000 && tx <= 400000000000000 &&
					ty >= 200000000000000 && ty <= 400000000000000) {
					count++
				}
			}
		}

		return count
	}

	// what

	let epsilon = 0.1

	let offpx = pts[0].px
	let offpy = pts[0].py
	let offpz = pts[0].pz

	let vx0 = pts[0].vx
	let vy0 = pts[0].vy
	let vz0 = pts[0].vz

	let px1 = pts[1].px - offpx
	let py1 = pts[1].py - offpy
	let pz1 = pts[1].pz - offpz
	let vx1 = pts[1].vx
	let vy1 = pts[1].vy
	let vz1 = pts[1].vz

	let px2 = pts[2].px - offpx
	let py2 = pts[2].py - offpy
	let pz2 = pts[2].pz - offpz
	let vx2 = pts[2].vx
	let vy2 = pts[2].vy
	let vz2 = pts[2].vz

	for (let vx = -300; vx < 300; vx++) {
		for (let vy = -300; vy < 300; vy++) {
			for (let vz = -300; vz < 300; vz++) {
				// transformations:
				//   px0 py0 pz0 => 0 0 0
				//   vx vy vz => 1 1 1 (this simplifies a ridiculous amount of shit what)
				//   z = 0 obviously for the initial line finding
				let a0 = (vz0-vz) - (vy0-vy)
				let b0 = (vx0-vx) - (vz0-vz)

				let a1 = (vz1-vz) - (vy1-vy)
				let b1 = (vx1-vx) - (vz1-vz)

				let d = a0*b1 - b0*a1
				if (d == 0) {
					continue
				}

				let c0 = (vy0-vy) - (vx0-vx)
				let c1 = (vy1-vy) - (vx1-vx)

				let a2 = (vz2-vz) - (vy2-vy)
				let b2 = (vx2-vx) - (vz2-vz)
				let c2 = (vy2-vy) - (vx2-vx)

				let d1 = px1*(a1/d) + py1*(b1/d) + pz1*(c1/d)
				let d2 = px2*(a2/d) + py2*(b2/d) + pz2*(c2/d)

				let x = -b0*d1
				let y = a0*d1
				let z = 0

				if (Math.abs(a2*(x/d) + b2*(y/d) - d2) > epsilon) {
					continue
				}

				let k0 = (-x/c0)*(vy0 - vy) - (-y/c0)*(vx0 - vx)
				let k1 = (px1/c1 - x/c1)*(vy1 - vy) - (py1/c1 - y/c1)*(vx1 - vx)
				let k2 = (px2/c2 - x/c2)*(vy2 - vy) - (py2/c2 - y/c2)*(vx2 - vx)

				if (Math.abs(k0 - k1) > epsilon || Math.abs(k1 - k2) > epsilon || Math.abs(k0 - k2) > epsilon) {
					continue
				}

				let nx = x + k0 + offpx
				let ny = y + k0 + offpy
				let nz = z + k0 + offpz
				return Math.round(nx + ny + nz)
			}
		}
	}
}

if (typeof window == "undefined") {
	module.exports = day24
}

