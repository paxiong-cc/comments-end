import svgCaptcha from 'svg-captcha'
import { setValue } from '@/config/RedisConfig'
import jsonwebtoken from 'jsonwebtoken'
import { jwt_secret } from '@/config/index'
import { checkCode } from '@/common/Utils'
import User from '@/model/mongo/user/model'


class VcodeController {
  constructor() {}
  /* 获取验证码 */ 
  async getCaptcha(ctx) {
    // 获取客户端对应的唯一值
    const sid = ctx.request.query.sid
    // 获取图形验证码
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 40,
    })

    // 添加到redis中
    setValue(sid, newCaptca.text, 5 * 60)

    ctx.body = {
      code: 200,
      data: newCaptca.data,
    }
  }

  /* 登录 */
  async login(ctx) {
    const userinfo = ctx.request.body
    // 验证验证码
    if (await checkCode(userinfo.sid, userinfo.code)) {
      return ctx.body = {
        code: 404,
        msg: '图片验证码错误'
      }
    }

    // 验证账号和密码
    const user = await User.findOne({email: userinfo.email})
    if (user === null || user.password !== userinfo.password) {
      return ctx.body = {
        code: 404,
        msg: '用户或密码错误'
      }
    } else {
      // 生成token
      const token = jsonwebtoken.sign({username: userinfo.username}, jwt_secret, {expiresIn: '1h'})
  
      ctx.body = {
        code: 200,
        token
      }
    }
  }
}

export default new VcodeController()
