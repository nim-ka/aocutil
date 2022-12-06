function encodePoint(pt) {
    return (pt.x << 9) | pt.y
}

function decodePoint(num) {
    return new Point((num >> 9) & 0b111111111, num & 0b111111111)
}

function day15(input, part2) {
    let grid = Grid.fromStr(input).num()

    if (part2) {
        grid = new Grid(grid.width * 5, grid.height * 5)
            .mapMut((e, pt) => grid.get(new Pt(pt.x % grid.width, pt.y % grid.height)) + (pt.x / grid.width | 0) + (pt.y / grid.height | 0))
            .mapMut((e) => ((e - 1) % 9) + 1)
    }

    grid.graphify()

    let start = grid.get(new Point(0, 0))
    let end = grid.get(new Point(grid.width - 1, grid.height - 1))

    start.dijkstraTo(end)

    return end.searchData.dist
}

if (typeof window == "undefined") {
    module.exports = day15
}
