import { javascriptGenerator } from './generator';

javascriptGenerator['colour_picker'] = (block) => {
  const code = javascriptGenerator.quote_(block.getFieldValue('COLOUR'));
  return [code, javascriptGenerator.ORDER_ATOMIC];
};
