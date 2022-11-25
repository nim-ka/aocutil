function step(grid, dir) {
    let moved = false

    grid.mapMut((e, pt, g) => {
        let target = dir == 1 ?
            new Point((pt.x + 1) % g.width, pt.y) :
            new Point(pt.x, (pt.y + 1) % g.height)

        if (e % 3 == dir && g.get(target) % 3 == 0) {
            g.set(target, dir * 3)
            moved = true
            return e
        } else {
            return e * 3 + e
        }
    }).mapMut((e) => ((e / 3) | 0) % 3)

    return moved
}

function day25(input) {
    let grid = Grid.fromStr(input).mapMut((e) => ".>v".indexOf(e))

    let moved
    let steps = 0

    do {
        steps++
    } while (step(grid, 1) + step(grid, 2))

    return steps
}

if (typeof window == "undefined") {
    module.exports = day25
}
