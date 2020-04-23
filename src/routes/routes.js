import combineRoutes from 'koa-combine-routers'

import loginRouter from './loginRouter'
import publicRouter from './publicRouter'
import userRouter from './userRouter'

export default combineRoutes(loginRouter, publicRouter, userRouter)
