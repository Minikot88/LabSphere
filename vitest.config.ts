import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['apps/api/test/**/*.test.ts'],fileParallelism:false,testTimeout:30000,hookTimeout:60000,reporters:['default','json'],outputFile:{json:'docs/evidence/vitest.json'}}});
