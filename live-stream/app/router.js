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
    router.get('/api/gift/list', controller.api.gift.list)

    // 后台相关路由配置

    //dashbord首页
    router.get('/admin', controller.admin.home.index)
    //管理员登录路由
    router.get('/admin/login', controller.admin.home.login)
    //登出路由
    router.get('/admin/logout', controller.admin.home.logout)
    //登录登出接口
    router.post('/admin/loginevent', controller.admin.home.loginevent)
    //管理员模块列表路由
    router.get('/admin/manager', controller.admin.manager.index)
    //创建管理员页面路由
    router.get('/admin/manager/create', controller.admin.manager.create)
    //新增管理员接口
    router.post('/admin/manager', controller.admin.manager.save)

    io.of('/').route('joinLive', io.controller.nsp.joinLive)
    io.of('/').route('leaveLive', io.controller.nsp.leaveLive)
    io.of('/').route('comment', io.controller.nsp.comment)
    io.of('/').route('gift', io.controller.nsp.gift)
}
