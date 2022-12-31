function getNum(letter) {
    return letter.charCodeAt(0) - "A".charCodeAt(0)
}

function day14(input, part2) {
    let lines = input.split("\n").splitOn("")

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
