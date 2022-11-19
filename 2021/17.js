function day17(input, part2) {
    let [minX, maxX, minY, maxY] = input.match(/([-\d]+)/g).num()

    let xVelRange = utils.signAgnosticInclusiveRange(0, maxX)
    let yVelRange = utils.signAgnosticInclusiveRange(-minY, minY)

    let vels = xVelRange.cartProduct(yVelRange).map((e) => new Point(...e)).pt.filter((e) => {
        let pos = new Point(0, 0)
        let vel = e.copy()

        while (pos.x <= maxX && pos.y >= minY) {
            if (pos.x >= minX && pos.y <= maxY) {
                return true
            }

            pos.addMut(vel)

            if (vel.x > 0) {
                vel.x--
            }

            vel.y--

            if (vel.y == 0) {
                e.maxYPos = pos.y
            }
        }

        return false
    })

    if (!part2) {
        // i feel like this is probably equivalent to minY * (minY + 1) / 2 but im not 100% sure for all inputs
        return vels.max((e) => e.y).maxYPos
    } else {
        return vels.length
    }
}

if (typeof window == "undefined") {
    module.exports = day17
}
