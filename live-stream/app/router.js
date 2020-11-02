'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
    const { router, controller } = app
    router.get('/', controller.home.index)
    // 用户注册
    router.post('/api/reg', controller.api.user.reg)
    // 用户登录
    router.post('/api/login', controller.api.user.login)
    // 创建直播间
    router.post('/api/live/create', controller.api.live.save)
    // 退出登录
    router.post('/api/logout', controller.api.user.logout)
    // 获取用户信息
    router.post('/api/user/info', controller.api.user.info)
    // 修改直播间状态
    router.post('/api/live/changestatus', controller.api.live.changeStatus)
    // 直播间列表
    router.post('/api/live/list/:page', controller.api.live.list)
}
