import { Router } from 'express'
import { getLoginController, postLoginController,postRegisterController } from '../controlador/login.js'

const routerLogin = new Router()

routerLogin.get('/', getLoginController)
routerLogin.post('/register',postRegisterController)

routerLogin.post('/', passport.authenticate("local",{failureRedirect: "login-error" }), postLoginController)

export default routerLogin
