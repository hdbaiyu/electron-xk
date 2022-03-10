import { builtinModules } from 'module'
import { defineConfig, Plugin } from 'vite'
import reactRefresh from '@vitejs/plugin-react'
import importReact from 'vite-react-jsx';
import resolve from 'vite-plugin-resolve'
import theme from "./config/theme"
import { join } from 'path'
import pkg from '../../package.json'
// const { REACT_APP_ENV } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: process.env.NODE_ENV === 'debug',
    outDir: '../../dist/renderer',
  },
  plugins: [reactRefresh(),
    importReact(),
    resolveElectron(
      /**
       * Here you can specify other modules
       * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
       *    which will ensure that the electron-builder can package it correctly
       * @example
       * {
       *   'electron-store': 'const Store = require("electron-store"); export default Store;',
       * }
       */
    )
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // 配置 antd 的主题颜色
        modifyVars: theme,
      }
    },
  },
  base: './',
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/supplier':{
        target: 'https://supplier.5xk.cn',
        changeOrigin: true,
      }
    },
    port: pkg.env.PORT,
  }
})
/**
 * For usage of Electron and NodeJS APIs in the Renderer process
 * @see https://github.com/caoxiemeihao/electron-vue-vite/issues/52
 */
 export function resolveElectron(
  resolves: Parameters<typeof resolve>[0] = {}
): Plugin {
  const builtins = builtinModules.filter((t) => !t.startsWith('_'))

  /**
   * @see https://github.com/caoxiemeihao/vite-plugins/tree/main/packages/resolve#readme
   */
  return resolve({
    electron: electronExport(),
    ...builtinModulesExport(builtins),
    ...resolves,
  })

  function electronExport() {
    return `
/**
 * For all exported modules see https://www.electronjs.org/docs/latest/api/clipboard -> Renderer Process Modules
 */
const electron = require("electron");
const {
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
} = electron;

export {
  electron as default,
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
}
`
  }

  function builtinModulesExport(modules: string[]) {
    return modules
      .map((moduleId) => {
        const nodeModule = require(moduleId)
        const requireModule = `const M = require("${moduleId}");`
        const exportDefault = `export default M;`
        const exportMembers =
          Object.keys(nodeModule)
            .map((attr) => `export const ${attr} = M.${attr}`)
            .join(';\n') + ';'
        const nodeModuleCode = `
${requireModule}

${exportDefault}

${exportMembers}
`

        return { [moduleId]: nodeModuleCode }
      })
      .reduce((memo, item) => Object.assign(memo, item), {})
  }
}
