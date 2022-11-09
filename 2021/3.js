function day3(input, part2) {
    let g = Grid.fromStr(input)

    if (!part2) {
        let gamma = g.getColumns().map((col) => col.mode())
        let epsilon = g.getColumns().map((col) => col.antimode())
        return parseInt(gamma.join``, 2) * parseInt(epsilon.join``, 2)
    } else {
        let oxy = g.getRows()
        let co2 = g.getRows()

        for (let i = 0; i < g.width; i++) {
            let oxyBit = oxy.transpose()[i].mode((a, b) => a == 1 ? -1 : 1)
            let co2Bit = co2.transpose()[i].antimode((a, b) => a == 0 ? -1 : 1)
            oxy = oxy.filter((e) => e[i] == oxyBit)
            co2 = co2.filter((e) => e[i] == co2Bit)
        }

        return parseInt(oxy[0].join``, 2) * parseInt(co2[0].join``, 2)
    }
}
