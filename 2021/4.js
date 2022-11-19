function day4(input, part2) {
    input = input.split("\n")

    let seq = input.shift().split(",").num()
    let grids = input.splitOnElement("").filter((e) => e.length).map((grid) => Grid.fromStr(grid.map((line) => line.replace(/^ /, "")).join("\n"), /\s+/).mapMut((e) => [+e, false]))

    let score

    for (let num of seq) {
        for (let grid of grids) {
            if (grid.won) {
                continue
            }

            let pt = grid.findIndex((e) => e[0] == num)

            if (pt == Point.NONE) {
                continue
            }

            grid.set(pt, [num, true])

            if ([...grid.getRows(), ...grid.getColumns()].some((row) => row.every((e) => e[1]))) {
                grid.won = true

                if (!score || part2) {
                    score = grid.findAll((e) => !e[1]).map((e) => e[0]).sum() * num
                }
            }
        }
    }

    return score
}

if (typeof window == "undefined") {
    module.exports = day4
}
