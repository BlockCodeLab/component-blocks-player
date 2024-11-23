import { javascriptGenerator } from './generator';

javascriptGenerator['operator_add'] = function (block) {
  const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
  const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) + runtime.number(${num2Code}))`;
  return [code, this.ORDER_SUBTRACTION];
};

javascriptGenerator['operator_subtract'] = function (block) {
  const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
  const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) - runtime.number(${num2Code}))`;
  return [code, this.ORDER_ADDITION];
};

javascriptGenerator['operator_multiply'] = function (block) {
  const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
  const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) * runtime.number(${num2Code}))`;
  return [code, this.ORDER_MULTIPLICATION];
};

javascriptGenerator['operator_divide'] = function (block) {
  const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
  const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) / runtime.number(${num2Code}))`;
  return [code, this.ORDER_DIVISION];
};

javascriptGenerator['operator_random'] = function (block) {
  const minValue = this.valueToCode(block, 'FROM', this.ORDER_NONE) || 0;
  const maxValue = this.valueToCode(block, 'TO', this.ORDER_NONE) || 0;
  const code = `runtime.random(${minValue}, ${maxValue})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_gt'] = function (block) {
  // >
  const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
  const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${operand1Code}) > runtime.number(${operand2Code}))`;
  return [code, this.ORDER_RELATIONAL];
};

javascriptGenerator['operator_lt'] = function (block) {
  // <
  const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
  const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${operand1Code}) < runtime.number(${operand2Code}))`;
  return [code, this.ORDER_RELATIONAL];
};

javascriptGenerator['operator_equals'] = function (block) {
  const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
  const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
  const code = `(${operand1Code} == ${operand2Code})`;
  return [code, this.ORDER_RELATIONAL];
};

javascriptGenerator['operator_and'] = function (block) {
  const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
  const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
  const code = `(${operand1Code} && ${operand2Code})`;
  return [code, this.ORDER_LOGICAL_AND];
};

javascriptGenerator['operator_or'] = function (block) {
  const operand1Code = this.valueToCode(block, 'OPERAND1', this.ORDER_NONE) || 0;
  const operand2Code = this.valueToCode(block, 'OPERAND2', this.ORDER_NONE) || 0;
  const code = `(${operand1Code} || ${operand2Code})`;
  return [code, this.ORDER_LOGICAL_OR];
};

javascriptGenerator['operator_not'] = function (block) {
  const operandValue = this.valueToCode(block, 'OPERAND', this.ORDER_NONE) || 0;
  const code = `!(${operandValue})`;
  return [code, this.ORDER_LOGICAL_NOT];
};

javascriptGenerator['operator_join'] = function (block) {
  const string1Value = this.valueToCode(block, 'STRING1', this.ORDER_NONE) || '""';
  const string2Value = this.valueToCode(block, 'STRING2', this.ORDER_NONE) || '""';
  const code = `(String(${string1Value}) + String(${string2Value}))`;
  return [code, this.ORDER_ATOMIC];
};

javascriptGenerator['operator_letter_of'] = function (block) {
  const letterValue = this.valueToCode(block, 'LETTER', this.ORDER_NONE) || 1;
  const stringValue = this.valueToCode(block, 'STRING', this.ORDER_NONE) || '""';
  const code = `runtime.list(String(${stringValue}), 'get', runtime.number(${letterValue}))`;
  return [code, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_length'] = function (block) {
  const stringValue = this.valueToCode(block, 'STRING', this.ORDER_NONE) || '""';
  const code = `String(${stringValue}).length`;
  return [code, this.ORDER_MEMBER];
};

javascriptGenerator['operator_contains'] = function (block) {
  const string1Value = this.valueToCode(block, 'STRING1', this.ORDER_NONE) || '""';
  const string2Value = this.valueToCode(block, 'STRING2', this.ORDER_NONE) || '""';
  const code = `String(${string1Value}).includes(String(${string2Value}))`;
  return [code, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_mod'] = function (block) {
  const num1Code = this.valueToCode(block, 'NUM1', this.ORDER_NONE) || 0;
  const num2Code = this.valueToCode(block, 'NUM2', this.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) % runtime.number(${num2Code}))`;
  return [code, this.ORDER_MODULUS];
};

javascriptGenerator['operator_round'] = function (block) {
  const numCode = this.valueToCode(block, 'NUM', this.ORDER_NONE) || 0;
  const code = `Math.round(${numCode})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_mathop'] = function (block) {
  const numCode = this.valueToCode(block, 'NUM', this.ORDER_NONE) || 0;
  const operatorValue = block.getFieldValue('OPERATOR');
  let code = '';
  if (operatorValue === 'ceiling') {
    code += `Math.ceil(runtime.number(${numCode}))`;
  } else if (operatorValue === 'sin' || operatorValue === 'cos' || operatorValue === 'tan') {
    code += `Math.${operatorValue}(Math.PI * runtime.number(${numCode}) / 180)`;
  } else if (operatorValue === 'asin' || operatorValue === 'acos' || operatorValue === 'atan') {
    code += `(Math.${operatorValue}(runtime.number(${numCode})) * 180 / Math.PI)`;
  } else if (operatorValue === 'ln') {
    code += `Math.log(runtime.number(${numCode}))`;
  } else if (operatorValue === 'log') {
    code += `Math.log10(runtime.number(${numCode}))`;
  } else if (operatorValue === 'e ^') {
    code += `Math.exp(runtime.number(${numCode}))`;
  } else if (operatorValue === '10 ^') {
    code += `Math.pow(10, runtime.number(${numCode}))`;
  } else {
    code += `Math.${operatorValue}(runtime.number(${numCode}))`;
  }
  return [code, this.ORDER_FUNCTION_CALL];
};
