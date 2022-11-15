function day6(input, part2) {
    input = input.split(",").num()

    let counts = Array(9).fill().map((_, i) => input.count(i))

    for (let i = 0; i < (part2 ? 256 : 80); i++) {
        counts = counts.rotate(1)
        counts[6] += counts[8]
    }

    return counts.sum()
}
