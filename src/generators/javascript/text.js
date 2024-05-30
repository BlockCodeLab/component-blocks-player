import { javascriptGenerator } from './generator';

javascriptGenerator['text'] = (block) => {
  const textValue = block.getFieldValue('TEXT');
  const code = textValue.length === 0 || isNaN(textValue) ? javascriptGenerator.quote_(textValue) : +textValue;
  return [code, javascriptGenerator.ORDER_ATOMIC];
};
