function day24(input, part2) {
	let pts = []

	for (let line of input.split("\n")) {
		let [px, py, pz, vx, vy, vz] = line.ints()
		pts.push({
			px: px,
			py: py,
			pz: pz,
			vx: vx,
			vy: vy,
			vz: vz
		})

		if (part2 && pts.length == 3) {
			break
		}
	}

	let epsilon = 0.01

	let offpx = pts[0].px
	let offpy = pts[0].py
	let offpz = pts[0].pz

	let px0 = pts[0].px - offpx
	let py0 = pts[0].py - offpy
	let pz0 = pts[0].pz - offpz
	let vx0 = pts[0].vx
	let vy0 = pts[0].vy
	let vz0 = pts[0].vz
	let cx0 = pz0*vy0 - py0*vz0
	let cy0 = px0*vz0 - pz0*vx0
	let cz0 = py0*vx0 - px0*vy0

	let px1 = pts[1].px - offpx
	let py1 = pts[1].py - offpy
	let pz1 = pts[1].pz - offpz
	let vx1 = pts[1].vx
	let vy1 = pts[1].vy
	let vz1 = pts[1].vz
	let cx1 = pz1*vy1 - py1*vz1
	let cy1 = px1*vz1 - pz1*vx1
	let cz1 = py1*vx1 - px1*vy1

	let px2 = pts[2].px - offpx
	let py2 = pts[2].py - offpy
	let pz2 = pts[2].pz - offpz
	let vx2 = pts[2].vx
	let vy2 = pts[2].vy
	let vz2 = pts[2].vz
	let cx2 = pz2*vy2 - py2*vz2
	let cy2 = px2*vz2 - pz2*vx2
	let cz2 = py2*vx2 - px2*vy2

	for (let vx = -300; vx < 300; vx++) {
		for (let vy = -300; vy < 300; vy++) {
			for (let vz = -300; vz < 300; vz++) {
				let a0 = vz0*vy - vy0*vz
				let b0 = vx0*vz - vz0*vx

				let a1 = vz1*vy - vy1*vz
				let b1 = vx1*vz - vz1*vx

				let d = a0*b1 - b0*a1
				if (d == 0) {
					continue
				}

				let a2 = vz2*vy - vy2*vz
				let b2 = vx2*vz - vz2*vx

				let d0 = vx*(cx0/d) + vy*(cy0/d) + vz*(cz0/d)
				let d1 = vx*(cx1/d) + vy*(cy1/d) + vz*(cz1/d)
				let d2 = vx*(cx2/d) + vy*(cy2/d) + vz*(cz2/d)

				let x = b1*d0 - b0*d1
				let y = a0*d1 - a1*d0
				let z = 0
				if (Math.abs(a2*(x/d) + b2*(y/d) - d2) > epsilon) {
					continue
				}

				let kd0 = vx*vy0 - vy*vx0
				let kd1 = vx*vy1 - vy*vx1
				let kd2 = vx*vy2 - vy*vx2

				let k0 = (px0/kd0 - x/kd0)*(vy0 - vy) - (py0/kd0 - y/kd0)*(vx0 - vx)
				let k1 = (px1/kd1 - x/kd1)*(vy1 - vy) - (py1/kd1 - y/kd1)*(vx1 - vx)
				let k2 = (px2/kd2 - x/kd2)*(vy2 - vy) - (py2/kd2 - y/kd2)*(vx2 - vx)
				if (Math.abs(k0 - k1) > epsilon || Math.abs(k1 - k2) > epsilon || Math.abs(k0 - k2) > epsilon) {
					continue
				}

				let nx = x + k0*vx + offpx
				let ny = y + k0*vy + offpy
				let nz = z + k0*vz + offpz
				return Math.round(nx + ny + nz)
			}
		}
	}
}

if (typeof window == "undefined") {
	module.exports = day24
}

