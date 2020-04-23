import SignRecord from '@/model/mongoose/SignRecord'
import { getJWTPayload } from '@/common/Utils'
import User from '@/model/mongoose/User'
import moment from 'moment'

class UserController {
  // 用户签到接口
  async userSign(ctx) {
    // 获取用户ID
    const obj = await getJWTPayload(ctx.header.authorization)
    let user = await User.findById(obj._id)
    // 查询上一次用户签到记录
    const record = await SignRecord.findByUid(obj._id)
    let result = {}
    let newRecord

    // 判断签到逻辑
    if (record !== null) {
      // 今天已经签到
      if (moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        return ctx.body = {
          code: 200,
          favs: user.favs,
          count: user.count,
          msg: '用户已经签到'
        }
      } else {
        let count = user.count
        let fav = 0
        // 连续签到
        if (moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          count += 1
          if (count < 5) {
            fav = 5
          } else if (count >= 5 && count < 15) {
            fav = 10
          } else if (count >= 15 && count < 30) {
            fav = 15
          } else if (count >= 30 && count < 100) {
            fav = 20
          } else if (count >= 100 && count < 365) {
            fav = 30
          } else if (count >= 365) {
            fav = 50
          }

          await User.updateOne({
            _id: obj._id
          }, {
            $inc: { favs: fav, count: 1 }
          })
          console.log(1)

          result = {
            favs: user.favs + fav,
            count: user.count + 1
          }
        } else {
          // 签到中断
          fav = 5
          await User.updateOne({
            _id: obj._id
          }, {
            $set: { count: 1 },
            $inc: { favs: fav }
          })

          result = {
            favs: user.favs + fav,
            count: 1
          }
        }

        // 更新签到记录
        newRecord = new SignRecord({
          uid: obj._id,
          favs: user.favs + fav,
          lastSign: moment().format("YYYY-MM-DD")
        })
        await newRecord.save()
      }

    } else {
      // 修改签到计数 + 积分
      await User.updateOne({
        _id: obj._id
      }, {
        $set: { count: 1 }, // 连续签到一天
        $inc: { favs: 5 }
      })
      console.log(obj._id)
      // 保存用户的签到记录
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5,
        lastSign: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      await newRecord.save()
      result = {
        favs: 5,
        count: 1
      }
    }
    return ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result
    }
  }
}

export default new UserController()