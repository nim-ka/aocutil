function day2(input, part2) {
    let x = 0
    let y = 0
    let a = 0

    input.split`\n`.forEach((e) => {
        if (!part2) {
            eval(e.replace("forward", "x +=").replace("up", "y -=").replace("down", "y +="))
        } else {
            eval(e.replace(/forward (.+)/, "x += $1; y += a * $1").replace("up", "a -=").replace("down", "a +="))
        }
    })

    return x * y
}
