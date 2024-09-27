import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';
const NEXT_LOOP = `  await runtime.nextFrame();\n  ${AWAIT_ABORT}`;

javascriptGenerator['control_wait'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const durationCode = this.valueToCode(block, 'DURATION', this.ORDER_NONE) || 0;
  code += `await runtime.sleep(runtime.number(${durationCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_repeat'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let branchCode = this.statementToCode(block, 'SUBSTACK') || '';
  if (this.STATEMENT_SUFFIX) {
    branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
  }

  const timesCode = this.valueToCode(block, 'TIMES', this.ORDER_NONE) || 0;
  code += `for (let _ = 0; _ < runtime.number(${timesCode}); _++) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_forever'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let branchCode = this.statementToCode(block, 'SUBSTACK') || '';
  if (this.STATEMENT_SUFFIX) {
    branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
  }

  code += `while (true) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_if'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let branchCode = this.statementToCode(block, 'SUBSTACK') || '';
  if (this.STATEMENT_SUFFIX) {
    branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
  }

  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';
  code += `if (${conditionCode}) {\n${branchCode}}\n`;

  // else branch.
  if (block.getInput('SUBSTACK2')) {
    branchCode = this.statementToCode(block, 'SUBSTACK2') || '';
    if (this.STATEMENT_SUFFIX) {
      branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
    }
    code += `else {\n${branchCode}}\n`;
  }
  return code;
};

javascriptGenerator['control_if_else'] = javascriptGenerator['control_if'];

javascriptGenerator['control_wait_until'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';
  code += `while (!(${conditionCode})) {\n${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_repeat_until'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let branchCode = this.statementToCode(block, 'SUBSTACK') || '';
  if (this.STATEMENT_SUFFIX) {
    branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
  }

  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';
  code += `while (!(${conditionCode})) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_while'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let branchCode = this.statementToCode(block, 'SUBSTACK') || '';
  if (this.STATEMENT_SUFFIX) {
    branchCode = this.prefixLines(this.injectId(this.STATEMENT_SUFFIX, block), this.INDENT) + branchCode;
  }

  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';
  code += `while (${conditionCode}) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_stop'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const stopValue = block.getFieldValue('STOP_OPTION');
  switch (stopValue) {
    case 'all':
      code += 'runtime.stop();\n';
      break;
    case 'this script':
      code += 'return done();\n';
      break;
    case 'other scripts in sprite':
      code += 'abort = true;\n';
      break;
  }
  return code;
};
