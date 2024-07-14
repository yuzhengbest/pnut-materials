import type { App, Directive } from 'vue'
import type { SFCWithInstall, SFCInstallWithContext } from './types'

/**
 * @description 给组件挂载install方法，方便Vue实例注册该组件
 * @param main 组件
 * @param extra 额外挂载的对象
 * @returns 返回挂载install方法的组件
 */
export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  (main as SFCWithInstall<T>).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? [])]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp
    }
  }

  return main as SFCWithInstall<T> & E
}

/**
 * @description 给函数挂载install方法，方便Vue实例注册该方法，使其在全局可用
 * @param fn 函数
 * @param name 函数名
 * @returns 返回挂载install方法的函数
 */
export const withInstallFunction = <T>(fn: T, name: string) => {
  (fn as SFCWithInstall<T>).install = (app: App): void => {
    (fn as SFCInstallWithContext<T>)._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn as SFCInstallWithContext<T>
}

/**
 * @description 给自定义治理挂载install方法，方便Vue实例注册该自定义指令，使其在全局可用
 * @param directive 自定义指令函数
 * @param name 自定义指令名称
 * @returns 返回挂载install方法的自定义指令
 */
export const withInstallDirective = <T extends Directive>(directive: T, name: string) => {
  (directive as SFCWithInstall<T>).install = (app: App): void => {
    app.directive(name, directive)
  }

  return directive as SFCWithInstall<T>
}
