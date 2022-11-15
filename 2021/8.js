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
