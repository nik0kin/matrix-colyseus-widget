import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/bundle.js',
    format: 'umd',
    name: 'common',
    globals: {
      '@colyseus/schema': '@colyseus/schema',
      'colyseus': 'colyseus',
      'node-fetch': 'node-fetch',
      'utils': 'utils'
    }
  },
  external: ['@colyseus/schema', 'colyseus', 'node-fetch', 'utils'],
  plugins: [
    typescript(),
  ]
};
