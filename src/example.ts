import { getLogger } from './index';

const L = getLogger('myService', 'exampleModule',['console', 'json', 'txt']);
L.debug('Debug message from example.ts');
L.info('Info message from example.ts');
L.warn('Warning message from example.ts');
L.error('Error message from example.ts');
L.fatal('Fatal message from example.ts');
L.debug(`${{ a: 1, b: 2, c: 3 }}`);