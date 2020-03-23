import { getValue } from '@/config/RedisConfig'

/**
 * 校验本地验证码
 * @param {验证码标识符} sid 
 * @param {验证码} code 
 */
const checkCode = async (sid, code) => {
  // 拿到客户端对应的验证码
  const vcode = await getValue(sid)
  if (vcode === null || String(vcode).toLowerCase() !== String(code).toLowerCase()) {
    return true
  }
  return false
}

export {
  checkCode
}