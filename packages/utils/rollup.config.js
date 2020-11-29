import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/bundle.js',
    format: 'umd',
    name: 'common',
    globals: {
      'lodash': 'lodash'
    }
  },
  external: ['lodash'],
  plugins: [
    typescript(),
  ]
};
