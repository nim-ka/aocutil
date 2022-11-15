function iterate(counts) {
    return [counts[1], counts[2], counts[3], counts[4], counts[5], counts[6], counts[7] + counts[0], counts[8], counts[0]]
}

function day6(input, part2) {
    input = input.split(",").num()

    let counts = Array(9).fill().map((_, i) => input.count(i))

    for (let i = 0; i < (part2 ? 256 : 80); i++) {
        counts = iterate(counts)
    }

    return counts.sum()
}
