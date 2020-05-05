import Router from 'koa-router'
import loginController from '@/api/LoginController'

const router = new Router()

router.prefix('/login')
router.get('/getCaptcha', loginController.getCaptcha)
router.post('/login', loginController.login)
router.post('/register', loginController.register)

export default router
