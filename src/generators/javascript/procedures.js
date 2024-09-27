import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const functionName = this.variableDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) =>
    this.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('target');
  let code = `async function ${functionName}(${args.join(',')}) {\n`;
  code += `do {\n/* code */} while (false);\n}\n`;
  return code;
};

javascriptGenerator['procedures_call'] = function (block) {
  const functionName = this.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  args.push('target');
  return `await ${functionName}(${args.join(',')});\n`;
};

// javascriptGenerator['procedures_prototype'] = function (block) {
//   return '"procedures_prototype"';
// };

// javascriptGenerator['procedures_declaration'] = function (block) {
//   return '"procedures_declaration"';
// };

javascriptGenerator['argument_reporter_boolean'] = function (block) {
  const code = this.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, this.ORDER_ATOMIC];
};

javascriptGenerator['argument_reporter_string_number'] = function (block) {
  const code = this.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, this.ORDER_ATOMIC];
};

// javascriptGenerator['argument_editor_boolean'] = function (block) {
//   return ['"argument_editor_boolean"'];
// };

// javascriptGenerator['argument_editor_string_number'] = function (block) {
//   return ['"argument_editor_string_number"'];
// };
