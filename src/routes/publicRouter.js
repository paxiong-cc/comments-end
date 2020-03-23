import Router from 'koa-router'
import publicController from '../api/PublicController'

const router = new Router()

router.post('/forget', publicController.forget)

export default router
