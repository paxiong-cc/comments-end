/* 发帖表 */
import mongoose from '@/config/MongooseConfig'
import moment from 'moment'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: { type: String, ref: 'users' }, // 用户ID
  title: { type: String }, // 文章标题
  content: { type: String }, // 文章内容
  created: { type: Date }, // now()	创建时间时间
  catalog: { type: String }, // 帖子分类，index-全部，ask-提问, advise-建议, discuss-交流, share-分享, logs-动态, notice-公告
  fav: { type: String }, // 帖子积分
  isEnd: { type: String }, //	0-未结束，1-已结贴
  reads: { type: Number }, //	阅读记数
  answer: { type: Number }, //	回答记数
  status: { type: String }, // 0-打开回复，1-关闭回复
  isTop: { type: String }, // 0-未置顶，1-已置顶
  sort: { type: String }, // 0	置顶排序
  tags: {
    type: Array,
    default: [{
      name: '',
      class: ''
    }]
  } // 文章的标签, 精华，加精, etc
})

PostSchema.pre('save', function(next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} pageIndex 分页页数
   * @param {Number} pageSize 分页条数
   */
  getList: function(options, sort, pageIndex, pageSize) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(pageIndex * pageSize)
      .limit(pageSize)
  }
}

const PostModel = mongoose.model('posts', PostSchema)

export default PostModel
