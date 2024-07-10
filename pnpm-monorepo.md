# 简介

此物料库用**pnpm**包管理工具和**monorepo**组织结构进行开发

## 概念

- **pnpm**是新一代包管理工具，其优点如下：
  + pnpm 比 npm 快了近2倍
  + node_modules 中的所有文件均克隆或硬链接字单一存储位置，大大节约磁盘空间
  + pnpm 创建的 node_modules 默认为非扁平结构，因此代码无法对任意软件包进行访问

- **monorepo**是一种项目代码管理方式，其优点如下：
  + 因单个仓库可管理多个项目，故可简化代码共享、版本控制、构建和部署等方面的复杂性
  + 很容易看到整个代码仓库的变化趋势，能更好的进行团队间的协作
  + 多项目代码都在一个仓库中，相同版本依赖提升到顶层，只需安装一次，节省磁盘空间

## 项目初始化

### pnpm安装

pnpm 的相关安装指南，请参考[官方文档](https://www.pnpm.cn)，这里需要注意的是 pnpm 的版本和 node 版本有兼容问题，查看文档的时候需要注意

### 创建 workspaces

在项目根目录下的 package.json 文件中新增 workspaces 属性，workspaces（工作空间） 是建立管理 monorepo 项目结构的核心步骤
```json
// package.json
"workspaces": [
  "packages/components/*",
  "packages/utils/*"
]
```
根据 workspaces 所定的工作空间，在项目根目录下创建 packages 文件夹，packages 文件下新建两个子文件夹 components 和 utils，分别用来存放组件和工具方法

基本目录结构如下：

```sh
├── package.json
└── packages
    ├── components
    │   └── cron
    │       ├── package.json
    │       ├── src
    │       │   └──index.ts
    │       └── tsconfig.json
    └── utils

```



