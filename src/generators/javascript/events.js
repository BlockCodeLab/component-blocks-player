import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['event_whenflagclicked'] = function () {
  return `runtime.when('start', ${this.EVENT_CALLBACK});\n`;
};

javascriptGenerator['event_whengreaterthan'] = function (block) {
  const nameValue = block.getFieldValue('WHENGREATERTHANMENU');
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 10;
  return `runtime.whenGreaterThen('${nameValue}', runtime.number(${valueCode}), ${this.EVENT_CALLBACK});\n`;
};

javascriptGenerator['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return `runtime.when('message:${messageName}', ${this.EVENT_CALLBACK});\n`;
};

javascriptGenerator['event_broadcast_menu'] = function (block) {
  const messageName = this.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return [messageName, this.ORDER_ATOMIC];
};

javascriptGenerator['event_broadcast'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE) || 'message1';
  code += `runtime.fire('message:${messageName}')\n`;
  return code;
};

javascriptGenerator['event_broadcastandwait'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE) || 'message1';
  code += this.wrapAsync(`runtime.fire('message:${messageName}')`);
  return code;
};
