---
title: 安装工具
type: util
pkgName: '@pnut/pt-install'
---

<PackageDependencies package-name="pt-install" />

## 使用简介

### withInstall

用于注册组件的辅助函数，其作用是为组件添加**install**方法，以便**Vue**根实例注册该组件，使其在全局可用

```js
import { withInstall } from '@pnut/pt-install'
import _pkg from './pkg.vue'

const PKG = withInstall(_pkg)
const app = createApp(App)
app.use(PKG)
```

### withInstallFunction

用于注册函数的辅助函数，主要作用是为函数添加**install**方法，以便**Vue**根实例注册该函数，使其在全局可用

```js
import { withInstallFunction } from '@pnut/pt-install'
import Notify from './src/notify'

export const ElNotification = withInstallFunction(Notify, '$notify')
export default ElNotification
```

### withInstallDirective

用于注册自定义指令的辅助函数，主要作用是为自定义指令添加**install**方法，以便**Vue**根实例注册该指令，使其全局可用

```js
import { withInstallDirective } from '@pnut/pt-install'
import _ClickOutside from './click-outside'

export const ClickOutside = withInstallDirective(_ClickOutside, 'click-outside');
export default ClickOutside
```