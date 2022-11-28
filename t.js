const opens = ["(", "[", "{", "<"]
const closes = [")", "]", "}", ">"]
const scores1 = { ")": 3, "]": 57, "}": 1197, ">": 25137 }
const scores2 = { ")": 1, "]": 2, "}": 3, ">": 4 }

function day10(input, part2) {
    let results = input.split("\n").map((str) => {
        let stack = []

        for (let i = 0; i < str.length; i++) {
            let char = str[i]

            if (opens.includes(char)) {
                stack.push(closes[opens.indexOf(char)])
            } else if (char != stack.pop()) {
                return { error: true, score: scores1[char] }
            }
        }

        return { error: false, score: stack.reduceRight((a, b) => a * 5 + scores2[b], 0) }
    })

    return results.filter((e) => part2 ^ e.error).map((e) => e.score)[part2 ? "medianNumeric" : "sum"]()
}

if (typeof window == "undefined") {
    module.exports = day10
}
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
// this one used to be a lot shorter but i made it less shoddy and slow at expense of line count
function day12(input, part2) {
    let cxns = input.split("\n").map((line) => line.split("-"))

    let caves = []
    let startId

    for (let cxn of cxns) {
        let ids = []

        for (let i = 0; i < 2; i++) {
            let cave = caves.find((e) => e.name == cxn[i])

            if (!cave) {
                caves.push(cave = {
                    name: cxn[i],
                    id: caves.length,
                    isStart: cxn[i] == "start",
                    isEnd: cxn[i] == "end",
                    isSmall: cxn[i] == cxn[i].toLowerCase(),
                    cxns: new Set()
                })

                if (cave.isStart) {
                    startId = cave.id
                }
            }

            ids.push(cave.id)
        }

        caves[ids[0]].cxns.add(ids[1])
        caves[ids[1]].cxns.add(ids[0])
    }

    let count = 0
    let paths = [{
        cur: startId,
        smallVisited: new Set(),
        visitedSmallTwice: false
    }]

    let i = 0

    while (paths.length) {
        let newPaths = []

        for (let path of paths) {
            for (let nextId of caves[path.cur].cxns) {
                let next = caves[nextId]

                if (next.isStart) {
                    continue
                }

                if (next.isEnd) {
                    count++
                    continue
                }

                let visitedSmallTwice = path.visitedSmallTwice

                if (next.isSmall && path.smallVisited.has(nextId)) {
                    if (part2 && !visitedSmallTwice) {
                        visitedSmallTwice = true
                    } else {
                        continue
                    }
                }

                newPaths.push({
                    cur: nextId,
                    smallVisited: new Set(path.smallVisited).add(nextId),
                    visitedSmallTwice: visitedSmallTwice
                })
            }
        }

        paths = newPaths
    }

    return count
}

if (typeof window == "undefined") {
    module.exports = day12
}
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
function getNum(letter) {
    return letter.charCodeAt(0) - "A".charCodeAt(0)
}

function day14(input, part2) {
    let lines = input.split("\n").splitOnElement("")

    let init = lines[0][0].split("")
    let rules = lines[1].map((e) => e.split(" -> "))

    let counts = {}

    for (let i = 0; i < init.length - 1; i++) {
        let substr = init[i] + init[i + 1]
        counts[substr] = (counts[substr] || 0) + 1
    }

    for (let i = 0; i < (part2 ? 40 : 10); i++) {
        let changes = {}

        for (let rule of rules) {
            let target = rule[0][0] + rule[0][1]
            let left = rule[0][0] + rule[1]
            let right = rule[1] + rule[0][1]

            changes[left] = (changes[left] || 0) + (counts[target] || 0)
            changes[right] = (changes[right] || 0) + (counts[target] || 0)
            changes[target] = (changes[target] || 0) - (counts[target] || 0)
        }

        for (let pair in changes) {
            counts[pair] = (counts[pair] || 0) + changes[pair]
        }
    }

    // this double counts all letters except the first and last so we add one to those and / 2 at end
    let letters = Array(26).fill(0)
    letters[getNum(init[0])]++
    letters[getNum(init[init.length - 1])]++

    for (let pair in counts) {
        letters[getNum(pair[0])] += counts[pair]
        letters[getNum(pair[1])] += counts[pair]
    }

    letters = letters.truthy()

    return (letters.max() - letters.min()) / 2
}

if (typeof window == "undefined") {
    module.exports = day14
}
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
function toInt(bits) {
    return parseInt(bits.join(""), 2)
}

class Packet {
    full = []

    version = []
    type = []
    groups = [[]]
    lengthType = []
    length = []

    children = []
    done = false

    constructor(bits = []) {
        for (let bit of bits) {
            this.pushBit(bit)
        }
    }

    pushBit(bit) {
        if (this.version.length < 3) {
            this.version.push(bit)
            return this.full.push(bit)
        }

        if (this.type.length < 3) {
            this.type.push(bit)
            return this.full.push(bit)
        }

        if (this.isLiteral()) {
            if (this.groups.last.length < 5) {
                this.groups.last.push(bit)
                return this.full.push(bit)
            }

            if (this.groups.last[0]) {
                this.groups.push([bit])
                return this.full.push(bit)
            }
        } else {
            if (this.children.length == 0) {
                this.children.push(new Packet())
            }

            if (this.lengthType.length < 1) {
                this.lengthType.push(bit)
                return this.full.push(bit)
            }

            if (!this.lengthType[0]) {
                if (this.length.length < 15) {
                    this.length.push(bit)
                    return this.full.push(bit)
                }

                if (this.children.map((e) => e.full.length).sum() < toInt(this.length)) {
                    this.children.last.pushBit(bit)

                    if (this.children.last.done) {
                        this.children.push(new Packet([bit]))
                    }

                    return this.full.push(bit)
                }
            } else {
                if (this.length.length < 11) {
                    this.length.push(bit)
                    return this.full.push(bit)
                }

                if (!this.children.last.done) {
                    this.children.last.pushBit(bit)

                    if (this.children.last.done) {
                        if (this.children.length < toInt(this.length)) {
                            this.children.push(new Packet([bit]))
                            return this.full.push(bit)
                        }
                    } else {
                        return this.full.push(bit)
                    }
                }
            }
        }

        this.done = true
    }

    isLiteral() {
        return toInt(this.type) == 4
    }

    getLiteralValue() {
        return toInt(this.groups.flatMap((e) => e.slice(1)))
    }

    getVersionSum() {
        return toInt(this.version) + this.children.map((e) => e.getVersionSum()).sum()
    }

    getValue() {
        if (this.isLiteral()) {
            return this.getLiteralValue()
        } else {
            let operands = this.children.map((e) => e.getValue())

            switch (toInt(this.type)) {
                case 0:
                    return operands.sum()

                case 1:
                    return operands.prod()

                case 2:
                    return operands.min()

                case 3:
                    return operands.max()

                case 5:
                    return +(operands[0] > operands[1])

                case 6:
                    return +(operands[0] < operands[1])

                case 7:
                    return +(operands[0] == operands[1])
            }
        }
    }
}

function day16(input, part2) {
    let bits = input.split("").flatMap((e) => parseInt(e, 16).toString(2).padStart(4, "0").split("").num())
    return new Packet(bits)[part2 ? "getValue" : "getVersionSum"]()
}

if (typeof window == "undefined") {
    module.exports = day16
}
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
class SnailfishNumber {
    static fromArr(arr, parent = null, isRight) {
        let num = new SnailfishNumber()
        return num.initialize(
            arr[0] instanceof Array ? SnailfishNumber.fromArr(arr[0], num, false) : arr[0],
            arr[1] instanceof Array ? SnailfishNumber.fromArr(arr[1], num, true) : arr[1],
            parent, isRight)
    }

    initialize(left, right, parent, isRight) {
        this.left = left
        this.right = right
        this.parent = parent
        this.isRight = isRight
        return this
    }

    explode(depth = 0) {
        if (this.left instanceof SnailfishNumber) {
            if (this.left.explode(depth + 1)) {
                return true
            }
        }

        if (this.right instanceof SnailfishNumber) {
            if (this.right.explode(depth + 1)) {
                return true
            }
        }

        if (!(this.left instanceof SnailfishNumber) && !(this.right instanceof SnailfishNumber) && depth >= 4) {
            let lastNode = this
            let node = this.parent

            while (node && node.left == lastNode) {
                lastNode = node
                node = node.parent
            }

            if (node) {
                if (!(node.left instanceof SnailfishNumber)) {
                    node.left += this.left
                } else {
                    node = node.left

                    while (node.right instanceof SnailfishNumber) {
                        node = node.right
                    }

                    node.right += this.left
                }
            }

            lastNode = this
            node = this.parent

            while (node && node.right == lastNode) {
                lastNode = node
                node = node.parent
            }

            if (node) {
                if (!(node.right instanceof SnailfishNumber)) {
                    node.right += this.right
                } else {
                    node = node.right

                    while (node.left instanceof SnailfishNumber) {
                        node = node.left
                    }

                    node.left += this.right
                }
            }

            if (!this.isRight) {
                this.parent.left = 0
            } else {
                this.parent.right = 0
            }

            return true
        }

        return false
    }

    split() {
        if (this.left instanceof SnailfishNumber) {
            if (this.left.split()) {
                return true
            }
        } else if (this.left >= 10) {
            this.left = SnailfishNumber.fromArr([Math.floor(this.left / 2), Math.ceil(this.left / 2)], this, false)
            return true
        }

        if (this.right instanceof SnailfishNumber) {
            if (this.right.split()) {
                return true
            }
        } else if (this.right >= 10) {
            this.right = SnailfishNumber.fromArr([Math.floor(this.right / 2), Math.ceil(this.right / 2)], this, true)
            return true
        }

        return false
    }

    reduce() {
        while (this.explode() || this.split());
        return this
    }

    add(that) {
        let parent = SnailfishNumber.fromArr([this, that])
        this.parent = parent
        this.isRight = false
        that.parent = parent
        that.isRight = true
        return parent.reduce()
    }

    magnitude() {
        return 3 * (this.left instanceof SnailfishNumber ? this.left.magnitude() : this.left) +
            2 * (this.right instanceof SnailfishNumber ? this.right.magnitude() : this.right)
    }

    toString() {
        return "[" + this.left.toString() + "," + this.right.toString() + "]"
    }
}

function day18(input, part2) {
    let lines = input.split("\n")

    if (!part2) {
        let nums = lines.map((line) => SnailfishNumber.fromArr(JSON.parse(line)))
        return nums.reduce((a, b) => a.add(b)).magnitude()
    } else {
        let pairs = lines.flatMap((e) => lines.filter((f) => e != f).map((f) => [e, f].map((e) => SnailfishNumber.fromArr(JSON.parse(e)))))
        return pairs.map((e) => e[0].add(e[1]).magnitude()).max()
    }
}

if (typeof window == "undefined") {
    module.exports = day18
}
function allRotations(pt) {
    return new PointArray(
        new Point(pt.x, pt.y, pt.z), // facing +x, +z up
        new Point(pt.x, pt.z, -pt.y),
        new Point(pt.x, -pt.y, -pt.z),
        new Point(pt.x, -pt.z, pt.y),
        new Point(-pt.x, -pt.y, pt.z), // facing -x, +z up
        new Point(-pt.x, -pt.z, -pt.y),
        new Point(-pt.x, pt.y, -pt.z),
        new Point(-pt.x, pt.z, pt.y),
        new Point(-pt.y, pt.x, pt.z), // facing +y, +z up
        new Point(-pt.y, pt.z, -pt.x),
        new Point(-pt.y, -pt.x, -pt.z),
        new Point(-pt.y, -pt.z, pt.x),
        new Point(pt.y, -pt.x, pt.z), // facing -y, +z up
        new Point(pt.y, -pt.z, -pt.x),
        new Point(pt.y, pt.x, -pt.z),
        new Point(pt.y, pt.z, pt.x),
        new Point(pt.z, -pt.y, pt.x), // facing +z, -x up
        new Point(pt.z, -pt.x, -pt.y),
        new Point(pt.z, pt.y, -pt.x),
        new Point(pt.z, pt.x, pt.y),
        new Point(-pt.z, pt.y, pt.x), // facing -z, +x up
        new Point(-pt.z, pt.x, -pt.y),
        new Point(-pt.z, -pt.y, -pt.x),
        new Point(-pt.z, -pt.x, pt.y)
    )
}

const rotationsProto = allRotations(new Point(1, 2, 3))

const composedRotations = rotationsProto.mapArr((e) => allRotations(e).mapArr((e) => rotationsProto.indexOf(e)))
const inverseRotations = composedRotations.map((e) => e.indexOf(0))

function rotate(pt, t) {
    return allRotations(pt)[t < 0 ? inverseRotations[-t] : t]
}

class Transform {
    constructor(translate, rotate) {
        this.translate = translate
        this.rotate = rotate
    }

    transform(pt) {
        return rotate(pt.add(this.translate), this.rotate)
    }

    // R(x + T) = x'
    // x = R'(x') - T = R'(x' - R(T))
    invert() {
        return new Transform(rotate(this.translate, this.rotate).neg(), inverseRotations[this.rotate])
    }

    // x' = R2(R1(x + T1) + T2) = R2(R1(x) + R1(T1) + T2)
    // T' = R1(T1) + T2; x' = (R2 o R1)((x) + R1^-1 (T'))
    compose(that) {
        return new Transform(
            rotate(rotate(this.translate, this.rotate).add(that.translate), inverseRotations[this.rotate]),
            composedRotations[this.rotate][that.rotate]
        )
    }
}

function day19(input, part2) {
    let lines = input.split("\n")

    let scans = new PointArray()

    for (let line of lines) {
        if (line.includes("---")) {
            scans.push(new PointArray())
        } else if (line) {
            scans.last.push(new Point(...line.split(",").num()))
        }
    }

    let transforms = Array(scans.length).fill().map((_, i) => {
        let a = Array(scans.length).fill()
        a[i] = new Transform(new Point(0, 0, 0), 0)
        return a
    })

    let recurse = function(i) {
        let scan = scans[i]
        let sharedCount = 0

        scan.checked = true

        for (let j = 0; j < scan.length - 11 - sharedCount; j++) {
            let scanRel = scan.map((e) => e.sub(scan[j]))
            let shared = false

            for (let k = 0; k < scans.length; k++) {
                if (scans[k].checked) {
                    continue
                }

                out: for (let t = 0; t < 24; t++) {
                    let scan2 = scans[k].map((e) => rotate(e, t))

                    for (let l = 0; l < scan2.length; l++) {
                        let scanRel2 = scan2.map((e) => e.sub(scan2[l]))

                        let count = 0

                        for (let m = 0; m < scanRel.length; m++) {
                            if (m > scanRel.length - 12 + count) {
                                break
                            }

                            for (let pt of scanRel2) {
                                if (scanRel[m].equals(pt)) {
                                    count++
                                }
                            }
                        }

                        if (count >= 12) {
                            transforms[i][k] = new Transform(scan2[l].sub(scan[j]), inverseRotations[t])
                            transforms[k][i] = transforms[i][k].invert()

                            for (let m = 0; m < transforms.length; m++) {
                                if (m != i && transforms[m][i] && !transforms[m][k]) {
                                    transforms[m][k] = transforms[m][i].compose(transforms[i][k])
                                    transforms[k][m] = transforms[m][k].invert()
                                }

                                if (m != k && transforms[m][k] && !transforms[m][i]) {
                                    transforms[m][i] = transforms[m][k].compose(transforms[k][i])
                                    transforms[i][m] = transforms[m][i].invert()
                                }
                            }

                            console.log(`linked ${i}<->${k}\t(${i} point ${j} == ${k} point ${l} with rotation ${t})`)

                            recurse(k)

                            shared = true
                            break out
                        }
                    }
                }
            }

            if (shared) {
                sharedCount++
            }
        }
    }

    recurse(0)

    if (!part2) {
        let beacons = new PointArray()

        for (let i = 0; i < scans.length; i++) {
            beacons.pushUniq(...scans[i].map((pt) => transforms[i][0].transform(pt)))
        }

        return beacons.length
    } else {
        return transforms.flatMap((e) => e.map((f) => Math.abs(f.translate.x) + Math.abs(f.translate.y) + Math.abs(f.translate.z))).max()
    }
}

if (typeof window == "undefined") {
    module.exports = day19
}
function day1(input, part2) {
    return input.split("\n").num().count((e, i, a, k = a[i - (part2 ? 3 : 1)]) => k && e > k)
}

if (typeof window == "undefined") {
    module.exports = day1
}
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
// turn: 0-1; 1 bit (0 = player 1; 1 = player 2)
// pos1: 1-10; 4 bits
// pos2: 1-10; 4 bits
// score1: 0-1009; 10 bits
// score2: 0-1009; 10 bits
const sizeS = 10
const sizeP = 4
const sizeT = 1

const maskS = (1 << sizeS) - 1
const maskP = (1 << sizeP) - 1
const maskT = (1 << sizeT) - 1

const offsetS2 = 0
const offsetS1 = offsetS2 + sizeS
const offsetP2 = offsetS1 + sizeS
const offsetP1 = offsetP2 + sizeP
const offsetT = offsetP1 + sizeP

function encodeState(turn, pos1, pos2, score1, score2) {
    return (score2 << offsetS2) |
        (score1 << offsetS1) |
        (pos2 << offsetP2) |
        (pos1 << offsetP1) |
        (turn << offsetT)
}

function getScore(state, player) {
    return state >> (player ? offsetS2 : offsetS1) & maskS
}

function advState(state, roll, win) {
    let turn = state >> offsetT

    let offsetPos = turn ? offsetP2 : offsetP1
    let offsetScore = turn ? offsetS2 : offsetS1

    let pos = (state >> offsetPos) & maskP
    let score = (state >> offsetScore) & maskS

    pos = (((pos + roll) - 1) % 10) + 1
    score += pos

    if (score >= win) {
        return turn
    }

    state &= ~(maskP << offsetPos)
    state |= pos << offsetPos

    state &= ~(maskS << offsetScore)
    state |= score << offsetScore

    state ^= 1 << offsetT

    return state
}

const rollCombos = [1, 2, 3].cartProduct([1, 2, 3]).cartProduct([1, 2, 3]).map((e) => e.flat().sum())

function day21(input, part2) {
    let lines = input.split("\n")

    let pos1 = +lines[0].split(" ").last
    let pos2 = +lines[1].split(" ").last

    let state = encodeState(0, pos1, pos2, 0, 0)

    if (!part2) {
        const win = 1000

        let die = 0
        let rolls = 0

        while (getScore(state, 0) < win && getScore(state, 1) < win) {
            let roll = ++die
            die %= 100
            roll += ++die
            die %= 100
            roll += ++die
            die %= 100

            rolls += 3

            newState = advState(state, roll, win)

            if (newState == 0 || newState == 1) {
                return getScore(state, 1 - newState) * rolls
            }

            state = newState
        }
    } else {
        let universes = {}
        universes[state] = 1

        let wins = [0, 0]

        while (true) {
            let universesLeft = false

            for (let state in universes) {
                if (!universes[state]) {
                    continue
                }

                universesLeft = true

                state = +state

                for (let roll of rollCombos) {
                    let newState = advState(state, roll, 21)

                    if (newState == 0 || newState == 1) {
                        wins[newState] += universes[state]
                    } else {
                        universes[newState] = (universes[newState] || 0) + universes[state]
                    }
                }

                delete universes[state]
            }

            if (!universesLeft) {
                break
            }
        }

        return wins.max()
    }
}

if (typeof window == "undefined") {
    module.exports = day21
}
class Cuboid {
    constructor(sgn, xs, xe, ys, ye, zs, ze) {
        this.sgn = sgn
        this.xs = Math.min(xs, xe)
        this.xe = Math.max(xs, xe)
        this.ys = Math.min(ys, ye)
        this.ye = Math.max(ys, ye)
        this.zs = Math.min(zs, ze)
        this.ze = Math.max(zs, ze)
    }

    vol() { return (this.xe - this.xs + 1) * (this.ye - this.ys + 1) * (this.ze - this.zs + 1) }

    int(that) {
        if (that.xe < this.xs || this.xe < that.xs) return
        if (that.ye < this.ys || this.ye < that.ys) return
        if (that.ze < this.zs || this.ze < that.zs) return

        let sgn = -that.sgn

        let xs = Math.max(this.xs, that.xs)
        let xe = Math.min(this.xe, that.xe)
        let ys = Math.max(this.ys, that.ys)
        let ye = Math.min(this.ye, that.ye)
        let zs = Math.max(this.zs, that.zs)
        let ze = Math.min(this.ze, that.ze)

        return new Cuboid(sgn, xs, xe, ys, ye, zs, ze)
    }
}

function day20(input, part2) {
    let lines = input.split("\n")

    let cuboids = []

    for (let line of lines) {
        let data = line.match(/^(.+) x=(.+)\.\.(.+),y=(.+)\.\.(.+),z=(.+)\.\.(.+)$/)
        let cuboid = new Cuboid(data[1] == "on", +data[2], +data[3], +data[4], +data[5], +data[6], +data[7])

        if (!part2 && (
            cuboid.xs < -50 || cuboid.xe > 50 ||
            cuboid.ys < -50 || cuboid.ye > 50 ||
            cuboid.zs < -50 || cuboid.ze > 50)) {
            continue
        }

        let toAdd = [cuboid]

        for (let otherCuboid of cuboids) {
            let intersection = cuboid.int(otherCuboid)

            if (intersection) {
                toAdd.push(intersection)
            }
        }

        cuboids.push(...toAdd)
    }

    return cuboids.map((e) => e.vol() * e.sgn).sum()
}

if (typeof window == "undefined") {
    module.exports = day20
}
const statesArr = []
const stateIdxs = {}

function encodeState(arr) {
    let key = arr.join("")

    if (!(key in stateIdxs)) {
        stateIdxs[key] = statesArr.push(arr) - 1
    }

    return stateIdxs[key]
}

function decodeState(num) {
    return statesArr[num]
}

// 0 is hallway, 1 is A room, 2 is B room, etc
function getRoom(pos) {
    if (pos < 11) {
        return 0
    }

    return ((pos - 11) % 4) + 1
}

let hallwayStops = [0, 1, 3, 5, 7, 9, 10]
let roomPoses = []

function possibleStates(num) {
    let state = decodeState(num)

    let newStates = []

    for (let pos = 0; pos < state.length; pos++) {
        let amphipod = state[pos]

        if (!amphipod) {
            continue
        }

        let curRoom = getRoom(pos)

        let roomEntrance = 2 * curRoom
        let destRoomEntrance = 2 * amphipod

        let curRoomPoses = roomPoses[getRoom(pos)]
        let destRoomPoses = roomPoses[amphipod]

        let depthInRoom = curRoomPoses?.indexOf(pos)

        if (curRoom == amphipod && curRoomPoses.slice(depthInRoom).every((e) => state[e] == amphipod)) {
            continue
        }

        let dests = []

        let destRoomAvailable = destRoomPoses.every((pos) => state[pos] == 0 || state[pos] == amphipod)

        let steps = 0
        let hallwayPos

        if (curRoom != 0) {
            if (curRoomPoses.slice(0, depthInRoom).some((pos) => state[pos] != 0)) {
                continue
            }

            destRoomAvailable &&= roomEntrance != destRoomEntrance

            steps = depthInRoom + 1
            hallwayPos = roomEntrance
        } else {
            hallwayPos = pos
        }

        let destRoomSteps = -1

        let leftPath = hallwayStops.filter((pos) => pos < hallwayPos).reverse()
        let rightPath = hallwayStops.filter((pos) => pos > hallwayPos)

        let leftBlock = leftPath.findIndex((pos) => state[pos] != 0)
        let rightBlock = rightPath.findIndex((pos) => state[pos] != 0)

        let leftDests = (leftBlock > -1 ? leftPath.slice(0, leftBlock) : leftPath)
            .map((pos) => [pos, steps + hallwayPos - pos])
        let rightDests = (rightBlock > -1 ? rightPath.slice(0, rightBlock) : rightPath)
            .map((pos) => [pos, steps + pos - hallwayPos])

        if (curRoom != 0) {
            dests.push(...leftDests, ...rightDests)
        }

        if (destRoomAvailable) {
            destRoomSteps =
                [...leftDests, [hallwayPos, steps]].find((e) => e[0] == destRoomEntrance + 1)?.[1] ??
                [...rightDests, [hallwayPos, steps]].find((e) => e[0] == destRoomEntrance - 1)?.[1] ?? -1
        }

        if (destRoomSteps > -1) {
            let destRoomBlock = destRoomPoses.findIndex((pos) => state[pos] != 0)
            let destPosIdx = (destRoomBlock > -1 ? destRoomBlock : destRoomPoses.length) - 1
            dests.push([destRoomPoses[destPosIdx], destRoomSteps + 2 + destPosIdx])
        }

        newStates.push(...dests.map((e) => {
            let newState = state.copy()

            newState[pos] = 0
            newState[e[0]] = amphipod

            return { state: encodeState(newState), energy: e[1] * [1, 10, 100, 1000][amphipod - 1] }
        }))
    }

    return newStates
}

function isSolved(num) {
    let state = decodeState(num)
    return roomPoses.every((poses, i) => poses.every((pos) => state[pos] == i))
}

function day23(input, part2) {
    let lines = input.split("\n")

    if (part2) {
        lines.splice(3, 0, "  #D#C#B#A#", "  #D#B#A#C#")
    }

    for (let i = 1; i <= 4; i++) {
        roomPoses[i] = Array(part2 ? 4 : 2).fill().map((_, j) => 10 + j * 4 + i)
    }

    let state = encodeState(lines.join("").replace(/[# ]/g, "")
        .replaceAll(".", 0)
        .replaceAll("A", 1)
        .replaceAll("B", 2)
        .replaceAll("C", 3)
        .replaceAll("D", 4).split("").num())

    let energies = {}
    energies[state] = 0

    let stateHeap = new BinHeap((state1, state2) => state1.totalEnergy < state2.totalEnergy)
    stateHeap.insert({ state: state, totalEnergy: 0 })

    for (let i = 0; ; i++) {
        let top = stateHeap.extract()

        if (isSolved(top.state)) {
            return top.totalEnergy
        }

        for (let res of possibleStates(top.state)) {
            let energy = top.totalEnergy + res.energy

            if (res.state in energies) {
                let idx = stateHeap.data.findIndex((e) => e.state == res.state)
                if (idx > -1 && energy < stateHeap.data[idx].totalEnergy) {
                    stateHeap.data[idx].totalEnergy = energy
                    stateHeap.up(idx)
                }
            } else {
                energies[res.state] = energy
                stateHeap.insert({ state: res.state, totalEnergy: energy })
            }
        }

        if (i % 10000 == 0) {
            console.log("iteration", i, "heap size", stateHeap.data.length, "min energy", top.totalEnergy)
        }
    }
}

if (typeof window == "undefined") {
    module.exports = day23
}
function day24(input, part2) {
    let lines = input.split("\n")
    let ops = lines.splitOnElement("inp w").filter((e) => e.length).transpose()

    let compareVals = ops[4].map((e) => +e.split(" ").last)
    let stackVals = ops[14].map((e) => +e.split(" ").last)

    let len = compareVals.length

    let stack = []
    let num = Array(len).fill()

    for (let i = 0; i < len; i++) {
        if (compareVals[i] > 0) {
            stack.push([i, stackVals[i]])
        } else {
            num[i] = stack.pop()
            num[i][1] += compareVals[i]
            num[num[i][0]] = [i, -num[i][1]]
        }
    }

    for (let i = 0; i < len; i++) {
        if (num[i][0] > i) {
            num[i] = part2 ? Math.max(1, 1 + num[i][1]) : Math.min(9, 9 + num[i][1])
        } else {
            num[i] = num[num[i][0]] + num[i][1]
        }
    }

    return num.join("")
}

if (typeof window == "undefined") {
    module.exports = day24
}
function step(grid, dir) {
    let moved = false

    grid.mapMut((e, pt, g) => {
        let target = dir == 1 ?
            new Point((pt.x + 1) % g.width, pt.y) :
            new Point(pt.x, (pt.y + 1) % g.height)

        if (e % 3 == dir && g.get(target) % 3 == 0) {
            g.set(target, dir * 3)
            moved = true
            return e
        } else {
            return e * 3 + e
        }
    }).mapMut((e) => ((e / 3) | 0) % 3)

    return moved
}

function day25(input) {
    let grid = Grid.fromStr(input).mapMut((e) => ".>v".indexOf(e))

    let moved
    let steps = 0

    do {
        steps++
    } while (step(grid, 1) + step(grid, 2))

    return steps
}

if (typeof window == "undefined") {
    module.exports = day25
}
function day2(input, part2) {
    let x = 0
    let y = 0
    let a = 0

    for (let line of input.split("\n")) {
        if (!part2) {
            eval(line.replace("forward", "x +=")
                .replace("up", "y -=")
                .replace("down", "y +="))
        } else {
            eval(line.replace(/forward (.+)/, "x += $1; y += a * $1")
                .replace("up", "a -=")
                .replace("down", "a +="))
        }
    }

    return x * y
}

if (typeof window == "undefined") {
    module.exports = day2
}
function day3(input, part2) {
    let g = Grid.fromStr(input)

    if (!part2) {
        let gamma = g.getColumns().map((col) => col.mode())
        let epsilon = g.getColumns().map((col) => col.antimode())
        return parseInt(gamma.join(""), 2) * parseInt(epsilon.join(""), 2)
    } else {
        let oxy = g.getRows()
        let co2 = g.getRows()

        for (let i = 0; i < g.width; i++) {
            let oxyBit = oxy.transpose()[i].mode((a, b) => a == 1 ? -1 : 1)
            let co2Bit = co2.transpose()[i].antimode((a, b) => a == 0 ? -1 : 1)
            oxy = oxy.filter((e) => e[i] == oxyBit)
            co2 = co2.filter((e) => e[i] == co2Bit)
        }

        return parseInt(oxy[0].join(""), 2) * parseInt(co2[0].join(""), 2)
    }
}

if (typeof window == "undefined") {
    module.exports = day3
}
function day4(input, part2) {
    let lines = input.split("\n")

    let seq = lines.shift().split(",").num()
    let grids = lines.splitOnElement("").filter((e) => e.length).map((grid) => Grid.fromStr(grid.map((line) => line.replace(/^ /, "")).join("\n"), /\s+/).mapMut((e) => [+e, false]))

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
function day6(input, part2) {
    let fish = input.split(",").num()
    let counts = Array(9).fill().map((_, i) => fish.count(i))

    for (let i = 0; i < (part2 ? 256 : 80); i++) {
        counts.push(counts.shift())
        counts[6] += counts[8]
    }

    return counts.sum()
}

if (typeof window == "undefined") {
    module.exports = day6
}
function day7(input, part2) {
    let crabs = input.split(",").num()

    let max = crabs.max()
    let costs = []

    for (let i = 0; i < max; i++) {
        costs[i] = crabs.map((e) => {
            let dist = Math.abs(e - i)
            return part2 ? dist * (dist + 1) / 2 : dist
        }).sum()
    }

    return costs.min()
}

if (typeof window == "undefined") {
    module.exports = day7
}
function day8(input, part2) {
    let lines = input.split("\n").map((e) => e.split(" ").splitOnElement("|").map((e) => e.map((e) => e.split("").sort())))

    if (!part2) {
        return lines.map((e) => e[1].count((e) => [2, 4, 3, 7].includes(e.length))).sum()
    }

    let sum = 0

    for (let line of lines) {
        let samples = line.flat()

        let n1 = samples.find((e) => e.length == 2)
        let n7 = samples.find((e) => e.length == 3)
        let n4 = samples.find((e) => e.length == 4)
        let a235 = samples.filter((e) => e.length == 5)
        let a069 = samples.filter((e) => e.length == 6)
        let n8 = samples.find((e) => e.length == 7)

        let n6 = a069.find((e) => n1.sub(e).length == 1)
        let n9 = a069.find((e) => n4.sub(e).length == 0)
        let n0 = a069.find((e) => e != n6 && e != n9)

        let n2 = a235.find((e) => n4.sub(e).length == 2)
        let n3 = a235.find((e) => n1.sub(e).length == 0)
        let n5 = a235.find((e) => e != n2 && e != n3)

        sum += +line[1].map((e) => [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9].findIndex((n) => n.join("") == e.join(""))).join("")
    }

    return sum
}

if (typeof window == "undefined") {
    module.exports = day8
}
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
