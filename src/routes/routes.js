import combineRoutes from 'koa-combine-routers'

import loginRouter from './loginRouter'
import publicRouter from './publicRouter'

export default combineRoutes(loginRouter, publicRouter)
