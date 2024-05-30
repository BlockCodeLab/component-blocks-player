import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';
const NEXT_LOOP = `  await runtime.nextFrame();\n  ${AWAIT_ABORT}`;

javascriptGenerator['control_wait'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const durationCode = javascriptGenerator.valueToCode(block, 'DURATION', javascriptGenerator.ORDER_NONE) || 0;
  code += `await runtime.sleep(runtime.number(${durationCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_repeat'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    branchCode =
      javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT,
      ) + branchCode;
  }

  const timesCode = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_NONE) || 0;
  code += `for (let _ = 0; _ < runtime.number(${timesCode}); _++) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_forever'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    branchCode =
      javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT,
      ) + branchCode;
  }

  code += `while (true) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_if'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    branchCode =
      javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT,
      ) + branchCode;
  }

  const conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
  code += `if (${conditionCode}) {\n${branchCode}}\n`;

  // else branch.
  if (block.getInput('SUBSTACK2')) {
    branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK2') || '';
    if (javascriptGenerator.STATEMENT_SUFFIX) {
      branchCode =
        javascriptGenerator.prefixLines(
          javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
          javascriptGenerator.INDENT,
        ) + branchCode;
    }
    code += `else {\n${branchCode}}\n`;
  }
  return code;
};

javascriptGenerator['control_if_else'] = javascriptGenerator['control_if'];

javascriptGenerator['control_wait_until'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
  code += `while (!(${conditionCode})) {\n${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_repeat_until'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    branchCode =
      javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT,
      ) + branchCode;
  }

  const conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
  code += `while (!(${conditionCode})) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_while'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let branchCode = javascriptGenerator.statementToCode(block, 'SUBSTACK') || '';
  if (javascriptGenerator.STATEMENT_SUFFIX) {
    branchCode =
      javascriptGenerator.prefixLines(
        javascriptGenerator.injectId(javascriptGenerator.STATEMENT_SUFFIX, block),
        javascriptGenerator.INDENT,
      ) + branchCode;
  }

  const conditionCode = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
  code += `while (${conditionCode}) {\n${branchCode}${NEXT_LOOP}}\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['control_stop'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
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
