import { javascriptGenerator } from './generator';

javascriptGenerator['math_number'] = (block) => {
  let code = parseFloat(block.getFieldValue('NUM'));
  let order;
  if (code === Infinity) {
    code = 'Infinity';
    order = javascriptGenerator.ORDER_FUNCTION_CALL;
  } else if (code === -Infinity) {
    code = '-Infinity';
    order = javascriptGenerator.ORDER_UNARY_SIGN;
  } else if (Number.isNaN(code)) {
    code = 'NaN';
    order = javascriptGenerator.ORDER_UNARY_SIGN;
  } else {
    order = code < 0 ? javascriptGenerator.ORDER_UNARY_SIGN : javascriptGenerator.ORDER_ATOMIC;
  }
  return [code, order];
};

javascriptGenerator['math_integer'] = (block) => {
  const code = parseInt(block.getFieldValue('NUM'));
  const order = code < 0 ? javascriptGenerator.ORDER_UNARY_SIGN : javascriptGenerator.ORDER_ATOMIC;
  return [code, order];
};

javascriptGenerator['math_whole_number'] = (block) => {
  const code = Math.abs(parseInt(block.getFieldValue('NUM')));
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['math_positive_number'] = (block) => {
  let code = parseFloat(block.getFieldValue('NUM'));
  let order;
  if (code === Infinity) {
    code = 'Infinity';
    order = javascriptGenerator.ORDER_FUNCTION_CALL;
  } else if (code === -Infinity) {
    code = '-Infinity';
    order = javascriptGenerator.ORDER_FUNCTION_CALL;
  } else if (Number.isNaN(code)) {
    code = 'NaN';
    order = javascriptGenerator.ORDER_FUNCTION_CALL;
  } else {
    code = code < 0 ? 0 : code;
    order = javascriptGenerator.ORDER_ATOMIC;
  }
  return [code, order];
};

javascriptGenerator['math_angle'] = (block) => {
  let code = parseFloat(block.getFieldValue('NUM'));
  let order;
  if (code == Infinity) {
    code = 'Infinity';
    order = javascriptGenerator.ORDER_FUNCTION_CALL;
  } else if (code == -Infinity) {
    code = '-Infinity';
    order = javascriptGenerator.ORDER_UNARY_SIGN;
  } else {
    code = code % 360;
    code = code < 0 ? code + 360 : code;
    order = javascriptGenerator.ORDER_ATOMIC;
  }
  return [code, order];
};
