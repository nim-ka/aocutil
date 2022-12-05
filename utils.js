utils = {
	log: (e, ...args) => (console.log(e, ...args), e),
	logCopy: (e, ...args) => (console.log(e.copyDeep(), ...args), e),
	fetchText: (...args) => fetch(...args).then((e) => e.text()),
	fetchEval: (...args) => utils.fetchText(...args).then((e) => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill))
}

utils.range = utils.signAgnosticInclusiveRange

defaultPartNum = 1

A = function A(ans, part) {
	if (part != 1 && part != 2) {
		part = defaultPartNum
		console.warn(`Remember to specify part number! Defaulting to ${part}`)
	}

	console.log(`Submitting ${ans} for part ${part}`)

	let queryString = new URLSearchParams({
		"level": part.toString(),
		"answer": ans.toString()
	}).toString()

	utils.fetchText(location.href.replace("input", "answer"), {
		"headers": {
			"content-type": "application/x-www-form-urlencoded"
		},
		"body": queryString,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	}).then((text) => {
		if (text.includes("That's the right answer!")) {
			defaultPartNum = 2
		}

		console.log(text.match(/<article([\s\S]+?)article>/)[0].replace(/<.+?>/g, ""))
	})

	return ans
}
