import redis from 'redis'
import { promisifyAll } from 'bluebird'
import { redisConfig } from './index'

// 配置
const options = {
  host: redisConfig.host,
  port: redisConfig.port,
  password: redisConfig.password,
  detect_buffers: true,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
}

// 创建连接
const client = promisifyAll(redis.createClient(options))

const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    typeof time !== 'undefined'
      ? client.set(key, value, 'EX', time)
      : client.set(key, value)
  } else if (typeof value === 'object') {
    // 设置hash
    Object.keys(value).forEach(item => {
      client.hset(key, item, value[item], redis.print)
    })
  }

}

// 获取值
const getValue = key => {
  return client.getAsync(key)
}

// 获取hash
const getHvalue = key => {
  return client.hgetallAsync(key)
}

// 删除值
const delValue = key => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete success')
    } else {
      console.log(`delete redis key error: ${err}`)
    }
  })
}

export {
  client,
  getValue,
  setValue,
  getHvalue,
  delValue
}