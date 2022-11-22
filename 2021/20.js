function isEdge(pt, g) {
    return pt.x == 0 || pt.x == g.width - 1 || pt.y == 0 || pt.y == g.height - 1
}

function expand(grid, fill) {
    return new Grid(grid.width + 2, grid.height + 2).mapMut((_, pt, g) => isEdge(pt, g) ? fill : grid.get(pt.ul()))
}

function day20(input, part2) {
    let lines = input.split("\n").splitOnElement("")

    let code = lines[0][0].split("").map((e) => e == "#")

    let width = lines[1][0].length
    let height = lines[1].length

    let grid = expand(expand(Grid.fromArr(lines[1]).mapMut((e) => e == "#"), false), false)

    for (let i = 0; i < (part2 ? 50 : 2); i++) {
        grid = new Grid(grid.width, grid.height).mapMut((_, pt, g) => code[pt.getUnfilteredAllNeighborsIncSelf().map((pt2) => grid.get(grid.contains(pt2) ? pt2 : pt)).reduce((a, b) => 2 * a + b)])
        grid = expand(grid, grid.get(new Point(0, 0)))
    }

    return grid.findAll((e) => e).length
}

if (typeof window == "undefined") {
    module.exports = day20
}
