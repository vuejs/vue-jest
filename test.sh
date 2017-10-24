rm -rf temp-dir
mkdir temp-dir
cp -R  test temp-dir/test
cp -R  lib temp-dir/lib
cp -R  node_modules temp-dir/node_modules
cp vue-jest.js temp-dir/vue-jest.js
cp package.json temp-dir/package.json
cp .babelrc temp-dir/.babelrc
cp tsconfig.json temp-dir/tsconfig.json
cd temp-dir
yarn unit:run
