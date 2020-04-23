import svgCaptcha from 'svg-captcha'
import { setValue } from '@/config/RedisConfig'
import jsonwebtoken from 'jsonwebtoken'
import { jwt_secret } from '@/config/index'
import { checkCode } from '@/common/Utils'
import User from '@/model/mongoose/User'
import SignRecord from '@/model/mongoose/SignRecord'
import bcrypt from 'bcrypt'
import moment from 'moment'


class VcodeController {
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
      height: 38,
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

    // 验证邮箱和密码
    const user = await User.findOne({email: userinfo.email})
    if (user === null || !await bcrypt.compare(userinfo.password, user.password)) {
      return ctx.body = {
        code: 404,
        msg: '用户名或密码错误'
      }
    } else {
      // 生成token
      const token = jsonwebtoken.sign({_id: user._id}, jwt_secret, {expiresIn: '1h'})
      // 获取用户信息
      const userObj = user.toJSON() // mongoose提供的user对象中的json数据，不然会夹杂其它数据
      const arr = ['password', 'roles']
      arr.forEach(item => {
        Reflect.deleteProperty(userObj, item)
      })
      // 获取签到记录
      const record = await SignRecord.findByUid(userObj._id)
      let isSign,
          getDate = moment().format('YYYY-MM-DD')
      if (record === null) {
        isSign = false
        userObj.count = 0
        await User.updateOne({
          _id: userObj._id
        }, {
          $set: { count: 0 }
        })
      } else {
        moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
          ? (isSign = true)
          : (isSign = false)
        
        // 连续签到中断，修改连续签到天数
        const recordD = moment(record.created).format('YYYY-MM-DD')
        if (moment(recordD).isBefore(moment(getDate).subtract(1, 'days'))) {
          userObj.count = 0
          await User.updateOne({
            _id: userObj._id
          }, {
            $set: { count: 0 }
          })
        }
      }
      
      ctx.body = {
        code: 200,
        data: {
          ...userObj,
          isSign,
          getDate
        },
        token
      }
    }
  }

  /* 注册 */
  async register(ctx) {
    const userinfo = ctx.request.body
    // 判断验证码
    if (await checkCode(userinfo.sid, userinfo.code)) {
      return ctx.body = {
        code: 404,
        msg: '图片验证码错误'
      }
    }

    // 判断邮箱
    if (await User.findOne({email: userinfo.email}) !== null) {
      return ctx.body = {
        code: 401,
        msg: '邮箱已注册!'
      }
    }

    // 密码加密储存
    const info = {
      email: userinfo.email,
      username: userinfo.username,
      password: await bcrypt.hash(userinfo.password, 5)
    }
    const user = new User(info)
    await user.save()
    ctx.body = {
      code: 200,
      msg: '注册成功!'
    }
  }
}

export default new VcodeController()
