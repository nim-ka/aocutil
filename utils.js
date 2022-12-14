utils = {
	log: (e, ...args) => (console.log(e, ...args), e),
	logCopy: (e, ...args) => (console.log(e.copyDeep(), ...args), e),
	fetchText: (...args) => fetch(...args).then((e) => e.text()),
	fetchEval: (...args) => utils.fetchText(...args).then((e) => eval(e)),
	signAgnosticInclusiveRange: (a, b, s = Math.sign(a - b)) => Array((a - b) * s + 1).fill().map((_, i) => a - i * s),
	createGridArray: (w, h, fill = undefined) => Array(h).fill().map(() => Array(w).fill(fill)),
	// num utils because numbers are weird
	gcd2: (a, b) => {
		while (b) {
			[a, b] = [b, a % b]
		}

		return a
	},
	gcd: (...args) => args.length ? args.reduce(utils.gcd2) : 0,
	lcm2: (a, b) => a && b ? a * (b / utils.gcd2(a, b)) : 0,
	lcm: (...args) => args.length ? args.reduce(utils.lcm2) : 0,
	isPrime: (n) => {
		for (let i = 2; i * i <= n; i++) {
			if (n % i == 0) {
				return false
			}
		}

		return true
	},
	primeFactors: (n) => {
		let arr = []

		for (let i = 2; n > 1;) {
			if (i * i > n) {
				arr.push(+n)
				break
			} else if (n % i == 0) {
				arr.push(i)
				n /= i
			} else {
				i++
			}
		}

		return arr
	},
	factors: (n) => {
		let arr = []
		let arr2 = []

		for (let i = 1; i * i <= n; i++) {
			if (n % i == 0) {
				arr.push(i)

				if (i != n / i) {
					arr2.unshift(n / i)
				}
			}
		}

		return [...arr, ...arr2]
	},
	lock: (obj, val) => {
		let proxy

		let func = val instanceof Function ? val : () => val

		return proxy = new Proxy(obj, {
			get(obj, prop) {
				if (prop == "obj") {
					return Object.assign({}, proxy)
				} else if (prop in obj) {
					return obj[prop]
				} else {
					return func(obj, prop)
				}
			}
		})
	},
	createMap: (val = undefined, obj) => utils.lock(Object.assign({ __proto__: null }, obj), val),
	getObject: (obj) => Object.assign({}, obj),
	emptyArray: (n, func = (e, i) => i) => Array(n).fill().map(func)
}

M = utils.createMap

N = utils.emptyArray

O = utils.getObject

L = utils.log
LC = utils.logCopy

R = utils.range = utils.signAgnosticInclusiveRange

U = function U(n) {
	return utils.emptyArray(n, (e, i) => i + 1)
}

Z = function Z(n) {
	return utils.emptyArray(n, (e, i) => i)
}

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

B = function B(ans) {
	return A(ans, 2)
}


