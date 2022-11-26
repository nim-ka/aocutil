function day5(input, part2) {
    let lines = input.split("\n").map((e) => e.split(" -> ").map((e) => new Point(...e.split(",").num())))

    if (!part2) {
        lines = lines.filter((e) => e[0].x == e[1].x || e[0].y == e[1].y)
    }

    let visitedOnce = new Set()
    let visitedTwice = new Set()

    for (let line of lines) {
        let xrange = utils.signAgnosticInclusiveRange(line[0].x, line[1].x)
        let yrange = utils.signAgnosticInclusiveRange(line[0].y, line[1].y)

        if (xrange.length == 1) {
            xrange = yrange.map(() => line[0].x)
        }

        if (yrange.length == 1) {
            yrange = xrange.map(() => line[0].y)
        }

        for (let i = 0; i < xrange.length; i++) {
            let mask = (xrange[i] << 10) | yrange[i]

            if (visitedOnce.has(mask)) {
                visitedTwice.add(mask)
            } else {
                visitedOnce.add(mask)
            }
        }
    }

    return visitedTwice.size
}

if (typeof window == "undefined") {
    module.exports = day5
}
