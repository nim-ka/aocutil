const fs = require("fs");
const readline = require("readline-promise").default;

let vm = new IntcodeVM(fs.readFileSync("25.txt", "utf8").nums());

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

(async () => {
	while (!vm.halted) {
		vm.run();

		let str = vm.receiveOutputString().trim();

		if (str.startsWith("==")) {
			console.clear();
		}

		let res = rl.questionAsync(str + " ");

		vm.sendInputString((await res) + "\n");
	}

	process.exit();
})();
