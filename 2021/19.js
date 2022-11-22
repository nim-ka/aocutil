function allRotations(pt) {
    return new PointArray(
        new Point(pt.x, pt.y, pt.z), // facing +x, +z up
        new Point(pt.x, pt.z, -pt.y),
        new Point(pt.x, -pt.y, -pt.z),
        new Point(pt.x, -pt.z, pt.y),
        new Point(-pt.x, -pt.y, pt.z), // facing -x, +z up
        new Point(-pt.x, -pt.z, -pt.y),
        new Point(-pt.x, pt.y, -pt.z),
        new Point(-pt.x, pt.z, pt.y),
        new Point(-pt.y, pt.x, pt.z), // facing +y, +z up
        new Point(-pt.y, pt.z, -pt.x),
        new Point(-pt.y, -pt.x, -pt.z),
        new Point(-pt.y, -pt.z, pt.x),
        new Point(pt.y, -pt.x, pt.z), // facing -y, +z up
        new Point(pt.y, -pt.z, -pt.x),
        new Point(pt.y, pt.x, -pt.z),
        new Point(pt.y, pt.z, pt.x),
        new Point(pt.z, -pt.y, pt.x), // facing +z, -x up
        new Point(pt.z, -pt.x, -pt.y),
        new Point(pt.z, pt.y, -pt.x),
        new Point(pt.z, pt.x, pt.y),
        new Point(-pt.z, pt.y, pt.x), // facing -z, +x up
        new Point(-pt.z, pt.x, -pt.y),
        new Point(-pt.z, -pt.y, -pt.x),
        new Point(-pt.z, -pt.x, pt.y)
    )
}

const rotationsProto = allRotations(new Point(1, 2, 3))

const composedRotations = rotationsProto.mapArr((e) => allRotations(e).mapArr((e) => rotationsProto.indexOf(e)))
const inverseRotations = composedRotations.map((e) => e.indexOf(0))

function rotate(pt, t) {
    return allRotations(pt)[t < 0 ? inverseRotations[-t] : t]
}

class Transform {
    constructor(translate, rotate) {
        this.translate = translate
        this.rotate = rotate
    }

    transform(pt) {
        return rotate(pt.add(this.translate), this.rotate)
    }

    // R(x + T) = x'
    // x = R'(x') - T = R'(x' - R(T))
    invert() {
        return new Transform(rotate(this.translate, this.rotate).neg(), inverseRotations[this.rotate])
    }

    // x' = R2(R1(x + T1) + T2) = R2(R1(x) + R1(T1) + T2)
    // T' = R1(T1) + T2; x' = (R2 o R1)((x) + R1^-1 (T'))
    compose(that) {
        return new Transform(
            rotate(rotate(this.translate, this.rotate).add(that.translate), inverseRotations[this.rotate]),
            composedRotations[this.rotate][that.rotate]
        )
    }
}

function day19(input, part2) {
    let lines = input.split("\n")

    let scans = new PointArray()

    for (let line of lines) {
        if (line.includes("---")) {
            scans.push(new PointArray())
        } else if (line) {
            scans.last.push(new Point(...line.split(",").num()))
        }
    }

    let transforms = Array(scans.length).fill().map((_, i) => {
        let a = Array(scans.length).fill()
        a[i] = new Transform(new Point(0, 0, 0), 0)
        return a
    })

    let tree = Array(scans.length).fill().map((_, i) => [i])

    for (let i = 0; i < scans.length - 1; i++) {
        let scan = scans[i]

        for (let j = 0; j < scan.length; j++) {
            if (scan[j].link) {
                continue
            }

            let scanRel = scan.map((e) => e.sub(scan[j]))

            out: for (let k = i + 1; k < scans.length; k++) {
                if (transforms[i][k]) {
                    continue
                }

                if (tree[0].includes(i) && tree[0].includes(k)) {
                    continue
                }

                for (let t2 = 0; t2 < 24; t2++) {
                    let scan2 = scans[k].map((e) => rotate(e, t2))

                    for (let l = 0; l < scan2.length; l++) {
                        let scanRel2 = scan2.map((e) => e.sub(scan2[l]))

                        let overlaps = scanRel.int(scanRel2)

                        if (overlaps.length >= 12) {
                            console.log([i, j, k, l, t2])

                            tree[i].push(k)
                            tree[k].push(i)

                            if (tree[0].includes(i)) {
                                tree[0].pushUniq(k)
                            }

                            if (tree[0].includes(k)) {
                                tree[0].pushUniq(i)
                            }

                            transforms[i][k] = new Transform(scan2[l].sub(scan[j]), inverseRotations[t2])
                            transforms[k][i] = transforms[i][k].invert()

                            break out
                        }
                    }
                }
            }

            console.log(i, j)
        }
    }

    // this sucks on another level but hey it works ?
    Array(transforms.length).fill().forEach((_, i) => {
        (function recurse(i) {
            for (let j = 0; j < transforms[i].length; j++) {
                if (i == j || !transforms[i][j]) {
                    continue
                }

                for (let k = 0; k < transforms[j].length; k++) {
                    if (transforms[i][k] || !transforms[j][k]) {
                        continue
                    }

                    transforms[i][k] = transforms[i][j].compose(transforms[j][k])
                    transforms[k][i] = transforms[i][k].invert()

                    console.log(`filled in ${i}<->${k} from ${i}<->${j}<->${k}`)

                    recurse(j)
                }
            }
        })(i)
    })

    if (!part2) {
        let beacons = new PointArray()

        for (let i = 0; i < scans.length; i++) {
            beacons.pushUniq(...scans[i].map((pt) => transforms[i][0].transform(pt)))
        }

        return beacons.length
    } else {
        return transforms.flatMap((e) => e.map((f) => Math.abs(f.translate.x) + Math.abs(f.translate.y) + Math.abs(f.translate.z))).max()
    }
}

if (typeof window == "undefined") {
    module.exports = day19
}
