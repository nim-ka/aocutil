function day11(input, part2) {
    let grid = Grid.fromStr(input).mapMut((e) => ({ energy: +e, flashed: false }))

    let steps = 0
    let flashes = 0
    let totalFlashes = 0

    while (part2 ? flashes != grid.width * grid.height : steps < 100) {
        flashes = 0

        grid.forEach(function flash(e, pt, g) {
            e.energy++

            if (!e.flashed && e.energy > 9) {
                e.flashed = true
                flashes++

                g.getAllNeighborsThat(pt, (e) => !e.flashed).forEach((pt) => flash(g.get(pt), pt, g))
            }
        })

        grid.forEach((e) => {
            if (e.flashed) {
                e.energy = 0
                e.flashed = false
            }
        })

        steps++
        totalFlashes += flashes
    }

    return part2 ? steps : totalFlashes
}

if (typeof window == "undefined") {
    module.exports = day11
}
