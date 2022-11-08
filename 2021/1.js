function day1(input, part2) {
    return input.split`\n`.num().count((e, i, a, k = a[i - (part2 ? 3 : 1)]) => k && e > k)
}
