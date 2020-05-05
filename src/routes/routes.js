import combineRoutes from 'koa-combine-routers'

// import loginRouter from './loginRouter'
// import publicRouter from './publicRouter'
// import userRouter from './userRouter'

// export default combineRoutes(loginRouter, publicRouter, userRouter)

// 加载目录中的Router中间件
const moduleFiles = require.context('./modules', true, /\.js$/)

// reduce方法去拼接 koa-combine-router所需的数据结构 Object[]
const modules = moduleFiles.keys().reduce((currentCollector, item) => {
  const value = moduleFiles(item)
  currentCollector.push(value.default)
  return currentCollector
}, [])

export default combineRoutes(modules)
