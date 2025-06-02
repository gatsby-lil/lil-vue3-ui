import path from 'path'
import fs from 'fs/promises'
import { parallel } from 'gulp'
import { OutputOptions, rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import { lilUiRoot } from './utils/path'
import { buildConfig, buildFullComponentConfig } from './utils/config'
import { pathReWriter } from './utils'

const buildFull = async () => {
  try {
    const config = {
      input: path.resolve(lilUiRoot, 'index.ts'),
      plugins: [typescript(), vue(), nodeResolve(), commonjs()],
      external: (id: any) => /^vue/.test(id)
    }
    const bundle = await rollup(config)
    return Promise.all(
      buildFullComponentConfig.map(config => {
        return bundle.write(config as OutputOptions)
      })
    )
  } catch (error) {
    console.log(error)
  }
}

async function buildEntry() {
  const entryFiles = await fs.readdir(lilUiRoot, { withFileTypes: true })
  const entryPoints = entryFiles
    .filter(f => f.isFile())
    .filter(f => !['package.json'].includes(f.name))
    .map(f => path.resolve(lilUiRoot, f.name))
  const config = {
    input: entryPoints,
    plugins: [nodeResolve(), vue(), typescript()],
    external: (id: string) => /^vue/.test(id) || /^@lil-ui/.test(id)
  }
  const bundle = await rollup(config)
  return Promise.all(
    Object.values(buildConfig)
      .map(config => {
        return {
          format: config.format,
          dir: config.output.path,
          paths: pathReWriter(config.output.name)
        }
      })
      .map(options => bundle.write(options as OutputOptions))
  )
}
// gulp适合流程控制和转义
export const buildFullComponent = parallel(buildFull, buildEntry)
