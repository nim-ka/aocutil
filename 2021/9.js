function day9(input, part2) {
    let grid = Grid.fromStr(input).num()

    let lows = grid.findAllIndices((e, pt, g) => g.getAdjNeighbors(pt).every((nb) => e < g.get(nb)))

    if (!part2) {
        return lows.mapArr((e) => grid.get(e) + 1).sum()
    }

    let sizes = lows.mapArr((low) => grid.bfs(low, (e, pt, g) => {
        return e == 9 || g.get(pt.path.last) < e ? Grid.BFS_STOP : Grid.BFS_CONTINUE
    }).filter((e) => e.result == Grid.BFS_CONTINUE).length).sort((a, b) => b - a)

    return sizes[0] * sizes[1] * sizes[2]
}

if (typeof window == "undefined") {
    module.exports = day9
}
