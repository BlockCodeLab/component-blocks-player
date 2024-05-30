import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';
const HAT_CALLBACK = `async (done) => {\ndo {\n${javascriptGenerator.HAT_CODE}} while (false);\ndone();\n}`;

javascriptGenerator['event_whenflagclicked'] = () => {
  return `runtime.when('start', ${HAT_CALLBACK});\n`;
};

javascriptGenerator['event_whengreaterthan'] = (block) => {
  const nameValue = block.getFieldValue('WHENGREATERTHANMENU');
  const valueCode = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_NONE) || 10;
  return `runtime.whenGreaterThen('${nameValue}', runtime.number(${valueCode}), ${HAT_CALLBACK});\n`;
};

javascriptGenerator['event_whenbroadcastreceived'] = (block) => {
  const messageName = javascriptGenerator.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return `runtime.when('message:${messageName}', ${HAT_CALLBACK});\n`;
};

javascriptGenerator['event_broadcast_menu'] = (block) => {
  const messageName = javascriptGenerator.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return [messageName, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['event_broadcast'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const messageName =
    javascriptGenerator.valueToCode(block, 'BROADCAST_INPUT', javascriptGenerator.ORDER_NONE) || 'message1';
  code += `runtime.fire('message:${messageName}')\n`;
  return code;
};

javascriptGenerator['event_broadcastandwait'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const messageName =
    javascriptGenerator.valueToCode(block, 'BROADCAST_INPUT', javascriptGenerator.ORDER_NONE) || 'message1';
  code += `await runtime.fire('message:${messageName}')\n${AWAIT_ABORT}`;
  return code;
};
