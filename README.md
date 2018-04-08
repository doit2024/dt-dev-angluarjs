# dt-dev-angularjs


- 电陶 angularjs 项目 dev 环境
- 热更新 + 跨域代理

> * 命令行参数
> ```
> {
>   port: '3000',
>   target: 'http://39.108.178.228:8009/',
>   mark: 'index.php',   // 依据url是否包含mark判断是否需要代理接口
>   src: 'src'           // 项目目录
> }
> ```

# 使用
> npm i -D dt-dev-angularjs

> 添加命令
> ```
> "scripts": {
>   "start": "dt-dev-angularjs -target http://39.108.178.228:8009/ -port 5000"
> },
> ```