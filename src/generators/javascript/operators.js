import { javascriptGenerator } from './generator';

javascriptGenerator['operator_add'] = (block) => {
  const num1Code = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_NONE) || 0;
  const num2Code = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) + runtime.number(${num2Code}))`;
  return [code, javascriptGenerator.ORDER_SUBTRACTION];
};

javascriptGenerator['operator_subtract'] = (block) => {
  const num1Code = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_NONE) || 0;
  const num2Code = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) - runtime.number(${num2Code}))`;
  return [code, javascriptGenerator.ORDER_ADDITION];
};

javascriptGenerator['operator_multiply'] = (block) => {
  const num1Code = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_NONE) || 0;
  const num2Code = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) * runtime.number(${num2Code}))`;
  return [code, javascriptGenerator.ORDER_MULTIPLICATION];
};

javascriptGenerator['operator_divide'] = (block) => {
  const num1Code = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_NONE) || 0;
  const num2Code = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) / runtime.number(${num2Code}))`;
  return [code, javascriptGenerator.ORDER_DIVISION];
};

javascriptGenerator['operator_random'] = (block) => {
  const minValue = javascriptGenerator.valueToCode(block, 'FROM', javascriptGenerator.ORDER_NONE) || 0;
  const maxValue = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_NONE) || 0;
  const code = `runtime.random(${minValue}, ${maxValue})`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_gt'] = (block) => {
  // >
  const operand1Code = javascriptGenerator.valueToCode(block, 'OPERAND1', javascriptGenerator.ORDER_NONE) || 0;
  const operand2Code = javascriptGenerator.valueToCode(block, 'OPERAND2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${operand1Code}) > runtime.number(${operand2Code}))`;
  return [code, javascriptGenerator.ORDER_RELATIONAL];
};

javascriptGenerator['operator_lt'] = (block) => {
  // <
  const operand1Code = javascriptGenerator.valueToCode(block, 'OPERAND1', javascriptGenerator.ORDER_NONE) || 0;
  const operand2Code = javascriptGenerator.valueToCode(block, 'OPERAND2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${operand1Code}) < runtime.number(${operand2Code}))`;
  return [code, javascriptGenerator.ORDER_RELATIONAL];
};

javascriptGenerator['operator_equals'] = (block) => {
  const operand1Code = javascriptGenerator.valueToCode(block, 'OPERAND1', javascriptGenerator.ORDER_NONE) || 0;
  const operand2Code = javascriptGenerator.valueToCode(block, 'OPERAND2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(${operand1Code} == ${operand2Code})`;
  return [code, javascriptGenerator.ORDER_RELATIONAL];
};

javascriptGenerator['operator_and'] = (block) => {
  const operand1Code = javascriptGenerator.valueToCode(block, 'OPERAND1', javascriptGenerator.ORDER_NONE) || 0;
  const operand2Code = javascriptGenerator.valueToCode(block, 'OPERAND2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(${operand1Code} && ${operand2Code})`;
  return [code, javascriptGenerator.ORDER_LOGICAL_AND];
};

javascriptGenerator['operator_or'] = (block) => {
  const operand1Code = javascriptGenerator.valueToCode(block, 'OPERAND1', javascriptGenerator.ORDER_NONE) || 0;
  const operand2Code = javascriptGenerator.valueToCode(block, 'OPERAND2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(${operand1Code} || ${operand2Code})`;
  return [code, javascriptGenerator.ORDER_LOGICAL_OR];
};

javascriptGenerator['operator_not'] = (block) => {
  const operandValue = javascriptGenerator.valueToCode(block, 'OPERAND', javascriptGenerator.ORDER_NONE) || 0;
  const code = `!(${operandValue})`;
  return [code, javascriptGenerator.ORDER_LOGICAL_NOT];
};

javascriptGenerator['operator_join'] = (block) => {
  const string1Value = javascriptGenerator.valueToCode(block, 'STRING1', javascriptGenerator.ORDER_NONE) || '""';
  const string2Value = javascriptGenerator.valueToCode(block, 'STRING2', javascriptGenerator.ORDER_NONE) || '""';
  const code = `(String(${string1Value}) + String(${string2Value}))`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['operator_letter_of'] = (block) => {
  const letterValue = javascriptGenerator.valueToCode(block, 'LETTER', javascriptGenerator.ORDER_NONE) || 0;
  const stringValue = javascriptGenerator.valueToCode(block, 'STRING', javascriptGenerator.ORDER_NONE) || '""';
  const code = `(String(${stringValue}).at(${letterValue} - 1) || '')`;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['operator_length'] = (block) => {
  const stringValue = javascriptGenerator.valueToCode(block, 'STRING', javascriptGenerator.ORDER_NONE) || '""';
  const code = `String(${stringValue}).length`;
  return [code, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['operator_contains'] = (block) => {
  const string1Value = javascriptGenerator.valueToCode(block, 'STRING1', javascriptGenerator.ORDER_NONE) || '""';
  const string2Value = javascriptGenerator.valueToCode(block, 'STRING2', javascriptGenerator.ORDER_NONE) || '""';
  const code = `String(${string1Value}).includes(String(${string2Value}))`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_mod'] = (block) => {
  const num1Code = javascriptGenerator.valueToCode(block, 'NUM1', javascriptGenerator.ORDER_NONE) || 0;
  const num2Code = javascriptGenerator.valueToCode(block, 'NUM2', javascriptGenerator.ORDER_NONE) || 0;
  const code = `(runtime.number(${num1Code}) % runtime.number(${num2Code}))`;
  return [code, javascriptGenerator.ORDER_MODULUS];
};

javascriptGenerator['operator_round'] = (block) => {
  const numCode = javascriptGenerator.valueToCode(block, 'NUM', javascriptGenerator.ORDER_NONE) || 0;
  const code = `Math.round(${numCode})`;
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['operator_mathop'] = (block) => {
  const numCode = javascriptGenerator.valueToCode(block, 'NUM', javascriptGenerator.ORDER_NONE) || 0;
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
  return [code, javascriptGenerator.ORDER_FUNCTION_CALL];
};
