import { javascriptGenerator } from './generator';

javascriptGenerator['sensing_timer'] = (block) => {
  return ['runtime.time', javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_resettimer'] = (block) => {
  return 'runtime.resetTimer()\n';
};
