# liong-cli #
❌✅❎❗️❕ℹ️

# 白条 多项目 Vue 框架模板 ##

## 项目结构 ##

```
━━Vue project━━
    ┣━build
    ┃   ┣━ webpack的配置文件
    ┃   ┗━ 其他辅助文件
    ┣━config
    ┃   ┗━ 各环境基础配置文件
    ┣━docker
    ┃   ┗━ JD docker构建配置文件
    ┣━public
    ┃   ┗━ HTML 文件 (dev-server使用)
    ┣━VCM
    ┃   ┗━ Version Control Management 版本控制管理
    ┣━src
    ┃   ┣━ base
    ┃   ┃   ┗━ font 通用字体引入
    ┃   ┣━ app
    ┃   ┃   ┗━ 所有子项目的文件夹
    ┃   ┗━ server
    ┃   ┃   ┗━ http 请求方法1
    ┃   ┗━ services
    ┃   ┃   ┗━ http 请求方法2
    ┃   ┗━ utils
    ┃   ┃   ┣━ generalJSBridge 统一桥方法
    ┃   ┃   ┣━ layout 通用UI组件
    ┃   ┃   ┣━ lodash 节流/防抖
    ┃   ┃   ┣━ widget 小组件
    ┃   ┃   ┃   ┣━ masonry 瀑布流组件
    ┃   ┃   ┃   ┗━ skeleton 骨架屏组件
    ┃   ┃   ┣━ calculator 重写计算器
    ┃   ┃   ┣━ getQueryParams 从URL获取参数
    ┃   ┃   ┣━ getSDKToken 金融环境下获取风控参数
    ┃   ┃   ┣━ formRule form表单校验方法
    ┃   ┃   ┣━ getQueryParams 获取url参数方法
    ┃   ┃   ┣━ tracker 埋点方法
    ┃   ┃   ┣━ transformLink 转链方法
    ┃   ┗━  ┗━ webviewTester webview环境监测方法
    ┣━static
    ┃   ┗━ 无需构建的静态文件
    ┣━template
    ┃   ┗━ vue 项目基础模板
    ┣━  .browserslistrc
    ┣━  .editorconfig
    ┣━  .env
    ┣━  .eslintgonre
    ┣━  .eslintrc.js
    ┣━  .gitgnore
    ┣━  .prettierignore
    ┣━  .babel.config.js
    ┣━  package.json
    ┣━  postcss.config.js
    ┗━  README.md
```

## 未完成 的 插件配置 ##

```
✅ html-webpack-plugin
-- html-webpack-template
✅ remove webpack-clean-plugin这个插件 使用 node 命令删除dist文件夹 
✅ terser-webpack-plugin
✅ babel-plugin-jsx-v-model 支持 v-model 命令
```

## 不确定是否使用的插件 ##

```
-- !@babel/cli
```

## 待完成的优化配置 ##

```
-- 将所有配置参数提取到 config 文件中
-- 代码压缩配置
```

## vue + vue-router + vuex + axios 的配置

```
✅ vue
✅ vue-router
✅ vuex
✅ axios
```

## 项目依赖 安装 ##

**安装依赖**

✅ npm install

**启本地服务**

```
✅ npm run dev 【测试环境】  选择需要启动的项目
✅ npm run dev:staging 【预发环境】  选择需要启动的项目
✅ npm run dev:prod 【生产环境】  选择需要启动的项目
```

**打包项目**

```
✅ npm run build 【构建生产包】
✅ npm run build:test 【构建测试包】
✅ npm run build:staging 【构建预发包】
```

**上传项目测试环境**

✅ npm run upload 选择要上传的项目

**build后的文件合并替换release文件夹中，上线流程**

✅ npm run upload:prod 选择要上传的项目

**新建项目**

✅ npm run new:project 创建新的项目 在 src/app 文件夹内

### 重点注意 ###

```
✅ 本地调试时 接口需要配置host 改为同域名 + 同端口，80端口
✅ webpack 在配置 jsx 文件解析的时候，填写 include 属性无法编译
✅ 引入 jsx 配置后，样式引入有问题
❗️ 不能模块化引入样式，vue-style-loader 无法解析
❌ 引入 tsx 配置
✅ 测试/预发环境代码上传
✅ css-loader 升级到V6版本后导致字体包丢失的问题
```

**未来计划**

```
❗️ 工具方法的迭代完善（持续进行中）
❌ 修改 webpack 配置，基于 router 打包多个 html 文件（html-webpack-plugin）实现
❌ 将 vite 引入到项目中进行 HMR 处理，继续优化 webpack5
❌ ❌ 升级至 vue3（需要单独一套架子模板，暂时放弃因为proxy兼容需要ios10以上）❌
❌ 服务器端渲染 vs 预渲染（SSR vs Prerendering）
❌ 瀑布流 通用组件封装 兼容性良好
✅ 修改项目发布策略 每次发版合并带有上一次版本包
```

### 架子修改为 多项目架构 ###

### app 下的项目 ###

```
monthtoplay     白条超能打项目
reward_day      天天返红包
```

### utils widge ###

```
❌ masonry     瀑布流
✅ skeleton    骨架屏
```