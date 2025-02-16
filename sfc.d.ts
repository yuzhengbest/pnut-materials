// eslint-disable-next-line no-unused-vars
declare module '*.vue' {
  import type { DefineComponent, Plugin } from 'vue'
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any> & Plugin;
  export default component;
}