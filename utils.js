utils = {
	log: (e, ...args) => (console.log(e, ...args), e),
	logCopy: (e, ...args) => (console.log(e.copyDeep(), ...args), e),
	fetch: (url) => fetch(url).then(e => e.text()),
	fetchEval: (url) => utils.fetch(url).then(e => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill))
}

utils.range = utils.signAgnosticInclusiveRange


