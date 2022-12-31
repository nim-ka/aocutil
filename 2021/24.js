function day24(input, part2) {
    let lines = input.split("\n")
    let ops = lines.splitOn("inp w").filter((e) => e.length).transpose()

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
