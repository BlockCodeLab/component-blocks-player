import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';
const EVENT_CALLBACK = `async (done) => {\ndo {\n/* code */} while (false);\ndone();\n}`;

javascriptGenerator['event_whenflagclicked'] = function () {
  return `runtime.when('start', ${EVENT_CALLBACK});\n`;
};

javascriptGenerator['event_whengreaterthan'] = function (block) {
  const nameValue = block.getFieldValue('WHENGREATERTHANMENU');
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 10;
  return `runtime.whenGreaterThen('${nameValue}', runtime.number(${valueCode}), ${EVENT_CALLBACK});\n`;
};

javascriptGenerator['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return `runtime.when('message:${messageName}', ${EVENT_CALLBACK});\n`;
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
  code += `await runtime.fire('message:${messageName}')\n${AWAIT_ABORT}`;
  return code;
};
