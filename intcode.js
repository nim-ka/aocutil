IntcodeParameter = class IntcodeParameter {
	static MODE_POS = 0
	static MODE_IMM = 1
	static MODE_REL = 2

	constructor(vm, val, mode) {
		this.vm = vm
		this.val = val
		this.mode = mode
	}

	get() {
		switch (this.mode) {
			case IntcodeParameter.MODE_POS:
				return this.vm.readMemory(this.val)
				break

			case IntcodeParameter.MODE_IMM:
				return this.val
				break

			case IntcodeParameter.MODE_REL:
				return this.vm.readMemory(this.vm.base + this.val)
				break

			default:
				console.error(`IntcodeParameter.get: Unrecognized parameter mode ${this.mode}`)
				this.vm.halt()
		}
	}

	set(val) {
		switch (this.mode) {
			case IntcodeParameter.MODE_POS:
				return this.vm.writeMemory(this.val, val)
				break

			case IntcodeParameter.MODE_IMM:
				console.error(`IntcodeParameter.set: Cannot write to parameter in immediate mode`)
				this.vm.halt()
				break

			case IntcodeParameter.MODE_REL:
				return this.vm.writeMemory(this.vm.base + this.val, val)
				break

			default:
				console.error(`IntcodeParameter.set: Unrecognized parameter mode ${this.mode}`)
				this.vm.halt()
		}
	}
}

IntcodeVM = class IntcodeVM {
	static OP_ADD = 1
	static OP_MUL = 2
	static OP_INP = 3
	static OP_OUT = 4
	static OP_JIT = 5
	static OP_JIF = 6
	static OP_SLT = 7
	static OP_SEQ = 8
	static OP_RBO = 9

	static OP_HLT = 99

	static INSTRS = []

	constructor(program, inputBuffer = [], outputBuffer = []) {
		this.program = program
		this.inputBuffer = inputBuffer
		this.outputBuffer = outputBuffer

		this.reset()
	}

	reset() {
		this.outputBuffer.length = 0

		this.data = this.program.slice()
		this.pc = 0
		this.base = 0

		this.running = false
		this.halted = false
		this.jumping = false
		this.awaitingInput = false
	}

	clone() {
		let vm = new IntcodeVM(this.program.slice(), this.inputBuffer.slice(), this.outputBuffer.slice())

		vm.data = this.data.slice()
		vm.pc = this.pc
		vm.base = this.base

		vm.running = this.running
		vm.halted = this.halted
		vm.jumping = this.jumping
		vm.awaitingInput = this.awaitingInput

		return vm
	}

	readMemory(addr) {
		if (addr < 0) {
			console.error(`IntcodeVM.readMemory: Attempted to read from invalid address ${addr}`)
			return null
		}

		return this.data[addr] ?? 0
	}

	writeMemory(addr, val) {
		if (addr < 0) {
			console.error(`IntcodeVM.writeMemory: Attempted to write ${val} to invalid address ${addr}`)
			return null
		}

		return this.data[addr] = val
	}

	executeInstruction(num) {
		let opcode = num % 100

		if (!(opcode in IntcodeVM.INSTRS)) {
			console.error(`IntcodeVM.executeInstruction: Unrecognized opcode: ${opcode} (${num})`)
		}

		let instr = IntcodeVM.INSTRS[opcode]

		let args = []
		let ptr = this.pc + 1

		num = Math.floor(num / 100)

		for (let i = 0; i < instr.arity; i++) {
			args.push(new IntcodeParameter(this, this.readMemory(ptr++), num % 10))
			num = Math.floor(num / 10)
		}

		instr.op.apply(this, args)

		return ptr
	}

	step() {
		let num = this.readMemory(this.pc)

		if (num === undefined) {
			console.error(`IntcodeVM.run: No instruction found at PC ${this.pc}; stopping`)
			this.halt()
			return
		}

		let newPc = this.executeInstruction(num)

		if (this.jumping) {
			this.jumping = false
		} else if (this.running) {
			this.pc = newPc
		}
	}

	run(limit = 10000000) {
		let i = 0

		this.running = true

		while (this.running) {
			if (++i > limit) {
				console.error(`IntcodeVM.run: Run limit reached; stopping`)
				this.halt()
				break
			}

			this.step()
		}

		return i
	}

	halt() {
		this.running = false
		this.halted = true
	}

	jump(newPc) {
		this.pc = newPc
		this.jumping = true
	}

	receiveInput() {
		if (this.inputBuffer.length) {
			return this.inputBuffer.shift()
		} else {
			this.awaitingInput = true
			this.running = false
			return null
		}
	}

	sendInput(...vals) {
		this.inputBuffer.push(...vals)
	}

	sendInputString(str) {
		this.sendInput(...str.split("").map((e) => e.charCodeAt()))
	}

	receiveOutput() {
		if (this.outputBuffer.length) {
			return this.outputBuffer.shift()
		} else {
			return null
		}
	}

	receiveNOutputs(n = Infinity) {
		let arr = []
		let res

		for (let i = 0; i < n; i++) {
			res = this.receiveOutput()

			if (res == null) {
				break
			}

			arr.push(res)
		}

		return arr
	}

	receiveOutputString(str) {
		return this.receiveNOutputs().map((e) => String.fromCharCode(e)).join("")
	}

	sendOutput(...vals) {
		this.outputBuffer.push(...vals)
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_ADD] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(a.get() + b.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_MUL] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(a.get() * b.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_INP] = {
	arity: 1,
	op: function(a) {
		let res = this.receiveInput()

		if (res !== null) {
			a.set(res)
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_OUT] = {
	arity: 1,
	op: function(a) {
		this.sendOutput(a.get())
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_JIT] = {
	arity: 2,
	op: function(a, b) {
		if (a.get() != 0) {
			this.jump(b.get())
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_JIF] = {
	arity: 2,
	op: function(a, b) {
		if (a.get() == 0) {
			this.jump(b.get())
		}
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_SLT] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(+(a.get() < b.get()))
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_SEQ] = {
	arity: 3,
	op: function(a, b, c) {
		c.set(+(a.get() == b.get()))
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_RBO] = {
	arity: 1,
	op: function(a) {
		this.base += a.get()
	}
}

IntcodeVM.INSTRS[IntcodeVM.OP_HLT] = {
	arity: 0,
	op: function() {
		this.halt()
	}
}

