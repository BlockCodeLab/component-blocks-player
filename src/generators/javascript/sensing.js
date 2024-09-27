import { javascriptGenerator } from './generator';

javascriptGenerator['sensing_timer'] = function (block) {
  return ['runtime.time', this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_resettimer'] = function (block) {
  return 'runtime.resetTimer()\n';
};
