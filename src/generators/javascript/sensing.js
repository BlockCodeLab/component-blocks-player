import { javascriptGenerator } from './generator';

javascriptGenerator['sensing_timer'] = function (block) {
  return ['runtime.time', this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_resettimer'] = function (block) {
  return 'runtime.resetTimer()\n';
};

javascriptGenerator['sensing_debug'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '"debug"';
  code += `console.log(${valueCode});\n`;
  return code;
};
