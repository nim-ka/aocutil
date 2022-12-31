Instruction = class Instruction {
	constructor(command, types, args, varargs = false) {
		if (types.length != args.length && !varargs) {
			console.warn(`new Instruction: Attempted to create ${command} instruction: Expected ${types.length} arguments, got ${args.length} arguments`)
			console.log(args)
		}

		this.command = command
		this.args = args
		this.types = args.map((e, i) => types[i] ?? types[types.length - 1])
	}
}

// example command:
//
// add: {
//     types: [ String, 0, 0 ],
//     op: function(dest, a, b) {
//         this.regs[dest] = a + b
//     }
// }

VM = class VM {
	static evalNum(val) {
		return isNaN(val) ? this.regs[val] : Number(val)
	}

	get r() {
		return this.regs
	}

	constructor(init = () => {}, commands = {}) {
		if (init instanceof Function) {
			this.init = function() {
				this.regs = utils.createMap(0)
				init.apply(this)
			}
		} else if (init) {
			this.init = function() {
				this.regs = utils.createMap(0, init)
			}
		}

		this.commands = commands

		this.clearProgram()
		this.reset()
	}

	addCommand(name, command) {
		this.commands[name] = command
	}

	removeCommand(name) {
		return delete this.commands[name]
	}

	reset() {
		this.init()
		this.regs.pc = 0
		this.halted = false
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

		return new Instruction(command, this.commands[command].types.map((e) => e.bind(this)) ?? [], words, this.commands[command].varargs)
	}

	executeInstruction(instr) {
		return this.commands[instr.command].op.apply(this, instr.args.map((e, i) => instr.types[i](e)))
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

	step() {
		let instr = this.program[this.regs.pc]

		if (!instr) {
			console.warn(`VM.run: No instruction found at PC ${this.regs.pc}; stopping`)
			this.halt()
			return
		}

		this.executeInstruction(instr)

		if (!this.commands[instr.command].holdPc) {
			this.regs.pc++
		}
	}

	run(limit = 100000) {
		while (!this.halted) {
			if (--limit <= 0) {
				console.error(`VM.run: Run limit reached; stopping`)
				this.halt()
				break
			}

			this.step()
		}
	}

	halt() {
		this.halted = true
	}
}

