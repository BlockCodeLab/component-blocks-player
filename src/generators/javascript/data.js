import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['data_variable'] = function (block) {
  const varName = this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  return [varName, this.ORDER_CONDITIONAL];
};

javascriptGenerator['data_setvariableto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const varName = this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
  code += `${varName} = ${valueCode};\n`;
  return code;
};

javascriptGenerator['data_changevariableby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const varName = this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 0;
  code += `${varName} = runtime.number(${varName}) + runtime.number(${valueCode});\n`;
  return code;
};

javascriptGenerator['data_listcontents'] = function (block) {
  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [listName, this.ORDER_ATOMIC];
};

javascriptGenerator['data_addtolist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `${listName}.push(${itemCode});\n`;
  return code;
};

javascriptGenerator['data_deleteoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;

  code += `runtime.list(${listName}, 'remove', runtime.number(${indexCode}));\n`;
  return code;
};

javascriptGenerator['data_deletealloflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  code += `${listName}.length = 0;\n`;
  return code;
};

javascriptGenerator['data_insertatlist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const itemCode = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `runtime.list(${listName}, 'insert', runtime.number(${indexCode}), ${itemCode});\n`;
  return code;
};

javascriptGenerator['data_replaceitemoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const itemCode = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `runtime.list(${listName}, 'replace', runtime.number(${indexCode}), ${itemCode});\n`;
  return code;
};

javascriptGenerator['data_itemoflist'] = function (block) {
  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const code = `runtime.list(${listName}, 'get', runtime.number(${indexCode}))`;
  return [code, this.ORDER_CONDITIONAL];
};

javascriptGenerator['data_itemnumoflist'] = function (block) {
  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  const code = `(${listName}.indexOf(${itemCode}) + 1)`;
  return [code, this.ORDER_NONE];
};

javascriptGenerator['data_lengthoflist'] = function (block) {
  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [`${listName}.length`, this.ORDER_MEMBER];
};

javascriptGenerator['data_listcontainsitem'] = function (block) {
  const listName =
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemCode = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  const code = `${listName}.includes(${itemCode})`;
  return [code, this.ORDER_FUNCTION_CALL];
};
