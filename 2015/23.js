function day23(input, part2) {
	VM.DEBUG = false

	let vm = new VM(() => {}, {
		hlf: {
			types: [String],
			op: function(r) {
				this.regs[r] >>= 1
			}
		},
		tpl: {
			types: [String],
			op: function(r) {
				this.regs[r] *= 3
			}
		},
		inc: {
			types: [String],
			op: function(r) {
				this.regs[r]++
			}
		},
		jmp: {
			types: [Number],
			op: function(offset) {
				this.regs.pc += offset
			},
			holdPc: true
		},
		jie: {
			types: [String, Number],
			op: function(r, offset) {
				this.regs.pc += this.regs[r] % 2 == 0 ? offset : 1
			},
			holdPc: true
		},
		jio: {
			types: [String, Number],
			op: function(r, offset) {
				this.regs.pc += this.regs[r] == 1 ? offset : 1
			},
			holdPc: true
		}
	})

	if (part2) {
		vm.regs.a = 1
	}

	vm.loadProgram(input)
	vm.run()

	return vm.regs.b
}

if (typeof window == "undefined") {
	module.exports = day23
}
