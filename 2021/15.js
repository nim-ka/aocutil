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

    let start = encodePoint(new Point(0, 0))

    let visited = {}
    visited[start] = true

    let heap = new BinHeap((a, b) => a.risk < b.risk)
    heap.insert({ pt: start, risk: 0 })

    while (true) {
        let top = heap.extract()
        let decoded = decodePoint(top.pt)

        if (decoded.x == grid.width - 1 && decoded.y == grid.height - 1) {
            return top.risk
        }

        for (let pt of grid.getAdjNeighbors(decoded)) {
            let encoded = encodePoint(pt)
            let risk = top.risk + grid.get(pt)

            if (encoded in visited) {
                let idx = heap.data.findIndex((e) => e.pt == encoded)
                if (idx > -1 && risk < heap.data[idx].risk) {
                    heap.data[idx].risk = risk
                    heap.up(idx)
                }
            } else {
                visited[encoded] = true
                heap.insert({ pt: encoded, risk: risk })
            }
        }
    }
}

if (typeof window == "undefined") {
    module.exports = day15
}
