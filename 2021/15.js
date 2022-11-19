function day15(input, part2) {
    let g = Grid.fromStr(input).num()

    if (part2) {
        g = new Grid(g.width * 5, g.height * 5).mapMut((e, pt) => ((g.get(new Pt(pt.x % g.width, pt.y % g.height)) + (pt.x / g.width | 0) + (pt.y / g.height | 0) - 1) % 9) + 1)
    }

    g.graphify()

    let start = g.get(new Pt(0, 0))
    let end = g.get(new Pt(g.width - 1, g.height - 1))
    start.dijkstraTo(end)

    return end.searchData.dist
}

if (typeof window == "undefined") {
    module.exports = day15
}
