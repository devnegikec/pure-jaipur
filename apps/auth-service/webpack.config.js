const { NxAppWebpackPlugin } = require('@nrwl/react/plugins/webpack');
const { output } = require('@nx/workspace');
const { join } = require('path');

module.exports = {
  output: {
    path: join(output.root, 'dist/apps/auth-service'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
