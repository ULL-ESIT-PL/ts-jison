ts-jison examples
=================

Use ts-jison to generate parsers from an example, e.g.:
    $ node ../lib/cli.js basic_lex.jison

## [js]s-calculator
Generate compile and execute the usual calculator demo from both javascript (no type annotations) and typescript sources.

See the [Makefile](Makefile) which has targets for
- **js-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `js-calculator.js` from [js-calculator.jison](examples/js-calculator.jison) (has no typescript types)
  - exectute `js-calculator.js` against [calculator.input.txt](examples/calculator.input.txt) and send output to STDOUT
- **ts-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `ts-calculator.ts` from [ts-calculator.jison](examples/ts-calculator.jison) (has typescript types)
  - use `tsc` to compile `ts-calculator.js` from `ts-calculator.ts`
  - exectute against [calculator.input.txt](examples/calculator.input.txt) and send output to STDOUT


```
# In the root folder of the project, run:
npm run build
cd packages/parser-generator/examples
# This generates the parser in ts-calculator.ts. The names of the classes are `TsCalcParser` and `TsCalcLexer`
../lib/cli.js -t typescript -n TsCalc -o ts-calculator.ts ts-calculator.jison
# ➜  examples git:(casiano) ✗ grep TsCalc  ts-calculator.ts
# export class TsCalcParser extends JisonParser implements JisonParserApi {
#     constructor (yy = {}, lexer = new TsCalcLexer(yy)) {
# export class TsCalcLexer extends JisonLexer implements JisonLexerApi {
#     options: any = {"moduleName":"TsCalc"};

# Now we can compile the generated ts-calculator.ts file to js using tsc
npx tsc ts-calculator.ts
# Consider the input file for the calculator:
# ➜  examples git:(casiano) ✗ cat calculator.input.txt 
#        PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1
node ts-calculator.cli.js calculator.input.txt
# The output is:
#  ➜  examples git:(casiano) ✗ node ts-calculator.cli.js calculator.input.txt
#
# PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1 = 3.141592653589793

# If we execute it with the TRACE_CALC environment variable set, we get a trace
# ➜  examples git:(casiano) ✗ TRACE_CALC=1 node ts-calculator.cli.js calculator.input.txt 
# trace: skipping whitespace 0x9
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0x20
# trace: skipping whitespace 0xa
# trace: returning 3.141592653589793
# PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1 = 3.141592653589793
```

- **ts-node-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `ts-calculator.ts` from [ts-calculator.jison](examples/ts-calculator.jison) (has typescript types)
  - use `ts-node` to exectute `ts-calculator.ts` against [calculator.input.txt](examples/calculator.input.txt) and send output to STDOUT

