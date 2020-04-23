import Koa from 'koa'
import path from 'path'
import helmet from 'koa-helmet'
import statics from 'koa-static'
import router from './routes/routes'
import koaBody from 'koa-body'
import jsonutil from 'koa-json'
import cors from '@koa/cors'
import compose from 'koa-compose'
import compress from 'koa-compress'
import JWT from 'koa-jwt'
import { jwt_secret } from './config/index'
import ErrorHandle from './common/ErrorHandle'

const app = new Koa()

const isDevMode = process.env.NODE_ENV !== 'production'

// 不使用鉴权
const jwt = JWT({ secret: jwt_secret }).unless({ path: [/^\/public/, /^\/login/] })

/**
 * 使用koa-compose 集成中间件
 */
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../public')), // http://localhost:3000/img/paxiong.jpg
  cors({
    origin: 'http://localhost:8080', // 前端地址
    credentials: true
  }),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet(),
  ErrorHandle,
  jwt
])

if (!isDevMode) {
  app.use(compress())
}

app.use(middleware)
app.use(router())

app.listen(3000)
