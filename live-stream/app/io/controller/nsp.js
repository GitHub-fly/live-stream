'use strict'

const await = require('await-stream-ready/lib/await')

const Controller = require('egg').Controller

class NspController extends Controller {
    /**
     * 验证用户 token
     * @param {*} token
     */
    async checkToken(token) {
        const { ctx, app, service, helper } = this
        // 当前连接
        const socket = ctx.socket
        const id = socket.id

        // 用户验证
        if (!token) {
            // 通知前端，您有没有访问接口的权限
            socket.emit(
                id,
                ctx.helper.parseMsg('error', '您没有权限访问该接口'),
            )
            return false
        }

        // 根据 token 解密，换取用户信息
        let user = {}
        try {
            user = ctx.checkToken(token)
        } catch (error) {
            let fail =
                error.name === 'TokenExpiredError'
                    ? 'token 已过期！请重新获取令牌'
                    : 'Token 令牌不合法！'
            socket.emit(id, ctx.helper.parseMsg('error', fail))
            return false
        }
        // 判断用户是否登录
        let t = await ctx.service.cache.get('user_' + user.id)
        if (!t || t !== token) {
            socket.emit(id, ctx.helper.parseMsg('error', 'Token 令牌不合法！'))
            return false
        }

        // 判断用户是否存在
        user = await app.model.User.findOne({
            where: {
                id: user.id,
            },
        })
        if (!user) {
            socket.emit(id, ctx.helper.parseMsg('error', '用户不存在'))
            return false
        }

        return user
    }
    /**
     * 进入直播间
     */
    async joinLive() {
        const { ctx, app, service, helper } = this
        const nsp = app.io.of('/')
        // 接收参数
        const message = ctx.args[0] || {}

        // 当前连接
        const socket = ctx.socket
        const id = socket.id

        let { live_id, token } = message
        // 验证用户 token
        let user = await this.checkToken(token)
        if (!user) {
            return
        }
        // 验证当前直播间是否存在或是否处于直播中
        let msg = await service.live.checkStatus(live_id)

        if (msg) {
            socket.emit(id, ctx.helper.parseMsg('error', msg))
            return
        }

        const room = 'live_' + live_id
        // 用户加入房间
        socket.join(room)
        const rooms = [room]
        // 加入 redis 存储中
        let list = await service.cache.get('userList_' + room)
        list = list ? list : []
        list = list.filter((item) => item.id !== user.id)
        list.unshift({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
        })
        console.log('>>>>>>>>>>>>>>>>>>>>>>list:')
        console.log(list)
        service.cache.set('userList_' + room, list)

        // 更新在线用户列表
        nsp.adapter.clients(rooms, (err, clients) => {
            nsp.to(room).emit('online', {
                clients,
                action: 'join',
                user: {
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                },
                data: list,
            })
        })
        // 加入播放历史记录
        let liveUser = await app.model.LiveUser.findOne({
            where: {
                user_id: user.id,
                live_id,
            },
        })
        if (!liveUser) {
            app.model.LiveUser.create({
                user_id: user.id,
                live_id,
            })
            // 总观看人数 +1
            let live = await service.live.exist(live_id)
            if (live) {
                live.increment({
                    look_count: 1,
                })
            }
        }
    }

    /**
     * 离开直播间
     */
    async leaveLive() {
        const { ctx, app, service, helper } = this
        const nsp = app.io.of('/')
        // 接收参数
        const message = ctx.args[0] || {}

        // 当前连接
        const socket = ctx.socket
        const id = socket.id

        let { live_id, token } = message

        // 验证用户 token
        let user = await this.checkToken(token)
        if (!user) {
            return
        }

        // 验证当前直播间是否存在或是否处于直播中
        let msg = await service.live.checkStatus(live_id)
        if (msg) {
            socket.emit(
                id,
                ctx.helper.parseMsg('error', msg, {
                    notoast: true,
                }),
            )
            return
        }

        const room = 'live_' + live_id
        // 用户离开房间
        socket.leave(room)
        const rooms = [room]

        // 更新在线用户列表
        nsp.adapter.clients(rooms, (err, clients) => {
            nsp.to(room).emit('online', {
                clients,
                action: 'leave',
                user: {
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                },
            })
        })

        // 更新 redis 存储
        let list = await service.cache.get('userList_' + room)
        if (list) {
            list = list.filter((item) => item.id !== user.id)
            service.cache.set('userList_' + room, list)
        }
        console.log(list)
    }
}
module.exports = NspController