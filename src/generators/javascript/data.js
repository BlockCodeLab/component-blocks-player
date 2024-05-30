import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['data_variable'] = (block) => {
  const varName = javascriptGenerator.variableDB_.getName(
    block.getFieldValue('VARIABLE'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return [varName, javascriptGenerator.ORDER_CONDITIONAL];
};

javascriptGenerator['data_setvariableto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const varName = javascriptGenerator.variableDB_.getName(
    block.getFieldValue('VARIABLE'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  const valueCode = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || '""';
  code += `${varName} = ${valueCode};\n`;
  return code;
};

javascriptGenerator['data_changevariableby'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const varName = javascriptGenerator.variableDB_.getName(
    block.getFieldValue('VARIABLE'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  const valueCode = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || 0;
  code += `${varName} = runtime.number(${varName}) + runtime.number(${valueCode});\n`;
  return code;
};

javascriptGenerator['data_listcontents'] = (block) => {
  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [listName, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['data_addtolist'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.ORDER_NONE) || '""';
  code += `${listName}.push(${itemCode});\n`;
  return code;
};

javascriptGenerator['data_deleteoflist'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_NONE) || 1;

  code += `${listName}.splice(runtime.index(${indexCode}, ${listName}.length), 1);\n`;
  return code;
};

javascriptGenerator['data_deletealloflist'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  code += `${listName}.length = 0;\n`;
  return code;
};

javascriptGenerator['data_insertatlist'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_NONE) || 1;
  const itemCode = javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.ORDER_NONE) || '""';
  code += `${listName}.splice(runtime.index(${indexCode}, ${listName}.length), 0, ${itemCode});\n`;
  return code;
};

javascriptGenerator['data_replaceitemoflist'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_NONE) || 1;
  const itemCode = javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.ORDER_NONE) || '""';
  code += `${listName}.splice(runtime.index(${indexCode}, ${listName}.length), 1, ${itemCode});\n`;
  return code;
};

javascriptGenerator['data_itemoflist'] = (block) => {
  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = javascriptGenerator.valueToCode(block, 'INDEX', javascriptGenerator.ORDER_NONE) || 1;
  const code = `(${listName}[runtime.index(${indexCode}, ${listName}.length)] || '""')`;
  return [code, javascriptGenerator.ORDER_CONDITIONAL];
};

javascriptGenerator['data_itemnumoflist'] = (block) => {
  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.ORDER_NONE) || '""';
  const code = `(${listName}.indexOf(${itemCode}) + 1)`;
  return [code, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator['data_lengthoflist'] = (block) => {
  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [`${listName}.length`, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['data_listcontainsitem'] = (block) => {
  const listName =
    javascriptGenerator.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = javascriptGenerator.valueToCode(block, 'ITEM', javascriptGenerator.ORDER_NONE) || '""';
  const code = `${listName}.includes(${itemCode})`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};
