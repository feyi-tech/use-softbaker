import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        exports: 'named',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal({
        includeDependencies: true,
      }),
      resolve({ preferBuiltins: false, mainFields: ['browser'] }),
      commonjs({ extensions: ['.js', '.ts', '.tsx'] }),
      typescript({ tsconfig: "./tsconfig.json", sourceMap: false }),
      postcss(),
      json(),
      babel({
         babelHelpers: 'bundled',
         presets: ['@babel/preset-react'],
         extensions: ['.js', '.jsx', '.ts', '.tsx'],
         exclude: /node_modules/
      }),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"'
      }),
      globals(),
      builtins()
    ],
    //external: ["react", "react-dom", "@chakra-ui/react", "firebase", "@firebase"],
    onwarn: function(warning, handler) {
      // Skip certain warnings
      
      // should intercept ... but doesn't in some rollup versions
      //if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
      if(warning.code === 'THIS_IS_UNDEFINED' || (warning.frame && warning.frame.includes(".getSaltBalance(")) || warning.message.includes(" Typescript 'sourceMap' compiler option must be set to generate source maps.") || warning.message.includes("'Circular dependency: node_modules/web3-eth")) { return; }
      //console.log("Warning::", warning)
      // console.warn everything else
      handler( warning );
    }
  },
  {
    input: "dist/esm/types/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];