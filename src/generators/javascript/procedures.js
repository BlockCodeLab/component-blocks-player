import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const funcName = this.variableDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) =>
    this.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('done');
  let funcCode = `async (${args.join(', ')}) => {`;
  funcCode += `${this.START_PROCESS}const flash = ${myBlock.warp_};\n`;
  funcCode += `do {\n/* code */} while (false);\ndone();\n}`;
  return `runtime.on('procedure:${funcName}', ${funcCode});\n`;
};

javascriptGenerator['procedures_call'] = function (block) {
  const funcName = this.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  const argsCode = args.length > 0 ? `, ${args.join(', ')}` : '';
  return this.wrapAsync(`runtime.emit('procedure:${funcName}'${argsCode})`);
};

javascriptGenerator['argument_reporter_boolean'] = function (block) {
  const code = this.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, this.ORDER_ATOMIC];
};

javascriptGenerator['argument_reporter_string_number'] = function (block) {
  const code = this.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, this.ORDER_ATOMIC];
};
