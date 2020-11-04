'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
    const { router, controller, io } = app
    router.get('/', controller.home.index)
    // 用户注册
    router.post('/api/reg', controller.api.user.reg)
    // 用户登录
    router.post('/api/login', controller.api.user.login)
    // 第三方登录
    router.post('/api/otherlogin', controller.api.user.otherLogin)
    // 创建直播间
    router.post('/api/live/create', controller.api.live.save)
    // 退出登录
    router.post('/api/logout', controller.api.user.logout)
    // 获取用户信息
    router.get('/api/user/info', controller.api.user.info)
    // 修改直播间状态
    router.post('/api/live/changestatus', controller.api.live.changeStatus)
    // 直播间列表
    router.get('/api/live/list/:page', controller.api.live.list)
    // 查看指定直播间
    router.get('/api/live/read/:id', controller.api.live.read)
    // 手机验证码登录
    router.post('/api/phoneLogin', controller.api.user.phoneLogin)
    // 发送手机验证码
    router.post('/api/sendcode', controller.api.sms.sendCode)
    // socket 路由配置测试
    io.of('/').route('joinLive', io.controller.nsp.joinLive)
    io.of('/').route('leaveLive', io.controller.nsp.leaveLive)
}