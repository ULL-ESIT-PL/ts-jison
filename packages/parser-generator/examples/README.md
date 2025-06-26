# ts-jison examples

Use ts-jison to generate parsers from an example, e.g.:

    $ node ../lib/cli.js basic_lex.jison

## [js]s-calculator

Generate compile and execute the usual calculator demo from both javascript (no type annotations) and typescript sources.

## Makefile 

See the [Makefile](Makefile) which has targets for

- **js-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `js-calculator.js` from [js-calculator.jison](js-calculator.jison) (has no typescript types)
  - exectute `js-calculator.js` against [calculator.input.txt](calculator.input.txt) and send output to STDOUT
- **ts-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `ts-calculator.ts` from [ts-calculator.jison](ts-calculator.jison) (has typescript types)
  - use `tsc` to compile `ts-calculator.js` from `ts-calculator.ts`
  - exectute against [calculator.input.txt](examples/calculator.input.txt) and send output to STDOUT
- **ts-node-calculator-demo**
  - use [../lib/cli.js](../lib/cli.js) to generate `ts-calculator.ts` from [ts-calculator.jison](examples/ts-calculator.jison) (has typescript types)
  - use `ts-node` to execute `ts-calculator.ts` against [calculator.input.txt](examples/calculator.input.txt) and send output to STDOUT

## ts-calculator-demo

The grammar file contains some typescript type annotations in the head section of the grammar, so we need to use the command line interface of ts-jison to generate a typescript parser.

```ts
%{
function hexlify (str:string): string {
  return str.split('')
    .map(ch => '0x' + ch.charCodeAt(0).toString(16))
    .join(', ')
}
%}
```
The TS `hexlify` function is used to convert a string to a hex representation, and is used in the lexer section to trace the input characters:

```
%%
\s+                   if (yy.trace) yy.trace(`skipping whitespace ${hexlify(yytext)}`)
```
Also in the grammar section, the `yy.trace` variable is used to trace the parsing process:

```ts
%% /* language grammar */

expressions
    : e EOF
        { if (yy.trace) yy.trace('returning', $1);
          return $1; }
    ;
```

In the root folder of the project, run:

```
npm run build
cd packages/parser-generator/examples
```

To compile the grammar, we use the command line interface of ts-jison:
```bash
../lib/cli.js -t typescript -n TsCalc -o ts-calculator.ts ts-calculator.jison
```
This generates the parser in `ts-calculator.ts`. 
The names of the classes are `TsCalcParser` and `TsCalcLexer`:

```
➜  examples git:(casiano) ✗ grep TsCalc  ts-calculator.ts
export class TsCalcParser extends JisonParser implements JisonParserApi {
    constructor (yy = {}, lexer = new TsCalcLexer(yy)) {
export class TsCalcLexer extends JisonLexer implements JisonLexerApi {
    options: any = {"moduleName":"TsCalc"};
```

Now we can compile the generated ts-calculator.ts file to js using tsc

```
npx tsc ts-calculator.ts
```

Consider the input file for the calculator:

```bash
➜  examples git:(casiano) ✗ cat calculator.input.txt 
       PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1
node ts-calculator.cli.js calculator.input.txt
➜  examples git:(casiano) ✗ node ts-calculator.cli.js calculator.input.txt
PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1 = 3.141592653589793
```

If we execute it with the TRACE_CALC environment variable set, we get a trace

```
➜  examples git:(casiano) ✗ TRACE_CALC=1 node ts-calculator.cli.js calculator.input.txt 
trace: skipping whitespace 0x9
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0x20
trace: skipping whitespace 0xa
trace: returning 3.141592653589793
PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1 = 3.141592653589793
```

Here is the code of the `ts-calculator.cli.js` file that uses the generated parser:

```js
#!/usr/bin/env node
const Fs = require('fs');
const ParserAndLexer = require('./ts-calculator'); // Note, imports ts-calc..., not js-calc...

// A YY class with a constructor can be passed to `parse`.
class YyWithConstructor {
  constructor (traceFlag) {
    if (traceFlag) {
      // js-calculator.jison calls yy.trace with skipped whitespace strings.
      this.trace = function () { console.log('trace:', ...arguments); }
    }
  }
}

main(process.argv.slice(1));

function main (args) {
  if (!args[1]) {
    console.warn(`Usage: ${args[0]} FILE`);
    process.exit(1);
  }
  // Read truthiness of TRACE_CALC environment variable.
  const traceFlag = ['false', 0, '', undefined].indexOf(process.env.TRACE_CALC) === -1;
  // Read parser input.
  const txt = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
  // A YY object with no constructor will be invokved with Object.create.
  const yyObjectTemplate = {
    trace: function () { console.log('trace:', ...arguments); }
  };
  // Construct a parser pointing at the no-constructor YY object,
  const res = new ParserAndLexer.TsCalcParser(yyObjectTemplate)
        // but override it with a different YY class to show off logic.
        .parse(txt, new YyWithConstructor(traceFlag));
  // Print out results.
  console.log(txt.trim(), '=', res);
};
```


We can also use `ts-node` to execute the generated parser directly, without compiling it to js first.

Let us remove the generated js parser first:
```bash
➜  examples git:(casiano) ✗ make clean
rm  -f js-calculator.js ts-calculator.js ts-calculator.ts
```
Now we can generate the typescript parser from the jison grammar file:

```bash
➜  examples git:(casiano) ✗ ../lib/cli.js -t typescript -n TsCalc -o ts-calculator.ts ts-calculator.jison
```
See that there is not a `ts-calculator.js` file generated, only the `ts-calculator.ts` file:

```bash
➜  examples git:(casiano) ✗ ls ts-calculator.*
ts-calculator.cli.js ts-calculator.jison  ts-calculator.ts
➜  examples git:(casiano) ✗ npx ts-node ts-calculator.cli.js calculator.input.txt 
PI + (3! / 3)^20 / (1+1)^10 / 1024 - 1 = 3.141592653589793
➜  examples git:(casiano) ✗ 
```

However, if we use  `node` instead, we get an error:

```bash
➜  examples git:(casiano) ✗ node ts-calculator.cli.js calculator.input.txt 
node:internal/modules/cjs/loader:1413
Error: Cannot find module './ts-calculator'
```