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

    let recurse = function(i) {
        let scan = scans[i]
        let sharedCount = 0

        scan.checked = true

        for (let j = 0; j < scan.length - 11 - sharedCount; j++) {
            let scanRel = scan.map((e) => e.sub(scan[j]))
            let shared = false

            for (let k = 0; k < scans.length; k++) {
                if (scans[k].checked) {
                    continue
                }

                out: for (let t = 0; t < 24; t++) {
                    let scan2 = scans[k].map((e) => rotate(e, t))

                    for (let l = 0; l < scan2.length; l++) {
                        let scanRel2 = scan2.map((e) => e.sub(scan2[l]))

                        let count = 0

                        for (let m = 0; m < scanRel.length; m++) {
                            if (m > scanRel.length - 12 + count) {
                                break
                            }

                            for (let pt of scanRel2) {
                                if (scanRel[m].equals(pt)) {
                                    count++
                                }
                            }
                        }

                        if (count >= 12) {
                            transforms[i][k] = new Transform(scan2[l].sub(scan[j]), inverseRotations[t])
                            transforms[k][i] = transforms[i][k].invert()

                            for (let m = 0; m < transforms.length; m++) {
                                if (m != i && transforms[m][i] && !transforms[m][k]) {
                                    transforms[m][k] = transforms[m][i].compose(transforms[i][k])
                                    transforms[k][m] = transforms[m][k].invert()
                                }

                                if (m != k && transforms[m][k] && !transforms[m][i]) {
                                    transforms[m][i] = transforms[m][k].compose(transforms[k][i])
                                    transforms[i][m] = transforms[m][i].invert()
                                }
                            }

                            console.log(`linked ${i}<->${k}\t(${i} point ${j} == ${k} point ${l} with rotation ${t})`)

                            recurse(k)

                            shared = true
                            break out
                        }
                    }
                }
            }

            if (shared) {
                sharedCount++
            }
        }
    }

    recurse(0)

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
