import mongoose from 'mongoose'
import { mongoDBConfig } from './index'

const { address, port, user, pass, database } = mongoDBConfig

// 创建连接
mongoose.connect(`mongodb://${user}:${pass}@${address}:${port}/${database}?authSource=admin`, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// 连接成功
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected successful')
})

// 连接异常
mongoose.connection.on('error', () => {
  console.log('Mongoose connected error')
})

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

export default mongoose