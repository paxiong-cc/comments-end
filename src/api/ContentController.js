import Post from '@/model/mongoose/Post'
import Links from '../model/mongoose/Links'

class ContentController {
  // 获取评论列表
  async getPostList(ctx) {
    const body = ctx.query

    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    // const post = new Post({
    //   title: 'test',
    //   content: 'test1222',
    //   catalog: 'share1',
    //   fav: 20,
    //   isEnd: '0',
    //   reads: '0',
    //   answer: '0',
    //   status: '0',
    //   isTop: '0',
    //   sort: '0',
    //   tags: [{
    //     name: '精华',
    //     class: ''
    //   }]
    // })

    // const tmp = await post.save()
    // console.log("ContentController -> getPostList -> tmp", tmp)
    

    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }

    if (typeof body.isTop !== 'undefined') {
      options.isTop = body.isTop
    }

    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.status = body.status
    }

    // if (typeof body.isEnd !== 'undefined') {
    //   options.isEnd = body.isEnd
    // }

    if (typeof body.tags !== 'undefined' && body.tags !== '') {
      options.tags = { $elemMatch: {name: body.tags} }
    }

    const result = await Post.getList(options, sort, page, limit)

    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功'
    }
  }

  // 查询友链
  async getLinks(ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 查询温馨提示
  async getTips(ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 本周热议
  async getTopWeek(ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

export default new ContentController