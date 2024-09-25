import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['procedures_definition'] = (block) => {
  const myBlock = block.childBlocks_[0];
  const functionName = javascriptGenerator.variableDB_.getName(
    myBlock.getProcCode(),
    ScratchBlocks.Procedures.NAME_TYPE,
  );
  const args = myBlock.childBlocks_.map((argBlock) =>
    javascriptGenerator.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('target');
  let code = `async function ${functionName}(${args.join(',')}) {\n`;
  code += `do {\n${javascriptGenerator.HAT_CODE}} while (false);\n}\n`;
  return code;
};

javascriptGenerator['procedures_call'] = (block) => {
  const functionName = javascriptGenerator.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) =>
    javascriptGenerator.valueToCode(block, arg, javascriptGenerator.ORDER_NONE),
  );
  args.push('target');
  return `await ${functionName}(${args.join(',')});\n`;
};

// javascriptGenerator['procedures_prototype'] = (block) => {
//   return '"procedures_prototype"';
// };

// javascriptGenerator['procedures_declaration'] = (block) => {
//   return '"procedures_declaration"';
// };

javascriptGenerator['argument_reporter_boolean'] = (block) => {
  const code = javascriptGenerator.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['argument_reporter_string_number'] = (block) => {
  const code = javascriptGenerator.variableDB_.getName(block.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE);
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

// javascriptGenerator['argument_editor_boolean'] = (block) => {
//   return ['"argument_editor_boolean"'];
// };

// javascriptGenerator['argument_editor_string_number'] = (block) => {
//   return ['"argument_editor_string_number"'];
// };
