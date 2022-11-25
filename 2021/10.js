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
