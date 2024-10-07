class Z3 {
	constructor(defaultVarType = "Int") {
		this.defaultVarType = defaultVarType
		
		this.vars = []
		this.outputs = []
		this.constraints = []
	}
	
	addVar(name, type = this.defaultVarType) {
		this.vars.push(`${name} = z3.${type}("${name}")`)
		return this
	}
	
	addVars(...names) {
		for (let name of names) {
			this.addVar(name)
		}
		return this
	}
	
	addOutput(expr) {
		this.outputs.push(`  ${expr}`)
		return this
	}
	
	addOutputs(...exprs) {
		for (let expr of exprs) {
			this.addOutput(expr)
		}
		return this
	}
	
	addConstraint(expr) {
		this.constraints.push(`solver.add(${expr})`)
		return this
	}
	
	addConstraints(...exprs) {
		for (let expr of exprs) {
			this.addConstraint(expr)
		}
		return this
	}
	
	compile() {
		return `import json
import pyperclip
import z3

def run(solver, outputs):
  print("Running...")

  if solver.check() == z3.unsat:
    print()
    print("unsat")
  else:
    print()
    print("sat")
    print()

    model = solver.model()
    dump = {}
    for expr in outputs:
      dump[repr(expr)] = repr(model.eval(expr))

    for key in dump:
      print(f"{key}: {dump[key]}")
    print()
    print("-----")
    print()
    print("Copied!")
    print()

    output = json.dumps(dump)
    print(output)
    pyperclip.copy(output)

solver = z3.Solver()

${this.vars.join("\n")}

outputs = [
${this.outputs.join(",\n")}
]

${this.constraints.sort((a, b) => Math.random() < 0.5 ? -1 : 1).join("\n")}

run(solver, outputs)`
	}
}

