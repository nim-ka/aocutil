function day13(input, part2) {
    let lines = input.split("\n").splitOnElement("")

    let points = lines[0].map((e) => new Point(...e.split(",").num())).pt
    let instructions = lines[1].map((e) => e.split(" ").last.split("=")).map((e) => [e[0], +e[1]])

    for (let instruction of instructions) {
        let pos = instruction[1]
        let newPoints = [].pt

        for (let point of points) {
            if (instruction[0] == "x") {
                newPoints.push(point.x < pos ? point : new Point(2 * pos - point.x, point.y))
            } else {
                newPoints.push(point.y < pos ? point : new Point(point.x, 2 * pos - point.y))
            }
        }

        points = newPoints.uniq()

        if (!part2) {
            return points.length
        }
    }

    return new Grid(points.max((e) => e.x).x + 1, points.max((e) => e.y).y + 1).mapMut((_, pt) => pt.isIn(points) ? "#" : " ").toString("")
}

if (typeof window == "undefined") {
    module.exports = day13
}
