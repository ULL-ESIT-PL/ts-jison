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
