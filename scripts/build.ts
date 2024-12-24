/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs-extra'
import glob from 'glob'
import execa from 'execa'
import os from 'os'

handler()

async function handler() {
  for await (const item of ['utils', 'components']) {
    const packagePaths = glob.sync(`packages/${item}/*`).filter(packagePath => {
      const pkg = fs.readJsonSync(path.resolve(packagePath, 'package.json'))
      return Boolean(pkg.exports)
    })
    if (packagePaths.length) {
      run(packagePaths, item)
    }
  }
}

/**
 * 开始执行打包流程
 * @param paths 需要进行打包组件的路径
 * @param meta 额外的信息
 */
async function run(paths: string[], meta: string) {
  await buildAll(paths, meta)
}

/**
 * 批量打包
 * @param targets 打包路径
 * @param meta 额外信息
 */
async function buildAll(targets: string[], meta: string): Promise<void> {
  // 根据cpu的内核数，并行打包
  await runParallel(os.cpus().length, targets, meta, build)
}

/**
 * 
 * @param maxConcurrency 最大并发数
 * @param targets 打包路径
 * @param meta 额外信息
 * @param iteratorFn 执行打包的处理函数
 * @returns 返回打包执行结果
 */
async function runParallel<T, M>(maxConcurrency: number, targets: T[], meta: M, iteratorFn: (target: T, meta: M) => Promise<any>): Promise<any[]> {
  const executor: any[] = []
  const executing: Promise<any>[] = []
  for (const item of targets) {
    const p = Promise.resolve().then(() => iteratorFn(item, meta))
    executor.push(p)
    
    if (maxConcurrency <= targets.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(executor)
}

/**
 * 单个组件打包函数，开启rollup进行打包
 * @param target 目标文件路径
 * @param meta 元数据
 */
async function build(target: string, meta: string) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target},META:${meta}`], {
    stdio: 'inherit'
  })
}