clean:
	rm  -f js-calculator.js ts-calculator.js ts-calculator.ts

# Javascript calculator
js-calculator-demo: js-calculator.js
	node js-calculator.cli.js calculator.input.txt

js-calculator.js: js-calculator.jison ../templates/javascript.yaml ../../lexer-generator/templates/javascript.yaml
	node ../lib/cli.js -t javascript -n JsCalc -o js-calculator.js js-calculator.jison

# Typescript calculator
ts-calculator-demo: ts-calculator.js
	node ts-calculator.cli.js calculator.input.txt

ts-calculator.ts: ts-calculator.jison ../templates/typescript.yaml ../../lexer-generator/templates/typescript.yaml
	node ../lib/cli.js -t typescript -n TsCalc -o ts-calculator.ts ts-calculator.jison

ts-calculator.js: ts-calculator.ts
	npx tsc ts-calculator.ts

# ts-node calculator -- run ts-calculator.ts without compiling with tsc
ts-node-calculator-demo: ts-calculator.ts
	npx ts-node ts-calculator.cli.js calculator.input.txt

