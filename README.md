# liong-cli ##

## 未完成 的 插件配置 ##

✅ html-webpack-plugin
-- html-webpack-template
✅ remove webpack-clean-plugin这个插件 使用 node 命令删除dist文件夹 
✅ terser-webpack-plugin

## 不确定是否使用的插件 ##

-- !@babel/cli

## 待完成的优化配置 ##

-- 将所有配置参数提取到 config 文件中
-- 代码压缩配置

## vue + vue-router + vuex + axios 的配置

✅ vue
✅ vue-router
✅ vuex
✅ axios

## 项目依赖 安装 ##

npm install

npm run dev

npm run build

### 重点注意 ###

❎ 本地调试时 接口需要配置host 改为同域名 + 同端口
❎ postcss-loader v3.0.0版本有bug 不能使用

### 架子修改为 多项目架构 ###
新增 npm run d **** / npm run b **** / npm run b:test **** 命令

例如:    npm run d merchant-bd  本地启动 merchant-bd 项目
        npm run b merchant-bd  构建 merchant-bd 项目生产环境
        npm run b:test merchant-bd 构建 merchant-bd 项目测试环境