'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize
        return queryInterface.createTable('user', {
            id: {
                type: INTEGER(20),
                primaryKey: true,
                autoIncrement: true,
            },
            wxid: {
                type: STRING(255),
                allowNull: true,
                defaultValue: '',
                comment: '微信openId',
                unique: true,
            },
            qqid: {
                type: STRING(255),
                allowNull: true,
                defaultValue: '',
                comment: 'QQopenId',
                unique: true,
            },
            wbid: {
                type: STRING(255),
                allowNull: true,    
                defaultValue: '',
                comment: '微博openId',
                unique: true,
            },
            phone: {
                type: STRING(11),
                allowNull: true,
                defaultValue: '',
                comment: '手机号',
                unique: true,
            },
            username: {
                type: STRING(30),
                allowNull: false,
                defaultValue: '',
                comment: '用户名',
                unique: true,
            },
            password: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '密码',
            },
            avatar: {
                type: STRING,
                allowNull: true,
                defaultValue: '',
                comment: '头像',
            },
            coin: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '金币',
            },
            created_time: DATE,
            updated_time: DATE,
        })
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user')
    },
}