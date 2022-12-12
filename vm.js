Instruction = class Instruction {
	constructor(command, types, args) {
		if (types.length != args.length) {
			console.warn(`new Instruction: Attempted to create ${command} instruction: Expected ${types.length} arguments, got ${args.length} arguments`)
			console.log(args)
		}

		this.command = command
		this.args = args.map((e, i) => (types[i] ?? types[types.length - 1])(e))
	}
}

// example command:
//
// addi: {
//     types: [ String, String, Number ],
//     op: function(dest, src, imm) {
//         this.regs[dest] = this.src[dest] + imm
//     }
// }

VM = class VM {
	regs = utils.createMap(0)

	get r() {
		return this.regs
	}

	constructor(init = () => {}, commands, autoIncrementPc = true) {
		this.init = init.bind(this)
		this.commands = commands
		this.autoIncrementPc = autoIncrementPc

		this.clearProgram()
		this.reset()
	}

	reset() {
		this.regs.pc = 0
		this.init()
	}

	parseLine(line) {
		let words = line.split(/\s+/)

		if (!words.length) {
			return
		}

		let command = words.shift()

		if (!(command in this.commands)) {
			console.error(`VM.parseLine: Unrecognized command: ${command}`)
		}

		return new Instruction(command, this.commands[command].types ?? [], words)
	}

	executeInstruction(instr) {
		return this.commands[instr.command].op.apply(this, instr.args)
	}

	loadProgram(str) {
		this.clearProgram()

		let lines = str.split("\n")

		for (let i = 0; i < lines.length; i++) {
			let instr = this.parseLine(lines[i])

			if (instr) {
				this.program.push(instr)
			}
		}
	}

	clearProgram() {
		this.program = []
	}

	run(limit = 100000) {
		while (true) {
			if (--limit <= 0) {
				console.warn(`VM.run: Run limit reached; stopping`)
				break
			}

			let instr = this.program[this.regs.pc]

			if (!instr) {
				console.warn(`VM.run: No instruction found at PC ${this.regs.pc}; stopping`)
				break
			}

			this.executeInstruction(instr)

			if (this.autoIncrementPc) {
				this.regs.pc++
			}
		}
	}
}

