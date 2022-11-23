class Cuboid {
    constructor(sgn, xs, xe, ys, ye, zs, ze) {
        this.sgn = sgn
        this.xs = Math.min(xs, xe)
        this.xe = Math.max(xs, xe)
        this.ys = Math.min(ys, ye)
        this.ye = Math.max(ys, ye)
        this.zs = Math.min(zs, ze)
        this.ze = Math.max(zs, ze)
    }

    vol() { return (this.xe - this.xs + 1) * (this.ye - this.ys + 1) * (this.ze - this.zs + 1) }

    int(that) {
        if (that.xe < this.xs || this.xe < that.xs) return
        if (that.ye < this.ys || this.ye < that.ys) return
        if (that.ze < this.zs || this.ze < that.zs) return

        let sgn = -that.sgn

        let xs = Math.max(this.xs, that.xs)
        let xe = Math.min(this.xe, that.xe)
        let ys = Math.max(this.ys, that.ys)
        let ye = Math.min(this.ye, that.ye)
        let zs = Math.max(this.zs, that.zs)
        let ze = Math.min(this.ze, that.ze)

        return new Cuboid(sgn, xs, xe, ys, ye, zs, ze)
    }
}

function day20(input, part2) {
    let lines = input.split`\n`

    let cuboids = []

    for (let line of lines) {
        let data = line.match(/^(.+) x=(.+)\.\.(.+),y=(.+)\.\.(.+),z=(.+)\.\.(.+)$/)
        let cuboid = new Cuboid(data[1] == "on", +data[2], +data[3], +data[4], +data[5], +data[6], +data[7])

        if (!part2 && (
            cuboid.xs < -50 || cuboid.xe > 50 ||
            cuboid.ys < -50 || cuboid.ye > 50 ||
            cuboid.zs < -50 || cuboid.ze > 50)) {
            continue
        }

        let toAdd = [cuboid]

        for (let otherCuboid of cuboids) {
            let intersection = cuboid.int(otherCuboid)

            if (intersection) {
                toAdd.push(intersection)
            }
        }

        cuboids.push(...toAdd)
    }

    return cuboids.map((e) => e.vol() * e.sgn).sum()
}

if (typeof window == "undefined") {
    module.exports = day20
}
